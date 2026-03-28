const PROCESSED_ATTR = 'data-ytpop-processed'
const STYLES_ID = 'ytpop-styles'

/**
 * Inject our CSS directly into the YouTube page's <head>.
 * This is necessary because extension.js traps imported CSS
 * inside its own shadow DOM, where it can't affect YouTube's DOM.
 */
function injectPageStyles() {
  if (document.getElementById(STYLES_ID)) return

  const style = document.createElement('style')
  style.id = STYLES_ID
  style.textContent = `
    /* Ensure thumbnail containers are positioning contexts */
    ytd-thumbnail,
    ytm-shorts-lockup-view-model,
    .yt-lockup-view-model__content-image {
      position: relative !important;
      display: block !important;
    }

    /* Play Button Wrapper (Shadow DOM Host) — hidden by default, shown via JS */
    .ytpop-shadow-wrapper {
      opacity: 0 !important;
      transition: opacity 0.2s ease, transform 0.15s ease !important;
      transform: scale(0.85) !important;
    }

    .ytpop-shadow-wrapper--visible {
      opacity: 1 !important;
      transform: scale(1) !important;
    }

    /* Popup Overlay — must be higher than play buttons */
    .ytpop-overlay {
      position: fixed !important;
      inset: 0 !important;
      z-index: 2147483647 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: rgba(0, 0, 0, 0) !important;
      transition: background 0.25s ease !important;
      pointer-events: none !important;
    }

    .ytpop-overlay--visible {
      background: rgba(0, 0, 0, 0.85) !important;
      pointer-events: all !important;
    }

    /* Popup Container */
    .ytpop-container {
      position: relative !important;
      width: 90vw !important;
      max-width: var(--ytpop-popup-width, 900px) !important;
      border-radius: 12px !important;
      overflow: visible !important;
      box-shadow:
        0 0 0 1px rgba(255, 255, 255, 0.08),
        0 24px 80px rgba(0, 0, 0, 0.6) !important;
      background: #0f0f0f !important;
      opacity: 0 !important;
      transform: scale(0.92) translateY(20px) !important;
      transition: opacity 0.3s ease, transform 0.3s ease !important;
    }

    .ytpop-overlay--visible .ytpop-container {
      opacity: 1 !important;
      transform: scale(1) translateY(0) !important;
    }

    /* Responsive iframe (16:9) */
    .ytpop-iframe-wrap {
      position: relative !important;
      width: 100% !important;
      padding-top: 56.25% !important;
      background: #000 !important;
      border-radius: 12px !important;
      overflow: hidden !important;
    }

    .ytpop-iframe-wrap iframe {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      border: none !important;
    }

    /* Close Button */
    .ytpop-close-btn {
      position: absolute !important;
      top: -40px !important;
      right: 0 !important;
      z-index: 10 !important;
      width: 32px !important;
      height: 32px !important;
      border: none !important;
      border-radius: 50% !important;
      background: rgba(255, 255, 255, 0.12) !important;
      color: #fff !important;
      font-size: 16px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: background 0.2s ease, transform 0.15s ease !important;
      line-height: 1 !important;
    }

    .ytpop-close-btn:hover {
      background: rgba(255, 255, 255, 0.25) !important;
      transform: scale(1.1) !important;
    }

    .ytpop-close-btn:active {
      transform: scale(0.95) !important;
    }

    /* Miniplayer buttons */
    .ytpop-ctrl-btn {
      position: absolute !important;
      top: -40px !important;
      z-index: 10 !important;
      height: 32px !important;
      max-width: 32px !important;
      padding: 0 9px !important;
      border: 1px solid rgba(255, 255, 255, 0.3) !important;
      border-radius: 16px !important;
      background: transparent !important;
      color: #fff !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      font-family: inherit !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: flex-start !important;
      overflow: hidden !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    .ytpop-ctrl-btn:hover { 
      max-width: 140px !important; 
      padding: 0 12px !important; 
      background: rgba(255, 255, 255, 0.1) !important; 
      border-color: rgba(255, 255, 255, 0.6) !important; 
    }
    .ytpop-ctrl-btn svg { flex-shrink: 0 !important; }
    .ytpop-ctrl-btn:active { transform: scale(0.95) !important; }

    .ytpop-btn-text {
      opacity: 0 !important;
      white-space: nowrap !important;
      margin-left: 0 !important;
      transition: opacity 0.2s ease 0.1s, margin 0.3s ease !important;
    }
    .ytpop-ctrl-btn:hover .ytpop-btn-text {
      opacity: 1 !important;
      margin-left: 6px !important;
    }
    
    .ytpop-mini-btn { right: 40px !important; }
    .ytpop-max-btn { right: 40px !important; display: none !important; }

    .ytpop-overlay--miniplayer .ytpop-mini-btn { display: none !important; }
    .ytpop-overlay--miniplayer .ytpop-max-btn { display: flex !important; }

    .ytpop-overlay--miniplayer .ytpop-close-btn { right: 0 !important; top: -40px !important; }

    /* Blur and Miniplayer overlay modifiers */
    .ytpop-overlay--blur {
      backdrop-filter: blur(8px) !important;
      -webkit-backdrop-filter: blur(8px) !important;
    }

    .ytpop-overlay--miniplayer {
      background: transparent !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      pointer-events: none !important;
    }

    .ytpop-overlay--miniplayer .ytpop-container {
      position: fixed !important;
      top: var(--ytpop-mini-top, auto) !important;
      bottom: var(--ytpop-mini-bottom, 24px) !important;
      left: var(--ytpop-mini-left, auto) !important;
      right: var(--ytpop-mini-right, 24px) !important;
      width: var(--ytpop-mini-width, 400px) !important;
      max-width: calc(100vw - 48px) !important;
      transform: none !important;
      pointer-events: auto !important;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6) !important;
      z-index: 2147483647 !important;
    }

    /* Dimmed controls when in miniplayer */
    .ytpop-overlay--miniplayer .ytpop-ctrl-btn,
    .ytpop-overlay--miniplayer .ytpop-close-btn {
      background: rgba(0, 0, 0, 0.4) !important;
      backdrop-filter: blur(8px) !important;
      -webkit-backdrop-filter: blur(8px) !important;
      border-color: rgba(255, 255, 255, 0.1) !important;
    }
    .ytpop-overlay--miniplayer .ytpop-ctrl-btn:hover,
    .ytpop-overlay--miniplayer .ytpop-close-btn:hover {
      background: rgba(255, 255, 255, 0.2) !important;
      border-color: rgba(255, 255, 255, 0.6) !important;
    }
  `
  document.head.appendChild(style)
}

