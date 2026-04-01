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

const updateEvery = 30 * 1000;
const src = 'https://placede-official.github.io/pixel/overlay_target.png';
const style = 'position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 1000px;height: 1000px;';

let overlayImage = null;
addEventListener(
	'load',
	() => {
		console.log('[PLACEDE] Overlay loading...');

		const canvasContainer = document.querySelector('#canvas-container');
		const canvas = canvasContainer.querySelector('canvas');

		overlayImage = document.createElement('img');
		overlayImage.style = style;

		const updateImage = () => (overlayImage.src = src + '?' + Date.now());

		updateImage();
		setInterval(updateImage, updateEvery);
		canvasContainer.appendChild(overlayImage);

		const canvasObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'attributes') {
					overlayImage.style.width = mutation.target.getAttribute('width') + 'px';
					overlayImage.style.height = mutation.target.getAttribute('height') + 'px';
				}
			});
		});

		canvasObserver.observe(canvas, {
			attributes: true
		});
	},
	false
);
