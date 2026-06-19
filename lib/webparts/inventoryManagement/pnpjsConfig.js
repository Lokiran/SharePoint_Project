import { spfi, SPFx } from "@pnp/sp";
import { LogLevel, PnPLogging } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";
import "@pnp/sp/fields";
// eslint-disable-next-line no-var
var _sp;
export const getSP = (context) => {
    if (context != null) {
        // Initialize the sp object with SPFx context and logging
        _sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
    }
    return _sp;
};
//# sourceMappingURL=pnpjsConfig.js.map