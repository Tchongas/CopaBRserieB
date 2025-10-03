/*
  Invisible MP3 radio for GitHub Pages + OBS Browser Source (LOCAL ONLY)
  - Plays .mp3 files from a local folder in this repo (no GitHub API, no playlist file)
  - Discovers files by probing a numeric range with optional prefix/suffix
  - Random playback, nothing visible on the page

  Configure via URL query params (all optional):
  - path:   Folder path containing mp3s (default: "audio")
  - start:  Start number in range (default: 1)
  - end:    End number in range, inclusive (default: 50)
  - prefix: Filename prefix (default: "")
  - suffix: Filename suffix/extension (default: ".mp3")
  - volume: 0.0..1.0 (default: 1.0)
  - unique: 1 to avoid repeats until all have played once (default: 1)

  Filename pattern: `${path}/${prefix}${n}${suffix}` where n in [start, end]
  Example: path=audio, prefix=track_, start=1, end=10, suffix=.mp3 => audio/track_1.mp3 .. audio/track_10.mp3
*/
(function () {
  const params = new URLSearchParams(window.location.search);
  const path = (params.get('path') || 'audio').replace(/^\/+|\/+$/g, '');
  const start = parseInt(params.get('start') || '1', 10);
  const end = parseInt(params.get('end') || '50', 10);
  const prefix = params.get('prefix') || '';
  const suffix = params.get('suffix') || '.mp3';
  const volume = Math.max(0, Math.min(1, parseFloat(params.get('volume') || '1')));
  const unique = params.get('unique') !== '0';
  const autoplayParam = (params.get('autoplay') || 'auto').toLowerCase(); // auto | muted | sound

  const isOBS = !!window.obsstudio || /OBS/i.test(navigator.userAgent || '');
  function shouldStartMuted() {
    if (autoplayParam === 'muted') return true;
    if (autoplayParam === 'sound') return false;
    // auto
    return !isOBS; // In OBS we can start with sound; in browsers start muted
  }

  function fileUrl(n) {
    return `${path}/${prefix}${n}${suffix}`;
  }

  async function exists(url) {
    try {
      const res = await fetch(url, { method: 'HEAD', cache: 'no-cache' });
      return res.ok;
    } catch (_) {
      return false;
    }
  }

  async function discoverFiles() {
    const nums = [];
    for (let n = start; n <= end; n++) nums.push(n);
    const results = await Promise.all(
      nums.map(async (n) => ({ n, ok: await exists(fileUrl(n)) }))
    );
    return results.filter(r => r.ok).map(r => fileUrl(r.n));
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  async function init() {
    try {
      const files = await discoverFiles();
      if (!files.length) {
        console.warn('[radio] No MP3 files found. Checked range:', start, '-', end, 'under path:', path);
        return;
      }

      const audio = new Audio();
      audio.autoplay = true; // OBS Browser Source should allow autoplay
      audio.controls = false;
      audio.loop = false;
      audio.preload = 'auto';
      audio.volume = volume;
      audio.crossOrigin = 'anonymous';
      audio.style.display = 'none';
      document.body.appendChild(audio);
      audio.muted = shouldStartMuted();

      function attachUserGestureGate() {
        let armed = true;
        const handler = () => {
          if (!armed) return;
          armed = false;
          try { audio.muted = false; } catch (_) {}
          if (audio.paused) {
            audio.play().catch(() => {/* ignore */});
          }
          window.removeEventListener('click', handler);
          window.removeEventListener('keydown', handler);
          window.removeEventListener('touchstart', handler);
        };
        window.addEventListener('click', handler, { once: true });
        window.addEventListener('keydown', handler, { once: true });
        window.addEventListener('touchstart', handler, { once: true, passive: true });
      }

      let pool = files.slice();

      function nextSrc() {
        if (unique) {
          if (pool.length === 0) pool = files.slice();
          const idx = Math.floor(Math.random() * pool.length);
          const [url] = pool.splice(idx, 1);
          return url;
        } else {
          return pickRandom(files);
        }
      }

      async function tryPlay() {
        try {
          await audio.play();
        } catch (err) {
          // If blocked, try muting and retry; attach user gesture to unmute later
          if (err && String(err.name || err).includes('NotAllowedError')) {
            if (!audio.muted) {
              audio.muted = true;
              try { await audio.play(); return; } catch (_) {}
            }
            attachUserGestureGate();
          } else {
            console.warn('[radio] play() failed:', err);
          }
        }
      }

      function playNext() {
        const url = nextSrc();
        if (!url) return;
        audio.src = url;
        tryPlay();
      }

      audio.addEventListener('ended', playNext);
      audio.addEventListener('error', () => {
        console.error('[radio] Audio error, skipping to next track.');
        playNext();
      });

      // Minimal debug
      window.radioDebug = {
        get files() { return files.slice(); },
        get current() { return audio.currentSrc; },
        next: playNext,
        setVolume(v) { audio.volume = Math.max(0, Math.min(1, v)); },
        audio,
      };

      playNext();
    } catch (e) {
      console.error('[radio] Unexpected error:', e);
    }
  }

  init();
})();
