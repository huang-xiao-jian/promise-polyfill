//   private state: 'pending' | 'fulfilled' | 'rejected';

const isFunction = (value) =>
  Object.prototype.toString.call(value) === '[object Function]';
const isPlainObject = (value) =>
  Object.prototype.toString.call(value) === '[object Object]';

function Promise(executor) {
  this.status = 'pending';
  this.value = undefined;
  this.reason = undefined;
  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];

  // When rejected, a promise:
  //   must not transition to any other state.
  //   must have a reason, which must not change.
  const reject = (reason) => {
    setTimeout(() => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach((callback) => {
          callback(reason);
        });
      }
    });
  };

  // When fulfilled, a promise:
  //   must not transition to any other state.
  //   must have a value, which must not change.
  const resolve = (value) => {
    if (value instanceof Promise) {
      value.then(resolve, reject);

      return;
    }

    setTimeout(() => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach((callback) => {
          callback(value);
        });
      }
    });
  };

  try {
    executor(resolve, reject);
  } catch (err) {
    reject(err);
  }

  return this;
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    // 如果从onFulfilled中返回的x 就是promise2 就会导致循环引用报错
    reject(new TypeError('循环引用'));
  } else if (x instanceof Promise) {
    if (x.status !== 'pending') {
      x.then((value) => resolve(value), (reason) => reject(reason));
    } else {
      x.then(
        (value) => resolvePromise(promise2, value, resolve, reject),
        (reason) => reject(reason)
      );
    }
  } else if (isPlainObject(x) || isFunction(x)) {
    let then;

    // Otherwise, if x is an object or function,
    //   Let then be x.then. [3.5]
    //   If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
    try {
      then = x.then;
    } catch (e) {
      reject(e);

      return;
    }

    let called = false;

    // If then is a function, call it with x as this, first argument resolvePromise, and second argument rejectPromise, where:
    // If/when resolvePromise is called with a value y, run [[Resolve]](promise, y).
    // If/when rejectPromise is called with a reason r, reject promise with r.
    // If both resolvePromise and rejectPromise are called, or multiple calls to the same argument are made, the first call takes precedence, and any further calls are ignored.
    // If calling then throws an exception e,
    // If resolvePromise or rejectPromise have been called, ignore it.
    // Otherwise, reject promise with e as the reason.
    if (isFunction(then)) {
      try {
        then.call(
          x,
          (y) => {
            if (!called) {
              called = true;
              resolvePromise(promise2, y, resolve, reject);
            }
          },
          (reason) => {
            if (!called) {
              called = true;
              reject(reason);
            }
          }
        );
      } catch (err) {
        if (!called) {
          called = true;
          reject(err);
        }
      }
    } else {
      // If then is not a function, fulfill promise with x.
      resolve(x);
    }
  } else {
    resolve(x);
  }
}

// eslint-disable-next-line func-names
Promise.prototype.then = function(onFulfilled, onRejected) {
  // Both onFulfilled and onRejected are optional arguments:
  //   If onFulfilled is not a function, it must be ignored.
  //   If onRejected is not a function, it must be ignored.
  const onFulfilledUnify = isFunction(onFulfilled)
    ? onFulfilled
    : (value) => value;
  const onRejectedUnify = isFunction(onRejected)
    ? onRejected
    : (reason) => {
        throw reason;
      };

  if (this.status === 'fulfilled') {
    const promise2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // result 可能是 Promise 或者普通值，需要扁平化
          const result = onFulfilledUnify(this.value);

          resolvePromise(promise2, result, resolve, reject);
        } catch (err) {
          reject(err);
        }
      });
    });

    return promise2;
  }

  if (this.status === 'rejected') {
    const promise2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = onRejectedUnify(this.reason);

          resolvePromise(promise2, result, resolve, reject);
        } catch (err) {
          reject(err);
        }
      });
    });

    return promise2;
  }

  const promise2 = new Promise((resolve, reject) => {
    this.onFulfilledCallbacks.push((value) => {
      setTimeout(() => {
        try {
          // result 可能是 Promise 或者普通值，需要扁平化
          const result = onFulfilledUnify(value);

          resolvePromise(promise2, result, resolve, reject);
        } catch (err) {
          reject(err);
        }
      });
    });

    this.onRejectedCallbacks.push((reason) => {
      setTimeout(() => {
        try {
          const result = onRejectedUnify(reason);

          resolvePromise(promise2, result, resolve, reject);
        } catch (err) {
          reject(err);
        }
      });
    });
  });

  return promise2;
};

// eslint-disable-next-line func-names
Promise.resolve = function(value) {
  return new Promise((resolve) => resolve(value));
};
// eslint-disable-next-line func-names
Promise.reject = function(reason) {
  return new Promise((_, reject) => reject(reason));
};
// eslint-disable-next-line func-names
Promise.race = function(tasks) {
  return new Promise((resolve, reject) => {
    tasks.forEach((task) => {
      task.then(resolve, reject);
    });
  });
};
// eslint-disable-next-line func-names
Promise.all = function(tasks) {
  const state = {
    count: 0,
    results: new Array(tasks.length),
  };

  return new Promise((resolve, reject) => {
    tasks.forEach((task, index) => {
      task.then(
        (value) => {
          state.results[index] = value;
          state.count += 1;

          if (state.count === tasks.length) {
            resolve(state.results);
          }
        },
        (reason) => reject(reason)
      );
    });
  });
};

// eslint-disable-next-line func-names
Promise.deferred = function() {
  const defer = {};

  defer.promise = new Promise((resolve, reject) => {
    defer.resolve = resolve;
    defer.reject = reject;
  });

  return defer;
};

module.exports = Promise;
