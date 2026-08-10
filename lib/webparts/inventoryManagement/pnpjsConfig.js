import { spfi, SPFx } from "@pnp/sp";
import { LogLevel, PnPLogging } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";
import "@pnp/sp/fields";
let _sp;
let _context;
export const getSP = (context) => {
    if (context != null) {
        _context = context;
        // Initialize the sp object with SPFx context and logging
        _sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
    }
    return _sp;
};
export const getContext = () => {
    return _context;
};
//# sourceMappingURL=pnpjsConfig.js.map