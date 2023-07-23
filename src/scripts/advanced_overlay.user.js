// ==UserScript==
// @name         r/place 2023 Canada Overlay with German tiles
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Script that adds a button to toggle an hardcoded image shown in the 2023's r/place canvas
// @author       max-was-here and placeDE Devs
// @match        https://garlic-bread.reddit.com/embed*
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png
// @updateURL    https://github.com/PlaceDE-Official/place-overlay/raw/main/src/scripts/advanced-overlay.user.js
// @downloadURL  https://github.com/PlaceDE-Official/place-overlay/raw/main/src/scripts/advanced-overlay.user.js
// @grant        none
// ==/UserScript==

let width = "2000px";
let height = "1500px";
var button = null;

if (window.top !== window.self) {
  addEventListener('load', () => {
    // ==============================================
    const STORAGE_KEY = 'place-germany-2023-ostate';
    const OVERLAYS = [
      ["https://place.army/overlay_target.png", "kleine Pixel"],
      ["https://place.army/default_target.png", "große Pixel"]
    ];
    const getConfig = (text) => {
        return text + "?" + Date.now()
    }

    let oState = {
      opacity: 100,
      overlayIdx: 0
    };

    const oStateStorage = localStorage.getItem(STORAGE_KEY);
    if(oStateStorage !== null) {
      try {
        oState = Object.assign({}, oState, JSON.parse(oStateStorage));
      } catch(e){}
    }

    const img = document.createElement('img');
    img.style.pointerEvents = 'none';
    img.style.position = 'absolute';
    img.style.imageRendering = 'pixelated';
    img.src = OVERLAYS[oState.overlayIdx][0];
    img.style.opacity = oState.opacity;
    img.style.top = '0px';
    img.style.left = '0px';
    img.style.width = width;
    img.style.height = height;
    img.style.zIndex = '100';
    img.onload = () => {
      console.log('loaded');
      img.style.opacity = oState.opacity / 100;
    };

    const mainContainer = document
      .querySelector('garlic-bread-embed')
      .shadowRoot.querySelector('.layout');
    const positionContainer = mainContainer
      .querySelector('garlic-bread-canvas')
      .shadowRoot.querySelector('.container');
    positionContainer.appendChild(img);

    // ==============================================
    // Add buttons to toggle overlay

    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.style.position = "absolute";
    buttonsWrapper.style.bottom = "25px";
    buttonsWrapper.style.right = "25px";
    mainContainer.appendChild(buttonsWrapper);

    const saveState = () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(oState));
    }

    const changeOpacity = (e) => {
      oState.opacity = e.target.value
      img.style.opacity = oState.opacity / 100;
      saveState();
    };

    const switchOverlay = () => {
      oState.overlayIdx++;
      if(oState.overlayIdx >= OVERLAYS.length){
        oState.overlayIdx = 0;
      }
      img.src = getConfig(OVERLAYS[oState.overlayIdx][0]);
      button.innerText = 'Switch Overlay\n(' + OVERLAYS[oState.overlayIdx][1] + ')';
      img.style.opacity = oState.opacity / 100;
      saveState();
    };

    const addButton = (text, onClick) => {
      button = document.createElement('button');
      button.onclick = onClick;
      button.style.width = "100px";
      button.style.height = "65px";
      button.style.backgroundColor = "#555";
      button.style.color = "white";
      button.style.border = "var(--pixel-border)";
      button.style.boxShadow = "var(--pixel-box-shadow)";
      button.style.fontFamily = "var(--garlic-bread-font-pixel)";

      button.innerText = text;

      buttonsWrapper.appendChild(button);
    };

    const addSlider = (text, min, max, val, onChange) => {
      const opacityWrapper = document.createElement('div');
      opacityWrapper.style.width = "100px";
      opacityWrapper.style.height = "45px";
      opacityWrapper.style.backgroundColor = "#555";
      opacityWrapper.style.color = "white";
      opacityWrapper.style.border = "var(--pixel-border)";
      opacityWrapper.style.boxShadow = "var(--pixel-box-shadow)";
      opacityWrapper.style.fontFamily = "var(--garlic-bread-font-pixel)";
      opacityWrapper.style.marginTop = "15px";
      opacityWrapper.style.textAlign = "center";
      opacityWrapper.innerText = text;

      const opacitySlider = document.createElement('input');
      opacitySlider.type = "range";
      opacitySlider.min = min;
      opacitySlider.max = max;
      opacitySlider.value = val;
      opacitySlider.style.webkitAppearance = "none";
      opacitySlider.style.appearance = "none";
      opacitySlider.style.height = "15px";
      opacitySlider.style.width = "95px";
      opacitySlider.style.borderRadius = "5px";
      opacitySlider.style.background = "#d3d3d3";
      opacitySlider.style.outline = "none";
      opacitySlider.oninput = onChange;

      opacityWrapper.appendChild(opacitySlider);
      buttonsWrapper.appendChild(opacityWrapper);
    };

    addButton(
      'Switch Overlay\n(kleine Pixel)',
      switchOverlay
    );
    addSlider(
      'Opacity',
      0, 100, oState.opacity,
      changeOpacity
    );
  });
}
