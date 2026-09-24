(function () {
  // English text (exactly as it appears on the page) -> Arabic
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
    "🍄 DEBUTING IN 2025 • FOX • WIQO WIQO 🌸": "🍄 بدايتي في 2025 • ثعلبة • ويقو ويقو 🌸",

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
    "Mushrooms • Fox • sassypans • Friends": "الفطر • الثعلب • sassypans • الأصدقاء",
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

  const originals = new WeakMap();
  let lang = "en";
  try { lang = localStorage.getItem("lang") || "en"; } catch (_) {}
  let btn;

  const norm = s => s.replace(/\s+/g, " ").trim();

  function toArabic(text) {
    if (AR[text]) return AR[text];
    const m = text.match(/^👁️ (.+) views$/);      // dynamic video view counts
    if (m) return `👁️ ${m[1]} مشاهدة`;
    return null;
  }

  function shouldSkip(node) {
    const p = node.parentElement;
    return !p || /^(SCRIPT|STYLE|NOSCRIPT|IFRAME)$/.test(p.tagName) || p.closest(".lang-toggle");
  }

  function translateNode(node) {
    if (shouldSkip(node)) return;
    if (lang === "ar") {
      const raw = originals.has(node) ? originals.get(node) : node.nodeValue;
      const key = norm(raw);
      const ar = key && toArabic(key);
      if (ar) {
        if (!originals.has(node)) originals.set(node, raw);
        const lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
        node.nodeValue = lead + ar + trail;
      }
    } else if (originals.has(node)) {
      node.nodeValue = originals.get(node);
      originals.delete(node);
    }
  }

  function walk(root) {
    if (root.nodeType === 3) return translateNode(root);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) translateNode(n);
  }

  function apply() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    walk(document.body);
    if (btn) btn.textContent = lang === "ar" ? "En" : "Ar";
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Button styles
    const style = document.createElement("style");
    style.textContent = `
      .lang-toggle{background:linear-gradient(135deg,#ff69b4,#ff409f);color:#fff;border:none;
        border-radius:12px;padding:6px 14px;font-weight:bold;font-size:14px;cursor:pointer;
        transition:transform .2s}
      .lang-toggle:hover{transform:translateY(-2px)}
      .lang-toggle-floating{position:fixed;bottom:20px;right:20px;z-index:200}
    `;
    document.head.appendChild(style);

    // Button
    btn = document.createElement("button");
    btn.className = "lang-toggle";
    btn.type = "button";
    btn.addEventListener("click", () => {
      lang = lang === "ar" ? "en" : "ar";
      try { localStorage.setItem("lang", lang); } catch (_) {}
      apply();
    });

    const ul = document.querySelector(".site-nav-links");
    if (ul) {
      const li = document.createElement("li");
      li.appendChild(btn);
      ul.appendChild(li);
    } else {
      btn.classList.add("lang-toggle-floating");
      document.body.appendChild(btn);
    }

    // Translate content that JS adds later (YouTube videos, footer, etc.)
    new MutationObserver(muts => {
      if (lang !== "ar") return;
      muts.forEach(m => m.addedNodes.forEach(n => {
        if (n.nodeType === 3 || n.nodeType === 1) walk(n);
      }));
    }).observe(document.body, { childList: true, subtree: true });

    apply();
  });
})();
