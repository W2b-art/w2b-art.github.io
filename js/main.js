/* ============================================================
   W2b ART — Main JavaScript
   Handles: Film animation · Gallery rendering · Lightbox · Nav
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initFilmStrip();
  renderHomepageGalleries();
  initRevealOnScroll();
  initLightbox();
});

/* ── Navigation ─────────────────────────────────────────────── */
function initNav() {
  const nav    = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      const open = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', open);
    });
  }
}

/* ── Film Strip Animation ───────────────────────────────────── */
function initFilmStrip() {
  const scene = document.querySelector('.film-scene');
  if (!scene) return;

  buildFilmStrip();
  initFilmSlider();

  /* Trigger film unroll after canister appears */
  setTimeout(() => {
    scene.classList.add('revealed');
  }, 1600);

  /* Click canister → retract the film and smooth-scroll to the gallery
     picker below. The two motions are sequenced so the retraction is
     visible before the scroll begins, and the canister state is reset
     once the user has settled on the galleries section. */
  const trigger = document.getElementById('canister-trigger');
  const galleries = document.getElementById('galleries');
  if (!trigger || !galleries) return;

  let pendingScroll = null;
  let pendingReset  = null;
  const body = document.body;

  const openGalleries = () => {
    if (pendingScroll) clearTimeout(pendingScroll);
    if (pendingReset)  clearTimeout(pendingReset);

    scene.classList.add('retracting');

    /* Restart the rise animation each click — remove + reflow + add so
       the keyframes replay even when the class is already present. */
    body.classList.remove('galleries-revealed');
    void body.offsetWidth;
    body.classList.add('galleries-revealed');

    /* Let one frame paint the new transform state before scrolling so
       the retraction reads as an intentional motion, not a jump. */
    pendingScroll = setTimeout(() => {
      galleries.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 220);

    /* Once the rise animation and scroll have finished, restore the
       hero/canister so they are intact if the visitor scrolls back up. */
    pendingReset = setTimeout(() => {
      scene.classList.remove('retracting');
      body.classList.remove('galleries-revealed');
    }, 2000);
  };

  trigger.addEventListener('click', openGalleries);
  trigger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openGalleries();
    }
  });
}

function buildFilmStrip() {
  const container = document.getElementById('film-strip-container');
  if (!container) return;

  const lang = localStorage.getItem('w2b_lang') || 'en';

  /* STRIP_ORDER includes galleries plus extras like "about". */
  const ids = (typeof STRIP_ORDER !== 'undefined') ? STRIP_ORDER : GALLERY_ORDER;
  container.innerHTML = buildStripHTML(ids, lang);

  /* Always start the strip at frame 1 — browsers can otherwise
     restore a stale scroll position from session history. */
  container.scrollLeft = 0;
  container.scrollTop  = 0;

  /* Attach click handlers — extras carry a `url` field, galleries fall
     back to the gallery-${id}.html template. */
  document.querySelectorAll('.film-frame[data-gallery]').forEach(frame => {
    frame.addEventListener('click', () => {
      const id   = frame.getAttribute('data-gallery');
      const url  = frame.getAttribute('data-url');
      window.location.href = url || `gallery-${id}.html`;
    });
  });
}

/* Wire the film slider, prev/next buttons, and viewport scroll
   so they all stay in sync. The slider drives translateX/scrollLeft
   on desktop; on mobile the viewport scrolls vertically (feed style). */
