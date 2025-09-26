let points1 = 0;
let points2 = 0;
// Reserved for backend usage: player in-game names (IGN)
let player1IGN = '';
let player2IGN = '';

// Timer state
let timerInterval = null;
let elapsedSeconds = 0; // counts up

function formatTime(totalSeconds) {
    totalSeconds = Math.max(0, Math.floor(totalSeconds || 0));
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return `${mm}:${ss}`;
}

function updateTimerDisplay() {
    const timerEl = document.querySelector('.match-Timer .match-Timer');
    if (timerEl) timerEl.textContent = formatTime(elapsedSeconds);
}

function clearTimerInterval() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function startTimer() {
    clearTimerInterval();
    timerInterval = setInterval(() => {
        elapsedSeconds += 1;
        updateTimerDisplay();
    }, 1000);
}

function resetTimer() {
    clearTimerInterval();
    elapsedSeconds = 0;
    updateTimerDisplay();
}

function updatePoints() {
    const point1_1 = document.getElementById('point1-1');
    const point1_2 = document.getElementById('point1-2');
    const point1_3 = document.getElementById('point1-3');
    const point2_1 = document.getElementById('point2-1');
    const point2_2 = document.getElementById('point2-2');
    const point2_3 = document.getElementById('point2-3');
    
    if (point1_1) point1_1.style.visibility = points1 >= 1 ? 'visible' : 'hidden';
    if (point1_2) point1_2.style.visibility = points1 >= 2 ? 'visible' : 'hidden';
    if (point1_3) point1_3.style.visibility = points1 >= 3 ? 'visible' : 'hidden';
    if (point2_1) point2_1.style.visibility = points2 >= 1 ? 'visible' : 'hidden';
    if (point2_2) point2_2.style.visibility = points2 >= 2 ? 'visible' : 'hidden';
    if (point2_3) point2_3.style.visibility = points2 >= 3 ? 'visible' : 'hidden';
}

// URL-driven state presets: map state id -> configuration (visibility only for now)
const STATE_PRESETS = {
    1: { visible: true },
    2: { visible: true },
    3: { visible: true },
    4: { visible: false },
};

function setVisibility(visible) {
    const display = visible ? 'block' : 'none';
    const bgDisplay = visible ? 'block' : 'none';
    const matchEl = document.getElementById('match');
    const bgEl = document.getElementById('background-match');
    if (matchEl) matchEl.style.display = display;
    if (bgEl) bgEl.style.display = bgDisplay;
}

