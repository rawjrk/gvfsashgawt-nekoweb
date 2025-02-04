/** Class representing interface to use and control `setTimeout` API. */
class Interval {
  _id;
  _onIntervalFn;
  _intervalMs;
  _active;

  /**
   * Creates an instance to set and control timeout.
   * @param {object} options configuration object
   * @param {() => void} options.onIntervalFn function that will be called
   * @param {number} options.intervalMs interval between subsequent calls (in milliseconds)
   * @param {boolean} options.initActive defines if timeout is ran on instance creation
   */
  constructor({ onIntervalFn = (f) => f, intervalMs = 1000, initActive = true }) {
    this._onIntervalFn = onIntervalFn;
    this._intervalMs = intervalMs;

    if (initActive) {
      this.run();
    }
  }

  /**
   * Changes callback function on the fly.
   * @param {() => void} fn callback
   */
  setOnIntervalFn(fn) {
    this._onIntervalFn = fn;

    if (this._active) {
      this._reload();
    }
  }

  /**
   * Changes interval length on the fly.
   * @param {number} ms interval (in milliseconds)
   */
  setIntervalMs(ms) {
    this._intervalMs = ms;

    if (this._active) {
      this._reload();
    }
  }

  /**
   * Re-creating interval to apply changes.
   */
  _reload() {
    this.stop();
    this.run();
  }

  /**
   * Creates interval from the class props to repeatedly execute callback function.
   */
  run() {
    this._active = true;
    this._id = setInterval(this._onIntervalFn, this._intervalMs);
  }

  /**
   * Executes callback function once only.
   */
  runOnce() {
    if (!this._active) {
      this._onIntervalFn();
    }
  }

  /**
   * Clears interval to stop repeated callbacks.
   */
  stop() {
    this._active = false;
    clearInterval(this._id);
  }
}
