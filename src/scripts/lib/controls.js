/** Class representing interface to control `<input type="number">` element. */
class NumericInput {
  _inputElem;

  /**
   * Creates an instance of controllable numeric input.
   * @param {string} elemId DOM id to search an element by
   * @param {(event: Event) => any} onChange callback to be executed on input change
   */
  constructor(elemId, onChange) {
    this._inputElem = document.getElementById(elemId);
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
   * @param {number} newValue value to be set
   * @param {boolean} ignoreDispatch allows to skip event dispatch
   */
  setValue(newValue, ignoreDispatch = false) {
    this._inputElem.value = newValue;

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
  _fromInput;
  _toInput;
  _rangeMin = 0;
  _rangeMax = 1;

  _incrementFromBtn;
  _decrementFromBtn;
  _incrementToBtn;
  _decrementToBtn;

  /**
   * Binds "from" and "to" inputs (upper and lower boundaries of the range respectively).
   * Also binds all related buttons to control increment/decrement of each input.
   * @param {string} fromId DOM id to search for an element (and related buttons)
   * @param {string} toId DOM id to search for an element (and related buttons)
   * @param {(event: Event) => any} onChange callback to be executed on input change
   */
  constructor(fromId, toId, onChange) {
    this._fromInput = new NumericInput(fromId, (event) => {
      this.setFrom(event.target.value, true);
      onChange(event);
    });

    this._toInput = new NumericInput(toId, (event) => {
      this.setTo(event.target.value, true);
      onChange(event);
    });

    this._incrementFromBtn = document.getElementById(`increment-${fromId}`);
    this._decrementFromBtn = document.getElementById(`decrement-${fromId}`);
    this._incrementToBtn = document.getElementById(`increment-${toId}`);
    this._decrementToBtn = document.getElementById(`decrement-${toId}`);

    this._incrementFromBtn.onclick = () => this.incrementFrom();
    this._decrementFromBtn.onclick = () => this.decrementFrom();
    this._incrementToBtn.onclick = () => this.incrementTo();
    this._decrementToBtn.onclick = () => this.decrementTo();
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
    this._incrementFromBtn.disabled = false;
    this._decrementFromBtn.disabled = false;
    this._incrementToBtn.disabled = false;
    this._decrementToBtn.disabled = false;
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
   * @param {number} value value to be set
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
   * @param {number} value value to be set
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
   * @param {number} newValue value to be set
   */
  setRangeMax(newValue) {
    this._rangeMax = newValue;
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
  _inputElem;

  /**
   * Creates an instance of controllable checkbox.
   * @param {string} elemId DOM id to search an element by
   * @param {(event: Event) => any} onChange callback to be executed on input change
   */
  constructor(elemId, onChange) {
    this._inputElem = document.getElementById(elemId);
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
   * @param {boolean} newValue value to be set
   */
  setValue(newValue) {
    this._inputElem.checked = newValue;
    this._inputElem.dispatchEvent(new Event("change"));
  }

  /**
   * Set current value (checked) to the opposite. Dispatches the change event.
   */
  toggle() {
    this.setValue(!this.getValue());
  }
}
