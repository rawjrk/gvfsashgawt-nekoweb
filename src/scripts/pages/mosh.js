/**
 * @typedef {import ('../lib/datamosh.js').DatamoshedImage} DatamoshedImage
 * @typedef {import ('../lib/controls.js').NumericInputRange} NumericInputRange
 * @typedef {import ('../lib/controls.js').Checkbox} Checkbox
 * @typedef {import ('../lib/interval.js').Interval} Interval
 */

const moshedImage = new DatamoshedImage();
const animation = new Interval({ intervalMs: 90, initActive: true });

const docBody = document.querySelector("body");
const menuBar = document.querySelector("menu");
let controlsDisabled = true;

const helpModal = document.querySelector("aside");
const helpModalDiv = helpModal.querySelector("div");
const openModalBtn = document.getElementById("open-modal");
const closeModalBtn = document.getElementById("close-modal");
openModalBtn.onclick = () => toggleHidden(helpModal);
closeModalBtn.onclick = () => toggleHidden(helpModal);

helpModal.onclick = (event) => {
  const modalHidden = checkIfHidden(helpModal);
  const clickedInsideDiv = helpModalDiv.contains(event.target);

  if (!modalHidden && !clickedInsideDiv) {
    toggleHidden(helpModal);
  }
};

const controls = {
  chunks: new NumericInputRange("from", "to", (event) => {
    moshedImage.setDatamoshRange(...controls.chunks.getRange());
    animation.runOnce();
    event.target.blur();
  }),
  animated: new Checkbox("animated", (event) => {
    if (event.target.checked) {
      animation.run();
    } else {
      animation.stop();
    }
  }),
};

const filePicker = document.getElementById("file-picker");
// TODO: read query param `?url={imageUrl}` -> fetch image for datamosh if present

filePicker.onchange = async (event) => {
  const file = event.target.files[0];
  await moshedImage.loadFromBlob(file);

  const numberOfChunks = Math.floor(file.size / 3);
  controls.chunks.setRangeMax(numberOfChunks);

  const moshFrom = 115; // TODO: calculate based on file's binary
  const moshTo = 120; // TODO: calculate based on file's binary

  controls.chunks.setTo(moshTo);
  controls.chunks.setFrom(moshFrom);
  enableAllControls();

  const datamoshBackground = () => {
    const content = moshedImage.generateMoshedBase64();
    const imageData = `url("data:image/jpeg;base64,${content}")`;
    document.body.style.background = imageData;
  };

  datamoshBackground();
  menuBar.classList.add("transparent");
  animation.setOnIntervalFn(datamoshBackground);
};

window.onclick = (event) => {
  if (controlsDisabled || event.target !== docBody) {
    return;
  }

  animation.runOnce();
};

window.onkeydown = (event) => {
  if (event.ctrlKey || event.altKey) {
    return;
  }

  if (event.code === "KeyQ") {
    toggleHidden(helpModal);
    return;
  }

  const helpModalHidden = helpModal.classList.contains("hidden");
  if (!helpModalHidden) {
    return;
  }

  switch (event.code) {
    case "KeyH":
      toggleHidden(menuBar);
      return;

    case "KeyF":
      filePicker.click();
      return;

    case "KeyA":
      controls.animated.toggle();
      return;
  }

  if (controlsDisabled) {
    return;
  }

  if (event.code === "KeyG") {
    animation.runOnce();
    return;
  }

  if (controls.chunks.isFocused()) {
    return;
  }

  switch (event.code) {
    case "Digit9":
      controls.chunks.decrementFrom();
      return;

    case "Digit0":
      controls.chunks.incrementFrom();
      return;

    case "Minus":
      controls.chunks.decrementTo();
      return;

    case "Equal":
      controls.chunks.incrementTo();
      return;
  }
};

/**
 * Switches `elem` visibility (based on "hidden" class).
 * @param {HTMLElement} elem to be manipulated
 * @returns {void}
 */
function toggleHidden(elem) {
  elem.classList.toggle("hidden");
}

/**
 * Checks `elem` visibility (based on "hidden" class).
 * @param {HTMLElement} elem to be manipulated
 * @returns {boolean} if `true`, element is not visible
 */
function checkIfHidden(elem) {
  return elem.classList.contains("hidden");
}

/**
 * Marking controles prop disabled as false.
 * @returns {void}
 */
function enableAllControls() {
  controlsDisabled = false;

  for (const [key, elem] of Object.entries(controls)) {
    if (elem) {
      elem.enable();
    } else {
      console.error(`Missing "${key}" element`);
    }
  }
}
