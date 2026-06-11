function getNavbar() {
  return `
    <nav class="topbar">
      <div class="topbar-container">
        
        <a href="/" class="logo-area">
          <span class="logo-dot">🐾</span>
          <span class="logo-text">Bikyoon</span>
        </a>

        <div class="nav-links">
          <div class="nav-dropdown">
            <div class="nav-item">
              Museum <span class="arrow">⌃</span>
            </div>

            <div class="dropdown-menu">
              <a href="/pages/museum.html" class="dropdown-card">
                <span class="icon">🖼️</span>
                Gallery
              </a>
              <a href="/pages/submit.html" class="dropdown-card">
                <span class="icon">⤴</span>
                Submit
              </a>
            </div>
          </div>

          <a href="/pages/credits.html">Credits</a>
          <a href="/pages/profile.html">Profile</a>
          <a href="/pages/admin.html">Admin</a>

          <a href="/auth/signin.html" class="signin-btn">Sign In</a>
        </div>
      </div>
    </nav>
  `;
}

// Automatically inject into the placeholder when the script loads
document.addEventListener("DOMContentLoaded", () => {
    const placeholder = document.getElementById('navbar-placeholder');
    if (placeholder) {
        placeholder.innerHTML = getNavbar();
    }
});