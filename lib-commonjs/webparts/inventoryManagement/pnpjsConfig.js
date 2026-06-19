"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSP = void 0;
const sp_1 = require("@pnp/sp");
const logging_1 = require("@pnp/logging");
require("@pnp/sp/webs");
require("@pnp/sp/lists");
require("@pnp/sp/items");
require("@pnp/sp/batching");
require("@pnp/sp/fields");
// eslint-disable-next-line no-var
var _sp;
const getSP = (context) => {
    if (context != null) {
        // Initialize the sp object with SPFx context and logging
        _sp = (0, sp_1.spfi)().using((0, sp_1.SPFx)(context)).using((0, logging_1.PnPLogging)(logging_1.LogLevel.Warning));
    }
    return _sp;
};
exports.getSP = getSP;
//# sourceMappingURL=pnpjsConfig.js.map