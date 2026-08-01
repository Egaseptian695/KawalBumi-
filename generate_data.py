import json
import random

# Jember bounds
# Lat: -8.15 to -8.19
# Lng: 113.68 to 113.72

categories = {
    'Sampah': [
        "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400"
    ],
    'Sungai': [
        "https://images.unsplash.com/photo-1590492823611-6671a5cbe5b1?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1621451537084-482c73073e0f?auto=format&fit=crop&q=80&w=400"
    ],
    'Pohon': [
        "https://images.unsplash.com/photo-1543878077-94301fc3572d?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=400"
    ],
    'Polusi': [ # used for kebakaran/polusi
        "https://images.unsplash.com/photo-1615599874838-c67bdf88faea?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1611273426858-450d8e3c9cce?auto=format&fit=crop&q=80&w=400"
    ],
    'Bencana Alam': [
        "https://images.unsplash.com/photo-1542080681-b52d382432af?auto=format&fit=crop&q=80&w=400"
    ]
}

reports = []

# 12 Sampah
sampah_titles = [
    "Tumpukan Sampah Plastik di Jembatan Wirolegi",
    "Sampah Pasar Menumpuk di Pinggir Jalan Trunojoyo",
    "Limbah Rumah Tangga Dibuang Sembarangan di Patrang",
    "Banyak Botol Plastik di Area Kampus Tegalboto",
    "TPS Liar di Lahan Kosong Sumbersari",
    "Tumpukan Sampah Mengganggu Pengguna Jalan Gajah Mada",
    "Selokan Penuh Sampah Plastik di Kaliwates",
    "Sampah Menumpuk Dekat Alun-Alun Jember",
    "Tumpukan Sampah Pasar Tanjung Belum Diangkut",
    "Sisa Makanan dan Plastik Berserakan di Taman Kota",
    "Warga Buang Sampah Sembarangan di Gebang",
    "Sampah Menutupi Saluran Air Mangli"
]

# 5 Sungai
sungai_titles = [
    "Pembersihan Saluran Irigasi Sawah Jenggawah",
    "Sungai Bedadung Tercemar Limbah Pabrik",
    "Banyak Sampah Kasur di Aliran Sungai Ajung",
    "Air Sungai Menghitam Dekat Pemukiman Kepatihan",
    "Bantaran Sungai Tanggul Longsor"
]

# 3 Kebakaran (Polusi / Bencana)
kebakaran_titles = [
    "Pembakaran Lahan Kosong Timbulkan Asap Pekat",
    "Kebakaran Gudang Kayu Tua di Tegal Besar",
    "Asap Sisa Pembakaran Sampah Ilegal di Rambipuji"
]

# 2 Pohon Tumbang (Pohon)
pohon_titles = [
    "Pohon Asam Lapuk Rawan Tumbang di Hayam Wuruk",
    "Dahan Pohon Beringin Patah Menimpa Kabel Listrik"
]

# 3 Bencana Alam
bencana_titles = [
    "Jalan Ambles Akibat Hujan Deras di Arjasa",
    "Banjir Genangan di Perumahan Mastrip",
    "Tanah Longsor Menutup Akses Jalan Rembangan"
]

def add_reports(titles, cat, count, target_cat=None):
    for i in range(count):
        title = titles[i % len(titles)]
        actual_cat = target_cat if target_cat else cat
        
        # Decide status based on 40% Green (10 out of 25)
        # We'll just randomly pick with weighted probability, but ensure exactly 10 are green overall if we want.
        # Let's just randomize, or keep a global counter.
        pass

statuses = ['Green']*10 + ['Red']*10 + ['Yellow']*5
random.shuffle(statuses)

all_items = []
all_items.extend([('Sampah', t, 'Sampah') for t in sampah_titles[:12]])
all_items.extend([('Sungai', t, 'Sungai') for t in sungai_titles[:5]])
all_items.extend([('Kebakaran', t, 'Polusi') for t in kebakaran_titles[:3]])
all_items.extend([('Pohon', t, 'Pohon') for t in pohon_titles[:2]])
all_items.extend([('Bencana Alam', t, 'Bencana Alam') for t in bencana_titles[:3]])

random.shuffle(all_items)

authors = ["Budi Santoso", "Warga Wirolegi", "Siti", "Ahmad", "Diana", "Pak RT 04", "Andi", "Relawan Jember", "Komunitas Hijau"]

js_reports = []
for i, item in enumerate(all_items):
    _, title, cat = item
    status = statuses[i]
    
    votes = random.randint(10, 200)
    volunteers = 0
    if status == 'Yellow':
        volunteers = random.randint(1, 5)
    elif status == 'Green':
        volunteers = random.randint(5, 20)
        
    lat = -8.17 + random.uniform(-0.02, 0.02)
    lng = 113.70 + random.uniform(-0.02, 0.02)
    
    comments = []
    if random.random() > 0.3:
        comments.append({"name": random.choice(authors), "text": "Mari kita segera tindak lanjuti!"})
    if random.random() > 0.5:
        comments.append({"name": random.choice(authors), "text": "Wah, bahaya juga kalau dibiarkan."})
        
    img = random.choice(categories[cat])
    
    rep = {
        "id": 1000 + i,
        "title": title,
        "category": cat,
        "status": status,
        "votes": votes,
        "userVoted": False,
        "volunteers": volunteers,
        "author": random.choice(authors),
        "date": f"{random.randint(1, 28)} Jul 2026",
        "lat": round(lat, 5),
        "lng": round(lng, 5),
        "desc": "Laporan warga terkait " + title.lower() + " di sekitar Jember. Segera butuh penanganan.",
        "image": img,
        "comments": comments,
        "volunteerList": []
    }
    js_reports.append(rep)

with open('C:\\Users\\adit2\\.gemini\\antigravity\\scratch\\lapor-lingkungan\\js\\db.js', 'w') as f:
    f.write('''// DATABASE (LocalStorage)
const DB_REPORTS = 'pw_reports';
const DB_USERS = 'pw_users';
const DB_AUTH = 'pw_auth';

let users = JSON.parse(localStorage.getItem(DB_USERS)) || {
    "budi@email.com": { name: "Budi Santoso", initial: "B", points: 350, level: 2, email: "budi@email.com", password: "password123" }
};

// Override localStorage with 25 fresh reports requested by user
let defaultReports = ''' + json.dumps(js_reports, indent=4) + ''';

// Force reset of reports for this specific update
let reports = defaultReports;

// Ensure initial save
function saveDB() {
    localStorage.setItem(DB_USERS, JSON.stringify(users));
    localStorage.setItem(DB_REPORTS, JSON.stringify(reports));
    if (typeof currentUser !== 'undefined' && currentUser) {
        localStorage.setItem(DB_AUTH, JSON.stringify({email: currentUser.email}));
    }
}

saveDB();
''')

print("Data generated and saved to db.js successfully!")
