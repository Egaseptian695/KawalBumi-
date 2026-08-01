// FILTER STATES
let filterStatus = 'All'; 
let filterCategory = 'All'; 
let currentReportId = null;

function getStatusConfig(status) {
    if(status === 'Red') return { text: 'Belum Ditangani', bg: 'bg-red-50 border border-red-100', textCol: 'text-red-600' };
    if(status === 'Yellow') return { text: 'Kerja Bakti', bg: 'bg-amber-50 border border-amber-100', textCol: 'text-amber-700' };
    if(status === 'Green') return { text: 'Selesai', bg: 'bg-emerald-50 border border-emerald-100', textCol: 'text-emerald-700' };
    return { text: 'Unknown', bg: 'bg-gray-50 border border-gray-100', textCol: 'text-gray-600' };
}

function updateVoteStats() {
    const stats = {};
    reports.forEach(r => {
        if (r.status !== 'Green') {
            if(!stats[r.category]) stats[r.category] = 0;
            stats[r.category] += r.votes;
        }
    });

    let maxVotes = 0;
    Object.keys(stats).forEach(cat => {
        if(stats[cat] > maxVotes) maxVotes = stats[cat];
    });

    if (Object.keys(stats).length === 0) {
        document.getElementById('voteStatsContainer').innerHTML = `<p class="text-[10px] text-slate-400 font-medium italic">Belum ada data urgensi aktif.</p>`;
        return;
    }

    const barsHTML = Object.keys(stats).sort((a,b) => stats[b] - stats[a]).slice(0, 5).map(cat => {
        const pct = maxVotes === 0 ? 0 : (stats[cat] / maxVotes) * 100;
        let color = 'from-teal-400 to-teal-500';
        if(cat==='Sampah') color='from-rose-400 to-red-500';
        if(cat==='Sungai') color='from-sky-400 to-blue-500';
        if(cat==='Polusi') color='from-slate-400 to-gray-500';
        if(cat==='Pohon') color='from-amber-400 to-orange-500';
        if(cat==='Bencana Alam') color='from-purple-400 to-indigo-500';
        
        return `
        <div class="flex items-center gap-2.5">
            <div class="w-11 text-[9px] font-bold text-slate-600 truncate text-right">${cat}</div>
            <div class="flex-1 h-2.5 bg-slate-100/80 rounded-full overflow-hidden shadow-inner">
                <div class="h-full bg-gradient-to-r ${color} rounded-full bar-fill shadow-sm" style="width: ${pct}%"></div>
            </div>
            <div class="w-5 text-[10px] font-black text-slate-700 text-left">${stats[cat]}</div>
        </div>`;
    }).join('');

    document.getElementById('voteStatsContainer').innerHTML = barsHTML;
}

function updateFilterCounts() {
    const countStatus = { All: reports.length, Red: 0, Yellow: 0, Green: 0 };
    const countCat = { All: reports.length, Sampah: 0, Sungai: 0, Pohon: 0, Polusi: 0, 'Bencana Alam': 0 };
    
    reports.forEach(r => {
        if(countStatus[r.status] !== undefined) countStatus[r.status]++;
        if(countCat[r.category] !== undefined) countCat[r.category]++;
    });

    const formatBadge = (text, count) => `${text} <span class="ml-1 opacity-50 font-black">(${count})</span>`;

    document.getElementById('btnStatusAll').innerHTML = formatBadge('Semua', countStatus.All);
    document.getElementById('btnStatusRed').innerHTML = formatBadge('🔴 Belum Selesai', countStatus.Red);
    document.getElementById('btnStatusYellow').innerHTML = formatBadge('🟡 Kerja Bakti', countStatus.Yellow);
    document.getElementById('btnStatusGreen').innerHTML = formatBadge('🟢 Selesai', countStatus.Green);

    document.getElementById('btnCatAll').innerHTML = formatBadge('Semua', countCat.All);
    document.getElementById('btnCatSampah').innerHTML = formatBadge('🗑️ Sampah', countCat.Sampah);
    document.getElementById('btnCatSungai').innerHTML = formatBadge('🌊 Sungai', countCat.Sungai);
    document.getElementById('btnCatPohon').innerHTML = formatBadge('🌳 Pohon', countCat.Pohon);
    document.getElementById('btnCatPolusi').innerHTML = formatBadge('💨 Polusi', countCat.Polusi);
    document.getElementById('btnCatBencana').innerHTML = formatBadge('🌋 Bencana', countCat['Bencana Alam']);
}

