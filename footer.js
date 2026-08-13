// footer.js
document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject footer CSS automatically if not present
    if (!document.getElementById("footer-css")) {
        const link = document.createElement("link");
        link.id = "footer-css";
        link.rel = "stylesheet";
        link.href = "/footer.css"; // Ensure path matches your setup
        document.head.appendChild(link);
    }

    // 2. Fetch and render HTML
    fetch('/footer.html')
        .then(response => response.text())
        .then(data => {
            const footerContainer = document.getElementById('global-footer');
            if (footerContainer) {
                footerContainer.innerHTML = data;
            }
        })
        .catch(err => console.error("Error loading footer:", err));
});