// Authentication System
const ADMIN_CREDENTIALS = {
  username: "Minarul5454",
  password: "Minarul5454"
};

// Video Data Structure
let videos = JSON.parse(localStorage.getItem('videos')) || [];

// Check Authentication
function checkAuth() {
  return localStorage.getItem('isLoggedIn') === 'true';
}

// Login Function
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  // Admin login
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'admin.html';
    return;
  }
  
  // Regular user login
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  users.push({ username, password });
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('currentUser', username);
  window.location.href = 'index.html';
});

// Enhanced Video Upload
async function uploadVideo() {
  if (!checkAuth() || localStorage.getItem('isAdmin') !== 'true') {
    alert('Admin access required');
    return;
  }

  const input = document.getElementById('videoUpload');
  const titleInput = document.getElementById('videoTitle');
  
  if (!input.files[0] || !titleInput.value) {
    alert('Please select a video and enter a title');
    return;
  }

  const file = input.files[0];
  const title = titleInput.value;
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  
  if (!validTypes.includes(file.type)) {
    alert('Only MP4, WebM, or OGG videos allowed');
    return;
  }

  if (file.size > 200 * 1024 * 1024) {
    alert('File size exceeds 200MB limit');
    return;
  }

  try {
    const reader = new FileReader();
    reader.onload = function(e) {
      const videoData = {
        id: Date.now(),
        title: title,
        data: e.target.result.split(',')[1],
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: [],
        shares: 0
      };
      
      videos.push(videoData);
      localStorage.setItem('videos', JSON.stringify(videos));
      loadVideos();
      alert('Video uploaded successfully!');
      
      // Reset form
      input.value = '';
      titleInput.value = '';
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error("Upload error:", error);
    alert("Upload failed: " + error.message);
  }
}

// Delete Video Function
function deleteVideo(videoId) {
  if (confirm('Are you sure you want to delete this video?')) {
    videos = videos.filter(video => video.id !== videoId);
    localStorage.setItem('videos', JSON.stringify(videos));
    loadVideos();
  }
}

// Like Video Function
function likeVideo(videoId) {
  const video = videos.find(v => v.id === videoId);
  if (video) {
    video.likes++;
    localStorage.setItem('videos', JSON.stringify(videos));
    loadVideos();
  }
}

// Share Video Function
function shareVideo(videoId) {
  const video = videos.find(v => v.id === videoId);
  if (video) {
    video.shares++;
    localStorage.setItem('videos', JSON.stringify(videos));
    
    // Create shareable link
    const shareLink = `${window.location.origin}/index.html?video=${videoId}`;
    navigator.clipboard.writeText(shareLink)
      .then(() => alert('Link copied to clipboard!'))
      .catch(() => prompt('Copy this link:', shareLink));
  }
}

// Load Videos with Enhanced Features
function loadVideos() {
  const publicContainer = document.getElementById('videoContainer');
  const adminContainer = document.getElementById('adminVideoContainer');
  
  // Public View
  if (publicContainer) {
    publicContainer.innerHTML = '';
    
    if (!checkAuth()) {
      publicContainer.innerHTML = `
        <div class="placeholder">
          <i class="fas fa-lock"></i>
          <p>Please login to watch videos</p>
        </div>
      `;
      return;
    }
    
    if (videos.length === 0) {
      publicContainer.innerHTML = '<p class="no-videos">No videos available yet</p>';
      return;
    }
    
    videos.forEach(video => {
      const videoElement = document.createElement('div');
      videoElement.className = 'video-item';
      videoElement.innerHTML = `
        <h3>${video.title}</h3>
        <video controls src="data:video/mp4;base64,${video.data}"></video>
        <div class="video-actions">
          <button onclick="likeVideo(${video.id})">
            <i class="fas fa-thumbs-up"></i> ${video.likes}
          </button>
          <button>
            <i class="fas fa-comment"></i> Comment
          </button>
          <button onclick="shareVideo(${video.id})">
            <i class="fas fa-share"></i> Share
          </button>
        </div>
      `;
      publicContainer.appendChild(videoElement);
    });
  }
  
  // Admin View
  if (adminContainer) {
    adminContainer.innerHTML = '';
    
    videos.forEach(video => {
      const videoElement = document.createElement('div');
      videoElement.className = 'video-item';
      videoElement.innerHTML = `
        <h3>${video.title}</h3>
        <p class="upload-date">Uploaded: ${new Date(video.timestamp).toLocaleString()}</p>
        <video controls src="data:video/mp4;base64,${video.data}"></video>
        <div class="video-stats">
          <span><i class="fas fa-thumbs-up"></i> ${video.likes}</span>
          <span><i class="fas fa-share"></i> ${video.shares}</span>
        </div>
        <button class="delete-btn" onclick="deleteVideo(${video.id})">
          <i class="fas fa-trash"></i> Delete
        </button>
      `;
      adminContainer.appendChild(videoElement);
    });
  }
}

// Password Folder Functions
function showPasswords() {
  const modal = document.getElementById('passwordsModal');
  const list = document.getElementById('credentialsList');
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  list.innerHTML = '';
  
  if (users.length === 0) {
    list.innerHTML = '<p>No user credentials found</p>';
  } else {
    users.forEach(user => {
      const div = document.createElement('div');
      div.className = 'credential-item';
      div.innerHTML = `
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Password:</strong> ${user.password}</p>
        <hr>
      `;
      list.appendChild(div);
    });
  }
  
  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('passwordsModal').style.display = 'none';
}

// Logout Function
function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// Initialize the application
window.onload = function() {
  // Check for shared video in URL
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('video');
  
  if (videoId) {
    const video = videos.find(v => v.id === Number(videoId));
    if (video) {
      // Scroll to video if found
      setTimeout(() => {
        const element = document.querySelector(`[data-video-id="${videoId}"]`);
        if (element) element.scrollIntoView();
      }, 500);
    }
  }
  
  // Load videos
  loadVideos();
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target === document.getElementById('passwordsModal')) {
      closeModal();
    }
  });
};
