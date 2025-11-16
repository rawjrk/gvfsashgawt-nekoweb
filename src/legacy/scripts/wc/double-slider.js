class DoubleSlider extends HTMLElement {
  _fromSlider;
  _toSlider;
  _rangeMin = 0;
  _rangeMax = 1;
  _onRangeChange = () => {};

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    this._fromSlider = document.createElement("input");
    this._fromSlider.type = "range";
    this._fromSlider.disabled = true;
    this._fromSlider.style.direction = "rtl"; // should be reversed for logical appearence

    this._toSlider = document.createElement("input");
    this._toSlider.type = "range";
    this._toSlider.disabled = true;

    this.resetBoundaries();

    this._fromSlider.oninput = (event) => {
      const value = event.target.value;
      this.setFrom(value, true);
      this._onRangeChange(event, this.getRange());
    };

    this._toSlider.oninput = (event) => {
      const value = event.target.value;
      this.setTo(value, true);
      this._onRangeChange(event, this.getRange());
    };

    shadow.appendChild(this._fromSlider);
    shadow.appendChild(this._toSlider);
  }

  setOnChange(callback) {
    this._onRangeChange = callback;
  }

  incrementFrom() {
    throw Error("Not Implemented");
  }

  decrementFrom() {
    throw Error("Not Implemented");
  }

  incrementTo() {
    throw Error("Not Implemented");
  }

  decrementTo() {
    throw Error("Not Implemented");
  }

  enable() {
    this._fromSlider.disabled = false;
    this._toSlider.disabled = false;
  }

  isFocused() {
    throw Error("Not Implemented");
  }

  _enforceBoundaries(value, min, max) {
    return Math.min(Math.max(min, value), max);
  }

  get _fromValue() {
    return Math.abs(+this._fromSlider.value);
  }

  get _toValue() {
    return +this._toSlider.value;
  }

  setFrom(value, ignoreDispatch = false) {
    console.log("setFrom()");
    const from = this._enforceBoundaries(-value, this._rangeMin, this._rangeMax - 1);
    const to = Math.max(from + 1, this._toValue);

    this._fromSlider.value = -from;
    this._toSlider.value = to;

    if (!ignoreDispatch) {
      this._fromSlider.dispatchEvent(new Event("change"));
    }
  }

  setTo(value, ignoreDispatch = false) {
    const to = this._enforceBoundaries(value, this._rangeMin + 1, this._rangeMax);
    const from = Math.min(to - 1, this._fromValue);

    this._fromSlider.value = -from;
    this._toSlider.value = to;

    if (!ignoreDispatch) {
      this._toSlider.dispatchEvent(new Event("change"));
    }
  }

  getRange() {
    return [this._fromValue, this._toValue];
  }

  setMin(value) {
    this._rangeMin = value;

    this._fromSlider.max = -value;
    this._toSlider.min = value;
  }

  setMax(value) {
    this._rangeMax = value;

    this._fromSlider.min = -value;
    this._toSlider.max = value;
  }

  resetBoundaries() {
    this._rangeMin = 0;
    this._rangeMax = 1;

    this._fromSlider.min = -2;
    this._fromSlider.max = 0;
    this._fromSlider.value = -1;

    this._toSlider.min = 0;
    this._toSlider.max = 2;
    this._toSlider.value = 1;
  }

  getBoundaries() {
    return [this._rangeMin, this._rangeMax];
  }
}

customElements.define("double-slider", DoubleSlider);
