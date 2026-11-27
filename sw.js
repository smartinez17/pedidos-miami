/* Service worker: permite instalar la lista como app y abrirla sin señal en las tiendas.
   Al agregar o cambiar fotos, sube el número de VERSION para que los teléfonos las descarguen. */
const VERSION = "pedidos-v3";
const CORE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "img/adidas.jpg",
  "img/althea_crema.jpg",
  "img/althea_duo.jpg",
  "img/althea_mist.jpg",
  "img/arcilla.jpg",
  "img/balm.jpg",
  "img/biodance.jpg",
  "img/bratz.jpg",
  "img/centella_kit.jpg",
  "img/cerave.jpg",
  "img/ck.jpg",
  "img/ck_tee.jpg",
  "img/coach_wallet.jpg",
  "img/dunk_rosa.jpg",
  "img/eclaire.jpg",
  "img/elf_fudge.jpg",
  "img/elf_glow.jpg",
  "img/elf_honey.jpg",
  "img/elf_quartz.jpg",
  "img/elf_primer.jpg",
  "img/eos_cream.jpg",
  "img/eos_marsh.jpg",
  "img/eos_oil.jpg",
  "img/eos_vanilla.jpg",
  "img/eye_cream.jpg",
  "img/grinch.jpg",
  "img/grinch_primark.jpg",
  "img/guess_bolso.jpg",
  "img/guess_morral.jpg",
  "img/guess_sandal.jpg",
  "img/guess_wallet.jpg",
  "img/huda.jpg",
  "img/icon-180.png",
  "img/icon-192.png",
  "img/icon-512.png",
  "img/icon-maskable-512.png",
  "img/isdin.jpg",
  "img/jordan_low.jpg",
  "img/jordan_mid.jpg",
  "img/medicube_sun.jpg",
  "img/mk_morral.jpg",
  "img/mk_slide.jpg",
  "img/mk_vanity.jpg",
  "img/nike_reactx.jpg",
  "img/nike_victori.jpg",
  "img/nyx.jpg",
  "img/odyssey.jpg",
  "img/pijama_hellokitty.jpg",
  "img/pijama_lunares.jpg",
  "img/puma.jpg",
  "img/samba_rosa.jpg",
  "img/serum.jpg",
  "img/skin1004_sun.jpg",
  "img/stanley_peach.jpg",
  "img/stanley_rosa.jpg",
  "img/starface.jpg",
  "img/th_candy.jpg",
  "img/th_vanilla.jpg",
  "img/th_watermelon.jpg",
  "img/travis.jpg",
  "img/truly_coco.jpg",
  "img/truly_legend.jpg",
  "img/truly_oil.jpg",
  "img/vaseline.jpg",
  "img/vans_knu.jpg",
  "img/yara.jpg",
  "img/zero_pad.jpg",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  /* La página: primero internet (para ver cambios), si no hay señal la copia guardada */
  if (req.mode === "navigate" || (url.origin === location.origin && url.pathname.endsWith(".html"))) {
    e.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put("index.html", copy)); return res; })
        .catch(() => caches.match("index.html"))
    );
    return;
  }

  /* Fotos, íconos, fuentes y GSAP: primero la copia guardada, si no internet y se guarda */
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    }))
  );
});
