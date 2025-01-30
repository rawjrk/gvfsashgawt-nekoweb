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

  setValue(newValue) {
    this._inputElem.value = newValue;
    this._inputElem.dispatchEvent(new Event("change"));
  }
}

class NumericInputRange {
  _fromInput;
  _toInput;
  _rangeMax = 1;

  _incrementFromBtn;
  _decrementFromBtn;
  _incrementToBtn;
  _decrementToBtn;

  constructor(fromId, toId, onChange) {
    this._fromInput = new NumericInput(fromId, (event) => {
      event.target.value = this._validateFrom(event.target.value);
      onChange();
    });

    this._toInput = new NumericInput(toId, (event) => {
      event.target.value = this._validateTo(event.target.value);
      onChange();
    });

    this._incrementFromBtn = document.getElementById(`increment-${fromId}`);
    this._decrementFromBtn = document.getElementById(`decrement-${fromId}`);
    this._incrementToBtn = document.getElementById(`increment-${toId}`);
    this._decrementToBtn = document.getElementById(`decrement-${toId}`);

    this._incrementFromBtn.onclick = () => this.setFrom(this._fromInput.getValue() + 1);
    this._decrementFromBtn.onclick = () => this.setFrom(this._fromInput.getValue() - 1);
    this._incrementToBtn.onclick = () => this.setTo(this._toInput.getValue() + 1);
    this._decrementToBtn.onclick = () => this.setTo(this._toInput.getValue() - 1);
  }

  enable() {
    this._fromInput.enable();
    this._toInput.enable();
    this._incrementFromBtn.disabled = false;
    this._decrementFromBtn.disabled = false;
    this._incrementToBtn.disabled = false;
    this._decrementToBtn.disabled = false;
  }

  _withinBoundaries(value, min, max) {
    return Math.min(Math.max(min, value), max);
  }

  _validateFrom(value) {
    const max = this._toInput.getValue() - 1;
    return this._withinBoundaries(value, 0, max);
  }

  setFrom(value) {
    const newValue = this._validateFrom(value);
    this._fromInput.setValue(newValue);
  }

  _validateTo(value) {
    const min = this._fromInput.getValue() + 1;
    const max = this._rangeMax;
    return this._withinBoundaries(value, min, max);
  }

  setTo(value) {
    const newValue = this._validateTo(value);
    this._toInput.setValue(newValue);
  }

  setRangeMax(newValue) {
    this._rangeMax = newValue;
  }

  getRange() {
    return [this._fromInput.getValue(), this._toInput.getValue()];
  }
}
