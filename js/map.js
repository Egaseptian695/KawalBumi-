let map;
let markersGroup;

function initMap() {
    map = L.map('map', {zoomControl: false}).setView([-8.1724, 113.7000], 14);
    L.control.zoom({ position: 'topright' }).addTo(map);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { 
        attribution: '© OpenStreetMap © CartoDB',
        maxZoom: 19 
    }).addTo(map); // Using a more modern clean map style
    markersGroup = L.featureGroup().addTo(map);
    renderData();
}

// DYNAMIC MARKER COLORS based on Status
function getMarkerIcon(status) {
    let color = 'blue';
    if(status === 'Red') color = 'red';
    if(status === 'Yellow') color = 'gold';
    if(status === 'Green') color = 'green';
    
    return L.icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
}

// MAP PICKER & GPS LOGIC
let pickerMap, pickerMarker;
const defaultLat = -8.1724;
const defaultLng = 113.7000;

function initPickerMap() {
    if(!pickerMap) {
        pickerMap = L.map('pickerMap', {zoomControl: false}).setView([defaultLat, defaultLng], 14);
        L.control.zoom({ position: 'topright' }).addTo(pickerMap);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(pickerMap);
        
        pickerMarker = L.marker([defaultLat, defaultLng], {
            draggable: true,
            icon: getMarkerIcon('Red') // Default red for new report
        }).addTo(pickerMap);
        
        pickerMap.on('click', function(e) {
            pickerMarker.setLatLng(e.latlng);
        });
    }
}

function openMapPicker() {
    openModal('mapPickerModal');
    setTimeout(() => {
        initPickerMap();
        pickerMap.invalidateSize();
    }, 150);
}

function locateUser() {
    if (!navigator.geolocation) {
        showToast("Browser Anda tidak mendukung Geolokasi.");
        return;
    }
    
    showToast("📍 Mencari lokasi presisi Anda...");
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            pickerMap.setView([lat, lng], 17);
            pickerMarker.setLatLng([lat, lng]);
            
            showToast("Lokasi berhasil dikunci!");
        },
        (error) => {
            let msg = "Gagal mendapatkan lokasi.";
            if(error.code === 1) msg = "Akses lokasi ditolak. Izinkan GPS di browser Anda.";
            showToast(msg);
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

function confirmLocation() {
    const pos = pickerMarker.getLatLng();
    document.getElementById('inputLocation').value = `${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`;
    closeModal('mapPickerModal');
    showToast("Titik koordinat berhasil disimpan!");
}
