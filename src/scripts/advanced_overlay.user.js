// ==UserScript==
// @name         r/place 2023 Canada Overlay with German tiles
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Script that adds a button to toggle an hardcoded image shown in the 2023's r/place canvas
// @author       max-was-here and placeDE Devs
// @match        https://garlic-bread.reddit.com/embed*
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png
// @updateURL    https://github.com/PlaceDE-Official/place-overlay/raw/main/src/scripts/advanced-overlay.user.js
// @downloadURL  https://github.com/PlaceDE-Official/place-overlay/raw/main/src/scripts/advanced-overlay.user.js
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const CANVAS_MAIN_CONTAINER_SELECTOR = "garlic-bread-embed";
  const CANVAS_MAIN_CONTAINER_SHADOW_ROOT_SELECTOR = "garlic-bread-canvas";

  const CANVAS_STYLE = Object.freeze({
    pointerEvents: "none",
    position: "absolute",
    imageRendering: "pixelated",
    top: "0px",
    left: "0px",
    width: "2000px",
    height: "1500px",
    zIndex: "100",
  });

  const SWITCHER_BUTTON_WRAPPER_STYLE = Object.freeze({
    position: "absolute",
    bottom: "25px",
    right: "25px",
  });

  const SWITCHER_BUTTON_STYLE = Object.freeze({
    width: "100px",
    height: "65px",
    backgroundColor: "#555",
    color: "white",
    border: "var(--pixel-border)",
    boxShadow: "var(--pixel-box-shadow)",
    fontFamily: "var(--garlic-bread-font-pixel)",
    backgroundImage:
      "linear-gradient(to bottom, black, black 33%, red 33%, red 66%, yellow 66%)", // Deutschlandfahne
  });

  const OPACITY_WRAPPER_STYLE = Object.freeze({
    width: "100px",
    height: "45px",
    backgroundColor: "#555",
    color: "white",
    border: "var(--pixel-border)",
    boxShadow: "var(--pixel-box-shadow)",
    fontFamily: "var(--garlic-bread-font-pixel)",
    marginTop: "15px",
    textAlign: "center",
  });

  const OPACITY_SLIDER_STYLE = Object.freeze({
    webkitAppearance: "none",
    appearance: "none",
    height: "15px",
    width: "95px",
    borderRadius: "5px",
    background: "#d3d3d3",
    outline: "none",
  });

  const OVERLAYS = Object.freeze([
    ["https://place.army/overlay_target.png", "KLEINE PIXEL"],
    ["https://place.army/default_target.png", "GROßE PIXEL"],
    [null, "OVERLAY AUS"],
  ]);

  function createCanvasCoverImage(positionContainer, state) {
    const canvasCoverImage = document.createElement("img");
    Object.assign(canvasCoverImage.style, CANVAS_STYLE);
    canvasCoverImage.onload = () => {
      canvasCoverImage.style.opacity = state.opacity / 100;
    };
    positionContainer.appendChild(canvasCoverImage);
    return canvasCoverImage;
  }

  function createSwitcherButton(STORAGE_KEY, state, changeOverlay) {
    const button = document.createElement("button");
    Object.assign(button.style, SWITCHER_BUTTON_STYLE);
    button.onclick = () => {
      state.overlayIdx = (state.overlayIdx + 1) % OVERLAYS.length;
      changeOverlay();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      button.textContent = OVERLAYS[state.overlayIdx][1];
    };
    button.textContent = OVERLAYS[state.overlayIdx][1];
    return button;
  }

  function createOpacitySlider(STORAGE_KEY, state, changeOverlay) {
    const opacitySlider = document.createElement("input");
    opacitySlider.type = "range";
    opacitySlider.min = 0;
    opacitySlider.max = 100;
    opacitySlider.value = state.opacity;
    opacitySlider.oninput = () => {
      state.opacity = opacitySlider.value;
      changeOverlay();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    };
    Object.assign(opacitySlider.style, OPACITY_SLIDER_STYLE);
    return opacitySlider;
  }

  function run() {
    const STORAGE_KEY = 'place-germany-2023-ostate';
    const state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      overlayIdx: 0,
      opacity: 50,
    };

    const mainContainer = document
      .querySelector(CANVAS_MAIN_CONTAINER_SELECTOR)
      .shadowRoot.querySelector(".layout");

    const positionContainer = mainContainer
      .querySelector(CANVAS_MAIN_CONTAINER_SHADOW_ROOT_SELECTOR)
      .shadowRoot.querySelector(".container");

    const canvasCoverImage = createCanvasCoverImage(positionContainer, state);

    const changeOverlay = () => {
      const [overlayURL] = OVERLAYS[state.overlayIdx];
      if (!overlayURL) {
        canvasCoverImage.style.opacity = 0;
        return;
      }
      canvasCoverImage.style.opacity = state.opacity / 100;
      canvasCoverImage.src = overlayURL;
    };

    const button = createSwitcherButton(STORAGE_KEY, state, changeOverlay);
    const buttonContainer = document.createElement("div");
    Object.assign(buttonContainer.style, SWITCHER_BUTTON_WRAPPER_STYLE);
    buttonContainer.appendChild(button);
    mainContainer.appendChild(buttonContainer);

    const sliderContainer = document.createElement("div");
    sliderContainer.textContent = "Transparenz";
    Object.assign(sliderContainer.style, OPACITY_WRAPPER_STYLE);

    const opacitySlider = createOpacitySlider(
      STORAGE_KEY,
      state,
      changeOverlay
    );
    sliderContainer.appendChild(opacitySlider);
    buttonContainer.appendChild(sliderContainer);

    changeOverlay();
  }

  if (window.top !== window.self) {
    window.addEventListener("load", run);
  }
})();