function setFilterStatus(s) {
    filterStatus = s;
    const defaultBtn = "px-3 py-1.5 text-[10px] font-bold rounded-full bg-white border border-gray-200 text-slate-600 shadow-sm transition-all whitespace-nowrap ";
    const activeAllBtn = "px-3 py-1.5 text-[10px] font-bold rounded-full bg-slate-800 text-white shadow-md transition-all whitespace-nowrap";
    
    document.getElementById('btnStatusAll').className = s === 'All' ? activeAllBtn : defaultBtn + 'hover:bg-slate-50';
    document.getElementById('btnStatusRed').className = s === 'Red' ? defaultBtn + 'bg-red-50 text-red-600 border-red-200 ring-2 ring-red-100' : defaultBtn + 'hover:bg-red-50 hover:text-red-600';
    document.getElementById('btnStatusYellow').className = s === 'Yellow' ? defaultBtn + 'bg-amber-50 text-amber-700 border-amber-200 ring-2 ring-amber-100' : defaultBtn + 'hover:bg-amber-50 hover:text-amber-700';
    document.getElementById('btnStatusGreen').className = s === 'Green' ? defaultBtn + 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-2 ring-emerald-100' : defaultBtn + 'hover:bg-emerald-50 hover:text-emerald-700';
    
    renderData();
}

function setFilterCategory(c) {
    filterCategory = c;
    const defaultBtn = "px-3 py-1.5 text-[10px] font-bold rounded-full bg-white border border-gray-200 text-slate-600 shadow-sm transition-all whitespace-nowrap hover:bg-slate-100";
    const activeAllBtn = "px-3 py-1.5 text-[10px] font-bold rounded-full bg-slate-800 text-white shadow-md transition-all whitespace-nowrap";
    const activeBtn = "px-3 py-1.5 text-[10px] font-bold rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 ring-2 ring-indigo-100 shadow-sm transition-all whitespace-nowrap";
    
    document.getElementById('btnCatAll').className = c === 'All' ? activeAllBtn : defaultBtn;
    document.getElementById('btnCatSampah').className = c === 'Sampah' ? activeBtn : defaultBtn;
    document.getElementById('btnCatSungai').className = c === 'Sungai' ? activeBtn : defaultBtn;
    document.getElementById('btnCatPohon').className = c === 'Pohon' ? activeBtn : defaultBtn;
    document.getElementById('btnCatPolusi').className = c === 'Polusi' ? activeBtn : defaultBtn;
    document.getElementById('btnCatBencana').className = c === 'Bencana Alam' ? activeBtn : defaultBtn;
    
    renderData();
}

function renderData() {
    updateFilterCounts(); 
    updateVoteStats();

    const listEl = document.getElementById('reportList');
    listEl.innerHTML = '';
    
    if (markersGroup) {
        markersGroup.clearLayers();
    }

    // Apply Filters
    let filteredReports = reports;
    if (filterStatus !== 'All') filteredReports = filteredReports.filter(r => r.status === filterStatus);
    if (filterCategory !== 'All') filteredReports = filteredReports.filter(r => r.category === filterCategory);

    const sortedReports = [...filteredReports].sort((a,b) => {
        if (a.status === 'Green' && b.status !== 'Green') return 1;
        if (b.status === 'Green' && a.status !== 'Green') return -1;
        return b.votes - a.votes;
    });

    if(sortedReports.length === 0) {
        listEl.innerHTML = `
        <div class="text-center py-12 flex flex-col items-center justify-center opacity-60">
            <div class="bg-slate-100 p-4 rounded-full mb-3"><svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
            <div class="text-sm text-slate-500 font-bold">Tidak ada laporan yang sesuai filter.</div>
        </div>`;
    }

    sortedReports.forEach(report => {
        const conf = getStatusConfig(report.status);
        
        // Add Marker with dynamic color if map is ready
        if (markersGroup) {
            const marker = L.marker([report.lat, report.lng], { icon: getMarkerIcon(report.status) }).addTo(markersGroup);
            marker.bindPopup(`<b class="font-bold font-sans">${report.title}</b><br><span class="text-xs text-slate-500">${conf.text}</span>`);
            marker.on('click', () => openDetail(report.id));
        }

        const card = document.createElement('div');
        card.className = "group bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col gap-3 shrink-0 relative overflow-hidden";
        card.onclick = () => openDetail(report.id);
        
        const opacityClass = report.status === 'Green' ? 'opacity-70' : 'opacity-100';
        
        card.innerHTML = `
            <div class="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="flex justify-between items-start gap-2 ${opacityClass} relative z-10">
                <span class="px-2.5 py-1 text-[10px] md:text-xs font-bold rounded-md ${conf.bg} ${conf.textCol} shadow-sm tracking-wide">${conf.text}</span>
                <div class="flex items-center gap-1.5 text-teal-700 ${report.userVoted && report.status !== 'Green' ? 'bg-teal-100 border border-teal-200 shadow-sm' : 'bg-slate-50 border border-slate-100'} px-2.5 py-1 rounded-md text-[10px] md:text-xs font-extrabold transition-colors">
                    <span class="${report.userVoted ? 'scale-110' : ''} transition-transform">👍</span> ${report.votes}
                </div>
            </div>
            <h3 class="font-extrabold text-slate-800 text-sm md:text-base line-clamp-2 leading-snug ${opacityClass} group-hover:text-emerald-700 transition-colors relative z-10">${report.title}</h3>
            <div class="text-xs text-slate-500 flex items-center justify-between mt-1 ${opacityClass} relative z-10">
                <span class="font-bold bg-slate-100 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider text-slate-600">${report.category}</span>
                <span class="flex items-center gap-1 text-[10px] md:text-xs font-semibold">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
                    ${report.comments.length} Diskusi
                </span>
            </div>
        `;
        listEl.appendChild(card);
    });
}

