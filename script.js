// User Authentication
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const users = JSON.parse(localStorage.getItem('users')) || [];
const videos = JSON.parse(localStorage.getItem('videos')) || [];

// Check authentication on page load
window.onload = function() {
  // For index.html
  if (document.getElementById('loginBtn')) {
    if (currentUser) {
      document.getElementById('loginBtn').textContent = currentUser.email;
      loadPublicVideos();
    }
  }
  
  // For admin.html
  if (document.body.classList.contains('admin-page')) {
    if (!currentUser || !currentUser.isAdmin) {
      alert('Admin access only');
      location.href = 'login.html';
    } else {
      loadAdminVideos();
      loadCredentials();
    }
  }
  
  // For login.html - redirect if already logged in
  if (document.body.classList.contains('login-page') && currentUser) {
    location.href = currentUser.isAdmin ? 'admin.html' : 'index.html';
  }
};

// Login function
function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  if (!email || !password) {
    alert('Please enter both email and password');
    return;
  }
  
  // Simple admin check (in real app, use proper authentication)
  const isAdmin = email === 'admin@viralvideos.com' && password === 'admin123';
  
  const user = {
    email,
    isAdmin
  };
  
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  // Store credentials (for demo only - not secure!)
  const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
  storedUsers.push({email, password});
  localStorage.setItem('users', JSON.stringify(storedUsers));
  
  location.href = isAdmin ? 'admin.html' : 'index.html';
}

// Logout function
function logout() {
  localStorage.removeItem('currentUser');
  location.href = 'login.html';
}

// Video Upload
function uploadVideo() {
  const input = document.getElementById('videoUpload');
  if (!input.files[0]) return alert('No file selected.');
  
  const file = input.files[0];
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  if (!validTypes.includes(file.type)) {
    return alert('Invalid file type. Only MP4, WebM, or OGG allowed.');
  }
  
  if (file.size > 200 * 1024 * 1024) {
    return alert('File exceeds 200MB limit.');
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const newVideo = {
      id: Date.now(),
      name: file.name,
      data: e.target.result.split(',')[1],
      uploadDate: new Date().toLocaleDateString()
    };
    
    videos.push(newVideo);
    localStorage.setItem('videos', JSON.stringify(videos));
    alert('Video uploaded successfully!');
    loadAdminVideos();
  };
  reader.readAsDataURL(file);
}

// Load videos in admin panel
function loadAdminVideos() {
  const container = document.getElementById('adminVideoContainer');
  if (!container) return;
  
  container.innerHTML = videos.length ? '' : '<p>No videos uploaded yet.</p>';
  
  videos.forEach(video => {
    const videoElement = document.createElement('div');
    videoElement.className = 'video-item';
    videoElement.innerHTML = `
      <h3>${video.name} (${video.uploadDate})</h3>
      <video controls width="400" src="data:video/mp4;base64,${video.data}"></video>
      <button onclick="deleteVideo(${video.id})">Delete</button>
    `;
    container.appendChild(videoElement);
  });
}

// Load videos in public page
function loadPublicVideos() {
  const container = document.getElementById('videoContainer');
  if (!container) return;
  
  container.innerHTML = videos.length ? '' : '<p>No videos available yet.</p>';
  
  videos.forEach(video => {
    const videoElement = document.createElement('div');
    videoElement.className = 'video-item';
    videoElement.innerHTML = `
      <div class="video-header">
        <h3>${video.name}</h3>
        <span class="upload-date">${video.uploadDate}</span>
      </div>
      <video controls width="100%" src="data:video/mp4;base64,${video.data}"></video>
      <div class="video-actions">
        <button class="like-btn">Like</button>
        <button class="share-btn">Share</button>
      </div>
    `;
    container.appendChild(videoElement);
  });
}

// Load user credentials (admin only)
function loadCredentials() {
  const container = document.getElementById('credentialsList');
  if (!container) return;
  
  const users = JSON.parse(localStorage.getItem('users')) || [];
  container.innerHTML = users.length ? '' : '<p>No login data yet.</p>';
  
  users.forEach(user => {
    const userElement = document.createElement('div');
    userElement.className = 'credential-item';
    userElement.innerHTML = `
      <strong>${user.email}</strong>
      <p>${user.password}</p>
      <hr>
    `;
    container.appendChild(userElement);
  });
}

// Delete video (admin only)
function deleteVideo(id) {
  if (!confirm('Are you sure you want to delete this video?')) return;
  
  const index = videos.findIndex(v => v.id === id);
  if (index !== -1) {
    videos.splice(index, 1);
    localStorage.setItem('videos', JSON.stringify(videos));
    loadAdminVideos();
  }
}
