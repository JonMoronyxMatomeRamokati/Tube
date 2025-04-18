// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD20uQ0D8v4fm2I_oO_JC0Xk1ZoWdq9iH0",
  authDomain: "codetube-74a68.firebaseapp.com",
  databaseURL: "https://codetube-74a68-default-rtdb.firebaseio.com",
  projectId: "codetube-74a68",
  storageBucket: "codetube-74a68.appspot.com",
  messagingSenderId: "62166911074",
  appId: "1:62166911074:web:81f70fc6175f58605d693b"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

function addVideo() {
  const title = document.getElementById('videoTitle').value.trim();
  const url = document.getElementById('videoURL').value.trim();
  if (title && url.includes("youtube.com")) {
    const videoID = url.split("v=")[1]?.split("&")[0];
    db.collection("videos").add({ title, type: "youtube", videoID });
    document.getElementById('videoTitle').value = '';
    document.getElementById('videoURL').value = '';
  } else {
    alert("Enter a valid YouTube link and title.");
  }
}

function uploadFile() {
  const file = document.getElementById('videoFile').files[0];
  if (file) {
    const storageRef = storage.ref('videos/' + file.name);
    storageRef.put(file).then(snapshot => {
      storageRef.getDownloadURL().then(url => {
        const title = prompt("Enter a title for your video:");
        if (title) {
          db.collection("videos").add({ title, type: "file", url });
        }
      });
    });
  }
}

db.collection("videos").onSnapshot(snapshot => {
  const videoList = document.getElementById('videos');
  videoList.innerHTML = '';
  snapshot.forEach(doc => {
    const video = doc.data();
    const card = document.createElement('div');
    card.className = 'video-card';

    if (video.type === "youtube") {
      card.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${video.videoID}" allowfullscreen></iframe>
        <p>${video.title}</p>
        <div class="comments">
          <h4>Comments</h4>
          <div class="comment-list" id="comments-${doc.id}"></div>
          <input type="text" class="comment-input" placeholder="Write a comment..." id="comment-${doc.id}">
          <button class="comment-btn" onclick="addComment('${doc.id}')">Post</button>
        </div>
      `;
    } else {
      card.innerHTML = `
        <video controls src="${video.url}"></video>
        <p>${video.title}</p>
        <div class="comments">
          <h4>Comments</h4>
          <div class="comment-list" id="comments-${doc.id}"></div>
          <input type="text" class="comment-input" placeholder="Write a comment..." id="comment-${doc.id}">
          <button class="comment-btn" onclick="addComment('${doc.id}')">Post</button>
        </div>
      `;
    }

    videoList.prepend(card);
    loadComments(doc.id);
  });
});

function addComment(videoID) {
  const commentInput = document.getElementById(`comment-${videoID}`);
  const text = commentInput.value.trim();
  if (text) {
    db.collection("videos").doc(videoID).collection("comments").add({ text });
    commentInput.value = '';
  }
}

function loadComments(videoID) {
  const commentList = document.getElementById(`comments-${videoID}`);
  db.collection("videos").doc(videoID).collection("comments").onSnapshot(snapshot => {
    commentList.innerHTML = '';
    snapshot.forEach(doc => {
      const comment = doc.data();
      const p = document.createElement('p');
      p.textContent = comment.text;
      commentList.appendChild(p);
    });
  });
}
