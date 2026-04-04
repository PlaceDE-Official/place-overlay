// ==UserScript==
// @name         [placeDE] r/tyles 2026 Extended
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Script that adds a button to toggle an hardcoded image shown in the 2026's r/tyles canvas
// @author       max-was-here and placeDE Devs
// @match        https://tyles.place/*
// @match        https://tyles.place
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png
// @updateURL    https://github.com/PlaceDE-Official/place-overlay/raw/main/src/scripts/advanced_overlay.user.js
// @downloadURL  https://github.com/PlaceDE-Official/place-overlay/raw/main/src/scripts/advanced_overlay.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

const AO_STYLE = `
  .ao-hidden {
    display: none !important;
  }
  .ao-wrapper {
    position: absolute;
    bottom: 25px;
    right: 25px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-end;
  }
  @media (max-width : 600px) {
    .ao-wrapper {
      bottom: 85px;
    }
  }
  .ao-button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 44px;
    width: 44px;
    background-color: #fff;
    color: #000;
    font-family: var(--garlic-bread-font-pixel);
    cursor: pointer;
  }
  .ao-button:hover {
    background: linear-gradient(rgba(0, 0, 0, 0.2) 0px, rgba(0, 0, 0, 0.2) 0px), rgb(255, 255, 255);
  }
  .ao-slider-group {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .ao-opacity-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 44px;
    background-color: #fff;
    color: #000;
    font-family: var(--garlic-bread-font-pixel);
    white-space: nowrap;
    box-sizing: border-box;
  }
  .ao-slider-label {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000;
    width: 100%;
    height: 36px;
    pointer-events: none;
  }
  .ao-slider-label svg {
    width: 22px;
    height: 22px;
  }
  .ao-slider-divider {
    width: calc(100% - 8px);
    height: 1px;
    background: rgba(0, 0, 0, 0.15);
  }
  .ao-slider-track {
    position: relative;
    width: 100%;
    height: 132px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ao-slider-track::before,
  .ao-slider-track::after {
    display: block;
    position: absolute;
    z-index: 99;
    width: 100%;
    text-align: center;
    font-size: 1.5rem;
    line-height: 1;
    padding: 4px 0;
    pointer-events: none;
    mix-blend-mode: darken;
  }
  .ao-slider-track::before {
    content: "+";
    top: -6px;
  }
  .ao-slider-track::after {
    content: "−";
    bottom: -2px;
  }
  .ao-opacity-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 0;
    width: 124px;
    transform: rotate(270deg);
    outline: none;
    opacity: 1;
    cursor: row-resize;
  }
  .ao-opacity-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 36px;
    background: rgb(0, 163, 104);
    cursor: pointer;
    border-radius: 0;
  }
  .ao-opacity-slider::-moz-range-thumb {
    width: 24px;
    height: 36px;
    background: rgb(0, 163, 104);
    cursor: pointer;
    border-radius: 0;
  }
  .ao-button.ao-active,
  .ao-slider-label.ao-active {
    background-color: rgb(0, 163, 104);
    color: #fff;
  }
  .ao-button.ao-active:hover,
  .ao-slider-label.ao-active:hover {
    background: linear-gradient(rgba(0, 0, 0, 0.2) 0px, rgba(0, 0, 0, 0.2) 0px), rgb(0, 163, 104);
  }
  .ao-monitor-panel {
    position: absolute;
    top: 10px;
    right: 10px;
    display: none;
    flex-direction: column;
    gap: 2px;
    z-index: 100001;
    font-family: monospace;
    font-size: 11px;
    min-width: 180px;
  }
  .ao-monitor-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-height: 30vh;
    overflow-y: auto;
    overflow-y: overlay;
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
    -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
    mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
    transition: max-height 0.25s ease, mask-image 0.25s ease, -webkit-mask-image 0.25s ease;
  }
  .ao-monitor-list::-webkit-scrollbar {
    width: 4px;
  }
  .ao-monitor-list::-webkit-scrollbar-thumb {
    background: transparent;
  }
  .ao-monitor-list::-webkit-scrollbar-track {
    background: transparent;
  }
  .ao-monitor-panel:hover .ao-monitor-list,
  .ao-monitor-panel.ao-monitor-pinned .ao-monitor-list {
    max-height: calc(100vh - 80px);
    scrollbar-color: rgba(255,255,255,0.3) transparent;
    -webkit-mask-image: none;
    mask-image: none;
  }
  .ao-monitor-panel:hover .ao-monitor-list::-webkit-scrollbar-thumb,
  .ao-monitor-panel.ao-monitor-pinned .ao-monitor-list::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.3);
  }
  .ao-monitor-row {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 6px;
    backdrop-filter: blur(4px);
    background: rgba(0, 0, 0, 0.9);
    color: #fff;
    overflow: hidden;
    cursor: default;
    flex-shrink: 0;
  }
  .ao-monitor-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    opacity: 0.35;
    pointer-events: none;
  }
  .ao-monitor-name {
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 140px;
  }
  .ao-monitor-pct {
    position: relative;
    margin-left: 8px;
    white-space: nowrap;
  }
`;

