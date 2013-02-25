var asFlow = {}, spliceAndVerify,
	serialExecute, parallelExecute, parallelExecute_withLimit;

spliceAndVerify = function(functions) {
	var args = [],
		i;
	for(i = 0; functions.length > i; i++) {
		if(functions[i + 1] instanceof Array) {
			args[i] = functions.splice(i + 1, 1).shift();
		} else {
			args[i] = [];
		}
		if(args[i].length + 1 !== functions[i].length) {
			console.log("Warning: Supplied arguments (" + args[i] + ") are not current to those declared in: " + functions[i]);
		}
	}
	return {
		args: args,
		functions: functions
	};
};
module.exports.serialExecute = function(functions, callback) {
	var i, nextFunc, results, spliced;
	if(!functions instanceof Array) {
		console.log("Error: serialExecute: Array of functions is of wrong type or undefined!");
	} else {
		if(functions.length === 0) {
			console.log("Warning: serialExecute: Array of functions empty.");
		}
	}
	if(!callback) {
		console.log("Warning: serialExecute: Callback undefined.");
	}
	i = 0;
	results = [];
	spliced = spliceAndVerify(functions);
	nextFunc = function() {
		var call, currentArgs, currentFunc;
		currentFunc = spliced.functions[i];
		if(currentFunc) {
			currentArgs = spliced.args[i];
			call = {
				back: function(result) {
					results.push(result);
					i++;
					nextFunc();
				},
				currentResults: function() {
					return results;
				},
				parentResult: function() {
					return results[i - 1];
				},
				resultByFunction: function(index) {
					return results[index];
				}
			};
			currentArgs.push(call);
			currentFunc.apply(null, currentArgs);
		} else if(callback) {
			callback(results);
		} else {
			return;
		}
	};
	nextFunc();
};
module.exports.parallelExecute = function(functions, callback) {
	var callbacks, i, results, spliced;
	if(!functions instanceof Array) {
		console.log("Error: parallelExecute: Array of functions is of wrong type or undefined!");
	} else {
		if(functions.length === 0) {
			console.log("Warning: parallelExecute: Array of functions empty.");
		}
	}
	if(!callback) {
		console.log("Warning: parallelExecute: Callback undefined.");
	}
	callbacks = 0;
	results = [];
	spliced = spliceAndVerify(functions);
	for(i = 0; spliced.functions.length > i; i++) {
		(function(index) {
			var call, currentArgs, currentFunc;
			currentFunc = spliced.functions[index];
			currentArgs = spliced.args[index];
			call = {
				back: function(result) {
					results[index] = result;
					callbacks++;
					if(spliced.functions.length === callbacks) {
						if(callback) {
							callback(results);
						} else {
							return;
						}
					}
				},
				currentResults: function() {
					return results;
				},
				parentResult: function() {
					return undefined;
				},
				resultByFunction: function(index) {
					return results[index];
				}
			};
			currentArgs.push(call);
			currentFunc.apply(null, currentArgs);
		}(i));
	}
	if(callback) {
		callback(results);
	}
};
module.exports.parallelExecute_withLimit = function(functions, limit, callback) {
	var callbacks, i, nextFunc, results, spliced;
	if(!functions instanceof Array) {
		console.log("Error: parallelExecute_withLimit: Array of functions is of wrong type or undefined!");
	} else {
		if(functions.length === 0) {
			console.log("Warning: parallelExecute_withLimit: Array of functions empty.");
		}
	}
	if(typeof limit !== "number") {
		console.log("Error: parallelExecute_withLimit: Limit is of wrong type or undefined.");
		return;
	} else {
		if(limit % 1 !== 0) {
			console.log("Error: parallelExecute_withLimit: Limit is not an integer.");
			return;
		}
	}
	if(!callback) {
		console.log("Warning: parallelExecute: Callback undefined.");
	}
	callbacks = 1;
	i = 0;
	results = [];
	spliced = spliceAndVerify(functions);
	nextFunc = function() {
		callbacks--;
		if(callbacks === 0 && spliced.functions.length === i) {
			if(callback) {
				callback(results);
			} else {
				return;
			}
		}
		while(spliced.functions[i] && callbacks < limit) {
			(function(index) {
				var call, currentArgs, currentFunc;
				currentFunc = spliced.functions[index];
				currentArgs = spliced.args[index];
				call = {
					back: function(result) {
						results[index] = result;
						nextFunc();
					},
					currentResults: function() {
						return results;
					},
					parentResult: function() {
						return undefined;
					},
					resultByFunction: function(index) {
						return results[index];
					}
				};
				currentArgs.push(call);
				callbacks++;
				currentFunc.apply(null, currentArgs);
			}(i));
			i++;
		}
	};
	nextFunc();
};