function applyFromUrl() {
    const params = new URLSearchParams(window.location.search);

    // Optional style selector via class on body (e.g., ?style=minimal)
    const styleParam = params.get('style');
    if (styleParam) {
        // Remove previous style-* classes
        document.body.className = (document.body.className || '')
            .split(' ')
            .filter(c => !c.startsWith('style-'))
            .join(' ')
            .trim();
        document.body.classList.add(`style-${styleParam}`);
    }

    // Resolve configuration from state preset (visibility only)
    const stateParam = params.get('state');
    let visibleCfg = undefined;
    if (stateParam && STATE_PRESETS[stateParam]) {
        visibleCfg = STATE_PRESETS[stateParam].visible;
    }

    // Explicit overrides via query params (points1, points2, visible, player1, player2, commentary1, commentary2, player1ign, player2ign, player1elo, player2elo, player1pb, player2pb, pb1, pb2, time, cmd1, cmd2, cmd3)
    const qPoints1 = params.get('points1');
    const qPoints2 = params.get('points2');
    const qVisible = params.get('visible');
    const qPlayer1 = params.get('player1');
    const qPlayer2 = params.get('player2');
    const qCommentary1 = params.get('commentary1');
    const qCommentary2 = params.get('commentary2');
    const qPlayer1IGN = params.get('player1ign');
    const qPlayer2IGN = params.get('player2ign');
    const qPlayer1ELO = params.get('player1elo');
    const qPlayer2ELO = params.get('player2elo');
    const qPlayer1PB = params.get('player1pb');
    const qPlayer2PB = params.get('player2pb');
    const qPB1 = params.get('pb1');
    const qPB2 = params.get('pb2');
    const qTime = params.get('time');
    const qTimer = params.get('timer'); // 1 starts timer, 0 resets to 00:00
    const qCmd1 = params.get('cmd1');
    const qCmd2 = params.get('cmd2');
    const qCmd3 = params.get('cmd3');

    // Apply points from query if present
    if (qPoints1 !== null) points1 = Math.max(0, Math.min(3, parseInt(qPoints1, 10) || 0));
    if (qPoints2 !== null) points2 = Math.max(0, Math.min(3, parseInt(qPoints2, 10) || 0));
    updatePoints();

    // Apply player names if provided
    if (qPlayer1 !== null) {
        const homeTeam = document.querySelector('.home-team');
        const playerInfo1 = document.querySelector('.player-info1');
        if (homeTeam) homeTeam.textContent = qPlayer1;
        if (playerInfo1) playerInfo1.textContent = qPlayer1;
    }
    if (qPlayer2 !== null) {
        const awayTeam = document.querySelector('.away-team');
        const playerInfo2 = document.querySelector('.player-info2');
        if (awayTeam) awayTeam.textContent = qPlayer2;
        if (playerInfo2) playerInfo2.textContent = qPlayer2;
    }

    // Apply commentators if provided
    if (qCommentary1 !== null) {
        const commentary1El = document.querySelector('.comentary1');
        if (commentary1El) commentary1El.textContent = qCommentary1;
    }
    if (qCommentary2 !== null) {
        const commentary2El = document.querySelector('.comentary2');
        if (commentary2El) commentary2El.textContent = qCommentary2;
    }

    // Apply player head IGNs if provided
    if (qPlayer1IGN !== null) {
        player1IGN = qPlayer1IGN;
        const playerHead1 = document.querySelector('.player-head1');
        if (playerHead1) playerHead1.src = `http://cravatar.eu/avatar/${qPlayer1IGN}`;
    }
    if (qPlayer2IGN !== null) {
        player2IGN = qPlayer2IGN;
        const playerHead2 = document.querySelector('.player-head2');
        if (playerHead2) playerHead2.src = `http://cravatar.eu/avatar/${qPlayer2IGN}`;
    }

    // Apply ELO ratings if provided
    if (qPlayer1ELO !== null) {
        const player1EloEl = document.querySelector('.player-info1-elo');
        if (player1EloEl) player1EloEl.textContent = qPlayer1ELO;
    }
    if (qPlayer2ELO !== null) {
        const player2EloEl = document.querySelectorAll('.player-info1-elo')[1]; // Second occurrence
        if (player2EloEl) player2EloEl.textContent = qPlayer2ELO;
    }

    // Apply player PB times if provided
    if (qPlayer1PB !== null) {
        const player1PBEl = document.querySelector('.player-info1-pb');
        if (player1PBEl) player1PBEl.textContent = qPlayer1PB;
    }
    if (qPlayer2PB !== null) {
        const player2PBEl = document.querySelectorAll('.player-info1-pb')[1]; // Second occurrence
        if (player2PBEl) player2PBEl.textContent = qPlayer2PB;
    }

    // Apply PB times for pb-times section if provided
    if (qPB1 !== null) {
        const pb1El = document.querySelector('.pb-time1');
        if (pb1El) pb1El.textContent = qPB1;
    }
    if (qPB2 !== null) {
        const pb2El = document.querySelector('.pb-time2');
        if (pb2El) pb2El.textContent = qPB2;
    }

    // Apply timer/time if provided
    if (qTime !== null) {
        // If a specific time is provided, set display and internal counter accordingly
        const parts = (qTime || '').split(':');
        if (parts.length >= 2) {
            const mm = parseInt(parts[0], 10) || 0;
            const ss = parseInt(parts[1], 10) || 0;
            elapsedSeconds = Math.max(0, mm * 60 + ss);
        } else {
            elapsedSeconds = 0;
        }
        updateTimerDisplay();
    }

    if (qTimer !== null) {
        // Normalize values like '1', 'true' to start; '0', 'false', 'reset' to stop/reset
        const val = String(qTimer).toLowerCase();
        const shouldStart = (val === '1' || val === 'true' || val === 'start');
        const shouldReset = (val === '0' || val === 'false' || val === 'reset' || val === 'stop');
        if (shouldStart) {
            startTimer();
        } else if (shouldReset) {
            resetTimer();
        }
    }

    // Apply commands if provided
    if (qCmd1 !== null) {
        const cmd1El = document.querySelector('.match-commands1');
        if (cmd1El) cmd1El.textContent = qCmd1;
    }
    if (qCmd2 !== null) {
        const cmd2El = document.querySelector('.match-commands2');
        if (cmd2El) cmd2El.textContent = qCmd2;
    }
    if (qCmd3 !== null) {
        const cmd3El = document.querySelector('.match-commands3');
        if (cmd3El) cmd3El.textContent = qCmd3;
    }

    // Decide visibility: query param beats state preset; default true
    let finalVisible = true;
    if (qVisible !== null) {
        finalVisible = !(qVisible.toLowerCase() === 'false' || qVisible === '0' || qVisible.toLowerCase() === 'hidden');
    } else if (typeof visibleCfg === 'boolean') {
        finalVisible = visibleCfg;
    }
    setVisibility(finalVisible);
}

// Observe URL changes: popstate/hashchange and history API patches
(function installUrlChangeObserver() {
    const dispatch = () => window.dispatchEvent(new Event('urlchange'));
    const _pushState = history.pushState;
    const _replaceState = history.replaceState;
    history.pushState = function () { _pushState.apply(this, arguments); dispatch(); };
    history.replaceState = function () { _replaceState.apply(this, arguments); dispatch(); };
    window.addEventListener('popstate', dispatch);
    window.addEventListener('hashchange', dispatch);
    window.addEventListener('urlchange', applyFromUrl);
})();


// Initial apply based on current URL
applyFromUrl();
