"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContext = exports.getSP = void 0;
const sp_1 = require("@pnp/sp");
const logging_1 = require("@pnp/logging");
require("@pnp/sp/webs");
require("@pnp/sp/lists");
require("@pnp/sp/items");
require("@pnp/sp/batching");
require("@pnp/sp/fields");
let _sp;
let _context;
const getSP = (context) => {
    if (context != null) {
        _context = context;
        // Initialize the sp object with SPFx context and logging
        _sp = (0, sp_1.spfi)().using((0, sp_1.SPFx)(context)).using((0, logging_1.PnPLogging)(logging_1.LogLevel.Warning));
    }
    return _sp;
};
exports.getSP = getSP;
const getContext = () => {
    return _context;
};
exports.getContext = getContext;
//# sourceMappingURL=pnpjsConfig.js.map