function initFilmSlider() {
  const viewport = document.getElementById('film-strip-container');
  const slider   = document.getElementById('film-slider');
  const progress = document.getElementById('film-slider-progress');
  const prev     = document.getElementById('film-prev');
  const next     = document.getElementById('film-next');
  if (!viewport || !slider) return;

  const isMobile = () => window.innerWidth <= 768;
  const maxScroll = () => isMobile()
    ? Math.max(0, viewport.scrollHeight - viewport.clientHeight)
    : Math.max(0, viewport.scrollWidth  - viewport.clientWidth);
  const currentScroll = () => isMobile() ? viewport.scrollTop : viewport.scrollLeft;

  let syncingFromScroll = false;

  /* Slider → viewport scroll */
  slider.addEventListener('input', () => {
    if (syncingFromScroll) return;
    const max = maxScroll();
    const target = (parseFloat(slider.value) / 100) * max;
    if (isMobile()) viewport.scrollTop  = target;
    else            viewport.scrollLeft = target;
    if (progress) progress.style.width = `${slider.value}%`;
  });

  /* Viewport scroll → slider position (for wheel/drag/touch) */
  let scrollRaf = null;
  viewport.addEventListener('scroll', () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = null;
      const max = maxScroll();
      const pct = max ? (currentScroll() / max) * 100 : 0;
      syncingFromScroll = true;
      slider.value = pct;
      if (progress) progress.style.width = `${pct}%`;
      setTimeout(() => { syncingFromScroll = false; }, 30);
    });
  }, { passive: true });

  /* Prev / Next buttons step through frames */
  const stepBy = (delta) => {
    if (isMobile()) viewport.scrollBy({ top:  delta, behavior: 'smooth' });
    else            viewport.scrollBy({ left: delta, behavior: 'smooth' });
  };
  prev?.addEventListener('click', () => stepBy(-300));
  next?.addEventListener('click', () => stepBy(300));

  /* Mouse wheel anywhere over the film strip → horizontal scroll on desktop.
     On mobile, native vertical scroll already does the right thing. */
  viewport.addEventListener('wheel', (e) => {
    if (isMobile()) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      viewport.scrollLeft += e.deltaY;
    }
  }, { passive: false });

  /* Re-sync after window resize (mobile/desktop switch) */
  window.addEventListener('resize', () => {
    slider.value = 0;
    if (progress) progress.style.width = '0%';
    viewport.scrollTo({ top: 0, left: 0 });
  });
}

function buildStripHTML(galleryIds, lang) {
  /* Resolve an id from either GALLERY_DATA or STRIP_EXTRAS. */
  const resolve = (id) => GALLERY_DATA[id]
    || (typeof STRIP_EXTRAS !== 'undefined' ? STRIP_EXTRAS[id] : undefined);

  let framesHTML = galleryIds.map((id, i) => {
    const data = resolve(id);
    if (!data) return '';
    const title    = data.title[lang] || data.title.en;
    const cover    = data.images[data.coverIndex]
                     ? data.folder + data.images[data.coverIndex].file
                     : '';
    const imgHTML  = cover
      ? `<img src="${cover}" alt="${title}" loading="lazy">`
      : '';
    const isEmpty  = !cover ? ' empty' : '';
    const isExtra  = !!data.url;
    const urlAttr  = isExtra ? ` data-url="${data.url}"` : '';
    const ctaKey   = isExtra ? 'view_about' : 'view_gallery';
    const ctaText  = isExtra ? 'Read more'  : 'View Gallery';
    const frameNum = String(i + 1).padStart(2, '0');

    return `
      <div class="film-frame${isEmpty}" data-gallery="${id}"${urlAttr} data-number="${frameNum}A">
        ${imgHTML}
        <div class="film-frame-overlay">
          <span class="frame-title">${title}</span>
          <span class="frame-cta" data-i18n="${ctaKey}">${ctaText}</span>
        </div>
      </div>`;
  }).join('');

  /* Perforation holes — 4 per frame on each rail */
  const perfCount = galleryIds.length * 4;
  const perfsHTML = Array(perfCount).fill('<div class="perf"></div>').join('');

  return `
    <div class="film-strip">
      <div class="perforations">${perfsHTML}</div>
      <div class="film-frames">${framesHTML}</div>
      <div class="perforations">${perfsHTML}</div>
    </div>`;
}

