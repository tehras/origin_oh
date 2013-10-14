/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
// Generated by CoffeeScript 1.6.3
/*
jQuery.Turbolinks ~ https://github.com/kossnocorp/jquery.turbolinks
jQuery plugin for drop-in fix binded events problem caused by Turbolinks

The MIT License
Copyright (c) 2012-2013 Sasha Koss & Rico Sta. Cruz
*/



(function() {
  var $, $document;

  $ = window.jQuery || (typeof require === "function" ? require('jquery') : void 0);

  $document = $(document);

  $.turbo = {
    version: '2.0.0',
    isReady: false,
    use: function(load, fetch) {
      return $document.off('.turbo').on("" + load + ".turbo", this.onLoad).on("" + fetch + ".turbo", this.onFetch);
    },
    addCallback: function(callback) {
      if ($.turbo.isReady) {
        return callback($);
      } else {
        return $document.on('turbo:ready', function() {
          return callback($);
        });
      }
    },
    onLoad: function() {
      $.turbo.isReady = true;
      return $document.trigger('turbo:ready');
    },
    onFetch: function() {
      return $.turbo.isReady = false;
    },
    register: function() {
      $(this.onLoad);
      return $.fn.ready = this.addCallback;
    }
  };

  $.turbo.register();

  $.turbo.use('page:load', 'page:fetch');

}).call(this);
/**
* bootstrap.js v3.0.0 by @fat and @mdo
* Copyright 2013 Twitter Inc.
* http://www.apache.org/licenses/LICENSE-2.0
*/

if (!jQuery) { throw new Error("Bootstrap requires jQuery") }

/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
        .prop('checked', !this.$element.hasClass('active'))
        .trigger('change')
      if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
    }

    this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#carousel
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#collapse
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#dropdowns
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    var $el = $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('dropdown')

      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#modals
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#popovers
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#scrollspy
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tabs
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#affix
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(window.jQuery);
/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.8.4
 *
 */

(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : true,
            appear          : null,
            load            : null
        };

        function update() {
            var counter = 0;
      
            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit; 
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed; 
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function(event) {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .bind("load", function() {
                            $self
                                .hide()
                                .attr("src", $self.data(settings.data_attribute))
                                [settings.effect](settings.effect_speed);
                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.data(settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function(event) {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function(event) {
            update();
        });
              
        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/iphone|ipod|ipad.*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function(event) {
                if (event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(window).load(function() {
            update();
        });
        
        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.height() + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };
    
    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };
        
    $.abovethetop = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };
    
    $.leftofbegin = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[':'], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})(jQuery, window, document);
/*
 * jQuery Mobile Framework Git Build: SHA1: 27e3c18acfebab2d47ee7ed37bd50fc4942c8838 <> Date: Fri Mar 22 08:50:04 2013 -0600
 * http://jquerymobile.com
 *
 * Copyright 2010, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 */



(function ( root, doc, factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD. Register as an anonymous module.
        define( [ "jquery" ], function ( $ ) {
            factory( $, root, doc );
            return $.mobile;
        });
    } else {
        // Browser globals
        factory( root.jQuery, root, doc );
    }
}( this, document, function ( jQuery, window, document, undefined ) {
    (function( $, window, undefined ) {

        var nsNormalizeDict = {};

        // jQuery.mobile configurable options
        $.mobile = $.extend( {}, {

            // Version of the jQuery Mobile Framework
            version: "1.2.1",

            // Namespace used framework-wide for data-attrs. Default is no namespace
            ns: "",

            // Define the url parameter used for referencing widget-generated sub-pages.
            // Translates to to example.html&ui-page=subpageIdentifier
            // hash segment before &ui-page= is used to make Ajax request
            subPageUrlKey: "ui-page",

            // Class assigned to page currently in view, and during transitions
            activePageClass: "ui-page-active",

            // Class used for "active" button state, from CSS framework
            activeBtnClass: "ui-btn-active",

            // Class used for "focus" form element state, from CSS framework
            focusClass: "ui-focus",

            // Automatically handle clicks and form submissions through Ajax, when same-domain
            ajaxEnabled: true,

            // Automatically load and show pages based on location.hash
            hashListeningEnabled: true,

            // disable to prevent jquery from bothering with links
            linkBindingEnabled: true,

            // Set default page transition - 'none' for no transitions
            defaultPageTransition: "fade",

            // Set maximum window width for transitions to apply - 'false' for no limit
            maxTransitionWidth: false,

            // Minimum scroll distance that will be remembered when returning to a page
            minScrollBack: 250,

            // DEPRECATED: the following property is no longer in use, but defined until 2.0 to prevent conflicts
            touchOverflowEnabled: false,

            // Set default dialog transition - 'none' for no transitions
            defaultDialogTransition: "pop",

            // Error response message - appears when an Ajax page request fails
            pageLoadErrorMessage: "Error Loading Page",

            // For error messages, which theme does the box uses?
            pageLoadErrorMessageTheme: "e",

            // replace calls to window.history.back with phonegaps navigation helper
            // where it is provided on the window object
            phonegapNavigationEnabled: false,

            //automatically initialize the DOM when it's ready
            autoInitializePage: true,

            pushStateEnabled: true,

            // allows users to opt in to ignoring content by marking a parent element as
            // data-ignored
            ignoreContentEnabled: false,

            // turn of binding to the native orientationchange due to android orientation behavior
            orientationChangeEnabled: true,

            buttonMarkup: {
                hoverDelay: 200
            },

            // TODO might be useful upstream in jquery itself ?
            keyCode: {
                ALT: 18,
                BACKSPACE: 8,
                CAPS_LOCK: 20,
                COMMA: 188,
                COMMAND: 91,
                COMMAND_LEFT: 91, // COMMAND
                COMMAND_RIGHT: 93,
                CONTROL: 17,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                INSERT: 45,
                LEFT: 37,
                MENU: 93, // COMMAND_RIGHT
                NUMPAD_ADD: 107,
                NUMPAD_DECIMAL: 110,
                NUMPAD_DIVIDE: 111,
                NUMPAD_ENTER: 108,
                NUMPAD_MULTIPLY: 106,
                NUMPAD_SUBTRACT: 109,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SHIFT: 16,
                SPACE: 32,
                TAB: 9,
                UP: 38,
                WINDOWS: 91 // COMMAND
            },

            // Place to store various widget extensions
            behaviors: {},

            // Scroll page vertically: scroll to 0 to hide iOS address bar, or pass a Y value
            silentScroll: function( ypos ) {
                if ( $.type( ypos ) !== "number" ) {
                    ypos = $.mobile.defaultHomeScroll;
                }

                // prevent scrollstart and scrollstop events
                $.event.special.scrollstart.enabled = false;

                setTimeout( function() {
                    window.scrollTo( 0, ypos );
                    $( document ).trigger( "silentscroll", { x: 0, y: ypos });
                }, 20 );

                setTimeout( function() {
                    $.event.special.scrollstart.enabled = true;
                }, 150 );
            },

            // Expose our cache for testing purposes.
            nsNormalizeDict: nsNormalizeDict,

            // Take a data attribute property, prepend the namespace
            // and then camel case the attribute string. Add the result
            // to our nsNormalizeDict so we don't have to do this again.
            nsNormalize: function( prop ) {
                if ( !prop ) {
                    return;
                }

                return nsNormalizeDict[ prop ] || ( nsNormalizeDict[ prop ] = $.camelCase( $.mobile.ns + prop ) );
            },

            // Find the closest parent with a theme class on it. Note that
            // we are not using $.fn.closest() on purpose here because this
            // method gets called quite a bit and we need it to be as fast
            // as possible.
            getInheritedTheme: function( el, defaultTheme ) {
                var e = el[ 0 ],
                    ltr = "",
                    re = /ui-(bar|body|overlay)-([a-z])\b/,
                    c, m;

                while ( e ) {
                    c = e.className || "";
                    if ( c && ( m = re.exec( c ) ) && ( ltr = m[ 2 ] ) ) {
                        // We found a parent with a theme class
                        // on it so bail from this loop.
                        break;
                    }

                    e = e.parentNode;
                }

                // Return the theme letter we found, if none, return the
                // specified default.

                return ltr || defaultTheme || "a";
            },

            // TODO the following $ and $.fn extensions can/probably should be moved into jquery.mobile.core.helpers
            //
            // Find the closest javascript page element to gather settings data jsperf test
            // http://jsperf.com/single-complex-selector-vs-many-complex-selectors/edit
            // possibly naive, but it shows that the parsing overhead for *just* the page selector vs
            // the page and dialog selector is negligable. This could probably be speed up by
            // doing a similar parent node traversal to the one found in the inherited theme code above
            closestPageData: function( $target ) {
                return $target
                    .closest( ':jqmData(role="page"), :jqmData(role="dialog")' )
                    .data( "page" );
            },

            enhanceable: function( $set ) {
                return this.haveParents( $set, "enhance" );
            },

            hijackable: function( $set ) {
                return this.haveParents( $set, "ajax" );
            },

            haveParents: function( $set, attr ) {
                if ( !$.mobile.ignoreContentEnabled ) {
                    return $set;
                }

                var count = $set.length,
                    $newSet = $(),
                    e, $element, excluded;

                for ( var i = 0; i < count; i++ ) {
                    $element = $set.eq( i );
                    excluded = false;
                    e = $set[ i ];

                    while ( e ) {
                        var c = e.getAttribute ? e.getAttribute( "data-" + $.mobile.ns + attr ) : "";

                        if ( c === "false" ) {
                            excluded = true;
                            break;
                        }

                        e = e.parentNode;
                    }

                    if ( !excluded ) {
                        $newSet = $newSet.add( $element );
                    }
                }

                return $newSet;
            },

            getScreenHeight: function() {
                // Native innerHeight returns more accurate value for this across platforms,
                // jQuery version is here as a normalized fallback for platforms like Symbian
                return window.innerHeight || $( window ).height();
            }
        }, $.mobile );

        // Mobile version of data and removeData and hasData methods
        // ensures all data is set and retrieved using jQuery Mobile's data namespace
        $.fn.jqmData = function( prop, value ) {
            var result;
            if ( typeof prop !== "undefined" ) {
                if ( prop ) {
                    prop = $.mobile.nsNormalize( prop );
                }

                // undefined is permitted as an explicit input for the second param
                // in this case it returns the value and does not set it to undefined
                if( arguments.length < 2 || value === undefined ){
                    result = this.data( prop );
                } else {
                    result = this.data( prop, value );
                }
            }
            return result;
        };

        $.jqmData = function( elem, prop, value ) {
            var result;
            if ( typeof prop !== "undefined" ) {
                result = $.data( elem, prop ? $.mobile.nsNormalize( prop ) : prop, value );
            }
            return result;
        };

        $.fn.jqmRemoveData = function( prop ) {
            return this.removeData( $.mobile.nsNormalize( prop ) );
        };

        $.jqmRemoveData = function( elem, prop ) {
            return $.removeData( elem, $.mobile.nsNormalize( prop ) );
        };

        $.fn.removeWithDependents = function() {
            $.removeWithDependents( this );
        };

        $.removeWithDependents = function( elem ) {
            var $elem = $( elem );

            ( $elem.jqmData( 'dependents' ) || $() ).remove();
            $elem.remove();
        };

        $.fn.addDependents = function( newDependents ) {
            $.addDependents( $( this ), newDependents );
        };

        $.addDependents = function( elem, newDependents ) {
            var dependents = $( elem ).jqmData( 'dependents' ) || $();

            $( elem ).jqmData( 'dependents', $.merge( dependents, newDependents ) );
        };

        // note that this helper doesn't attempt to handle the callback
        // or setting of an html elements text, its only purpose is
        // to return the html encoded version of the text in all cases. (thus the name)
        $.fn.getEncodedText = function() {
            return $( "<div/>" ).text( $( this ).text() ).html();
        };

        // fluent helper function for the mobile namespaced equivalent
        $.fn.jqmEnhanceable = function() {
            return $.mobile.enhanceable( this );
        };

        $.fn.jqmHijackable = function() {
            return $.mobile.hijackable( this );
        };

        // Monkey-patching Sizzle to filter the :jqmData selector
        var oldFind = $.find,
            jqmDataRE = /:jqmData\(([^)]*)\)/g;

        $.find = function( selector, context, ret, extra ) {
            selector = selector.replace( jqmDataRE, "[data-" + ( $.mobile.ns || "" ) + "$1]" );

            return oldFind.call( this, selector, context, ret, extra );
        };

        $.extend( $.find, oldFind );

        $.find.matches = function( expr, set ) {
            return $.find( expr, null, null, set );
        };

        $.find.matchesSelector = function( node, expr ) {
            return $.find( expr, null, null, [ node ] ).length > 0;
        };
    })( jQuery, this );


    /*!
     * jQuery UI Widget v1.9.0-beta.1
     *
     * Copyright 2012, https://github.com/jquery/jquery-ui/blob/1.9.0-beta.1/AUTHORS.txt (http://jqueryui.com/about)
     * Dual licensed under the MIT or GPL Version 2 licenses.
     * http://jquery.org/license
     *
     * http://docs.jquery.com/UI/Widget
     */
    (function( $, undefined ) {

        var uuid = 0,
            slice = Array.prototype.slice,
            _cleanData = $.cleanData;
        $.cleanData = function( elems ) {
            for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
                try {
                    $( elem ).triggerHandler( "remove" );
                    // http://bugs.jquery.com/ticket/8235
                } catch( e ) {}
            }
            _cleanData( elems );
        };

        $.widget = function( name, base, prototype ) {
            var fullName, existingConstructor, constructor, basePrototype,
                namespace = name.split( "." )[ 0 ];

            name = name.split( "." )[ 1 ];
            fullName = namespace + "-" + name;

            if ( !prototype ) {
                prototype = base;
                base = $.Widget;
            }

            // create selector for plugin
            $.expr[ ":" ][ fullName ] = function( elem ) {
                return !!$.data( elem, fullName );
            };

            $[ namespace ] = $[ namespace ] || {};
            existingConstructor = $[ namespace ][ name ];
            constructor = $[ namespace ][ name ] = function( options, element ) {
                // allow instantiation without "new" keyword
                if ( !this._createWidget ) {
                    return new constructor( options, element );
                }

                // allow instantiation without initializing for simple inheritance
                // must use "new" keyword (the code above always passes args)
                if ( arguments.length ) {
                    this._createWidget( options, element );
                }
            };
            // extend with the existing constructor to carry over any static properties
            $.extend( constructor, existingConstructor, {
                version: prototype.version,
                // copy the object used to create the prototype in case we need to
                // redefine the widget later
                _proto: $.extend( {}, prototype ),
                // track widgets that inherit from this widget in case this widget is
                // redefined after a widget inherits from it
                _childConstructors: []
            });

            basePrototype = new base();
            // we need to make the options hash a property directly on the new instance
            // otherwise we'll modify the options hash on the prototype that we're
            // inheriting from
            basePrototype.options = $.widget.extend( {}, basePrototype.options );
            $.each( prototype, function( prop, value ) {
                if ( $.isFunction( value ) ) {
                    prototype[ prop ] = (function() {
                        var _super = function() {
                                return base.prototype[ prop ].apply( this, arguments );
                            },
                            _superApply = function( args ) {
                                return base.prototype[ prop ].apply( this, args );
                            };
                        return function() {
                            var __super = this._super,
                                __superApply = this._superApply,
                                returnValue;

                            this._super = _super;
                            this._superApply = _superApply;

                            returnValue = value.apply( this, arguments );

                            this._super = __super;
                            this._superApply = __superApply;

                            return returnValue;
                        };
                    })();
                }
            });
            constructor.prototype = $.widget.extend( basePrototype, {
                // TODO: remove support for widgetEventPrefix
                // always use the name + a colon as the prefix, e.g., draggable:start
                // don't prefix for widgets that aren't DOM-based
                widgetEventPrefix: name
            }, prototype, {
                constructor: constructor,
                namespace: namespace,
                widgetName: name,
                // TODO remove widgetBaseClass, see #8155
                widgetBaseClass: fullName,
                widgetFullName: fullName
            });

            // If this widget is being redefined then we need to find all widgets that
            // are inheriting from it and redefine all of them so that they inherit from
            // the new version of this widget. We're essentially trying to replace one
            // level in the prototype chain.
            if ( existingConstructor ) {
                $.each( existingConstructor._childConstructors, function( i, child ) {
                    var childPrototype = child.prototype;

                    // redefine the child widget using the same prototype that was
                    // originally used, but inherit from the new version of the base
                    $.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
                });
                // remove the list of existing child constructors from the old constructor
                // so the old child constructors can be garbage collected
                delete existingConstructor._childConstructors;
            } else {
                base._childConstructors.push( constructor );
            }

            $.widget.bridge( name, constructor );
        };

        $.widget.extend = function( target ) {
            var input = slice.call( arguments, 1 ),
                inputIndex = 0,
                inputLength = input.length,
                key,
                value;
            for ( ; inputIndex < inputLength; inputIndex++ ) {
                for ( key in input[ inputIndex ] ) {
                    value = input[ inputIndex ][ key ];
                    if (input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
                        target[ key ] = $.isPlainObject( value ) ? $.widget.extend( {}, target[ key ], value ) : value;
                    }
                }
            }
            return target;
        };

        $.widget.bridge = function( name, object ) {
            var fullName = object.prototype.widgetFullName;
            $.fn[ name ] = function( options ) {
                var isMethodCall = typeof options === "string",
                    args = slice.call( arguments, 1 ),
                    returnValue = this;

                // allow multiple hashes to be passed on init
                options = !isMethodCall && args.length ?
                    $.widget.extend.apply( null, [ options ].concat(args) ) :
                    options;

                if ( isMethodCall ) {
                    this.each(function() {
                        var methodValue,
                            instance = $.data( this, fullName );
                        if ( !instance ) {
                            return $.error( "cannot call methods on " + name + " prior to initialization; " +
                                "attempted to call method '" + options + "'" );
                        }
                        if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
                            return $.error( "no such method '" + options + "' for " + name + " widget instance" );
                        }
                        methodValue = instance[ options ].apply( instance, args );
                        if ( methodValue !== instance && methodValue !== undefined ) {
                            returnValue = methodValue && methodValue.jquery ?
                                returnValue.pushStack( methodValue.get() ) :
                                methodValue;
                            return false;
                        }
                    });
                } else {
                    this.each(function() {
                        var instance = $.data( this, fullName );
                        if ( instance ) {
                            instance.option( options || {} )._init();
                        } else {
                            new object( options, this );
                        }
                    });
                }

                return returnValue;
            };
        };

        $.Widget = function( options, element ) {};
        $.Widget._childConstructors = [];

        $.Widget.prototype = {
            widgetName: "widget",
            widgetEventPrefix: "",
            defaultElement: "<div>",
            options: {
                disabled: false,

                // callbacks
                create: null
            },
            _createWidget: function( options, element ) {
                element = $( element || this.defaultElement || this )[ 0 ];
                this.element = $( element );
                this.uuid = uuid++;
                this.eventNamespace = "." + this.widgetName + this.uuid;
                this.options = $.widget.extend( {},
                    this.options,
                    this._getCreateOptions(),
                    options );

                this.bindings = $();
                this.hoverable = $();
                this.focusable = $();

                if ( element !== this ) {
                    // 1.9 BC for #7810
                    // TODO remove dual storage
                    $.data( element, this.widgetName, this );
                    $.data( element, this.widgetFullName, this );
                    this._on({ remove: "destroy" });
                    this.document = $( element.style ?
                        // element within the document
                        element.ownerDocument :
                        // element is window or document
                        element.document || element );
                    this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
                }

                this._create();
                this._trigger( "create", null, this._getCreateEventData() );
                this._init();
            },
            _getCreateOptions: $.noop,
            _getCreateEventData: $.noop,
            _create: $.noop,
            _init: $.noop,

            destroy: function() {
                this._destroy();
                // we can probably remove the unbind calls in 2.0
                // all event bindings should go through this._on()
                this.element
                    .unbind( this.eventNamespace )
                    // 1.9 BC for #7810
                    // TODO remove dual storage
                    .removeData( this.widgetName )
                    .removeData( this.widgetFullName )
                    // support: jquery <1.6.3
                    // http://bugs.jquery.com/ticket/9413
                    .removeData( $.camelCase( this.widgetFullName ) );
                this.widget()
                    .unbind( this.eventNamespace )
                    .removeAttr( "aria-disabled" )
                    .removeClass(
                        this.widgetFullName + "-disabled " +
                            "ui-state-disabled" );

                // clean up events and states
                this.bindings.unbind( this.eventNamespace );
                this.hoverable.removeClass( "ui-state-hover" );
                this.focusable.removeClass( "ui-state-focus" );
            },
            _destroy: $.noop,

            widget: function() {
                return this.element;
            },

            option: function( key, value ) {
                var options = key,
                    parts,
                    curOption,
                    i;

                if ( arguments.length === 0 ) {
                    // don't return a reference to the internal hash
                    return $.widget.extend( {}, this.options );
                }

                if ( typeof key === "string" ) {
                    // handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
                    options = {};
                    parts = key.split( "." );
                    key = parts.shift();
                    if ( parts.length ) {
                        curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
                        for ( i = 0; i < parts.length - 1; i++ ) {
                            curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
                            curOption = curOption[ parts[ i ] ];
                        }
                        key = parts.pop();
                        if ( value === undefined ) {
                            return curOption[ key ] === undefined ? null : curOption[ key ];
                        }
                        curOption[ key ] = value;
                    } else {
                        if ( value === undefined ) {
                            return this.options[ key ] === undefined ? null : this.options[ key ];
                        }
                        options[ key ] = value;
                    }
                }

                this._setOptions( options );

                return this;
            },
            _setOptions: function( options ) {
                var key;

                for ( key in options ) {
                    this._setOption( key, options[ key ] );
                }

                return this;
            },
            _setOption: function( key, value ) {
                this.options[ key ] = value;

                if ( key === "disabled" ) {
                    this.widget()
                        .toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
                        .attr( "aria-disabled", value );
                    this.hoverable.removeClass( "ui-state-hover" );
                    this.focusable.removeClass( "ui-state-focus" );
                }

                return this;
            },

            enable: function() {
                return this._setOption( "disabled", false );
            },
            disable: function() {
                return this._setOption( "disabled", true );
            },

            _on: function( element, handlers ) {
                // no element argument, shuffle and use this.element
                if ( !handlers ) {
                    handlers = element;
                    element = this.element;
                } else {
                    // accept selectors, DOM elements
                    element = $( element );
                    this.bindings = this.bindings.add( element );
                }

                var instance = this;
                $.each( handlers, function( event, handler ) {
                    function handlerProxy() {
                        // allow widgets to customize the disabled handling
                        // - disabled as an array instead of boolean
                        // - disabled class as method for disabling individual parts
                        if ( instance.options.disabled === true ||
                            $( this ).hasClass( "ui-state-disabled" ) ) {
                            return;
                        }
                        return ( typeof handler === "string" ? instance[ handler ] : handler )
                            .apply( instance, arguments );
                    }

                    // copy the guid so direct unbinding works
                    if ( typeof handler !== "string" ) {
                        handlerProxy.guid = handler.guid =
                            handler.guid || handlerProxy.guid || $.guid++;
                    }

                    var match = event.match( /^(\w+)\s*(.*)$/ ),
                        eventName = match[1] + instance.eventNamespace,
                        selector = match[2];
                    if ( selector ) {
                        instance.widget().delegate( selector, eventName, handlerProxy );
                    } else {
                        element.bind( eventName, handlerProxy );
                    }
                });
            },

            _off: function( element, eventName ) {
                eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
                element.unbind( eventName ).undelegate( eventName );
            },

            _delay: function( handler, delay ) {
                function handlerProxy() {
                    return ( typeof handler === "string" ? instance[ handler ] : handler )
                        .apply( instance, arguments );
                }
                var instance = this;
                return setTimeout( handlerProxy, delay || 0 );
            },

            _hoverable: function( element ) {
                this.hoverable = this.hoverable.add( element );
                this._on( element, {
                    mouseenter: function( event ) {
                        $( event.currentTarget ).addClass( "ui-state-hover" );
                    },
                    mouseleave: function( event ) {
                        $( event.currentTarget ).removeClass( "ui-state-hover" );
                    }
                });
            },

            _focusable: function( element ) {
                this.focusable = this.focusable.add( element );
                this._on( element, {
                    focusin: function( event ) {
                        $( event.currentTarget ).addClass( "ui-state-focus" );
                    },
                    focusout: function( event ) {
                        $( event.currentTarget ).removeClass( "ui-state-focus" );
                    }
                });
            },

            _trigger: function( type, event, data ) {
                var prop, orig,
                    callback = this.options[ type ];

                data = data || {};
                event = $.Event( event );
                event.type = ( type === this.widgetEventPrefix ?
                    type :
                    this.widgetEventPrefix + type ).toLowerCase();
                // the original event may come from any element
                // so we need to reset the target on the new event
                event.target = this.element[ 0 ];

                // copy original event properties over to the new event
                orig = event.originalEvent;
                if ( orig ) {
                    for ( prop in orig ) {
                        if ( !( prop in event ) ) {
                            event[ prop ] = orig[ prop ];
                        }
                    }
                }

                this.element.trigger( event, data );
                return !( $.isFunction( callback ) &&
                    callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
                    event.isDefaultPrevented() );
            }
        };

        $.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
            $.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
                if ( typeof options === "string" ) {
                    options = { effect: options };
                }
                var hasOptions,
                    effectName = !options ?
                        method :
                        options === true || typeof options === "number" ?
                            defaultEffect :
                            options.effect || defaultEffect;
                options = options || {};
                if ( typeof options === "number" ) {
                    options = { duration: options };
                }
                hasOptions = !$.isEmptyObject( options );
                options.complete = callback;
                if ( options.delay ) {
                    element.delay( options.delay );
                }
                if ( hasOptions && $.effects && ( $.effects.effect[ effectName ] || $.uiBackCompat !== false && $.effects[ effectName ] ) ) {
                    element[ method ]( options );
                } else if ( effectName !== method && element[ effectName ] ) {
                    element[ effectName ]( options.duration, options.easing, callback );
                } else {
                    element.queue(function( next ) {
                        $( this )[ method ]();
                        if ( callback ) {
                            callback.call( element[ 0 ] );
                        }
                        next();
                    });
                }
            };
        });

// DEPRECATED
        if ( $.uiBackCompat !== false ) {
            $.Widget.prototype._getCreateOptions = function() {
                return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
            };
        }

    })( jQuery );

    (function( $, undefined ) {

        $.widget( "mobile.widget", {
            // decorate the parent _createWidget to trigger `widgetinit` for users
            // who wish to do post post `widgetcreate` alterations/additions
            //
            // TODO create a pull request for jquery ui to trigger this event
            // in the original _createWidget
            _createWidget: function() {
                $.Widget.prototype._createWidget.apply( this, arguments );
                this._trigger( 'init' );
            },

            _getCreateOptions: function() {

                var elem = this.element,
                    options = {};

                $.each( this.options, function( option ) {

                    var value = elem.jqmData( option.replace( /[A-Z]/g, function( c ) {
                        return "-" + c.toLowerCase();
                    })
                    );

                    if ( value !== undefined ) {
                        options[ option ] = value;
                    }
                });

                return options;
            },

            enhanceWithin: function( target, useKeepNative ) {
                this.enhance( $( this.options.initSelector, $( target )), useKeepNative );
            },

            enhance: function( targets, useKeepNative ) {
                var page, keepNative, $widgetElements = $( targets ), self = this;

                // if ignoreContentEnabled is set to true the framework should
                // only enhance the selected elements when they do NOT have a
                // parent with the data-namespace-ignore attribute
                $widgetElements = $.mobile.enhanceable( $widgetElements );

                if ( useKeepNative && $widgetElements.length ) {
                    // TODO remove dependency on the page widget for the keepNative.
                    // Currently the keepNative value is defined on the page prototype so
                    // the method is as well
                    page = $.mobile.closestPageData( $widgetElements );
                    keepNative = ( page && page.keepNativeSelector()) || "";

                    $widgetElements = $widgetElements.not( keepNative );
                }

                $widgetElements[ this.widgetName ]();
            },

            raise: function( msg ) {
                throw "Widget [" + this.widgetName + "]: " + msg;
            }
        });

    })( jQuery );


    (function( $, window ) {
        // DEPRECATED
        // NOTE global mobile object settings
        $.extend( $.mobile, {
            // DEPRECATED Should the text be visble in the loading message?
            loadingMessageTextVisible: undefined,

            // DEPRECATED When the text is visible, what theme does the loading box use?
            loadingMessageTheme: undefined,

            // DEPRECATED default message setting
            loadingMessage: undefined,

            // DEPRECATED
            // Turn on/off page loading message. Theme doubles as an object argument
            // with the following shape: { theme: '', text: '', html: '', textVisible: '' }
            // NOTE that the $.mobile.loading* settings and params past the first are deprecated
            showPageLoadingMsg: function( theme, msgText, textonly ) {
                $.mobile.loading( 'show', theme, msgText, textonly );
            },

            // DEPRECATED
            hidePageLoadingMsg: function() {
                $.mobile.loading( 'hide' );
            },

            loading: function() {
                this.loaderWidget.loader.apply( this.loaderWidget, arguments );
            }
        });

        // TODO move loader class down into the widget settings
        var loaderClass = "ui-loader", $html = $( "html" ), $window = $( window );

        $.widget( "mobile.loader", {
            // NOTE if the global config settings are defined they will override these
            //      options
            options: {
                // the theme for the loading message
                theme: "a",

                // whether the text in the loading message is shown
                textVisible: false,

                // custom html for the inner content of the loading message
                html: "",

                // the text to be displayed when the popup is shown
                text: "loading"
            },

            defaultHtml: "<div class='" + loaderClass + "'>" +
                "<span class='ui-icon ui-icon-loading'></span>" +
                "<h1></h1>" +
                "</div>",

            // For non-fixed supportin browsers. Position at y center (if scrollTop supported), above the activeBtn (if defined), or just 100px from top
            fakeFixLoader: function() {
                var activeBtn = $( "." + $.mobile.activeBtnClass ).first();

                this.element
                    .css({
                        top: $.support.scrollTop && $window.scrollTop() + $window.height() / 2 ||
                            activeBtn.length && activeBtn.offset().top || 100
                    });
            },

            // check position of loader to see if it appears to be "fixed" to center
            // if not, use abs positioning
            checkLoaderPosition: function() {
                var offset = this.element.offset(),
                    scrollTop = $window.scrollTop(),
                    screenHeight = $.mobile.getScreenHeight();

                if ( offset.top < scrollTop || ( offset.top - scrollTop ) > screenHeight ) {
                    this.element.addClass( "ui-loader-fakefix" );
                    this.fakeFixLoader();
                    $window
                        .unbind( "scroll", this.checkLoaderPosition )
                        .bind( "scroll", $.proxy( this.fakeFixLoader, this ) );
                }
            },

            resetHtml: function() {
                this.element.html( $( this.defaultHtml ).html() );
            },

            // Turn on/off page loading message. Theme doubles as an object argument
            // with the following shape: { theme: '', text: '', html: '', textVisible: '' }
            // NOTE that the $.mobile.loading* settings and params past the first are deprecated
            // TODO sweet jesus we need to break some of this out
            show: function( theme, msgText, textonly ) {
                var textVisible, message, $header, loadSettings;

                this.resetHtml();

                // use the prototype options so that people can set them globally at
                // mobile init. Consistency, it's what's for dinner
                if ( $.type(theme) === "object" ) {
                    loadSettings = $.extend( {}, this.options, theme );

                    // prefer object property from the param then the old theme setting
                    theme = loadSettings.theme || $.mobile.loadingMessageTheme;
                } else {
                    loadSettings = this.options;

                    // here we prefer the them value passed as a string argument, then
                    // we prefer the global option because we can't use undefined default
                    // prototype options, then the prototype option
                    theme = theme || $.mobile.loadingMessageTheme || loadSettings.theme;
                }

                // set the message text, prefer the param, then the settings object
                // then loading message
                message = msgText || $.mobile.loadingMessage || loadSettings.text;

                // prepare the dom
                $html.addClass( "ui-loading" );

                if ( $.mobile.loadingMessage !== false || loadSettings.html ) {
                    // boolean values require a bit more work :P, supports object properties
                    // and old settings
                    if ( $.mobile.loadingMessageTextVisible !== undefined ) {
                        textVisible = $.mobile.loadingMessageTextVisible;
                    } else {
                        textVisible = loadSettings.textVisible;
                    }

                    // add the proper css given the options (theme, text, etc)
                    // Force text visibility if the second argument was supplied, or
                    // if the text was explicitly set in the object args
                    this.element.attr("class", loaderClass +
                        " ui-corner-all ui-body-" + theme +
                        " ui-loader-" + ( textVisible || msgText || theme.text ? "verbose" : "default" ) +
                        ( loadSettings.textonly || textonly ? " ui-loader-textonly" : "" ) );

                    // TODO verify that jquery.fn.html is ok to use in both cases here
                    //      this might be overly defensive in preventing unknowing xss
                    // if the html attribute is defined on the loading settings, use that
                    // otherwise use the fallbacks from above
                    if ( loadSettings.html ) {
                        this.element.html( loadSettings.html );
                    } else {
                        this.element.find( "h1" ).text( message );
                    }

                    // attach the loader to the DOM
                    this.element.appendTo( $.mobile.pageContainer );

                    // check that the loader is visible
                    this.checkLoaderPosition();

                    // on scroll check the loader position
                    $window.bind( "scroll", $.proxy( this.checkLoaderPosition, this ) );
                }
            },

            hide: function() {
                $html.removeClass( "ui-loading" );

                if ( $.mobile.loadingMessage ) {
                    this.element.removeClass( "ui-loader-fakefix" );
                }

                $( window ).unbind( "scroll", this.fakeFixLoader );
                $( window ).unbind( "scroll", this.checkLoaderPosition );
            }
        });

        $window.bind( 'pagecontainercreate', function() {
            $.mobile.loaderWidget = $.mobile.loaderWidget || $( $.mobile.loader.prototype.defaultHtml ).loader();
        });
    })(jQuery, this);



// This plugin is an experiment for abstracting away the touch and mouse
// events so that developers don't have to worry about which method of input
// the device their document is loaded on supports.
//
// The idea here is to allow the developer to register listeners for the
// basic mouse events, such as mousedown, mousemove, mouseup, and click,
// and the plugin will take care of registering the correct listeners
// behind the scenes to invoke the listener at the fastest possible time
// for that device, while still retaining the order of event firing in
// the traditional mouse environment, should multiple handlers be registered
// on the same element for different events.
//
// The current version exposes the following virtual events to jQuery bind methods:
// "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel"

    (function( $, window, document, undefined ) {

        var dataPropertyName = "virtualMouseBindings",
            touchTargetPropertyName = "virtualTouchID",
            virtualEventNames = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split( " " ),
            touchEventProps = "clientX clientY pageX pageY screenX screenY".split( " " ),
            mouseHookProps = $.event.mouseHooks ? $.event.mouseHooks.props : [],
            mouseEventProps = $.event.props.concat( mouseHookProps ),
            activeDocHandlers = {},
            resetTimerID = 0,
            startX = 0,
            startY = 0,
            didScroll = false,
            clickBlockList = [],
            blockMouseTriggers = false,
            blockTouchTriggers = false,
            eventCaptureSupported = "addEventListener" in document,
            $document = $( document ),
            nextTouchID = 1,
            lastTouchID = 0, threshold;

        $.vmouse = {
            moveDistanceThreshold: 10,
            clickDistanceThreshold: 10,
            resetTimerDuration: 1500
        };

        function getNativeEvent( event ) {

            while ( event && typeof event.originalEvent !== "undefined" ) {
                event = event.originalEvent;
            }
            return event;
        }

        function createVirtualEvent( event, eventType ) {

            var t = event.type,
                oe, props, ne, prop, ct, touch, i, j, len;

            event = $.Event( event );
            event.type = eventType;

            oe = event.originalEvent;
            props = $.event.props;

            // addresses separation of $.event.props in to $.event.mouseHook.props and Issue 3280
            // https://github.com/jquery/jquery-mobile/issues/3280
            if ( t.search( /^(mouse|click)/ ) > -1 ) {
                props = mouseEventProps;
            }

            // copy original event properties over to the new event
            // this would happen if we could call $.event.fix instead of $.Event
            // but we don't have a way to force an event to be fixed multiple times
            if ( oe ) {
                for ( i = props.length, prop; i; ) {
                    prop = props[ --i ];
                    event[ prop ] = oe[ prop ];
                }
            }

            // make sure that if the mouse and click virtual events are generated
            // without a .which one is defined
            if ( t.search(/mouse(down|up)|click/) > -1 && !event.which ) {
                event.which = 1;
            }

            if ( t.search(/^touch/) !== -1 ) {
                ne = getNativeEvent( oe );
                t = ne.touches;
                ct = ne.changedTouches;
                touch = ( t && t.length ) ? t[0] : ( ( ct && ct.length ) ? ct[ 0 ] : undefined );

                if ( touch ) {
                    for ( j = 0, len = touchEventProps.length; j < len; j++) {
                        prop = touchEventProps[ j ];
                        event[ prop ] = touch[ prop ];
                    }
                }
            }

            return event;
        }

        function getVirtualBindingFlags( element ) {

            var flags = {},
                b, k;

            while ( element ) {

                b = $.data( element, dataPropertyName );

                for (  k in b ) {
                    if ( b[ k ] ) {
                        flags[ k ] = flags.hasVirtualBinding = true;
                    }
                }
                element = element.parentNode;
            }
            return flags;
        }

        function getClosestElementWithVirtualBinding( element, eventType ) {
            var b;
            while ( element ) {

                b = $.data( element, dataPropertyName );

                if ( b && ( !eventType || b[ eventType ] ) ) {
                    return element;
                }
                element = element.parentNode;
            }
            return null;
        }

        function enableTouchBindings() {
            blockTouchTriggers = false;
        }

        function disableTouchBindings() {
            blockTouchTriggers = true;
        }

        function enableMouseBindings() {
            lastTouchID = 0;
            clickBlockList.length = 0;
            blockMouseTriggers = false;

            // When mouse bindings are enabled, our
            // touch bindings are disabled.
            disableTouchBindings();
        }

        function disableMouseBindings() {
            // When mouse bindings are disabled, our
            // touch bindings are enabled.
            enableTouchBindings();
        }

        function startResetTimer() {
            clearResetTimer();
            resetTimerID = setTimeout( function() {
                resetTimerID = 0;
                enableMouseBindings();
            }, $.vmouse.resetTimerDuration );
        }

        function clearResetTimer() {
            if ( resetTimerID ) {
                clearTimeout( resetTimerID );
                resetTimerID = 0;
            }
        }

        function triggerVirtualEvent( eventType, event, flags ) {
            var ve;

            if ( ( flags && flags[ eventType ] ) ||
                ( !flags && getClosestElementWithVirtualBinding( event.target, eventType ) ) ) {

                ve = createVirtualEvent( event, eventType );

                $( event.target).trigger( ve );
            }

            return ve;
        }

        function mouseEventCallback( event ) {
            var touchID = $.data( event.target, touchTargetPropertyName );

            if ( !blockMouseTriggers && ( !lastTouchID || lastTouchID !== touchID ) ) {
                var ve = triggerVirtualEvent( "v" + event.type, event );
                if ( ve ) {
                    if ( ve.isDefaultPrevented() ) {
                        event.preventDefault();
                    }
                    if ( ve.isPropagationStopped() ) {
                        event.stopPropagation();
                    }
                    if ( ve.isImmediatePropagationStopped() ) {
                        event.stopImmediatePropagation();
                    }
                }
            }
        }

        function handleTouchStart( event ) {

            var touches = getNativeEvent( event ).touches,
                target, flags;

            if ( touches && touches.length === 1 ) {

                target = event.target;
                flags = getVirtualBindingFlags( target );

                if ( flags.hasVirtualBinding ) {

                    lastTouchID = nextTouchID++;
                    $.data( target, touchTargetPropertyName, lastTouchID );

                    clearResetTimer();

                    disableMouseBindings();
                    didScroll = false;

                    var t = getNativeEvent( event ).touches[ 0 ];
                    startX = t.pageX;
                    startY = t.pageY;

                    triggerVirtualEvent( "vmouseover", event, flags );
                    triggerVirtualEvent( "vmousedown", event, flags );
                }
            }
        }

        function handleScroll( event ) {
            if ( blockTouchTriggers ) {
                return;
            }

            if ( !didScroll ) {
                triggerVirtualEvent( "vmousecancel", event, getVirtualBindingFlags( event.target ) );
            }

            didScroll = true;
            startResetTimer();
        }

        function handleTouchMove( event ) {
            if ( blockTouchTriggers ) {
                return;
            }

            var t = getNativeEvent( event ).touches[ 0 ],
                didCancel = didScroll,
                moveThreshold = $.vmouse.moveDistanceThreshold,
                flags = getVirtualBindingFlags( event.target );

            didScroll = didScroll ||
                ( Math.abs( t.pageX - startX ) > moveThreshold ||
                    Math.abs( t.pageY - startY ) > moveThreshold );


            if ( didScroll && !didCancel ) {
                triggerVirtualEvent( "vmousecancel", event, flags );
            }

            triggerVirtualEvent( "vmousemove", event, flags );
            startResetTimer();
        }

        function handleTouchEnd( event ) {
            if ( blockTouchTriggers ) {
                return;
            }

            disableTouchBindings();

            var flags = getVirtualBindingFlags( event.target ),
                t;
            triggerVirtualEvent( "vmouseup", event, flags );

            if ( !didScroll ) {
                var ve = triggerVirtualEvent( "vclick", event, flags );
                if ( ve && ve.isDefaultPrevented() ) {
                    // The target of the mouse events that follow the touchend
                    // event don't necessarily match the target used during the
                    // touch. This means we need to rely on coordinates for blocking
                    // any click that is generated.
                    t = getNativeEvent( event ).changedTouches[ 0 ];
                    clickBlockList.push({
                        touchID: lastTouchID,
                        x: t.clientX,
                        y: t.clientY
                    });

                    // Prevent any mouse events that follow from triggering
                    // virtual event notifications.
                    blockMouseTriggers = true;
                }
            }
            triggerVirtualEvent( "vmouseout", event, flags);
            didScroll = false;

            startResetTimer();
        }

        function hasVirtualBindings( ele ) {
            var bindings = $.data( ele, dataPropertyName ),
                k;

            if ( bindings ) {
                for ( k in bindings ) {
                    if ( bindings[ k ] ) {
                        return true;
                    }
                }
            }
            return false;
        }

        function dummyMouseHandler() {}

        function getSpecialEventObject( eventType ) {
            var realType = eventType.substr( 1 );

            return {
                setup: function( data, namespace ) {
                    // If this is the first virtual mouse binding for this element,
                    // add a bindings object to its data.

                    if ( !hasVirtualBindings( this ) ) {
                        $.data( this, dataPropertyName, {} );
                    }

                    // If setup is called, we know it is the first binding for this
                    // eventType, so initialize the count for the eventType to zero.
                    var bindings = $.data( this, dataPropertyName );
                    bindings[ eventType ] = true;

                    // If this is the first virtual mouse event for this type,
                    // register a global handler on the document.

                    activeDocHandlers[ eventType ] = ( activeDocHandlers[ eventType ] || 0 ) + 1;

                    if ( activeDocHandlers[ eventType ] === 1 ) {
                        $document.bind( realType, mouseEventCallback );
                    }

                    // Some browsers, like Opera Mini, won't dispatch mouse/click events
                    // for elements unless they actually have handlers registered on them.
                    // To get around this, we register dummy handlers on the elements.

                    $( this ).bind( realType, dummyMouseHandler );

                    // For now, if event capture is not supported, we rely on mouse handlers.
                    if ( eventCaptureSupported ) {
                        // If this is the first virtual mouse binding for the document,
                        // register our touchstart handler on the document.

                        activeDocHandlers[ "touchstart" ] = ( activeDocHandlers[ "touchstart" ] || 0) + 1;

                        if ( activeDocHandlers[ "touchstart" ] === 1 ) {
                            $document.bind( "touchstart", handleTouchStart )
                                .bind( "touchend", handleTouchEnd )

                                // On touch platforms, touching the screen and then dragging your finger
                                // causes the window content to scroll after some distance threshold is
                                // exceeded. On these platforms, a scroll prevents a click event from being
                                // dispatched, and on some platforms, even the touchend is suppressed. To
                                // mimic the suppression of the click event, we need to watch for a scroll
                                // event. Unfortunately, some platforms like iOS don't dispatch scroll
                                // events until *AFTER* the user lifts their finger (touchend). This means
                                // we need to watch both scroll and touchmove events to figure out whether
                                // or not a scroll happenens before the touchend event is fired.

                                .bind( "touchmove", handleTouchMove )
                                .bind( "scroll", handleScroll );
                        }
                    }
                },

                teardown: function( data, namespace ) {
                    // If this is the last virtual binding for this eventType,
                    // remove its global handler from the document.

                    --activeDocHandlers[ eventType ];

                    if ( !activeDocHandlers[ eventType ] ) {
                        $document.unbind( realType, mouseEventCallback );
                    }

                    if ( eventCaptureSupported ) {
                        // If this is the last virtual mouse binding in existence,
                        // remove our document touchstart listener.

                        --activeDocHandlers[ "touchstart" ];

                        if ( !activeDocHandlers[ "touchstart" ] ) {
                            $document.unbind( "touchstart", handleTouchStart )
                                .unbind( "touchmove", handleTouchMove )
                                .unbind( "touchend", handleTouchEnd )
                                .unbind( "scroll", handleScroll );
                        }
                    }

                    var $this = $( this ),
                        bindings = $.data( this, dataPropertyName );

                    // teardown may be called when an element was
                    // removed from the DOM. If this is the case,
                    // jQuery core may have already stripped the element
                    // of any data bindings so we need to check it before
                    // using it.
                    if ( bindings ) {
                        bindings[ eventType ] = false;
                    }

                    // Unregister the dummy event handler.

                    $this.unbind( realType, dummyMouseHandler );

                    // If this is the last virtual mouse binding on the
                    // element, remove the binding data from the element.

                    if ( !hasVirtualBindings( this ) ) {
                        $this.removeData( dataPropertyName );
                    }
                }
            };
        }

// Expose our custom events to the jQuery bind/unbind mechanism.

        for ( var i = 0; i < virtualEventNames.length; i++ ) {
            $.event.special[ virtualEventNames[ i ] ] = getSpecialEventObject( virtualEventNames[ i ] );
        }

// Add a capture click handler to block clicks.
// Note that we require event capture support for this so if the device
// doesn't support it, we punt for now and rely solely on mouse events.
        if ( eventCaptureSupported ) {
            document.addEventListener( "click", function( e ) {
                var cnt = clickBlockList.length,
                    target = e.target,
                    x, y, ele, i, o, touchID;

                if ( cnt ) {
                    x = e.clientX;
                    y = e.clientY;
                    threshold = $.vmouse.clickDistanceThreshold;

                    // The idea here is to run through the clickBlockList to see if
                    // the current click event is in the proximity of one of our
                    // vclick events that had preventDefault() called on it. If we find
                    // one, then we block the click.
                    //
                    // Why do we have to rely on proximity?
                    //
                    // Because the target of the touch event that triggered the vclick
                    // can be different from the target of the click event synthesized
                    // by the browser. The target of a mouse/click event that is syntehsized
                    // from a touch event seems to be implementation specific. For example,
                    // some browsers will fire mouse/click events for a link that is near
                    // a touch event, even though the target of the touchstart/touchend event
                    // says the user touched outside the link. Also, it seems that with most
                    // browsers, the target of the mouse/click event is not calculated until the
                    // time it is dispatched, so if you replace an element that you touched
                    // with another element, the target of the mouse/click will be the new
                    // element underneath that point.
                    //
                    // Aside from proximity, we also check to see if the target and any
                    // of its ancestors were the ones that blocked a click. This is necessary
                    // because of the strange mouse/click target calculation done in the
                    // Android 2.1 browser, where if you click on an element, and there is a
                    // mouse/click handler on one of its ancestors, the target will be the
                    // innermost child of the touched element, even if that child is no where
                    // near the point of touch.

                    ele = target;

                    while ( ele ) {
                        for ( i = 0; i < cnt; i++ ) {
                            o = clickBlockList[ i ];
                            touchID = 0;

                            if ( ( ele === target && Math.abs( o.x - x ) < threshold && Math.abs( o.y - y ) < threshold ) ||
                                $.data( ele, touchTargetPropertyName ) === o.touchID ) {
                                // XXX: We may want to consider removing matches from the block list
                                //      instead of waiting for the reset timer to fire.
                                e.preventDefault();
                                e.stopPropagation();
                                return;
                            }
                        }
                        ele = ele.parentNode;
                    }
                }
            }, true);
        }
    })( jQuery, window, document );

    (function( $, undefined ) {
        var support = {
            touch: "ontouchend" in document
        };

        $.mobile = $.mobile || {};
        $.mobile.support = $.mobile.support || {};
        $.extend( $.support, support );
        $.extend( $.mobile.support, support );
    }( jQuery ));


    (function( $, window, undefined ) {
        // add new event shortcuts
        $.each( ( "touchstart touchmove touchend " +
            "tap taphold " +
            "swipe swipeleft swiperight " +
            "scrollstart scrollstop" ).split( " " ), function( i, name ) {

            $.fn[ name ] = function( fn ) {
                return fn ? this.bind( name, fn ) : this.trigger( name );
            };

            // jQuery < 1.8
            if ( $.attrFn ) {
                $.attrFn[ name ] = true;
            }
        });

        var supportTouch = $.mobile.support.touch,
            scrollEvent = "touchmove scroll",
            touchStartEvent = supportTouch ? "touchstart" : "mousedown",
            touchStopEvent = supportTouch ? "touchend" : "mouseup",
            touchMoveEvent = supportTouch ? "touchmove" : "mousemove";

        function triggerCustomEvent( obj, eventType, event ) {
            var originalType = event.type;
            event.type = eventType;
            $.event.handle.call( obj, event );
            event.type = originalType;
        }

        // also handles scrollstop
        $.event.special.scrollstart = {

            enabled: true,

            setup: function() {

                var thisObject = this,
                    $this = $( thisObject ),
                    scrolling,
                    timer;

                function trigger( event, state ) {
                    scrolling = state;
                    triggerCustomEvent( thisObject, scrolling ? "scrollstart" : "scrollstop", event );
                }

                // iPhone triggers scroll after a small delay; use touchmove instead
                $this.bind( scrollEvent, function( event ) {

                    if ( !$.event.special.scrollstart.enabled ) {
                        return;
                    }

                    if ( !scrolling ) {
                        trigger( event, true );
                    }

                    clearTimeout( timer );
                    timer = setTimeout( function() {
                        trigger( event, false );
                    }, 50 );
                });
            }
        };

        // also handles taphold
        $.event.special.tap = {
            tapholdThreshold: 750,

            setup: function() {
                var thisObject = this,
                    $this = $( thisObject );

                $this.bind( "vmousedown", function( event ) {

                    if ( event.which && event.which !== 1 ) {
                        return false;
                    }

                    var origTarget = event.target,
                        origEvent = event.originalEvent,
                        timer;

                    function clearTapTimer() {
                        clearTimeout( timer );
                    }

                    function clearTapHandlers() {
                        clearTapTimer();

                        $this.unbind( "vclick", clickHandler )
                            .unbind( "vmouseup", clearTapTimer );
                        $( document ).unbind( "vmousecancel", clearTapHandlers );
                    }

                    function clickHandler( event ) {
                        clearTapHandlers();

                        // ONLY trigger a 'tap' event if the start target is
                        // the same as the stop target.
                        if ( origTarget === event.target ) {
                            triggerCustomEvent( thisObject, "tap", event );
                        }
                    }

                    $this.bind( "vmouseup", clearTapTimer )
                        .bind( "vclick", clickHandler );
                    $( document ).bind( "vmousecancel", clearTapHandlers );

                    timer = setTimeout( function() {
                        triggerCustomEvent( thisObject, "taphold", $.Event( "taphold", { target: origTarget } ) );
                    }, $.event.special.tap.tapholdThreshold );
                });
            }
        };

        // also handles swipeleft, swiperight
        $.event.special.swipe = {
            scrollSupressionThreshold: 30, // More than this horizontal displacement, and we will suppress scrolling.

            durationThreshold: 1000, // More time than this, and it isn't a swipe.

            horizontalDistanceThreshold: 30,  // Swipe horizontal displacement must be more than this.

            verticalDistanceThreshold: 75,  // Swipe vertical displacement must be less than this.

            setup: function() {
                var thisObject = this,
                    $this = $( thisObject );

                $this.bind( touchStartEvent, function( event ) {
                    var data = event.originalEvent.touches ?
                            event.originalEvent.touches[ 0 ] : event,
                        start = {
                            time: ( new Date() ).getTime(),
                            coords: [ data.pageX, data.pageY ],
                            origin: $( event.target )
                        },
                        stop;

                    function moveHandler( event ) {

                        if ( !start ) {
                            return;
                        }

                        var data = event.originalEvent.touches ?
                            event.originalEvent.touches[ 0 ] : event;

                        stop = {
                            time: ( new Date() ).getTime(),
                            coords: [ data.pageX, data.pageY ]
                        };

                        // prevent scrolling
                        if ( Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.scrollSupressionThreshold ) {
                            event.preventDefault();
                        }
                    }

                    $this.bind( touchMoveEvent, moveHandler )
                        .one( touchStopEvent, function( event ) {
                            $this.unbind( touchMoveEvent, moveHandler );

                            if ( start && stop ) {
                                if ( stop.time - start.time < $.event.special.swipe.durationThreshold &&
                                    Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.horizontalDistanceThreshold &&
                                    Math.abs( start.coords[ 1 ] - stop.coords[ 1 ] ) < $.event.special.swipe.verticalDistanceThreshold ) {

                                    start.origin.trigger( "swipe" )
                                        .trigger( start.coords[0] > stop.coords[ 0 ] ? "swipeleft" : "swiperight" );
                                }
                            }
                            start = stop = undefined;
                        });
                });
            }
        };
        $.each({
            scrollstop: "scrollstart",
            taphold: "tap",
            swipeleft: "swipe",
            swiperight: "swipe"
        }, function( event, sourceEvent ) {

            $.event.special[ event ] = {
                setup: function() {
                    $( this ).bind( sourceEvent, $.noop );
                }
            };
        });

    })( jQuery, this );

    (function( $, undefined ) {
        $.extend( $.support, {
            orientation: "orientation" in window && "onorientationchange" in window
        });
    }( jQuery ));


    // throttled resize event
    (function( $ ) {
        $.event.special.throttledresize = {
            setup: function() {
                $( this ).bind( "resize", handler );
            },
            teardown: function() {
                $( this ).unbind( "resize", handler );
            }
        };

        var throttle = 250,
            handler = function() {
                curr = ( new Date() ).getTime();
                diff = curr - lastCall;

                if ( diff >= throttle ) {

                    lastCall = curr;
                    $( this ).trigger( "throttledresize" );

                } else {

                    if ( heldCall ) {
                        clearTimeout( heldCall );
                    }

                    // Promise a held call will still execute
                    heldCall = setTimeout( handler, throttle - diff );
                }
            },
            lastCall = 0,
            heldCall,
            curr,
            diff;
    })( jQuery );

    (function( $, window ) {
        var win = $( window ),
            event_name = "orientationchange",
            special_event,
            get_orientation,
            last_orientation,
            initial_orientation_is_landscape,
            initial_orientation_is_default,
            portrait_map = { "0": true, "180": true };

        // It seems that some device/browser vendors use window.orientation values 0 and 180 to
        // denote the "default" orientation. For iOS devices, and most other smart-phones tested,
        // the default orientation is always "portrait", but in some Android and RIM based tablets,
        // the default orientation is "landscape". The following code attempts to use the window
        // dimensions to figure out what the current orientation is, and then makes adjustments
        // to the to the portrait_map if necessary, so that we can properly decode the
        // window.orientation value whenever get_orientation() is called.
        //
        // Note that we used to use a media query to figure out what the orientation the browser
        // thinks it is in:
        //
        //     initial_orientation_is_landscape = $.mobile.media("all and (orientation: landscape)");
        //
        // but there was an iPhone/iPod Touch bug beginning with iOS 4.2, up through iOS 5.1,
        // where the browser *ALWAYS* applied the landscape media query. This bug does not
        // happen on iPad.

        if ( $.support.orientation ) {

            // Check the window width and height to figure out what the current orientation
            // of the device is at this moment. Note that we've initialized the portrait map
            // values to 0 and 180, *AND* we purposely check for landscape so that if we guess
            // wrong, , we default to the assumption that portrait is the default orientation.
            // We use a threshold check below because on some platforms like iOS, the iPhone
            // form-factor can report a larger width than height if the user turns on the
            // developer console. The actual threshold value is somewhat arbitrary, we just
            // need to make sure it is large enough to exclude the developer console case.

            var ww = window.innerWidth || $( window ).width(),
                wh = window.innerHeight || $( window ).height(),
                landscape_threshold = 50;

            initial_orientation_is_landscape = ww > wh && ( ww - wh ) > landscape_threshold;


            // Now check to see if the current window.orientation is 0 or 180.
            initial_orientation_is_default = portrait_map[ window.orientation ];

            // If the initial orientation is landscape, but window.orientation reports 0 or 180, *OR*
            // if the initial orientation is portrait, but window.orientation reports 90 or -90, we
            // need to flip our portrait_map values because landscape is the default orientation for
            // this device/browser.
            if ( ( initial_orientation_is_landscape && initial_orientation_is_default ) || ( !initial_orientation_is_landscape && !initial_orientation_is_default ) ) {
                portrait_map = { "-90": true, "90": true };
            }
        }

        $.event.special.orientationchange = $.extend( {}, $.event.special.orientationchange, {
            setup: function() {
                // If the event is supported natively, return false so that jQuery
                // will bind to the event using DOM methods.
                if ( $.support.orientation && !$.event.special.orientationchange.disabled ) {
                    return false;
                }

                // Get the current orientation to avoid initial double-triggering.
                last_orientation = get_orientation();

                // Because the orientationchange event doesn't exist, simulate the
                // event by testing window dimensions on resize.
                win.bind( "throttledresize", handler );
            },
            teardown: function() {
                // If the event is not supported natively, return false so that
                // jQuery will unbind the event using DOM methods.
                if ( $.support.orientation && !$.event.special.orientationchange.disabled ) {
                    return false;
                }

                // Because the orientationchange event doesn't exist, unbind the
                // resize event handler.
                win.unbind( "throttledresize", handler );
            },
            add: function( handleObj ) {
                // Save a reference to the bound event handler.
                var old_handler = handleObj.handler;


                handleObj.handler = function( event ) {
                    // Modify event object, adding the .orientation property.
                    event.orientation = get_orientation();

                    // Call the originally-bound event handler and return its result.
                    return old_handler.apply( this, arguments );
                };
            }
        });

        // If the event is not supported natively, this handler will be bound to
        // the window resize event to simulate the orientationchange event.
        function handler() {
            // Get the current orientation.
            var orientation = get_orientation();

            if ( orientation !== last_orientation ) {
                // The orientation has changed, so trigger the orientationchange event.
                last_orientation = orientation;
                win.trigger( event_name );
            }
        }

        // Get the current page orientation. This method is exposed publicly, should it
        // be needed, as jQuery.event.special.orientationchange.orientation()
        $.event.special.orientationchange.orientation = get_orientation = function() {
            var isPortrait = true, elem = document.documentElement;

            // prefer window orientation to the calculation based on screensize as
            // the actual screen resize takes place before or after the orientation change event
            // has been fired depending on implementation (eg android 2.3 is before, iphone after).
            // More testing is required to determine if a more reliable method of determining the new screensize
            // is possible when orientationchange is fired. (eg, use media queries + element + opacity)
            if ( $.support.orientation ) {
                // if the window orientation registers as 0 or 180 degrees report
                // portrait, otherwise landscape
                isPortrait = portrait_map[ window.orientation ];
            } else {
                isPortrait = elem && elem.clientWidth / elem.clientHeight < 1.1;
            }

            return isPortrait ? "portrait" : "landscape";
        };

        $.fn[ event_name ] = function( fn ) {
            return fn ? this.bind( event_name, fn ) : this.trigger( event_name );
        };

        // jQuery < 1.8
        if ( $.attrFn ) {
            $.attrFn[ event_name ] = true;
        }

    }( jQuery, this ));


    (function( $, undefined ) {

        var $window = $( window ),
            $html = $( "html" );

        /* $.mobile.media method: pass a CSS media type or query and get a bool return
         note: this feature relies on actual media query support for media queries, though types will work most anywhere
         examples:
         $.mobile.media('screen') // tests for screen media type
         $.mobile.media('screen and (min-width: 480px)') // tests for screen media type with window width > 480px
         $.mobile.media('@media screen and (-webkit-min-device-pixel-ratio: 2)') // tests for webkit 2x pixel ratio (iPhone 4)
         */
        $.mobile.media = (function() {
            // TODO: use window.matchMedia once at least one UA implements it
            var cache = {},
                testDiv = $( "<div id='jquery-mediatest'></div>" ),
                fakeBody = $( "<body>" ).append( testDiv );

            return function( query ) {
                if ( !( query in cache ) ) {
                    var styleBlock = document.createElement( "style" ),
                        cssrule = "@media " + query + " { #jquery-mediatest { position:absolute; } }";

                    //must set type for IE!
                    styleBlock.type = "text/css";

                    if ( styleBlock.styleSheet ) {
                        styleBlock.styleSheet.cssText = cssrule;
                    } else {
                        styleBlock.appendChild( document.createTextNode(cssrule) );
                    }

                    $html.prepend( fakeBody ).prepend( styleBlock );
                    cache[ query ] = testDiv.css( "position" ) === "absolute";
                    fakeBody.add( styleBlock ).remove();
                }
                return cache[ query ];
            };
        })();

    })(jQuery);

    (function( $, undefined ) {

// thx Modernizr
        function propExists( prop ) {
            var uc_prop = prop.charAt( 0 ).toUpperCase() + prop.substr( 1 ),
                props = ( prop + " " + vendors.join( uc_prop + " " ) + uc_prop ).split( " " );

            for ( var v in props ) {
                if ( fbCSS[ props[ v ] ] !== undefined ) {
                    return true;
                }
            }
        }

        var fakeBody = $( "<body>" ).prependTo( "html" ),
            fbCSS = fakeBody[ 0 ].style,
            vendors = [ "Webkit", "Moz", "O" ],
            webos = "palmGetResource" in window, //only used to rule out scrollTop
            opera = window.opera,
            operamini = window.operamini && ({}).toString.call( window.operamini ) === "[object OperaMini]",
            bb = window.blackberry && !propExists( "-webkit-transform" ); //only used to rule out box shadow, as it's filled opaque on BB 5 and lower


        function validStyle( prop, value, check_vend ) {
            var div = document.createElement( 'div' ),
                uc = function( txt ) {
                    return txt.charAt( 0 ).toUpperCase() + txt.substr( 1 );
                },
                vend_pref = function( vend ) {
                    return  "-" + vend.charAt( 0 ).toLowerCase() + vend.substr( 1 ) + "-";
                },
                check_style = function( vend ) {
                    var vend_prop = vend_pref( vend ) + prop + ": " + value + ";",
                        uc_vend = uc( vend ),
                        propStyle = uc_vend + uc( prop );

                    div.setAttribute( "style", vend_prop );

                    if ( !!div.style[ propStyle ] ) {
                        ret = true;
                    }
                },
                check_vends = check_vend ? [ check_vend ] : vendors,
                ret;

            for( var i = 0; i < check_vends.length; i++ ) {
                check_style( check_vends[i] );
            }
            return !!ret;
        }

// Thanks to Modernizr src for this test idea. `perspective` check is limited to Moz to prevent a false positive for 3D transforms on Android.
        function transform3dTest() {
            var prop = "transform-3d";
            return validStyle( 'perspective', '10px', 'moz' ) || $.mobile.media( "(-" + vendors.join( "-" + prop + "),(-" ) + "-" + prop + "),(" + prop + ")" );
        }

// Test for dynamic-updating base tag support ( allows us to avoid href,src attr rewriting )
        function baseTagTest() {
            var fauxBase = location.protocol + "//" + location.host + location.pathname + "ui-dir/",
                base = $( "head base" ),
                fauxEle = null,
                href = "",
                link, rebase;

            if ( !base.length ) {
                base = fauxEle = $( "<base>", { "href": fauxBase }).appendTo( "head" );
            } else {
                href = base.attr( "href" );
            }

            link = $( "<a href='testurl' />" ).prependTo( fakeBody );
            rebase = link[ 0 ].href;
            base[ 0 ].href = href || location.pathname;

            if ( fauxEle ) {
                fauxEle.remove();
            }
            return rebase.indexOf( fauxBase ) === 0;
        }

// Thanks Modernizr
        function cssPointerEventsTest() {
            var element = document.createElement( 'x' ),
                documentElement = document.documentElement,
                getComputedStyle = window.getComputedStyle,
                supports;

            if ( !( 'pointerEvents' in element.style ) ) {
                return false;
            }

            element.style.pointerEvents = 'auto';
            element.style.pointerEvents = 'x';
            documentElement.appendChild( element );
            supports = getComputedStyle &&
                getComputedStyle( element, '' ).pointerEvents === 'auto';
            documentElement.removeChild( element );
            return !!supports;
        }

        function boundingRect() {
            var div = document.createElement( "div" );
            return typeof div.getBoundingClientRect !== "undefined";
        }

// non-UA-based IE version check by James Padolsey, modified by jdalton - from http://gist.github.com/527683
// allows for inclusion of IE 6+, including Windows Mobile 7
        $.extend( $.mobile, { browser: {} } );
        $.mobile.browser.ie = (function() {
            var v = 3,
                div = document.createElement( "div" ),
                a = div.all || [];

            do {
                div.innerHTML = "<!--[if gt IE " + ( ++v ) + "]><br><![endif]-->";
            } while( a[0] );

            return v > 4 ? v : !v;
        })();


        $.extend( $.support, {
            cssTransitions: "WebKitTransitionEvent" in window || validStyle( 'transition', 'height 100ms linear' ) && !opera,
            pushState: "pushState" in history && "replaceState" in history,
            mediaquery: $.mobile.media( "only all" ),
            cssPseudoElement: !!propExists( "content" ),
            touchOverflow: !!propExists( "overflowScrolling" ),
            cssTransform3d: transform3dTest(),
            boxShadow: !!propExists( "boxShadow" ) && !bb,
            scrollTop: ( "pageXOffset" in window || "scrollTop" in document.documentElement || "scrollTop" in fakeBody[ 0 ] ) && !webos && !operamini,
            dynamicBaseTag: baseTagTest(),
            cssPointerEvents: cssPointerEventsTest(),
            boundingRect: boundingRect()
        });

        fakeBody.remove();


// $.mobile.ajaxBlacklist is used to override ajaxEnabled on platforms that have known conflicts with hash history updates (BB5, Symbian)
// or that generally work better browsing in regular http for full page refreshes (Opera Mini)
// Note: This detection below is used as a last resort.
// We recommend only using these detection methods when all other more reliable/forward-looking approaches are not possible
        var nokiaLTE7_3 = (function() {

            var ua = window.navigator.userAgent;

            //The following is an attempt to match Nokia browsers that are running Symbian/s60, with webkit, version 7.3 or older
            return ua.indexOf( "Nokia" ) > -1 &&
                ( ua.indexOf( "Symbian/3" ) > -1 || ua.indexOf( "Series60/5" ) > -1 ) &&
                ua.indexOf( "AppleWebKit" ) > -1 &&
                ua.match( /(BrowserNG|NokiaBrowser)\/7\.[0-3]/ );
        })();

// Support conditions that must be met in order to proceed
// default enhanced qualifications are media query support OR IE 7+

        $.mobile.gradeA = function() {
            return ( $.support.mediaquery || $.mobile.browser.ie && $.mobile.browser.ie >= 7 ) && ( $.support.boundingRect || $.fn.jquery.match(/1\.[0-7+]\.[0-9+]?/) !== null );
        };

        $.mobile.ajaxBlacklist =
            // BlackBerry browsers, pre-webkit
            window.blackberry && !window.WebKitPoint ||
                // Opera Mini
                operamini ||
                // Symbian webkits pre 7.3
                nokiaLTE7_3;

// Lastly, this workaround is the only way we've found so far to get pre 7.3 Symbian webkit devices
// to render the stylesheets when they're referenced before this script, as we'd recommend doing.
// This simply reappends the CSS in place, which for some reason makes it apply
        if ( nokiaLTE7_3 ) {
            $(function() {
                $( "head link[rel='stylesheet']" ).attr( "rel", "alternate stylesheet" ).attr( "rel", "stylesheet" );
            });
        }

// For ruling out shadows via css
        if ( !$.support.boxShadow ) {
            $( "html" ).addClass( "ui-mobile-nosupport-boxshadow" );
        }

    })( jQuery );

    (function( $, undefined ) {

        $.widget( "mobile.page", $.mobile.widget, {
            options: {
                theme: "c",
                domCache: false,
                keepNativeDefault: ":jqmData(role='none'), :jqmData(role='nojs')"
            },

            _create: function() {

                var self = this;

                // if false is returned by the callbacks do not create the page
                if ( self._trigger( "beforecreate" ) === false ) {
                    return false;
                }

                self.element
                    .attr( "tabindex", "0" )
                    .addClass( "ui-page ui-body-" + self.options.theme )
                    .bind( "pagebeforehide", function() {
                        self.removeContainerBackground();
                    } )
                    .bind( "pagebeforeshow", function() {
                        self.setContainerBackground();
                    } );

            },

            removeContainerBackground: function() {
                $.mobile.pageContainer.removeClass( "ui-overlay-" + $.mobile.getInheritedTheme( this.element.parent() ) );
            },

            // set the page container background to the page theme
            setContainerBackground: function( theme ) {
                if ( this.options.theme ) {
                    $.mobile.pageContainer.addClass( "ui-overlay-" + ( theme || this.options.theme ) );
                }
            },

            keepNativeSelector: function() {
                var options = this.options,
                    keepNativeDefined = options.keepNative && $.trim( options.keepNative );

                if ( keepNativeDefined && options.keepNative !== options.keepNativeDefault ) {
                    return [options.keepNative, options.keepNativeDefault].join( ", " );
                }

                return options.keepNativeDefault;
            }
        });
    })( jQuery );

// Script: jQuery hashchange event
// 
// *Version: 1.3, Last updated: 7/21/2010*
// 
// Project Home - http://benalman.com/projects/jquery-hashchange-plugin/
// GitHub       - http://github.com/cowboy/jquery-hashchange/
// Source       - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.js
// (Minified)   - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.min.js (0.8kb gzipped)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// These working examples, complete with fully commented code, illustrate a few
// ways in which this plugin can be used.
// 
// hashchange event - http://benalman.com/code/projects/jquery-hashchange/examples/hashchange/
// document.domain - http://benalman.com/code/projects/jquery-hashchange/examples/document_domain/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
// 
// jQuery Versions - 1.2.6, 1.3.2, 1.4.1, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-4, Chrome 5-6, Safari 3.2-5,
//                   Opera 9.6-10.60, iPhone 3.1, Android 1.6-2.2, BlackBerry 4.6-5.
// Unit Tests      - http://benalman.com/code/projects/jquery-hashchange/unit/
// 
// About: Known issues
// 
// While this jQuery hashchange event implementation is quite stable and
// robust, there are a few unfortunate browser bugs surrounding expected
// hashchange event-based behaviors, independent of any JavaScript
// window.onhashchange abstraction. See the following examples for more
// information:
// 
// Chrome: Back Button - http://benalman.com/code/projects/jquery-hashchange/examples/bug-chrome-back-button/
// Firefox: Remote XMLHttpRequest - http://benalman.com/code/projects/jquery-hashchange/examples/bug-firefox-remote-xhr/
// WebKit: Back Button in an Iframe - http://benalman.com/code/projects/jquery-hashchange/examples/bug-webkit-hash-iframe/
// Safari: Back Button from a different domain - http://benalman.com/code/projects/jquery-hashchange/examples/bug-safari-back-from-diff-domain/
// 
// Also note that should a browser natively support the window.onhashchange 
// event, but not report that it does, the fallback polling loop will be used.
// 
// About: Release History
// 
// 1.3   - (7/21/2010) Reorganized IE6/7 Iframe code to make it more
//         "removable" for mobile-only development. Added IE6/7 document.title
//         support. Attempted to make Iframe as hidden as possible by using
//         techniques from http://www.paciellogroup.com/blog/?p=604. Added 
//         support for the "shortcut" format $(window).hashchange( fn ) and
//         $(window).hashchange() like jQuery provides for built-in events.
//         Renamed jQuery.hashchangeDelay to <jQuery.fn.hashchange.delay> and
//         lowered its default value to 50. Added <jQuery.fn.hashchange.domain>
//         and <jQuery.fn.hashchange.src> properties plus document-domain.html
//         file to address access denied issues when setting document.domain in
//         IE6/7.
// 1.2   - (2/11/2010) Fixed a bug where coming back to a page using this plugin
//         from a page on another domain would cause an error in Safari 4. Also,
//         IE6/7 Iframe is now inserted after the body (this actually works),
//         which prevents the page from scrolling when the event is first bound.
//         Event can also now be bound before DOM ready, but it won't be usable
//         before then in IE6/7.
// 1.1   - (1/21/2010) Incorporated document.documentMode test to fix IE8 bug
//         where browser version is incorrectly reported as 8.0, despite
//         inclusion of the X-UA-Compatible IE=EmulateIE7 meta tag.
// 1.0   - (1/9/2010) Initial Release. Broke out the jQuery BBQ event.special
//         window.onhashchange functionality into a separate plugin for users
//         who want just the basic event & back button support, without all the
//         extra awesomeness that BBQ provides. This plugin will be included as
//         part of jQuery BBQ, but also be available separately.

    (function( $, window, undefined ) {
        // Reused string.
        var str_hashchange = 'hashchange',

        // Method / object references.
            doc = document,
            fake_onhashchange,
            special = $.event.special,

        // Does the browser support window.onhashchange? Note that IE8 running in
        // IE7 compatibility mode reports true for 'onhashchange' in window, even
        // though the event isn't supported, so also test document.documentMode.
            doc_mode = doc.documentMode,
            supports_onhashchange = 'on' + str_hashchange in window && ( doc_mode === undefined || doc_mode > 7 );

        // Get location.hash (or what you'd expect location.hash to be) sans any
        // leading #. Thanks for making this necessary, Firefox!
        function get_fragment( url ) {
            url = url || location.href;
            return '#' + url.replace( /^[^#]*#?(.*)$/, '$1' );
        };

        // Method: jQuery.fn.hashchange
        // 
        // Bind a handler to the window.onhashchange event or trigger all bound
        // window.onhashchange event handlers. This behavior is consistent with
        // jQuery's built-in event handlers.
        // 
        // Usage:
        // 
        // > jQuery(window).hashchange( [ handler ] );
        // 
        // Arguments:
        // 
        //  handler - (Function) Optional handler to be bound to the hashchange
        //    event. This is a "shortcut" for the more verbose form:
        //    jQuery(window).bind( 'hashchange', handler ). If handler is omitted,
        //    all bound window.onhashchange event handlers will be triggered. This
        //    is a shortcut for the more verbose
        //    jQuery(window).trigger( 'hashchange' ). These forms are described in
        //    the <hashchange event> section.
        // 
        // Returns:
        // 
        //  (jQuery) The initial jQuery collection of elements.

        // Allow the "shortcut" format $(elem).hashchange( fn ) for binding and
        // $(elem).hashchange() for triggering, like jQuery does for built-in events.
        $.fn[ str_hashchange ] = function( fn ) {
            return fn ? this.bind( str_hashchange, fn ) : this.trigger( str_hashchange );
        };

        // Property: jQuery.fn.hashchange.delay
        // 
        // The numeric interval (in milliseconds) at which the <hashchange event>
        // polling loop executes. Defaults to 50.

        // Property: jQuery.fn.hashchange.domain
        // 
        // If you're setting document.domain in your JavaScript, and you want hash
        // history to work in IE6/7, not only must this property be set, but you must
        // also set document.domain BEFORE jQuery is loaded into the page. This
        // property is only applicable if you are supporting IE6/7 (or IE8 operating
        // in "IE7 compatibility" mode).
        // 
        // In addition, the <jQuery.fn.hashchange.src> property must be set to the
        // path of the included "document-domain.html" file, which can be renamed or
        // modified if necessary (note that the document.domain specified must be the
        // same in both your main JavaScript as well as in this file).
        // 
        // Usage:
        // 
        // jQuery.fn.hashchange.domain = document.domain;

        // Property: jQuery.fn.hashchange.src
        // 
        // If, for some reason, you need to specify an Iframe src file (for example,
        // when setting document.domain as in <jQuery.fn.hashchange.domain>), you can
        // do so using this property. Note that when using this property, history
        // won't be recorded in IE6/7 until the Iframe src file loads. This property
        // is only applicable if you are supporting IE6/7 (or IE8 operating in "IE7
        // compatibility" mode).
        // 
        // Usage:
        // 
        // jQuery.fn.hashchange.src = 'path/to/file.html';

        $.fn[ str_hashchange ].delay = 50;
        /*
         $.fn[ str_hashchange ].domain = null;
         $.fn[ str_hashchange ].src = null;
         */

        // Event: hashchange event
        // 
        // Fired when location.hash changes. In browsers that support it, the native
        // HTML5 window.onhashchange event is used, otherwise a polling loop is
        // initialized, running every <jQuery.fn.hashchange.delay> milliseconds to
        // see if the hash has changed. In IE6/7 (and IE8 operating in "IE7
        // compatibility" mode), a hidden Iframe is created to allow the back button
        // and hash-based history to work.
        // 
        // Usage as described in <jQuery.fn.hashchange>:
        // 
        // > // Bind an event handler.
        // > jQuery(window).hashchange( function(e) {
        // >   var hash = location.hash;
        // >   ...
        // > });
        // > 
        // > // Manually trigger the event handler.
        // > jQuery(window).hashchange();
        // 
        // A more verbose usage that allows for event namespacing:
        // 
        // > // Bind an event handler.
        // > jQuery(window).bind( 'hashchange', function(e) {
        // >   var hash = location.hash;
        // >   ...
        // > });
        // > 
        // > // Manually trigger the event handler.
        // > jQuery(window).trigger( 'hashchange' );
        // 
        // Additional Notes:
        // 
        // * The polling loop and Iframe are not created until at least one handler
        //   is actually bound to the 'hashchange' event.
        // * If you need the bound handler(s) to execute immediately, in cases where
        //   a location.hash exists on page load, via bookmark or page refresh for
        //   example, use jQuery(window).hashchange() or the more verbose 
        //   jQuery(window).trigger( 'hashchange' ).
        // * The event can be bound before DOM ready, but since it won't be usable
        //   before then in IE6/7 (due to the necessary Iframe), recommended usage is
        //   to bind it inside a DOM ready handler.

        // Override existing $.event.special.hashchange methods (allowing this plugin
        // to be defined after jQuery BBQ in BBQ's source code).
        special[ str_hashchange ] = $.extend( special[ str_hashchange ], {

            // Called only when the first 'hashchange' event is bound to window.
            setup: function() {
                // If window.onhashchange is supported natively, there's nothing to do..
                if ( supports_onhashchange ) { return false; }

                // Otherwise, we need to create our own. And we don't want to call this
                // until the user binds to the event, just in case they never do, since it
                // will create a polling loop and possibly even a hidden Iframe.
                $( fake_onhashchange.start );
            },

            // Called only when the last 'hashchange' event is unbound from window.
            teardown: function() {
                // If window.onhashchange is supported natively, there's nothing to do..
                if ( supports_onhashchange ) { return false; }

                // Otherwise, we need to stop ours (if possible).
                $( fake_onhashchange.stop );
            }

        });

        // fake_onhashchange does all the work of triggering the window.onhashchange
        // event for browsers that don't natively support it, including creating a
        // polling loop to watch for hash changes and in IE 6/7 creating a hidden
        // Iframe to enable back and forward.
        fake_onhashchange = (function() {
            var self = {},
                timeout_id,

            // Remember the initial hash so it doesn't get triggered immediately.
                last_hash = get_fragment(),

                fn_retval = function( val ) { return val; },
                history_set = fn_retval,
                history_get = fn_retval;

            // Start the polling loop.
            self.start = function() {
                timeout_id || poll();
            };

            // Stop the polling loop.
            self.stop = function() {
                timeout_id && clearTimeout( timeout_id );
                timeout_id = undefined;
            };

            // This polling loop checks every $.fn.hashchange.delay milliseconds to see
            // if location.hash has changed, and triggers the 'hashchange' event on
            // window when necessary.
            function poll() {
                var hash = get_fragment(),
                    history_hash = history_get( last_hash );

                if ( hash !== last_hash ) {
                    history_set( last_hash = hash, history_hash );

                    $(window).trigger( str_hashchange );

                } else if ( history_hash !== last_hash ) {
                    location.href = location.href.replace( /#.*/, '' ) + history_hash;
                }

                timeout_id = setTimeout( poll, $.fn[ str_hashchange ].delay );
            };

            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            // vvvvvvvvvvvvvvvvvvv REMOVE IF NOT SUPPORTING IE6/7/8 vvvvvvvvvvvvvvvvvvv
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            $.browser.msie && !supports_onhashchange && (function() {
                // Not only do IE6/7 need the "magical" Iframe treatment, but so does IE8
                // when running in "IE7 compatibility" mode.

                var iframe,
                    iframe_src;

                // When the event is bound and polling starts in IE 6/7, create a hidden
                // Iframe for history handling.
                self.start = function() {
                    if ( !iframe ) {
                        iframe_src = $.fn[ str_hashchange ].src;
                        iframe_src = iframe_src && iframe_src + get_fragment();

                        // Create hidden Iframe. Attempt to make Iframe as hidden as possible
                        // by using techniques from http://www.paciellogroup.com/blog/?p=604.
                        iframe = $('<iframe tabindex="-1" title="empty"/>').hide()

                            // When Iframe has completely loaded, initialize the history and
                            // start polling.
                            .one( 'load', function() {
                                iframe_src || history_set( get_fragment() );
                                poll();
                            })

                            // Load Iframe src if specified, otherwise nothing.
                            .attr( 'src', iframe_src || 'javascript:0' )

                            // Append Iframe after the end of the body to prevent unnecessary
                            // initial page scrolling (yes, this works).
                            .insertAfter( 'body' )[0].contentWindow;

                        // Whenever `document.title` changes, update the Iframe's title to
                        // prettify the back/next history menu entries. Since IE sometimes
                        // errors with "Unspecified error" the very first time this is set
                        // (yes, very useful) wrap this with a try/catch block.
                        doc.onpropertychange = function() {
                            try {
                                if ( event.propertyName === 'title' ) {
                                    iframe.document.title = doc.title;
                                }
                            } catch(e) {}
                        };

                    }
                };

                // Override the "stop" method since an IE6/7 Iframe was created. Even
                // if there are no longer any bound event handlers, the polling loop
                // is still necessary for back/next to work at all!
                self.stop = fn_retval;

                // Get history by looking at the hidden Iframe's location.hash.
                history_get = function() {
                    return get_fragment( iframe.location.href );
                };

                // Set a new history item by opening and then closing the Iframe
                // document, *then* setting its location.hash. If document.domain has
                // been set, update that as well.
                history_set = function( hash, history_hash ) {
                    var iframe_doc = iframe.document,
                        domain = $.fn[ str_hashchange ].domain;

                    if ( hash !== history_hash ) {
                        // Update Iframe with any initial `document.title` that might be set.
                        iframe_doc.title = doc.title;

                        // Opening the Iframe's document after it has been closed is what
                        // actually adds a history entry.
                        iframe_doc.open();

                        // Set document.domain for the Iframe document as well, if necessary.
                        domain && iframe_doc.write( '<script>document.domain="' + domain + '"</script>' );

                        iframe_doc.close();

                        // Update the Iframe's hash, for great justice.
                        iframe.location.hash = hash;
                    }
                };

            })();
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // ^^^^^^^^^^^^^^^^^^^ REMOVE IF NOT SUPPORTING IE6/7/8 ^^^^^^^^^^^^^^^^^^^
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

            return self;
        })();

    })(jQuery,this);


    (function( $, window, undefined ) {

        var createHandler = function( sequential ) {

            // Default to sequential
            if ( sequential === undefined ) {
                sequential = true;
            }

            return function( name, reverse, $to, $from ) {

                var deferred = new $.Deferred(),
                    reverseClass = reverse ? " reverse" : "",
                    active	= $.mobile.urlHistory.getActive(),
                    toScroll = active.lastScroll || $.mobile.defaultHomeScroll,
                    screenHeight = $.mobile.getScreenHeight(),
                    maxTransitionOverride = $.mobile.maxTransitionWidth !== false && $( window ).width() > $.mobile.maxTransitionWidth,
                    none = !$.support.cssTransitions || maxTransitionOverride || !name || name === "none" || Math.max( $( window ).scrollTop(), toScroll ) > $.mobile.getMaxScrollForTransition(),
                    toPreClass = " ui-page-pre-in",
                    toggleViewportClass = function() {
                        $.mobile.pageContainer.toggleClass( "ui-mobile-viewport-transitioning viewport-" + name );
                    },
                    scrollPage = function() {
                        // By using scrollTo instead of silentScroll, we can keep things better in order
                        // Just to be precautios, disable scrollstart listening like silentScroll would
                        $.event.special.scrollstart.enabled = false;

                        window.scrollTo( 0, toScroll );

                        // reenable scrollstart listening like silentScroll would
                        setTimeout( function() {
                            $.event.special.scrollstart.enabled = true;
                        }, 150 );
                    },
                    cleanFrom = function() {
                        $from
                            .removeClass( $.mobile.activePageClass + " out in reverse " + name )
                            .height( "" );
                    },
                    startOut = function() {
                        // if it's not sequential, call the doneOut transition to start the TO page animating in simultaneously
                        if ( !sequential ) {
                            doneOut();
                        }
                        else {
                            $from.animationComplete( doneOut );
                        }

                        // Set the from page's height and start it transitioning out
                        // Note: setting an explicit height helps eliminate tiling in the transitions
                        $from
                            .height( screenHeight + $( window ).scrollTop() )
                            .addClass( name + " out" + reverseClass );
                    },

                    doneOut = function() {

                        if ( $from && sequential ) {
                            cleanFrom();
                        }

                        startIn();
                    },

                    startIn = function() {

                        // Prevent flickering in phonegap container: see comments at #4024 regarding iOS
                        $to.css( "z-index", -10 );

                        $to.addClass( $.mobile.activePageClass + toPreClass );

                        // Send focus to page as it is now display: block
                        $.mobile.focusPage( $to );

                        // Set to page height
                        $to.height( screenHeight + toScroll );

                        scrollPage();

                        // Restores visibility of the new page: added together with $to.css( "z-index", -10 );
                        $to.css( "z-index", "" );

                        if ( !none ) {
                            $to.animationComplete( doneIn );
                        }

                        $to
                            .removeClass( toPreClass )
                            .addClass( name + " in" + reverseClass );

                        if ( none ) {
                            doneIn();
                        }

                    },

                    doneIn = function() {

                        if ( !sequential ) {

                            if ( $from ) {
                                cleanFrom();
                            }
                        }

                        $to
                            .removeClass( "out in reverse " + name )
                            .height( "" );

                        toggleViewportClass();

                        // In some browsers (iOS5), 3D transitions block the ability to scroll to the desired location during transition
                        // This ensures we jump to that spot after the fact, if we aren't there already.
                        if ( $( window ).scrollTop() !== toScroll ) {
                            scrollPage();
                        }

                        deferred.resolve( name, reverse, $to, $from, true );
                    };

                toggleViewportClass();

                if ( $from && !none ) {
                    startOut();
                }
                else {
                    doneOut();
                }

                return deferred.promise();
            };
        };

// generate the handlers from the above
        var sequentialHandler = createHandler(),
            simultaneousHandler = createHandler( false ),
            defaultGetMaxScrollForTransition = function() {
                return $.mobile.getScreenHeight() * 3;
            };

// Make our transition handler the public default.
        $.mobile.defaultTransitionHandler = sequentialHandler;

//transition handler dictionary for 3rd party transitions
        $.mobile.transitionHandlers = {
            "default": $.mobile.defaultTransitionHandler,
            "sequential": sequentialHandler,
            "simultaneous": simultaneousHandler
        };

        $.mobile.transitionFallbacks = {};

// If transition is defined, check if css 3D transforms are supported, and if not, if a fallback is specified
        $.mobile._maybeDegradeTransition = function( transition ) {
            if ( transition && !$.support.cssTransform3d && $.mobile.transitionFallbacks[ transition ] ) {
                transition = $.mobile.transitionFallbacks[ transition ];
            }

            return transition;
        };

// Set the getMaxScrollForTransition to default if no implementation was set by user
        $.mobile.getMaxScrollForTransition = $.mobile.getMaxScrollForTransition || defaultGetMaxScrollForTransition;
    })( jQuery, this );

    (function( $, undefined ) {

        //define vars for interal use
        var $window = $( window ),
            $html = $( 'html' ),
            $head = $( 'head' ),

        //url path helpers for use in relative url management
            path = {

                // This scary looking regular expression parses an absolute URL or its relative
                // variants (protocol, site, document, query, and hash), into the various
                // components (protocol, host, path, query, fragment, etc that make up the
                // URL as well as some other commonly used sub-parts. When used with RegExp.exec()
                // or String.match, it parses the URL into a results array that looks like this:
                //
                //     [0]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread#msg-content
                //     [1]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread
                //     [2]: http://jblas:password@mycompany.com:8080/mail/inbox
                //     [3]: http://jblas:password@mycompany.com:8080
                //     [4]: http:
                //     [5]: //
                //     [6]: jblas:password@mycompany.com:8080
                //     [7]: jblas:password
                //     [8]: jblas
                //     [9]: password
                //    [10]: mycompany.com:8080
                //    [11]: mycompany.com
                //    [12]: 8080
                //    [13]: /mail/inbox
                //    [14]: /mail/
                //    [15]: inbox
                //    [16]: ?msg=1234&type=unread
                //    [17]: #msg-content
                //
                urlParseRE: /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,

                // Abstraction to address xss (Issue #4787) by removing the authority in
                // browsers that auto	decode it. All references to location.href should be
                // replaced with a call to this method so that it can be dealt with properly here
                getLocation: function( url ) {
                    var uri = url ? this.parseUrl( url ) : location,
                        hash = this.parseUrl( url || location.href ).hash;

                    // mimic the browser with an empty string when the hash is empty
                    hash = hash === "#" ? "" : hash;

                    // Make sure to parse the url or the location object for the hash because using location.hash
                    // is autodecoded in firefox, the rest of the url should be from the object (location unless
                    // we're testing) to avoid the inclusion of the authority
                    return uri.protocol + "//" + uri.host + uri.pathname + uri.search + hash;
                },

                parseLocation: function() {
                    return this.parseUrl( this.getLocation() );
                },

                //Parse a URL into a structure that allows easy access to
                //all of the URL components by name.
                parseUrl: function( url ) {
                    // If we're passed an object, we'll assume that it is
                    // a parsed url object and just return it back to the caller.
                    if ( $.type( url ) === "object" ) {
                        return url;
                    }

                    var matches = path.urlParseRE.exec( url || "" ) || [];

                    // Create an object that allows the caller to access the sub-matches
                    // by name. Note that IE returns an empty string instead of undefined,
                    // like all other browsers do, so we normalize everything so its consistent
                    // no matter what browser we're running on.
                    return {
                        href:         matches[  0 ] || "",
                        hrefNoHash:   matches[  1 ] || "",
                        hrefNoSearch: matches[  2 ] || "",
                        domain:       matches[  3 ] || "",
                        protocol:     matches[  4 ] || "",
                        doubleSlash:  matches[  5 ] || "",
                        authority:    matches[  6 ] || "",
                        username:     matches[  8 ] || "",
                        password:     matches[  9 ] || "",
                        host:         matches[ 10 ] || "",
                        hostname:     matches[ 11 ] || "",
                        port:         matches[ 12 ] || "",
                        pathname:     matches[ 13 ] || "",
                        directory:    matches[ 14 ] || "",
                        filename:     matches[ 15 ] || "",
                        search:       matches[ 16 ] || "",
                        hash:         matches[ 17 ] || ""
                    };
                },

                //Turn relPath into an asbolute path. absPath is
                //an optional absolute path which describes what
                //relPath is relative to.
                makePathAbsolute: function( relPath, absPath ) {
                    if ( relPath && relPath.charAt( 0 ) === "/" ) {
                        return relPath;
                    }

                    relPath = relPath || "";
                    absPath = absPath ? absPath.replace( /^\/|(\/[^\/]*|[^\/]+)$/g, "" ) : "";

                    var absStack = absPath ? absPath.split( "/" ) : [],
                        relStack = relPath.split( "/" );
                    for ( var i = 0; i < relStack.length; i++ ) {
                        var d = relStack[ i ];
                        switch ( d ) {
                            case ".":
                                break;
                            case "..":
                                if ( absStack.length ) {
                                    absStack.pop();
                                }
                                break;
                            default:
                                absStack.push( d );
                                break;
                        }
                    }
                    return "/" + absStack.join( "/" );
                },

                //Returns true if both urls have the same domain.
                isSameDomain: function( absUrl1, absUrl2 ) {
                    return path.parseUrl( absUrl1 ).domain === path.parseUrl( absUrl2 ).domain;
                },

                //Returns true for any relative variant.
                isRelativeUrl: function( url ) {
                    // All relative Url variants have one thing in common, no protocol.
                    return path.parseUrl( url ).protocol === "";
                },

                //Returns true for an absolute url.
                isAbsoluteUrl: function( url ) {
                    return path.parseUrl( url ).protocol !== "";
                },

                //Turn the specified realtive URL into an absolute one. This function
                //can handle all relative variants (protocol, site, document, query, fragment).
                makeUrlAbsolute: function( relUrl, absUrl ) {
                    if ( !path.isRelativeUrl( relUrl ) ) {
                        return relUrl;
                    }

                    if ( absUrl === undefined ) {
                        absUrl = documentBase;
                    }

                    var relObj = path.parseUrl( relUrl ),
                        absObj = path.parseUrl( absUrl ),
                        protocol = relObj.protocol || absObj.protocol,
                        doubleSlash = relObj.protocol ? relObj.doubleSlash : ( relObj.doubleSlash || absObj.doubleSlash ),
                        authority = relObj.authority || absObj.authority,
                        hasPath = relObj.pathname !== "",
                        pathname = path.makePathAbsolute( relObj.pathname || absObj.filename, absObj.pathname ),
                        search = relObj.search || ( !hasPath && absObj.search ) || "",
                        hash = relObj.hash;

                    return protocol + doubleSlash + authority + pathname + search + hash;
                },

                //Add search (aka query) params to the specified url.
                addSearchParams: function( url, params ) {
                    var u = path.parseUrl( url ),
                        p = ( typeof params === "object" ) ? $.param( params ) : params,
                        s = u.search || "?";
                    return u.hrefNoSearch + s + ( s.charAt( s.length - 1 ) !== "?" ? "&" : "" ) + p + ( u.hash || "" );
                },

                convertUrlToDataUrl: function( absUrl ) {
                    var u = path.parseUrl( absUrl );
                    if ( path.isEmbeddedPage( u ) ) {
                        // For embedded pages, remove the dialog hash key as in getFilePath(),
                        // otherwise the Data Url won't match the id of the embedded Page.
                        return u.hash.split( dialogHashKey )[0].replace( /^#/, "" );
                    } else if ( path.isSameDomain( u, documentBase ) ) {
                        return u.hrefNoHash.replace( documentBase.domain, "" ).split( dialogHashKey )[0];
                    }

                    return window.decodeURIComponent(absUrl);
                },

                //get path from current hash, or from a file path
                get: function( newPath ) {
                    if ( newPath === undefined ) {
                        newPath = path.parseLocation().hash;
                    }
                    return path.stripHash( newPath ).replace( /[^\/]*\.[^\/*]+$/, '' );
                },

                //return the substring of a filepath before the sub-page key, for making a server request
                getFilePath: function( path ) {
                    var splitkey = '&' + $.mobile.subPageUrlKey;
                    return path && path.split( splitkey )[0].split( dialogHashKey )[0];
                },

                //set location hash to path
                set: function( path ) {
                    location.hash = path;
                },

                //test if a given url (string) is a path
                //NOTE might be exceptionally naive
                isPath: function( url ) {
                    return ( /\// ).test( url );
                },

                //return a url path with the window's location protocol/hostname/pathname removed
                clean: function( url ) {
                    return url.replace( documentBase.domain, "" );
                },

                //just return the url without an initial #
                stripHash: function( url ) {
                    return url.replace( /^#/, "" );
                },

                //remove the preceding hash, any query params, and dialog notations
                cleanHash: function( hash ) {
                    return path.stripHash( hash.replace( /\?.*$/, "" ).replace( dialogHashKey, "" ) );
                },

                isHashValid: function( hash ) {
                    return ( /^#[^#]+$/ ).test( hash );
                },

                //check whether a url is referencing the same domain, or an external domain or different protocol
                //could be mailto, etc
                isExternal: function( url ) {
                    var u = path.parseUrl( url );
                    return u.protocol && u.domain !== documentUrl.domain ? true : false;
                },

                hasProtocol: function( url ) {
                    return ( /^(:?\w+:)/ ).test( url );
                },

                //check if the specified url refers to the first page in the main application document.
                isFirstPageUrl: function( url ) {
                    // We only deal with absolute paths.
                    var u = path.parseUrl( path.makeUrlAbsolute( url, documentBase ) ),

                    // Does the url have the same path as the document?
                        samePath = u.hrefNoHash === documentUrl.hrefNoHash || ( documentBaseDiffers && u.hrefNoHash === documentBase.hrefNoHash ),

                    // Get the first page element.
                        fp = $.mobile.firstPage,

                    // Get the id of the first page element if it has one.
                        fpId = fp && fp[0] ? fp[0].id : undefined;

                    // The url refers to the first page if the path matches the document and
                    // it either has no hash value, or the hash is exactly equal to the id of the
                    // first page element.
                    return samePath && ( !u.hash || u.hash === "#" || ( fpId && u.hash.replace( /^#/, "" ) === fpId ) );
                },

                isEmbeddedPage: function( url ) {
                    var u = path.parseUrl( url );

                    //if the path is absolute, then we need to compare the url against
                    //both the documentUrl and the documentBase. The main reason for this
                    //is that links embedded within external documents will refer to the
                    //application document, whereas links embedded within the application
                    //document will be resolved against the document base.
                    if ( u.protocol !== "" ) {
                        return ( u.hash && ( u.hrefNoHash === documentUrl.hrefNoHash || ( documentBaseDiffers && u.hrefNoHash === documentBase.hrefNoHash ) ) );
                    }
                    return ( /^#/ ).test( u.href );
                },


                // Some embedded browsers, like the web view in Phone Gap, allow cross-domain XHR
                // requests if the document doing the request was loaded via the file:// protocol.
                // This is usually to allow the application to "phone home" and fetch app specific
                // data. We normally let the browser handle external/cross-domain urls, but if the
                // allowCrossDomainPages option is true, we will allow cross-domain http/https
                // requests to go through our page loading logic.
                isPermittedCrossDomainRequest: function( docUrl, reqUrl ) {
                    return $.mobile.allowCrossDomainPages &&
                        docUrl.protocol === "file:" &&
                        reqUrl.search( /^https?:/ ) !== -1;
                }
            },

        //will be defined when a link is clicked and given an active class
            $activeClickedLink = null,

        //urlHistory is purely here to make guesses at whether the back or forward button was clicked
        //and provide an appropriate transition
            urlHistory = {
                // Array of pages that are visited during a single page load.
                // Each has a url and optional transition, title, and pageUrl (which represents the file path, in cases where URL is obscured, such as dialogs)
                stack: [],

                //maintain an index number for the active page in the stack
                activeIndex: 0,

                //get active
                getActive: function() {
                    return urlHistory.stack[ urlHistory.activeIndex ];
                },

                getPrev: function() {
                    return urlHistory.stack[ urlHistory.activeIndex - 1 ];
                },

                getNext: function() {
                    return urlHistory.stack[ urlHistory.activeIndex + 1 ];
                },

                // addNew is used whenever a new page is added
                addNew: function( url, transition, title, pageUrl, role ) {
                    //if there's forward history, wipe it
                    if ( urlHistory.getNext() ) {
                        urlHistory.clearForward();
                    }

                    urlHistory.stack.push( {url : url, transition: transition, title: title, pageUrl: pageUrl, role: role } );

                    urlHistory.activeIndex = urlHistory.stack.length - 1;
                },

                //wipe urls ahead of active index
                clearForward: function() {
                    urlHistory.stack = urlHistory.stack.slice( 0, urlHistory.activeIndex + 1 );
                },

                directHashChange: function( opts ) {
                    var back , forward, newActiveIndex, prev = this.getActive();

                    // check if url is in history and if it's ahead or behind current page
                    $.each( urlHistory.stack, function( i, historyEntry ) {

                        //if the url is in the stack, it's a forward or a back
                        if ( decodeURIComponent( opts.currentUrl ) === decodeURIComponent( historyEntry.url ) ) {
                            //define back and forward by whether url is older or newer than current page
                            back = i < urlHistory.activeIndex;
                            forward = !back;
                            newActiveIndex = i;
                        }
                    });

                    // save new page index, null check to prevent falsey 0 result
                    this.activeIndex = newActiveIndex !== undefined ? newActiveIndex : this.activeIndex;

                    if ( back ) {
                        ( opts.either || opts.isBack )( true );
                    } else if ( forward ) {
                        ( opts.either || opts.isForward )( false );
                    }
                },

                //disable hashchange event listener internally to ignore one change
                //toggled internally when location.hash is updated to match the url of a successful page load
                ignoreNextHashChange: false
            },

        //define first selector to receive focus when a page is shown
            focusable = "[tabindex],a,button:visible,select:visible,input",

        //queue to hold simultanious page transitions
            pageTransitionQueue = [],

        //indicates whether or not page is in process of transitioning
            isPageTransitioning = false,

        //nonsense hash change key for dialogs, so they create a history entry
            dialogHashKey = "&ui-state=dialog",

        //existing base tag?
            $base = $head.children( "base" ),

        //tuck away the original document URL minus any fragment.
            documentUrl = path.parseLocation(),

        //if the document has an embedded base tag, documentBase is set to its
        //initial value. If a base tag does not exist, then we default to the documentUrl.
            documentBase = $base.length ? path.parseUrl( path.makeUrlAbsolute( $base.attr( "href" ), documentUrl.href ) ) : documentUrl,

        //cache the comparison once.
            documentBaseDiffers = ( documentUrl.hrefNoHash !== documentBase.hrefNoHash ),

            getScreenHeight = $.mobile.getScreenHeight;

        //base element management, defined depending on dynamic base tag support
        var base = $.support.dynamicBaseTag ? {

            //define base element, for use in routing asset urls that are referenced in Ajax-requested markup
            element: ( $base.length ? $base : $( "<base>", { href: documentBase.hrefNoHash } ).prependTo( $head ) ),

            //set the generated BASE element's href attribute to a new page's base path
            set: function( href ) {
                base.element.attr( "href", path.makeUrlAbsolute( href, documentBase ) );
            },

            //set the generated BASE element's href attribute to a new page's base path
            reset: function() {
                base.element.attr( "href", documentBase.hrefNoHash );
            }

        } : undefined;

        /* internal utility functions */

        // NOTE Issue #4950 Android phonegap doesn't navigate back properly
        //      when a full page refresh has taken place. It appears that hashchange
        //      and replacestate history alterations work fine but we need to support
        //      both forms of history traversal in our code that uses backward history
        //      movement
        $.mobile.back = function() {
            var nav = window.navigator;

            // if the setting is on and the navigator object is
            // available use the phonegap navigation capability
            if( this.phonegapNavigationEnabled &&
                nav &&
                nav.app &&
                nav.app.backHistory ){
                nav.app.backHistory();
            } else {
                window.history.back();
            }
        };

        //direct focus to the page title, or otherwise first focusable element
        $.mobile.focusPage = function ( page ) {
            var autofocus = page.find( "[autofocus]" ),
                pageTitle = page.find( ".ui-title:eq(0)" );

            if ( autofocus.length ) {
                autofocus.focus();
                return;
            }

            if ( pageTitle.length ) {
                pageTitle.focus();
            } else{
                page.focus();
            }
        };

        //remove active classes after page transition or error
        function removeActiveLinkClass( forceRemoval ) {
            if ( !!$activeClickedLink && ( !$activeClickedLink.closest( "." + $.mobile.activePageClass ).length || forceRemoval ) ) {
                $activeClickedLink.removeClass( $.mobile.activeBtnClass );
            }
            $activeClickedLink = null;
        }

        function releasePageTransitionLock() {
            isPageTransitioning = false;
            if ( pageTransitionQueue.length > 0 ) {
                $.mobile.changePage.apply( null, pageTransitionQueue.pop() );
            }
        }

        // Save the last scroll distance per page, before it is hidden
        var setLastScrollEnabled = true,
            setLastScroll, delayedSetLastScroll;

        setLastScroll = function() {
            // this barrier prevents setting the scroll value based on the browser
            // scrolling the window based on a hashchange
            if ( !setLastScrollEnabled ) {
                return;
            }

            var active = $.mobile.urlHistory.getActive();

            if ( active ) {
                var lastScroll = $window.scrollTop();

                // Set active page's lastScroll prop.
                // If the location we're scrolling to is less than minScrollBack, let it go.
                active.lastScroll = lastScroll < $.mobile.minScrollBack ? $.mobile.defaultHomeScroll : lastScroll;
            }
        };

        // bind to scrollstop to gather scroll position. The delay allows for the hashchange
        // event to fire and disable scroll recording in the case where the browser scrolls
        // to the hash targets location (sometimes the top of the page). once pagechange fires
        // getLastScroll is again permitted to operate
        delayedSetLastScroll = function() {
            setTimeout( setLastScroll, 100 );
        };

        // disable an scroll setting when a hashchange has been fired, this only works
        // because the recording of the scroll position is delayed for 100ms after
        // the browser might have changed the position because of the hashchange
        $window.bind( $.support.pushState ? "popstate" : "hashchange", function() {
            setLastScrollEnabled = false;
        });

        // handle initial hashchange from chrome :(
        $window.one( $.support.pushState ? "popstate" : "hashchange", function() {
            setLastScrollEnabled = true;
        });

        // wait until the mobile page container has been determined to bind to pagechange
        $window.one( "pagecontainercreate", function() {
            // once the page has changed, re-enable the scroll recording
            $.mobile.pageContainer.bind( "pagechange", function() {

                setLastScrollEnabled = true;

                // remove any binding that previously existed on the get scroll
                // which may or may not be different than the scroll element determined for
                // this page previously
                $window.unbind( "scrollstop", delayedSetLastScroll );

                // determine and bind to the current scoll element which may be the window
                // or in the case of touch overflow the element with touch overflow
                $window.bind( "scrollstop", delayedSetLastScroll );
            });
        });

        // bind to scrollstop for the first page as "pagechange" won't be fired in that case
        $window.bind( "scrollstop", delayedSetLastScroll );

        // No-op implementation of transition degradation
        $.mobile._maybeDegradeTransition = $.mobile._maybeDegradeTransition || function( transition ) {
            return transition;
        };

        //function for transitioning between two existing pages
        function transitionPages( toPage, fromPage, transition, reverse ) {

            if ( fromPage ) {
                //trigger before show/hide events
                fromPage.data( "page" )._trigger( "beforehide", null, { nextPage: toPage } );
            }

            toPage.data( "page" )._trigger( "beforeshow", null, { prevPage: fromPage || $( "" ) } );

            //clear page loader
            $.mobile.hidePageLoadingMsg();

            transition = $.mobile._maybeDegradeTransition( transition );

            //find the transition handler for the specified transition. If there
            //isn't one in our transitionHandlers dictionary, use the default one.
            //call the handler immediately to kick-off the transition.
            var th = $.mobile.transitionHandlers[ transition || "default" ] || $.mobile.defaultTransitionHandler,
                promise = th( transition, reverse, toPage, fromPage );

            promise.done(function() {

                //trigger show/hide events
                if ( fromPage ) {
                    fromPage.data( "page" )._trigger( "hide", null, { nextPage: toPage } );
                }

                //trigger pageshow, define prevPage as either fromPage or empty jQuery obj
                toPage.data( "page" )._trigger( "show", null, { prevPage: fromPage || $( "" ) } );
            });

            return promise;
        }

        //simply set the active page's minimum height to screen height, depending on orientation
        function resetActivePageHeight() {
            var aPage = $( "." + $.mobile.activePageClass ),
                aPagePadT = parseFloat( aPage.css( "padding-top" ) ),
                aPagePadB = parseFloat( aPage.css( "padding-bottom" ) ),
                aPageBorderT = parseFloat( aPage.css( "border-top-width" ) ),
                aPageBorderB = parseFloat( aPage.css( "border-bottom-width" ) );

            aPage.css( "min-height", getScreenHeight() - aPagePadT - aPagePadB - aPageBorderT - aPageBorderB );
        }

        //shared page enhancements
        function enhancePage( $page, role ) {
            // If a role was specified, make sure the data-role attribute
            // on the page element is in sync.
            if ( role ) {
                $page.attr( "data-" + $.mobile.ns + "role", role );
            }

            //run page plugin
            $page.page();
        }

        /* exposed $.mobile methods */

        //animation complete callback
        $.fn.animationComplete = function( callback ) {
            if ( $.support.cssTransitions ) {
                return $( this ).one( 'webkitAnimationEnd animationend', callback );
            }
            else{
                // defer execution for consistency between webkit/non webkit
                setTimeout( callback, 0 );
                return $( this );
            }
        };

        //expose path object on $.mobile
        $.mobile.path = path;

        //expose base object on $.mobile
        $.mobile.base = base;

        //history stack
        $.mobile.urlHistory = urlHistory;

        $.mobile.dialogHashKey = dialogHashKey;



        //enable cross-domain page support
        $.mobile.allowCrossDomainPages = false;

        //return the original document url
        $.mobile.getDocumentUrl = function( asParsedObject ) {
            return asParsedObject ? $.extend( {}, documentUrl ) : documentUrl.href;
        };

        //return the original document base url
        $.mobile.getDocumentBase = function( asParsedObject ) {
            return asParsedObject ? $.extend( {}, documentBase ) : documentBase.href;
        };

        $.mobile._bindPageRemove = function() {
            var page = $( this );

            // when dom caching is not enabled or the page is embedded bind to remove the page on hide
            if ( !page.data( "page" ).options.domCache &&
                page.is( ":jqmData(external-page='true')" ) ) {

                page.bind( 'pagehide.remove', function() {
                    var $this = $( this ),
                        prEvent = new $.Event( "pageremove" );

                    $this.trigger( prEvent );

                    if ( !prEvent.isDefaultPrevented() ) {
                        $this.removeWithDependents();
                    }
                });
            }
        };

        // Load a page into the DOM.
        $.mobile.loadPage = function( url, options ) {
            // This function uses deferred notifications to let callers
            // know when the page is done loading, or if an error has occurred.
            var deferred = $.Deferred(),

            // The default loadPage options with overrides specified by
            // the caller.
                settings = $.extend( {}, $.mobile.loadPage.defaults, options ),

            // The DOM element for the page after it has been loaded.
                page = null,

            // If the reloadPage option is true, and the page is already
            // in the DOM, dupCachedPage will be set to the page element
            // so that it can be removed after the new version of the
            // page is loaded off the network.
                dupCachedPage = null,

            // determine the current base url
                findBaseWithDefault = function() {
                    var closestBase = ( $.mobile.activePage && getClosestBaseUrl( $.mobile.activePage ) );
                    return closestBase || documentBase.hrefNoHash;
                },

            // The absolute version of the URL passed into the function. This
            // version of the URL may contain dialog/subpage params in it.
                absUrl = path.makeUrlAbsolute( url, findBaseWithDefault() );


            // If the caller provided data, and we're using "get" request,
            // append the data to the URL.
            if ( settings.data && settings.type === "get" ) {
                absUrl = path.addSearchParams( absUrl, settings.data );
                settings.data = undefined;
            }

            // If the caller is using a "post" request, reloadPage must be true
            if ( settings.data && settings.type === "post" ) {
                settings.reloadPage = true;
            }

            // The absolute version of the URL minus any dialog/subpage params.
            // In otherwords the real URL of the page to be loaded.
            var fileUrl = path.getFilePath( absUrl ),

            // The version of the Url actually stored in the data-url attribute of
            // the page. For embedded pages, it is just the id of the page. For pages
            // within the same domain as the document base, it is the site relative
            // path. For cross-domain pages (Phone Gap only) the entire absolute Url
            // used to load the page.
                dataUrl = path.convertUrlToDataUrl( absUrl );

            // Make sure we have a pageContainer to work with.
            settings.pageContainer = settings.pageContainer || $.mobile.pageContainer;

            // Check to see if the page already exists in the DOM.
            // NOTE do _not_ use the :jqmData psuedo selector because parenthesis
            //      are a valid url char and it breaks on the first occurence
            page = settings.pageContainer.children( "[data-" + $.mobile.ns +"url='" + dataUrl + "']" );

            // If we failed to find the page, check to see if the url is a
            // reference to an embedded page. If so, it may have been dynamically
            // injected by a developer, in which case it would be lacking a data-url
            // attribute and in need of enhancement.
            if ( page.length === 0 && dataUrl && !path.isPath( dataUrl ) ) {
                page = settings.pageContainer.children( "#" + dataUrl )
                    .attr( "data-" + $.mobile.ns + "url", dataUrl )
                    .jqmData( "url", dataUrl );
            }


            // If we failed to find a page in the DOM, check the URL to see if it
            // refers to the first page in the application. If it isn't a reference
            // to the first page and refers to non-existent embedded page, error out.
            if ( page.length === 0 ) {
                if ( $.mobile.firstPage && path.isFirstPageUrl( fileUrl ) ) {
                    // Check to make sure our cached-first-page is actually
                    // in the DOM. Some user deployed apps are pruning the first
                    // page from the DOM for various reasons, we check for this
                    // case here because we don't want a first-page with an id
                    // falling through to the non-existent embedded page error
                    // case. If the first-page is not in the DOM, then we let
                    // things fall through to the ajax loading code below so
                    // that it gets reloaded.
                    if ( $.mobile.firstPage.parent().length ) {
                        page = $( $.mobile.firstPage );
                    }
                } else if ( path.isEmbeddedPage( fileUrl )  ) {
                    deferred.reject( absUrl, options );
                    return deferred.promise();
                }
            }

            // If the page we are interested in is already in the DOM,
            // and the caller did not indicate that we should force a
            // reload of the file, we are done. Otherwise, track the
            // existing page as a duplicated.
            if ( page.length ) {
                if ( !settings.reloadPage ) {
                    enhancePage( page, settings.role );
                    deferred.resolve( absUrl, options, page );
                    //if we are reloading the page make sure we update the base if its not a prefetch 
                    if( base && !options.prefetch ){
                        base.set(url);
                    }
                    return deferred.promise();
                }
                dupCachedPage = page;
            }
            var mpc = settings.pageContainer,
                pblEvent = new $.Event( "pagebeforeload" ),
                triggerData = { url: url, absUrl: absUrl, dataUrl: dataUrl, deferred: deferred, options: settings };

            // Let listeners know we're about to load a page.
            mpc.trigger( pblEvent, triggerData );

            // If the default behavior is prevented, stop here!
            if ( pblEvent.isDefaultPrevented() ) {
                return deferred.promise();
            }

            if ( settings.showLoadMsg ) {

                // This configurable timeout allows cached pages a brief delay to load without showing a message
                var loadMsgDelay = setTimeout(function() {
                        $.mobile.showPageLoadingMsg();
                    }, settings.loadMsgDelay ),

                // Shared logic for clearing timeout and removing message.
                    hideMsg = function() {

                        // Stop message show timer
                        clearTimeout( loadMsgDelay );

                        // Hide loading message
                        $.mobile.hidePageLoadingMsg();
                    };
            }
            // Reset base to the default document base.
            // only reset if we are not prefetching 
            if ( base && typeof options.prefetch === "undefined" ) {
                base.reset();
            }

            if ( !( $.mobile.allowCrossDomainPages || path.isSameDomain( documentUrl, absUrl ) ) ) {
                deferred.reject( absUrl, options );
            } else {
                // Load the new page.
                $.ajax({
                    url: fileUrl,
                    type: settings.type,
                    data: settings.data,
                    dataType: "html",
                    success: function( html, textStatus, xhr ) {
                        //pre-parse html to check for a data-url,
                        //use it as the new fileUrl, base path, etc
                        var all = $( "<div></div>" ),

                        //page title regexp
                            newPageTitle = html.match( /<title[^>]*>([^<]*)/ ) && RegExp.$1,

                        // TODO handle dialogs again
                            pageElemRegex = new RegExp( "(<[^>]+\\bdata-" + $.mobile.ns + "role=[\"']?page[\"']?[^>]*>)" ),
                            dataUrlRegex = new RegExp( "\\bdata-" + $.mobile.ns + "url=[\"']?([^\"'>]*)[\"']?" );


                        // data-url must be provided for the base tag so resource requests can be directed to the
                        // correct url. loading into a temprorary element makes these requests immediately
                        if ( pageElemRegex.test( html ) &&
                            RegExp.$1 &&
                            dataUrlRegex.test( RegExp.$1 ) &&
                            RegExp.$1 ) {
                            url = fileUrl = path.getFilePath( $( "<div>" + RegExp.$1 + "</div>" ).text() );
                        }
                        //dont update the base tag if we are prefetching
                        if ( base && typeof options.prefetch === "undefined") {
                            base.set( fileUrl );
                        }

                        //workaround to allow scripts to execute when included in page divs
                        all.get( 0 ).innerHTML = html;
                        page = all.find( ":jqmData(role='page'), :jqmData(role='dialog')" ).first();

                        //if page elem couldn't be found, create one and insert the body element's contents
                        if ( !page.length ) {
                            page = $( "<div data-" + $.mobile.ns + "role='page'>" + html.split( /<\/?body[^>]*>/gmi )[1] + "</div>" );
                        }

                        if ( newPageTitle && !page.jqmData( "title" ) ) {
                            if ( ~newPageTitle.indexOf( "&" ) ) {
                                newPageTitle = $( "<div>" + newPageTitle + "</div>" ).text();
                            }
                            page.jqmData( "title", newPageTitle );
                        }

                        //rewrite src and href attrs to use a base url
                        if ( !$.support.dynamicBaseTag ) {
                            var newPath = path.get( fileUrl );
                            page.find( "[src], link[href], a[rel='external'], :jqmData(ajax='false'), a[target]" ).each(function() {
                                var thisAttr = $( this ).is( '[href]' ) ? 'href' :
                                        $( this ).is( '[src]' ) ? 'src' : 'action',
                                    thisUrl = $( this ).attr( thisAttr );

                                // XXX_jblas: We need to fix this so that it removes the document
                                //            base URL, and then prepends with the new page URL.
                                //if full path exists and is same, chop it - helps IE out
                                thisUrl = thisUrl.replace( location.protocol + '//' + location.host + location.pathname, '' );

                                if ( !/^(\w+:|#|\/)/.test( thisUrl ) ) {
                                    $( this ).attr( thisAttr, newPath + thisUrl );
                                }
                            });
                        }

                        //append to page and enhance
                        // TODO taging a page with external to make sure that embedded pages aren't removed
                        //      by the various page handling code is bad. Having page handling code in many
                        //      places is bad. Solutions post 1.0
                        page
                            .attr( "data-" + $.mobile.ns + "url", path.convertUrlToDataUrl( fileUrl ) )
                            .attr( "data-" + $.mobile.ns + "external-page", true )
                            .appendTo( settings.pageContainer );

                        // wait for page creation to leverage options defined on widget
                        page.one( 'pagecreate', $.mobile._bindPageRemove );

                        enhancePage( page, settings.role );

                        // Enhancing the page may result in new dialogs/sub pages being inserted
                        // into the DOM. If the original absUrl refers to a sub-page, that is the
                        // real page we are interested in.
                        if ( absUrl.indexOf( "&" + $.mobile.subPageUrlKey ) > -1 ) {
                            page = settings.pageContainer.children( "[data-" + $.mobile.ns +"url='" + dataUrl + "']" );
                        }

                        //bind pageHide to removePage after it's hidden, if the page options specify to do so

                        // Remove loading message.
                        if ( settings.showLoadMsg ) {
                            hideMsg();
                        }

                        // Add the page reference and xhr to our triggerData.
                        triggerData.xhr = xhr;
                        triggerData.textStatus = textStatus;
                        triggerData.page = page;

                        // Let listeners know the page loaded successfully.
                        settings.pageContainer.trigger( "pageload", triggerData );

                        deferred.resolve( absUrl, options, page, dupCachedPage );
                    },
                    error: function( xhr, textStatus, errorThrown ) {
                        //set base back to current path
                        if ( base ) {
                            base.set( path.get() );
                        }

                        // Add error info to our triggerData.
                        triggerData.xhr = xhr;
                        triggerData.textStatus = textStatus;
                        triggerData.errorThrown = errorThrown;

                        var plfEvent = new $.Event( "pageloadfailed" );

                        // Let listeners know the page load failed.
                        settings.pageContainer.trigger( plfEvent, triggerData );

                        // If the default behavior is prevented, stop here!
                        // Note that it is the responsibility of the listener/handler
                        // that called preventDefault(), to resolve/reject the
                        // deferred object within the triggerData.
                        if ( plfEvent.isDefaultPrevented() ) {
                            return;
                        }

                        // Remove loading message.
                        if ( settings.showLoadMsg ) {

                            // Remove loading message.
                            hideMsg();

                            // show error message
                            $.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, $.mobile.pageLoadErrorMessage, true );

                            // hide after delay
                            setTimeout( $.mobile.hidePageLoadingMsg, 1500 );
                        }

                        deferred.reject( absUrl, options );
                    }
                });
            }

            return deferred.promise();
        };

        $.mobile.loadPage.defaults = {
            type: "get",
            data: undefined,
            reloadPage: false,
            role: undefined, // By default we rely on the role defined by the @data-role attribute.
            showLoadMsg: false,
            pageContainer: undefined,
            loadMsgDelay: 50 // This delay allows loads that pull from browser cache to occur without showing the loading message.
        };

        // Show a specific page in the page container.
        $.mobile.changePage = function( toPage, options ) {
            // If we are in the midst of a transition, queue the current request.
            // We'll call changePage() once we're done with the current transition to
            // service the request.
            if ( isPageTransitioning ) {
                pageTransitionQueue.unshift( arguments );
                return;
            }

            var settings = $.extend( {}, $.mobile.changePage.defaults, options );

            // Make sure we have a pageContainer to work with.
            settings.pageContainer = settings.pageContainer || $.mobile.pageContainer;

            // Make sure we have a fromPage.
            settings.fromPage = settings.fromPage || $.mobile.activePage;

            var mpc = settings.pageContainer,
                pbcEvent = new $.Event( "pagebeforechange" ),
                triggerData = { toPage: toPage, options: settings };

            // Let listeners know we're about to change the current page.
            mpc.trigger( pbcEvent, triggerData );

            // If the default behavior is prevented, stop here!
            if ( pbcEvent.isDefaultPrevented() ) {
                return;
            }

            // We allow "pagebeforechange" observers to modify the toPage in the trigger
            // data to allow for redirects. Make sure our toPage is updated.

            toPage = triggerData.toPage;

            // Set the isPageTransitioning flag to prevent any requests from
            // entering this method while we are in the midst of loading a page
            // or transitioning.

            isPageTransitioning = true;

            // If the caller passed us a url, call loadPage()
            // to make sure it is loaded into the DOM. We'll listen
            // to the promise object it returns so we know when
            // it is done loading or if an error ocurred.
            if ( typeof toPage === "string" ) {
                $.mobile.loadPage( toPage, settings )
                    .done(function( url, options, newPage, dupCachedPage ) {
                        isPageTransitioning = false;
                        options.duplicateCachedPage = dupCachedPage;
                        $.mobile.changePage( newPage, options );
                    })
                    .fail(function( url, options ) {

                        //clear out the active button state
                        removeActiveLinkClass( true );

                        //release transition lock so navigation is free again
                        releasePageTransitionLock();
                        settings.pageContainer.trigger( "pagechangefailed", triggerData );
                    });
                return;
            }

            // If we are going to the first-page of the application, we need to make
            // sure settings.dataUrl is set to the application document url. This allows
            // us to avoid generating a document url with an id hash in the case where the
            // first-page of the document has an id attribute specified.
            if ( toPage[ 0 ] === $.mobile.firstPage[ 0 ] && !settings.dataUrl ) {
                settings.dataUrl = documentUrl.hrefNoHash;
            }

            // The caller passed us a real page DOM element. Update our
            // internal state and then trigger a transition to the page.
            var fromPage = settings.fromPage,
                url = ( settings.dataUrl && path.convertUrlToDataUrl( settings.dataUrl ) ) || toPage.jqmData( "url" ),
            // The pageUrl var is usually the same as url, except when url is obscured as a dialog url. pageUrl always contains the file path
                pageUrl = url,
                fileUrl = path.getFilePath( url ),
                active = urlHistory.getActive(),
                activeIsInitialPage = urlHistory.activeIndex === 0,
                historyDir = 0,
                pageTitle = document.title,
                isDialog = settings.role === "dialog" || toPage.jqmData( "role" ) === "dialog";

            // By default, we prevent changePage requests when the fromPage and toPage
            // are the same element, but folks that generate content manually/dynamically
            // and reuse pages want to be able to transition to the same page. To allow
            // this, they will need to change the default value of allowSamePageTransition
            // to true, *OR*, pass it in as an option when they manually call changePage().
            // It should be noted that our default transition animations assume that the
            // formPage and toPage are different elements, so they may behave unexpectedly.
            // It is up to the developer that turns on the allowSamePageTransitiona option
            // to either turn off transition animations, or make sure that an appropriate
            // animation transition is used.
            if ( fromPage && fromPage[0] === toPage[0] && !settings.allowSamePageTransition ) {
                isPageTransitioning = false;
                mpc.trigger( "pagechange", triggerData );

                // Even if there is no page change to be done, we should keep the urlHistory in sync with the hash changes
                if ( settings.fromHashChange ) {
                    urlHistory.directHashChange({
                        currentUrl:	url,
                        isBack:		function() {},
                        isForward:	function() {}
                    });
                }

                return;
            }

            // We need to make sure the page we are given has already been enhanced.
            enhancePage( toPage, settings.role );

            // If the changePage request was sent from a hashChange event, check to see if the
            // page is already within the urlHistory stack. If so, we'll assume the user hit
            // the forward/back button and will try to match the transition accordingly.
            if ( settings.fromHashChange ) {
                urlHistory.directHashChange({
                    currentUrl:	url,
                    isBack:		function() { historyDir = -1; },
                    isForward:	function() { historyDir = 1; }
                });
            }

            // Kill the keyboard.
            // XXX_jblas: We need to stop crawling the entire document to kill focus. Instead,
            //            we should be tracking focus with a delegate() handler so we already have
            //            the element in hand at this point.
            // Wrap this in a try/catch block since IE9 throw "Unspecified error" if document.activeElement
            // is undefined when we are in an IFrame.
            try {
                if ( document.activeElement && document.activeElement.nodeName.toLowerCase() !== 'body' ) {
                    $( document.activeElement ).blur();
                } else {
                    $( "input:focus, textarea:focus, select:focus" ).blur();
                }
            } catch( e ) {}

            // Record whether we are at a place in history where a dialog used to be - if so, do not add a new history entry and do not change the hash either
            var alreadyThere = false;

            // If we're displaying the page as a dialog, we don't want the url
            // for the dialog content to be used in the hash. Instead, we want
            // to append the dialogHashKey to the url of the current page.
            if ( isDialog && active ) {
                // on the initial page load active.url is undefined and in that case should
                // be an empty string. Moving the undefined -> empty string back into
                // urlHistory.addNew seemed imprudent given undefined better represents
                // the url state

                // If we are at a place in history that once belonged to a dialog, reuse
                // this state without adding to urlHistory and without modifying the hash.
                // However, if a dialog is already displayed at this point, and we're
                // about to display another dialog, then we must add another hash and
                // history entry on top so that one may navigate back to the original dialog
                if ( active.url && active.url.indexOf( dialogHashKey ) > -1 && !$.mobile.activePage.is( ".ui-dialog" ) ) {
                    settings.changeHash = false;
                    alreadyThere = true;
                }

                // Normally, we tack on a dialog hash key, but if this is the location of a stale dialog,
                // we reuse the URL from the entry
                url = ( active.url || "" ) + ( alreadyThere ? "" : dialogHashKey );

                // tack on another dialogHashKey if this is the same as the initial hash
                // this makes sure that a history entry is created for this dialog
                if ( urlHistory.activeIndex === 0 && url === urlHistory.initialDst ) {
                    url += dialogHashKey;
                }
            }

            // Set the location hash.
            if ( settings.changeHash !== false && url ) {
                //disable hash listening temporarily
                urlHistory.ignoreNextHashChange = true;
                //update hash and history
                path.set( url );
            }

            // if title element wasn't found, try the page div data attr too
            // If this is a deep-link or a reload ( active === undefined ) then just use pageTitle
            var newPageTitle = ( !active )? pageTitle : toPage.jqmData( "title" ) || toPage.children( ":jqmData(role='header')" ).find( ".ui-title" ).getEncodedText();
            if ( !!newPageTitle && pageTitle === document.title ) {
                pageTitle = newPageTitle;
            }
            if ( !toPage.jqmData( "title" ) ) {
                toPage.jqmData( "title", pageTitle );
            }

            // Make sure we have a transition defined.
            settings.transition = settings.transition ||
                ( ( historyDir && !activeIsInitialPage ) ? active.transition : undefined ) ||
                ( isDialog ? $.mobile.defaultDialogTransition : $.mobile.defaultPageTransition );

            //add page to history stack if it's not back or forward
            if ( !historyDir ) {
                // Overwrite the current entry if it's a leftover from a dialog
                if ( alreadyThere ) {
                    urlHistory.activeIndex = Math.max( 0, urlHistory.activeIndex - 1 );
                }
                urlHistory.addNew( url, settings.transition, pageTitle, pageUrl, settings.role );
            }

            //set page title
            document.title = urlHistory.getActive().title;

            //set "toPage" as activePage
            $.mobile.activePage = toPage;

            // If we're navigating back in the URL history, set reverse accordingly.
            settings.reverse = settings.reverse || historyDir < 0;

            transitionPages( toPage, fromPage, settings.transition, settings.reverse )
                .done(function( name, reverse, $to, $from, alreadyFocused ) {
                    removeActiveLinkClass();

                    //if there's a duplicateCachedPage, remove it from the DOM now that it's hidden
                    if ( settings.duplicateCachedPage ) {
                        settings.duplicateCachedPage.remove();
                    }

                    // Send focus to the newly shown page. Moved from promise .done binding in transitionPages
                    // itself to avoid ie bug that reports offsetWidth as > 0 (core check for visibility)
                    // despite visibility: hidden addresses issue #2965
                    // https://github.com/jquery/jquery-mobile/issues/2965
                    if ( !alreadyFocused ) {
                        $.mobile.focusPage( toPage );
                    }

                    releasePageTransitionLock();

                    // Let listeners know we're all done changing the current page.
                    mpc.trigger( "pagechange", triggerData );
                });
        };

        $.mobile.changePage.defaults = {
            transition: undefined,
            reverse: false,
            changeHash: true,
            fromHashChange: false,
            role: undefined, // By default we rely on the role defined by the @data-role attribute.
            duplicateCachedPage: undefined,
            pageContainer: undefined,
            showLoadMsg: true, //loading message shows by default when pages are being fetched during changePage
            dataUrl: undefined,
            fromPage: undefined,
            allowSamePageTransition: false
        };

        /* Event Bindings - hashchange, submit, and click */
        function findClosestLink( ele )
        {
            while ( ele ) {
                // Look for the closest element with a nodeName of "a".
                // Note that we are checking if we have a valid nodeName
                // before attempting to access it. This is because the
                // node we get called with could have originated from within
                // an embedded SVG document where some symbol instance elements
                // don't have nodeName defined on them, or strings are of type
                // SVGAnimatedString.
                if ( ( typeof ele.nodeName === "string" ) && ele.nodeName.toLowerCase() === "a" ) {
                    break;
                }
                ele = ele.parentNode;
            }
            return ele;
        }

        // The base URL for any given element depends on the page it resides in.
        function getClosestBaseUrl( ele )
        {
            // Find the closest page and extract out its url.
            var url = $( ele ).closest( ".ui-page" ).jqmData( "url" ),
                base = documentBase.hrefNoHash;

            if ( !url || !path.isPath( url ) ) {
                url = base;
            }

            return path.makeUrlAbsolute( url, base);
        }

        //The following event bindings should be bound after mobileinit has been triggered
        //the following deferred is resolved in the init file
        $.mobile.navreadyDeferred = $.Deferred();
        $.mobile._registerInternalEvents = function() {
            //bind to form submit events, handle with Ajax
            $( document ).delegate( "form", "submit", function( event ) {
                var $this = $( this );

                if ( !$.mobile.ajaxEnabled ||
                    // test that the form is, itself, ajax false
                    $this.is( ":jqmData(ajax='false')" ) ||
                    // test that $.mobile.ignoreContentEnabled is set and
                    // the form or one of it's parents is ajax=false
                    !$this.jqmHijackable().length ) {
                    return;
                }

                var type = $this.attr( "method" ),
                    target = $this.attr( "target" ),
                    url = $this.attr( "action" );

                // If no action is specified, browsers default to using the
                // URL of the document containing the form. Since we dynamically
                // pull in pages from external documents, the form should submit
                // to the URL for the source document of the page containing
                // the form.
                if ( !url ) {
                    // Get the @data-url for the page containing the form.
                    url = getClosestBaseUrl( $this );
                    if ( url === documentBase.hrefNoHash ) {
                        // The url we got back matches the document base,
                        // which means the page must be an internal/embedded page,
                        // so default to using the actual document url as a browser
                        // would.
                        url = documentUrl.hrefNoSearch;
                    }
                }

                url = path.makeUrlAbsolute(  url, getClosestBaseUrl( $this ) );

                if ( ( path.isExternal( url ) && !path.isPermittedCrossDomainRequest( documentUrl, url ) ) || target ) {
                    return;
                }

                $.mobile.changePage(
                    url,
                    {
                        type:		type && type.length && type.toLowerCase() || "get",
                        data:		$this.serialize(),
                        transition:	$this.jqmData( "transition" ),
                        reverse:	$this.jqmData( "direction" ) === "reverse",
                        reloadPage:	true
                    }
                );
                event.preventDefault();
            });

            //add active state on vclick
            $( document ).bind( "vclick", function( event ) {
                // if this isn't a left click we don't care. Its important to note
                // that when the virtual event is generated it will create the which attr
                if ( event.which > 1 || !$.mobile.linkBindingEnabled ) {
                    return;
                }

                var link = findClosestLink( event.target );

                // split from the previous return logic to avoid find closest where possible
                // TODO teach $.mobile.hijackable to operate on raw dom elements so the link wrapping
                // can be avoided
                if ( !$( link ).jqmHijackable().length ) {
                    return;
                }

                if ( link ) {
                    if ( path.parseUrl( link.getAttribute( "href" ) || "#" ).hash !== "#" ) {
                        removeActiveLinkClass( true );
                        $activeClickedLink = $( link ).closest( ".ui-btn" ).not( ".ui-disabled" );
                        $activeClickedLink.addClass( $.mobile.activeBtnClass );
                    }
                }
            });

            // click routing - direct to HTTP or Ajax, accordingly
            $( document ).bind( "click", function( event ) {
                if ( !$.mobile.linkBindingEnabled ) {
                    return;
                }

                var link = findClosestLink( event.target ), $link = $( link ), httpCleanup;

                // If there is no link associated with the click or its not a left
                // click we want to ignore the click
                // TODO teach $.mobile.hijackable to operate on raw dom elements so the link wrapping
                // can be avoided
                if ( !link || event.which > 1 || !$link.jqmHijackable().length ) {
                    return;
                }

                //remove active link class if external (then it won't be there if you come back)
                httpCleanup = function() {
                    window.setTimeout(function() { removeActiveLinkClass( true ); }, 200 );
                };

                //if there's a data-rel=back attr, go back in history
                if ( $link.is( ":jqmData(rel='back')" ) ) {
                    $.mobile.back();
                    return false;
                }

                var baseUrl = getClosestBaseUrl( $link ),

                //get href, if defined, otherwise default to empty hash
                    href = path.makeUrlAbsolute( $link.attr( "href" ) || "#", baseUrl );

                //if ajax is disabled, exit early
                if ( !$.mobile.ajaxEnabled && !path.isEmbeddedPage( href ) ) {
                    httpCleanup();
                    //use default click handling
                    return;
                }

                // XXX_jblas: Ideally links to application pages should be specified as
                //            an url to the application document with a hash that is either
                //            the site relative path or id to the page. But some of the
                //            internal code that dynamically generates sub-pages for nested
                //            lists and select dialogs, just write a hash in the link they
                //            create. This means the actual URL path is based on whatever
                //            the current value of the base tag is at the time this code
                //            is called. For now we are just assuming that any url with a
                //            hash in it is an application page reference.
                if ( href.search( "#" ) !== -1 ) {
                    href = href.replace( /[^#]*#/, "" );
                    if ( !href ) {
                        //link was an empty hash meant purely
                        //for interaction, so we ignore it.
                        event.preventDefault();
                        return;
                    } else if ( path.isPath( href ) ) {
                        //we have apath so make it the href we want to load.
                        href = path.makeUrlAbsolute( href, baseUrl );
                    } else {
                        //we have a simple id so use the documentUrl as its base.
                        href = path.makeUrlAbsolute( "#" + href, documentUrl.hrefNoHash );
                    }
                }

                // Should we handle this link, or let the browser deal with it?
                var useDefaultUrlHandling = $link.is( "[rel='external']" ) || $link.is( ":jqmData(ajax='false')" ) || $link.is( "[target]" ),

                // Some embedded browsers, like the web view in Phone Gap, allow cross-domain XHR
                // requests if the document doing the request was loaded via the file:// protocol.
                // This is usually to allow the application to "phone home" and fetch app specific
                // data. We normally let the browser handle external/cross-domain urls, but if the
                // allowCrossDomainPages option is true, we will allow cross-domain http/https
                // requests to go through our page loading logic.

                //check for protocol or rel and its not an embedded page
                //TODO overlap in logic from isExternal, rel=external check should be
                //     moved into more comprehensive isExternalLink
                    isExternal = useDefaultUrlHandling || ( path.isExternal( href ) && !path.isPermittedCrossDomainRequest( documentUrl, href ) );

                if ( isExternal ) {
                    httpCleanup();
                    //use default click handling
                    return;
                }

                //use ajax
                var transition = $link.jqmData( "transition" ),
                    reverse = $link.jqmData( "direction" ) === "reverse" ||
                        // deprecated - remove by 1.0
                        $link.jqmData( "back" ),

                //this may need to be more specific as we use data-rel more
                    role = $link.attr( "data-" + $.mobile.ns + "rel" ) || undefined;

                $.mobile.changePage( href, { transition: transition, reverse: reverse, role: role, link: $link } );
                event.preventDefault();
            });

            //prefetch pages when anchors with data-prefetch are encountered
            $( document ).delegate( ".ui-page", "pageshow.prefetch", function() {
                var urls = [];
                $( this ).find( "a:jqmData(prefetch)" ).each(function() {
                    var $link = $( this ),
                        url = $link.attr( "href" );

                    if ( url && $.inArray( url, urls ) === -1 ) {
                        urls.push( url );

                        $.mobile.loadPage( url, { role: $link.attr( "data-" + $.mobile.ns + "rel" ),prefetch: true } );
                    }
                });
            });

            $.mobile._handleHashChange = function( hash ) {
                //find first page via hash
                var to = path.stripHash( hash ),
                //transition is false if it's the first page, undefined otherwise (and may be overridden by default)
                    transition = $.mobile.urlHistory.stack.length === 0 ? "none" : undefined,

                // "navigate" event fired to allow others to take advantage of the more robust hashchange handling
                    navEvent = new $.Event( "navigate" ),

                // default options for the changPage calls made after examining the current state
                // of the page and the hash
                    changePageOptions = {
                        transition: transition,
                        changeHash: false,
                        fromHashChange: true
                    };

                if ( 0 === urlHistory.stack.length ) {
                    urlHistory.initialDst = to;
                }

                // We should probably fire the "navigate" event from those places that make calls to _handleHashChange,
                // and have _handleHashChange hook into the "navigate" event instead of triggering it here
                $.mobile.pageContainer.trigger( navEvent );
                if ( navEvent.isDefaultPrevented() ) {
                    return;
                }

                //if listening is disabled (either globally or temporarily), or it's a dialog hash
                if ( !$.mobile.hashListeningEnabled || urlHistory.ignoreNextHashChange ) {
                    urlHistory.ignoreNextHashChange = false;
                    return;
                }

                // special case for dialogs
                if ( urlHistory.stack.length > 1 && to.indexOf( dialogHashKey ) > -1 && urlHistory.initialDst !== to ) {

                    // If current active page is not a dialog skip the dialog and continue
                    // in the same direction
                    if ( !$.mobile.activePage.is( ".ui-dialog" ) ) {
                        //determine if we're heading forward or backward and continue accordingly past
                        //the current dialog
                        urlHistory.directHashChange({
                            currentUrl: to,
                            isBack: function() { $.mobile.back(); },
                            isForward: function() { window.history.forward(); }
                        });

                        // prevent changePage()
                        return;
                    } else {
                        // if the current active page is a dialog and we're navigating
                        // to a dialog use the dialog objected saved in the stack
                        urlHistory.directHashChange({
                            currentUrl: to,

                            // regardless of the direction of the history change
                            // do the following
                            either: function( isBack ) {
                                var active = $.mobile.urlHistory.getActive();

                                to = active.pageUrl;

                                // make sure to set the role, transition and reversal
                                // as most of this is lost by the domCache cleaning
                                $.extend( changePageOptions, {
                                    role: active.role,
                                    transition: active.transition,
                                    reverse: isBack
                                });
                            }
                        });
                    }
                }

                //if to is defined, load it
                if ( to ) {
                    // At this point, 'to' can be one of 3 things, a cached page element from
                    // a history stack entry, an id, or site-relative/absolute URL. If 'to' is
                    // an id, we need to resolve it against the documentBase, not the location.href,
                    // since the hashchange could've been the result of a forward/backward navigation
                    // that crosses from an external page/dialog to an internal page/dialog.
                    to = ( typeof to === "string" && !path.isPath( to ) ) ? ( path.makeUrlAbsolute( '#' + to, documentBase ) ) : to;

                    // If we're about to go to an initial URL that contains a reference to a non-existent
                    // internal page, go to the first page instead. We know that the initial hash refers to a
                    // non-existent page, because the initial hash did not end up in the initial urlHistory entry
                    if ( to === path.makeUrlAbsolute( '#' + urlHistory.initialDst, documentBase ) &&
                        urlHistory.stack.length && urlHistory.stack[0].url !== urlHistory.initialDst.replace( dialogHashKey, "" ) ) {
                        to = $.mobile.firstPage;
                    }
                    $.mobile.changePage( to, changePageOptions );
                }	else {
                    //there's no hash, go to the first page in the dom
                    $.mobile.changePage( $.mobile.firstPage, changePageOptions );
                }
            };

            //hashchange event handler
            $window.bind( "hashchange", function( e, triggered ) {
                // Firefox auto-escapes the location.hash as for v13 but
                // leaves the href untouched
                $.mobile._handleHashChange( path.parseLocation().hash );
            });

            //set page min-heights to be device specific
            $( document ).bind( "pageshow", resetActivePageHeight );
            $( window ).bind( "throttledresize", resetActivePageHeight );

        };//navreadyDeferred done callback
        $.mobile.navreadyDeferred.done( function() { $.mobile._registerInternalEvents(); } );

    })( jQuery );

    (function( $, window ) {
        // For now, let's Monkeypatch this onto the end of $.mobile._registerInternalEvents
        // Scope self to pushStateHandler so we can reference it sanely within the
        // methods handed off as event handlers
        var	pushStateHandler = {},
            self = pushStateHandler,
            $win = $( window ),
            url = $.mobile.path.parseLocation(),
            mobileinitDeferred = $.Deferred(),
            domreadyDeferred = $.Deferred();

        $( document ).ready( $.proxy( domreadyDeferred, "resolve" ) );

        $( document ).one( "mobileinit", $.proxy( mobileinitDeferred, "resolve" ) );

        $.extend( pushStateHandler, {
            // TODO move to a path helper, this is rather common functionality
            initialFilePath: (function() {
                return url.pathname + url.search;
            })(),

            hashChangeTimeout: 200,

            hashChangeEnableTimer: undefined,

            initialHref: url.hrefNoHash,

            state: function() {
                return {
                    // firefox auto decodes the url when using location.hash but not href
                    hash: $.mobile.path.parseLocation().hash || "#" + self.initialFilePath,
                    title: document.title,

                    // persist across refresh
                    initialHref: self.initialHref
                };
            },

            resetUIKeys: function( url ) {
                var dialog = $.mobile.dialogHashKey,
                    subkey = "&" + $.mobile.subPageUrlKey,
                    dialogIndex = url.indexOf( dialog );

                if ( dialogIndex > -1 ) {
                    url = url.slice( 0, dialogIndex ) + "#" + url.slice( dialogIndex );
                } else if ( url.indexOf( subkey ) > -1 ) {
                    url = url.split( subkey ).join( "#" + subkey );
                }

                return url;
            },

            // TODO sort out a single barrier to hashchange functionality
            nextHashChangePrevented: function( value ) {
                $.mobile.urlHistory.ignoreNextHashChange = value;
                self.onHashChangeDisabled = value;
            },

            // on hash change we want to clean up the url
            // NOTE this takes place *after* the vanilla navigation hash change
            // handling has taken place and set the state of the DOM
            onHashChange: function( e ) {
                // disable this hash change
                if ( self.onHashChangeDisabled ) {
                    return;
                }

                var href, state,
                // firefox auto decodes the url when using location.hash but not href
                    hash = $.mobile.path.parseLocation().hash,
                    isPath = $.mobile.path.isPath( hash ),
                    resolutionUrl = isPath ? $.mobile.path.getLocation() : $.mobile.getDocumentUrl();

                hash = isPath ? hash.replace( "#", "" ) : hash;


                // propulate the hash when its not available
                state = self.state();

                // make the hash abolute with the current href
                href = $.mobile.path.makeUrlAbsolute( hash, resolutionUrl );

                if ( isPath ) {
                    href = self.resetUIKeys( href );
                }

                // replace the current url with the new href and store the state
                // Note that in some cases we might be replacing an url with the
                // same url. We do this anyways because we need to make sure that
                // all of our history entries have a state object associated with
                // them. This allows us to work around the case where $.mobile.back()
                // is called to transition from an external page to an embedded page.
                // In that particular case, a hashchange event is *NOT* generated by the browser.
                // Ensuring each history entry has a state object means that onPopState()
                // will always trigger our hashchange callback even when a hashchange event
                // is not fired.
                history.replaceState( state, document.title, href );
            },

            // on popstate (ie back or forward) we need to replace the hash that was there previously
            // cleaned up by the additional hash handling
            onPopState: function( e ) {
                var poppedState = e.originalEvent.state,
                    fromHash, toHash, hashChanged;

                // if there's no state its not a popstate we care about, eg chrome's initial popstate
                if ( poppedState ) {
                    // if we get two pop states in under this.hashChangeTimeout
                    // make sure to clear any timer set for the previous change
                    clearTimeout( self.hashChangeEnableTimer );

                    // make sure to enable hash handling for the the _handleHashChange call
                    self.nextHashChangePrevented( false );

                    // change the page based on the hash in the popped state
                    $.mobile._handleHashChange( poppedState.hash );

                    // prevent any hashchange in the next self.hashChangeTimeout
                    self.nextHashChangePrevented( true );

                    // re-enable hash change handling after swallowing a possible hash
                    // change event that comes on all popstates courtesy of browsers like Android
                    self.hashChangeEnableTimer = setTimeout( function() {
                        self.nextHashChangePrevented( false );
                    }, self.hashChangeTimeout );
                }
            },

            init: function() {
                $win.bind( "hashchange", self.onHashChange );

                // Handle popstate events the occur through history changes
                $win.bind( "popstate", self.onPopState );

                // if there's no hash, we need to replacestate for returning to home
                if ( location.hash === "" ) {
                    history.replaceState( self.state(), document.title, $.mobile.path.getLocation() );
                }
            }
        });

        // We need to init when "mobileinit", "domready", and "navready" have all happened
        $.when( domreadyDeferred, mobileinitDeferred, $.mobile.navreadyDeferred ).done(function() {
            if ( $.mobile.pushStateEnabled && $.support.pushState ) {
                pushStateHandler.init();
            }
        });
    })( jQuery, this );

    /*
     * fallback transition for flip in non-3D supporting browsers (which tend to handle complex transitions poorly in general
     */

    (function( $, window, undefined ) {

        $.mobile.transitionFallbacks.flip = "fade";

    })( jQuery, this );
    /*
     * fallback transition for flow in non-3D supporting browsers (which tend to handle complex transitions poorly in general
     */

    (function( $, window, undefined ) {

        $.mobile.transitionFallbacks.flow = "fade";

    })( jQuery, this );
    /*
     * fallback transition for pop in non-3D supporting browsers (which tend to handle complex transitions poorly in general
     */

    (function( $, window, undefined ) {

        $.mobile.transitionFallbacks.pop = "fade";

    })( jQuery, this );
    /*
     * fallback transition for slide in non-3D supporting browsers (which tend to handle complex transitions poorly in general
     */

    (function( $, window, undefined ) {

// Use the simultaneous transitions handler for slide transitions
        $.mobile.transitionHandlers.slide = $.mobile.transitionHandlers.simultaneous;

// Set the slide transitions's fallback to "fade"
        $.mobile.transitionFallbacks.slide = "fade";

    })( jQuery, this );
    /*
     * fallback transition for slidedown in non-3D supporting browsers (which tend to handle complex transitions poorly in general
     */

    (function( $, window, undefined ) {

        $.mobile.transitionFallbacks.slidedown = "fade";

    })( jQuery, this );
    /*
     * fallback transition for slidefade in non-3D supporting browsers (which tend to handle complex transitions poorly in general
     */

    (function( $, window, undefined ) {

// Set the slide transitions's fallback to "fade"
        $.mobile.transitionFallbacks.slidefade = "fade";

    })( jQuery, this );
    /*
     * fallback transition for slideup in non-3D supporting browsers (which tend to handle complex transitions poorly in general
     */

    (function( $, window, undefined ) {

        $.mobile.transitionFallbacks.slideup = "fade";

    })( jQuery, this );
    /*
     * fallback transition for turn in non-3D supporting browsers (which tend to handle complex transitions poorly in general
     */

    (function( $, window, undefined ) {

        $.mobile.transitionFallbacks.turn = "fade";

    })( jQuery, this );

    (function( $, undefined ) {

        $.mobile.page.prototype.options.degradeInputs = {
            color: false,
            date: false,
            datetime: false,
            "datetime-local": false,
            email: false,
            month: false,
            number: false,
            range: "number",
            search: "text",
            tel: false,
            time: false,
            url: false,
            week: false
        };


//auto self-init widgets
        $( document ).bind( "pagecreate create", function( e ) {

            var page = $.mobile.closestPageData( $( e.target ) ), options;

            if ( !page ) {
                return;
            }

            options = page.options;

            // degrade inputs to avoid poorly implemented native functionality
            $( e.target ).find( "input" ).not( page.keepNativeSelector() ).each(function() {
                var $this = $( this ),
                    type = this.getAttribute( "type" ),
                    optType = options.degradeInputs[ type ] || "text";

                if ( options.degradeInputs[ type ] ) {
                    var html = $( "<div>" ).html( $this.clone() ).html(),
                    // In IE browsers, the type sometimes doesn't exist in the cloned markup, so we replace the closing tag instead
                        hasType = html.indexOf( " type=" ) > -1,
                        findstr = hasType ? /\s+type=["']?\w+['"]?/ : /\/?>/,
                        repstr = " type=\"" + optType + "\" data-" + $.mobile.ns + "type=\"" + type + "\"" + ( hasType ? "" : ">" );

                    $this.replaceWith( html.replace( findstr, repstr ) );
                }
            });

        });

    })( jQuery );

    (function( $, window, undefined ) {

        $.widget( "mobile.dialog", $.mobile.widget, {
            options: {
                closeBtnText: "Close",
                overlayTheme: "a",
                initSelector: ":jqmData(role='dialog')"
            },
            _create: function() {
                var self = this,
                    $el = this.element,
                    headerCloseButton = $( "<a href='#' data-" + $.mobile.ns + "icon='delete' data-" + $.mobile.ns + "iconpos='notext'>"+ this.options.closeBtnText + "</a>" ),
                    dialogWrap = $( "<div/>", {
                        "role" : "dialog",
                        "class" : "ui-dialog-contain ui-corner-all ui-overlay-shadow"
                    });

                $el.addClass( "ui-dialog ui-overlay-" + this.options.overlayTheme );

                // Class the markup for dialog styling
                // Set aria role
                $el
                    .wrapInner( dialogWrap )
                    .children()
                    .find( ":jqmData(role='header')" ).first()
                    .prepend( headerCloseButton )
                    .end().end()
                    .children( ':first-child')
                    .addClass( "ui-corner-top" )
                    .end()
                    .children( ":last-child" )
                    .addClass( "ui-corner-bottom" );

                // this must be an anonymous function so that select menu dialogs can replace
                // the close method. This is a change from previously just defining data-rel=back
                // on the button and letting nav handle it
                //
                // Use click rather than vclick in order to prevent the possibility of unintentionally
                // reopening the dialog if the dialog opening item was directly under the close button.
                headerCloseButton.bind( "click", function() {
                    self.close();
                });

                /* bind events
                 - clicks and submits should use the closing transition that the dialog opened with
                 unless a data-transition is specified on the link/form
                 - if the click was on the close button, or the link has a data-rel="back" it'll go back in history naturally
                 */
                $el.bind( "vclick submit", function( event ) {
                    var $target = $( event.target ).closest( event.type === "vclick" ? "a" : "form" ),
                        active;

                    if ( $target.length && !$target.jqmData( "transition" ) ) {

                        active = $.mobile.urlHistory.getActive() || {};

                        $target.attr( "data-" + $.mobile.ns + "transition", ( active.transition || $.mobile.defaultDialogTransition ) )
                            .attr( "data-" + $.mobile.ns + "direction", "reverse" );
                    }
                })
                    .bind( "pagehide", function( e, ui ) {
                        $( this ).find( "." + $.mobile.activeBtnClass ).not( ".ui-slider-bg" ).removeClass( $.mobile.activeBtnClass );
                    })
                    // Override the theme set by the page plugin on pageshow
                    .bind( "pagebeforeshow", function() {
                        self._isCloseable = true;
                        if ( self.options.overlayTheme ) {
                            self.element
                                .page( "removeContainerBackground" )
                                .page( "setContainerBackground", self.options.overlayTheme );
                        }
                    });
            },

            // Close method goes back in history
            close: function() {
                var dst;

                if ( this._isCloseable ) {
                    this._isCloseable = false;
                    if ( $.mobile.hashListeningEnabled ) {
                        $.mobile.back();
                    } else {
                        dst = $.mobile.urlHistory.getPrev().url;
                        if ( !$.mobile.path.isPath( dst ) ) {
                            dst = $.mobile.path.makeUrlAbsolute( "#" + dst );
                        }

                        $.mobile.changePage( dst, { changeHash: false, fromHashChange: true } );
                    }
                }
            }
        });

//auto self-init widgets
        $( document ).delegate( $.mobile.dialog.prototype.options.initSelector, "pagecreate", function() {
            $.mobile.dialog.prototype.enhance( this );
        });

    })( jQuery, this );

    (function( $, undefined ) {

        $.mobile.page.prototype.options.backBtnText  = "Back";
        $.mobile.page.prototype.options.addBackBtn   = false;
        $.mobile.page.prototype.options.backBtnTheme = null;
        $.mobile.page.prototype.options.headerTheme  = "a";
        $.mobile.page.prototype.options.footerTheme  = "a";
        $.mobile.page.prototype.options.contentTheme = null;

// NOTE bind used to force this binding to run before the buttonMarkup binding
//      which expects .ui-footer top be applied in its gigantic selector
// TODO remove the buttonMarkup giant selector and move it to the various modules
//      on which it depends
        $( document ).bind( "pagecreate", function( e ) {
            var $page = $( e.target ),
                o = $page.data( "page" ).options,
                pageRole = $page.jqmData( "role" ),
                pageTheme = o.theme;

            $( ":jqmData(role='header'), :jqmData(role='footer'), :jqmData(role='content')", $page )
                .jqmEnhanceable()
                .each(function() {

                    var $this = $( this ),
                        role = $this.jqmData( "role" ),
                        theme = $this.jqmData( "theme" ),
                        contentTheme = theme || o.contentTheme || ( pageRole === "dialog" && pageTheme ),
                        $headeranchors,
                        leftbtn,
                        rightbtn,
                        backBtn;

                    $this.addClass( "ui-" + role );

                    //apply theming and markup modifications to page,header,content,footer
                    if ( role === "header" || role === "footer" ) {

                        var thisTheme = theme || ( role === "header" ? o.headerTheme : o.footerTheme ) || pageTheme;

                        $this
                            //add theme class
                            .addClass( "ui-bar-" + thisTheme )
                            // Add ARIA role
                            .attr( "role", role === "header" ? "banner" : "contentinfo" );

                        if ( role === "header") {
                            // Right,left buttons
                            $headeranchors	= $this.children( "a, button" );
                            leftbtn	= $headeranchors.hasClass( "ui-btn-left" );
                            rightbtn = $headeranchors.hasClass( "ui-btn-right" );

                            leftbtn = leftbtn || $headeranchors.eq( 0 ).not( ".ui-btn-right" ).addClass( "ui-btn-left" ).length;

                            rightbtn = rightbtn || $headeranchors.eq( 1 ).addClass( "ui-btn-right" ).length;
                        }

                        // Auto-add back btn on pages beyond first view
                        if ( o.addBackBtn &&
                            role === "header" &&
                            $( ".ui-page" ).length > 1 &&
                            $page.jqmData( "url" ) !== $.mobile.path.stripHash( location.hash ) &&
                            !leftbtn ) {

                            backBtn = $( "<a href='javascript:void(0);' class='ui-btn-left' data-"+ $.mobile.ns +"rel='back' data-"+ $.mobile.ns +"icon='arrow-l'>"+ o.backBtnText +"</a>" )
                                // If theme is provided, override default inheritance
                                .attr( "data-"+ $.mobile.ns +"theme", o.backBtnTheme || thisTheme )
                                .prependTo( $this );
                        }

                        // Page title
                        $this.children( "h1, h2, h3, h4, h5, h6" )
                            .addClass( "ui-title" )
                            // Regardless of h element number in src, it becomes h1 for the enhanced page
                            .attr({
                                "role": "heading",
                                "aria-level": "1"
                            });

                    } else if ( role === "content" ) {
                        if ( contentTheme ) {
                            $this.addClass( "ui-body-" + ( contentTheme ) );
                        }

                        // Add ARIA role
                        $this.attr( "role", "main" );
                    }
                });
        });

    })( jQuery );

    (function( $, undefined ) {

// filter function removes whitespace between label and form element so we can use inline-block (nodeType 3 = text)
        $.fn.fieldcontain = function( options ) {
            return this
                .addClass( "ui-field-contain ui-body ui-br" )
                .contents().filter( function() {
                    return ( this.nodeType === 3 && !/\S/.test( this.nodeValue ) );
                }).remove();
        };

//auto self-init widgets
        $( document ).bind( "pagecreate create", function( e ) {
            $( ":jqmData(role='fieldcontain')", e.target ).jqmEnhanceable().fieldcontain();
        });

    })( jQuery );

    (function( $, undefined ) {

        $.fn.grid = function( options ) {
            return this.each(function() {

                var $this = $( this ),
                    o = $.extend({
                        grid: null
                    }, options ),
                    $kids = $this.children(),
                    gridCols = { solo:1, a:2, b:3, c:4, d:5 },
                    grid = o.grid,
                    iterator;

                if ( !grid ) {
                    if ( $kids.length <= 5 ) {
                        for ( var letter in gridCols ) {
                            if ( gridCols[ letter ] === $kids.length ) {
                                grid = letter;
                            }
                        }
                    } else {
                        grid = "a";
                        $this.addClass( "ui-grid-duo" );
                    }
                }
                iterator = gridCols[grid];

                $this.addClass( "ui-grid-" + grid );

                $kids.filter( ":nth-child(" + iterator + "n+1)" ).addClass( "ui-block-a" );

                if ( iterator > 1 ) {
                    $kids.filter( ":nth-child(" + iterator + "n+2)" ).addClass( "ui-block-b" );
                }
                if ( iterator > 2 ) {
                    $kids.filter( ":nth-child(" + iterator + "n+3)" ).addClass( "ui-block-c" );
                }
                if ( iterator > 3 ) {
                    $kids.filter( ":nth-child(" + iterator + "n+4)" ).addClass( "ui-block-d" );
                }
                if ( iterator > 4 ) {
                    $kids.filter( ":nth-child(" + iterator + "n+5)" ).addClass( "ui-block-e" );
                }
            });
        };
    })( jQuery );

    (function( $, undefined ) {

        $( document ).bind( "pagecreate create", function( e ) {
            $( ":jqmData(role='nojs')", e.target ).addClass( "ui-nojs" );

        });

    })( jQuery );

    (function( $, undefined ) {

        $.mobile.behaviors.formReset = {
            _handleFormReset: function() {
                this._on( this.element.closest( "form" ), {
                    reset: function() {
                        this._delay( "_reset" );
                    }
                });
            }
        };

    })( jQuery );

    (function( $, undefined ) {

        $.fn.buttonMarkup = function( options ) {
            var $workingSet = this,
                mapToDataAttr = function( key, value ) {
                    e.setAttribute( "data-" + $.mobile.ns + key, value );
                    el.jqmData( key, value );
                };

            // Enforce options to be of type string
            options = ( options && ( $.type( options ) === "object" ) )? options : {};
            for ( var i = 0; i < $workingSet.length; i++ ) {
                var el = $workingSet.eq( i ),
                    e = el[ 0 ],
                    o = $.extend( {}, $.fn.buttonMarkup.defaults, {
                        icon:       options.icon       !== undefined ? options.icon       : el.jqmData( "icon" ),
                        iconpos:    options.iconpos    !== undefined ? options.iconpos    : el.jqmData( "iconpos" ),
                        theme:      options.theme      !== undefined ? options.theme      : el.jqmData( "theme" ) || $.mobile.getInheritedTheme( el, "c" ),
                        inline:     options.inline     !== undefined ? options.inline     : el.jqmData( "inline" ),
                        shadow:     options.shadow     !== undefined ? options.shadow     : el.jqmData( "shadow" ),
                        corners:    options.corners    !== undefined ? options.corners    : el.jqmData( "corners" ),
                        iconshadow: options.iconshadow !== undefined ? options.iconshadow : el.jqmData( "iconshadow" ),
                        mini:       options.mini       !== undefined ? options.mini       : el.jqmData( "mini" )
                    }, options ),

                // Classes Defined
                    innerClass = "ui-btn-inner",
                    textClass = "ui-btn-text",
                    buttonClass, iconClass,
                // Button inner markup
                    buttonInner,
                    buttonText,
                    buttonIcon,
                    buttonElements;

                $.each( o, mapToDataAttr );

                if ( el.jqmData( "rel" ) === "popup" && el.attr( "href" ) ) {
                    e.setAttribute( "aria-haspopup", true );
                    e.setAttribute( "aria-owns", e.getAttribute( "href" ) );
                }

                // Check if this element is already enhanced
                buttonElements = $.data( ( ( e.tagName === "INPUT" || e.tagName === "BUTTON" ) ? e.parentNode : e ), "buttonElements" );

                if ( buttonElements ) {
                    e = buttonElements.outer;
                    el = $( e );
                    buttonInner = buttonElements.inner;
                    buttonText = buttonElements.text;
                    // We will recreate this icon below
                    $( buttonElements.icon ).remove();
                    buttonElements.icon = null;
                }
                else {
                    buttonInner = document.createElement( o.wrapperEls );
                    buttonText = document.createElement( o.wrapperEls );
                }
                buttonIcon = o.icon ? document.createElement( "span" ) : null;

                if ( attachEvents && !buttonElements ) {
                    attachEvents();
                }

                // if not, try to find closest theme container
                if ( !o.theme ) {
                    o.theme = $.mobile.getInheritedTheme( el, "c" );
                }

                buttonClass = "ui-btn ui-btn-up-" + o.theme;
                buttonClass += o.shadow ? " ui-shadow" : "";
                buttonClass += o.corners ? " ui-btn-corner-all" : "";

                if ( o.mini !== undefined ) {
                    // Used to control styling in headers/footers, where buttons default to `mini` style.
                    buttonClass += o.mini === true ? " ui-mini" : " ui-fullsize";
                }

                if ( o.inline !== undefined ) {
                    // Used to control styling in headers/footers, where buttons default to `inline` style.
                    buttonClass += o.inline === true ? " ui-btn-inline" : " ui-btn-block";
                }

                if ( o.icon ) {
                    o.icon = "ui-icon-" + o.icon;
                    o.iconpos = o.iconpos || "left";

                    iconClass = "ui-icon " + o.icon;

                    if ( o.iconshadow ) {
                        iconClass += " ui-icon-shadow";
                    }
                }

                if ( o.iconpos ) {
                    buttonClass += " ui-btn-icon-" + o.iconpos;

                    if ( o.iconpos === "notext" && !el.attr( "title" ) ) {
                        el.attr( "title", el.getEncodedText() );
                    }
                }

                innerClass += o.corners ? " ui-btn-corner-all" : "";

                if ( o.iconpos && o.iconpos === "notext" && !el.attr( "title" ) ) {
                    el.attr( "title", el.getEncodedText() );
                }

                if ( buttonElements ) {
                    el.removeClass( buttonElements.bcls || "" );
                }
                el.removeClass( "ui-link" ).addClass( buttonClass );

                buttonInner.className = innerClass;

                buttonText.className = textClass;
                if ( !buttonElements ) {
                    buttonInner.appendChild( buttonText );
                }
                if ( buttonIcon ) {
                    buttonIcon.className = iconClass;
                    if ( !( buttonElements && buttonElements.icon ) ) {
                        buttonIcon.innerHTML = "&#160;";
                        buttonInner.appendChild( buttonIcon );
                    }
                }

                while ( e.firstChild && !buttonElements ) {
                    buttonText.appendChild( e.firstChild );
                }

                if ( !buttonElements ) {
                    e.appendChild( buttonInner );
                }

                // Assign a structure containing the elements of this button to the elements of this button. This
                // will allow us to recognize this as an already-enhanced button in future calls to buttonMarkup().
                buttonElements = {
                    bcls  : buttonClass,
                    outer : e,
                    inner : buttonInner,
                    text  : buttonText,
                    icon  : buttonIcon
                };

                $.data( e,           'buttonElements', buttonElements );
                $.data( buttonInner, 'buttonElements', buttonElements );
                $.data( buttonText,  'buttonElements', buttonElements );
                if ( buttonIcon ) {
                    $.data( buttonIcon, 'buttonElements', buttonElements );
                }
            }

            return this;
        };

        $.fn.buttonMarkup.defaults = {
            corners: true,
            shadow: true,
            iconshadow: true,
            wrapperEls: "span"
        };

        function closestEnabledButton( element ) {
            var cname;

            while ( element ) {
                // Note that we check for typeof className below because the element we
                // handed could be in an SVG DOM where className on SVG elements is defined to
                // be of a different type (SVGAnimatedString). We only operate on HTML DOM
                // elements, so we look for plain "string".
                cname = ( typeof element.className === 'string' ) && ( element.className + ' ' );
                if ( cname && cname.indexOf( "ui-btn " ) > -1 && cname.indexOf( "ui-disabled " ) < 0 ) {
                    break;
                }

                element = element.parentNode;
            }

            return element;
        }

        var attachEvents = function() {
            var hoverDelay = $.mobile.buttonMarkup.hoverDelay, hov, foc;

            $( document ).bind( {
                "vmousedown vmousecancel vmouseup vmouseover vmouseout focus blur scrollstart": function( event ) {
                    var theme,
                        $btn = $( closestEnabledButton( event.target ) ),
                        isTouchEvent = event.originalEvent && /^touch/.test( event.originalEvent.type ),
                        evt = event.type;

                    if ( $btn.length ) {
                        theme = $btn.attr( "data-" + $.mobile.ns + "theme" );

                        if ( evt === "vmousedown" ) {
                            if ( isTouchEvent ) {
                                // Use a short delay to determine if the user is scrolling before highlighting
                                hov = setTimeout( function() {
                                    $btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-down-" + theme );
                                }, hoverDelay );
                            } else {
                                $btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-down-" + theme );
                            }
                        } else if ( evt === "vmousecancel" || evt === "vmouseup" ) {
                            $btn.removeClass( "ui-btn-down-" + theme ).addClass( "ui-btn-up-" + theme );
                        } else if ( evt === "vmouseover" || evt === "focus" ) {
                            if ( isTouchEvent ) {
                                // Use a short delay to determine if the user is scrolling before highlighting
                                foc = setTimeout( function() {
                                    $btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-hover-" + theme );
                                }, hoverDelay );
                            } else {
                                $btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-hover-" + theme );
                            }
                        } else if ( evt === "vmouseout" || evt === "blur" || evt === "scrollstart" ) {
                            $btn.removeClass( "ui-btn-hover-" + theme  + " ui-btn-down-" + theme ).addClass( "ui-btn-up-" + theme );
                            if ( hov ) {
                                clearTimeout( hov );
                            }
                            if ( foc ) {
                                clearTimeout( foc );
                            }
                        }
                    }
                },
                "focusin focus": function( event ) {
                    $( closestEnabledButton( event.target ) ).addClass( $.mobile.focusClass );
                },
                "focusout blur": function( event ) {
                    $( closestEnabledButton( event.target ) ).removeClass( $.mobile.focusClass );
                }
            });

            attachEvents = null;
        };

//links in bars, or those with  data-role become buttons
//auto self-init widgets
        $( document ).bind( "pagecreate create", function( e ) {

            $( ":jqmData(role='button'), .ui-bar > a, .ui-header > a, .ui-footer > a, .ui-bar > :jqmData(role='controlgroup') > a", e.target )
                .jqmEnhanceable()
                .not( "button, input, .ui-btn, :jqmData(role='none'), :jqmData(role='nojs')" )
                .buttonMarkup();
        });

    })( jQuery );


    (function( $, undefined ) {

        $.widget( "mobile.collapsible", $.mobile.widget, {
            options: {
                expandCueText: " click to expand contents",
                collapseCueText: " click to collapse contents",
                collapsed: true,
                heading: "h1,h2,h3,h4,h5,h6,legend",
                theme: null,
                contentTheme: null,
                inset: true,
                mini: false,
                initSelector: ":jqmData(role='collapsible')"
            },
            _create: function() {

                var $el = this.element,
                    o = this.options,
                    collapsible = $el.addClass( "ui-collapsible" ),
                    collapsibleHeading = $el.children( o.heading ).first(),
                    collapsedIcon = $el.jqmData( "collapsed-icon" ) || o.collapsedIcon,
                    expandedIcon = $el.jqmData( "expanded-icon" ) || o.expandedIcon,
                    collapsibleContent = collapsible.wrapInner( "<div class='ui-collapsible-content'></div>" ).children( ".ui-collapsible-content" ),
                    collapsibleSet = $el.closest( ":jqmData(role='collapsible-set')" ).addClass( "ui-collapsible-set" );

                // Replace collapsibleHeading if it's a legend
                if ( collapsibleHeading.is( "legend" ) ) {
                    collapsibleHeading = $( "<div role='heading'>"+ collapsibleHeading.html() +"</div>" ).insertBefore( collapsibleHeading );
                    collapsibleHeading.next().remove();
                }

                // If we are in a collapsible set
                if ( collapsibleSet.length ) {
                    // Inherit the theme from collapsible-set
                    if ( !o.theme ) {
                        o.theme = collapsibleSet.jqmData( "theme" ) || $.mobile.getInheritedTheme( collapsibleSet, "c" );
                    }
                    // Inherit the content-theme from collapsible-set
                    if ( !o.contentTheme ) {
                        o.contentTheme = collapsibleSet.jqmData( "content-theme" );
                    }

                    // Get the preference for collapsed icon in the set
                    if ( !o.collapsedIcon ) {
                        o.collapsedIcon = collapsibleSet.jqmData( "collapsed-icon" );
                    }
                    // Get the preference for expanded icon in the set
                    if ( !o.expandedIcon ) {
                        o.expandedIcon = collapsibleSet.jqmData( "expanded-icon" );
                    }
                    // Gets the preference icon position in the set
                    if ( !o.iconpos ) {
                        o.iconpos = collapsibleSet.jqmData( "iconpos" );
                    }
                    // Inherit the preference for inset from collapsible-set or set the default value to ensure equalty within a set
                    if ( collapsibleSet.jqmData( "inset" ) !== undefined ) {
                        o.inset = collapsibleSet.jqmData( "inset" );
                    } else {
                        o.inset = true;
                    }
                    // Gets the preference for mini in the set
                    if ( !o.mini ) {
                        o.mini = collapsibleSet.jqmData( "mini" );
                    }
                } else {
                    // get inherited theme if not a set and no theme has been set
                    if ( !o.theme ) {
                        o.theme = $.mobile.getInheritedTheme( $el, "c" );
                    }
                }

                if ( !!o.inset ) {
                    collapsible.addClass( "ui-collapsible-inset" );
                }

                collapsibleContent.addClass( ( o.contentTheme ) ? ( "ui-body-" + o.contentTheme ) : "");

                collapsedIcon = $el.jqmData( "collapsed-icon" ) || o.collapsedIcon || "plus";
                expandedIcon = $el.jqmData( "expanded-icon" ) || o.expandedIcon || "minus";

                collapsibleHeading
                    //drop heading in before content
                    .insertBefore( collapsibleContent )
                    //modify markup & attributes
                    .addClass( "ui-collapsible-heading" )
                    .append( "<span class='ui-collapsible-heading-status'></span>" )
                    .wrapInner( "<a href='#' class='ui-collapsible-heading-toggle'></a>" )
                    .find( "a" )
                    .first()
                    .buttonMarkup({
                        shadow: false,
                        corners: false,
                        iconpos: $el.jqmData( "iconpos" ) || o.iconpos || "left",
                        icon: collapsedIcon,
                        mini: o.mini,
                        theme: o.theme
                    });

                if ( !!o.inset ) {
                    collapsibleHeading
                        .find( "a" ).first().add( ".ui-btn-inner", $el )
                        .addClass( "ui-corner-top ui-corner-bottom" );
                }

                //events
                collapsible
                    .bind( "expand collapse", function( event ) {
                        if ( !event.isDefaultPrevented() ) {
                            var $this = $( this ),
                                isCollapse = ( event.type === "collapse" ),
                                contentTheme = o.contentTheme;

                            event.preventDefault();

                            collapsibleHeading
                                .toggleClass( "ui-collapsible-heading-collapsed", isCollapse )
                                .find( ".ui-collapsible-heading-status" )
                                .text( isCollapse ? o.expandCueText : o.collapseCueText )
                                .end()
                                .find( ".ui-icon" )
                                .toggleClass( "ui-icon-" + expandedIcon, !isCollapse )
                                // logic or cause same icon for expanded/collapsed state would remove the ui-icon-class
                                .toggleClass( "ui-icon-" + collapsedIcon, ( isCollapse || expandedIcon === collapsedIcon ) )
                                .end()
                                .find( "a" ).first().removeClass( $.mobile.activeBtnClass );

                            $this.toggleClass( "ui-collapsible-collapsed", isCollapse );
                            collapsibleContent.toggleClass( "ui-collapsible-content-collapsed", isCollapse ).attr( "aria-hidden", isCollapse );

                            if ( contentTheme && !!o.inset && ( !collapsibleSet.length || collapsible.jqmData( "collapsible-last" ) ) ) {
                                collapsibleHeading
                                    .find( "a" ).first().add( collapsibleHeading.find( ".ui-btn-inner" ) )
                                    .toggleClass( "ui-corner-bottom", isCollapse );
                                collapsibleContent.toggleClass( "ui-corner-bottom", !isCollapse );
                            }
                            collapsibleContent.trigger( "updatelayout" );
                        }
                    })
                    .trigger( o.collapsed ? "collapse" : "expand" );

                collapsibleHeading
                    .bind( "tap", function( event ) {
                        collapsibleHeading.find( "a" ).first().addClass( $.mobile.activeBtnClass );
                    })
                    .bind( "click", function( event ) {

                        var type = collapsibleHeading.is( ".ui-collapsible-heading-collapsed" ) ? "expand" : "collapse";

                        collapsible.trigger( type );

                        event.preventDefault();
                        event.stopPropagation();
                    });
            }
        });

//auto self-init widgets
        $( document ).bind( "pagecreate create", function( e ) {
            $.mobile.collapsible.prototype.enhanceWithin( e.target );
        });

    })( jQuery );

    (function( $, undefined ) {

        $.widget( "mobile.collapsibleset", $.mobile.widget, {
            options: {
                initSelector: ":jqmData(role='collapsible-set')"
            },
            _create: function() {
                var $el = this.element.addClass( "ui-collapsible-set" ),
                    o = this.options;

                // Inherit the theme from collapsible-set
                if ( !o.theme ) {
                    o.theme = $.mobile.getInheritedTheme( $el, "c" );
                }
                // Inherit the content-theme from collapsible-set
                if ( !o.contentTheme ) {
                    o.contentTheme = $el.jqmData( "content-theme" );
                }

                if ( $el.jqmData( "inset" ) !== undefined ) {
                    o.inset = $el.jqmData( "inset" );
                }
                o.inset = o.inset !== undefined ? o.inset : true;

                // Initialize the collapsible set if it's not already initialized
                if ( !$el.jqmData( "collapsiblebound" ) ) {
                    $el
                        .jqmData( "collapsiblebound", true )
                        .bind( "expand collapse", function( event ) {
                            var isCollapse = ( event.type === "collapse" ),
                                collapsible = $( event.target ).closest( ".ui-collapsible" ),
                                widget = collapsible.data( "collapsible" );
                            if ( collapsible.jqmData( "collapsible-last" ) && !!o.inset ) {
                                collapsible.find( ".ui-collapsible-heading" ).first()
                                    .find( "a" ).first()
                                    .toggleClass( "ui-corner-bottom", isCollapse )
                                    .find( ".ui-btn-inner" )
                                    .toggleClass( "ui-corner-bottom", isCollapse );
                                collapsible.find( ".ui-collapsible-content" ).toggleClass( "ui-corner-bottom", !isCollapse );
                            }
                        })
                        .bind( "expand", function( event ) {
                            var closestCollapsible = $( event.target )
                                .closest( ".ui-collapsible" );
                            if ( closestCollapsible.parent().is( ":jqmData(role='collapsible-set')" ) ) {
                                closestCollapsible
                                    .siblings( ".ui-collapsible" )
                                    .trigger( "collapse" );
                            }
                        });
                }
            },

            _init: function() {
                var $el = this.element,
                    collapsiblesInSet = $el.children( ":jqmData(role='collapsible')" ),
                    expanded = collapsiblesInSet.filter( ":jqmData(collapsed='false')" );
                this.refresh();

                // Because the corners are handled by the collapsible itself and the default state is collapsed
                // That was causing https://github.com/jquery/jquery-mobile/issues/4116
                expanded.trigger( "expand" );
            },

            refresh: function() {
                var $el = this.element,
                    o = this.options,
                    collapsiblesInSet = $el.children( ":jqmData(role='collapsible')" );

                $.mobile.collapsible.prototype.enhance( collapsiblesInSet.not( ".ui-collapsible" ) );

                // clean up borders
                if ( !!o.inset ) {
                    collapsiblesInSet.each(function() {
                        $( this ).jqmRemoveData( "collapsible-last" )
                            .find( ".ui-collapsible-heading" )
                            .find( "a" ).first()
                            .removeClass( "ui-corner-top ui-corner-bottom" )
                            .find( ".ui-btn-inner" )
                            .removeClass( "ui-corner-top ui-corner-bottom" );
                    });

                    collapsiblesInSet.first()
                        .find( "a" )
                        .first()
                        .addClass( "ui-corner-top" )
                        .find( ".ui-btn-inner" )
                        .addClass( "ui-corner-top" );

                    collapsiblesInSet.last()
                        .jqmData( "collapsible-last", true )
                        .find( "a" )
                        .first()
                        .addClass( "ui-corner-bottom" )
                        .find( ".ui-btn-inner" )
                        .addClass( "ui-corner-bottom" );
                }
            }
        });

//auto self-init widgets
        $( document ).bind( "pagecreate create", function( e ) {
            $.mobile.collapsibleset.prototype.enhanceWithin( e.target );
        });

    })( jQuery );

    (function( $, undefined ) {

        $.widget( "mobile.navbar", $.mobile.widget, {
            options: {
                iconpos: "top",
                grid: null,
                initSelector: ":jqmData(role='navbar')"
            },

            _create: function() {

                var $navbar = this.element,
                    $navbtns = $navbar.find( "a" ),
                    iconpos = $navbtns.filter( ":jqmData(icon)" ).length ?
                        this.options.iconpos : undefined;

                $navbar.addClass( "ui-navbar ui-mini" )
                    .attr( "role", "navigation" )
                    .find( "ul" )
                    .jqmEnhanceable()
                    .grid({ grid: this.options.grid });

                $navbtns.buttonMarkup({
                    corners:	false,
                    shadow:		false,
                    inline:     true,
                    iconpos:	iconpos
                });

                $navbar.delegate( "a", "vclick", function( event ) {
                    if ( !$(event.target).hasClass( "ui-disabled" ) ) {
                        $navbtns.removeClass( $.mobile.activeBtnClass );
                        $( this ).addClass( $.mobile.activeBtnClass );
                    }
                });

                // Buttons in the navbar with ui-state-persist class should regain their active state before page show
                $navbar.closest( ".ui-page" ).bind( "pagebeforeshow", function() {
                    $navbtns.filter( ".ui-state-persist" ).addClass( $.mobile.activeBtnClass );
                });
            }
        });

//auto self-init widgets
        $( document ).bind( "pagecreate create", function( e ) {
            $.mobile.navbar.prototype.enhanceWithin( e.target );
        });

    })( jQuery );

    (function( $, undefined ) {

//Keeps track of the number of lists per page UID
//This allows support for multiple nested list in the same page
//https://github.com/jquery/jquery-mobile/issues/1617
        var listCountPerPage = {};

        $.widget( "mobile.listview", $.mobile.widget, {

            options: {
                theme: null,
                countTheme: "c",
                headerTheme: "b",
                dividerTheme: "b",
                icon: "arrow-r",
                splitIcon: "arrow-r",
                splitTheme: "b",
                inset: false,
                initSelector: ":jqmData(role='listview')"
            },

            _create: function() {
                var t = this,
                    listviewClasses = "";

                listviewClasses += t.options.inset ? " ui-listview-inset ui-corner-all ui-shadow " : "";

                // create listview markup
                t.element.addClass(function( i, orig ) {
                    return orig + " ui-listview " + listviewClasses;
                });

                t.refresh( true );
            },

            _removeCorners: function( li, which ) {
                var top = "ui-corner-top ui-corner-tr ui-corner-tl",
                    bot = "ui-corner-bottom ui-corner-br ui-corner-bl";

                li = li.add( li.find( ".ui-btn-inner, .ui-li-link-alt, .ui-li-thumb" ) );

                if ( which === "top" ) {
                    li.removeClass( top );
                } else if ( which === "bottom" ) {
                    li.removeClass( bot );
                } else {
                    li.removeClass( top + " " + bot );
                }
            },

            _refreshCorners: function( create ) {
                var $li,
                    $visibleli,
                    $topli,
                    $bottomli;

                $li = this.element.children( "li" );
                // At create time and when autodividers calls refresh the li are not visible yet so we need to rely on .ui-screen-hidden
                $visibleli = create || $li.filter( ":visible" ).length === 0 ? $li.not( ".ui-screen-hidden" ) : $li.filter( ":visible" );

                // ui-li-last is used for setting border-bottom on the last li		
                $li.filter( ".ui-li-last" ).removeClass( "ui-li-last" );

                if ( this.options.inset ) {
                    this._removeCorners( $li );

                    // Select the first visible li element
                    $topli = $visibleli.first()
                        .addClass( "ui-corner-top" );

                    $topli.add( $topli.find( ".ui-btn-inner" )
                            .not( ".ui-li-link-alt span:first-child" ) )
                        .addClass( "ui-corner-top" )
                        .end()
                        .find( ".ui-li-link-alt, .ui-li-link-alt span:first-child" )
                        .addClass( "ui-corner-tr" )
                        .end()
                        .find( ".ui-li-thumb" )
                        .not( ".ui-li-icon" )
                        .addClass( "ui-corner-tl" );

                    // Select the last visible li element
                    $bottomli = $visibleli.last()
                        .addClass( "ui-corner-bottom ui-li-last" );

                    $bottomli.add( $bottomli.find( ".ui-btn-inner" ) )
                        .find( ".ui-li-link-alt" )
                        .addClass( "ui-corner-br" )
                        .end()
                        .find( ".ui-li-thumb" )
                        .not( ".ui-li-icon" )
                        .addClass( "ui-corner-bl" );
                } else {
                    $visibleli.last().addClass( "ui-li-last" );
                }
                if ( !create ) {
                    this.element.trigger( "updatelayout" );
                }
            },

            // This is a generic utility method for finding the first
            // node with a given nodeName. It uses basic DOM traversal
            // to be fast and is meant to be a substitute for simple
            // $.fn.closest() and $.fn.children() calls on a single
            // element. Note that callers must pass both the lowerCase
            // and upperCase version of the nodeName they are looking for.
            // The main reason for this is that this function will be
            // called many times and we want to avoid having to lowercase
            // the nodeName from the element every time to ensure we have
            // a match. Note that this function lives here for now, but may
            // be moved into $.mobile if other components need a similar method.
            _findFirstElementByTagName: function( ele, nextProp, lcName, ucName ) {
                var dict = {};
                dict[ lcName ] = dict[ ucName ] = true;
                while ( ele ) {
                    if ( dict[ ele.nodeName ] ) {
                        return ele;
                    }
                    ele = ele[ nextProp ];
                }
                return null;
            },
            _getChildrenByTagName: function( ele, lcName, ucName ) {
                var results = [],
                    dict = {};
                dict[ lcName ] = dict[ ucName ] = true;
                ele = ele.firstChild;
                while ( ele ) {
                    if ( dict[ ele.nodeName ] ) {
                        results.push( ele );
                    }
                    ele = ele.nextSibling;
                }
                return $( results );
            },

            _addThumbClasses: function( containers ) {
                var i, img, len = containers.length;
                for ( i = 0; i < len; i++ ) {
                    img = $( this._findFirstElementByTagName( containers[ i ].firstChild, "nextSibling", "img", "IMG" ) );
                    if ( img.length ) {
                        img.addClass( "ui-li-thumb" );
                        $( this._findFirstElementByTagName( img[ 0 ].parentNode, "parentNode", "li", "LI" ) ).addClass( img.is( ".ui-li-icon" ) ? "ui-li-has-icon" : "ui-li-has-thumb" );
                    }
                }
            },

            refresh: function( create ) {
                this.parentPage = this.element.closest( ".ui-page" );
                this._createSubPages();

                var o = this.options,
                    $list = this.element,
                    self = this,
                    dividertheme = $list.jqmData( "dividertheme" ) || o.dividerTheme,
                    listsplittheme = $list.jqmData( "splittheme" ),
                    listspliticon = $list.jqmData( "spliticon" ),
                    listicon = $list.jqmData( "icon" ),
                    li = this._getChildrenByTagName( $list[ 0 ], "li", "LI" ),
                    ol = !!$.nodeName( $list[ 0 ], "ol" ),
                    jsCount = !$.support.cssPseudoElement,
                    start = $list.attr( "start" ),
                    itemClassDict = {},
                    item, itemClass, itemTheme,
                    a, last, splittheme, counter, startCount, newStartCount, countParent, icon, imgParents, img, linkIcon;

                if ( ol && jsCount ) {
                    $list.find( ".ui-li-dec" ).remove();
                }

                if ( ol ) {
                    // Check if a start attribute has been set while taking a value of 0 into account
                    if ( start || start === 0 ) {
                        if ( !jsCount ) {
                            startCount = parseFloat( start ) - 1;
                            $list.css( "counter-reset", "listnumbering " + startCount );
                        } else {
                            counter = parseFloat( start );
                        }
                    } else if ( jsCount ) {
                        counter = 1;
                    }
                }

                if ( !o.theme ) {
                    o.theme = $.mobile.getInheritedTheme( this.element, "c" );
                }

                for ( var pos = 0, numli = li.length; pos < numli; pos++ ) {
                    item = li.eq( pos );
                    itemClass = "ui-li";

                    // If we're creating the element, we update it regardless
                    if ( create || !item.hasClass( "ui-li" ) ) {
                        itemTheme = item.jqmData( "theme" ) || o.theme;
                        a = this._getChildrenByTagName( item[ 0 ], "a", "A" );
                        var isDivider = ( item.jqmData( "role" ) === "list-divider" );

                        if ( a.length && !isDivider ) {
                            icon = item.jqmData( "icon" );

                            item.buttonMarkup({
                                wrapperEls: "div",
                                shadow: false,
                                corners: false,
                                iconpos: "right",
                                icon: a.length > 1 || icon === false ? false : icon || listicon || o.icon,
                                theme: itemTheme
                            });

                            if ( ( icon !== false ) && ( a.length === 1 ) ) {
                                item.addClass( "ui-li-has-arrow" );
                            }

                            a.first().removeClass( "ui-link" ).addClass( "ui-link-inherit" );

                            if ( a.length > 1 ) {
                                itemClass += " ui-li-has-alt";

                                last = a.last();
                                splittheme = listsplittheme || last.jqmData( "theme" ) || o.splitTheme;
                                linkIcon = last.jqmData( "icon" );

                                last.appendTo( item )
                                    .attr( "title", last.getEncodedText() )
                                    .addClass( "ui-li-link-alt" )
                                    .empty()
                                    .buttonMarkup({
                                        shadow: false,
                                        corners: false,
                                        theme: itemTheme,
                                        icon: false,
                                        iconpos: "notext"
                                    })
                                    .find( ".ui-btn-inner" )
                                    .append(
                                        $( document.createElement( "span" ) ).buttonMarkup({
                                            shadow: true,
                                            corners: true,
                                            theme: splittheme,
                                            iconpos: "notext",
                                            // link icon overrides list item icon overrides ul element overrides options
                                            icon: linkIcon || icon || listspliticon || o.splitIcon
                                        })
                                    );
                            }
                        } else if ( isDivider ) {

                            itemClass += " ui-li-divider ui-bar-" + dividertheme;
                            item.attr( "role", "heading" );

                            if ( ol ) {
                                //reset counter when a divider heading is encountered
                                if ( start || start === 0 ) {
                                    if ( !jsCount ) {
                                        newStartCount = parseFloat( start ) - 1;
                                        item.css( "counter-reset", "listnumbering " + newStartCount );
                                    } else {
                                        counter = parseFloat( start );
                                    }
                                } else if ( jsCount ) {
                                    counter = 1;
                                }
                            }

                        } else {
                            itemClass += " ui-li-static ui-btn-up-" + itemTheme;
                        }
                    }

                    if ( ol && jsCount && itemClass.indexOf( "ui-li-divider" ) < 0 ) {
                        countParent = itemClass.indexOf( "ui-li-static" ) > 0 ? item : item.find( ".ui-link-inherit" );

                        countParent.addClass( "ui-li-jsnumbering" )
                            .prepend( "<span class='ui-li-dec'>" + ( counter++ ) + ". </span>" );
                    }

                    // Instead of setting item class directly on the list item and its
                    // btn-inner at this point in time, push the item into a dictionary
                    // that tells us what class to set on it so we can do this after this
                    // processing loop is finished.

                    if ( !itemClassDict[ itemClass ] ) {
                        itemClassDict[ itemClass ] = [];
                    }

                    itemClassDict[ itemClass ].push( item[ 0 ] );
                }

                // Set the appropriate listview item classes on each list item
                // and their btn-inner elements. The main reason we didn't do this
                // in the for-loop above is because we can eliminate per-item function overhead
                // by calling addClass() and children() once or twice afterwards. This
                // can give us a significant boost on platforms like WP7.5.

                for ( itemClass in itemClassDict ) {
                    $( itemClassDict[ itemClass ] ).addClass( itemClass ).children( ".ui-btn-inner" ).addClass( itemClass );
                }

                $list.find( "h1, h2, h3, h4, h5, h6" ).addClass( "ui-li-heading" )
                    .end()

                    .find( "p, dl" ).addClass( "ui-li-desc" )
                    .end()

                    .find( ".ui-li-aside" ).each(function() {
                        var $this = $( this );
                        $this.prependTo( $this.parent() ); //shift aside to front for css float
                    })
                    .end()

                    .find( ".ui-li-count" ).each(function() {
                        $( this ).closest( "li" ).addClass( "ui-li-has-count" );
                    }).addClass( "ui-btn-up-" + ( $list.jqmData( "counttheme" ) || this.options.countTheme) + " ui-btn-corner-all" );

                // The idea here is to look at the first image in the list item
                // itself, and any .ui-link-inherit element it may contain, so we
                // can place the appropriate classes on the image and list item.
                // Note that we used to use something like:
                //
                //    li.find(">img:eq(0), .ui-link-inherit>img:eq(0)").each( ... );
                //
                // But executing a find() like that on Windows Phone 7.5 took a
                // really long time. Walking things manually with the code below
                // allows the 400 listview item page to load in about 3 seconds as
                // opposed to 30 seconds.

                this._addThumbClasses( li );
                this._addThumbClasses( $list.find( ".ui-link-inherit" ) );

                this._refreshCorners( create );

                // autodividers binds to this to redraw dividers after the listview refresh
                this._trigger( "afterrefresh" );
            },

            //create a string for ID/subpage url creation
            _idStringEscape: function( str ) {
                return str.replace(/[^a-zA-Z0-9]/g, '-');
            },

            _createSubPages: function() {
                var parentList = this.element,
                    parentPage = parentList.closest( ".ui-page" ),
                    parentUrl = parentPage.jqmData( "url" ),
                    parentId = parentUrl || parentPage[ 0 ][ $.expando ],
                    parentListId = parentList.attr( "id" ),
                    o = this.options,
                    dns = "data-" + $.mobile.ns,
                    self = this,
                    persistentFooterID = parentPage.find( ":jqmData(role='footer')" ).jqmData( "id" ),
                    hasSubPages;

                if ( typeof listCountPerPage[ parentId ] === "undefined" ) {
                    listCountPerPage[ parentId ] = -1;
                }

                parentListId = parentListId || ++listCountPerPage[ parentId ];

                $( parentList.find( "li>ul, li>ol" ).toArray().reverse() ).each(function( i ) {
                    var self = this,
                        list = $( this ),
                        listId = list.attr( "id" ) || parentListId + "-" + i,
                        parent = list.parent(),
                        nodeElsFull = $( list.prevAll().toArray().reverse() ),
                        nodeEls = nodeElsFull.length ? nodeElsFull : $( "<span>" + $.trim(parent.contents()[ 0 ].nodeValue) + "</span>" ),
                        title = nodeEls.first().getEncodedText(),//url limits to first 30 chars of text
                        id = ( parentUrl || "" ) + "&" + $.mobile.subPageUrlKey + "=" + listId,
                        theme = list.jqmData( "theme" ) || o.theme,
                        countTheme = list.jqmData( "counttheme" ) || parentList.jqmData( "counttheme" ) || o.countTheme,
                        newPage, anchor;

                    //define hasSubPages for use in later removal
                    hasSubPages = true;

                    newPage = list.detach()
                        .wrap( "<div " + dns + "role='page' " + dns + "url='" + id + "' " + dns + "theme='" + theme + "' " + dns + "count-theme='" + countTheme + "'><div " + dns + "role='content'></div></div>" )
                        .parent()
                        .before( "<div " + dns + "role='header' " + dns + "theme='" + o.headerTheme + "'><div class='ui-title'>" + title + "</div></div>" )
                        .after( persistentFooterID ? $( "<div " + dns + "role='footer' " + dns + "id='"+ persistentFooterID +"'>" ) : "" )
                        .parent()
                        .appendTo( $.mobile.pageContainer );

                    newPage.page();

                    anchor = parent.find( 'a:first' );

                    if ( !anchor.length ) {
                        anchor = $( "<a/>" ).html( nodeEls || title ).prependTo( parent.empty() );
                    }

                    anchor.attr( "href", "#" + id );

                }).listview();

                // on pagehide, remove any nested pages along with the parent page, as long as they aren't active
                // and aren't embedded
                if ( hasSubPages &&
                    parentPage.is( ":jqmData(external-page='true')" ) &&
                    parentPage.data( "page" ).options.domCache === false ) {

                    var newRemove = function( e, ui ) {
                        var nextPage = ui.nextPage, npURL,
                            prEvent = new $.Event( "pageremove" );

                        if ( ui.nextPage ) {
                            npURL = nextPage.jqmData( "url" );
                            if ( npURL.indexOf( parentUrl + "&" + $.mobile.subPageUrlKey ) !== 0 ) {
                                self.childPages().remove();
                                parentPage.trigger( prEvent );
                                if ( !prEvent.isDefaultPrevented() ) {
                                    parentPage.removeWithDependents();
                                }
                            }
                        }
                    };

                    // unbind the original page remove and replace with our specialized version
                    parentPage
                        .unbind( "pagehide.remove" )
                        .bind( "pagehide.remove", newRemove);
                }
            },

            // TODO sort out a better way to track sub pages of the listview this is brittle
            childPages: function() {
                var parentUrl = this.parentPage.jqmData( "url" );

                return $( ":jqmData(url^='"+  parentUrl + "&" + $.mobile.subPageUrlKey + "')" );
            }
        });

//auto self-init widgets
        $( document ).bind( "pagecreate create", function( e ) {
            $.mobile.listview.prototype.enhanceWithin( e.target );
        });

    })( jQuery );

    (function( $, undefined ) {

        $.mobile.listview.prototype.options.autodividers = false;
        $.mobile.listview.prototype.options.autodividersSelector = function( elt ) {
            // look for the text in the given element
            var text = $.trim( elt.text() ) || null;

            if ( !text ) {
                return null;
            }

            // create the text for the divider (first uppercased letter)
            text = text.slice( 0, 1 ).toUpperCase();

            return text;
        };

        $( document ).delegate( "ul,ol", "listviewcreate", function() {

            var list = $( this ),
                listview = list.data( "listview" );

            if ( !listview || !listview.options.autodividers ) {
                return;
            }

            var replaceDividers = function () {
                list.find( "li:jqmData(role='list-divider')" ).remove();

                var lis = list.find( 'li' ),
                    lastDividerText = null, li, dividerText;

                for ( var i = 0; i < lis.length ; i++ ) {
                    li = lis[i];
                    dividerText = listview.options.autodividersSelector( $( li ) );

                    if ( dividerText && lastDividerText !== dividerText ) {
                        var divider = document.createElement( 'li' );
                        divider.appendChild( document.createTextNode( dividerText ) );
                        divider.setAttribute( 'data-' + $.mobile.ns + 'role', 'list-divider' );
                        li.parentNode.insertBefore( divider, li );
                    }

                    lastDividerText = dividerText;
                }
            };

            var afterListviewRefresh = function () {
                list.unbind( 'listviewafterrefresh', afterListviewRefresh );
                replaceDividers();
                listview.refresh();
                list.bind( 'listviewafterrefresh', afterListviewRefresh );
            };

            afterListviewRefresh();
        });

    })( jQuery );

    /*
     * "checkboxradio" plugin
     */

    (function( $, undefined ) {

        $.widget( "mobile.checkboxradio", $.mobile.widget, {
            options: {
                theme: null,
                mini: false,
                initSelector: "input[type='checkbox'],input[type='radio']"
            },
            _create: function() {
                var self = this,
                    input = this.element,
                    o = this.options,
                    inheritAttr = function( input, dataAttr ) {
                        return input.jqmData( dataAttr ) || input.closest( "form, fieldset" ).jqmData( dataAttr );
                    },
                // NOTE: Windows Phone could not find the label through a selector
                // filter works though.
                    parentLabel = $( input ).closest( "label" ),
                    label = parentLabel.length ? parentLabel : $( input ).closest( "form, fieldset, :jqmData(role='page'), :jqmData(role='dialog')" ).find( "label" ).filter( "[for='" + input[0].id + "']" ).first(),
                    inputtype = input[0].type,
                    mini = inheritAttr( input, "mini" ) || o.mini,
                    checkedState = inputtype + "-on",
                    uncheckedState = inputtype + "-off",
                    icon = input.parents( ":jqmData(type='horizontal')" ).length ? undefined : uncheckedState,
                    iconpos = inheritAttr( input, "iconpos" ),
                    activeBtn = icon ? "" : " " + $.mobile.activeBtnClass,
                    checkedClass = "ui-" + checkedState + activeBtn,
                    uncheckedClass = "ui-" + uncheckedState,
                    checkedicon = "ui-icon-" + checkedState,
                    uncheckedicon = "ui-icon-" + uncheckedState;

                if ( inputtype !== "checkbox" && inputtype !== "radio" ) {
                    return;
                }

                // Expose for other methods
                $.extend( this, {
                    label: label,
                    inputtype: inputtype,
                    checkedClass: checkedClass,
                    uncheckedClass: uncheckedClass,
                    checkedicon: checkedicon,
                    uncheckedicon: uncheckedicon
                });

                // If there's no selected theme check the data attr
                if ( !o.theme ) {
                    o.theme = $.mobile.getInheritedTheme( this.element, "c" );
                }

                label.buttonMarkup({
                    theme: o.theme,
                    icon: icon,
                    shadow: false,
                    mini: mini,
                    iconpos: iconpos
                });

                // Wrap the input + label in a div
                var wrapper = document.createElement('div');
                wrapper.className = 'ui-' + inputtype;

                input.add( label ).wrapAll( wrapper );

                label.bind({
                    vmouseover: function( event ) {
                        if ( $( this ).parent().is( ".ui-disabled" ) ) {
                            event.stopPropagation();
                        }
                    },

                    vclick: function( event ) {
                        if ( input.is( ":disabled" ) ) {
                            event.preventDefault();
                            return;
                        }

                        self._cacheVals();

                        input.prop( "checked", inputtype === "radio" && true || !input.prop( "checked" ) );

                        // trigger click handler's bound directly to the input as a substitute for
                        // how label clicks behave normally in the browsers
                        // TODO: it would be nice to let the browser's handle the clicks and pass them
                        //       through to the associate input. we can swallow that click at the parent
                        //       wrapper element level
                        input.triggerHandler( 'click' );

                        // Input set for common radio buttons will contain all the radio
                        // buttons, but will not for checkboxes. clearing the checked status
                        // of other radios ensures the active button state is applied properly
                        self._getInputSet().not( input ).prop( "checked", false );

                        self._updateAll();
                        return false;
                    }
                });

                input
                    .bind({
                        vmousedown: function() {
                            self._cacheVals();
                        },

                        vclick: function() {
                            var $this = $( this );

                            // Adds checked attribute to checked input when keyboard is used
                            if ( $this.is( ":checked" ) ) {

                                $this.prop( "checked", true);
                                self._getInputSet().not( $this ).prop( "checked", false );
                            } else {

                                $this.prop( "checked", false );
                            }

                            self._updateAll();
                        },

                        focus: function() {
                            label.addClass( $.mobile.focusClass );
                        },

                        blur: function() {
                            label.removeClass( $.mobile.focusClass );
                        }
                    });

                if ( this._handleFormReset ) {
                    this._handleFormReset();
                }
                this.refresh();
            },

            _cacheVals: function() {
                this._getInputSet().each(function() {
                    $( this ).jqmData( "cacheVal", this.checked );
                });
            },

            //returns either a set of radios with the same name attribute, or a single checkbox
            _getInputSet: function() {
                if ( this.inputtype === "checkbox" ) {
                    return this.element;
                }

                return this.element.closest( "form, fieldset, :jqmData(role='page'), :jqmData(role='dialog')" )
                    .find( "input[name='" + this.element[0].name + "'][type='" + this.inputtype + "']" );
            },

            _updateAll: function() {
                var self = this;

                this._getInputSet().each(function() {
                    var $this = $( this );

                    if ( this.checked || self.inputtype === "checkbox" ) {
                        $this.trigger( "change" );
                    }
                })
                    .checkboxradio( "refresh" );
            },

            _reset: function() {
                this.refresh();
            },

            refresh: function() {
                var input = this.element[0],
                    label = this.label,
                    icon = label.find( ".ui-icon" );

                if ( input.checked ) {
                    label.addClass( this.checkedClass ).removeClass( this.uncheckedClass );
                    icon.addClass( this.checkedicon ).removeClass( this.uncheckedicon );
                } else {
                    label.removeClass( this.checkedClass ).addClass( this.uncheckedClass );
                    icon.removeClass( this.checkedicon ).addClass( this.uncheckedicon );
                }

                if ( input.disabled ) {
                    this.disable();
                } else {
                    this.enable();
                }
            },

            disable: function() {
                this.element.prop( "disabled", true ).parent().addClass( "ui-disabled" );
            },

            enable: function() {
                this.element.prop( "disabled", false ).parent().removeClass( "ui-disabled" );
            }
        });

        $.widget( "mobile.checkboxradio", $.mobile.checkboxradio, $.mobile.behaviors.formReset );

//auto self-init widgets
        $( document ).bind( "pagecreate create", function( e ) {
            $.mobile.checkboxradio.prototype.enhanceWithin( e.target, true );
        });

    })( jQuery );

    (function( $, undefined ) {

        $.widget( "mobile.button", $.mobile.widget, {
            options: {
                theme: null,
                icon: null,
                iconpos: null,
                corners: true,
                shadow: true,
                iconshadow: true,
                initSelector: "button, [type='button'], [type='submit'], [type='reset']"
            },
            _create: function() {
                var $el = this.element,
                    $button,
                    o = this.options,
                    type,
                    name,
                    inline = o.inline || $el.jqmData( "inline" ),
                    mini = o.mini || $el.jqmData( "mini" ),
                    classes = "",
                    $buttonPlaceholder;

                // if this is a link, check if it's been enhanced and, if not, use the right function
                if ( $el[ 0 ].tagName === "A" ) {
                    if ( !$el.hasClass( "ui-btn" ) ) {
                        $el.buttonMarkup();
                    }

                    return;
                }

                // get the inherited theme
                // TODO centralize for all widgets
                if ( !this.options.theme ) {
                    this.options.theme = $.mobile.getInheritedTheme( this.element, "c" );
                }

                // TODO: Post 1.1--once we have time to test thoroughly--any classes manually applied to the original element should be carried over to the enhanced element, with an `-enhanced` suffix. See https://github.com/jquery/jquery-mobile/issues/3577
                /* if ( $el[0].className.length ) {
                 classes = $el[0].className;
                 } */
                if ( !!~$el[0].className.indexOf( "ui-btn-left" ) ) {
                    classes = "ui-btn-left";
                }

                if (  !!~$el[0].className.indexOf( "ui-btn-right" ) ) {
                    classes = "ui-btn-right";
                }

                if (  $el.attr( "type" ) === "submit" || $el.attr( "type" ) === "reset" ) {
                    classes ? classes += " ui-submit" :  classes = "ui-submit";
                }
                $( "label[for='" + $el.attr( "id" ) + "']" ).addClass( "ui-submit" );

                // Add ARIA role
                this.button = $( "<div></div>" )
                    [ $el.html() ? "html" : "text" ]( $el.html() || $el.val() )
                    .insertBefore( $el )
                    .buttonMarkup({
                        theme: o.theme,
                        icon: o.icon,
                        iconpos: o.iconpos,
                        inline: inline,
                        corners: o.corners,
                        shadow: o.shadow,
                        iconshadow: o.iconshadow,
                        mini: mini
                    })
                    .addClass( classes )
                    .append( $el.addClass( "ui-btn-hidden" ) );

                $button = this.button;
                type = $el.attr( "type" );
                name = $el.attr( "name" );

                // Add hidden input during submit if input type="submit" has a name.
                if ( type !== "button" && type !== "reset" && name ) {
                    $el.bind( "vclick", function() {
                        // Add hidden input if it doesn't already exist.
                        if ( $buttonPlaceholder === undefined ) {
                            $buttonPlaceholder = $( "<input>", {
                                type: "hidden",
                                name: $el.attr( "name" ),
                                value: $el.attr( "value" )
                            }).insertBefore( $el );

                            // Bind to doc to remove after submit handling
                            $( document ).one( "submit", function() {
                                $buttonPlaceholder.remove();

                                // reset the local var so that the hidden input
                                // will be re-added on subsequent clicks
                                $buttonPlaceholder = undefined;
                            });
                        }
                    });
                }

                $el.bind({
                    focus: function() {
                        $button.addClass( $.mobile.focusClass );
                    },

                    blur: function() {
                        $button.removeClass( $.mobile.focusClass );
                    }
                });

                this.refresh();
            },

            enable: function() {
                this.element.attr( "disabled", false );
                this.button.removeClass( "ui-disabled" ).attr( "aria-disabled", false );
                return this._setOption( "disabled", false );
            },

            disable: function() {
                this.element.attr( "disabled", true );
                this.button.addClass( "ui-disabled" ).attr( "aria-disabled", true );
                return this._setOption( "disabled", true );
            },

            refresh: function() {
                var $el = this.element;

                if ( $el.prop("disabled") ) {
                    this.disable();
                } else {
                    this.enable();
                }

                // Grab the button's text element from its implementation-independent data item
                $( this.button.data( 'buttonElements' ).text )[ $el.html() ? "html" : "text" ]( $el.html() || $el.val() );
            }
        });

//auto self-init widgets
        $( document ).bind( "pagecreate create", function( e ) {
            $.mobile.button.prototype.enhanceWithin( e.target, true );
        });

    })( jQuery );

    (function( $, undefined ) {

        $.fn.controlgroup = function( options ) {
            function flipClasses( els, flCorners  ) {
                els.removeClass( "ui-btn-corner-all ui-corner-top ui-corner-bottom ui-corner-left ui-corner-right ui-controlgroup-last ui-shadow" )
                    .eq( 0 ).addClass( flCorners[ 0 ] )
                    .end()
                    .last().addClass( flCorners[ 1 ] ).addClass( "ui-controlgroup-last" );
            }

            return this.each(function() {
                var $el = $( this ),
                    o = $.extend({
                        direction: $el.jqmData( "type" ) || "vertical",
                        shadow: false,
                        excludeInvisible: true,
                        mini: $el.jqmData( "mini" )
                    }, options ),
                    grouplegend = $el.children( "legend" ),
                    groupheading = $el.children( ".ui-controlgroup-label" ),
                    groupcontrols = $el.children( ".ui-controlgroup-controls" ),
                    flCorners = o.direction === "horizontal" ? [ "ui-corner-left", "ui-corner-right" ] : [ "ui-corner-top", "ui-corner-bottom" ],
                    type = $el.find( "input" ).first().attr( "type" );

                // First unwrap the controls if the controlgroup was already enhanced
                if ( groupcontrols.length ) {
                    groupcontrols.contents().unwrap();
                }
                $el.wrapInner( "<div class='ui-controlgroup-controls'></div>" );

                if ( grouplegend.length ) {
                    // Replace legend with more stylable replacement div
                    $( "<div role='heading' class='ui-controlgroup-label'>" + grouplegend.html() + "</div>" ).insertBefore( $el.children( 0 ) );
                    grouplegend.remove();
                } else if ( groupheading.length ) {
                    // Just move the heading if the controlgroup was already enhanced
                    $el.prepend( groupheading );
                }

                $el.addClass( "ui-corner-all ui-controlgroup ui-controlgroup-" + o.direction );

                flipClasses( $el.find( ".ui-btn" + ( o.excludeInvisible ? ":visible" : "" ) ).not( '.ui-slider-handle' ), flCorners );
                flipClasses( $el.find( ".ui-btn-inner" ), flCorners );

                if ( o.shadow ) {
                    $el.addClass( "ui-shadow" );
                }

                if ( o.mini ) {
                    $el.addClass( "ui-mini" );
                }

            });
        };

// The pagecreate handler for controlgroup is in jquery.mobile.init because of the soft-dependency on the wrapped widgets

    })(jQuery);

    (function( $, undefined ) {

        $( document ).bind( "pagecreate create", function( e ) {

            //links within content areas, tests included with page
            $( e.target )
                .find( "a" )
                .jqmEnhanceable()
                .not( ".ui-btn, .ui-link-inherit, :jqmData(role='none'), :jqmData(role='nojs')" )
                .addClass( "ui-link" );

        });

    })( jQuery );


    (function( $, undefined ) {

        function fitSegmentInsideSegment( winSize, segSize, offset, desired ) {
            var ret = desired;

            if ( winSize < segSize ) {
                // Center segment if it's bigger than the window
                ret = offset + ( winSize - segSize ) / 2;
            } else {
                // Otherwise center it at the desired coordinate while keeping it completely inside the window
                ret = Math.min( Math.max( offset, desired - segSize / 2 ), offset + winSize - segSize );
            }

            return ret;
        }

        function windowCoords() {
            var $win = $( window );

            return {
                x: $win.scrollLeft(),
                y: $win.scrollTop(),
                cx: ( window.innerWidth || $win.width() ),
                cy: ( window.innerHeight || $win.height() )
            };
        }

        $.widget( "mobile.popup", $.mobile.widget, {
            options: {
                theme: null,
                overlayTheme: null,
                shadow: true,
                corners: true,
                transition: "none",
                positionTo: "origin",
                tolerance: null,
                initSelector: ":jqmData(role='popup')",
                closeLinkSelector: "a:jqmData(rel='back')",
                closeLinkEvents: "click.popup",
                navigateEvents: "navigate.popup",
                closeEvents: "navigate.popup pagebeforechange.popup",

                // NOTE Windows Phone 7 has a scroll position caching issue that
                //      requires us to disable popup history management by default
                //      https://github.com/jquery/jquery-mobile/issues/4784
                //
                // NOTE this option is modified in _create!
                history: !$.mobile.browser.ie
            },

            _eatEventAndClose: function( e ) {
                e.preventDefault();
                e.stopImmediatePropagation();
                this.close();
                return false;
            },

            // Make sure the screen size is increased beyond the page height if the popup's causes the document to increase in height
            _resizeScreen: function() {
                var popupHeight = this._ui.container.outerHeight( true );

                this._ui.screen.removeAttr( "style" );
                if ( popupHeight > this._ui.screen.height() ) {
                    this._ui.screen.height( popupHeight );
                }
            },

            _handleWindowKeyUp: function( e ) {
                if ( this._isOpen && e.keyCode === $.mobile.keyCode.ESCAPE ) {
                    return this._eatEventAndClose( e );
                }
            },

            _expectResizeEvent: function() {
                var winCoords = windowCoords();

                if ( this._resizeData ) {
                    if ( winCoords.x === this._resizeData.winCoords.x &&
                        winCoords.y === this._resizeData.winCoords.y &&
                        winCoords.cx === this._resizeData.winCoords.cx &&
                        winCoords.cy === this._resizeData.winCoords.cy ) {
                        // timeout not refreshed
                        return false;
                    } else {
                        // clear existing timeout - it will be refreshed below
                        clearTimeout( this._resizeData.timeoutId );
                    }
                }

                this._resizeData = {
                    timeoutId: setTimeout( $.proxy( this, "_resizeTimeout" ), 200 ),
                    winCoords: winCoords
                };

                return true;
            },

            _resizeTimeout: function() {
                if ( this._isOpen ) {
                    if ( !this._expectResizeEvent() ) {
                        if ( this._ui.container.hasClass( "ui-popup-hidden" ) ) {
                            // effectively rapid-open the popup while leaving the screen intact
                            this._trigger( "beforeposition" );
                            this._ui.container
                                .removeClass( "ui-popup-hidden" )
                                .offset( this._placementCoords( this._desiredCoords( undefined, undefined, "window" ) ) );
                        }

                        this._resizeScreen();
                        this._resizeData = null;
                        this._orientationchangeInProgress = false;
                    }
                } else {
                    this._resizeData = null;
                    this._orientationchangeInProgress = false;
                }
            },

            _handleWindowResize: function( e ) {
                if ( this._isOpen ) {
                    if ( ( this._expectResizeEvent() || this._orientationchangeInProgress ) &&
                        !this._ui.container.hasClass( "ui-popup-hidden" ) ) {
                        // effectively rapid-close the popup while leaving the screen intact
                        this._ui.container
                            .addClass( "ui-popup-hidden" )
                            .removeAttr( "style" );
                    }
                }
            },

            _handleWindowOrientationchange: function( e ) {
                if ( !this._orientationchangeInProgress && this._isOpen ) {
                    this._expectResizeEvent();
                    this._orientationchangeInProgress = true;
                }
            },

            _create: function() {
                var ui = {
                        screen: $( "<div class='ui-screen-hidden ui-popup-screen'></div>" ),
                        placeholder: $( "<div style='display: none;'><!-- placeholder --></div>" ),
                        container: $( "<div class='ui-popup-container ui-popup-hidden'></div>" )
                    },
                    thisPage = this.element.closest( ".ui-page" ),
                    myId = this.element.attr( "id" ),
                    self = this;

                // We need to adjust the history option to be false if there's no AJAX nav.
                // We can't do it in the option declarations because those are run before
                // it is determined whether there shall be AJAX nav.
                this.options.history = this.options.history && $.mobile.ajaxEnabled && $.mobile.hashListeningEnabled;

                if ( thisPage.length === 0 ) {
                    thisPage = $( "body" );
                }

                // define the container for navigation event bindings
                // TODO this would be nice at the the mobile widget level
                this.options.container = this.options.container || $.mobile.pageContainer;

                // Apply the proto
                thisPage.append( ui.screen );
                ui.container.insertAfter( ui.screen );
                // Leave a placeholder where the element used to be
                ui.placeholder.insertAfter( this.element );
                if ( myId ) {
                    ui.screen.attr( "id", myId + "-screen" );
                    ui.container.attr( "id", myId + "-popup" );
                    ui.placeholder.html( "<!-- placeholder for " + myId + " -->" );
                }
                ui.container.append( this.element );

                // Add class to popup element
                this.element.addClass( "ui-popup" );

                // Define instance variables
                $.extend( this, {
                    _scrollTop: 0,
                    _page: thisPage,
                    _ui: ui,
                    _fallbackTransition: "",
                    _currentTransition: false,
                    _prereqs: null,
                    _isOpen: false,
                    _tolerance: null,
                    _resizeData: null,
                    _orientationchangeInProgress: false,
                    _globalHandlers: [
                        {
                            src: $( window ),
                            handler: {
                                orientationchange: $.proxy( this, "_handleWindowOrientationchange" ),
                                resize: $.proxy( this, "_handleWindowResize" ),
                                keyup: $.proxy( this, "_handleWindowKeyUp" )
                            }
                        }
                    ]
                });

                $.each( this.options, function( key, value ) {
                    // Cause initial options to be applied by their handler by temporarily setting the option to undefined
                    // - the handler then sets it to the initial value
                    self.options[ key ] = undefined;
                    self._setOption( key, value, true );
                });

                ui.screen.bind( "vclick", $.proxy( this, "_eatEventAndClose" ) );

                $.each( this._globalHandlers, function( idx, value ) {
                    value.src.bind( value.handler );
                });
            },

            _applyTheme: function( dst, theme, prefix ) {
                var classes = ( dst.attr( "class" ) || "").split( " " ),
                    alreadyAdded = true,
                    currentTheme = null,
                    matches,
                    themeStr = String( theme );

                while ( classes.length > 0 ) {
                    currentTheme = classes.pop();
                    matches = ( new RegExp( "^ui-" + prefix + "-([a-z])$" ) ).exec( currentTheme );
                    if ( matches && matches.length > 1 ) {
                        currentTheme = matches[ 1 ];
                        break;
                    } else {
                        currentTheme = null;
                    }
                }

                if ( theme !== currentTheme ) {
                    dst.removeClass( "ui-" + prefix + "-" + currentTheme );
                    if ( ! ( theme === null || theme === "none" ) ) {
                        dst.addClass( "ui-" + prefix + "-" + themeStr );
                    }
                }
            },

            _setTheme: function( value ) {
                this._applyTheme( this.element, value, "body" );
            },

            _setOverlayTheme: function( value ) {
                this._applyTheme( this._ui.screen, value, "overlay" );

                if ( this._isOpen ) {
                    this._ui.screen.addClass( "in" );
                }
            },

            _setShadow: function( value ) {
                this.element.toggleClass( "ui-overlay-shadow", value );
            },

            _setCorners: function( value ) {
                this.element.toggleClass( "ui-corner-all", value );
            },

            _applyTransition: function( value ) {
                this._ui.container.removeClass( this._fallbackTransition );
                if ( value && value !== "none" ) {
                    this._fallbackTransition = $.mobile._maybeDegradeTransition( value );
                    if ( this._fallbackTransition === "none" ) {
                        this._fallbackTransition = "";
                    }
                    this._ui.container.addClass( this._fallbackTransition );
                }
            },

            _setTransition: function( value ) {
                if ( !this._currentTransition ) {
                    this._applyTransition( value );
                }
            },

            _setTolerance: function( value ) {
                var tol = { t: 30, r: 15, b: 30, l: 15 };

                if ( value ) {
                    var ar = String( value ).split( "," );

                    $.each( ar, function( idx, val ) { ar[ idx ] = parseInt( val, 10 ); } );

                    switch( ar.length ) {
                        // All values are to be the same
                        case 1:
                            if ( !isNaN( ar[ 0 ] ) ) {
                                tol.t = tol.r = tol.b = tol.l = ar[ 0 ];
                            }
                            break;

                        // The first value denotes top/bottom tolerance, and the second value denotes left/right tolerance
                        case 2:
                            if ( !isNaN( ar[ 0 ] ) ) {
                                tol.t = tol.b = ar[ 0 ];
                            }
                            if ( !isNaN( ar[ 1 ] ) ) {
                                tol.l = tol.r = ar[ 1 ];
                            }
                            break;

                        // The array contains values in the order top, right, bottom, left
                        case 4:
                            if ( !isNaN( ar[ 0 ] ) ) {
                                tol.t = ar[ 0 ];
                            }
                            if ( !isNaN( ar[ 1 ] ) ) {
                                tol.r = ar[ 1 ];
                            }
                            if ( !isNaN( ar[ 2 ] ) ) {
                                tol.b = ar[ 2 ];
                            }
                            if ( !isNaN( ar[ 3 ] ) ) {
                                tol.l = ar[ 3 ];
                            }
                            break;

                        default:
                            break;
                    }
                }

                this._tolerance = tol;
            },

            _setOption: function( key, value ) {
                var exclusions, setter = "_set" + key.charAt( 0 ).toUpperCase() + key.slice( 1 );

                if ( this[ setter ] !== undefined ) {
                    this[ setter ]( value );
                }

                // TODO REMOVE FOR 1.2.1 by moving them out to a default options object
                exclusions = [
                    "initSelector",
                    "closeLinkSelector",
                    "closeLinkEvents",
                    "navigateEvents",
                    "closeEvents",
                    "history",
                    "container"
                ];

                $.mobile.widget.prototype._setOption.apply( this, arguments );
                if ( $.inArray( key, exclusions ) === -1 ) {
                    // Record the option change in the options and in the DOM data-* attributes
                    this.element.attr( "data-" + ( $.mobile.ns || "" ) + ( key.replace( /([A-Z])/, "-$1" ).toLowerCase() ), value );
                }
            },

            // Try and center the overlay over the given coordinates
            _placementCoords: function( desired ) {
                // rectangle within which the popup must fit
                var
                    winCoords = windowCoords(),
                    rc = {
                        x: this._tolerance.l,
                        y: winCoords.y + this._tolerance.t,
                        cx: winCoords.cx - this._tolerance.l - this._tolerance.r,
                        cy: winCoords.cy - this._tolerance.t - this._tolerance.b
                    },
                    menuSize, ret;

                // Clamp the width of the menu before grabbing its size
                this._ui.container.css( "max-width", rc.cx );
                menuSize = {
                    cx: this._ui.container.outerWidth( true ),
                    cy: this._ui.container.outerHeight( true )
                };

                // Center the menu over the desired coordinates, while not going outside
                // the window tolerances. This will center wrt. the window if the popup is too large.
                ret = {
                    x: fitSegmentInsideSegment( rc.cx, menuSize.cx, rc.x, desired.x ),
                    y: fitSegmentInsideSegment( rc.cy, menuSize.cy, rc.y, desired.y )
                };

                // Make sure the top of the menu is visible
                ret.y = Math.max( 0, ret.y );

                // If the height of the menu is smaller than the height of the document
                // align the bottom with the bottom of the document

                // fix for $( document ).height() bug in core 1.7.2.
                var docEl = document.documentElement, docBody = document.body,
                    docHeight = Math.max( docEl.clientHeight, docBody.scrollHeight, docBody.offsetHeight, docEl.scrollHeight, docEl.offsetHeight );

                ret.y -= Math.min( ret.y, Math.max( 0, ret.y + menuSize.cy - docHeight ) );

                return { left: ret.x, top: ret.y };
            },

            _createPrereqs: function( screenPrereq, containerPrereq, whenDone ) {
                var self = this, prereqs;

                // It is important to maintain both the local variable prereqs and self._prereqs. The local variable remains in
                // the closure of the functions which call the callbacks passed in. The comparison between the local variable and
                // self._prereqs is necessary, because once a function has been passed to .animationComplete() it will be called
                // next time an animation completes, even if that's not the animation whose end the function was supposed to catch
                // (for example, if an abort happens during the opening animation, the .animationComplete handler is not called for
                // that animation anymore, but the handler remains attached, so it is called the next time the popup is opened
                // - making it stale. Comparing the local variable prereqs to the widget-level variable self._prereqs ensures that
                // callbacks triggered by a stale .animationComplete will be ignored.

                prereqs = {
                    screen: $.Deferred(),
                    container: $.Deferred()
                };

                prereqs.screen.then( function() {
                    if ( prereqs === self._prereqs ) {
                        screenPrereq();
                    }
                });

                prereqs.container.then( function() {
                    if ( prereqs === self._prereqs ) {
                        containerPrereq();
                    }
                });

                $.when( prereqs.screen, prereqs.container ).done( function() {
                    if ( prereqs === self._prereqs ) {
                        self._prereqs = null;
                        whenDone();
                    }
                });

                self._prereqs = prereqs;
            },

            _animate: function( args ) {
                // NOTE before removing the default animation of the screen
                //      this had an animate callback that would resolve the deferred
                //      now the deferred is resolved immediately
                // TODO remove the dependency on the screen deferred
                this._ui.screen
                    .removeClass( args.classToRemove )
                    .addClass( args.screenClassToAdd );

                args.prereqs.screen.resolve();

                if ( args.transition && args.transition !== "none" ) {
                    if ( args.applyTransition ) {
                        this._applyTransition( args.transition );
                    }
                    if ( this._fallbackTransition ) {
                        this._ui.container
                            .animationComplete( $.proxy( args.prereqs.container, "resolve" ) )
                            .addClass( args.containerClassToAdd )
                            .removeClass( args.classToRemove );
                        return;
                    }
                }
                this._ui.container.removeClass( args.classToRemove );
                args.prereqs.container.resolve();
            },

            // The desired coordinates passed in will be returned untouched if no reference element can be identified via
            // desiredPosition.positionTo. Nevertheless, this function ensures that its return value always contains valid
            // x and y coordinates by specifying the center middle of the window if the coordinates are absent.
            _desiredCoords: function( x, y, positionTo ) {
                var dst = null, offset, winCoords = windowCoords();

                // Establish which element will serve as the reference
                if ( positionTo && positionTo !== "origin" ) {
                    if ( positionTo === "window" ) {
                        x = winCoords.cx / 2 + winCoords.x;
                        y = winCoords.cy / 2 + winCoords.y;
                    } else {
                        try {
                            dst = $( positionTo );
                        } catch( e ) {
                            dst = null;
                        }
                        if ( dst ) {
                            dst.filter( ":visible" );
                            if ( dst.length === 0 ) {
                                dst = null;
                            }
                        }
                    }
                }

                // If an element was found, center over it
                if ( dst ) {
                    offset = dst.offset();
                    x = offset.left + dst.outerWidth() / 2;
                    y = offset.top + dst.outerHeight() / 2;
                }

                // Make sure x and y are valid numbers - center over the window
                if ( $.type( x ) !== "number" || isNaN( x ) ) {
                    x = winCoords.cx / 2 + winCoords.x;
                }
                if ( $.type( y ) !== "number" || isNaN( y ) ) {
                    y = winCoords.cy / 2 + winCoords.y;
                }

                return { x: x, y: y };
            },

            _openPrereqsComplete: function() {
                var self = this;

                self._ui.container.addClass( "ui-popup-active" );
                self._isOpen = true;
                self._resizeScreen();

                // Android appears to trigger the animation complete before the popup
                // is visible. Allowing the stack to unwind before applying focus prevents
                // the "blue flash" of element focus in android 4.0
                setTimeout(function(){
                    self._ui.container.attr( "tabindex", "0" ).focus();
                    self._expectResizeEvent();
                    self._trigger( "afteropen" );
                });
            },

            _open: function( options ) {
                var coords, transition,
                    androidBlacklist = ( function() {
                        var w = window,
                            ua = navigator.userAgent,
                        // Rendering engine is Webkit, and capture major version
                            wkmatch = ua.match( /AppleWebKit\/([0-9\.]+)/ ),
                            wkversion = !!wkmatch && wkmatch[ 1 ],
                            androidmatch = ua.match( /Android (\d+(?:\.\d+))/ ),
                            andversion = !!androidmatch && androidmatch[ 1 ],
                            chromematch = ua.indexOf( "Chrome" ) > -1;

                        // Platform is Android, WebKit version is greater than 534.13 ( Android 3.2.1 ) and not Chrome.
                        if( androidmatch !== null && andversion === "4.0" && wkversion && wkversion > 534.13 && !chromematch ) {
                            return true;
                        }
                        return false;
                    }());

                // Make sure options is defined
                options = ( options || {} );

                // Copy out the transition, because we may be overwriting it later and we don't want to pass that change back to the caller
                transition = options.transition || this.options.transition;

                // Give applications a chance to modify the contents of the container before it appears
                this._trigger( "beforeposition" );

                coords = this._placementCoords( this._desiredCoords( options.x, options.y, options.positionTo || this.options.positionTo || "origin" ) );

                // Count down to triggering "popupafteropen" - we have two prerequisites:
                // 1. The popup window animation completes (container())
                // 2. The screen opacity animation completes (screen())
                this._createPrereqs(
                    $.noop,
                    $.noop,
                    $.proxy( this, "_openPrereqsComplete" ) );

                if ( transition ) {
                    this._currentTransition = transition;
                    this._applyTransition( transition );
                } else {
                    transition = this.options.transition;
                }

                if ( !this.options.theme ) {
                    this._setTheme( this._page.jqmData( "theme" ) || $.mobile.getInheritedTheme( this._page, "c" ) );
                }

                this._ui.screen.removeClass( "ui-screen-hidden" );

                this._ui.container
                    .removeClass( "ui-popup-hidden" )
                    .offset( coords );

                if ( this.options.overlayTheme && androidBlacklist ) {
                    /* TODO:
                     The native browser on Android 4.0.X ("Ice Cream Sandwich") suffers from an issue where the popup overlay appears to be z-indexed
                     above the popup itself when certain other styles exist on the same page -- namely, any element set to `position: fixed` and certain
                     types of input. These issues are reminiscent of previously uncovered bugs in older versions of Android's native browser:
                     https://github.com/scottjehl/Device-Bugs/issues/3

                     This fix closes the following bugs ( I use "closes" with reluctance, and stress that this issue should be revisited as soon as possible ):

                     https://github.com/jquery/jquery-mobile/issues/4816
                     https://github.com/jquery/jquery-mobile/issues/4844
                     https://github.com/jquery/jquery-mobile/issues/4874
                     */

                    // TODO sort out why this._page isn't working
                    this.element.closest( ".ui-page" ).addClass( "ui-popup-open" );
                }
                this._animate({
                    additionalCondition: true,
                    transition: transition,
                    classToRemove: "",
                    screenClassToAdd: "in",
                    containerClassToAdd: "in",
                    applyTransition: false,
                    prereqs: this._prereqs
                });
            },

            _closePrereqScreen: function() {
                this._ui.screen
                    .removeClass( "out" )
                    .addClass( "ui-screen-hidden" );
            },

            _closePrereqContainer: function() {
                this._ui.container
                    .removeClass( "reverse out" )
                    .addClass( "ui-popup-hidden" )
                    .removeAttr( "style" );
            },

            _closePrereqsDone: function() {
                var self = this, opts = self.options;

                self._ui.container.removeAttr( "tabindex" );

                // remove nav bindings if they are still present
                opts.container.unbind( opts.closeEvents );

                // unbind click handlers added when history is disabled
                self.element.undelegate( opts.closeLinkSelector, opts.closeLinkEvents );

                // remove the global mutex for popups
                $.mobile.popup.active = undefined;

                // alert users that the popup is closed
                self._trigger( "afterclose" );
            },

            _close: function( immediate ) {
                this._ui.container.removeClass( "ui-popup-active" );
                this._page.removeClass( "ui-popup-open" );

                this._isOpen = false;

                // Count down to triggering "popupafterclose" - we have two prerequisites:
                // 1. The popup window reverse animation completes (container())
                // 2. The screen opacity animation completes (screen())
                this._createPrereqs(
                    $.proxy( this, "_closePrereqScreen" ),
                    $.proxy( this, "_closePrereqContainer" ),
                    $.proxy( this, "_closePrereqsDone" ) );

                this._animate( {
                    additionalCondition: this._ui.screen.hasClass( "in" ),
                    transition: ( immediate ? "none" : ( this._currentTransition || this.options.transition ) ),
                    classToRemove: "in",
                    screenClassToAdd: "out",
                    containerClassToAdd: "reverse out",
                    applyTransition: true,
                    prereqs: this._prereqs
                });
            },

            _unenhance: function() {
                var self = this;

                // Put the element back to where the placeholder was and remove the "ui-popup" class
                self._setTheme( "none" );
                self.element
                    // Cannot directly insertAfter() - we need to detach() first, because
                    // insertAfter() will do nothing if the payload div was not attached
                    // to the DOM at the time the widget was created, and so the payload
                    // will remain inside the container even after we call insertAfter().
                    // If that happens and we remove the container a few lines below, we
                    // will cause an infinite recursion - #5244
                    .detach()
                    .insertAfter( self._ui.placeholder )
                    .removeClass( "ui-popup ui-overlay-shadow ui-corner-all" );
                self._ui.screen.remove();
                self._ui.container.remove();
                self._ui.placeholder.remove();

                // Unbind handlers that were bound to elements outside self.element (the window, in self case)
                $.each( self._globalHandlers, function( idx, oneSrc ) {
                    $.each( oneSrc.handler, function( eventType, handler ) {
                        oneSrc.src.unbind( eventType, handler );
                    });
                });
            },

            _destroy: function() {
                if ( $.mobile.popup.active === this ) {
                    this.element.one( "popupafterclose", $.proxy( this, "_unenhance" ) );
                    this.close();
                } else {
                    this._unenhance();
                }
            },

            _closePopup: function( e, data ) {
                var parsedDst, toUrl;

                window.scrollTo( 0, this._scrollTop );

                if ( e.type === "pagebeforechange" && data ) {
                    // Determine whether we need to rapid-close the popup, or whether we can
                    // take the time to run the closing transition
                    if ( typeof data.toPage === "string" ) {
                        parsedDst = data.toPage;
                    } else {
                        parsedDst = data.toPage.jqmData( "url" );
                    }
                    parsedDst = $.mobile.path.parseUrl( parsedDst );
                    toUrl = parsedDst.pathname + parsedDst.search + parsedDst.hash;

                    if ( this._myUrl !== toUrl ) {
                        // Going to a different page - close immediately
                        this.options.container.unbind( this.options.closeEvents );
                        this._close( true );
                    } else {
                        this.close();
                        e.preventDefault();
                    }

                    return;
                }

                this._close();
            },

            // any navigation event after a popup is opened should close the popup
            // NOTE the pagebeforechange is bound to catch navigation events that don't
            //      alter the url (eg, dialogs from popups)
            _bindContainerClose: function() {
                var self = this;

                self.options.container
                    .one( self.options.closeEvents, $.proxy( self, "_closePopup" ) );
            },

            // TODO no clear deliniation of what should be here and
            // what should be in _open. Seems to be "visual" vs "history" for now
            open: function( options ) {
                var self = this, opts = this.options, url, hashkey, activePage, currentIsDialog, hasHash, urlHistory;

                // make sure open is idempotent
                if( $.mobile.popup.active ) {
                    return;
                }

                // set the global popup mutex
                $.mobile.popup.active = this;
                this._scrollTop = $( window ).scrollTop();

                // if history alteration is disabled close on navigate events
                // and leave the url as is
                if( !( opts.history ) ) {
                    self._open( options );
                    self._bindContainerClose();

                    // When histoy is disabled we have to grab the data-rel
                    // back link clicks so we can close the popup instead of
                    // relying on history to do it for us
                    self.element
                        .delegate( opts.closeLinkSelector, opts.closeLinkEvents, function( e ) {
                            self._close();

                            // NOTE prevent the browser and navigation handlers from
                            // working with the link's rel=back. This may cause
                            // issues for developers expecting the event to bubble
                            return false;
                        });

                    return;
                }

                // cache some values for min/readability
                hashkey = $.mobile.dialogHashKey;
                activePage = $.mobile.activePage;
                currentIsDialog = activePage.is( ".ui-dialog" );
                this._myUrl = url = $.mobile.urlHistory.getActive().url;
                hasHash = ( url.indexOf( hashkey ) > -1 ) && !currentIsDialog;
                urlHistory = $.mobile.urlHistory;

                if ( hasHash ) {
                    self._open( options );
                    self._bindContainerClose();
                    return;
                }

                url = url + hashkey;

                // Tack on an extra hashkey if this is the first page and we've just reconstructed the initial hash
                if ( urlHistory.activeIndex === 0 && url === urlHistory.initialDst ) {
                    url += hashkey;
                }

                // swallow the the initial navigation event, and bind for the next
                opts.container.one( opts.navigateEvents, function( e ) {
                    e.preventDefault();
                    self._open( options );
                    self._bindContainerClose();
                });

                urlHistory.ignoreNextHashChange = currentIsDialog;

                // Gotta love methods with 1mm args :(
                urlHistory.addNew( url, undefined, undefined, undefined, "dialog" );

                // set the new url with (or without) the new dialog hash key
                $.mobile.path.set( url );
            },

            close: function() {
                // make sure close is idempotent
                if( !$.mobile.popup.active ){
                    return;
                }

                this._scrollTop = $( window ).scrollTop();

                if( this.options.history ) {
                    $.mobile.back();
                } else {
                    this._close();
                }
            }
        });


        // TODO this can be moved inside the widget
        $.mobile.popup.handleLink = function( $link ) {
            var closestPage = $link.closest( ":jqmData(role='page')" ),
                scope = ( ( closestPage.length === 0 ) ? $( "body" ) : closestPage ),
            // NOTE make sure to get only the hash, ie7 (wp7) return the absolute href
            //      in this case ruining the element selection
                popup = $( $.mobile.path.parseUrl($link.attr( "href" )).hash, scope[0] ),
                offset;

            if ( popup.data( "popup" ) ) {
                offset = $link.offset();
                popup.popup( "open", {
                    x: offset.left + $link.outerWidth() / 2,
                    y: offset.top + $link.outerHeight() / 2,
                    transition: $link.jqmData( "transition" ),
                    positionTo: $link.jqmData( "position-to" ),
                    link: $link
                });
            }

            //remove after delay
            setTimeout( function() {
                // Check if we are in a listview
                var $parent = $link.parent().parent();
                if ($parent.hasClass("ui-li")) {
                    $link = $parent.parent();
                }
                $link.removeClass( $.mobile.activeBtnClass );
            }, 300 );
        };

        // TODO move inside _create
        $( document ).bind( "pagebeforechange", function( e, data ) {
            if ( data.options.role === "popup" ) {
                $.mobile.popup.handleLink( data.options.link );
                e.preventDefault();
            }
        });

        $( document ).bind( "pagecreate create", function( e )  {
            $.mobile.popup.prototype.enhanceWithin( e.target, true );
        });

    })( jQuery );

    (function( $ ) {
        var	meta = $( "meta[name=viewport]" ),
            initialContent = meta.attr( "content" ),
            disabledZoom = initialContent + ",maximum-scale=1, user-scalable=no",
            enabledZoom = initialContent + ",maximum-scale=10, user-scalable=yes",
            disabledInitially = /(user-scalable[\s]*=[\s]*no)|(maximum-scale[\s]*=[\s]*1)[$,\s]/.test( initialContent );

        $.mobile.zoom = $.extend( {}, {
            enabled: !disabledInitially,
            locked: false,
            disable: function( lock ) {
                if ( !disabledInitially && !$.mobile.zoom.locked ) {
                    meta.attr( "content", disabledZoom );
                    $.mobile.zoom.enabled = false;
                    $.mobile.zoom.locked = lock || false;
                }
            },
            enable: function( unlock ) {
                if ( !disabledInitially && ( !$.mobile.zoom.locked || unlock === true ) ) {
                    meta.attr( "content", enabledZoom );
                    $.mobile.zoom.enabled = true;
                    $.mobile.zoom.locked = false;
                }
            },
            restore: function() {
                if ( !disabledInitially ) {
                    meta.attr( "content", initialContent );
                    $.mobile.zoom.enabled = true;
                }
            }
        });

    }( jQuery ));

    (function( $, undefined ) {

        $.widget( "mobile.textinput", $.mobile.widget, {
            options: {
                theme: null,
                mini: false,
                // This option defaults to true on iOS devices.
                preventFocusZoom: /iPhone|iPad|iPod/.test( navigator.platform ) && navigator.userAgent.indexOf( "AppleWebKit" ) > -1,
                initSelector: "input[type='text'], input[type='search'], :jqmData(type='search'), input[type='number'], :jqmData(type='number'), input[type='password'], input[type='email'], input[type='url'], input[type='tel'], textarea, input[type='time'], input[type='date'], input[type='month'], input[type='week'], input[type='datetime'], input[type='datetime-local'], input[type='color'], input:not([type])",
                clearSearchButtonText: "clear text",
                disabled: false
            },

            _create: function() {

                var self = this,
                    input = this.element,
                    o = this.options,
                    theme = o.theme || $.mobile.getInheritedTheme( this.element, "c" ),
                    themeclass  = " ui-body-" + theme,
                    miniclass = o.mini ? " ui-mini" : "",
                    focusedEl, clearbtn;

                function toggleClear() {
                    setTimeout( function() {
                        clearbtn.toggleClass( "ui-input-clear-hidden", !input.val() );
                    }, 0 );
                }

                $( "label[for='" + input.attr( "id" ) + "']" ).addClass( "ui-input-text" );

                focusedEl = input.addClass("ui-input-text ui-body-"+ theme );

                // XXX: Temporary workaround for issue 785 (Apple bug 8910589).
                //      Turn off autocorrect and autocomplete on non-iOS 5 devices
                //      since the popup they use can't be dismissed by the user. Note
                //      that we test for the presence of the feature by looking for
                //      the autocorrect property on the input element. We currently
                //      have no test for iOS 5 or newer so we're temporarily using
                //      the touchOverflow support flag for jQM 1.0. Yes, I feel dirty. - jblas
                if ( typeof input[0].autocorrect !== "undefined" && !$.support.touchOverflow ) {
                    // Set the attribute instead of the property just in case there
                    // is code that attempts to make modifications via HTML.
                    input[0].setAttribute( "autocorrect", "off" );
                    input[0].setAttribute( "autocomplete", "off" );
                }


                //"search" input widget
                if ( input.is( "[type='search'],:jqmData(type='search')" ) ) {

                    focusedEl = input.wrap( "<div class='ui-input-search ui-shadow-inset ui-btn-corner-all ui-btn-shadow ui-icon-searchfield" + themeclass + miniclass + "'></div>" ).parent();
                    clearbtn = $( "<a href='#' class='ui-input-clear' title='" + o.clearSearchButtonText + "'>" + o.clearSearchButtonText + "</a>" )
                        .bind('click', function( event ) {
                            input
                                .val( "" )
                                .focus()
                                .trigger( "change" );
                            clearbtn.addClass( "ui-input-clear-hidden" );
                            event.preventDefault();
                        })
                        .appendTo( focusedEl )
                        .buttonMarkup({
                            icon: "delete",
                            iconpos: "notext",
                            corners: true,
                            shadow: true,
                            mini: o.mini
                        });

                    toggleClear();

                    input.bind( 'paste cut keyup focus change blur', toggleClear );

                } else {
                    input.addClass( "ui-corner-all ui-shadow-inset" + themeclass + miniclass );
                }

                input.focus(function() {
                    focusedEl.addClass( $.mobile.focusClass );
                })
                    .blur(function() {
                        focusedEl.removeClass( $.mobile.focusClass );
                    })
                    // In many situations, iOS will zoom into the select upon tap, this prevents that from happening
                    .bind( "focus", function() {
                        if ( o.preventFocusZoom ) {
                            $.mobile.zoom.disable( true );
                        }
                    })
                    .bind( "blur", function() {
                        if ( o.preventFocusZoom ) {
                            $.mobile.zoom.enable( true );
                        }
                    });

                // Autogrow
                if ( input.is( "textarea" ) ) {
                    var extraLineHeight = 15,
                        keyupTimeoutBuffer = 100,
                        keyupTimeout;

                    this._keyup = function() {
                        var scrollHeight = input[ 0 ].scrollHeight,
                            clientHeight = input[ 0 ].clientHeight;

                        if ( clientHeight < scrollHeight ) {
                            input.height(scrollHeight + extraLineHeight);
                        }
                    };

                    input.keyup(function() {
                        clearTimeout( keyupTimeout );
                        keyupTimeout = setTimeout( self._keyup, keyupTimeoutBuffer );
                    });

                    // binding to pagechange here ensures that for pages loaded via
                    // ajax the height is recalculated without user input
                    this._on( $(document), {"pagechange": "_keyup" });

                    // Issue 509: the browser is not providing scrollHeight properly until the styles load
                    if ( $.trim( input.val() ) ) {
                        // bind to the window load to make sure the height is calculated based on BOTH
                        // the DOM and CSS
                        this._on( $(window), {"load": "_keyup"});
                    }
                }
                if ( input.attr( "disabled" ) ) {
                    this.disable();
                }
            },

            disable: function() {
                var $el;
                if ( this.element.attr( "disabled", true ).is( "[type='search'], :jqmData(type='search')" ) ) {
                    $el = this.element.parent();
                } else {
                    $el = this.element;
                }
                $el.addClass( "ui-disabled" );
                return this._setOption( "disabled", true );
            },

            enable: function() {
                var $el;

                // TODO using more than one line of code is acceptable ;)
                if ( this.element.attr( "disabled", false ).is( "[type='search'], :jqmData(type='search')" ) ) {
                    $el = this.element.parent();
                } else {
                    $el = this.element;
                }
                $el.removeClass( "ui-disabled" );
                return this._setOption( "disabled", false );
            }
        });

//auto self-init widgets
        $( document ).bind( "pagecreate create", function( e ) {
            $.mobile.textinput.prototype.enhanceWithin( e.target, true );
        });

    })( jQuery );

    (function( $, undefined ) {

        $.mobile.listview.prototype.options.filter = false;
        $.mobile.listview.prototype.options.filterPlaceholder = "Filter items...";
        $.mobile.listview.prototype.options.filterTheme = "c";
// TODO rename callback/deprecate and default to the item itself as the first argument
        var defaultFilterCallback = function( text, searchValue, item ) {
            return text.toString().toLowerCase().indexOf( searchValue ) === -1;
        };

        $.mobile.listview.prototype.options.filterCallback = defaultFilterCallback;

        $( document ).delegate( "ul, ol", "listviewcreate", function() {

            var list = $( this ),
                listview = list.data( "listview" );

            if ( !listview.options.filter ) {
                return;
            }

            var wrapper = $( "<form>", {
                    "class": "ui-listview-filter ui-bar-" + listview.options.filterTheme,
                    "role": "search"
                }).submit( function( e ) {
                        e.preventDefault();
                        search.blur();
                    }),
                search = $( "<input>", {
                    placeholder: listview.options.filterPlaceholder
                })
                    .attr( "data-" + $.mobile.ns + "type", "search" )
                    .jqmData( "lastval", "" )
                    .bind( "keyup change", function() {

                        var $this = $( this ),
                            val = this.value.toLowerCase(),
                            listItems = null,
                            lastval = $this.jqmData( "lastval" ) + "",
                            childItems = false,
                            itemtext = "",
                            item,
                        // Check if a custom filter callback applies
                            isCustomFilterCallback = listview.options.filterCallback !== defaultFilterCallback;

                        listview._trigger( "beforefilter", "beforefilter", { input: this } );

                        // Change val as lastval for next execution
                        $this.jqmData( "lastval" , val );
                        if ( isCustomFilterCallback || val.length < lastval.length || val.indexOf( lastval ) !== 0 ) {

                            // Custom filter callback applies or removed chars or pasted something totally different, check all items
                            listItems = list.children();
                        } else {

                            // Only chars added, not removed, only use visible subset
                            listItems = list.children( ":not(.ui-screen-hidden)" );
                        }

                        if ( val ) {

                            // This handles hiding regular rows without the text we search for
                            // and any list dividers without regular rows shown under it

                            for ( var i = listItems.length - 1; i >= 0; i-- ) {
                                item = $( listItems[ i ] );
                                itemtext = item.jqmData( "filtertext" ) || item.text();

                                if ( item.is( "li:jqmData(role=list-divider)" ) ) {

                                    item.toggleClass( "ui-filter-hidequeue" , !childItems );

                                    // New bucket!
                                    childItems = false;

                                } else if ( listview.options.filterCallback( itemtext, val, item ) ) {

                                    //mark to be hidden
                                    item.toggleClass( "ui-filter-hidequeue" , true );
                                } else {

                                    // There's a shown item in the bucket
                                    childItems = true;
                                }
                            }

                            // Show items, not marked to be hidden
                            listItems
                                .filter( ":not(.ui-filter-hidequeue)" )
                                .toggleClass( "ui-screen-hidden", false );

                            // Hide items, marked to be hidden
                            listItems
                                .filter( ".ui-filter-hidequeue" )
                                .toggleClass( "ui-screen-hidden", true )
                                .toggleClass( "ui-filter-hidequeue", false );

                        } else {

                            //filtervalue is empty => show all
                            listItems.toggleClass( "ui-screen-hidden", false );
                        }
                        listview._refreshCorners();
                    })
                    .appendTo( wrapper )
                    .textinput();

            if ( listview.options.inset ) {
                wrapper.addClass( "ui-listview-filter-inset" );
            }

            wrapper.bind( "submit", function() {
                return false;
            })
                .insertBefore( list );
        });

    })( jQuery );

    (function( $, undefined ) {

        $.widget( "mobile.slider", $.mobile.widget, {
            options: {
                theme: null,
                trackTheme: null,
                disabled: false,
                initSelector: "input[type='range'], :jqmData(type='range'), :jqmData(role='slider')",
                mini: false
            },

            _create: function() {

                // TODO: Each of these should have comments explain what they're for
                var self = this,

                    control = this.element,

                    parentTheme = $.mobile.getInheritedTheme( control, "c" ),

                    theme = this.options.theme || parentTheme,

                    trackTheme = this.options.trackTheme || parentTheme,

                    cType = control[ 0 ].nodeName.toLowerCase(),

                    selectClass = ( cType === "select" ) ? "ui-slider-switch" : "",

                    controlID = control.attr( "id" ),

                    $label = $( "[for='" + controlID + "']" ),

                    labelID = $label.attr( "id" ) || controlID + "-label",

                    label = $label.attr( "id", labelID ),

                    val = function() {
                        return  cType === "input"  ? parseFloat( control.val() ) : control[0].selectedIndex;
                    },

                    min =  cType === "input" ? parseFloat( control.attr( "min" ) ) : 0,

                    max =  cType === "input" ? parseFloat( control.attr( "max" ) ) : control.find( "option" ).length-1,

                    step = window.parseFloat( control.attr( "step" ) || 1 ),

                    inlineClass = ( this.options.inline || control.jqmData( "inline" ) === true ) ? " ui-slider-inline" : "",

                    miniClass = ( this.options.mini || control.jqmData( "mini" ) ) ? " ui-slider-mini" : "",


                    domHandle = document.createElement( 'a' ),
                    handle = $( domHandle ),
                    domSlider = document.createElement( 'div' ),
                    slider = $( domSlider ),

                    valuebg = control.jqmData( "highlight" ) && cType !== "select" ? (function() {
                        var bg = document.createElement('div');
                        bg.className = 'ui-slider-bg ' + $.mobile.activeBtnClass + ' ui-btn-corner-all';
                        return $( bg ).prependTo( slider );
                    })() : false,

                    options;

                this._type = cType;

                domHandle.setAttribute( 'href', "#" );
                domSlider.setAttribute('role','application');
                domSlider.className = ['ui-slider ',selectClass," ui-btn-down-",trackTheme,' ui-btn-corner-all', inlineClass, miniClass].join( "" );
                domHandle.className = 'ui-slider-handle';
                domSlider.appendChild( domHandle );

                handle.buttonMarkup({ corners: true, theme: theme, shadow: true })
                    .attr({
                        "role": "slider",
                        "aria-valuemin": min,
                        "aria-valuemax": max,
                        "aria-valuenow": val(),
                        "aria-valuetext": val(),
                        "title": val(),
                        "aria-labelledby": labelID
                    });

                $.extend( this, {
                    slider: slider,
                    handle: handle,
                    valuebg: valuebg,
                    dragging: false,
                    beforeStart: null,
                    userModified: false,
                    mouseMoved: false
                });

                if ( cType === "select" ) {
                    var wrapper = document.createElement('div');
                    wrapper.className = 'ui-slider-inneroffset';

                    for ( var j = 0,length = domSlider.childNodes.length;j < length;j++ ) {
                        wrapper.appendChild( domSlider.childNodes[j] );
                    }

                    domSlider.appendChild( wrapper );

                    // slider.wrapInner( "<div class='ui-slider-inneroffset'></div>" );

                    // make the handle move with a smooth transition
                    handle.addClass( "ui-slider-handle-snapping" );

                    options = control.find( "option" );

                    for ( var i = 0, optionsCount = options.length; i < optionsCount; i++ ) {
                        var side = !i ? "b" : "a",
                            sliderTheme = !i ? " ui-btn-down-" + trackTheme : ( " " + $.mobile.activeBtnClass ),
                            sliderLabel = document.createElement( 'div' ),
                            sliderImg = document.createElement( 'span' );

                        sliderImg.className = ['ui-slider-label ui-slider-label-',side,sliderTheme," ui-btn-corner-all"].join( "" );
                        sliderImg.setAttribute('role','img');
                        sliderImg.appendChild( document.createTextNode( options[i].innerHTML ) );
                        $(sliderImg).prependTo( slider );
                    }

                    self._labels = $( ".ui-slider-label", slider );

                }

                label.addClass( "ui-slider" );

                // monitor the input for updated values
                control.addClass( cType === "input" ? "ui-slider-input" : "ui-slider-switch" )
                    .change(function() {
                        // if the user dragged the handle, the "change" event was triggered from inside refresh(); don't call refresh() again
                        if ( !self.mouseMoved ) {
                            self.refresh( val(), true );
                        }
                    })
                    .keyup(function() { // necessary?
                        self.refresh( val(), true, true );
                    })
                    .blur(function() {
                        self.refresh( val(), true );
                    });

                this._preventDocumentDrag = function( event ) {
                    // NOTE: we don't do this in refresh because we still want to
                    //       support programmatic alteration of disabled inputs
                    if ( self.dragging && !self.options.disabled ) {

                        // self.mouseMoved must be updated before refresh() because it will be used in the control "change" event
                        self.mouseMoved = true;

                        if ( cType === "select" ) {
                            // make the handle move in sync with the mouse
                            handle.removeClass( "ui-slider-handle-snapping" );
                        }

                        self.refresh( event );

                        // only after refresh() you can calculate self.userModified
                        self.userModified = self.beforeStart !== control[0].selectedIndex;
                        return false;
                    }
                }

                this._on( $( document ), { "vmousemove": this._preventDocumentDrag });

                // it appears the clicking the up and down buttons in chrome on
                // range/number inputs doesn't trigger a change until the field is
                // blurred. Here we check thif the value has changed and refresh
                control.bind( "vmouseup", $.proxy( self._checkedRefresh, self));

                slider.bind( "vmousedown", function( event ) {
                    // NOTE: we don't do this in refresh because we still want to
                    //       support programmatic alteration of disabled inputs
                    if ( self.options.disabled ) {
                        return false;
                    }

                    self.dragging = true;
                    self.userModified = false;
                    self.mouseMoved = false;

                    if ( cType === "select" ) {
                        self.beforeStart = control[0].selectedIndex;
                    }

                    self.refresh( event );
                    self._trigger( "start" );
                    return false;
                })
                    .bind( "vclick", false );

                this._sliderMouseUp = function() {
                    if ( self.dragging ) {
                        self.dragging = false;

                        if ( cType === "select") {
                            // make the handle move with a smooth transition
                            handle.addClass( "ui-slider-handle-snapping" );

                            if ( self.mouseMoved ) {
                                // this is a drag, change the value only if user dragged enough
                                if ( self.userModified ) {
                                    self.refresh( self.beforeStart === 0 ? 1 : 0 );
                                }
                                else {
                                    self.refresh( self.beforeStart );
                                }
                            }
                            else {
                                // this is just a click, change the value
                                self.refresh( self.beforeStart === 0 ? 1 : 0 );
                            }
                        }

                        self.mouseMoved = false;
                        self._trigger( "stop" );
                        return false;
                    }
                };

                this._on( slider.add( document ), { "vmouseup": this._sliderMouseUp });
                slider.insertAfter( control );

                // Only add focus class to toggle switch, sliders get it automatically from ui-btn
                if ( cType === 'select' ) {
                    this.handle.bind({
                        focus: function() {
                            slider.addClass( $.mobile.focusClass );
                        },

                        blur: function() {
                            slider.removeClass( $.mobile.focusClass );
                        }
                    });
                }

                this.handle.bind({
                    // NOTE force focus on handle
                    vmousedown: function() {
                        $( this ).focus();
                    },

                    vclick: false,

                    keydown: function( event ) {
                        var index = val();

                        if ( self.options.disabled ) {
                            return;
                        }

                        // In all cases prevent the default and mark the handle as active
                        switch ( event.keyCode ) {
                            case $.mobile.keyCode.HOME:
                            case $.mobile.keyCode.END:
                            case $.mobile.keyCode.PAGE_UP:
                            case $.mobile.keyCode.PAGE_DOWN:
                            case $.mobile.keyCode.UP:
                            case $.mobile.keyCode.RIGHT:
                            case $.mobile.keyCode.DOWN:
                            case $.mobile.keyCode.LEFT:
                                event.preventDefault();

                                if ( !self._keySliding ) {
                                    self._keySliding = true;
                                    $( this ).addClass( "ui-state-active" );
                                }
                                break;
                        }

                        // move the slider according to the keypress
                        switch ( event.keyCode ) {
                            case $.mobile.keyCode.HOME:
                                self.refresh( min );
                                break;
                            case $.mobile.keyCode.END:
                                self.refresh( max );
                                break;
                            case $.mobile.keyCode.PAGE_UP:
                            case $.mobile.keyCode.UP:
                            case $.mobile.keyCode.RIGHT:
                                self.refresh( index + step );
                                break;
                            case $.mobile.keyCode.PAGE_DOWN:
                            case $.mobile.keyCode.DOWN:
                            case $.mobile.keyCode.LEFT:
                                self.refresh( index - step );
                                break;
                        }
                    }, // remove active mark

                    keyup: function( event ) {
                        if ( self._keySliding ) {
                            self._keySliding = false;
                            $( this ).removeClass( "ui-state-active" );
                        }
                    }
                });

                if ( this._handleFormReset ) {
                    this._handleFormReset();
                }
                this.refresh( undefined, undefined, true );
            },

            _checkedRefresh: function() {
                if( this.value != this._value() ){
                    this.refresh( this._value() );
                }
            },

            _value: function() {
                return  this._type === "input" ?
                    parseFloat( this.element.val() ) : this.element[0].selectedIndex;
            },


            _reset: function() {
                this.refresh( undefined, false, true );
            },

            refresh: function( val, isfromControl, preventInputUpdate ) {

                // NOTE: we don't return here because we want to support programmatic
                //       alteration of the input value, which should still update the slider
                if ( this.options.disabled || this.element.attr('disabled')) {
                    this.disable();
                }

                // set the stored value for comparison later
                this.value = this._value();

                var control = this.element, percent,
                    cType = control[0].nodeName.toLowerCase(),
                    min = cType === "input" ? parseFloat( control.attr( "min" ) ) : 0,
                    max = cType === "input" ? parseFloat( control.attr( "max" ) ) : control.find( "option" ).length - 1,
                    step = ( cType === "input" && parseFloat( control.attr( "step" ) ) > 0 ) ? parseFloat( control.attr( "step" ) ) : 1;

                if ( typeof val === "object" ) {
                    var data = val,
                    // a slight tolerance helped get to the ends of the slider
                        tol = 8;
                    if ( !this.dragging ||
                        data.pageX < this.slider.offset().left - tol ||
                        data.pageX > this.slider.offset().left + this.slider.width() + tol ) {
                        return;
                    }
                    percent = Math.round( ( ( data.pageX - this.slider.offset().left ) / this.slider.width() ) * 100 );
                } else {
                    if ( val == null ) {
                        val = cType === "input" ? parseFloat( control.val() || 0 ) : control[0].selectedIndex;
                    }
                    percent = ( parseFloat( val ) - min ) / ( max - min ) * 100;
                }

                if ( isNaN( percent ) ) {
                    return;
                }

                if ( percent < 0 ) {
                    percent = 0;
                }

                if ( percent > 100 ) {
                    percent = 100;
                }

                var newval = ( percent / 100 ) * ( max - min ) + min;

                //from jQuery UI slider, the following source will round to the nearest step
                var valModStep = ( newval - min ) % step;
                var alignValue = newval - valModStep;

                if ( Math.abs( valModStep ) * 2 >= step ) {
                    alignValue += ( valModStep > 0 ) ? step : ( -step );
                }
                // Since JavaScript has problems with large floats, round
                // the final value to 5 digits after the decimal point (see jQueryUI: #4124)
                newval = parseFloat( alignValue.toFixed(5) );

                if ( newval < min ) {
                    newval = min;
                }

                if ( newval > max ) {
                    newval = max;
                }

                this.handle.css( "left", percent + "%" );
                this.handle.attr( {
                    "aria-valuenow": cType === "input" ? newval : control.find( "option" ).eq( newval ).attr( "value" ),
                    "aria-valuetext": cType === "input" ? newval : control.find( "option" ).eq( newval ).getEncodedText(),
                    title: cType === "input" ? newval : control.find( "option" ).eq( newval ).getEncodedText()
                });

                if ( this.valuebg ) {
                    this.valuebg.css( "width", percent + "%" );
                }

                // drag the label widths
                if ( this._labels ) {
                    var handlePercent = this.handle.width() / this.slider.width() * 100,
                        aPercent = percent && handlePercent + ( 100 - handlePercent ) * percent / 100,
                        bPercent = percent === 100 ? 0 : Math.min( handlePercent + 100 - aPercent, 100 );

                    this._labels.each(function() {
                        var ab = $( this ).is( ".ui-slider-label-a" );
                        $( this ).width( ( ab ? aPercent : bPercent  ) + "%" );
                    });
                }

                if ( !preventInputUpdate ) {
                    var valueChanged = false;

                    // update control"s value
                    if ( cType === "input" ) {
                        valueChanged = control.val() !== newval;
                        control.val( newval );
                    } else {
                        valueChanged = control[ 0 ].selectedIndex !== newval;
                        control[ 0 ].selectedIndex = newval;
                    }
                    if ( !isfromControl && valueChanged ) {
                        control.trigger( "change" );
                    }
                }
            },

            enable: function() {
                this.element.attr( "disabled", false );
                this.slider.removeClass( "ui-disabled" ).attr( "aria-disabled", false );
                return this._setOption( "disabled", false );
            },

            disable: function() {
                this.element.attr( "disabled", true );
                this.slider.addClass( "ui-disabled" ).attr( "aria-disabled", true );
                return this._setOption( "disabled", true );
            }

        });

        $.widget( "mobile.slider", $.mobile.slider, $.mobile.behaviors.formReset );

// FIXME: Move the declaration of widgetEventPrefix back to the top of the
// initial declaration of the slider widget once we start using a version of
// the widget factory that includes a fix for http://bugs.jqueryui.com/ticket/8724
        $.widget( "mobile.slider", $.mobile.slider, { widgetEventPrefix: "slide" } );

//auto self-init widgets
        $( document ).bind( "pagecreate create", function( e ) {
            $.mobile.slider.prototype.enhanceWithin( e.target, true );
        });

    })( jQuery );

    (function( $, undefined ) {

        $.widget( "mobile.selectmenu", $.mobile.widget, {
            options: {
                theme: null,
                disabled: false,
                icon: "arrow-d",
                iconpos: "right",
                inline: false,
                corners: true,
                shadow: true,
                iconshadow: true,
                overlayTheme: "a",
                hidePlaceholderMenuItems: true,
                closeText: "Close",
                nativeMenu: true,
                // This option defaults to true on iOS devices.
                preventFocusZoom: /iPhone|iPad|iPod/.test( navigator.platform ) && navigator.userAgent.indexOf( "AppleWebKit" ) > -1,
                initSelector: "select:not( :jqmData(role='slider') )",
                mini: false
            },

            _button: function() {
                return $( "<div/>" );
            },

            _setDisabled: function( value ) {
                this.element.attr( "disabled", value );
                this.button.attr( "aria-disabled", value );
                return this._setOption( "disabled", value );
            },

            _focusButton : function() {
                var self = this;

                setTimeout( function() {
                    self.button.focus();
                }, 40);
            },

            _selectOptions: function() {
                return this.select.find( "option" );
            },

            // setup items that are generally necessary for select menu extension
            _preExtension: function() {
                var classes = "";
                // TODO: Post 1.1--once we have time to test thoroughly--any classes manually applied to the original element should be carried over to the enhanced element, with an `-enhanced` suffix. See https://github.com/jquery/jquery-mobile/issues/3577
                /* if ( $el[0].className.length ) {
                 classes = $el[0].className;
                 } */
                if ( !!~this.element[0].className.indexOf( "ui-btn-left" ) ) {
                    classes =  " ui-btn-left";
                }

                if (  !!~this.element[0].className.indexOf( "ui-btn-right" ) ) {
                    classes = " ui-btn-right";
                }

                this.select = this.element.wrap( "<div class='ui-select" + classes + "'>" );
                this.selectID  = this.select.attr( "id" );
                this.label = $( "label[for='"+ this.selectID +"']" ).addClass( "ui-select" );
                this.isMultiple = this.select[ 0 ].multiple;
                if ( !this.options.theme ) {
                    this.options.theme = $.mobile.getInheritedTheme( this.select, "c" );
                }
            },

            _destroy: function() {
                var wrapper = this.element.parents( ".ui-select" );
                if ( wrapper.length > 0 ) {
                    this.element.insertAfter( wrapper );
                    wrapper.remove();
                }
            },

            _create: function() {
                this._preExtension();

                // Allows for extension of the native select for custom selects and other plugins
                // see select.custom for example extension
                // TODO explore plugin registration
                this._trigger( "beforeCreate" );

                this.button = this._button();

                var self = this,

                    options = this.options,

                    inline = options.inline || this.select.jqmData( "inline" ),
                    mini = options.mini || this.select.jqmData( "mini" ),
                    iconpos = options.icon ? ( options.iconpos || this.select.jqmData( "iconpos" ) ) : false,

                // IE throws an exception at options.item() function when
                // there is no selected item
                // select first in this case
                    selectedIndex = this.select[ 0 ].selectedIndex === -1 ? 0 : this.select[ 0 ].selectedIndex,

                // TODO values buttonId and menuId are undefined here
                    button = this.button
                        .insertBefore( this.select )
                        .buttonMarkup( {
                            theme: options.theme,
                            icon: options.icon,
                            iconpos: iconpos,
                            inline: inline,
                            corners: options.corners,
                            shadow: options.shadow,
                            iconshadow: options.iconshadow,
                            mini: mini
                        });

                this.setButtonText();

                // Opera does not properly support opacity on select elements
                // In Mini, it hides the element, but not its text
                // On the desktop,it seems to do the opposite
                // for these reasons, using the nativeMenu option results in a full native select in Opera
                if ( options.nativeMenu && window.opera && window.opera.version ) {
                    button.addClass( "ui-select-nativeonly" );
                }

                // Add counter for multi selects
                if ( this.isMultiple ) {
                    this.buttonCount = $( "<span>" )
                        .addClass( "ui-li-count ui-btn-up-c ui-btn-corner-all" )
                        .hide()
                        .appendTo( button.addClass('ui-li-has-count') );
                }

                // Disable if specified
                if ( options.disabled || this.element.attr('disabled')) {
                    this.disable();
                }

                // Events on native select
                this.select.change(function() {
                    self.refresh();
                });

                if ( this._handleFormReset ) {
                    this._handleFormReset();
                }
                this.build();
            },

            build: function() {
                var self = this;

                this.select
                    .appendTo( self.button )
                    .bind( "vmousedown", function() {
                        // Add active class to button
                        self.button.addClass( $.mobile.activeBtnClass );
                    })
                    .bind( "focus", function() {
                        self.button.addClass( $.mobile.focusClass );
                    })
                    .bind( "blur", function() {
                        self.button.removeClass( $.mobile.focusClass );
                    })
                    .bind( "focus vmouseover", function() {
                        self.button.trigger( "vmouseover" );
                    })
                    .bind( "vmousemove", function() {
                        // Remove active class on scroll/touchmove
                        self.button.removeClass( $.mobile.activeBtnClass );
                    })
                    .bind( "change blur vmouseout", function() {
                        self.button.trigger( "vmouseout" )
                            .removeClass( $.mobile.activeBtnClass );
                    })
                    .bind( "change blur", function() {
                        self.button.removeClass( "ui-btn-down-" + self.options.theme );
                    });

                // In many situations, iOS will zoom into the select upon tap, this prevents that from happening
                self.button.bind( "vmousedown", function() {
                    if ( self.options.preventFocusZoom ) {
                        $.mobile.zoom.disable( true );
                    }
                });
                self.label.bind( "click focus", function() {
                    if ( self.options.preventFocusZoom ) {
                        $.mobile.zoom.disable( true );
                    }
                });
                self.select.bind( "focus", function() {
                    if ( self.options.preventFocusZoom ) {
                        $.mobile.zoom.disable( true );
                    }
                });
                self.button.bind( "mouseup", function() {
                    if ( self.options.preventFocusZoom ) {
                        setTimeout(function() {
                            $.mobile.zoom.enable( true );
                        }, 0 );
                    }
                });
                self.select.bind( "blur", function() {
                    if ( self.options.preventFocusZoom ) {
                        $.mobile.zoom.enable( true );
                    }
                });

            },

            selected: function() {
                return this._selectOptions().filter( ":selected" );
            },

            selectedIndices: function() {
                var self = this;

                return this.selected().map(function() {
                    return self._selectOptions().index( this );
                }).get();
            },

            setButtonText: function() {
                var self = this,
                    selected = this.selected(),
                    text = this.placeholder,
                    span = $( document.createElement( "span" ) );

                this.button.find( ".ui-btn-text" ).html(function() {
                    if ( selected.length ) {
                        text = selected.map(function() {
                            return $( this ).text();
                        }).get().join( ", " );
                    } else {
                        text = self.placeholder;
                    }

                    // TODO possibly aggregate multiple select option classes
                    return span.text( text )
                        .addClass( self.select.attr( "class" ) )
                        .addClass( selected.attr( "class" ) );
                });
            },

            setButtonCount: function() {
                var selected = this.selected();

                // multiple count inside button
                if ( this.isMultiple ) {
                    this.buttonCount[ selected.length > 1 ? "show" : "hide" ]().text( selected.length );
                }
            },

            _reset: function() {
                this.refresh();
            },

            refresh: function() {
                this.setButtonText();
                this.setButtonCount();
            },

            // open and close preserved in native selects
            // to simplify users code when looping over selects
            open: $.noop,
            close: $.noop,

            disable: function() {
                this._setDisabled( true );
                this.button.addClass( "ui-disabled" );
            },

            enable: function() {
                this._setDisabled( false );
                this.button.removeClass( "ui-disabled" );
            }
        });

        $.widget( "mobile.selectmenu", $.mobile.selectmenu, $.mobile.behaviors.formReset );

//auto self-init widgets
        $( document ).bind( "pagecreate create", function( e ) {
            $.mobile.selectmenu.prototype.enhanceWithin( e.target, true );
        });
    })( jQuery );

    /*
     * custom "selectmenu" plugin
     */

    (function( $, undefined ) {
        var extendSelect = function( widget ) {

            var select = widget.select,
                origDestroy = widget._destroy,
                selectID  = widget.selectID,
                label = widget.label,
                thisPage = widget.select.closest( ".ui-page" ),
                selectOptions = widget._selectOptions(),
                isMultiple = widget.isMultiple = widget.select[ 0 ].multiple,
                buttonId = selectID + "-button",
                menuId = selectID + "-menu",
                menuPage = $( "<div data-" + $.mobile.ns + "role='dialog' data-" +$.mobile.ns + "theme='"+ widget.options.theme +"' data-" +$.mobile.ns + "overlay-theme='"+ widget.options.overlayTheme +"'>" +
                    "<div data-" + $.mobile.ns + "role='header'>" +
                    "<div class='ui-title'>" + label.getEncodedText() + "</div>"+
                    "</div>"+
                    "<div data-" + $.mobile.ns + "role='content'></div>"+
                    "</div>" ),

                listbox =  $( "<div>", { "class": "ui-selectmenu" } ).insertAfter( widget.select ).popup( { theme: widget.options.overlayTheme } ),

                list = $( "<ul>", {
                    "class": "ui-selectmenu-list",
                    "id": menuId,
                    "role": "listbox",
                    "aria-labelledby": buttonId
                }).attr( "data-" + $.mobile.ns + "theme", widget.options.theme ).appendTo( listbox ),

                header = $( "<div>", {
                    "class": "ui-header ui-bar-" + widget.options.theme
                }).prependTo( listbox ),

                headerTitle = $( "<h1>", {
                    "class": "ui-title"
                }).appendTo( header ),

                menuPageContent,
                menuPageClose,
                headerClose;

            if ( widget.isMultiple ) {
                headerClose = $( "<a>", {
                    "text": widget.options.closeText,
                    "href": "#",
                    "class": "ui-btn-left"
                }).attr( "data-" + $.mobile.ns + "iconpos", "notext" ).attr( "data-" + $.mobile.ns + "icon", "delete" ).appendTo( header ).buttonMarkup();
            }

            $.extend( widget, {
                select: widget.select,
                selectID: selectID,
                buttonId: buttonId,
                menuId: menuId,
                thisPage: thisPage,
                menuPage: menuPage,
                label: label,
                selectOptions: selectOptions,
                isMultiple: isMultiple,
                theme: widget.options.theme,
                listbox: listbox,
                list: list,
                header: header,
                headerTitle: headerTitle,
                headerClose: headerClose,
                menuPageContent: menuPageContent,
                menuPageClose: menuPageClose,
                placeholder: "",

                build: function() {
                    var self = this;

                    // Create list from select, update state
                    self.refresh();

                    if ( self._origTabIndex === undefined ) {
                        self._origTabIndex = self.select.attr( "tabindex" );
                        // Map undefined to false, because self._origTabIndex === undefined
                        // indicates that we have not yet checked whether the select has
                        // originally had a tabindex attribute, whereas false indicates that
                        // we have checked the select for such an attribute, and have found
                        // none present.
                        if ( self._origTabIndex === undefined ) {
                            self._origTabIndex = false;
                        }
                    }
                    self.select.attr( "tabindex", "-1" ).focus(function() {
                        $( this ).blur();
                        self.button.focus();
                    });

                    // Button events
                    self.button.bind( "vclick keydown" , function( event ) {
                        if (event.type === "vclick" ||
                            event.keyCode && (event.keyCode === $.mobile.keyCode.ENTER ||
                                event.keyCode === $.mobile.keyCode.SPACE)) {

                            self.open();
                            event.preventDefault();
                        }
                    });

                    // Events for list items
                    self.list.attr( "role", "listbox" )
                        .bind( "focusin", function( e ) {
                            $( e.target )
                                .attr( "tabindex", "0" )
                                .trigger( "vmouseover" );

                        })
                        .bind( "focusout", function( e ) {
                            $( e.target )
                                .attr( "tabindex", "-1" )
                                .trigger( "vmouseout" );
                        })
                        .delegate( "li:not(.ui-disabled, .ui-li-divider)", "click", function( event ) {

                            // index of option tag to be selected
                            var oldIndex = self.select[ 0 ].selectedIndex,
                                newIndex = self.list.find( "li:not(.ui-li-divider)" ).index( this ),
                                option = self._selectOptions().eq( newIndex )[ 0 ];

                            // toggle selected status on the tag for multi selects
                            option.selected = self.isMultiple ? !option.selected : true;

                            // toggle checkbox class for multiple selects
                            if ( self.isMultiple ) {
                                $( this ).find( ".ui-icon" )
                                    .toggleClass( "ui-icon-checkbox-on", option.selected )
                                    .toggleClass( "ui-icon-checkbox-off", !option.selected );
                            }

                            // trigger change if value changed
                            if ( self.isMultiple || oldIndex !== newIndex ) {
                                self.select.trigger( "change" );
                            }

                            // hide custom select for single selects only - otherwise focus clicked item
                            // We need to grab the clicked item the hard way, because the list may have been rebuilt
                            if ( self.isMultiple ) {
                                self.list.find( "li:not(.ui-li-divider)" ).eq( newIndex )
                                    .addClass( "ui-btn-down-" + widget.options.theme ).find( "a" ).first().focus();
                            }
                            else {
                                self.close();
                            }

                            event.preventDefault();
                        })
                        .keydown(function( event ) {  //keyboard events for menu items
                            var target = $( event.target ),
                                li = target.closest( "li" ),
                                prev, next;

                            // switch logic based on which key was pressed
                            switch ( event.keyCode ) {
                                // up or left arrow keys
                                case 38:
                                    prev = li.prev().not( ".ui-selectmenu-placeholder" );

                                    if ( prev.is( ".ui-li-divider" ) ) {
                                        prev = prev.prev();
                                    }

                                    // if there's a previous option, focus it
                                    if ( prev.length ) {
                                        target
                                            .blur()
                                            .attr( "tabindex", "-1" );

                                        prev.addClass( "ui-btn-down-" + widget.options.theme ).find( "a" ).first().focus();
                                    }

                                    return false;
                                // down or right arrow keys
                                case 40:
                                    next = li.next();

                                    if ( next.is( ".ui-li-divider" ) ) {
                                        next = next.next();
                                    }

                                    // if there's a next option, focus it
                                    if ( next.length ) {
                                        target
                                            .blur()
                                            .attr( "tabindex", "-1" );

                                        next.addClass( "ui-btn-down-" + widget.options.theme ).find( "a" ).first().focus();
                                    }

                                    return false;
                                // If enter or space is pressed, trigger click
                                case 13:
                                case 32:
                                    target.trigger( "click" );

                                    return false;
                            }
                        });

                    // button refocus ensures proper height calculation
                    // by removing the inline style and ensuring page inclusion
                    self.menuPage.bind( "pagehide", function() {
                        self.list.appendTo( self.listbox );
                        self._focusButton();

                        // TODO centralize page removal binding / handling in the page plugin.
                        // Suggestion from @jblas to do refcounting
                        //
                        // TODO extremely confusing dependency on the open method where the pagehide.remove
                        // bindings are stripped to prevent the parent page from disappearing. The way
                        // we're keeping pages in the DOM right now sucks
                        //
                        // rebind the page remove that was unbound in the open function
                        // to allow for the parent page removal from actions other than the use
                        // of a dialog sized custom select
                        //
                        // doing this here provides for the back button on the custom select dialog
                        $.mobile._bindPageRemove.call( self.thisPage );
                    });

                    // Events on the popup
                    self.listbox.bind( "popupafterclose", function( event ) {
                        self.close();
                    });

                    // Close button on small overlays
                    if ( self.isMultiple ) {
                        self.headerClose.click(function() {
                            if ( self.menuType === "overlay" ) {
                                self.close();
                                return false;
                            }
                        });
                    }

                    // track this dependency so that when the parent page
                    // is removed on pagehide it will also remove the menupage
                    self.thisPage.addDependents( this.menuPage );
                },

                _isRebuildRequired: function() {
                    var list = this.list.find( "li" ),
                        options = this._selectOptions();

                    // TODO exceedingly naive method to determine difference
                    // ignores value changes etc in favor of a forcedRebuild
                    // from the user in the refresh method
                    return options.text() !== list.text();
                },

                selected: function() {
                    return this._selectOptions().filter( ":selected:not( :jqmData(placeholder='true') )" );
                },

                refresh: function( forceRebuild , foo ) {
                    var self = this,
                        select = this.element,
                        isMultiple = this.isMultiple,
                        indicies;

                    if (  forceRebuild || this._isRebuildRequired() ) {
                        self._buildList();
                    }

                    indicies = this.selectedIndices();

                    self.setButtonText();
                    self.setButtonCount();

                    self.list.find( "li:not(.ui-li-divider)" )
                        .removeClass( $.mobile.activeBtnClass )
                        .attr( "aria-selected", false )
                        .each(function( i ) {

                            if ( $.inArray( i, indicies ) > -1 ) {
                                var item = $( this );

                                // Aria selected attr
                                item.attr( "aria-selected", true );

                                // Multiple selects: add the "on" checkbox state to the icon
                                if ( self.isMultiple ) {
                                    item.find( ".ui-icon" ).removeClass( "ui-icon-checkbox-off" ).addClass( "ui-icon-checkbox-on" );
                                } else {
                                    if ( item.is( ".ui-selectmenu-placeholder" ) ) {
                                        item.next().addClass( $.mobile.activeBtnClass );
                                    } else {
                                        item.addClass( $.mobile.activeBtnClass );
                                    }
                                }
                            }
                        });
                },

                close: function() {
                    if ( this.options.disabled || !this.isOpen ) {
                        return;
                    }

                    var self = this;

                    if ( self.menuType === "page" ) {
                        // doesn't solve the possible issue with calling change page
                        // where the objects don't define data urls which prevents dialog key
                        // stripping - changePage has incoming refactor
                        $.mobile.back();
                    } else {
                        self.listbox.popup( "close" );
                        self.list.appendTo( self.listbox );
                        self._focusButton();
                    }

                    // allow the dialog to be closed again
                    self.isOpen = false;
                },

                open: function() {
                    if ( this.options.disabled ) {
                        return;
                    }

                    var self = this,
                        $window = $( window ),
                        selfListParent = self.list.parent(),
                        menuHeight = selfListParent.outerHeight(),
                        menuWidth = selfListParent.outerWidth(),
                        activePage = $( "." + $.mobile.activePageClass ),
                        scrollTop = $window.scrollTop(),
                        btnOffset = self.button.offset().top,
                        screenHeight = $window.height(),
                        screenWidth = $window.width();

                    //add active class to button
                    self.button.addClass( $.mobile.activeBtnClass );

                    //remove after delay
                    setTimeout( function() {
                        self.button.removeClass( $.mobile.activeBtnClass );
                    }, 300);

                    function focusMenuItem() {
                        var selector = self.list.find( "." + $.mobile.activeBtnClass + " a" );
                        if ( selector.length === 0 ) {
                            selector = self.list.find( "li.ui-btn:not( :jqmData(placeholder='true') ) a" );
                        }
                        selector.first().focus().closest( "li" ).addClass( "ui-btn-down-" + widget.options.theme );
                    }

                    if ( menuHeight > screenHeight - 80 || !$.support.scrollTop ) {

                        self.menuPage.appendTo( $.mobile.pageContainer ).page();
                        self.menuPageContent = menuPage.find( ".ui-content" );
                        self.menuPageClose = menuPage.find( ".ui-header a" );

                        // prevent the parent page from being removed from the DOM,
                        // otherwise the results of selecting a list item in the dialog
                        // fall into a black hole
                        self.thisPage.unbind( "pagehide.remove" );

                        //for WebOS/Opera Mini (set lastscroll using button offset)
                        if ( scrollTop === 0 && btnOffset > screenHeight ) {
                            self.thisPage.one( "pagehide", function() {
                                $( this ).jqmData( "lastScroll", btnOffset );
                            });
                        }

                        self.menuPage
                            .one( "pageshow", function() {
                                focusMenuItem();
                                self.isOpen = true;
                            })
                            .one( "pagehide", function() {
                                self.isOpen = false;
                            });

                        self.menuType = "page";
                        self.menuPageContent.append( self.list );
                        self.menuPage.find("div .ui-title").text(self.label.text());
                        $.mobile.changePage( self.menuPage, {
                            transition: $.mobile.defaultDialogTransition
                        });
                    } else {
                        self.menuType = "overlay";

                        self.listbox
                            .one( "popupafteropen", focusMenuItem )
                            .popup( "open", {
                                x: self.button.offset().left + self.button.outerWidth() / 2,
                                y: self.button.offset().top + self.button.outerHeight() / 2
                            });

                        // duplicate with value set in page show for dialog sized selects
                        self.isOpen = true;
                    }
                },

                _buildList: function() {
                    var self = this,
                        o = this.options,
                        placeholder = this.placeholder,
                        needPlaceholder = true,
                        optgroups = [],
                        lis = [],
                        dataIcon = self.isMultiple ? "checkbox-off" : "false";

                    self.list.empty().filter( ".ui-listview" ).listview( "destroy" );

                    var $options = self.select.find( "option" ),
                        numOptions = $options.length,
                        select = this.select[ 0 ],
                        dataPrefix = 'data-' + $.mobile.ns,
                        dataIndexAttr = dataPrefix + 'option-index',
                        dataIconAttr = dataPrefix + 'icon',
                        dataRoleAttr = dataPrefix + 'role',
                        dataPlaceholderAttr = dataPrefix + 'placeholder',
                        fragment = document.createDocumentFragment(),
                        isPlaceholderItem = false,
                        optGroup;

                    for (var i = 0; i < numOptions;i++, isPlaceholderItem = false) {
                        var option = $options[i],
                            $option = $( option ),
                            parent = option.parentNode,
                            text = $option.text(),
                            anchor  = document.createElement( 'a' ),
                            classes = [];

                        anchor.setAttribute( 'href', '#' );
                        anchor.appendChild( document.createTextNode( text ) );

                        // Are we inside an optgroup?
                        if ( parent !== select && parent.nodeName.toLowerCase() === "optgroup" ) {
                            var optLabel = parent.getAttribute( 'label' );
                            if ( optLabel !== optGroup ) {
                                var divider = document.createElement( 'li' );
                                divider.setAttribute( dataRoleAttr, 'list-divider' );
                                divider.setAttribute( 'role', 'option' );
                                divider.setAttribute( 'tabindex', '-1' );
                                divider.appendChild( document.createTextNode( optLabel ) );
                                fragment.appendChild( divider );
                                optGroup = optLabel;
                            }
                        }

                        if ( needPlaceholder && ( !option.getAttribute( "value" ) || text.length === 0 || $option.jqmData( "placeholder" ) ) ) {
                            needPlaceholder = false;
                            isPlaceholderItem = true;

                            // If we have identified a placeholder, record the fact that it was
                            // us who have added the placeholder to the option and mark it
                            // retroactively in the select as well
                            if ( !option.hasAttribute( dataPlaceholderAttr ) ) {
                                this._removePlaceholderAttr = true;
                            }
                            option.setAttribute( dataPlaceholderAttr, true );
                            if ( o.hidePlaceholderMenuItems ) {
                                classes.push( "ui-selectmenu-placeholder" );
                            }
                            if ( placeholder !== text ) {
                                placeholder = self.placeholder = text;
                            }
                        }

                        var item = document.createElement('li');
                        if ( option.disabled ) {
                            classes.push( "ui-disabled" );
                            item.setAttribute('aria-disabled',true);
                        }
                        item.setAttribute( dataIndexAttr,i );
                        item.setAttribute( dataIconAttr, dataIcon );
                        if ( isPlaceholderItem ) {
                            item.setAttribute( dataPlaceholderAttr, true );
                        }
                        item.className = classes.join( " " );
                        item.setAttribute( 'role', 'option' );
                        anchor.setAttribute( 'tabindex', '-1' );
                        item.appendChild( anchor );
                        fragment.appendChild( item );
                    }

                    self.list[0].appendChild( fragment );

                    // Hide header if it's not a multiselect and there's no placeholder
                    if ( !this.isMultiple && !placeholder.length ) {
                        this.header.hide();
                    } else {
                        this.headerTitle.text( this.placeholder );
                    }

                    // Now populated, create listview
                    self.list.listview();
                },

                _button: function() {
                    return $( "<a>", {
                        "href": "#",
                        "role": "button",
                        // TODO value is undefined at creation
                        "id": this.buttonId,
                        "aria-haspopup": "true",

                        // TODO value is undefined at creation
                        "aria-owns": this.menuId
                    });
                },

                _destroy: function() {
                    this.close();

                    // Restore the tabindex attribute to its original value
                    if ( this._origTabIndex !== undefined ) {
                        if ( this._origTabIndex !== false ) {
                            this.select.attr( "tabindex", this._origTabIndex );
                        } else {
                            this.select.removeAttr( "tabindex" );
                        }
                    }

                    // Remove the placeholder attribute if we were the ones to add it
                    if ( this._removePlaceholderAttr ) {
                        this._selectOptions().removeAttr( "data-" + $.mobile.ns + "placeholder" );
                    }

                    // Remove the popup
                    this.listbox.remove();

                    // Chain up
                    origDestroy.apply( this, arguments );
                }
            });
        };

        // issue #3894 - core doesn't trigger events on disabled delegates
        $( document ).bind( "selectmenubeforecreate", function( event ) {
            var selectmenuWidget = $( event.target ).data( "selectmenu" );

            if ( !selectmenuWidget.options.nativeMenu &&
                selectmenuWidget.element.parents( ":jqmData(role='popup')" ).length === 0 ) {
                extendSelect( selectmenuWidget );
            }
        });
    })( jQuery );

    (function( $, undefined ) {


        $.widget( "mobile.fixedtoolbar", $.mobile.widget, {
            options: {
                visibleOnPageShow: true,
                disablePageZoom: true,
                transition: "slide", //can be none, fade, slide (slide maps to slideup or slidedown)
                fullscreen: false,
                tapToggle: true,
                tapToggleBlacklist: "a, button, input, select, textarea, .ui-header-fixed, .ui-footer-fixed, .ui-popup",
                hideDuringFocus: "input, textarea, select",
                updatePagePadding: true,
                trackPersistentToolbars: true,

                // Browser detection! Weeee, here we go...
                // Unfortunately, position:fixed is costly, not to mention probably impossible, to feature-detect accurately.
                // Some tests exist, but they currently return false results in critical devices and browsers, which could lead to a broken experience.
                // Testing fixed positioning is also pretty obtrusive to page load, requiring injected elements and scrolling the window
                // The following function serves to rule out some popular browsers with known fixed-positioning issues
                // This is a plugin option like any other, so feel free to improve or overwrite it
                supportBlacklist: function() {
                    var w = window,
                        ua = navigator.userAgent,
                        platform = navigator.platform,
                    // Rendering engine is Webkit, and capture major version
                        wkmatch = ua.match( /AppleWebKit\/([0-9]+)/ ),
                        wkversion = !!wkmatch && wkmatch[ 1 ],
                        ffmatch = ua.match( /Fennec\/([0-9]+)/ ),
                        ffversion = !!ffmatch && ffmatch[ 1 ],
                        operammobilematch = ua.match( /Opera Mobi\/([0-9]+)/ ),
                        omversion = !!operammobilematch && operammobilematch[ 1 ];

                    if(
                    // iOS 4.3 and older : Platform is iPhone/Pad/Touch and Webkit version is less than 534 (ios5)
                        ( ( platform.indexOf( "iPhone" ) > -1 || platform.indexOf( "iPad" ) > -1  || platform.indexOf( "iPod" ) > -1 ) && wkversion && wkversion < 534 ) ||
                            // Opera Mini
                            ( w.operamini && ({}).toString.call( w.operamini ) === "[object OperaMini]" ) ||
                            ( operammobilematch && omversion < 7458 )	||
                            //Android lte 2.1: Platform is Android and Webkit version is less than 533 (Android 2.2)
                            ( ua.indexOf( "Android" ) > -1 && wkversion && wkversion < 533 ) ||
                            // Firefox Mobile before 6.0 -
                            ( ffversion && ffversion < 6 ) ||
                            // WebOS less than 3
                            ( "palmGetResource" in window && wkversion && wkversion < 534 )	||
                            // MeeGo
                            ( ua.indexOf( "MeeGo" ) > -1 && ua.indexOf( "NokiaBrowser/8.5.0" ) > -1 ) ) {
                        return true;
                    }

                    return false;
                },
                initSelector: ":jqmData(position='fixed')"
            },

            _create: function() {

                var self = this,
                    o = self.options,
                    $el = self.element,
                    tbtype = $el.is( ":jqmData(role='header')" ) ? "header" : "footer",
                    $page = $el.closest( ".ui-page" );

                // Feature detecting support for
                if ( o.supportBlacklist() ) {
                    self.destroy();
                    return;
                }

                $el.addClass( "ui-"+ tbtype +"-fixed" );

                // "fullscreen" overlay positioning
                if ( o.fullscreen ) {
                    $el.addClass( "ui-"+ tbtype +"-fullscreen" );
                    $page.addClass( "ui-page-" + tbtype + "-fullscreen" );
                }
                // If not fullscreen, add class to page to set top or bottom padding
                else{
                    $page.addClass( "ui-page-" + tbtype + "-fixed" );
                }

                self._addTransitionClass();
                self._bindPageEvents();
                self._bindToggleHandlers();
            },

            _addTransitionClass: function() {
                var tclass = this.options.transition;

                if ( tclass && tclass !== "none" ) {
                    // use appropriate slide for header or footer
                    if ( tclass === "slide" ) {
                        tclass = this.element.is( ".ui-header" ) ? "slidedown" : "slideup";
                    }

                    this.element.addClass( tclass );
                }
            },

            _bindPageEvents: function() {
                var self = this,
                    o = self.options,
                    $el = self.element;

                //page event bindings
                // Fixed toolbars require page zoom to be disabled, otherwise usability issues crop up
                // This method is meant to disable zoom while a fixed-positioned toolbar page is visible
                $el.closest( ".ui-page" )
                    .bind( "pagebeforeshow", function() {
                        if ( o.disablePageZoom ) {
                            $.mobile.zoom.disable( true );
                        }
                        if ( !o.visibleOnPageShow ) {
                            self.hide( true );
                        }
                    } )
                    .bind( "webkitAnimationStart animationstart updatelayout", function() {
                        var thisPage = this;
                        if ( o.updatePagePadding ) {
                            self.updatePagePadding( thisPage );
                        }
                    })
                    .bind( "pageshow", function() {
                        var thisPage = this;
                        self.updatePagePadding( thisPage );
                        if ( o.updatePagePadding ) {
                            $( window ).bind( "throttledresize." + self.widgetName, function() {
                                self.updatePagePadding( thisPage );
                            });
                        }
                    })
                    .bind( "pagebeforehide", function( e, ui ) {
                        if ( o.disablePageZoom ) {
                            $.mobile.zoom.enable( true );
                        }
                        if ( o.updatePagePadding ) {
                            $( window ).unbind( "throttledresize." + self.widgetName );
                        }

                        if ( o.trackPersistentToolbars ) {
                            var thisFooter = $( ".ui-footer-fixed:jqmData(id)", this ),
                                thisHeader = $( ".ui-header-fixed:jqmData(id)", this ),
                                nextFooter = thisFooter.length && ui.nextPage && $( ".ui-footer-fixed:jqmData(id='" + thisFooter.jqmData( "id" ) + "')", ui.nextPage ) || $(),
                                nextHeader = thisHeader.length && ui.nextPage && $( ".ui-header-fixed:jqmData(id='" + thisHeader.jqmData( "id" ) + "')", ui.nextPage ) || $();

                            if ( nextFooter.length || nextHeader.length ) {

                                nextFooter.add( nextHeader ).appendTo( $.mobile.pageContainer );

                                ui.nextPage.one( "pageshow", function() {
                                    nextFooter.add( nextHeader ).appendTo( this );
                                });
                            }
                        }
                    });
            },

            _visible: true,

            // This will set the content element's top or bottom padding equal to the toolbar's height
            updatePagePadding: function( tbPage ) {
                var $el = this.element,
                    header = $el.is( ".ui-header" );

                // This behavior only applies to "fixed", not "fullscreen"
                if ( this.options.fullscreen ) { return; }

                tbPage = tbPage || $el.closest( ".ui-page" );
                $( tbPage ).css( "padding-" + ( header ? "top" : "bottom" ), $el.outerHeight() );
            },

            _useTransition: function( notransition ) {
                var $win = $( window ),
                    $el = this.element,
                    scroll = $win.scrollTop(),
                    elHeight = $el.height(),
                    pHeight = $el.closest( ".ui-page" ).height(),
                    viewportHeight = $.mobile.getScreenHeight(),
                    tbtype = $el.is( ":jqmData(role='header')" ) ? "header" : "footer";

                return !notransition &&
                    ( this.options.transition && this.options.transition !== "none" &&
                        (
                            ( tbtype === "header" && !this.options.fullscreen && scroll > elHeight ) ||
                                ( tbtype === "footer" && !this.options.fullscreen && scroll + viewportHeight < pHeight - elHeight )
                            ) || this.options.fullscreen
                        );
            },

            show: function( notransition ) {
                var hideClass = "ui-fixed-hidden",
                    $el = this.element;

                if ( this._useTransition( notransition ) ) {
                    $el
                        .removeClass( "out " + hideClass )
                        .addClass( "in" );
                }
                else {
                    $el.removeClass( hideClass );
                }
                this._visible = true;
            },

            hide: function( notransition ) {
                var hideClass = "ui-fixed-hidden",
                    $el = this.element,
                // if it's a slide transition, our new transitions need the reverse class as well to slide outward
                    outclass = "out" + ( this.options.transition === "slide" ? " reverse" : "" );

                if( this._useTransition( notransition ) ) {
                    $el
                        .addClass( outclass )
                        .removeClass( "in" )
                        .animationComplete(function() {
                            $el.addClass( hideClass ).removeClass( outclass );
                        });
                }
                else {
                    $el.addClass( hideClass ).removeClass( outclass );
                }
                this._visible = false;
            },

            toggle: function() {
                this[ this._visible ? "hide" : "show" ]();
            },

            _bindToggleHandlers: function() {
                var self = this,
                    o = self.options,
                    $el = self.element;

                // tap toggle
                $el.closest( ".ui-page" )
                    .bind( "vclick", function( e ) {
                        if ( o.tapToggle && !$( e.target ).closest( o.tapToggleBlacklist ).length ) {
                            self.toggle();
                        }
                    })
                    .bind( "focusin focusout", function( e ) {
                        if ( screen.width < 500 && $( e.target ).is( o.hideDuringFocus ) && !$( e.target ).closest( ".ui-header-fixed, .ui-footer-fixed" ).length ) {
                            self[ ( e.type === "focusin" && self._visible ) ? "hide" : "show" ]();
                        }
                    });
            },

            _destroy: function() {
                var $el = this.element,
                    header = $el.is( ".ui-header" );

                $el.closest( ".ui-page" ).css( "padding-" + ( header ? "top" : "bottom" ), "" );
                $el.removeClass( "ui-header-fixed ui-footer-fixed ui-header-fullscreen ui-footer-fullscreen in out fade slidedown slideup ui-fixed-hidden" );
                $el.closest( ".ui-page" ).removeClass( "ui-page-header-fixed ui-page-footer-fixed ui-page-header-fullscreen ui-page-footer-fullscreen" );
            }

        });

        //auto self-init widgets
        $( document )
            .bind( "pagecreate create", function( e ) {

                // DEPRECATED in 1.1: support for data-fullscreen=true|false on the page element.
                // This line ensures it still works, but we recommend moving the attribute to the toolbars themselves.
                if ( $( e.target ).jqmData( "fullscreen" ) ) {
                    $( $.mobile.fixedtoolbar.prototype.options.initSelector, e.target ).not( ":jqmData(fullscreen)" ).jqmData( "fullscreen", true );
                }

                $.mobile.fixedtoolbar.prototype.enhanceWithin( e.target );
            });

    })( jQuery );

    (function( $, window ) {

        // This fix addresses an iOS bug, so return early if the UA claims it's something else.
        if ( !(/iPhone|iPad|iPod/.test( navigator.platform ) && navigator.userAgent.indexOf( "AppleWebKit" ) > -1 ) ) {
            return;
        }

        var zoom = $.mobile.zoom,
            evt, x, y, z, aig;

        function checkTilt( e ) {
            evt = e.originalEvent;
            aig = evt.accelerationIncludingGravity;

            x = Math.abs( aig.x );
            y = Math.abs( aig.y );
            z = Math.abs( aig.z );

            // If portrait orientation and in one of the danger zones
            if ( !window.orientation && ( x > 7 || ( ( z > 6 && y < 8 || z < 8 && y > 6 ) && x > 5 ) ) ) {
                if ( zoom.enabled ) {
                    zoom.disable();
                }
            }	else if ( !zoom.enabled ) {
                zoom.enable();
            }
        }

        $( window )
            .bind( "orientationchange.iosorientationfix", zoom.enable )
            .bind( "devicemotion.iosorientationfix", checkTilt );

    }( jQuery, this ));

    (function( $, window, undefined ) {
        var	$html = $( "html" ),
            $head = $( "head" ),
            $window = $( window );

        //remove initial build class (only present on first pageshow)
        function hideRenderingClass() {
            $html.removeClass( "ui-mobile-rendering" );
        }

        // trigger mobileinit event - useful hook for configuring $.mobile settings before they're used
        $( window.document ).trigger( "mobileinit" );

        // support conditions
        // if device support condition(s) aren't met, leave things as they are -> a basic, usable experience,
        // otherwise, proceed with the enhancements
        if ( !$.mobile.gradeA() ) {
            return;
        }

        // override ajaxEnabled on platforms that have known conflicts with hash history updates
        // or generally work better browsing in regular http for full page refreshes (BB5, Opera Mini)
        if ( $.mobile.ajaxBlacklist ) {
            $.mobile.ajaxEnabled = false;
        }

        // Add mobile, initial load "rendering" classes to docEl
        $html.addClass( "ui-mobile ui-mobile-rendering" );

        // This is a fallback. If anything goes wrong (JS errors, etc), or events don't fire,
        // this ensures the rendering class is removed after 5 seconds, so content is visible and accessible
        setTimeout( hideRenderingClass, 5000 );

        $.extend( $.mobile, {
            // find and enhance the pages in the dom and transition to the first page.
            initializePage: function() {
                // find present pages
                var $pages = $( ":jqmData(role='page'), :jqmData(role='dialog')" ),
                    hash = $.mobile.path.parseLocation().hash.replace("#", ""),
                    hashPage = document.getElementById( hash );

                // if no pages are found, create one with body's inner html
                if ( !$pages.length ) {
                    $pages = $( "body" ).wrapInner( "<div data-" + $.mobile.ns + "role='page'></div>" ).children( 0 );
                }

                // add dialogs, set data-url attrs
                $pages.each(function() {
                    var $this = $( this );

                    // unless the data url is already set set it to the pathname
                    if ( !$this.jqmData( "url" ) ) {
                        $this.attr( "data-" + $.mobile.ns + "url", $this.attr( "id" ) || location.pathname + location.search );
                    }
                });

                // define first page in dom case one backs out to the directory root (not always the first page visited, but defined as fallback)
                $.mobile.firstPage = $pages.first();

                // define page container
                $.mobile.pageContainer = $pages.first().parent().addClass( "ui-mobile-viewport" );

                // alert listeners that the pagecontainer has been determined for binding
                // to events triggered on it
                $window.trigger( "pagecontainercreate" );

                // cue page loading message
                $.mobile.showPageLoadingMsg();

                //remove initial build class (only present on first pageshow)
                hideRenderingClass();

                // if hashchange listening is disabled, there's no hash deeplink,
                // the hash is not valid (contains more than one # or does not start with #)
                // or there is no page with that hash, change to the first page in the DOM
                // Remember, however, that the hash can also be a path!
                if ( ! ( $.mobile.hashListeningEnabled &&
                    $.mobile.path.isHashValid( location.hash ) &&
                    ( $( hashPage ).is( ':jqmData(role="page")' ) ||
                        $.mobile.path.isPath( hash ) ||
                        hash === $.mobile.dialogHashKey ) ) ) {

                    // Store the initial destination
                    if ( $.mobile.path.isHashValid( location.hash ) ) {
                        $.mobile.urlHistory.initialDst = hash.replace( "#", "" );
                    }
                    $.mobile.changePage( $.mobile.firstPage, { transition: "none", reverse: true, changeHash: false, fromHashChange: true } );
                }
                // otherwise, trigger a hashchange to load a deeplink
                else {
                    $window.trigger( "hashchange", [ true ] );
                }
            }
        });

        // initialize events now, after mobileinit has occurred
        $.mobile.navreadyDeferred.resolve();

        // check which scrollTop value should be used by scrolling to 1 immediately at domready
        // then check what the scroll top is. Android will report 0... others 1
        // note that this initial scroll won't hide the address bar. It's just for the check.
        $(function() {
            window.scrollTo( 0, 1 );

            // if defaultHomeScroll hasn't been set yet, see if scrollTop is 1
            // it should be 1 in most browsers, but android treats 1 as 0 (for hiding addr bar)
            // so if it's 1, use 0 from now on
            $.mobile.defaultHomeScroll = ( !$.support.scrollTop || $( window ).scrollTop() === 1 ) ? 0 : 1;


            // TODO: Implement a proper registration mechanism with dependency handling in order to not have exceptions like the one below
            //auto self-init widgets for those widgets that have a soft dependency on others
            if ( $.fn.controlgroup ) {
                $( document ).bind( "pagecreate create", function( e ) {
                    $( ":jqmData(role='controlgroup')", e.target )
                        .jqmEnhanceable()
                        .controlgroup({ excludeInvisible: false });
                });
            }

            //dom-ready inits
            if ( $.mobile.autoInitializePage ) {
                $.mobile.initializePage();
            }

            // window load event
            // hide iOS browser chrome on load
            $window.load( $.mobile.silentScroll );

            if ( !$.support.cssPointerEvents ) {
                // IE and Opera don't support CSS pointer-events: none that we use to disable link-based buttons
                // by adding the 'ui-disabled' class to them. Using a JavaScript workaround for those browser.
                // https://github.com/jquery/jquery-mobile/issues/3558

                $( document ).delegate( ".ui-disabled", "vclick",
                    function( e ) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                );
            }
        });
    }( jQuery, this ));

}));
//fgnass.github.com/spin.js#v1.3

/**
 * Copyright (c) 2011-2013 Felix Gnass
 * Licensed under the MIT license
 */

(function(root, factory) {

  /* CommonJS */
  if (typeof exports == 'object')  module.exports = factory()

  /* AMD module */
  else if (typeof define == 'function' && define.amd) define(factory)

  /* Browser global */
  else root.Spinner = factory()
}
(this, function() {
  "use strict";

  var prefixes = ['webkit', 'Moz', 'ms', 'O'] /* Vendor prefixes */
    , animations = {} /* Animation rules keyed by their name */
    , useCssAnimations /* Whether to use CSS animations or setTimeout */

  /**
   * Utility function to create elements. If no tag name is given,
   * a DIV is created. Optionally properties can be passed.
   */
  function createEl(tag, prop) {
    var el = document.createElement(tag || 'div')
      , n

    for(n in prop) el[n] = prop[n]
    return el
  }

  /**
   * Appends children and returns the parent.
   */
  function ins(parent /* child1, child2, ...*/) {
    for (var i=1, n=arguments.length; i<n; i++)
      parent.appendChild(arguments[i])

    return parent
  }

  /**
   * Insert a new stylesheet to hold the @keyframe or VML rules.
   */
  var sheet = (function() {
    var el = createEl('style', {type : 'text/css'})
    ins(document.getElementsByTagName('head')[0], el)
    return el.sheet || el.styleSheet
  }())

  /**
   * Creates an opacity keyframe animation rule and returns its name.
   * Since most mobile Webkits have timing issues with animation-delay,
   * we create separate rules for each line/segment.
   */
  function addAnimation(alpha, trail, i, lines) {
    var name = ['opacity', trail, ~~(alpha*100), i, lines].join('-')
      , start = 0.01 + i/lines * 100
      , z = Math.max(1 - (1-alpha) / trail * (100-start), alpha)
      , prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase()
      , pre = prefix && '-' + prefix + '-' || ''

    if (!animations[name]) {
      sheet.insertRule(
        '@' + pre + 'keyframes ' + name + '{' +
        '0%{opacity:' + z + '}' +
        start + '%{opacity:' + alpha + '}' +
        (start+0.01) + '%{opacity:1}' +
        (start+trail) % 100 + '%{opacity:' + alpha + '}' +
        '100%{opacity:' + z + '}' +
        '}', sheet.cssRules.length)

      animations[name] = 1
    }

    return name
  }

  /**
   * Tries various vendor prefixes and returns the first supported property.
   */
  function vendor(el, prop) {
    var s = el.style
      , pp
      , i

    if(s[prop] !== undefined) return prop
    prop = prop.charAt(0).toUpperCase() + prop.slice(1)
    for(i=0; i<prefixes.length; i++) {
      pp = prefixes[i]+prop
      if(s[pp] !== undefined) return pp
    }
  }

  /**
   * Sets multiple style properties at once.
   */
  function css(el, prop) {
    for (var n in prop)
      el.style[vendor(el, n)||n] = prop[n]

    return el
  }

  /**
   * Fills in default values.
   */
  function merge(obj) {
    for (var i=1; i < arguments.length; i++) {
      var def = arguments[i]
      for (var n in def)
        if (obj[n] === undefined) obj[n] = def[n]
    }
    return obj
  }

  /**
   * Returns the absolute page-offset of the given element.
   */
  function pos(el) {
    var o = { x:el.offsetLeft, y:el.offsetTop }
    while((el = el.offsetParent))
      o.x+=el.offsetLeft, o.y+=el.offsetTop

    return o
  }

  // Built-in defaults

  var defaults = {
    lines: 12,            // The number of lines to draw
    length: 7,            // The length of each line
    width: 5,             // The line thickness
    radius: 10,           // The radius of the inner circle
    rotate: 0,            // Rotation offset
    corners: 1,           // Roundness (0..1)
    color: '#000',        // #rgb or #rrggbb
    direction: 1,         // 1: clockwise, -1: counterclockwise
    speed: 1,             // Rounds per second
    trail: 100,           // Afterglow percentage
    opacity: 1/4,         // Opacity of the lines
    fps: 20,              // Frames per second when using setTimeout()
    zIndex: 2e9,          // Use a high z-index by default
    className: 'spinner', // CSS class to assign to the element
    top: 'auto',          // center vertically
    left: 'auto',         // center horizontally
    position: 'relative'  // element position
  }

  /** The constructor */
  function Spinner(o) {
    if (typeof this == 'undefined') return new Spinner(o)
    this.opts = merge(o || {}, Spinner.defaults, defaults)
  }

  // Global defaults that override the built-ins:
  Spinner.defaults = {}

  merge(Spinner.prototype, {

    /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target b calling
     * stop() internally.
     */
    spin: function(target) {
      this.stop()

      var self = this
        , o = self.opts
        , el = self.el = css(createEl(0, {className: o.className}), {position: o.position, width: 0, zIndex: o.zIndex})
        , mid = o.radius+o.length+o.width
        , ep // element position
        , tp // target position

      if (target) {
        target.insertBefore(el, target.firstChild||null)
        tp = pos(target)
        ep = pos(el)
        css(el, {
          left: (o.left == 'auto' ? tp.x-ep.x + (target.offsetWidth >> 1) : parseInt(o.left, 10) + mid) + 'px',
          top: (o.top == 'auto' ? tp.y-ep.y + (target.offsetHeight >> 1) : parseInt(o.top, 10) + mid)  + 'px'
        })
      }

      el.setAttribute('role', 'progressbar')
      self.lines(el, self.opts)

      if (!useCssAnimations) {
        // No CSS animation support, use setTimeout() instead
        var i = 0
          , start = (o.lines - 1) * (1 - o.direction) / 2
          , alpha
          , fps = o.fps
          , f = fps/o.speed
          , ostep = (1-o.opacity) / (f*o.trail / 100)
          , astep = f/o.lines

        ;(function anim() {
          i++;
          for (var j = 0; j < o.lines; j++) {
            alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity)

            self.opacity(el, j * o.direction + start, alpha, o)
          }
          self.timeout = self.el && setTimeout(anim, ~~(1000/fps))
        })()
      }
      return self
    },

    /**
     * Stops and removes the Spinner.
     */
    stop: function() {
      var el = this.el
      if (el) {
        clearTimeout(this.timeout)
        if (el.parentNode) el.parentNode.removeChild(el)
        this.el = undefined
      }
      return this
    },

    /**
     * Internal method that draws the individual lines. Will be overwritten
     * in VML fallback mode below.
     */
    lines: function(el, o) {
      var i = 0
        , start = (o.lines - 1) * (1 - o.direction) / 2
        , seg

      function fill(color, shadow) {
        return css(createEl(), {
          position: 'absolute',
          width: (o.length+o.width) + 'px',
          height: o.width + 'px',
          background: color,
          boxShadow: shadow,
          transformOrigin: 'left',
          transform: 'rotate(' + ~~(360/o.lines*i+o.rotate) + 'deg) translate(' + o.radius+'px' +',0)',
          borderRadius: (o.corners * o.width>>1) + 'px'
        })
      }

      for (; i < o.lines; i++) {
        seg = css(createEl(), {
          position: 'absolute',
          top: 1+~(o.width/2) + 'px',
          transform: o.hwaccel ? 'translate3d(0,0,0)' : '',
          opacity: o.opacity,
          animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1/o.speed + 's linear infinite'
        })

        if (o.shadow) ins(seg, css(fill('#000', '0 0 4px ' + '#000'), {top: 2+'px'}))

        ins(el, ins(seg, fill(o.color, '0 0 1px rgba(0,0,0,.1)')))
      }
      return el
    },

    /**
     * Internal method that adjusts the opacity of a single line.
     * Will be overwritten in VML fallback mode below.
     */
    opacity: function(el, i, val) {
      if (i < el.childNodes.length) el.childNodes[i].style.opacity = val
    }

  })


  function initVML() {

    /* Utility function to create a VML tag */
    function vml(tag, attr) {
      return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr)
    }

    // No CSS transforms but VML support, add a CSS rule for VML elements:
    sheet.addRule('.spin-vml', 'behavior:url(#default#VML)')

    Spinner.prototype.lines = function(el, o) {
      var r = o.length+o.width
        , s = 2*r

      function grp() {
        return css(
          vml('group', {
            coordsize: s + ' ' + s,
            coordorigin: -r + ' ' + -r
          }),
          { width: s, height: s }
        )
      }

      var margin = -(o.width+o.length)*2 + 'px'
        , g = css(grp(), {position: 'absolute', top: margin, left: margin})
        , i

      function seg(i, dx, filter) {
        ins(g,
          ins(css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx}),
            ins(css(vml('roundrect', {arcsize: o.corners}), {
                width: r,
                height: o.width,
                left: o.radius,
                top: -o.width>>1,
                filter: filter
              }),
              vml('fill', {color: o.color, opacity: o.opacity}),
              vml('stroke', {opacity: 0}) // transparent stroke to fix color bleeding upon opacity change
            )
          )
        )
      }

      if (o.shadow)
        for (i = 1; i <= o.lines; i++)
          seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)')

      for (i = 1; i <= o.lines; i++) seg(i)
      return ins(el, g)
    }

    Spinner.prototype.opacity = function(el, i, val, o) {
      var c = el.firstChild
      o = o.shadow && o.lines || 0
      if (c && i+o < c.childNodes.length) {
        c = c.childNodes[i+o]; c = c && c.firstChild; c = c && c.firstChild
        if (c) c.opacity = val
      }
    }
  }

  var probe = css(createEl('group'), {behavior: 'url(#default#VML)'})

  if (!vendor(probe, 'transform') && probe.adj) initVML()
  else useCssAnimations = vendor(probe, 'animation')

  return Spinner

}));


/**
 * Copyright (c) 2011-2013 Felix Gnass
 * Licensed under the MIT license
 */

/*

Basic Usage:
============

$('#el').spin(); // Creates a default Spinner using the text color of #el.
$('#el').spin({ ... }); // Creates a Spinner using the provided options.

$('#el').spin(false); // Stops and removes the spinner.

Using Presets:
==============

$('#el').spin('small'); // Creates a 'small' Spinner using the text color of #el.
$('#el').spin('large', '#fff'); // Creates a 'large' white Spinner.

Adding a custom preset:
=======================

$.fn.spin.presets.flower = {
  lines: 9
  length: 10
  width: 20
  radius: 0
}

$('#el').spin('flower', 'red');

*/

(function(factory) {

  if (typeof exports == 'object') {
    // CommonJS
    factory(require('jquery'), require('spin'))
  }
  else if (typeof define == 'function' && define.amd) {
    // AMD, register as anonymous module
    define(['jquery', 'spin'], factory)
  }
  else {
    // Browser globals
    if (!window.Spinner) throw new Error('Spin.js not present')
    factory(window.jQuery, window.Spinner)
  }

}(function($, Spinner) {

  $.fn.spin = function(opts, color) {

    return this.each(function() {
      var $this = $(this),
        data = $this.data();

      if (data.spinner) {
        data.spinner.stop();
        delete data.spinner;
      }
      if (opts !== false) {
        opts = $.extend(
          { color: color || $this.css('color') },
          $.fn.spin.presets[opts] || opts
        )
        data.spinner = new Spinner(opts).spin(this)
      }
    })
  }

  $.fn.spin.presets = {
    tiny: { lines: 8, length: 2, width: 2, radius: 3 },
    small: { lines: 8, length: 4, width: 3, radius: 5 },
    large: { lines: 10, length: 8, width: 4, radius: 8 }
  }

}));
// Magnific Popup v0.8.3 by Dmitry Semenov
// http://bit.ly/magnific-popup#build=image+iframe
(function(a){var b="Close",c="BeforeAppend",d="MarkupParse",e="Open",f="Change",g="mfp",h="."+g,i="mfp-ready",j="mfp-removing",k="mfp-prevent-close",l,m=function(){},n,o=a(window),p,q,r,s,t,u=function(a,b){l.ev.on(g+a+h,b)},v=function(b,c,d,e){var f=document.createElement("div");return f.className="mfp-"+b,d&&(f.innerHTML=d),e?c&&c.appendChild(f):(f=a(f),c&&f.appendTo(c)),f},w=function(b,c){l.ev.triggerHandler(g+b,c),l.st.callbacks&&(b=b.charAt(0).toLowerCase()+b.slice(1),l.st.callbacks[b]&&l.st.callbacks[b].apply(l,a.isArray(c)?c:[c]))},x=function(){(l.st.focus?l.content.find(l.st.focus).eq(0):l.wrap).focus()},y=function(b){if(b!==t||!l.currTemplate.closeBtn)l.currTemplate.closeBtn=a(l.st.closeMarkup.replace("%title%",l.st.tClose)),t=b;return l.currTemplate.closeBtn};m.prototype={constructor:m,init:function(){var b=navigator.appVersion;l.isIE7=b.indexOf("MSIE 7.")!==-1,l.isAndroid=/android/gi.test(b),l.isIOS=/iphone|ipad|ipod/gi.test(b),l.probablyMobile=l.isAndroid||l.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),p=a(document.body),q=a(document),l.popupsCache={}},open:function(b){if(l.isOpen)return;var c;l.types=[],s="",l.ev=b.el||q;if(b.isObj)l.index=b.index||0;else{l.index=0;var f=b.items,g;for(c=0;c<f.length;c++){g=f[c],g.parsed&&(g=g.el[0]);if(g===b.el[0]){l.index=c;break}}}b.key?(l.popupsCache[b.key]||(l.popupsCache[b.key]={}),l.currTemplate=l.popupsCache[b.key]):l.currTemplate={},l.st=a.extend(!0,{},a.magnificPopup.defaults,b),l.fixedContentPos=l.st.fixedContentPos==="auto"?!l.probablyMobile:l.st.fixedContentPos,l.items=b.items.length?b.items:[b.items],l.bgOverlay||(l.bgOverlay=v("bg").on("click"+h,function(){l.close()}),l.wrap=v("wrap").attr("tabindex",-1).on("click"+h,function(b){var c=b.target;if(a(c).hasClass(k))return;l.st.closeOnContentClick?l.close():(!l.content||a(c).hasClass("mfp-close")||l.preloader&&b.target===l.preloader[0]||c!==l.content[0]&&!a.contains(l.content[0],c))&&l.close()}),l.container=v("container",l.wrap)),l.contentContainer=v("content"),l.st.preloader&&(l.preloader=v("preloader",l.container,l.st.tLoading));var j=a.magnificPopup.modules;for(c=0;c<j.length;c++){var m=j[c];m=m.charAt(0).toUpperCase()+m.slice(1),l["init"+m].call(l)}w("BeforeOpen"),l.st.closeBtnInside?(u(d,function(a,b,c,d){c.close_replaceWith=y(d.type)}),s+=" mfp-close-btn-in"):l.wrap.append(y()),l.st.alignTop&&(s+=" mfp-align-top"),l.fixedContentPos?l.wrap.css({overflow:l.st.overflowY,overflowX:"hidden",overflowY:l.st.overflowY}):l.wrap.css({top:o.scrollTop(),position:"absolute"}),(l.st.fixedBgPos===!1||l.st.fixedBgPos==="auto"&&!l.fixedContentPos)&&l.bgOverlay.css({height:q.height(),position:"absolute"}),q.on("keyup"+h,function(a){a.keyCode===27&&l.close()}),o.on("resize"+h,function(){l.updateSize()}),l.st.closeOnContentClick||(s+=" mfp-auto-cursor"),s&&l.wrap.addClass(s);var n=l.wH=o.height(),r={};if(l.fixedContentPos&&l.st.overflowY!=="scroll"){var t=l._getScrollbarSize();t&&(r.paddingRight=t)}l.fixedContentPos&&(l.isIE7?a("body, html").css("overflow","hidden"):r.overflow="hidden");var z=l.st.mainClass;l.isIE7&&(z+=" mfp-ie7"),z&&l._addClassToMFP(z),l.updateItemHTML(),w("BuildControls"),p.css(r),l.bgOverlay.add(l.wrap).prependTo(document.body),l._lastFocusedEl=document.activeElement,setTimeout(function(){l.content?(l._addClassToMFP(i),x()):l.bgOverlay.addClass(i),q.on("focusin"+h,function(b){if(b.target!==l.wrap[0]&&!a.contains(l.wrap[0],b.target))return x(),!1})},16),l.isOpen=!0,l.updateSize(n),w(e)},close:function(){if(!l.isOpen)return;l.isOpen=!1,l.st.removalDelay?(l._addClassToMFP(j),setTimeout(function(){l._close()},l.st.removalDelay)):l._close()},_close:function(){w(b);var c=j+" "+i+" ";l.bgOverlay.detach(),l.wrap.detach(),l.container.empty(),l.st.mainClass&&(c+=l.st.mainClass+" "),l._removeClassFromMFP(c);if(l.fixedContentPos){var d={paddingRight:0};l.isIE7?a("body, html").css("overflow","auto"):d.overflow="visible",p.css(d)}q.off("keyup"+h+" focusin"+h),l.ev.off(h),l.wrap.attr("class","mfp-wrap").removeAttr("style"),l.bgOverlay.attr("class","mfp-bg"),l.container.attr("class","mfp-container"),(!l.st.closeBtnInside||l.currTemplate[l.currItem.type]===!0)&&l.currTemplate.closeBtn&&l.currTemplate.closeBtn.detach(),l._lastFocusedEl&&a(l._lastFocusedEl).focus(),l.content=null,l.currTemplate=null,l.prevHeight=0},updateSize:function(a){if(l.isIOS){var b=document.documentElement.clientWidth/window.innerWidth,c=window.innerHeight*b;l.wrap.css("height",c),l.wH=c}else l.wH=a||o.height();w("Resize")},updateItemHTML:function(){var b=l.items[l.index];l.contentContainer.detach(),l.content&&l.content.detach(),b.parsed||(b=l.parseEl(l.index)),l.currItem=b;var c=b.type;if(!l.currTemplate[c]){var d=l.st[c]?l.st[c].markup:!1;w("FirstMarkupParse",d),d?l.currTemplate[c]=a(d):l.currTemplate[c]=!0}r&&r!==b.type&&l.container.removeClass("mfp-"+r+"-holder");var e=l["get"+c.charAt(0).toUpperCase()+c.slice(1)](b,l.currTemplate[c]);l.appendContent(e,c),b.preloaded=!0,w(f,b),r=b.type,l.container.prepend(l.contentContainer)},appendContent:function(a,b){l.content=a,a?l.st.closeBtnInside&&l.currTemplate[b]===!0?l.content.find(".mfp-close").length||l.content.append(y()):l.content=a:l.content="",w(c),l.container.addClass("mfp-"+b+"-holder"),l.contentContainer.append(l.content)},parseEl:function(b){var c=l.items[b],d=c.type;c.tagName?c={el:a(c)}:c={data:c,src:c.src};if(c.el){var e=l.types;for(var f=0;f<e.length;f++)if(c.el.hasClass("mfp-"+e[f])){d=e[f];break}c.src=c.el.attr("data-mfp-src"),c.src||(c.src=c.el.attr("href"))}return c.type=d||l.st.type,c.index=b,c.parsed=!0,l.items[b]=c,w("ElementParse",c),l.items[b]},addGroup:function(b,c){var d=function(d){var e=c.midClick!==undefined?c.midClick:a.magnificPopup.defaults.midClick;if(e||d.which!==2){var f=c.disableOn!==undefined?c.disableOn:a.magnificPopup.defaults.disableOn;if(f)if(a.isFunction(f)){if(!f.call(l))return!0}else if(a(window).width()<f)return!0;d.preventDefault(),c.el=a(this),c.mainEl=b,c.delegate&&(c.items=b.find(c.delegate)),l.open(c)}};c||(c={});var e="click.magnificPopup";c.items?(c.isObj=!0,b.off(e).on(e,d)):(c.isObj=!1,c.delegate?b.off(e).on(e,c.delegate,d):(c.items=b,b.off(e).on(e,d)))},updateStatus:function(a,b){if(l.preloader){n!==a&&l.container.removeClass("mfp-s-"+n),!b&&a==="loading"&&(b=l.st.tLoading);var c={status:a,text:b};w("UpdateStatus",c),a=c.status,b=c.text,l.preloader.html(b),l.preloader.find("a").click(function(a){a.stopImmediatePropagation()}),l.container.addClass("mfp-s-"+a),n=a}},_addClassToMFP:function(a){l.bgOverlay.addClass(a),l.wrap.addClass(a)},_removeClassFromMFP:function(a){this.bgOverlay.removeClass(a),l.wrap.removeClass(a)},_hasScrollBar:function(a){return document.body.clientHeight>(a||o.height())?!0:!1},_parseMarkup:function(b,c,e){var f;e.data&&(c=a.extend(e.data,c)),w(d,[b,c,e]),a.each(c,function(a,c){if(c===undefined||c===!1)return!0;f=a.split("_");if(f.length>1){var d=b.find(h+"-"+f[0]);if(d.length>0){var e=f[1];e==="replaceWith"?d[0]!==c[0]&&d.replaceWith(c):e==="img"?d.is("img")?d.attr("src",c):d.replaceWith('<img src="'+c+'" class="'+d.attr("class")+'" />'):d.attr(f[1],c)}}else b.find(h+"-"+a).html(c)})},_getScrollbarSize:function(){if(l.scrollbarSize===undefined){var a=document.createElement("div");a.id="mfp-sbm",a.style.cssText="width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(a),l.scrollbarSize=a.offsetWidth-a.clientWidth,document.body.removeChild(a)}return l.scrollbarSize}},a.magnificPopup={instance:null,proto:m.prototype,modules:[],open:function(b,c){return a.magnificPopup.instance||(l=new m,l.init(),a.magnificPopup.instance=l),b||(b={}),b.isObj=!0,b.index=c===undefined?0:c,this.instance.open(b)},close:function(){return a.magnificPopup.instance.close()},registerModule:function(b,c){c.options&&(a.magnificPopup.defaults[b]=c.options),a.extend(this.proto,c.proto),this.modules.push(b)},defaults:{disableOn:0,key:null,midClick:!1,mainClass:"",preloader:!0,focus:"",closeOnContentClick:!1,closeBtnInside:!0,alignTop:!1,removalDelay:0,fixedContentPos:"auto",fixedBgPos:"auto",overflowY:"auto",closeMarkup:'<button title="%title%" type="button" class="mfp-close">&times;</button>',tClose:"Close (Esc)",tLoading:"Loading..."}},a.fn.magnificPopup=function(b){return a.magnificPopup.instance||(l=new m,l.init(),a.magnificPopup.instance=l),l.addGroup(a(this),b),a(this)};var z,A=function(b){if(b.data&&b.data.title!==undefined)return b.data.title;var c=l.st.image.titleSrc;if(c){if(a.isFunction(c))return c.call(l,b);if(b.el)return b.el.attr(c)||""}return""};a.magnificPopup.registerModule("image",{options:{markup:'<div class="mfp-figure"><div class="mfp-close"></div><div class="mfp-img"></div><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></div>',cursor:"mfp-zoom-out-cur",titleSrc:"title",verticalFit:!0,tError:'<a href="%url%">The image</a> could not be loaded.'},proto:{initImage:function(){var a=l.st.image,c=".image";l.types.push("image"),u(e+c,function(){l.currItem.type==="image"&&a.cursor&&p.addClass(a.cursor)}),u(b+c,function(){a.cursor&&p.removeClass(a.cursor),o.off("resize"+h)}),u("Resize"+c,function(){l.resizeImage()})},resizeImage:function(){var a=l.currItem;if(!a.img)return;l.st.image.verticalFit&&a.img.css("max-height",l.wH+"px")},_onImageHasSize:function(a){a.img&&(a.hasSize=!0,z&&clearInterval(z),a.isCheckingImgSize=!1,w("ImageHasSize",a),a.imgHidden&&(l.content&&l.content.removeClass("mfp-loading"),a.imgHidden=!1))},findImageSize:function(a){var b=0,c=a.img[0],d=function(e){z&&clearInterval(z),z=setInterval(function(){if(c.naturalWidth>0){l._onImageHasSize(a);return}b>200&&clearInterval(z),b++,b===3?d(10):b===40?d(50):b===100&&d(500)},e)};d(1)},getImage:function(b,c){var d=0,e=function(){b&&(b.img[0].complete?(b.img.off(".mfploader"),b===l.currItem&&(l._onImageHasSize(b),l.updateStatus("ready")),b.hasSize=!0,b.loaded=!0):(d++,d<200?setTimeout(e,100):f()))},f=function(){b&&(b.img.off(".mfploader"),b===l.currItem&&(l._onImageHasSize(b),l.updateStatus("error",g.tError.replace("%url%",b.src))),b.hasSize=!0,b.loaded=!0,b.loadError=!0)},g=l.st.image,h=c.find(".mfp-img");if(h.length){var i=new Image;i.className="mfp-img",b.img=a(i).on("load.mfploader",e).on("error.mfploader",f),i.src=b.src,h.is("img")&&(b.img=b.img.clone())}return l._parseMarkup(c,{title:A(b),img_replaceWith:b.img},b),l.resizeImage(),b.hasSize?(z&&clearInterval(z),b.loadError?(c.addClass("mfp-loading"),l.updateStatus("error",g.tError.replace("%url%",b.src))):(c.removeClass("mfp-loading"),l.updateStatus("ready")),c):(l.updateStatus("loading"),b.loading=!0,b.hasSize||(b.imgHidden=!0,c.addClass("mfp-loading"),l.findImageSize(b)),c)}}});var B="iframe",C=function(a){if(l.isIE7&&l.currItem&&l.currItem.type===B){var b=l.content.find("iframe");b.length&&b.css("display",a?"block":"none")}};a.magnificPopup.registerModule(B,{options:{markup:'<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe></div>',srcAction:"iframe_src",patterns:{youtube:{index:"youtube.com",id:"v=",src:"//www.youtube.com/embed/%id%?autoplay=1"},vimeo:{index:"vimeo.com/",id:"/",src:"//player.vimeo.com/video/%id%?autoplay=1"},gmaps:{index:"//maps.google.",src:"%id%&output=embed"}}},proto:{initIframe:function(){l.types.push(B),C(!0),u(b+"."+B,function(){C()})},getIframe:function(b,c){var d=b.src,e=l.st.iframe;a.each(e.patterns,function(){if(d.indexOf(this.index)>-1)return this.id&&(typeof this.id=="string"?d=d.substr(d.lastIndexOf(this.id)+this.id.length,d.length):d=this.id.call(this,d)),d=this.src.replace("%id%",d),!1});var f={};return e.srcAction&&(f[e.srcAction]=d),l._parseMarkup(c,f,b),l.updateStatus("ready"),c}}})})(window.jQuery||window.Zepto)
;
$(document).ready(function() {

    // Add spin.js to lazy load container

    $('.lazy-container').spin({
        color: '#000'
    });

    // Lazy loading. 
    $("img.lazy").lazyload({
        // The image starts loading 200 px before it is in viewport
        threshold: 200,
        // Remove the line if you don`t need fade effect.
        effect: "fadeIn",
        // Change this for fade in speed
        effectspeed: 600,
        //  Hide spinner when loaded
        load: function(elements_left, settings) {
            $(".lazy-container").has(this).addClass('loaded');
            $(".loaded .spinner").remove();
            // refresh bootstrap scrollspy, when image is loaded
            $('[data-spy="scroll"]').each(function() {
                var $spy = $(this).scrollspy('refresh')
            });
        }
    });

    // Lightbox

    $('.lightbox').magnificPopup({
        type: 'image',
        disableOn: function() {
            // Detect here whether you want to show the popup
            // return true if you want
            if ($(window).width() < 500) {
                return false;
            }
            return true;
        },
        preloader: true,
        tLoading: 'Loading',

        // Delay in milliseconds before popup is removed
        removalDelay: 300,
        mainClass: 'mfp-fade',
        callbacks: {
            open: function() {
                $('.navbar').fadeOut('slow');
            },
            close: function() {
                $('.navbar').fadeIn('slow');
            }
        }
    });

    // Lightbox video/maps

    $(' .iframe').magnificPopup({
        type: 'iframe',
        mainClass: 'mfp-fad',
        disableOn: function() {
            if ($(window).width() < 500) {
                return false;
            }
            return true;
        },
        preloader: true,

        callbacks: {
            open: function() {
                $('.navbar').fadeOut('slow');
            },
            close: function() {
                $('.navbar').fadeIn('slow');
            }
        }
    });

    // .scroll class for link scrolling.

    $('.scroll[href^="#"]').bind('click.smoothscroll', function(e) {
        e.preventDefault();
        var target = this.hash;
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top
        }, 900, 'swing', function() {
            window.location.hash = target;
        });

    });

    // Change icons on accardion

    $('.collapse').on('show.bs.collapse', function() {
        $(this).parent().find(".icon-plus").removeClass("icon-plus").addClass("icon-minus");
        $(this).parent().find(".panel-heading").addClass("active");
    }).on('hide.bs.collapse', function() {
        $(this).parent().find(".icon-minus").removeClass("icon-minus").addClass("icon-plus");
        $(this).parent().find(".panel-heading").removeClass("active");
    });

    // Close menu when in mobile view clicked
    $('.nav .scroll').click(function(e) {
        if ($('.navbar-toggle').is(":visible"))
        $("#nav-collapse").removeClass("in").addClass("collapse");
    });
});
/*!
 * @namejQuery.history v1.0.1
 * @author yeikos
 * @repository https://github.com/yeikos/jquery.history
 * @dependencies jQuery 1.7.0+

 * Copyright 2013 yeikos - MIT license
 * https://raw.github.com/yeikos/js.merge/master/LICENSE
 */


;(function($, undefined) {

	var Public = function(url) {

		// Establecemos la nueva dirección siempre y cuando ésta haya cambiado

		if (_type === 'pathname') {

			if (_last !== url)

				window.history.pushState({}, null, _last = url);

		} else if (_type === 'hash') {

			if (_last !== url) {

				_last = location.hash = url;

				// Si se trata de IE6/IE7

				if (_ie67) {

					// El `iframe` ha de encontrarse en el documento

					if (!$('#jQueryHistory').length)

						throw new Error('jQuery.' + publicName + '.push: iframe not found.');

					// Si es la primera vez

					if (_firstTime) {

						_firstTime = 0;

						// Añadimos primero al historial una entrada vacía para que el usuario
						// pueda volver al inicio de página, de lo contrario saldrá fuera de ella

						_iframe.contentWindow.document.open().close();
						_iframe.contentWindow.location.hash = '/';

					}

					// Cambiamos la dirección del `iframe` para simular el historial

					_iframe.contentWindow.document.open().close();

					_iframe.contentWindow.location.hash = url;

				}

			}

		} else {

			// Es necesario que se haya iniciado una escucha activa para establecer una dirección

			throw new Error('jQuery.' + publicName + '.push: listener is not active.');

		}

		Public.context.trigger('push', [url, _type]);

		return Public;

	}, publicName = 'history';

	// Contexto donde se centralizan los eventos (`load`, `change`, `push`)

	Public.context = $({});

	// Accesos directos a los métodos `on`, `off` y `trigger`

	$.each(['on', 'off', 'trigger'], function(index, method) {

		Public[method] = function() {

			Public.context[method].apply(Public.context, arguments);

			return Public;

		};

	});

	// Acceso directo a la función principal

	Public.push = Public;

	// Obtiene el tipo de escucha actual (`pathname`, `hash`, `null`)

	Public.getListenType = function() {

		return _type;

	};

	// Inicializa una escucha en el documento para intervenir los cambios del historial y poder establecer direcciones

	Public.listen = function(type, interval) {

		// Desactivamos posibles escuchas anteriores

		Public.unlisten();

		var size = arguments.length;

		// Detección automática del modo de escucha

		if (!size || type === 'auto') {

			type = _pushState ? 'pathname' : 'hash';

			size = 1;

		} else if (type !== 'pathname' && type !== 'hash') {

			throw new Error('jQuery.' + publicName + '.listen: type is not valid.');

		}

		// Si el modo de escucha es `hash`

		if (type === 'hash') {

			// Si no hay soporte para `onhaschange` y no se especificó un intervalo, o el intervalo es `true`

			if ((!_onhashchange && size === 1) || interval === true) {

				// Establecemos el intervalo de la configuración

				interval = Public.config.interval;

				size = 2;

			}

			// Si el intervalo fue fijado comprobamos si su valor es correcto

			if (size === 2 && (isNaN(interval) || interval < 1))

				throw new Error('jQuery.' + publicName + '.listen: interval delay is not valid.');

		}

		// Si el modo de escucha es `pathname`

		if ((_type = type) === 'pathname') {

			// Ha de haber soporte nativo

			if (!_pushState)

				throw new Error('jQuery.' + publicName + '.listen: this browser has not support to pushState.');

			// Cuando haya un cambio en la dirección URL

			$(window).on('popstate.history', function(event) {

				// Si se trata de un evento real originado internamente por el navegador
				// y la dirección ha cambiado emitimos el evento `change`

				if (event.originalEvent && event.originalEvent.state && _last !== location.pathname)

					Public.trigger('change', [_last = location.pathname, 'pathname']);

			});

			if (location.pathname.length > 1)

				Public.trigger('load', [location.pathname + location.search + location.hash, 'pathname']);

		} else {

			// Si hay soporte nativo de `onhashchange` y no se especificó el argumento intervalo

			if (_onhashchange && !interval) {

				// Hacemos uso del evento nativo `hashchange`

				$(window).on('hashchange.history', function(event) {

					var hash = location.hash.substr(1);

					if (_last !== hash)

						Public.trigger('change', [_last = hash, 'hash']);

				});

			// Si no hay soporte o simplemente se especificó el argumento intervalo

			} else {

				// Si no se ha detecto si el navegador es IE6/IE67

				if (_ie67 === undefined)

					// Realizamos la comprobación una sola vez

					_ie67 = Public.isIE67();

				// Si se trata de IE6/IE7

				if (_ie67) {

					// Es necesario que se encuentre disponible `body` (dom ready)

					if (!(size = $('body')).length)

						throw new Error('jQuery.' + publicName + '.listen: document is not ready.');

					// Creamos un `iframe` con el que emular el historial

					_iframe = $('<iframe id="jQueryHistory" style="display:none" src="javascript:void(0);" />').appendTo(size)[0];

					var win = _iframe.contentWindow;

					// Si el documento ya contiene una dirección, la establecemos en el `iframe`

					if (location.hash.length > 1) {

						win.document.open().close();

						win.location.hash = location.hash;

					}

					// Emulamos el evento `haschange` mediante un intervalo

					_interval = setInterval(function() {

						// Si la dirección actual es diferente a la del `iframe`

						if ((_last = location.hash) !== win.location.hash) {

							// Actualizamos la dirección del `iframe`

							win.document.open().close();

							win.location.hash = _last;

							Public.trigger('change', [_last.substr(1), 'hash']);

						}

					}, interval);

				} else {

					// Emulamos el evento `haschange` mediante un intervalo

					_last = location.hash.substr(1);

					_interval = setInterval(function() {

						var hash = location.hash.substr(1);

						if (_last !== hash)

							Public.trigger('change', [_last = hash, 'hash']);

					}, interval);

				}

			}

			// Si ya se encuentra un `hash` definido en el documento

			if (location.hash.length > 1)

				// Emitimos el evento `load`

				Public.trigger('load', [location.hash.substr(1), 'hash']);

		}

		return Public;

	};

	// Desactiva cualquier tipo de escucha realizada por `History.listen`

	Public.unlisten = function() {

		_type = _last = _iframe = null;

		$(window).off('popstate.history hashchange.history');

		$('#jQueryHistory').remove();

		clearInterval(_interval);

		return Public;

	};

	// Obtiene el soporte de ciertas funcionalidades del navegador

	Public.getSupports = function(type) {

		var result = {},

			size = arguments.length,

			docmode;

		if (!size || type === 'pushState')

			result.pushState = ('pushState' in window.history);

		if (!size || type === 'onhashchange')

			result.onhashchange = ('onhashchange' in window && ((docmode = document.documentMode) === undefined || docmode > 7 ));

		if (size)

			return result[type];

		return result;

	};

	// Comprueba si el navegador es IE6/IE7

	Public.isIE67 = function() {

		var name = '_history_msie',

			$msie, result;

		window[name] = false;

		$msie =	$('<span><!--[if lte IE 7]><script type="text/javascript">window.' + name + '=true;</script><![endif]--></span>').appendTo('body');

		result = (window[name] === true);

		try {

			delete window[name];

		} catch(e) {

			window[name] = undefined;

		}

		$msie.remove();

		return result;

	};

	// Soporte de funcionalidades del navegador

	Public.supports = Public.getSupports();

	// Configuración

	Public.config = {

		// Retraso del intervalo en la emulación del evento `haschange`

		interval: 100

	};

	// Accesos directos a los soportes

	var _pushState = Public.supports.pushState,

		_onhashchange = Public.supports.onhashchange,

		_ie67,

	// Tipo actual de escucha

		_type = null,

	// Intervalo utilizado por la emulación del evento `hashchange`

		_interval,

	// Iframe utilizado para generar el historial en IE6/IE7

		_iframe,

	// Marcador utilizado por IE6/IE7

		_firstTime = 1,

	// Última dirección establecida

		_last;

	// Acceso desde al exterior

	$[publicName] = Public;

})(jQuery);
/*!
 * jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Script: jQuery hashchange event
//
// *Version: 1.3, Last updated: 7/21/2010*
// 
// Project Home - http://benalman.com/projects/jquery-hashchange-plugin/
// GitHub       - http://github.com/cowboy/jquery-hashchange/
// Source       - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.js
// (Minified)   - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.min.js (0.8kb gzipped)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// These working examples, complete with fully commented code, illustrate a few
// ways in which this plugin can be used.
// 
// hashchange event - http://benalman.com/code/projects/jquery-hashchange/examples/hashchange/
// document.domain - http://benalman.com/code/projects/jquery-hashchange/examples/document_domain/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
// 
// jQuery Versions - 1.2.6, 1.3.2, 1.4.1, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-4, Chrome 5-6, Safari 3.2-5,
//                   Opera 9.6-10.60, iPhone 3.1, Android 1.6-2.2, BlackBerry 4.6-5.
// Unit Tests      - http://benalman.com/code/projects/jquery-hashchange/unit/
// 
// About: Known issues
// 
// While this jQuery hashchange event implementation is quite stable and
// robust, there are a few unfortunate browser bugs surrounding expected
// hashchange event-based behaviors, independent of any JavaScript
// window.onhashchange abstraction. See the following examples for more
// information:
// 
// Chrome: Back Button - http://benalman.com/code/projects/jquery-hashchange/examples/bug-chrome-back-button/
// Firefox: Remote XMLHttpRequest - http://benalman.com/code/projects/jquery-hashchange/examples/bug-firefox-remote-xhr/
// WebKit: Back Button in an Iframe - http://benalman.com/code/projects/jquery-hashchange/examples/bug-webkit-hash-iframe/
// Safari: Back Button from a different domain - http://benalman.com/code/projects/jquery-hashchange/examples/bug-safari-back-from-diff-domain/
// 
// Also note that should a browser natively support the window.onhashchange 
// event, but not report that it does, the fallback polling loop will be used.
// 
// About: Release History
// 
// 1.3   - (7/21/2010) Reorganized IE6/7 Iframe code to make it more
//         "removable" for mobile-only development. Added IE6/7 document.title
//         support. Attempted to make Iframe as hidden as possible by using
//         techniques from http://www.paciellogroup.com/blog/?p=604. Added 
//         support for the "shortcut" format $(window).hashchange( fn ) and
//         $(window).hashchange() like jQuery provides for built-in events.
//         Renamed jQuery.hashchangeDelay to <jQuery.fn.hashchange.delay> and
//         lowered its default value to 50. Added <jQuery.fn.hashchange.domain>
//         and <jQuery.fn.hashchange.src> properties plus document-domain.html
//         file to address access denied issues when setting document.domain in
//         IE6/7.
// 1.2   - (2/11/2010) Fixed a bug where coming back to a page using this plugin
//         from a page on another domain would cause an error in Safari 4. Also,
//         IE6/7 Iframe is now inserted after the body (this actually works),
//         which prevents the page from scrolling when the event is first bound.
//         Event can also now be bound before DOM ready, but it won't be usable
//         before then in IE6/7.
// 1.1   - (1/21/2010) Incorporated document.documentMode test to fix IE8 bug
//         where browser version is incorrectly reported as 8.0, despite
//         inclusion of the X-UA-Compatible IE=EmulateIE7 meta tag.
// 1.0   - (1/9/2010) Initial Release. Broke out the jQuery BBQ event.special
//         window.onhashchange functionality into a separate plugin for users
//         who want just the basic event & back button support, without all the
//         extra awesomeness that BBQ provides. This plugin will be included as
//         part of jQuery BBQ, but also be available separately.

(function($,window,undefined){
  '$:nomunge'; // Used by YUI compressor.
  
  // Reused string.
  var str_hashchange = 'hashchange',
    
    // Method / object references.
    doc = document,
    fake_onhashchange,
    special = $.event.special,
    
    // Does the browser support window.onhashchange? Note that IE8 running in
    // IE7 compatibility mode reports true for 'onhashchange' in window, even
    // though the event isn't supported, so also test document.documentMode.
    doc_mode = doc.documentMode,
    supports_onhashchange = 'on' + str_hashchange in window && ( doc_mode === undefined || doc_mode > 7 );
  
  // Get location.hash (or what you'd expect location.hash to be) sans any
  // leading #. Thanks for making this necessary, Firefox!
  function get_fragment( url ) {
    url = url || location.href;
    return '#' + url.replace( /^[^#]*#?(.*)$/, '$1' );
  };
  
  // Method: jQuery.fn.hashchange
  // 
  // Bind a handler to the window.onhashchange event or trigger all bound
  // window.onhashchange event handlers. This behavior is consistent with
  // jQuery's built-in event handlers.
  // 
  // Usage:
  // 
  // > jQuery(window).hashchange( [ handler ] );
  // 
  // Arguments:
  // 
  //  handler - (Function) Optional handler to be bound to the hashchange
  //    event. This is a "shortcut" for the more verbose form:
  //    jQuery(window).bind( 'hashchange', handler ). If handler is omitted,
  //    all bound window.onhashchange event handlers will be triggered. This
  //    is a shortcut for the more verbose
  //    jQuery(window).trigger( 'hashchange' ). These forms are described in
  //    the <hashchange event> section.
  // 
  // Returns:
  // 
  //  (jQuery) The initial jQuery collection of elements.
  
  // Allow the "shortcut" format $(elem).hashchange( fn ) for binding and
  // $(elem).hashchange() for triggering, like jQuery does for built-in events.
  $.fn[ str_hashchange ] = function( fn ) {
    return fn ? this.bind( str_hashchange, fn ) : this.trigger( str_hashchange );
  };
  
  // Property: jQuery.fn.hashchange.delay
  // 
  // The numeric interval (in milliseconds) at which the <hashchange event>
  // polling loop executes. Defaults to 50.
  
  // Property: jQuery.fn.hashchange.domain
  // 
  // If you're setting document.domain in your JavaScript, and you want hash
  // history to work in IE6/7, not only must this property be set, but you must
  // also set document.domain BEFORE jQuery is loaded into the page. This
  // property is only applicable if you are supporting IE6/7 (or IE8 operating
  // in "IE7 compatibility" mode).
  // 
  // In addition, the <jQuery.fn.hashchange.src> property must be set to the
  // path of the included "document-domain.html" file, which can be renamed or
  // modified if necessary (note that the document.domain specified must be the
  // same in both your main JavaScript as well as in this file).
  // 
  // Usage:
  // 
  // jQuery.fn.hashchange.domain = document.domain;
  
  // Property: jQuery.fn.hashchange.src
  // 
  // If, for some reason, you need to specify an Iframe src file (for example,
  // when setting document.domain as in <jQuery.fn.hashchange.domain>), you can
  // do so using this property. Note that when using this property, history
  // won't be recorded in IE6/7 until the Iframe src file loads. This property
  // is only applicable if you are supporting IE6/7 (or IE8 operating in "IE7
  // compatibility" mode).
  // 
  // Usage:
  // 
  // jQuery.fn.hashchange.src = 'path/to/file.html';
  
  $.fn[ str_hashchange ].delay = 50;
  /*
  $.fn[ str_hashchange ].domain = null;
  $.fn[ str_hashchange ].src = null;
  */
  
  // Event: hashchange event
  // 
  // Fired when location.hash changes. In browsers that support it, the native
  // HTML5 window.onhashchange event is used, otherwise a polling loop is
  // initialized, running every <jQuery.fn.hashchange.delay> milliseconds to
  // see if the hash has changed. In IE6/7 (and IE8 operating in "IE7
  // compatibility" mode), a hidden Iframe is created to allow the back button
  // and hash-based history to work.
  // 
  // Usage as described in <jQuery.fn.hashchange>:
  // 
  // > // Bind an event handler.
  // > jQuery(window).hashchange( function(e) {
  // >   var hash = location.hash;
  // >   ...
  // > });
  // > 
  // > // Manually trigger the event handler.
  // > jQuery(window).hashchange();
  // 
  // A more verbose usage that allows for event namespacing:
  // 
  // > // Bind an event handler.
  // > jQuery(window).bind( 'hashchange', function(e) {
  // >   var hash = location.hash;
  // >   ...
  // > });
  // > 
  // > // Manually trigger the event handler.
  // > jQuery(window).trigger( 'hashchange' );
  // 
  // Additional Notes:
  // 
  // * The polling loop and Iframe are not created until at least one handler
  //   is actually bound to the 'hashchange' event.
  // * If you need the bound handler(s) to execute immediately, in cases where
  //   a location.hash exists on page load, via bookmark or page refresh for
  //   example, use jQuery(window).hashchange() or the more verbose 
  //   jQuery(window).trigger( 'hashchange' ).
  // * The event can be bound before DOM ready, but since it won't be usable
  //   before then in IE6/7 (due to the necessary Iframe), recommended usage is
  //   to bind it inside a DOM ready handler.
  
  // Override existing $.event.special.hashchange methods (allowing this plugin
  // to be defined after jQuery BBQ in BBQ's source code).
  special[ str_hashchange ] = $.extend( special[ str_hashchange ], {
    
    // Called only when the first 'hashchange' event is bound to window.
    setup: function() {
      // If window.onhashchange is supported natively, there's nothing to do..
      if ( supports_onhashchange ) { return false; }
      
      // Otherwise, we need to create our own. And we don't want to call this
      // until the user binds to the event, just in case they never do, since it
      // will create a polling loop and possibly even a hidden Iframe.
      $( fake_onhashchange.start );
    },
    
    // Called only when the last 'hashchange' event is unbound from window.
    teardown: function() {
      // If window.onhashchange is supported natively, there's nothing to do..
      if ( supports_onhashchange ) { return false; }
      
      // Otherwise, we need to stop ours (if possible).
      $( fake_onhashchange.stop );
    }
    
  });
  
  // fake_onhashchange does all the work of triggering the window.onhashchange
  // event for browsers that don't natively support it, including creating a
  // polling loop to watch for hash changes and in IE 6/7 creating a hidden
  // Iframe to enable back and forward.
  fake_onhashchange = (function(){
    var self = {},
      timeout_id,
      
      // Remember the initial hash so it doesn't get triggered immediately.
      last_hash = get_fragment(),
      
      fn_retval = function(val){ return val; },
      history_set = fn_retval,
      history_get = fn_retval;
    
    // Start the polling loop.
    self.start = function() {
      timeout_id || poll();
    };
    
    // Stop the polling loop.
    self.stop = function() {
      timeout_id && clearTimeout( timeout_id );
      timeout_id = undefined;
    };
    
    // This polling loop checks every $.fn.hashchange.delay milliseconds to see
    // if location.hash has changed, and triggers the 'hashchange' event on
    // window when necessary.
    function poll() {
      var hash = get_fragment(),
        history_hash = history_get( last_hash );
      
      if ( hash !== last_hash ) {
        history_set( last_hash = hash, history_hash );
        
        $(window).trigger( str_hashchange );
        
      } else if ( history_hash !== last_hash ) {
        location.href = location.href.replace( /#.*/, '' ) + history_hash;
      }
      
      timeout_id = setTimeout( poll, $.fn[ str_hashchange ].delay );
    };

    
    return self;
  })();
  
})(jQuery,this);
/*
 HTML5 Shiv v3.6.2pre | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/

(function(l,f){function m(){var a=e.elements;return"string"==typeof a?a.split(" "):a}function i(a){var b=n[a[o]];b||(b={},h++,a[o]=h,n[h]=b);return b}function p(a,b,c){b||(b=f);if(g)return b.createElement(a);c||(c=i(b));b=c.cache[a]?c.cache[a].cloneNode():r.test(a)?(c.cache[a]=c.createElem(a)).cloneNode():c.createElem(a);return b.canHaveChildren&&!s.test(a)?c.frag.appendChild(b):b}function t(a,b){if(!b.cache)b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag();
a.createElement=function(c){return!e.shivMethods?b.createElem(c):p(c,a,b)};a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m().join().replace(/\w+/g,function(a){b.createElem(a);b.frag.createElement(a);return'c("'+a+'")'})+");return n}")(e,b.frag)}function q(a){a||(a=f);var b=i(a);if(e.shivCSS&&!j&&!b.hasCSS){var c,d=a;c=d.createElement("p");d=d.getElementsByTagName("head")[0]||d.documentElement;c.innerHTML="x<style>article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}</style>";
c=d.insertBefore(c.lastChild,d.firstChild);b.hasCSS=!!c}g||t(a,b);return a}var k=l.html5||{},s=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,r=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,j,o="_html5shiv",h=0,n={},g;(function(){try{var a=f.createElement("a");a.innerHTML="<xyz></xyz>";j="hidden"in a;var b;if(!(b=1==a.childNodes.length)){f.createElement("a");var c=f.createDocumentFragment();b="undefined"==typeof c.cloneNode||
"undefined"==typeof c.createDocumentFragment||"undefined"==typeof c.createElement}g=b}catch(d){g=j=!0}})();var e={elements:k.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",version:"3.6.2pre",shivCSS:!1!==k.shivCSS,supportsUnknownElements:g,shivMethods:!1!==k.shivMethods,type:"default",shivDocument:q,createElement:p,createDocumentFragment:function(a,b){a||(a=f);if(g)return a.createDocumentFragment();
for(var b=b||i(a),c=b.frag.cloneNode(),d=0,e=m(),h=e.length;d<h;d++)c.createElement(e[d]);return c}};l.html5=e;q(f)})(this,document);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.















$(function() {
    $("#locations_search input").keyup(function() {
        $.get($("#locations_search").attr("action"), $("#locations_search").serialize(), null, "script");
        return false;
    });
    $(".location").click(function() {
        $(".location").not(this).removeClass('location-clicked h4');
        $(this).toggleClass('location-clicked h4');
    });
});


