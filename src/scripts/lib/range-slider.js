class RangeSlider {
  _fromSlider;
  _toSlider;
  _rangeMin = 0;
  _rangeMax = 1;

  constructor({ fromElem, toElem, onChange: onRangeChange }) {
    if (!fromElem) {
      throw TypeError('"fromElem" prop of RangeSlider should be defined');
    }
    if (!toElem) {
      throw TypeError('"toElem" prop of RangeSlider should be defined');
    }

    this._fromSlider = fromElem;
    this._toSlider = toElem;

    this._fromSlider.style.direction = "rtl"; // should be reversed for logical appearence

    this.resetBoundaries();

    this._fromSlider.oninput = (event) => {
      const value = event.target.value;
      this.setFrom(value, true);
      onRangeChange(event, this.getRange());
    };

    this._toSlider.oninput = (event) => {
      const value = event.target.value;
      this.setTo(value, true);
      onRangeChange(event, this.getRange());
    };
  }

  incrementFrom() {
    throw Error("Not Implement");
  }

  decrementFrom() {
    throw Error("Not Implement");
  }

  incrementTo() {
    throw Error("Not Implement");
  }
  decrementTo() {
    throw Error("Not Implement");
  }

  enable() {
    this._fromSlider.disabled = false;
    this._toSlider.disabled = false;
  }

  isFocused() {
    throw Error("Not Implement");
  }

  _withinBoundaries(value, min, max) {
    return Math.min(Math.max(min, value), max);
  }

  _getFromValue() {
    return Math.abs(+this._fromSlider.value);
  }

  _getToValue() {
    return +this._toSlider.value;
  }

  setFrom(value, ignoreDispatch = false) {
    const from = this._withinBoundaries(-value, this._rangeMin, this._rangeMax - 1);
    const to = Math.max(from + 1, this._getToValue());

    this._fromSlider.value = -from;
    this._toSlider.value = to;

    if (!ignoreDispatch) {
      this._fromSlider.dispatchEvent(new Event("change"));
    }
  }

  setTo(value, ignoreDispatch = false) {
    const to = this._withinBoundaries(value, this._rangeMin + 1, this._rangeMax);
    const from = Math.min(to - 1, this._getFromValue());

    this._fromSlider.value = -from;
    this._toSlider.value = to;

    if (!ignoreDispatch) {
      this._toSlider.dispatchEvent(new Event("change"));
    }
  }

  /**
   * Returns current values of the inputs.
   * @returns {[number, number]} range values listed as `[from, to]`
   */
  getRange() {
    return [this._getFromValue(), this._getToValue()];
  }

  /**
   * Sets an upper boundary of the range.
   * @param {number} value new value to be set
   */
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