let toggleSmallPixelButton;
let toggleFullPixelButton;

addEventListener('load', () => {
	console.log('[PLACEDE] Extended overlay loading...');

	const STORAGE_KEY = 'place-germany-2026-ostate';
	const OVERLAYS = [
		['https://placede-official.github.io/pixel/overlay_target.png', 'kleine Pixel', 3],
		['https://placede-official.github.io/pixel/default_target.png', 'große Pixel', 1]
	];
	const getConfig = (text) => {
		return text + '?' + Date.now();
	};

	let oState = {
		opacity: 100,
		monitorOpacity: 100,
		overlayIdx: 0,
		monitorEnabled: false,
		monitorUrl: 'wss://placede-monitor.devminer.xyz'
	};

	const oStateStorage = localStorage.getItem(STORAGE_KEY);
	if (oStateStorage !== null) {
		try {
			oState = Object.assign({}, oState, JSON.parse(oStateStorage));
		} catch {}
	}

	const mainContainer = document.querySelector('#app-container');
	const canvasContainer = mainContainer.querySelector('#canvas-container');
	const cursorCanvas = mainContainer.querySelector('#cursor-canvas');
	const canvas = canvasContainer.querySelector('#chocolate-canvas');
	const uiLayer = mainContainer.querySelector('#ui-layer');

	// Overlay image

	const img = document.createElement('img');
	img.style.pointerEvents = 'none';
	img.style.position = 'absolute';
	img.style.imageRendering = 'pixelated';
	img.style.top = '0px';
	img.style.left = '0px';
	img.style.zIndex = '100';
	img.style.maxWidth = 'none';

	const syncSize = () => {
		if (!img.naturalWidth || !img.naturalHeight) return;
		const divisor = OVERLAYS[oState.overlayIdx][2];
		img.style.width = img.naturalWidth / divisor + 'px';
		img.style.height = img.naturalHeight / divisor + 'px';
	};

	img.onload = () => {
		console.log('[PLACEDE] img loaded');
		img.style.opacity = oState.opacity / 100;
		syncSize();
	};

	const updateImage = () => {
		img.src = getConfig(OVERLAYS[oState.overlayIdx][0]);
		console.log('[PLACEDE] updated overlay image');
	};

	updateImage();

	setInterval(updateImage, 30000);

	// Place overlay above cursor-canvas by creating a sibling container
	const overlayContainer = document.createElement('div');
	overlayContainer.style.pointerEvents = 'none';
	overlayContainer.style.position = 'absolute';
	overlayContainer.style.top = '0';
	overlayContainer.style.left = '0';
	overlayContainer.style.zIndex = 10;

	const syncTransform = () => {
		overlayContainer.style.zoom = canvasContainer.style.zoom;
		overlayContainer.style.transform = canvasContainer.style.transform;
	};
	syncTransform();

	new MutationObserver(syncTransform).observe(canvasContainer, {
		attributes: true,
		attributeFilter: ['style']
	});

	cursorCanvas.parentElement.appendChild(overlayContainer);
	overlayContainer.appendChild(img);

	// Canvas size observer
	new MutationObserver(syncSize).observe(canvas, { attributes: true });
	new ResizeObserver(syncSize).observe(canvas);

	// Monitor mode (for getting outlines and diff updates)
	const monitorCanvas = document.createElement('canvas');
	monitorCanvas.style.pointerEvents = 'none';
	monitorCanvas.style.position = 'absolute';
	monitorCanvas.style.top = '0px';
	monitorCanvas.style.left = '0px';
	monitorCanvas.style.zIndex = '101';
	monitorCanvas.style.display = 'none';
	overlayContainer.appendChild(monitorCanvas);

	const monitorPanel = document.createElement('div');
	monitorPanel.classList.add('ao-monitor-panel');
	monitorPanel.addEventListener('click', () => {
		monitorPanel.classList.toggle('ao-monitor-pinned');
	});
	mainContainer.appendChild(monitorPanel);

	const monitorList = document.createElement('div');
	monitorList.classList.add('ao-monitor-list');
	monitorPanel.appendChild(monitorList);

	const getFormattedCompletionText = (artwork, outputEta=false) => {
		let text = artwork.completion.toFixed(1) + '%';
		// prepend ">" or "<", if rounded to 0.0% or 100.0%
		if (text === '0.0%' && artwork.completion > 0) {
			text = '> 0.0%';
		} else if (text === '100.0%' && artwork.completion < 100) {
			text = '< 100.0%';
		}
		// append ETA, if present and requested
		if (outputEta && artwork.eta_seconds != null && artwork.eta_seconds > 0) {
			const mins = Math.floor(artwork.eta_seconds / 60);
			const secs = Math.floor(artwork.eta_seconds % 60);
			text += mins > 0 ? ` (${mins}m${secs}s)` : ` (${secs}s)`;
		}
		return text;
	}

	const updateMonitorPanel = () => {
		const sorted = [...monitorArtworks.values()].sort((a, b) => a.completion - b.completion);
		monitorList.innerHTML = '';

		for (const art of sorted) {
			const hue = (art.completion / 100) * 120;
			const row = document.createElement('div');
			row.classList.add('ao-monitor-row');

			const bar = document.createElement('div');
			bar.classList.add('ao-monitor-bar');
			bar.style.width = art.completion + '%';
			bar.style.background = `hsl(${hue}, 100%, 45%)`;

			const name = document.createElement('span');
			name.classList.add('ao-monitor-name');
			name.textContent = art.name;
			name.title = art.name;

			const pctText = getFormattedCompletionText(art, outputEta=true);

			const pct = document.createElement('span');
			pct.classList.add('ao-monitor-pct');
			pct.textContent = pctText;

			row.appendChild(bar);
			row.appendChild(name);
			row.appendChild(pct);
			monitorList.appendChild(row);
		}
	};

	let monitorWs = null;
	let monitorReconnectTimer = null;
	const monitorArtworks = new Map();
	let hoveredArtwork = null;
	let fadingOutArtwork = null; // stays at full alpha during fade-out
	let hoverFadeFrom = 0;
	let hoverFadeTarget = 0;
	let hoverFadeStart = performance.now();
	let hoverFadeAnim = null;
	const FADE_DURATION = 150;

	const getHoverFade = () => {
		const t = Math.min(1, (performance.now() - hoverFadeStart) / FADE_DURATION);
		return hoverFadeFrom + (hoverFadeTarget - hoverFadeFrom) * t;
	};

	const animateHoverFade = () => {
		drawMonitorOutlines();
		if (getHoverFade() !== hoverFadeTarget) {
			hoverFadeAnim = requestAnimationFrame(animateHoverFade);
		} else {
			hoverFadeAnim = null;
			fadingOutArtwork = null;
		}
	};

	const setHoverFadeTarget = (target) => {
		hoverFadeFrom = getHoverFade();
		hoverFadeTarget = target;
		hoverFadeStart = performance.now();
		if (hoverFadeAnim !== null) cancelAnimationFrame(hoverFadeAnim);
		hoverFadeAnim = requestAnimationFrame(animateHoverFade);
	};

	const drawMonitorOutlines = () => {
		const w = canvas.width;
		const h = canvas.height;
		if (!w || !h) return;

		const rect = canvas.getBoundingClientRect();
		const displayScale = rect.width / w;
		const dpr = window.devicePixelRatio || 1;
		const maxDim = 4096;
		const scale = Math.min(displayScale * dpr, maxDim / Math.max(w, h)) * 2;

		const pad = 14; // pixels of padding for labels outside canvas bounds
		monitorCanvas.width = Math.round((w + pad * 2) * scale);
		monitorCanvas.height = Math.round((h + pad * 2) * scale);
		const cssW = parseFloat(canvas.style.width) || w;
		const cssH = parseFloat(canvas.style.height) || h;
		const cssPad = pad * (cssW / w);
		monitorCanvas.style.width = cssW + cssPad * 2 + 'px';
		monitorCanvas.style.height = cssH + cssPad * 2 + 'px';
		monitorCanvas.style.left = -cssPad + 'px';
		monitorCanvas.style.top = -cssPad + 'px';

		monitorCanvas.style.opacity = oState.monitorOpacity / 100;

		const ctx = monitorCanvas.getContext('2d');
		ctx.scale(scale, scale);
		ctx.translate(pad, pad);

		const currentFade = getHoverFade();
		for (const art of monitorArtworks.values()) {
			const isHovered = hoveredArtwork === art.name;
			const isKeepVisible = art.name === fadingOutArtwork;
			const alpha = isHovered || isKeepVisible ? 1 : 1 - currentFade;
			if (alpha <= 0) continue;

			ctx.globalAlpha = alpha;

			const pct = art.completion;
			// Color: red (0°) → orange (30°) → green (120°) via HSL
			const hue = (pct / 100) * 120;
			const color = `hsl(${hue}, 100%, 45%)`;

			ctx.strokeStyle = color;
			ctx.lineWidth = 1;
			ctx.strokeRect(art.x - 0.5, art.y - 0.5, art.width + 1, art.height + 1);

			ctx.font = '3px monospace';

			let pctLabel = getFormattedCompletionText(art);
			const pctMetrics = ctx.measureText(pctLabel);
			const pctH = 4;
			const pctW = pctMetrics.width + 2;
			const pctX = art.x + art.width - pctW;
			const pctY = art.y;

			ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
			ctx.fillRect(pctX, pctY, pctW, pctH);
			ctx.fillStyle = color;
			ctx.fillText(pctLabel, pctX + 1, pctY + 3);

			if (art.eta_seconds != null && art.eta_seconds > 30) {
				const mins = Math.floor(art.eta_seconds / 60);
				const secs = Math.floor(art.eta_seconds % 60);
				const etaLabel = mins > 0 ? `${mins}m${secs}s` : `${secs}s`;
				const etaMetrics = ctx.measureText(etaLabel);
				const etaW = etaMetrics.width + 2;
				const etaH = 4;
				const etaX = art.x;
				const etaY = art.y;

				ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
				ctx.fillRect(etaX, etaY, etaW, etaH);
				ctx.fillStyle = color;
				ctx.fillText(etaLabel, etaX + 1, etaY + 3);
			}

			if (isHovered) {
				ctx.font = '6px monospace';
				const metrics = ctx.measureText(art.name);
				const labelH = 7;
				const labelW = metrics.width + 2;
				const labelX = art.x;
				const labelY = art.y - labelH;

				ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
				ctx.fillRect(labelX, labelY, labelW, labelH);

				ctx.fillStyle = color;
				ctx.fillText(art.name, labelX + 1, labelY + 5.5);
			}
		}
		ctx.globalAlpha = 1;
	};

	document.addEventListener('mousemove', (e) => {
		if (!oState.monitorEnabled || monitorArtworks.size === 0) return;

		// figure out which canvas pixel the user is hovering over, so we can select
		// the artwork

		const rect = canvas.getBoundingClientRect();
		const px = ((e.clientX - rect.left) / rect.width) * canvas.width;
		const py = ((e.clientY - rect.top) / rect.height) * canvas.height;

		let hit = null;
		for (const art of monitorArtworks.values()) {
			if (px >= art.x && px < art.x + art.width && py >= art.y && py < art.y + art.height) {
				hit = art.name;
				break;
			}
		}

		if (hit !== hoveredArtwork) {
			const wasHovering = hoveredArtwork !== null;
			if (wasHovering && !hit) {
				fadingOutArtwork = hoveredArtwork;
			}
			hoveredArtwork = hit;
			if (!!hit !== wasHovering) {
				setHoverFadeTarget(hit ? 1 : 0);
			} else {
				drawMonitorOutlines();
			}
		}
	});

	let monitorDrawPending = false;
	const scheduleMonitorRedraw = () => {
		if (!oState.monitorEnabled || monitorDrawPending) return;
		monitorDrawPending = true;
		requestAnimationFrame(() => {
			monitorDrawPending = false;
			drawMonitorOutlines();
		});
	};

	new MutationObserver(scheduleMonitorRedraw).observe(canvas, { attributes: true });
	new ResizeObserver(scheduleMonitorRedraw).observe(canvas);
	new MutationObserver(scheduleMonitorRedraw).observe(canvasContainer, {
		attributes: true,
		attributeFilter: ['style']
	});

	const monitorConnect = () => {
		if (monitorWs) {
			monitorWs.onclose = null;
			monitorWs.close();
		}
		if (monitorReconnectTimer) {
			clearTimeout(monitorReconnectTimer);
			monitorReconnectTimer = null;
		}

		console.log('[PLACEDE] Monitor connecting to', oState.monitorUrl);
		monitorWs = new WebSocket(oState.monitorUrl);

		monitorWs.onopen = () => {
			console.log('[PLACEDE] Monitor connected');
		};

		monitorWs.onmessage = (event) => {
			let msg;
			try {
				msg = JSON.parse(event.data);
			} catch {
				return;
			}

			if (msg.type === 'full') {
				monitorArtworks.clear();
				for (const a of msg.artworks) {
					monitorArtworks.set(a.name, a);
				}
			} else if (msg.type === 'update') {
				for (const a of msg.artworks) {
					const existing = monitorArtworks.get(a.name);
					if (existing) {
						existing.correct_pixels = a.correct_pixels;
						existing.completion = a.completion;
						existing.eta_seconds = a.eta_seconds;
					}
				}
			}

			drawMonitorOutlines();
			updateMonitorPanel();
		};

		monitorWs.onclose = () => {
			console.log('[PLACEDE] Monitor disconnected, reconnecting in 3s...');
			monitorReconnectTimer = setTimeout(monitorConnect, 3000);
		};

		monitorWs.onerror = (err) => {
			console.error('[PLACEDE] Monitor error:', err);
			monitorWs.close();
		};
	};

	const monitorDisconnect = () => {
		if (monitorReconnectTimer) {
			clearTimeout(monitorReconnectTimer);
			monitorReconnectTimer = null;
		}
		if (monitorWs) {
			monitorWs.onclose = null;
			monitorWs.close();
			monitorWs = null;
		}
		monitorArtworks.clear();
		monitorList.innerHTML = '';
		const ctx = monitorCanvas.getContext('2d');
		ctx.clearRect(0, 0, monitorCanvas.width, monitorCanvas.height);
	};

	let monitorSliderEl = null;

	const updateMonitorSliderVisibility = () => {
		if (!monitorSliderEl) return;
		const track = monitorSliderEl.querySelector('.ao-slider-track');
		const divider = monitorSliderEl.querySelector('.ao-slider-divider');
		if (track) track.classList.toggle('ao-hidden', !oState.monitorEnabled);
		if (divider) divider.classList.toggle('ao-hidden', !oState.monitorEnabled);
	};

	const toggleMonitor = (button) => {
		oState.monitorEnabled = !oState.monitorEnabled;
		monitorCanvas.style.display = oState.monitorEnabled ? 'block' : 'none';
		monitorPanel.style.display = oState.monitorEnabled ? 'flex' : 'none';
		button.classList.toggle('ao-active', oState.monitorEnabled);
		updateMonitorSliderVisibility();

		if (oState.monitorEnabled) {
			monitorConnect();
		} else {
			monitorDisconnect();
		}
		saveState();
	};

	if (oState.monitorEnabled) {
		monitorCanvas.style.display = 'block';
		monitorPanel.style.display = 'flex';
		monitorConnect();
	}

	const styleContainer = document.createElement('style');
	styleContainer.innerHTML = AO_STYLE;
	mainContainer.appendChild(styleContainer);

	const buttonsWrapper = document.createElement('div');
	buttonsWrapper.classList.add('ao-wrapper');

	uiLayer.appendChild(buttonsWrapper);

	const saveState = () => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(oState));
	};

	const changeOpacity = (e) => {
		oState.opacity = e.target.value;
		img.style.opacity = oState.opacity / 100;
		saveState();
	};

	const updateSwitchButtonState = () => {
		if (oState.overlayIdx === 0) {
			toggleFullPixelButton.classList.add('ao-hidden');
			toggleSmallPixelButton.classList.remove('ao-hidden');
		} else {
			toggleSmallPixelButton.classList.add('ao-hidden');
			toggleFullPixelButton.classList.remove('ao-hidden');
		}
	};

	const switchOverlay = () => {
		oState.overlayIdx = (oState.overlayIdx + 1) % OVERLAYS.length;
		updateImage();
		img.style.opacity = oState.opacity / 100;
		updateSwitchButtonState();
		saveState();
	};

	const exportScreenshot = () => {
		const canvas = mainContainer.querySelector('canvas');
		if (!canvas) {
			return;
		}
		const imgUrl = canvas.toDataURL('image/png');

		const downloadEl = document.createElement('a');
		downloadEl.href = imgUrl;
		downloadEl.download = `place-${Date.now()}.png`;
		downloadEl.click();
		downloadEl.remove();
	};

	const addButton = (content, title, onClick) => {
		const button = document.createElement('button');
		button.classList.add('ao-button', 'outlined', 'dropshadow');
		button.onclick = onClick;
		button.innerHTML = content;
		button.title = title;
		buttonsWrapper.appendChild(button);

		return button;
	};

	const addSlider = (text, min, max, val, onChange, icon) => {
		const group = document.createElement('div');
		group.classList.add('ao-slider-group');
		group.title = text;

		const opacityWrapper = document.createElement('div');
		opacityWrapper.classList.add('ao-opacity-wrapper', 'outlined', 'dropshadow');

		if (icon) {
			const label = document.createElement('div');
			label.classList.add('ao-slider-label');
			label.innerHTML = icon;
			opacityWrapper.appendChild(label);

			const divider = document.createElement('div');
			divider.classList.add('ao-slider-divider');
			opacityWrapper.appendChild(divider);
		}

		const track = document.createElement('div');
		track.classList.add('ao-slider-track');

		const opacitySlider = document.createElement('input');
		opacitySlider.classList.add('ao-opacity-slider');
		opacitySlider.type = 'range';
		opacitySlider.min = min;
		opacitySlider.max = max;
		opacitySlider.value = val;
		opacitySlider.oninput = onChange;

		track.appendChild(opacitySlider);
		opacityWrapper.appendChild(track);
		group.appendChild(opacityWrapper);
		buttonsWrapper.appendChild(group);
		return group;
	};

	// All icons are from https://www.svgrepo.com/ (MIT License)
	addButton(
		`
        <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13C9 14.6569 10.3431 16 12 16Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 16.8V9.2C3 8.0799 3 7.51984 3.21799 7.09202C3.40973 6.71569 3.71569 6.40973 4.09202 6.21799C4.51984 6 5.0799 6 6.2 6H7.25464C7.37758 6 7.43905 6 7.49576 5.9935C7.79166 5.95961 8.05705 5.79559 8.21969 5.54609C8.25086 5.49827 8.27836 5.44328 8.33333 5.33333C8.44329 5.11342 8.49827 5.00346 8.56062 4.90782C8.8859 4.40882 9.41668 4.08078 10.0085 4.01299C10.1219 4 10.2448 4 10.4907 4H13.5093C13.7552 4 13.8781 4 13.9915 4.01299C14.5833 4.08078 15.1141 4.40882 15.4394 4.90782C15.5017 5.00345 15.5567 5.11345 15.6667 5.33333C15.7216 5.44329 15.7491 5.49827 15.7803 5.54609C15.943 5.79559 16.2083 5.95961 16.5042 5.9935C16.561 6 16.6224 6 16.7454 6H17.8C18.9201 6 19.4802 6 19.908 6.21799C20.2843 6.40973 20.5903 6.71569 20.782 7.09202C21 7.51984 21 8.0799 21 9.2V16.8C21 17.9201 21 18.4802 20.782 18.908C20.5903 19.2843 20.2843 19.5903 19.908 19.782C19.4802 20 18.9201 20 17.8 20H6.2C5.0799 20 4.51984 20 4.09202 19.782C3.71569 19.5903 3.40973 19.2843 3.21799 18.908C3 18.4802 3 17.9201 3 16.8Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
		'Screenshot',
		exportScreenshot
	);

	toggleSmallPixelButton = addButton(
		`
        <svg fill="#000000" width="32px" height="32px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
          <path d="M168,96v64a7.99977,7.99977,0,0,1-8,8H96a7.99977,7.99977,0,0,1-8-8V96a7.99977,7.99977,0,0,1,8-8h64A7.99977,7.99977,0,0,1,168,96Zm56-48V208a16.01833,16.01833,0,0,1-16,16H48a16.01833,16.01833,0,0,1-16-16V48A16.01833,16.01833,0,0,1,48,32H208A16.01833,16.01833,0,0,1,224,48ZM208.01025,207.99953,208,48H48V208H208Z"/>
        </svg>
      `,
		`Switch Overlay\n(kleine Pixel)`,
		switchOverlay
	);
	toggleFullPixelButton = addButton(
		`
        <svg fill="#000000" width="32px" height="32px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
          <g opacity="1">
            <rect x="40" y="40" width="176" height="176" rx="8"/>
          </g>
          <path d="M208,224H48a16.018,16.018,0,0,1-16-16V48A16.0181,16.0181,0,0,1,48,32H208a16.0181,16.0181,0,0,1,16,16V208A16.018,16.018,0,0,1,208,224ZM48,48V208H208l.01-.00049L208,48Z"/>
        </svg>
      `,
		`Switch Overlay\n(große Pixel)`,
		switchOverlay
	);
	updateSwitchButtonState();

	addSlider(
		'Overlay Opacity',
		0,
		100,
		oState.opacity,
		changeOpacity,
		`
        <svg fill="#000000" viewBox="0 0 32.00 32.00" id="icon" xmlns="http://www.w3.org/2000/svg" data-darkreader-inline-fill="" style="--darkreader-inline-fill: var(--darkreader-background-000000, #000000);" transform="rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;}</style><style class="darkreader darkreader--sync" media="screen"></style></defs><title>opacity</title><rect x="6" y="6" width="4" height="4"></rect><rect x="10" y="10" width="4" height="4"></rect><rect x="14" y="6" width="4" height="4"></rect><rect x="22" y="6" width="4" height="4"></rect><rect x="6" y="14" width="4" height="4"></rect><rect x="14" y="14" width="4" height="4"></rect><rect x="22" y="14" width="4" height="4"></rect><rect x="6" y="22" width="4" height="4"></rect><rect x="14" y="22" width="4" height="4"></rect><rect x="22" y="22" width="4" height="4"></rect><rect x="18" y="10" width="4" height="4"></rect><rect x="10" y="18" width="4" height="4"></rect><rect x="18" y="18" width="4" height="4"></rect><rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"></rect></g></svg>
      `
	);

	const changeMonitorOpacity = (e) => {
		oState.monitorOpacity = e.target.value;
		monitorCanvas.style.opacity = oState.monitorOpacity / 100;
		saveState();
	};
	monitorSliderEl = addSlider(
		'Monitor Opacity',
		0,
		100,
		oState.monitorOpacity,
		changeMonitorOpacity,
		`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
			<rect x="7" y="7" width="4" height="4" stroke="currentColor" stroke-width="1.5"/>
			<rect x="13" y="12" width="5" height="6" stroke="currentColor" stroke-width="1.5"/>
		</svg>`
	);
	const monitorToggle = monitorSliderEl.querySelector('.ao-slider-label');
	monitorToggle.style.pointerEvents = 'auto';
	monitorToggle.style.cursor = 'pointer';
	monitorToggle.addEventListener('click', () => {
		toggleMonitor(monitorToggle);
	});
	if (oState.monitorEnabled) monitorToggle.classList.add('ao-active');
	updateMonitorSliderVisibility();
});