// MODALS
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

function openDetail(id) {
    const r = reports.find(x => x.id === id);
    if(!r) return;
    currentReportId = id;

    document.getElementById('detailImage').style.backgroundImage = `url('${r.image}')`;
    document.getElementById('detailTitle').textContent = r.title;
    
    const conf = getStatusConfig(r.status);
    const badge = document.getElementById('detailBadge');
    badge.textContent = conf.text;
    badge.className = `px-3 py-1 text-[10px] font-extrabold rounded-md shadow-sm tracking-wide ${conf.bg} ${conf.textCol}`;
    
    document.getElementById('detailCatBadge').textContent = r.category;

    document.getElementById('detailAuthor').textContent = r.author;
    document.getElementById('detailDate').textContent = r.date;
    document.getElementById('detailDesc').textContent = r.desc;
    
    updateActionUI(r);
    renderComments(r.comments);
    openModal('detailModal');
}

function updateActionUI(r) {
    const voteBtn = document.getElementById('voteBtn');
    const volBtn = document.getElementById('volunteerBtn');
    
    if (r.status === 'Green') {
        voteBtn.innerHTML = `👍 <span class="text-sm">(${r.votes})</span> Vote Ditutup`;
        voteBtn.className = "group flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 text-slate-400 font-bold rounded-xl border border-gray-100 cursor-not-allowed shadow-none";
        voteBtn.onclick = null;
        
        volBtn.innerHTML = `🤝 Relawan Ditutup`;
        volBtn.className = "group flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 text-slate-400 font-bold rounded-xl border border-gray-100 cursor-not-allowed shadow-none";
        volBtn.onclick = null;
    } else {
        if (r.userVoted) {
            voteBtn.innerHTML = `<span class="group-hover:scale-110 transition-transform">👍</span> <span class="text-sm">(${r.votes})</span> Batal Vote`;
            voteBtn.className = "group flex items-center justify-center gap-2 py-3 px-4 bg-teal-100 hover:bg-teal-200 text-teal-800 font-extrabold rounded-xl transition-all border border-teal-300 shadow-inner cursor-pointer";
        } else {
            voteBtn.innerHTML = `<span class="group-hover:scale-110 transition-transform opacity-70">👍</span> <span class="text-sm">(${r.votes})</span> Vote Up`;
            voteBtn.className = "group flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-teal-50 text-slate-600 hover:text-teal-700 font-bold rounded-xl transition-all border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer";
        }
        voteBtn.onclick = handleVoteClick; 
        
        if (!r.volunteerList) r.volunteerList = [];
        const isVolunteered = isLoggedIn && r.volunteerList.includes(currentUser.email);
        
        if (isVolunteered) {
            volBtn.innerHTML = `🤝 Sudah Jadi Relawan`;
            volBtn.className = "group flex items-center justify-center gap-2 py-3 px-4 bg-teal-50 text-teal-700 font-extrabold rounded-xl transition-all border border-teal-200 shadow-sm cursor-default";
            volBtn.onclick = () => showToast("Anda sudah terdaftar sebagai relawan!");
        } else {
            volBtn.innerHTML = `<span class="group-hover:rotate-12 transition-transform">🤝</span> Jadi Relawan`;
            volBtn.className = "group flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 cursor-pointer";
            volBtn.onclick = handleVolunteer;
        }
    }
}

