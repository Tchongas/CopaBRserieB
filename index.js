let points1 = 0;
let points2 = 0;
// Reserved for backend usage: player in-game names (IGN)
let player1IGN = '';
let player2IGN = '';

function updatePoints() {
    document.getElementById('point1-1').style.visibility = points1 >= 1 ? 'visible' : 'hidden';
    document.getElementById('point1-2').style.visibility = points1 >= 2 ? 'visible' : 'hidden';
    document.getElementById('point1-3').style.visibility = points1 >= 3 ? 'visible' : 'hidden';
    document.getElementById('point2-1').style.visibility = points2 >= 1 ? 'visible' : 'hidden';
    document.getElementById('point2-2').style.visibility = points2 >= 2 ? 'visible' : 'hidden';
    document.getElementById('point2-3').style.visibility = points2 >= 3 ? 'visible' : 'hidden';
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

    // Explicit overrides via query params (points1, points2, visible, player1, player2, commentary1, commentary2, player1ign, player2ign)
    const qPoints1 = params.get('points1');
    const qPoints2 = params.get('points2');
    const qVisible = params.get('visible');
    const qPlayer1 = params.get('player1');
    const qPlayer2 = params.get('player2');
    const qCommentary1 = params.get('commentary1');
    const qCommentary2 = params.get('commentary2');
    const qPlayer1IGN = params.get('player1ign');
    const qPlayer2IGN = params.get('player2ign');

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

    // Store IGN values for backend usage (not displayed)
    if (qPlayer1IGN !== null) player1IGN = qPlayer1IGN;
    if (qPlayer2IGN !== null) player2IGN = qPlayer2IGN;

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
