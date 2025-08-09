const fileLength = 1000;

const fromDisplay = document.getElementById("bytes-from-display");
const toDisplay = document.getElementById("bytes-to-display");

const bytes = new RangeSlider({
  fromElem: document.getElementById("bytes-from"),
  toElem: document.getElementById("bytes-to"),
  onChange: (_, [from, to]) => {
    fromDisplay.innerText = from;
    toDisplay.innerText = to;
  },
});

bytes.enable();
bytes.setMax(2000);

console.log("Hi!");
