document.addEventListener("DOMContentLoaded", () => {
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

                <!-- Language Toggle -->
                <li>
                    <button type="button" id="lang-toggle" class="lang-toggle">
                        عربي
                    </button>
                </li>
            </ul>
        </nav>
    `;

    if (!document.querySelector(".site-nav")) {
        document.body.insertAdjacentHTML("afterbegin", navbarHTML);
    }

    // Highlight active page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".site-nav-links a");

    navLinks.forEach(link => {
        const href = link.getAttribute("href");

        if (
            href === currentPath ||
            (currentPath === "/" && href === "/index.html")
        ) {
            link.classList.add("active");
        }
    });

    // Tell lang.js that the navbar is ready
    document.dispatchEvent(new Event("navbar:ready"));
});
