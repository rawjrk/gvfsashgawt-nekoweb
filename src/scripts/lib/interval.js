class Interval {
  _id;
  _onIntervalFn;
  _intervalMs;
  _active;

  constructor({ onIntervalFn = (f) => f, intervalMs = 1000, initActive = true }) {
    this._onIntervalFn = onIntervalFn;
    this._intervalMs = intervalMs;

    if (initActive) {
      this.run();
    }
  }

  setOnIntervalFn(fn) {
    this._onIntervalFn = fn;

    if (this._active) {
      this._reload();
    }
  }

  setIntervalMs(ms) {
    this._intervalMs = ms;

    if (this._active) {
      this._reload();
    }
  }

  _reload() {
    this.stop();
    this.run();
  }

  run() {
    this._active = true;
    this._id = setInterval(this._onIntervalFn, this._intervalMs);
  }

  runOnce() {
    if (!this._active) {
      this._onIntervalFn();
    }
  }

  stop() {
    this._active = false;
    clearInterval(this._id);
  }
}
