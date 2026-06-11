// Load navbar
fetch('/navbar.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('navbar-placeholder').innerHTML = data;

    const toggle = document.querySelector('.theme-toggle');

    // Load saved theme
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.body.classList.add('dark-theme');
        toggle.textContent = '🌙';
    } else {
        toggle.textContent = '☀️';
    }

    // Toggle click
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');

        const isDark = document.body.classList.contains('dark-theme');

        toggle.textContent = isDark ? '🌙' : '☀️';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
});