let popupSettings = {
  blurBackdrop: true,
  popupMode: 'page',
  popupSize: '1',
  miniSize: '1',
  miniPos: 'bottom-right'
}

// Fetch initial state
chrome.storage.local.get(popupSettings, (result) => {
  popupSettings = result
  applySettings()
})

// Listen for updates
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local') {
    for (const key in changes) {
      if (typeof changes[key].newValue !== 'undefined') {
        popupSettings[key] = changes[key].newValue
      }
    }
    applySettings()
  }
})

function applySettings() {
  const overlay = document.getElementById('ytpop-overlay')
  if (!overlay) return
  if (popupSettings.blurBackdrop) {
    overlay.classList.add('ytpop-overlay--blur')
  } else {
    overlay.classList.remove('ytpop-overlay--blur')
  }

  const pScale = parseFloat(popupSettings.popupSize) || 1
  const mScale = parseFloat(popupSettings.miniSize) || 1

  overlay.style.setProperty('--ytpop-popup-width', `${900 * pScale}px`)
  overlay.style.setProperty('--ytpop-mini-width', `${400 * mScale}px`)

  overlay.style.setProperty('--ytpop-mini-top', 'auto')
  overlay.style.setProperty('--ytpop-mini-bottom', 'auto')
  overlay.style.setProperty('--ytpop-mini-left', 'auto')
  overlay.style.setProperty('--ytpop-mini-right', 'auto')

  const pos = popupSettings.miniPos || 'bottom-right'
  if (pos.includes('top')) overlay.style.setProperty('--ytpop-mini-top', '24px')
  if (pos.includes('bottom')) overlay.style.setProperty('--ytpop-mini-bottom', '24px')
  if (pos.includes('left')) overlay.style.setProperty('--ytpop-mini-left', '24px')
  if (pos.includes('right')) overlay.style.setProperty('--ytpop-mini-right', '24px')
}

