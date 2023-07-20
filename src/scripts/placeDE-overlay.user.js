// ==UserScript==
// @name         r/placeDE Template
// @namespace    http://tampermonkey.net/
// @version      6
// @description  try to take over the canvas!
// @author       placeDE Devs
// @match        https://garlic-bread.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @updateURL    https://github.com/PlaceDE-Official/place-overlay/raw/main/src/scripts/placeDE-overlay.user.js
// @downloadURL  https://github.com/PlaceDE-Official/place-overlay/raw/main/src/scripts/placeDE-overlay.user.js
// ==/UserScript==

let overlayImage = null;
if(window.top !== window.self) {
    window.addEventListener("load", function() {
        const canvasContainer = document.querySelector("garlic-bread-embed").shadowRoot.querySelector("garlic-bread-canvas").shadowRoot.querySelector(".container");
        overlayImage = document.createElement("img");
        function updateImage() {
            overlayImage.src = "https://place.army/overlay_target.png?" + Date.now()
        }
        updateImage();
        setInterval(updateImage, 30000);
        overlayImage.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 1000px;height: 1000px;";
        canvasContainer.appendChild(overlayImage);
    }, false);
}
