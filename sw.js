// Ini adalah Service Worker minimal yang diperlukan untuk PWA.
// Tujuan utamanya adalah untuk membuat browser mengenali situs ini
// sebagai "installable" (dapat dipasang ke Layar Utama).

const CACHE_NAME = 'nfc-abk-cache-v1';
// Daftar file "cangkang" aplikasi. Kita biarkan kosong untuk saat ini
// agar tidak mengganggu proses cache.
// Kita akan fokus pada 'fetch' event.
const urlsToCache = [
  // '/' // Bisa ditambahkan jika Anda ingin halaman utama di-cache
];

// Event: Install
self.addEventListener('install', event => {
  console.log('Service Worker: Menginstall...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache dibuka');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event: Fetch (Mengambil resource)
// Ini adalah strategi "Network First" (Jaringan Dulu)
// Browser akan selalu mencoba mengambil file baru dari internet (Netlify).
// Ini memastikan file CSS/JS Anda selalu yang terbaru.
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // Jika gagal (misal, offline), coba ambil dari cache jika ada.
        return caches.match(event.request);
      })
  );
});

// Event: Activate (Aktivasi)
// Membersihkan cache lama jika ada
self.addEventListener('activate', event => {
  console.log('Service Worker: Mengaktifkan...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Menghapus cache lama', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