/**
 * Extract video ID from a YouTube URL/path.
 */
function extractVideoId(href) {
  if (!href) return null
  try {
    const url = new URL(href, 'https://www.youtube.com')
    const vParam = url.searchParams.get('v')
    if (vParam) return vParam
    const shortsMatch = url.pathname.match(/\/shorts\/([a-zA-Z0-9_-]+)/)
    if (shortsMatch) return shortsMatch[1]
  } catch {
    const match = href.match(/[?&]v=([a-zA-Z0-9_-]+)/)
    if (match) return match[1]
  }
  return null
}

/**
 * Robustly resolve the video ID for a thumbnail element.
 * YouTube's Polymer framework recycles DOM nodes and frequently leaves
 * the <a id="thumbnail"> href attribute stale after a tab switch.
 * We extract from the visual image src or title link instead as a priority.
 */
function resolveVideoId(thumbnailElement) {
  // 1. Image src is updated immediately when the UI changes
  const img = thumbnailElement.querySelector('img')
  if (img && img.src) {
    const match = img.src.match(/\/vi(?:_webp)?\/([a-zA-Z0-9_-]+)\//)
    if (match) return match[1]
  }

  // 2. Direct link on the element itself (yt-lockup-view-model content image)
  const directLink = thumbnailElement.querySelector('a.yt-lockup-view-model__content-image[href]')
  if (directLink && directLink.href) {
    const id = extractVideoId(directLink.href)
    if (id) return id
  }

  // 3. Title links in the parent container are often updated correctly
  const mediaContainer = thumbnailElement.closest('ytd-rich-grid-media, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-playlist-video-renderer, ytd-rich-item-renderer, ytm-shorts-lockup-view-model')
  if (mediaContainer) {
    const titleLink = mediaContainer.querySelector('a#video-title-link, a#video-title, a.shortsLockupViewModelHostOutsideMetadataEndpoint, a.yt-lockup-metadata-view-model__title')
    if (titleLink && titleLink.href) {
      const id = extractVideoId(titleLink.href)
      if (id) return id
    }
  }

  // 4. Fallback to the thumbnail's own link (may be stale)
  const link = thumbnailElement.querySelector('a#thumbnail[href*="/watch?v="], a#thumbnail[href*="/shorts/"], a.shortsLockupViewModelHostEndpoint[href*="/shorts/"]')
  if (link && link.href) {
    return extractVideoId(link.href)
  }

  return null
}

/**
 * Create the play button element to overlay on thumbnails,
 * wrapped in a Shadow DOM to isolate it from YouTube's CSS
 */
function createPlayButton(thumbnailElement, isShorts = false) {
  const positionCSS = isShorts
    ? 'bottom: 8px !important; right: 46px !important; top: auto !important; left: auto !important;'
    : 'top: 8px !important; left: 8px !important; bottom: auto !important; right: auto !important;'

  const wrapper = document.createElement('div')
  wrapper.style.cssText = `
    position: absolute !important;
    ${positionCSS}
    z-index: 2147483647 !important;
    width: 36px !important;
    height: 36px !important;
    pointer-events: auto !important;
    cursor: pointer !important;
  `
  wrapper.className = 'ytpop-shadow-wrapper'

  const shadow = wrapper.attachShadow({ mode: 'open' })

  const style = document.createElement('style')
  style.textContent = `
    .ytpop-play-btn {
      all: initial;
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.75);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      pointer-events: none;
      transition: background 0.2s ease, transform 0.15s ease;
    }

    :host(:hover) .ytpop-play-btn {
      background: rgba(255, 0, 0, 0.85);
      transform: scale(1.1);
    }

    :host(:active) .ytpop-play-btn {
      transform: scale(0.95);
    }

    .ytpop-play-icon {
      all: initial;
      display: block;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 7px 0 7px 12px;
      border-color: transparent transparent transparent #ffffff;
      margin-left: 2px;
    }
  `

  const btn = document.createElement('div')
  btn.className = 'ytpop-play-btn'

  const icon = document.createElement('span')
  icon.className = 'ytpop-play-icon'
  btn.appendChild(icon)

  shadow.appendChild(style)
  shadow.appendChild(btn)

  // Resolve videoId at click time (not scan time) so it stays correct
  // when YouTube reuses DOM elements across tab switches (Videos → Live)
  wrapper.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    const videoId = resolveVideoId(thumbnailElement)
    if (videoId) openPopup(videoId)
  })

  return wrapper
}

