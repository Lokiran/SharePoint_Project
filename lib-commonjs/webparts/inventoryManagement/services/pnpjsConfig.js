"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSP = void 0;
var sp_1 = require("@pnp/sp");
require("@pnp/sp/webs");
require("@pnp/sp/lists");
require("@pnp/sp/items");
require("@pnp/sp/batching");
var _sp = null;
var getSP = function (context) {
    if (_sp === null && context) {
        _sp = (0, sp_1.spfi)().using((0, sp_1.SPFx)(context));
    }
    if (_sp === null) {
        throw new Error("PnP JS has not been initialized. Ensure getSP(context) is called in onInit.");
    }
    return _sp;
};
exports.getSP = getSP;
//# sourceMappingURL=pnpjsConfig.js.map