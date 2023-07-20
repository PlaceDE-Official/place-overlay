// ==UserScript==
// @name         r/placeDE Template
// @namespace    http://tampermonkey.net/
// @version      2
// @description  try to take over the canvas!
// @author       mp1404
// @match        https://garlic-bread.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @updateURL    https://github.com/PlaceDE-Official/place-overlay/raw/main/src/scripts/placeDE-overlay.user.js
// @downloadURL  https://github.com/PlaceDE-Official/place-overlay/raw/main/src/scripts/placeDE-overlay.user.js
// ==/UserScript==

let url = "https://place.army/overlay_target.png"
if (window.top !== window.self) {
    window.addEventListener('load', () => {
        document.getElementsByTagName("garlic-bread-embed")[0].shadowRoot.children[0].getElementsByTagName("garlic-bread-canvas")[0].shadowRoot.children[0].appendChild(
            (function () {
                const i = document.createElement("img");
                i.src = url;
                i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 1000px;height: 1000px;";
                return i;
            })())
    }, false);
}