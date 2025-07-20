// Configuration
const CONFIG = {
  ADMIN_USERNAME: "Minarul5454",
  ADMIN_PASSWORD: "Minarul5454",
  MAX_VIDEO_SIZE: 200 * 1024 * 1024, // 200MB
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/webm", "video/ogg"]
};

// DOM Elements
const elements = {
  loginForm: document.getElementById("loginForm"),
  videoUpload: document.getElementById("videoUpload"),
  uploadArea: document.getElementById("uploadArea"),
  uploadProgress: document.getElementById("uploadProgress"),
  progressBar: document.getElementById("progressBar"),
  videoTitle: document.getElementById("videoTitle"),
  videoContainer: document.getElementById("videoContainer"),
  adminVideoContainer: document.getElementById("adminVideoContainer"),
  credentialsList: document.getElementById("credentialsList"),
  passwordsModal: document.getElementById("passwordsModal"),
  menuBtn: document.getElementById("menuBtn"),
  dropdownMenu: document.getElementById("dropdownMenu")
};

// State Management
let state = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  isAdmin: localStorage.getItem("isAdmin") === "true",
  currentUser: localStorage.getItem("currentUser") || null,
  videos: JSON.parse(localStorage.getItem("videos") || []),
  users: JSON.parse(localStorage.getItem("users") || [])
};

// Initialize App
function init() {
  checkAuth();
  setupEventListeners();
  loadVideos();
}

// Authentication Functions
function checkAuth() {
  if (!state.isLoggedIn && window.location.pathname.includes("admin.html")) {
    window.location.href = "login.html";
  }
}

function login(username, password) {
  // Admin login
  if (username === CONFIG.ADMIN_USERNAME && password === CONFIG.ADMIN_PASSWORD) {
    state.isAdmin = true;
    state.isLoggedIn = true;
    state.currentUser = "admin";
    saveState();
    window.location.href = "admin.html";
    return true;
  }

  // User login
  const userExists = state.users.some(user => user.username === username && user.password === password);
  
  if (userExists || username.includes("@")) {
    state.isLoggedIn = true;
    state.currentUser = username;
    
    // Save new user if not exists
    if (!userExists) {
      state.users.push({ username, password });
    }
    
    saveState();
    window.location.href = "index.html";
    return true;
  }

  return false;
}

function logout() {
  state.isLoggedIn = false;
  state.isAdmin = false;
  state.currentUser = null;
  saveState();
  window.location.href = "login.html";
}

// Video Functions
function uploadVideo() {
  if (!state.isAdmin) {
    showAlert("Admin access required", "error");
    return;
  }

  const file = elements.videoUpload.files[0];
  const title = elements.videoTitle.value.trim() || file.name.replace(/\.[^/.]+$/, "");

  if (!file) {
    showAlert("Please select a video file", "error");
    return;
  }

  if (!CONFIG.ALLOWED_VIDEO_TYPES.includes(file.type)) {
    showAlert("Invalid file type. Only MP4, WebM or OGG videos are allowed.", "error");
    return;
  }

  if (file.size > CONFIG.MAX_VIDEO_SIZE) {
    showAlert(`File size exceeds ${CONFIG.MAX_VIDEO_SIZE / (1024 * 1024)}MB limit`, "error");
    return;
  }

  // Show upload progress
  elements.uploadProgress.style.display = "block";
  elements.progressBar.style.width = "0%";

  // Simulate upload progress
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress > 90) clearInterval(progressInterval);
    elements.progressBar.style.width = `${progress}%`;
  }, 200);

  const reader = new FileReader();
  reader.onload = function(e) {
    clearInterval(progressInterval);
    elements.progressBar.style.width = "100%";
    
    setTimeout(() => {
      const videoData = {
        id: Date.now().toString(),
        title,
        filename: file.name,
        data: e.target.result.split(",")[1],
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        likes: 0,
        comments: [],
        views: 0
      };

      state.videos.push(videoData);
      saveState();
      loadVideos();
      
      // Reset form
      elements.videoUpload.value = "";
      elements.videoTitle.value = "";
      elements.uploadProgress.style.display = "none";
      
      showAlert("Video uploaded successfully!", "success");
    }, 500);
  };
  reader.readAsDataURL(file);
}

function deleteVideo(videoId) {
  if (!state.isAdmin) return;
  
  state.videos = state.videos.filter(video => video.id !== videoId);
  saveState();
  loadVideos();
  showAlert("Video deleted successfully", "success");
}

function loadVideos() {
  // Public page
  if (elements.videoContainer) {
    elements.videoContainer.innerHTML = "";
    
    if (!state.isLoggedIn) {
      elements.videoContainer.innerHTML = `
        <div class="login-prompt">
          <i class="fas fa-lock"></i>
          <h3>Please login to view videos</h3>
          <button onclick="window.location.href='login.html'" class="login-btn">
            <i class="fas fa-sign-in-alt"></i> Login Now
          </button>
        </div>
      `;
      return;
    }
    
    if (state.videos.length === 0) {
      elements.videoContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-video-slash"></i>
          <h3>No videos available yet</h3>
          ${state.isAdmin ? `<p>Upload your first video from the admin panel</p>` : ''}
        </div>
      `;
      return;
    }
    
    state.videos.forEach(video => {
      const videoCard = createVideoCard(video, false);
      elements.videoContainer.appendChild(videoCard);
    });
  }
  
  // Admin page
  if (elements.adminVideoContainer) {
    elements.adminVideoContainer.innerHTML = "";
    
    if (state.videos.length === 0) {
      elements.adminVideoContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-video-slash"></i>
          <h3>No videos uploaded yet</h3>
          <p>Upload your first video using the form above</p>
        </div>
      `;
      return;
    }
    
    state.videos.forEach(video => {
      const videoCard = createVideoCard(video, true);
      elements.adminVideoContainer.appendChild(videoCard);
    });
  }
}

