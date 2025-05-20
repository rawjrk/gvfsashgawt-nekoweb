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
  bytes: new NumericInputRange("from", "to", (event) => {
    moshedImage.setDatamoshRange(...controls.bytes.getRange());
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
  /** @type {File} */
  const file = event.target.files[0];
  const mimeType = getMimeType(file);
  await moshedImage.loadFromBlob(file);

  controls.bytes.setRangeMax(file.size);

  const moshFrom = 0; // TODO: calculate to skip metadata
  const moshTo = 1; // TODO: calculate to skip metadata

  controls.bytes.setTo(moshTo);
  controls.bytes.setFrom(moshFrom);
  enableAllControls();

  const datamoshBackground = () => {
    const content = moshedImage.generateMoshedBase64();
    const imageData = `url("data:${mimeType};base64,${content}")`;
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

  if (controls.bytes.isFocused()) {
    return;
  }

  switch (event.code) {
    case "Digit9":
      controls.bytes.decrementFrom();
      return;

    case "Digit0":
      controls.bytes.incrementFrom();
      return;

    case "Minus":
      controls.bytes.decrementTo();
      return;

    case "Equal":
      controls.bytes.incrementTo();
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

/**
 * Generate MIME type base on file's extension.
 * @param {File} file
 * @returns {string} corresponding MIME type
 */
function getMimeType(file) {
  const extension = file.name.split(".").at(-1).toLowerCase();

  if (extension === "jpg") {
    return "image/jpeg";
  }

  return `image/${extension}`;
}
