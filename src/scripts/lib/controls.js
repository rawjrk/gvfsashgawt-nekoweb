/** Class representing interface to control `<input type="number">` element. */
class NumericInput {
  /** @type {HTMLElement} */
  _inputElem;

  /**
   * Creates an instance of controllable numeric input.
   * @param {object} props {...properties}
   * @param {HTMLElement} props.elem input as DOM element
   * @param {(event: Event) => void} props.onChange callback to be executed on input change
   */
  constructor({ elem, onChange }) {
    if (!elem) {
      throw TypeError('"elem" prop of NumericInput should be defined');
    }
    this._inputElem = elem;
    this._inputElem.onchange = onChange;
  }

  /**
   * Marks input prop `disabled` as false.
   */
  enable() {
    this._inputElem.disabled = false;
  }

  /**
   * Returns current value of the input.
   * @returns {number} current value
   */
  getValue() {
    return Number(this._inputElem.value);
  }

  /**
   * Changes input value. Dispatches the change event by default.
   * @param {number} value new value to be set
   * @param {boolean} ignoreDispatch allows to skip event dispatch
   */
  setValue(value, ignoreDispatch = false) {
    this._inputElem.value = value;

    if (!ignoreDispatch) {
      this._inputElem.dispatchEvent(new Event("change"));
    }
  }

  /**
   * Checks if input is on focus.
   * @returns {boolean} is focused
   */
  isFocused() {
    return document.activeElement === this._inputElem;
  }
}

/** Class representing interface to control two related numeric inputs and validate their values. */
class NumericInputRange {
  /** @type {HTMLElement} */
  _fromInput;
  /** @type {HTMLElement} */
  _toInput;
  /** @type {number} */
  _rangeMin = 0;
  /** @type {number} */
  _rangeMax = 1;

  /**
   * Binds "from" and "to" inputs (upper and lower boundaries of the range respectively).
   * Also binds all related buttons to control increment/decrement of each input.
   * @param {object} props {...properties}
   * @param {HTMLElement} props.fromElem from input as DOM element
   * @param {HTMLElement} props.toElem to input as DOM element
   * @param {(event: Event) => void} props.onChange callback to be executed on input change
   */
  constructor({ fromElem, toElem, onChange }) {
    if (!fromElem) {
      throw TypeError('"fromElem" prop of NumericInputRange should be defined');
    }
    if (!toElem) {
      throw TypeError('"toElem" prop of NumericInputRange should be defined');
    }

    this._fromInput = new NumericInput({
      elem: fromElem,
      onChange: (event) => {
        this.setFrom(event.target.value, true);
        onChange(event);
      },
    });

    this._toInput = new NumericInput({
      elem: toElem,
      onChange: (event) => {
        this.setTo(event.target.value, true);
        onChange(event);
      },
    });
  }

  /**
   * Increases value of "from" input by 1.
   */
  incrementFrom() {
    this.setFrom(this._fromInput.getValue() + 1);
  }

  /**
   * Decreases value of "from" input by 1.
   */
  decrementFrom() {
    this.setFrom(this._fromInput.getValue() - 1);
  }

  /**
   * Increases value of "to" input by 1.
   */
  incrementTo() {
    this.setTo(this._toInput.getValue() + 1);
  }

  /**
   * Decreases value of "to" input by 1.
   */
  decrementTo() {
    this.setTo(this._toInput.getValue() - 1);
  }

  /**
   * Enables all related elements (inputs/buttons).
   */
  enable() {
    this._fromInput.enable();
    this._toInput.enable();
  }

  /**
   * Checks if either "from" or "to" is on focus.
   * @returns {boolean} is focused
   */
  isFocused() {
    return this._fromInput.isFocused() || this._toInput.isFocused();
  }

  /**
   * Validates value to stay within specified boundaries.
   * @param {number} value value to validate
   * @param {number} min lower boundary (inclusive)
   * @param {number} max upper boundary (inclusive)
   * @returns {number} validated value
   */
  _withinBoundaries(value, min, max) {
    return Math.min(Math.max(min, value), max);
  }

  /**
   * Changes input value of "from" input (overrides "to" if overlappin).
   * Dispatches the change event by default.
   * @param {number} value new value to be set
   * @param {boolean} ignoreDispatch allows to skip event dispatch
   */
  setFrom(value, ignoreDispatch = false) {
    const from = this._withinBoundaries(value, this._rangeMin, this._rangeMax - 1);
    const to = Math.max(from + 1, this._toInput.getValue());

    this._fromInput.setValue(from, ignoreDispatch);
    this._toInput.setValue(to, ignoreDispatch);
  }

  /**
   * Changes input value of "to" input (overrides "from" if overlappin).
   * Dispatches the change event by default.
   * @param {number} value new value to be set
   * @param {boolean} ignoreDispatch allows to skip event dispatch
   */
  setTo(value, ignoreDispatch) {
    const to = this._withinBoundaries(value, this._rangeMin + 1, this._rangeMax);
    const from = Math.min(to - 1, this._fromInput.getValue());

    this._toInput.setValue(to, ignoreDispatch);
    this._fromInput.setValue(from, ignoreDispatch);
  }

  /**
   * Sets an upper boundary of the range.
   * @param {number} value new value to be set
   */
  setRangeMax(value) {
    this._rangeMax = value;
  }

  /**
   * Returns current values of the inputs.
   * @returns {[number, number]} range values listed as `[from, to]`
   */
  getRange() {
    return [this._fromInput.getValue(), this._toInput.getValue()];
  }
}

/** Class representing interface to control `<input type="checkbox">` element. */
class Checkbox {
  /** @type {HTMLElement} */
  _inputElem;

  /**
   * Creates an instance of controllable checkbox.
   * @param {object} props {...properties}
   * @param {HTMLElement} props.elem controlled checkbox as a DOM element
   * @param {(event: Event) => void} props.onChange callback to be executed on input change
   */
  constructor({ elem, onChange }) {
    if (!elem) {
      throw TypeError('"elem" prop of Checkbox should be defined');
    }
    this._inputElem = elem;
    this._inputElem.onchange = onChange;
  }

  /**
   * Marks input prop `disabled` as false.
   */
  enable() {
    this._inputElem.disabled = false;
  }

  /**
   * Returns current value of the input (checked).
   * @returns {boolean} current value
   */
  getValue() {
    return this._inputElem.checked;
  }

  /**
   * Changes input value (checked). Dispatches the change event.
   * @param {boolean} value new value to be set
   */
  setValue(value) {
    this._inputElem.checked = value;
    this._inputElem.dispatchEvent(new Event("change"));
  }

  /**
   * Set current value (checked) to the opposite. Dispatches the change event.
   */
  toggle() {
    this.setValue(!this.getValue());
  }
}
