(function () {
    // ==============================
    // English -> Arabic translations
    // ==============================

    const AR = {
        // Navbar
        "Home": "الرئيسية",
        "Minecraft": "ماينكرافت",
        "Gallery": "المعرض",
        "Credits": "الشكر والتقدير",

        // Hero
        "Hello,": "مرحباً،",
        "I'm": "أنا",
        "Tana.": "تانا.",
        "Credits 🎗️": "الشكر والتقدير 🎗️",
        "Museum 🎨": "المتحف 🎨",
        "Debut": "البداية",
        "Views": "المشاهدات",
        "Subscribers": "المشتركون",
        "New Website": "موقع جديد",
        "Updates": "التحديثات",
        "🍄 DEBUTING IN 2025 • FOX • WIQO WIQO 🌸":
            "🍄 بدايتي في 2025 • ثعلبة • ويقو ويقو 🌸",

        // Community
        "The Fox Den": "عرين الثعلب",
        "Find Me Everywhere": "تجدوني في كل مكان",
        "Arabic • English": "العربية • الإنجليزية",
        "Videos & Shorts": "فيديوهات وشورتس",
        "Live Streams": "بثوث مباشرة",
        "Wiqo Wiqo Chat": "دردشة ويقو ويقو",
        "Join Server": "انضم للسيرفر",
        "No Account": "لا يوجد حساب",

        // Profile
        "SINCE 2025 / VTUBING": "منذ 2025 / فيتيوبر",
        "Who is": "من هي",
        "Tana?": "تانا؟",
        "YouTube Journey": "رحلة اليوتيوب",
        "The beginning of the Tana adventure.": "بداية مغامرة تانا.",
        "Since 2025": "منذ 2025",

        "🦊 Character Profile": "🦊 بطاقة الشخصية",
        "Name": "الاسم",
        "Species": "النوع",
        "Fox": "ثعلبة",
        "Origin": "الأصل",
        "N/A": "غير متوفر",
        "Role": "الدور",
        "VTuber & Voice Actress": "فتيوبر وممثلة صوتية",
        "Companion": "الرفيق",
        "cat (sassypans)": "قطة (sassypans)",

        "🍄 Likes & Dislikes": "🍄 المحبوبات والمكروهات",
        "Likes": "المحبوبات",
        "Gaming • Voice Acting": "الألعاب • التمثيل الصوتي",
        "Dislikes": "المكروهات",
        "close minded • Lie": "ضيق الأفق • الكذب",
        "Aesthetic": "الطابع",
        "Mushrooms • Fox • sassypans • Friends":
            "الفطر • الثعلب • sassypans • الأصدقاء",

        "📺 The VTuber Life": "📺 حياة الفتيوبر",
        "Jul 12 2025": "12 يوليو 2025",
        "Languages": "اللغات",
        "Arabic, English": "العربية، الإنجليزية",
        "Fanbase Name": "اسم المعجبين",
        "Agency / Status": "الوكالة / الحالة",
        "Independent": "مستقلة",

        // Videos
        "Highlights": "أبرز اللقطات",
        "Latest Videos": "أحدث الفيديوهات",
        "View More →": "عرض المزيد ←",
        "Sprouting video links...": "جارٍ تحميل الفيديوهات...",
        "Latest Upload": "أحدث فيديو"
    };

    // ==============================
    // Current language
    // ==============================

    let lang = "en";

    try {
        lang = localStorage.getItem("lang") || "en";
    } catch (_) {}

    let btn = null;

    // Store original English text
    const originals = new WeakMap();

    // ==============================
    // Helpers
    // ==============================

    const norm = (text) => {
        return text.replace(/\s+/g, " ").trim();
    };

    function toArabic(text) {
        // Normal translations
        if (AR[text]) {
            return AR[text];
        }

        // Dynamic YouTube/video views
        const views = text.match(/^👁️ (.+) views$/);

        if (views) {
            return `👁️ ${views[1]} مشاهدة`;
        }

        return null;
    }

    function shouldSkip(node) {
        const parent = node.parentElement;

        if (!parent) return true;

        // Don't translate scripts/styles/etc.
        if (/^(SCRIPT|STYLE|NOSCRIPT|IFRAME)$/.test(parent.tagName)) {
            return true;
        }

        // Don't translate the language button itself
        if (parent.closest(".lang-toggle")) {
            return true;
        }

        return false;
    }

    // ==============================
    // Translate one text node
    // ==============================

    function translateNode(node) {
        if (shouldSkip(node)) return;

        if (lang === "ar") {

            const raw = originals.has(node)
                ? originals.get(node)
                : node.nodeValue;

            const key = norm(raw);
            const arabic = key && toArabic(key);

            if (arabic) {

                if (!originals.has(node)) {
                    originals.set(node, raw);
                }

                const leadingSpaces = raw.match(/^\s*/)[0];
                const trailingSpaces = raw.match(/\s*$/)[0];

                node.nodeValue =
                    leadingSpaces +
                    arabic +
                    trailingSpaces;
            }

        } else {

            // Restore English
            if (originals.has(node)) {
                node.nodeValue = originals.get(node);
                originals.delete(node);
            }
        }
    }

    // ==============================
    // Walk through page
    // ==============================

    function walk(root) {

        if (root.nodeType === Node.TEXT_NODE) {
            translateNode(root);
            return;
        }

        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT
        );

        let node;

        while ((node = walker.nextNode())) {
            translateNode(node);
        }
    }

    // ==============================
    // Apply language
    // ==============================

    function apply() {

        document.documentElement.lang = lang;

        document.documentElement.dir =
            lang === "ar" ? "rtl" : "ltr";

        walk(document.body);

        if (btn) {
            // What the button shows:
            // English -> عربي
            // Arabic -> En
            btn.textContent =
                lang === "ar" ? "En" : "عربي";
        }
    }

    // ==============================
    // Button styling
    // ==============================

    const style = document.createElement("style");

    style.textContent = `
        .lang-toggle {
            background: linear-gradient(
                135deg,
                #ff69b4,
                #ff409f
            );

            color: #fff;
            border: none;
            border-radius: 12px;
            padding: 6px 14px;

            font-weight: bold;
            font-size: 14px;

            cursor: pointer;

            transition:
                transform 0.2s,
                box-shadow 0.2s;
        }

        .lang-toggle:hover {
            transform: translateY(-2px);

            box-shadow:
                0 5px 15px rgba(255, 64, 159, 0.35);
        }
    `;

    document.head.appendChild(style);

    // ==============================
    // Navbar ready
    // ==============================

    document.addEventListener("navbar:ready", () => {

        btn = document.getElementById("lang-toggle");

        if (!btn) return;

        btn.addEventListener("click", () => {

            // Switch language
            lang = lang === "ar"
                ? "en"
                : "ar";

            // Save preference
            try {
                localStorage.setItem("lang", lang);
            } catch (_) {}

            // Apply
            apply();
        });

        // Apply saved language immediately
        apply();
    });

    // ==============================
    // Handle dynamically added content
    // ==============================

    new MutationObserver((mutations) => {

        if (lang !== "ar") return;

        mutations.forEach((mutation) => {

            mutation.addedNodes.forEach((node) => {

                if (
                    node.nodeType === Node.TEXT_NODE ||
                    node.nodeType === Node.ELEMENT_NODE
                ) {
                    walk(node);
                }

            });

        });

    }).observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();
