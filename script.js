document.querySelector('input[type="file"]').addEventListener('change', function() {
  alert("Video selected! Upload feature coming soon.");
});
// Save a new comment
document.getElementById("submitComment").addEventListener("click", function() {
  const commentText = document.getElementById("commentInput").value;
  if (commentText.trim() !== "") {
    const commentRef = database.ref('comments');
    commentRef.push({
      text: commentText,
      timestamp: new Date().toISOString()
    });
    document.getElementById("commentInput").value = "";
  }
});

// Load existing comments in real-time
const commentList = document.getElementById("commentList");
database.ref('comments').on('child_added', function(data) {
  const comment = data.val();
  const commentElement = document.createElement("p");
  commentElement.textContent = comment.text;
  commentList.appendChild(commentElement);
});
