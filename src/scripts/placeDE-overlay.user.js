// ==UserScript==
// @name         [placeDE] r/tyles 2026
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  try to take over the canvas!
// @author       placeDE Devs
// @match        https://tyles.place/*
// @match        https://tyles.place
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png
// @updateURL    https://github.com/PlaceDE-Official/place-overlay/raw/main/src/scripts/placeDE-overlay.user.js
// @downloadURL  https://github.com/PlaceDE-Official/place-overlay/raw/main/src/scripts/placeDE-overlay.user.js
// @run-at   document-start
// ==/UserScript==

const UPDATE_INTERVAL = 30 * 1000; // ms
const OVERLAY_URL = 'https://placede-official.github.io/pixel/overlay_target.png';
const SCALE_FACTOR = 3;

const style = 'position: absolute;left: 0;top: 0;image-rendering: pixelated;z-index: 10';

let overlayImage = null;
addEventListener(
	'load',
	() => {
		console.log('[PLACEDE] Overlay loading...');

		const canvasContainer = document.querySelector('#canvas-container');
		const canvas = canvasContainer.querySelector('#chocolate-canvas');

		overlayImage = document.createElement('img');
		overlayImage.style = style;

		const syncSize = () => {
			if (!overlayImage.naturalWidth || !overlayImage.naturalHeight) return;
			const scale = canvas.clientWidth / canvas.width;
			overlayImage.style.width = (overlayImage.naturalWidth / SCALE_FACTOR) * scale + 'px';
			overlayImage.style.height = (overlayImage.naturalHeight / SCALE_FACTOR) * scale + 'px';
		};

		overlayImage.addEventListener('load', syncSize);

		const updateImage = () => (overlayImage.src = OVERLAY_URL + '?' + Date.now());

		updateImage();
		setInterval(updateImage, UPDATE_INTERVAL);
		canvasContainer.appendChild(overlayImage);

		const canvasObserver = new MutationObserver(syncSize);
		canvasObserver.observe(canvas, { attributes: true });
		new ResizeObserver(syncSize).observe(canvas);
	},
	false
);
