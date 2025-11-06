// Alamat WebSocket akan otomatis menggunakan IP dari ESP32
const gateway = `ws://${window.location.hostname}/ws`;
let websocket;

// Elemen DOM
const statusIndicator = document.getElementById('status-indicator');
const uidText = document.getElementById('uid-text');
const nfcImage = document.getElementById('nfc-image');
// Tombol fullscreen (udah bener)
const fullscreenBtn = document.getElementById('fullscreen-btn');

// Fungsi untuk memulai koneksi WebSocket
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

// Dipanggil saat menerima data dari server (ESP32)
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
            // uidText.textContent = `UID: ${data.uid}`; 
        }
    }
    
    if (data.image) {
        // Langsung gunakan URL lengkap dari JSON
        nfcImage.src = data.image; 
    }
}

// Fungsi untuk trigger fullscreen (udah bener)
function goFullscreen() {
    console.log('Tombol fullscreen diklik');
    const elem = document.documentElement; // Minta fullscreen untuk seluruh halaman

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari, Chrome di iOS */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

// Mulai koneksi & pasang listener saat halaman dimuat (udah bener)
window.addEventListener('load', () => {
    initWebSocket(); // Tetap jalankan koneksi WebSocket

    // Pasang listener ke tombol fullscreen
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', goFullscreen);
    } else {
        console.error('Tombol Fullscreen tidak ditemukan');
    }
});
