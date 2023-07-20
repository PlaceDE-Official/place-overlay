// ==UserScript==
// @name         r/placeDE Template
// @namespace    http://tampermonkey.net/
// @version      5
// @description  try to take over the canvas!
// @author       placeDE Devs
// @match        https://garlic-bread.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @updateURL    https://github.com/PlaceDE-Official/place-overlay/raw/main/src/scripts/placeDE-overlay.user.js
// @downloadURL  https://github.com/PlaceDE-Official/place-overlay/raw/main/src/scripts/placeDE-overlay.user.js
// ==/UserScript==

let baseurl = "https://place.army/overlay_target.png"
if (window.top !== window.self) {
    window.addEventListener('load', () => {
        const canvasContainer = document.getElementsByTagName("garlic-bread-embed")[0].shadowRoot.children[0].getElementsByTagName("garlic-bread-canvas")[0].shadowRoot.children[0];
        const overlayImage = document.createElement("img");
        setInterval(() => {
            overlayImage.src = `${baseurl}?${Math.random()}`;
        }, 5000);
        overlayImage.src = baseurl;
        overlayImage.style = `position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 100opx;height: 1000px;`;
        canvasContainer.appendChild(overlayImage);
    }, false);
}
