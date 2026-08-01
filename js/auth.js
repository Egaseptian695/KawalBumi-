// AUTH STATE & GAMIFICATION
let currentUser = null;
let isLoggedIn = false;
let authMode = 'login'; 

// Restore Session
const savedAuth = localStorage.getItem(DB_AUTH);
if (savedAuth) {
    const parsed = JSON.parse(savedAuth);
    if (users[parsed.email]) {
        currentUser = users[parsed.email];
        isLoggedIn = true;
    } else {
        localStorage.removeItem(DB_AUTH);
    }
}

function updateAuthUI() {
    if (isLoggedIn) {
        document.getElementById('authSectionGuest').classList.remove('block');
        document.getElementById('authSectionGuest').classList.add('hidden');
        document.getElementById('authSectionUser').classList.remove('hidden');
        document.getElementById('authSectionUser').classList.add('flex');
        
        document.getElementById('navUserName').textContent = currentUser.name;
        document.getElementById('userPointsDisplay').innerHTML = `<span class="text-[9px]">🌟</span> Pahlawan Bumi Lv.${currentUser.level} (${currentUser.points} Poin)`;
        
        // Update Avatar in Navbar
        const navAvatars = document.querySelectorAll('#authSectionUser .rounded-xl, #authSectionUser .rounded-lg');
        if(navAvatars.length > 0) {
            navAvatars[0].innerHTML = `
                ${currentUser.initial}
                <div class="absolute -bottom-1 -right-1 md:-bottom-1.5 md:-right-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[8px] md:text-[9px] font-black w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm" title="Level ${currentUser.level}">${currentUser.level}</div>
            `;
        }
        
        // Update Profile Modal
        document.getElementById('profileName').textContent = currentUser.name;
        document.getElementById('profileEmail').textContent = currentUser.email;
        document.getElementById('profileAvatarInitial').textContent = currentUser.initial;
        document.getElementById('profilePointsText').textContent = currentUser.points;
        document.getElementById('profileRankText').textContent = `Pahlawan Bumi Lv.${currentUser.level}`;
        document.getElementById('profileLevelBadge').textContent = currentUser.level;
        
        const targetPoints = currentUser.level >= 3 ? 1000 : 500;
        let pct = (currentUser.points / targetPoints) * 100;
        if(pct > 100) pct = 100;
        document.getElementById('profileProgressBar').style.width = pct + '%';
    } else {
        document.getElementById('authSectionGuest').classList.remove('hidden');
        document.getElementById('authSectionGuest').classList.add('block');
        document.getElementById('authSectionUser').classList.remove('flex');
        document.getElementById('authSectionUser').classList.add('hidden');
    }
}

function toggleAuthMode(mode) {
    authMode = mode;
    const tabLogin = document.getElementById('tabLogin');
    const tabReg = document.getElementById('tabRegister');
    const nameField = document.getElementById('authNameField');
    const submitBtn = document.getElementById('authSubmitBtn');
    const title = document.getElementById('loginModalTitle');
    const promo = document.getElementById('authPromoText');
    
    const activeTabClass = "flex-1 py-3 text-sm font-extrabold border-b-2 border-emerald-500 text-emerald-700 transition-colors";
    const inactiveTabClass = "flex-1 py-3 text-sm font-extrabold border-b-2 border-transparent text-slate-400 hover:text-slate-600 transition-colors";

    if (mode === 'login') {
        tabLogin.className = activeTabClass;
        tabReg.className = inactiveTabClass;
        nameField.classList.add('hidden');
        document.getElementById('inputAuthName').removeAttribute('required');
        submitBtn.textContent = 'Masuk Sekarang';
        title.textContent = 'Masuk Akun';
        promo.textContent = 'Dengan masuk, Anda dapat mengumpulkan Poin Kontribusi sebagai Pahlawan Lingkungan!';
    } else {
        tabLogin.className = inactiveTabClass;
        tabReg.className = activeTabClass;
        nameField.classList.remove('hidden');
        document.getElementById('inputAuthName').setAttribute('required', 'true');
        submitBtn.textContent = 'Buat Akun Baru';
        title.textContent = 'Daftar Warga Baru';
        promo.textContent = 'Daftar sekarang dan dapatkan 50 Poin Kontribusi pertama Anda secara instan! 🎁';
    }
}

function handleAuth(e) {
    e.preventDefault();
    const email = document.getElementById('inputAuthEmail').value;
    const password = document.getElementById('inputAuthPassword').value;

    if (authMode === 'register') {
        const newName = document.getElementById('inputAuthName').value;
        if (users[email]) {
            showToast("Email sudah terdaftar!");
            return;
        }
        users[email] = { 
            name: newName || "Warga Baru", 
            initial: (newName || "W").charAt(0).toUpperCase(), 
            points: 50, 
            level: 1,
            email: email,
            password: password
        };
        currentUser = users[email];
        saveDB();
        showToast("Berhasil mendaftar! Selamat datang pahlawan baru. (+50 Poin)");
    } else {
        if (users[email] && users[email].password === password) {
            currentUser = users[email];
            saveDB();
            showToast("Berhasil masuk. Mari kumpulkan Poin!");
        } else {
            showToast("Email atau Password salah!");
            return;
        }
    }
    isLoggedIn = true;
    updateAuthUI();
    closeModal('loginModal');
}

function logout() {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem(DB_AUTH);
    updateAuthUI();
    closeModal('profileModal');
    showToast("Anda telah keluar.");
}

function requireAuth(actionFunction) {
    if (!isLoggedIn) {
        openModal('loginModal');
        showToast("Silakan masuk terlebih dahulu.");
    } else {
        actionFunction();
    }
}

function addPoints(amount, msg) {
    currentUser.points += amount;
    if(currentUser.points >= 500 && currentUser.level < 3) {
        currentUser.level = 3;
        showToast(`Level Up! Anda sekarang Pahlawan Bumi Lv.3! 🎉`);
    } else {
        showToast(`${msg} (+${amount} Poin)`);
    }
    users[currentUser.email] = currentUser;
    saveDB();
    updateAuthUI();
}

function handleLaporClick() { requireAuth(() => openModal('laporModal')); }
function handleVoteClick() { requireAuth(() => toggleVote()); }
function handleVolunteer() { requireAuth(() => doVolunteer()); }

function togglePasswordVisibility() {
    const input = document.getElementById('inputAuthPassword');
    const icon = document.getElementById('eyeIcon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>`; // Eye Off
    } else {
        input.type = 'password';
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>`; // Eye
    }
}
