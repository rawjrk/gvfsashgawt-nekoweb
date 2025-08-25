/** Class representing interface to control two related `<input type="range">` element and validate their values. */
class RangeSlider {
  /** @type {HTMLElement} */
  _fromSlider;
  /** @type {HTMLElement} */
  _toSlider;
  /** @type {number} */
  _rangeMin = 0;
  /** @type {number} */
  _rangeMax = 1;

  /**
   * Creates an instance of controllable range input.
   * @param {object} props {...properties}
   * @param {HTMLElement} props.fromElem input as DOM element
   * @param {HTMLElement} props.toElem input as DOM element
   * @param {(event: Event) => void} props.onChange callback to be executed on input change
   */
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

  /**
   * Increases value of "from" input by 1.
   * @throws `Error("Not Implemented")`
   */
  incrementFrom() {
    throw Error("Not Implemented");
  }

  /**
   * Decreases value of "from" input by 1.
   * @throws `Error("Not Implemented")`
   */
  decrementFrom() {
    throw Error("Not Implemented");
  }

  /**
   * Increases value of "to" input by 1.
   * @throws `Error("Not Implemented")`
   */
  incrementTo() {
    throw Error("Not Implemented");
  }

  /**
   * Decreases value of "to" input by 1.
   * @throws `Error("Not Implemented")`
   */
  decrementTo() {
    throw Error("Not Implemented");
  }

  /**
   * Enables both inputs (from/to).
   */
  enable() {
    this._fromSlider.disabled = false;
    this._toSlider.disabled = false;
  }

  /**
   * Checks if either "from" or "to" is on focus.
   * @throws {Error} "Not Implemented"
   */
  isFocused() {
    throw Error("Not Implemented");
  }

  /**
   * Validates value to stay within specified boundaries.
   * @param {number} value value to validate
   * @param {number} min lower boundary (inclusive)
   * @param {number} max upper boundary (inclusive)
   * @returns {number} validated value
   */
  _enforceBoundaries(value, min, max) {
    return Math.min(Math.max(min, value), max);
  }

  /**
   * Returns current value of "from" input.
   * @returns {number} parsed input value
   */
  _getFromValue() {
    return Math.abs(+this._fromSlider.value);
  }

  /**
   * Returns current value of "to" input.
   * @returns {number} parsed input value
   */
  _getToValue() {
    return +this._toSlider.value;
  }

  /**
   * Changes input value of "from" input (overrides "to" if overlappin).
   * Dispatches the change event by default.
   * @param {number} value new value to be set
   * @param {boolean} ignoreDispatch allows to skip event dispatch
   */
  setFrom(value, ignoreDispatch = false) {
    const from = this._enforceBoundaries(-value, this._rangeMin, this._rangeMax - 1);
    const to = Math.max(from + 1, this._getToValue());

    this._fromSlider.value = -from;
    this._toSlider.value = to;

    if (!ignoreDispatch) {
      this._fromSlider.dispatchEvent(new Event("change"));
    }
  }

  /**
   * Changes input value of "to" input (overrides "from" if overlappin).
   * Dispatches the change event by default.
   * @param {number} value new value to be set
   * @param {boolean} ignoreDispatch allows to skip event dispatch
   */
  setTo(value, ignoreDispatch = false) {
    const to = this._enforceBoundaries(value, this._rangeMin + 1, this._rangeMax);
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

  /**
   * Sets all boundaries to a default state `[0,1]`.
   * @returns {void}
   */
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

  /**
   * Returns current boundaries of the inputs.
   * @returns {[number, number]} range values listed as `[from, to]`
   */
  getBoundaries() {
    return [this._rangeMin, this._rangeMax];
  }
}
