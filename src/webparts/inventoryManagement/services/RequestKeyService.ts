// AUTO-EXTRACTED from RequestService.ts (structural refactor split).
// Shared request-key normalization / field-resolution helpers used across
// request creation, query, approval, and history lookup.
import { SharePointBaseService } from "./base/SharePointBaseService";

export class RequestKeyService {
  public static normalizeRequestKey(input: string): string {
    return (input || "").trim().toUpperCase();
  }

  public static buildRequestKeyFromItemId(itemId: number): string {
    const raw = itemId.toString();
    const padded = ("000000" + raw).slice(-6);
    return `REQ-${padded}`;
  }

  public static resolveRequestKeyInternalName(fields: any[]): string {
    const candidates = [
      "requestid",
      "requestkey",
      "request_x0020_id",
      "request_x0020_key",
      "request id"
    ];

    for (const cand of candidates) {
      const field = fields.find((f: any) => {
        const internal = (f.InternalName || "").toLowerCase();
        const title = (f.Title || "")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");
        const candNorm = cand.replace(/[^a-z0-9]/g, "");

        return (
          internal === cand ||
          internal.replace(/_x0020_/g, "") === candNorm ||
          title === candNorm
        );
      });

      if (field) {
        return field.InternalName;
      }
    }

    return SharePointBaseService.REQUEST_KEY_INTERNAL_NAME;
  }

  public static extractRequestKey(item: any): string {
    if (!item) {
      return "";
    }

    const candidates = [
      "requestkey",
      "requestid",
      "request_x0020_id",
      "request_x0020_key"
    ];

    for (const key of Object.keys(item)) {
      const normalizedKey = key
        .toLowerCase()
        .replace(/_x0020_/g, "");

      if (
        candidates.indexOf(normalizedKey) >= 0 &&
        item[key]
      ) {
        return RequestKeyService.normalizeRequestKey(
          item[key].toString()
        );
      }
    }

    if (item.ID) {
      return RequestKeyService.buildRequestKeyFromItemId(
        parseInt(item.ID.toString(), 10)
      );
    }

    return "";
  }
}