function createVideoCard(video, isAdmin) {
  const card = document.createElement("div");
  card.className = "video-card";
  card.dataset.id = video.id;
  
  const uploadDate = new Date(video.uploadDate).toLocaleDateString();
  const sizeInMB = (video.size / (1024 * 1024)).toFixed(2);
  
  card.innerHTML = `
    <div class="video-thumbnail">
      <video src="data:${video.type};base64,${video.data}" poster="assets/images/video-thumbnail.jpg"></video>
      <div class="video-overlay">
        <button class="play-btn"><i class="fas fa-play"></i></button>
      </div>
    </div>
    <div class="video-info">
      <h3 class="video-title">${video.title}</h3>
      <div class="video-meta">
        <span><i class="fas fa-calendar-alt"></i> ${uploadDate}</span>
        <span><i class="fas fa-file-alt"></i> ${sizeInMB} MB</span>
        ${isAdmin ? `<span><i class="fas fa-eye"></i> ${video.views} views</span>` : ''}
      </div>
      <div class="video-actions">
        <button class="action-btn like-btn">
          <i class="fas fa-thumbs-up"></i> ${video.likes}
        </button>
        <button class="action-btn comment-btn">
          <i class="fas fa-comment"></i> ${video.comments.length}
        </button>
        <button class="action-btn share-btn" onclick="shareVideo('${video.id}')">
          <i class="fas fa-share-alt"></i> Share
        </button>
        ${isAdmin ? `
        <button class="action-btn delete-btn" onclick="deleteVideo('${video.id}')">
          <i class="fas fa-trash"></i> Delete
        </button>
        ` : ''}
      </div>
    </div>
  `;
  
  return card;
}

// Password Vault Functions
function showPasswords() {
  if (!state.isAdmin) return;
  
  elements.credentialsList.innerHTML = "";
  
  if (state.users.length === 0) {
    elements.credentialsList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-user-slash"></i>
        <h3>No user credentials saved yet</h3>
      </div>
    `;
  } else {
    state.users.forEach(user => {
      const credentialItem = document.createElement("div");
      credentialItem.className = "credential-item";
      credentialItem.innerHTML = `
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Password:</strong> ${user.password}</p>
        <p class="timestamp">Saved on: ${new Date().toLocaleString()}</p>
      `;
      elements.credentialsList.appendChild(credentialItem);
    });
  }
  
  elements.passwordsModal.style.display = "flex";
}

// Utility Functions
function saveState() {
  localStorage.setItem("isLoggedIn", state.isLoggedIn);
  localStorage.setItem("isAdmin", state.isAdmin);
  localStorage.setItem("currentUser", state.currentUser);
  localStorage.setItem("videos", JSON.stringify(state.videos));
  localStorage.setItem("users", JSON.stringify(state.users));
}

function showAlert(message, type = "info") {
  const alert = document.createElement("div");
  alert.className = `alert ${type}`;
  alert.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">&times;</button>
  `;
  document.body.appendChild(alert);
  
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

function shareVideo(videoId) {
  const video = state.videos.find(v => v.id === videoId);
  if (!video) return;
  
  const shareUrl = `${window.location.origin}${window.location.pathname}?video=${videoId}`;
  
  if (navigator.share) {
    navigator.share({
      title: video.title,
      text: "Check out this viral video!",
      url: shareUrl
    }).catch(err => {
      console.log("Error sharing:", err);
      copyToClipboard(shareUrl);
    });
  } else {
    copyToClipboard(shareUrl);
    showAlert("Link copied to clipboard!", "success");
  }
}

function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function closeModal() {
  elements.passwordsModal.style.display = "none";
}

// Event Listeners
function setupEventListeners() {
  // Login form
  if (elements.loginForm) {
    elements.loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      
      if (login(username, password)) {
        showAlert("Login successful!", "success");
      } else {
        showAlert("Invalid credentials", "error");
      }
    });
  }
  
  // File upload
  if (elements.uploadArea) {
    elements.uploadArea.addEventListener("click", () => elements.videoUpload.click());
    
    elements.videoUpload.addEventListener("change", function() {
      if (this.files.length > 0) {
        const file = this.files[0];
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        elements.videoTitle.value = fileName;
      }
    });
    
    // Drag and drop
    elements.uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      elements.uploadArea.classList.add("dragover");
    });
    
    elements.uploadArea.addEventListener("dragleave", () => {
      elements.uploadArea.classList.remove("dragover");
    });
    
    elements.uploadArea.addEventListener("drop", (e) => {
      e.preventDefault();
      elements.uploadArea.classList.remove("dragover");
      
      if (e.dataTransfer.files.length > 0) {
        elements.videoUpload.files = e.dataTransfer.files;
        const file = elements.videoUpload.files[0];
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        elements.videoTitle.value = fileName;
      }
    });
  }
  
  // Admin menu
  if (elements.menuBtn) {
    elements.menuBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      elements.dropdownMenu.classList.toggle("show");
    });
    
    window.addEventListener("click", function() {
      elements.dropdownMenu.classList.remove("show");
    });
  }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", init);
