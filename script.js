// Authentication System
const ADMIN_CREDENTIALS = {
  username: "Minarul5454",
  password: "Minarul5454"
};

// Check if user is logged in
function checkAuth() {
  return localStorage.getItem('isLoggedIn') === 'true';
}

// Login Function
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  // Check admin login
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'admin.html';
    return;
  }
  
  // Regular user login
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userExists = users.some(user => user.username === username && user.password === password);
  
  if (userExists) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', username);
    window.location.href = 'index.html';
  } else {
    // Save new user credentials
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', username);
    window.location.href = 'index.html';
  }
});

// Video Upload System
function uploadVideo() {
  if (!checkAuth() || localStorage.getItem('isAdmin') !== 'true') {
    alert('Admin access required');
    return;
  }

  const input = document.getElementById('videoUpload');
  if (!input.files[0]) {
    alert('Please select a video file');
    return;
  }

  const file = input.files[0];
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  
  if (!validTypes.includes(file.type)) {
    alert('Invalid file type. Only MP4, WebM, or OGG videos are allowed.');
    return;
  }

  if (file.size > 200 * 1024 * 1024) {
    alert('File size exceeds 200MB limit');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const videos = JSON.parse(localStorage.getItem('videos') || '[]');
    videos.push({
      name: file.name,
      data: e.target.result.split(',')[1],
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('videos', JSON.stringify(videos));
    loadVideos();
    alert('Video uploaded successfully!');
  };
  reader.readAsDataURL(file);
}

// Load Videos
function loadVideos() {
  const videos = JSON.parse(localStorage.getItem('videos') || '[]');
  
  // Public page video container
  const publicContainer = document.getElementById('videoContainer');
  if (publicContainer) {
    publicContainer.innerHTML = '';
    
    if (!checkAuth()) {
      publicContainer.innerHTML = `
        <div class="placeholder">
          <i class="fas fa-lock"></i>
          <p>ভিডিও দেখতে লগইন করুন</p>
        </div>
      `;
      return;
    }
    
    if (videos.length === 0) {
      publicContainer.innerHTML = '<p>No videos available yet.</p>';
      return;
    }
    
    videos.forEach(video => {
      const videoElement = document.createElement('div');
      videoElement.className = 'video-item';
      videoElement.innerHTML = `
        <h3>${video.name}</h3>
        <video controls width="100%" src="data:video/mp4;base64,${video.data}"></video>
      `;
      publicContainer.appendChild(videoElement);
    });
  }
  
  // Admin page video container
  const adminContainer = document.getElementById('adminVideoContainer');
  if (adminContainer) {
    adminContainer.innerHTML = '';
    
    videos.forEach(video => {
      const videoElement = document.createElement('div');
      videoElement.className = 'video-item';
      videoElement.innerHTML = `
        <h3>${video.name}</h3>
        <p>Uploaded: ${new Date(video.timestamp).toLocaleString()}</p>
        <video controls width="100%" src="data:video/mp4;base64,${video.data}"></video>
      `;
      adminContainer.appendChild(videoElement);
    });
  }
}

// Show credentials modal (admin only)
function showCredentials() {
  if (localStorage.getItem('isAdmin') !== 'true') return;
  
  const modal = document.getElementById('credentialsModal');
  const list = document.getElementById('credentialsList');
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  list.innerHTML = '';
  
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
  
  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('credentialsModal').style.display = 'none';
}

// Initialize the page
window.onload = function() {
  // Load videos on page load
  loadVideos();
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target === document.getElementById('credentialsModal')) {
      closeModal();
    }
  });
};
