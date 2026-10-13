/* Registrasi SW bersama untuk hub + sub-folder (latihan.my.id).
   Hub (/) → ./sw.js scope ./ ; sub-game (/codingshark/, /codingtower/) → ../sw.js scope ../ (= root).
   Satu SW root melayani semuanya (precache hub + kedua sub-game + workbox runtime fonts). */
(function () {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", function () {
    var inSub = /\/(codingshark|codingtower)\//.test(location.pathname);
    var sw = inSub ? "../sw.js" : "./sw.js";
    var scope = inSub ? "../" : "./";
    try {
      navigator.serviceWorker.register(sw, { scope: scope }).catch(function () {});
    } catch (e) {
      /* file:// atau private mode — abaikan */
    }
  });
})();
