// ==UserScript==
// @name         [placeDE] r/tyles 2026 Extended
// @namespace    http://tampermonkey.net/
// @version      1.1
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
  .ao-opacity-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 44px;
    height: 132px;
    background-color: #fff;
    color: #000;
    font-family: var(--garlic-bread-font-pixel);
    white-space: nowrap;
    box-sizing: border-box;
  }
  .ao-opacity-wrapper::before,
  .ao-opacity-wrapper::after {
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
  .ao-opacity-wrapper::before {
    content: "+";
    top: -6px;
  }
  .ao-opacity-wrapper::after {
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
`;

let toggleSmallPixelButton;
let toggleFullPixelButton;

addEventListener('load', () => {
	console.log('[PLACEDE] Extended overlay loading...');

	// ==============================================
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
		overlayIdx: 0
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

	// ==============================================
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

	// ==============================================
	// Canvas size observer

	new MutationObserver(syncSize).observe(canvas, { attributes: true });
	new ResizeObserver(syncSize).observe(canvas);

	// Add style to shadow root
	const styleContainer = document.createElement('style');
	styleContainer.innerHTML = AO_STYLE;
	mainContainer.appendChild(styleContainer);

	// ==============================================
	// Add buttons to toggle overlay

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

	const addSlider = (text, min, max, val, onChange) => {
		const opacityWrapper = document.createElement('div');
		opacityWrapper.classList.add('ao-opacity-wrapper', 'outlined', 'dropshadow');
		opacityWrapper.title = text;

		const opacitySlider = document.createElement('input');
		opacitySlider.classList.add('ao-opacity-slider');
		opacitySlider.type = 'range';
		opacitySlider.min = min;
		opacitySlider.max = max;
		opacitySlider.value = val;
		opacitySlider.oninput = onChange;
		opacitySlider.title = text;

		opacityWrapper.appendChild(opacitySlider);
		buttonsWrapper.appendChild(opacityWrapper);
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

	addSlider('Opacity', 0, 100, oState.opacity, changeOpacity);
});
