/**
 * @type {Function}
 */
const cx = require('classnames/bind');
const assign = require('object-assign');
function merge(styles) {
    styles = mergeStyles(styles);
    // Expose a mergeStyles that returns a new object with the new classes appended
    Object.defineProperty(styles, 'mergeStyles', {
        enumerable: false,
        value: function() {
            return mergeStyles(assign({}, styles), Array.prototype.slice.apply(arguments));
        }
    });
    // Expose an importStyles that mutates THIS styles object and appends the new classes
    Object.defineProperty(styles, 'importStyles', {
        enumerable: false,
        value: function() {
            return mergeStyles(styles, Array.prototype.slice.apply(arguments));
        }
    });
    return styles;
}

function mergeStyles(styles, newStyles) {
    (function() {
        // Convert strings into an array of class names on input style object
        var keys = Object.keys(styles);
        for (var idx in keys) {
            var key = keys[idx];
            if (typeof styles[key] !== 'string') {
                continue;
            }
            styles[key] = styles[key].split(/ /);
        }
    })();

    if (newStyles) {
        // Iterate new styles, and append classes
        for (var len = newStyles.length, idx = 0; idx < len; idx++) {
            var sty = newStyles[idx];
            if (!sty) {
                continue;
            }
            var keys = Object.keys(sty);
            for (var key in keys) {
                key = keys[key];
                var val = sty[key];
                if (typeof val !== 'string') {
                    continue;
                }
                val = val.split(/ /);
                if (styles[key]) {
                    styles[key] = styles[key].concat(val);
                } else {
                    styles[key] = [key].concat(val);
                }

            }
        }
    }
    const cxStyle = cx.bind(styles);
    (function() {
        // Convert arrays back to strings and bind it to the CX object too.
        var keys = Object.keys(styles);
        for (var idx in keys) {
            var key = keys[idx];
            if (!Array.isArray(styles[key])) {
                continue;
            }
            // Ensure we have our base key in the class list. We may of received a style object that did not enforce this.
            if (styles[key].indexOf(key) === -1) {
                styles[key].unshift(key);
            }
            styles[key] = styles[key].filter(onlyUnique).join(' ');
            cxStyle[key] = styles[key];
        }
    })();

    return cxStyle;
}
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
module.exports = merge;