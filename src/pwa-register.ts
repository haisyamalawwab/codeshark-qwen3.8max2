/* Registrasi SW bersama untuk hub + sub-folder (latihan.my.id).
   Hub (/) → ./sw.js scope ./ ; sub-game (/codingshark/, /codingtower/) → ../sw.js scope ../ (= root).
   Satu SW root melayani semuanya (precache hub + kedua sub-game + workbox runtime fonts).
   Modul ini di-bundle Vite (type="module" di tiap index.html) — path SW dihitung
   dari location.pathname sehingga tetap benar apa pun lokasi chunk output. */
(function () {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    const inSub = /\/(codingshark|codingtower)\//.test(location.pathname);
    const sw = inSub ? "../sw.js" : "./sw.js";
    const scope = inSub ? "../" : "./";
    try {
      navigator.serviceWorker.register(sw, { scope }).catch(() => {
        /* registrasi ditolak — abaikan */
      });
    } catch {
      /* file:// atau private mode — abaikan */
    }
  });
})();
