import { WebPartContext } from "@microsoft/sp-webpart-base";
import { spfi, SPFI, SPFx } from "@pnp/sp";
import { LogLevel, PnPLogging } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";
import "@pnp/sp/fields";

// eslint-disable-next-line no-var
var _sp: SPFI;
var _context: WebPartContext;

export const getSP = (context?: WebPartContext): SPFI => {
  if (context != null) {
    _context = context;
    // Initialize the sp object with SPFx context and logging
    _sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
  }
  return _sp;
};

export const getContext = (): WebPartContext => {
  return _context;
};
