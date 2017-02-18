const path = require('path');

module.exports = function(source, map) {
    this.callback(null, source, map);
};

module.exports.pitch = function(remainingRequest) {
    this.cacheable();
    return `
        var merge = require(${stringifyRequest(this, '!' + path.join(__dirname, 'merge.js'))});
        var locals = require(${stringifyRequest(this, '!!' + remainingRequest)});
        module.exports = merge(locals);
    `;
};

function stringifyRequest(loaderContext, request) {
    var splitted = request.split("!");
    var context = loaderContext.context || (loaderContext.options && loaderContext.options.context);
    return JSON.stringify(splitted.map(function(part) {
        if(/^\/|^[A-Z]:/i.test(part) && context) {
            part = path.relative(context, part);
            if(/^[A-Z]:/i.test(part)) {
                return part;
            } else {
                return "./" + part.replace(/\\/g, "/");
            }
        }
        return part;
    }).join("!"));
}