/* ── Homepage Gallery Selector (Camera-Back) ────────────────── */
let _selectedGalleryIdx = 0;

function renderHomepageGalleries() {
  const wheel = document.getElementById('control-wheel');
  if (!wheel) return;

  const lang = localStorage.getItem('w2b_lang') || 'en';

  /* Build the wheel buttons (one per gallery) */
  wheel.innerHTML = GALLERY_ORDER.map((id, i) => {
    const data  = GALLERY_DATA[id];
    const title = data.title[lang] || data.title.en;
    const cover = data.images[data.coverIndex]
                  ? data.folder + data.images[data.coverIndex].file
                  : '';
    const thumbHTML = cover
      ? `<img class="seg-thumb" src="${cover}" alt="" loading="lazy">`
      : `<div class="seg-thumb seg-thumb-empty"></div>`;

    return `
      <button class="wheel-segment" data-index="${i}" data-gallery="${id}"
              role="option" aria-selected="${i === 0}">
        <span class="seg-num">${String(i + 1).padStart(2, '0')}</span>
        ${thumbHTML}
        <span class="seg-label">${title}</span>
      </button>`;
  }).join('');

  /* Click handlers on each wheel segment.
     On mobile the LCD/wheel chrome is hidden — segments are presented
     as a stacked card list, so tapping navigates directly. */
  wheel.querySelectorAll('.wheel-segment').forEach(seg => {
    seg.addEventListener('click', () => {
      const idx = parseInt(seg.dataset.index, 10);
      if (window.matchMedia('(max-width: 900px)').matches) {
        const gid = seg.dataset.gallery;
        const data = GALLERY_DATA[gid];
        const url = (data && data.url) || `gallery-${gid}.html`;
        window.location.href = url;
        return;
      }
      selectGallery(idx);
    });
  });

  /* Prev / Next arrow buttons */
  document.getElementById('wheel-prev')?.addEventListener('click', () => {
    selectGallery((_selectedGalleryIdx - 1 + GALLERY_ORDER.length) % GALLERY_ORDER.length);
  });
  document.getElementById('wheel-next')?.addEventListener('click', () => {
    selectGallery((_selectedGalleryIdx + 1) % GALLERY_ORDER.length);
  });

  /* Keyboard arrow nav */
  document.addEventListener('keydown', e => {
    const cb = document.getElementById('camera-back');
    if (!cb) return;
    const rect = cb.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      selectGallery((_selectedGalleryIdx - 1 + GALLERY_ORDER.length) % GALLERY_ORDER.length);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      selectGallery((_selectedGalleryIdx + 1) % GALLERY_ORDER.length);
    }
  });

  /* Mouse-wheel scrolling on the camera dial advances galleries.
     Throttled so a single scroll-flick steps one slot at a time. */
  const dialArea = document.querySelector('.camera-controls');
  if (dialArea) {
    let lastWheelTime = 0;
    dialArea.addEventListener('wheel', e => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTime < 280) return;
      lastWheelTime = now;
      const dir = e.deltaY > 0 ? 1 : -1;
      const next = (_selectedGalleryIdx + dir + GALLERY_ORDER.length) % GALLERY_ORDER.length;
      selectGallery(next);
    }, { passive: false });
  }

  /* Touch swipe on the dial — vertical on desktop layout, horizontal on mobile */
  if (dialArea) {
    let touchStart = null;
    dialArea.addEventListener('touchstart', e => {
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
    dialArea.addEventListener('touchend', e => {
      if (!touchStart) return;
      const dx = e.changedTouches[0].clientX - touchStart.x;
      const dy = e.changedTouches[0].clientY - touchStart.y;
      const isMobile = window.innerWidth <= 900;
      const delta = isMobile ? dx : dy;
      if (Math.abs(delta) > 30) {
        const dir = delta < 0 ? 1 : -1;
        selectGallery((_selectedGalleryIdx + dir + GALLERY_ORDER.length) % GALLERY_ORDER.length);
      }
      touchStart = null;
    }, { passive: true });
  }

  /* Initial render */
  selectGallery(0);
}

function selectGallery(idx) {
  if (idx < 0 || idx >= GALLERY_ORDER.length) return;
  _selectedGalleryIdx = idx;

  const lang  = localStorage.getItem('w2b_lang') || 'en';
  const id    = GALLERY_ORDER[idx];
  const data  = GALLERY_DATA[id];
  if (!data) return;

  const title = data.title[lang] || data.title.en;
  const desc  = (data.description && (data.description[lang] || data.description.en)) || '';
  const cover = data.images[data.coverIndex]
                ? data.folder + data.images[data.coverIndex].file
                : '';
  const count = data.images.length;

  /* Update screen content with crossfade */
  const img      = document.getElementById('screen-image');
  const titleEl  = document.getElementById('screen-title');
  const descEl   = document.getElementById('screen-desc');
  const ctaEl    = document.getElementById('screen-cta');
  const counter  = document.getElementById('screen-counter');
  const meta     = document.getElementById('screen-meta');

  const screenInfo = document.querySelector('.screen-info');
  const screenGlass = document.querySelector('.screen-glass');
  if (screenInfo)  { screenInfo.classList.remove('flicker'); void screenInfo.offsetWidth; screenInfo.classList.add('flicker'); }
  if (screenGlass) { screenGlass.classList.remove('flicker'); void screenGlass.offsetWidth; screenGlass.classList.add('flicker'); }

  if (img && cover) { img.src = cover; img.alt = title; }
  if (titleEl) titleEl.textContent = title;
  if (descEl)  descEl.textContent  = desc;
  if (ctaEl)   ctaEl.href = `gallery-${id}.html`;
  if (counter) counter.textContent = `${String(idx + 1).padStart(2, '0')}/${String(GALLERY_ORDER.length).padStart(2, '0')}`;
  if (meta)    meta.textContent = `GALLERY ${String(idx + 1).padStart(2, '0')} · ${count} FRAMES`;

  /* Update wheel selection state — re-trigger CSS pulse animation */
  document.querySelectorAll('.wheel-segment').forEach((seg, i) => {
    const isActive = i === idx;
    seg.classList.remove('active');
    if (isActive) {
      void seg.offsetWidth;       /* force reflow so animation restarts */
      seg.classList.add('active');
    }
    seg.setAttribute('aria-selected', isActive);
  });

  /* Physically scroll the wheel so the active segment lands inside
     the crimson selection window. Uses translateY so the parent's
     overflow:hidden masks the off-window items. */
  const wheel = document.getElementById('control-wheel');
  if (wheel) {
    const segHeight = 78;                              /* 74px + 4px gap */
    const viewport = wheel.parentElement.clientHeight; /* .camera-controls height */
    const wheelPad = 4;                                /* .control-wheel padding-top */
    const segCenter = wheelPad + idx * segHeight + segHeight / 2;
    const offset = (viewport / 2) - segCenter;
    wheel.style.transform = `translateY(${offset}px)`;
  }
}

/* ── Scroll Reveal ──────────────────────────────────────────── */
function initRevealOnScroll() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Gallery Page: render photo grid ───────────────────────── */
function renderGalleryPage(galleryId) {
  const data = GALLERY_DATA[galleryId];
  if (!data) return;

  const lang  = localStorage.getItem('w2b_lang') || 'en';
  const grid  = document.getElementById('photo-grid');
  const title = document.getElementById('gallery-page-title');
  const desc  = document.getElementById('gallery-page-desc');

  if (title) title.textContent = data.title[lang] || data.title.en;
  if (desc)  desc.textContent  = data.description[lang] || data.description.en;

  /* Set page title for SEO */
  document.title = `W2b — ${data.title.en}`;

  if (!grid) return;

  if (data.images.length === 0) {
    grid.innerHTML = `
      <div style="padding:4rem;text-align:center;font-family:var(--font-mono);
        font-size:0.65rem;color:var(--text-muted);letter-spacing:.1em;grid-column:1/-1">
        ADD PHOTOS TO images/${galleryId}/ AND UPDATE gallery-data.js
      </div>`;
    return;
  }

  grid.innerHTML = data.images.map((img, i) => {
    const altText = img.alt ? (img.alt[lang] || img.alt.en) : data.title.en;
    return `
      <div class="photo-item reveal" data-index="${i}">
        <img src="${data.folder}${img.file}" alt="${altText}" loading="lazy">
        <div class="photo-item-overlay">
          <span class="photo-item-name">${img.file.replace(/\.[^.]+$/, '').replace(/-/g, ' ')}</span>
        </div>
      </div>`;
  }).join('');

  /* Attach lightbox triggers */
  document.querySelectorAll('.photo-item').forEach(item => {
    item.addEventListener('click', () => {
      const idx  = parseInt(item.getAttribute('data-index'));
      openLightbox(galleryId, idx);
    });
  });

  initRevealOnScroll();
}

/* ── Lightbox ───────────────────────────────────────────────── */
let _lbGalleryId = null;
let _lbIndex     = 0;

function initLightbox() {
  const lb    = document.getElementById('lightbox');
  if (!lb) return;

  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev')?.addEventListener('click', () => shiftLightbox(-1));
  document.getElementById('lightbox-next')?.addEventListener('click', () => shiftLightbox(1));

  lb.addEventListener('click', e => {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  shiftLightbox(-1);
    if (e.key === 'ArrowRight') shiftLightbox(1);
  });
}

function openLightbox(galleryId, index) {
  _lbGalleryId = galleryId;
  _lbIndex     = index;
  updateLightbox();
  document.getElementById('lightbox')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox')?.classList.remove('open');
  document.body.style.overflow = '';
}

function shiftLightbox(dir) {
  const data = GALLERY_DATA[_lbGalleryId];
  if (!data) return;
  _lbIndex = (_lbIndex + dir + data.images.length) % data.images.length;
  updateLightbox();
}

function updateLightbox() {
  const data  = GALLERY_DATA[_lbGalleryId];
  if (!data || !data.images[_lbIndex]) return;

  const lang    = localStorage.getItem('w2b_lang') || 'en';
  const img     = data.images[_lbIndex];
  const imgEl   = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');

  if (imgEl) {
    imgEl.src = data.folder + img.file;
    imgEl.alt = img.alt ? (img.alt[lang] || img.alt.en) : '';
  }
  if (caption) {
    const t            = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang]) || {};
    const galleryTitle = (data.title && (data.title[lang] || data.title.en)) || '';
    const altText      = img.alt ? (img.alt[lang] || img.alt.en) : '';
    const total        = String(data.images.length).padStart(2, '0');
    const current      = String(_lbIndex + 1).padStart(2, '0');
    const inquireLabel = t.inquire_lightbox || 'Inquire about this print';
    const editionLine  = t.edition_label    || 'Editions of 7 + 2 AP · signed and numbered · archival pigment on cotton rag';
    const subject      = encodeURIComponent((t.inquire_subject || 'Print inquiry') + ' — ' + galleryTitle + ' #' + current);
    const body         = encodeURIComponent('Reference: ' + img.file + '\n\n');
    caption.innerHTML = `
      <span class="lightbox-caption-alt">${altText}</span>
      <span class="lightbox-caption-meta">${galleryTitle} &middot; ${current} / ${total}</span>
      <span class="lightbox-caption-edition">${editionLine}</span>
      <a class="lightbox-inquire" href="mailto:w2bphoto+prints@gmail.com?subject=${subject}&body=${body}">${inquireLabel} →</a>
    `;
  }
}