/**
 * Open the popup modal with a YouTube embed iframe
 */
function openPopup(videoId) {
  // Change this to your hosted embed page URL
  const EMBED_HOST = 'http://127.0.0.1:5500/public/index.html'
  const url = `${EMBED_HOST}?v=${videoId}`

  if (popupSettings.popupMode === 'window') {
    closePopup() // close overlay if it exists
    window.open(url, 'YTPopupPlayer', 'width=800,height=450')
    return
  }

  const existingOverlay = document.getElementById('ytpop-overlay')

  if (existingOverlay) {
    // If overlay exists, just swap the video source instead of rebuilding the UI
    const iframe = existingOverlay.querySelector('iframe')
    if (iframe) {
      iframe.src = url
    }
    return
  }

  const overlay = document.createElement('div')
  overlay.className = 'ytpop-overlay'
  overlay.id = 'ytpop-overlay'

  const container = document.createElement('div')
  container.className = 'ytpop-container'

  // Miniplayer button
  const miniBtn = document.createElement('button')
  miniBtn.className = 'ytpop-ctrl-btn ytpop-mini-btn'
  miniBtn.setAttribute('aria-label', 'Miniplayer')
  miniBtn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg><span class="ytpop-btn-text">MINIPLAYER</span>`
  miniBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    overlay.classList.add('ytpop-overlay--miniplayer')
  })

  // Maximize button
  const maxBtn = document.createElement('button')
  maxBtn.className = 'ytpop-ctrl-btn ytpop-max-btn'
  maxBtn.setAttribute('aria-label', 'Maximize')
  maxBtn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
    </svg><span class="ytpop-btn-text">MAXIMIZE</span>`
  maxBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    overlay.classList.remove('ytpop-overlay--miniplayer')
  })

  const closeBtn = document.createElement('button')
  closeBtn.className = 'ytpop-close-btn'
  closeBtn.setAttribute('aria-label', 'Close popup')
  closeBtn.innerHTML = '&#10005;'
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    closePopup()
  })

  const iframeWrap = document.createElement('div')
  iframeWrap.className = 'ytpop-iframe-wrap'

  const iframe = document.createElement('iframe')
  iframe.src = url
  iframe.title = 'YouTube video player'
  iframe.setAttribute('frameborder', '0')
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share')
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin')
  iframe.setAttribute('allowfullscreen', '')

  iframeWrap.appendChild(iframe)
  container.appendChild(miniBtn)
  container.appendChild(maxBtn)
  container.appendChild(closeBtn)
  container.appendChild(iframeWrap)
  overlay.appendChild(container)
  document.body.appendChild(overlay)

  // Apply initial settings mapped to variables
  applySettings()

  requestAnimationFrame(() => {
    overlay.classList.add('ytpop-overlay--visible')
  })

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePopup()
  })

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      closePopup()
      document.removeEventListener('keydown', onKeyDown)
    }
  }
  document.addEventListener('keydown', onKeyDown)
}

