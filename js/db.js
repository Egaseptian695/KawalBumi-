// DATABASE (LocalStorage)
const DB_REPORTS = 'pw_reports';
const DB_USERS = 'pw_users';
const DB_AUTH = 'pw_auth';

let users = JSON.parse(localStorage.getItem(DB_USERS)) || {
    "budi@email.com": { name: "Budi Santoso", initial: "B", points: 350, level: 2, email: "budi@email.com", password: "password123" }
};

// DATABASE DATA (Restore or use dummy if empty)
let defaultReports = [
    { 
        id: 1, title: "Tumpukan Sampah Plastik di Jembatan Wirolegi", category: "Sampah", status: "Red", 
        votes: 52, userVoted: false, volunteers: 0, author: "Warga Wirolegi", date: "24 Jul 2026", lat: -8.175, lng: 113.705, 
        desc: "Sampah domestik menyangkut di pilar jembatan, bau sangat menyengat mengganggu pengguna jalan.", image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400",
        comments: [{ name: "Pak RT 04", text: "Sudah saya sampaikan ke Dinas Kebersihan kemarin." }, { name: "Siti", text: "Iya baunya parah banget kalau siang." }]
    },
    { 
        id: 3, title: "Pohon Asam Lapuk Rawan Tumbang", category: "Pohon", status: "Yellow", 
        votes: 28, userVoted: false, volunteers: 5, author: "Ahmad", date: "22 Jul 2026", lat: -8.170, lng: 113.715, 
        desc: "Pohon besar di pinggir jalan sudah miring dan akarnya terangkat. Warga sedang bersiap menebang bersama damkar.", image: "https://images.unsplash.com/photo-1543878077-94301fc3572d?auto=format&fit=crop&q=80&w=400",
        comments: []
    },
    { 
        id: 4, title: "Pembakaran Sampah Ilegal Timbulkan Asap", category: "Polusi", status: "Red", 
        votes: 19, userVoted: false, volunteers: 0, author: "Diana", date: "23 Jul 2026", lat: -8.168, lng: 113.695, 
        desc: "Ada pabrik tahu kecil yang membakar sampah plastik setiap sore. Asapnya masuk ke pemukiman warga.", image: "https://images.unsplash.com/photo-1615599874838-c67bdf88faea?auto=format&fit=crop&q=80&w=400",
        comments: [{ name: "Budi Santoso", text: "Ini harus lapor Satpol PP juga." }]
    },
    { 
        id: 2, title: "Pembersihan Saluran Irigasi Sawah", category: "Sungai", status: "Green", 
        votes: 45, userVoted: true, volunteers: 15, author: "Komunitas Air", date: "20 Jul 2026", lat: -8.180, lng: 113.710, 
        desc: "Kerja bakti bersama warga sukses dilakukan, aliran air lancar.", image: "https://images.unsplash.com/photo-1590492823611-6671a5cbe5b1?auto=format&fit=crop&q=80&w=400",
        comments: [{ name: "Budi Santoso", text: "Alhamdulillah air sudah lancar ke sawah." }]
    }
];

let reports = JSON.parse(localStorage.getItem(DB_REPORTS)) || defaultReports;

// Ensure initial save
function saveDB() {
    localStorage.setItem(DB_USERS, JSON.stringify(users));
    localStorage.setItem(DB_REPORTS, JSON.stringify(reports));
    if (typeof currentUser !== 'undefined' && currentUser) {
        localStorage.setItem(DB_AUTH, JSON.stringify({email: currentUser.email}));
    }
}

saveDB();
