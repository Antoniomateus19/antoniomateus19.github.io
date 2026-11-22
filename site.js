// The Journey: website. Language switch (EN / FR / PT), contact address, moving stars.

// ---- Set these two before publishing the site. ----
const CONTACT_EMAIL = "ulualiquioluali@gmail.com";   // the public address players can write to
const PLAY_STORE_URL = "";               // the Google Play link, once the game is published

(function () {
  // Language: saved choice, else the browser's language, else English.
  const saved = (() => { try { return localStorage.getItem("lang"); } catch (e) { return null; } })();
  const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
  let lang = saved || (["fr", "pt"].includes(nav) ? nav : "en");
  const setLang = (l) => {
    lang = l;
    document.documentElement.lang = l;
    document.querySelectorAll("nav.lang button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.set === l)));
    try { localStorage.setItem("lang", l); } catch (e) { }
  };
  document.querySelectorAll("nav.lang button").forEach(b => b.addEventListener("click", () => setLang(b.dataset.set)));
  setLang(lang);

  // Contact address and store link.
  document.querySelectorAll("[data-contact]").forEach(a => { a.href = "mailto:" + CONTACT_EMAIL; a.textContent = CONTACT_EMAIL; });
  document.querySelectorAll("[data-store]").forEach(a => {
    if (PLAY_STORE_URL) a.href = PLAY_STORE_URL;
    else { a.removeAttribute("href"); a.style.opacity = 0.55; a.style.pointerEvents = "none"; }
  });
  document.querySelectorAll("[data-soon]").forEach(e => { e.hidden = !!PLAY_STORE_URL; });
  document.querySelectorAll("[data-year]").forEach(e => { e.textContent = new Date().getFullYear(); });

  // Stars streaming out of the middle, like flying through space.
  const c = document.getElementById("stars");
  if (!c) return;
  const g = c.getContext("2d");
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, stars = [];
  const resize = () => { w = c.width = innerWidth * devicePixelRatio; h = c.height = innerHeight * devicePixelRatio; };
  const spawn = () => ({ x: (Math.random() - 0.5) * w, y: (Math.random() - 0.5) * h, z: Math.random() * w });
  resize(); addEventListener("resize", resize);
  for (let i = 0; i < 380; i++) stars.push(spawn());
  const frame = () => {
    g.fillStyle = "rgba(2, 6, 15, 0.55)";
    g.fillRect(0, 0, w, h);
    for (const s of stars) {
      const pz = s.z;
      s.z -= reduce ? 0 : w * 0.006;
      if (s.z < 1) { Object.assign(s, spawn()); s.z = w; continue; }
      const k = w * 0.5;
      const x = s.x / s.z * k + w / 2, y = s.y / s.z * k + h / 2;
      const px = s.x / pz * k + w / 2, py = s.y / pz * k + h / 2;
      const a = Math.min(1, 1.4 - s.z / w);
      g.strokeStyle = `rgba(200, 235, 255, ${a})`;
      g.lineWidth = Math.max(0.6, (1 - s.z / w) * 2.2 * devicePixelRatio);
      g.beginPath(); g.moveTo(px, py); g.lineTo(x, y); g.stroke();
    }
    requestAnimationFrame(frame);
  };
  frame();
})();
