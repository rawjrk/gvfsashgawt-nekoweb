// TODO: add validation by range

class NumericInput {
  _inputElem;

  constructor(elemId, onChange) {
    this._inputElem = document.getElementById(elemId);
    this._inputElem.onchange = onChange;
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

  constructor(fromId, toId, onChange) {
    this._fromInput = new NumericInput(fromId, (event) => {
      event.target.value = this._validateFrom(event.target.value);
      onChange();
    });

    this._toInput = new NumericInput(toId, (event) => {
      event.target.value = this._validateTo(event.target.value);
      onChange();
    });

    document.getElementById(`increment-${fromId}`).onclick = () => {
      this.setFrom(this._fromInput.getValue() + 1);
    };

    document.getElementById(`decrement-${fromId}`).onclick = () => {
      this.setFrom(this._fromInput.getValue() - 1);
    };

    document.getElementById(`increment-${toId}`).onclick = () => {
      this.setTo(this._toInput.getValue() + 1);
    };

    document.getElementById(`decrement-${toId}`).onclick = () => {
      this.setTo(this._toInput.getValue() - 1);
    };
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