/**
 * Close and remove the popup modal
 */
function closePopup() {
  const overlay = document.getElementById('ytpop-overlay')
  if (overlay) {
    overlay.classList.remove('ytpop-overlay--visible')
    setTimeout(() => overlay.remove(), 200)
  }
}

/**
 * Attach mouseenter/mouseleave on a hover container to toggle the play button.
 * This is more reliable than CSS :hover because YouTube's Polymer framework
 * and touch-feedback overlays can block CSS hover propagation.
 */
function attachHoverEvents(hoverContainer, playBtn) {
  hoverContainer.addEventListener('mouseenter', () => {
    playBtn.classList.add('ytpop-shadow-wrapper--visible')
  })
  hoverContainer.addEventListener('mouseleave', () => {
    playBtn.classList.remove('ytpop-shadow-wrapper--visible')
  })
}

/**
 * Scan the page for video thumbnails and inject play buttons
 */
function scanThumbnails() {
  // 1. Classic ytd-thumbnail elements (channel pages, search results, etc.)
  const classicThumbnails = document.querySelectorAll('ytd-thumbnail')
  classicThumbnails.forEach((thumbnail) => {
    if (thumbnail.hasAttribute(PROCESSED_ATTR)) return
    const link = thumbnail.querySelector('a#thumbnail[href*="/watch?v="], a#thumbnail[href*="/shorts/"]')
    if (!link) return

    thumbnail.setAttribute(PROCESSED_ATTR, 'true')
    const playBtn = createPlayButton(thumbnail)
    thumbnail.appendChild(playBtn)
    // Hover on the thumbnail itself
    attachHoverEvents(thumbnail, playBtn)
  })

  // 2. Shorts lockup elements — place button at bottom right (below the autoplay overlay)
  const shortsModels = document.querySelectorAll('ytm-shorts-lockup-view-model')
  shortsModels.forEach((model) => {
    if (model.hasAttribute(PROCESSED_ATTR)) return
    const link = model.querySelector('a.shortsLockupViewModelHostEndpoint[href*="/shorts/"]')
    if (!link) return

    model.setAttribute(PROCESSED_ATTR, 'true')

    // Pass 'true' for isShorts to reposition it to bottom-right
    const playBtn = createPlayButton(model, true)
    model.appendChild(playBtn)

    // Hover on the whole shorts model
    attachHoverEvents(model, playBtn)
  })

  // 3. Homepage lockup elements (videos, mixes, etc.)
  const lockupLinks = document.querySelectorAll('a.yt-lockup-view-model__content-image[href*="/watch?v="]')
  lockupLinks.forEach((link) => {
    if (link.hasAttribute(PROCESSED_ATTR)) return

    link.setAttribute(PROCESSED_ATTR, 'true')
    const lockupModel = link.closest('.yt-lockup-view-model') || link
    const playBtn = createPlayButton(lockupModel)
    link.appendChild(playBtn)
    // Hover on the whole ytd-rich-item-renderer (video card) for broad hover area
    const hoverTarget = link.closest('ytd-rich-item-renderer') || lockupModel
    attachHoverEvents(hoverTarget, playBtn)
  })
}

/**
 * Initialize the extension
 */
export function initYtPop() {
  injectPageStyles()
  scanThumbnails()

  const observer = new MutationObserver((mutations) => {
    let hasAddedNodes = false
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        hasAddedNodes = true
        break
      }
    }
    if (hasAddedNodes) {
      scanThumbnails()
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })

  return observer
}
