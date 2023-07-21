// ==UserScript==
// @name         r/placeDE Template
// @namespace    http://tampermonkey.net/
// @version      7
// @description  try to take over the canvas!
// @author       placeDE Devs
// @match        https://garlic-bread.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @updateURL    https://github.com/PlaceDE-Official/place-overlay/raw/main/src/scripts/placeDE-overlay.user.js
// @downloadURL  https://github.com/PlaceDE-Official/place-overlay/raw/main/src/scripts/placeDE-overlay.user.js
// ==/UserScript==

var updateTimer = 30000,
    src = "https://place.army/overlay_target.png",
    style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 1000px;height: 1000px;";

if(window.top !== window.self) {
    window.addEventListener("load", () => {
        const canvasContainer = document.querySelector("garlic-bread-embed").shadowRoot.querySelector("garlic-bread-canvas").shadowRoot.querySelector(".container");
        const overlayImage = document.createElement("img");
        function updateImage() {
            overlayImage.src = src + "?" + Date.now()
        }
        updateImage();
        setInterval(updateImage, updateTimer);
        overlayImage.style = style;
        canvasContainer.appendChild(overlayImage);
    }, false);
}
