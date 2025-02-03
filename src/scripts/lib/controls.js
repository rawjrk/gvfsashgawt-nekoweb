// TODO: add validation by range

class NumericInput {
  _inputElem;

  constructor(elemId, onChange) {
    this._inputElem = document.getElementById(elemId);
    this._inputElem.onchange = onChange;
  }

  enable() {
    this._inputElem.disabled = false;
  }

  getValue() {
    return Number(this._inputElem.value);
  }

  setValue(newValue, ignoreDispatch = false) {
    this._inputElem.value = newValue;

    if (!ignoreDispatch) {
      this._inputElem.dispatchEvent(new Event("change"));
    }
  }

  isFocused() {
    return document.activeElement === this._inputElem;
  }
}

class NumericInputRange {
  _fromInput;
  _toInput;
  _rangeMin = 0;
  _rangeMax = 1;

  _incrementFromBtn;
  _decrementFromBtn;
  _incrementToBtn;
  _decrementToBtn;

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

  incrementFrom() {
    this.setFrom(this._fromInput.getValue() + 1);
  }

  decrementFrom() {
    this.setFrom(this._fromInput.getValue() - 1);
  }

  incrementTo() {
    this.setTo(this._toInput.getValue() + 1);
  }

  decrementTo() {
    this.setTo(this._toInput.getValue() - 1);
  }

  enable() {
    this._fromInput.enable();
    this._toInput.enable();
    this._incrementFromBtn.disabled = false;
    this._decrementFromBtn.disabled = false;
    this._incrementToBtn.disabled = false;
    this._decrementToBtn.disabled = false;
  }

  isFocused() {
    return this._fromInput.isFocused() || this._toInput.isFocused();
  }

  _withinBoundaries(value, min, max) {
    return Math.min(Math.max(min, value), max);
  }

  setFrom(value, ignoreDispatch = false) {
    const from = this._withinBoundaries(value, this._rangeMin, this._rangeMax - 1);
    const to = Math.max(from + 1, this._toInput.getValue());

    this._fromInput.setValue(from, ignoreDispatch);
    this._toInput.setValue(to, ignoreDispatch);
  }

  setTo(value, ignoreDispatch) {
    const to = this._withinBoundaries(value, this._rangeMin + 1, this._rangeMax);
    const from = Math.min(to - 1, this._fromInput.getValue());

    this._toInput.setValue(to, ignoreDispatch);
    this._fromInput.setValue(from, ignoreDispatch);
  }

  setRangeMax(newValue) {
    this._rangeMax = newValue;
  }

  getRange() {
    return [this._fromInput.getValue(), this._toInput.getValue()];
  }
}

class Checkbox {
  _inputElem;

  constructor(elemId, onChange) {
    this._inputElem = document.getElementById(elemId);
    this._inputElem.onchange = onChange;
  }

  enable() {
    this._inputElem.disabled = false;
  }

  getValue() {
    return this._inputElem.checked;
  }

  setValue(newValue) {
    this._inputElem.checked = newValue;
    this._inputElem.dispatchEvent(new Event("change"));
  }

  toggle() {
    this.setValue(!this.getValue());
  }
}
