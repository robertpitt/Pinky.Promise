/**
 * Pinky namespaces
 * @type {Object}
 */
var Pinky = {};

/**
 * Promise
 *
 * Lightweight promise library
 * 
 * @namespace {Pinky}
 */
Pinky.Promise = function(opt_callback, opt_context) {

	/**
	 * Shorthand compatible flow.
	 *
	 * var pinky = Pinky.Promise(function(done){
	 * 	//run your async code, call one with result.
	 * });
	 *
	 * pinky.then(...);
	 */
	if(!(this instanceof Pinky.Promise) && typeof opt_callback == 'function') {
		var pinky = new Pinky.Promise;

		/**
		 * Call the function passing the 
		 */
		opt_callback.call(opt_context, pinky.done.bind(pinky));

		/**
		 * Return the isntance.
		 */
		return pinky;
	}
	/**
	 * Callbacks
	 * @type {Array}
	 */
	this._callbacks = [];

	/**
	 * State.
	 * @type {Boolean}
	 */
	this._isdone = false;

	/**
	 * Parent pinky reference
	 */
	this._parent = null;
}

/**
 * Callback register method.
 * @param  {Function} func  Callback
 * @param  {Mixed} context  Context for callback to be bound to
 * @return {Pinky.Promise}  returns the current promise object for chaining
 */
Pinky.Promise.prototype.then = function(func, context) {
	/**
	 * Pinky.Promise symobol to the new chained Promise.
	 * @type {Pinky.Promise}
	 */
	var p;

	if(this._isdone === true) {
		/**
		 * Apply the function to the context and invoke as the
		 * promise has already been fulfilled.
		 * @type {Pinky.Promise}
		 */
		p = func.apply(context, this.result);
	} else {
		/**
		 * Create a new promise object
		 * @type {Pinky.Promise}
		 */
		p = new Pinky.Promise;

		/**
		 * export this symbol as the next's parent.
		 */
		p._parent = this;

		/**
		 * Register the call back.
		 */
		this._callbacks.push(function () {
		    var res = func.apply(context, arguments);
		    if (res && typeof res.then === 'function')
		        res.then(p.done, p);
		});	
	};

	return p;
};

/**
 * Completion method, called to fulfill the promise.
 */
Pinky.Promise.prototype.done = function() {
	/**
	 * Assign the arguments of the fulfillment to the
	 * @type {[type]}
	 */
	this.result = arguments;

	/**
	 * Mark the promise as fulfilled.
	 * @type {Boolean}
	 */
	this._isdone = true;

	/**
	 * Execute the callback(s)
	 */
	for (var i = 0; i < this._callbacks.length; i++) {
		/**
		 * Here we set the context to null as it's already been bound
		 * when the callback was registered with {Pinky.Promise.then}
		 */
    	this._callbacks[i].apply(null, arguments);
	}

	/**
	 * Clear the stack of callbacks, note that we could pop after execution.
	 * @type {Array}
	 */
	this._callbacks = [];
};

/**
 * Add another callback callback to the previus then call.
 * @return {Pinky.Promise} Returns the current {Pinky.Promise instance}
 */
Pinky.Promise.prototype.and = function(func, context) {
	if(this._parent === null)
		throw new Error("Pinky.Promise.and() must be called after then()");

	console.log(this);

	/**
	 * Attach a callback to the parent Promise object
	 */
	this._parent.then.apply(this._parent, arguments);

	/**
	 * Return the chain.
	 */
	return this;
}

/**
 * Export the pinky promise object
 * @type {Object}
 */
exports = module.exports = Pinky;