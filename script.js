// Alamat WebSocket akan otomatis menggunakan IP dari ESP32
const gateway = `ws://${window.location.hostname}/ws`;
let websocket;

// Elemen DOM
const statusIndicator = document.getElementById('status-indicator');
const uidText = document.getElementById('uid-text');
const nfcImage = document.getElementById('nfc-image');

// ‼️ AMBIL ELEMEN TOMBOL YANG ADA DI HTML ANDA
// (Ini udah bener, dia bakal ngambil <img>)
const fullscreenBtn = document.getElementById('fullscreen-btn');

// --- Fungsi untuk memulai koneksi WebSocket ---
function initWebSocket() {
    console.log('Mencoba membuka WebSocket...');
    websocket = new WebSocket(gateway);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
}

// Dipanggil saat koneksi berhasil dibuka
function onOpen(event) {
    console.log('Koneksi WebSocket dibuka.');
    statusIndicator.classList.remove('disconnected');
    statusIndicator.classList.add('connected');
}

// Dipanggil saat koneksi ditutup
function onClose(event) {
    console.log('Koneksi WebSocket ditutup.');
    statusIndicator.classList.remove('connected');
    statusIndicator.classList.add('disconnected');
    // Coba hubungkan kembali setelah 2 detik
    setTimeout(initWebSocket, 2000);
}

// Dipanggil saat menerima data dari server 
function onMessage(event) {
    console.log('Menerima data:', event.data);
    let data;
    try {
        data = JSON.parse(event.data);
    } catch (e) {
        console.error('Gagal parsing JSON:', e);
        return;
    }

    if (data.uid) {
        if(data.uid === "NONE") {
            uidText.textContent = "Tempelkan kartu...";
        } else {
             // Sembunyikan UID biar bersih
            uidText.textContent = ""; // Kosongin aja
        }
    }
    
    if (data.image) {
        // Langsung gunakan URL lengkap dari JSON
        nfcImage.src = data.image; 
    }
}

// ‼️ --- FUNGSI Logika Fullscreen ---
// (Ini udah bener, gausah diubah)
function toggleFullscreen() {
    const elem = document.documentElement; // Targetkan seluruh halaman

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        // Masuk Fullscreen
        console.log('Masuk fullscreen...');
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                console.error(`Error saat request fullscreen: ${err.message}`);
            });
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        }
    } else {
        // Keluar Fullscreen
        console.log('Keluar fullscreen...');
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        }
    }
}

// --- Mulai koneksi saat halaman dimuat ---
window.addEventListener('load', () => {
    initWebSocket(); // Jalankan WebSocket

    // ‼️ IKATKAN TOMBOL KE FUNGSI FULLSCREEN
    // (Ini udah bener, gausah diubah)
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    } else {
        console.error('Tombol fullscreen-btn tidak ditemukan!');
    }
});