// COMMENTS
function renderComments(comments) {
    const list = document.getElementById('commentsList');
    list.innerHTML = '';
    
    if (comments.length === 0) {
        list.innerHTML = `<div class="text-[11px] text-slate-400 italic text-center py-4 bg-slate-50/50 rounded-xl border border-dashed border-gray-200">Belum ada diskusi, jadilah yang pertama!</div>`;
        return;
    }

    comments.forEach(c => {
        const isUser = c.name === currentUser?.name;
        const div = document.createElement('div');
        div.className = `flex gap-3 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm ${isUser ? 'border-l-4 border-l-emerald-400' : ''}`;
        
        const avatar = isUser ? currentUser.initial : c.name.charAt(0);
        const avaColor = isUser ? 'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200';
        
        div.innerHTML = `
            <div class="w-8 h-8 rounded-full ${avaColor} border flex items-center justify-center font-extrabold text-xs shrink-0 shadow-sm">${avatar}</div>
            <div>
                <div class="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                    ${c.name}
                    ${isUser ? '<span class="bg-emerald-100 text-emerald-700 text-[8px] px-1.5 py-0.5 rounded-full">Anda</span>' : ''}
                </div>
                <div class="text-xs text-slate-600 mt-1 font-medium leading-relaxed">${c.text}</div>
            </div>
        `;
        list.appendChild(div);
    });
}

function checkCommentAuth(e) {
    if (!isLoggedIn) {
        e.target.blur();
        requireAuth(() => {});
    }
}

function submitComment(e) {
    e.preventDefault();
    requireAuth(() => {
        const input = document.getElementById('inputComment');
        const r = reports.find(x => x.id === currentReportId);
        r.comments.push({ name: currentUser.name, text: input.value });
        input.value = '';
        
        saveDB();
        addPoints(2, "Diskusi positif!"); 
        
        renderComments(r.comments);
        renderData();
        
        // Scroll to bottom of comments
        const cList = document.getElementById('commentsList');
        cList.scrollTop = cList.scrollHeight;
    });
}

// ACTIONS
function toggleVote() {
    const r = reports.find(x => x.id === currentReportId);
    if (r.status === 'Green') return; 
    
    if (r.userVoted) {
        r.votes--;
        r.userVoted = false;
        showToast("Vote dibatalkan.");
    } else {
        r.votes++;
        r.userVoted = true;
        addPoints(1, "Apresiasi yang bagus!");
    }
    saveDB();
    updateActionUI(r);
    renderData(); 
}

function doVolunteer() {
    const r = reports.find(x => x.id === currentReportId);
    if (r.status === 'Green') return; 
    
    if (!r.volunteerList) r.volunteerList = [];
    if (r.volunteerList.includes(currentUser.email)) {
        showToast("Anda sudah terdaftar sebagai relawan!");
        return;
    }
    
    r.volunteers++;
    r.volunteerList.push(currentUser.email);
    if(r.status === 'Red') r.status = 'Yellow'; 
    
    saveDB();
    addPoints(50, "Mulia sekali! Anda terdaftar sebagai relawan!");
    
    closeModal('detailModal');
    renderData();
}

function submitForm(e) {
    e.preventDefault();
    const locStr = document.getElementById('inputLocation').value;
    if(!locStr) { showToast("Silakan pilih lokasi dari peta!"); return; }
    const loc = locStr.split(',');
    
    const category = document.getElementById('inputCategory').value;
    const fileInput = document.getElementById('inputFile');
    
    let defaultImg = "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400";
    if(category === 'Sungai') defaultImg = "https://images.unsplash.com/photo-1621451537084-482c73073e0f?auto=format&fit=crop&q=80&w=400";
    if(category === 'Pohon') defaultImg = "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=400";
    if(category === 'Polusi') defaultImg = "https://images.unsplash.com/photo-1611273426858-450d8e3c9cce?auto=format&fit=crop&q=80&w=400";
    if(category === 'Bencana Alam') defaultImg = "https://images.unsplash.com/photo-1542080681-b52d382432af?auto=format&fit=crop&q=80&w=400";

    const processSubmit = (imageUrl) => {
        const newReport = {
            id: Date.now(),
            title: document.getElementById('inputTitle').value,
            category: category,
            status: "Red", votes: 1, userVoted: true, volunteers: 0, author: currentUser.name, date: "Baru Saja",
            lat: parseFloat(loc[0]), lng: parseFloat(loc[1]),
            desc: document.getElementById('inputDesc').value,
            image: imageUrl,
            comments: [],
            volunteerList: []
        };
        reports.unshift(newReport);
        saveDB();
        document.getElementById('laporForm').reset();
        document.getElementById('inputLocation').value = ''; 
        closeModal('laporModal');
        
        addPoints(10, "Laporan berhasil diverifikasi!");
        
        setFilterStatus('All');
        setFilterCategory('All');
    };

    if (fileInput && fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            processSubmit(evt.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        processSubmit(defaultImg);
    }
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');
    setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-4');
    }, 3500);
}

// APP INITIALIZATION
window.onload = () => {
    initMap();
    if (isLoggedIn) {
        updateAuthUI();
    }
};
