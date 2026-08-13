document.addEventListener("DOMContentLoaded", () => {
    // 1. Build Navbar HTML Template
    const navbarHTML = `
        <nav class="site-nav">
            <a href="/index.html" class="site-nav-brand">
                <img src="/assets/paww.png" alt="Paw Logo" onerror="this.style.display='none'">
                <span>Tana ┃ تانا</span>
            </a>
            <ul class="site-nav-links">
                <li><a href="/index.html" id="nav-home">Home</a></li>
                <li><a href="/pages/minecraft.html" id="nav-updates">Minecraft</a></li>
                <li><a href="/pages/gallery.html" id="nav-gallery">Gallery</a></li>
                <li><a href="/pages/credits.html" id="nav-merch">Credits</a></li>
            </ul>
        </nav>
    `;

    // 2. Inject at top of <body> if not already present
    if (!document.querySelector(".site-nav")) {
        document.body.insertAdjacentHTML("afterbegin", navbarHTML);
    }

    // 3. Highlight Active Link Based on Current Path
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".site-nav-links a");

    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPath || (currentPath === "/" && href === "/index.html")) {
            link.classList.add("active");
        }
    });
});