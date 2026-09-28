import { IEventLog, IAuditLogFilters } from "../models/IEventLog";
import {
  IAssetTypeLookup,
  resolveEventAssetType,
  mergeAssetTypes,
  matchesAssetType,
  applyClientFilters,
  getPageNumbers,
  matchesUser,
  buildUserOptions
} from "../utils/EventLogUtils";

const lookup: IAssetTypeLookup = {
  byInventoryId: new Map([["12", "Monitor"], ["15", "Laptop"]]),
  byRequestId: new Map([["7", "Headset"], ["REQ-2026-0042", "Keyboard"]]),
  byAssetName: new Map([["dell p2419h", "Monitor"], ["asus tuf a15", "Laptop"]]),
  knownTypes: ["Laptop", "Monitor", "Headset", "Keyboard", "Dock"]
};

const log = (overrides: Partial<IEventLog>): IEventLog => ({
  id: "x",
  title: "",
  action: "created",
  entityType: "Asset",
  entityId: "",
  details: "",
  user: "Adele Vance",
  timestamp: "2026-09-20 10:00:00",
  ...overrides
});

const filters = (overrides: Partial<IAuditLogFilters>): IAuditLogFilters => ({
  searchQuery: "",
  dateRangeType: "All",
  action: "All",
  module: "All",
  assetType: "All",
  user: "All",
  status: "All",
  sortOrder: "NewestFirst",
  ...overrides
});

describe("resolveEventAssetType", () => {
  it("uses the inventory item's type for asset events", () => {
    expect(resolveEventAssetType(log({ entityType: "Asset", entityId: "12", assetName: "Anything" }), lookup)).toBe("Monitor");
  });

  it("uses the request's type for request events, by ID or RequestKey", () => {
    expect(resolveEventAssetType(log({ entityType: "Request", entityId: "7" }), lookup)).toBe("Headset");
    expect(resolveEventAssetType(log({ entityType: "Request", entityId: "REQ-2026-0042" }), lookup)).toBe("Keyboard");
  });

  it("does not look up request IDs in the inventory table", () => {
    expect(resolveEventAssetType(log({ entityType: "Request", entityId: "12" }), lookup)).toBeUndefined();
  });

  it("falls back to the asset name, case-insensitively", () => {
    expect(resolveEventAssetType(log({ entityId: "999", assetName: "  Dell P2419H " }), lookup)).toBe("Monitor");
  });

  it("treats a name that is itself a known type as that type", () => {
    expect(resolveEventAssetType(log({ entityType: "Request", entityId: "404", assetName: "laptop" }), lookup)).toBe("Laptop");
  });

  it("returns undefined when nothing matches", () => {
    expect(resolveEventAssetType(log({ entityId: "999", assetName: "Retired Gadget" }), lookup)).toBeUndefined();
  });
});

describe("mergeAssetTypes", () => {
  it("dedupes case-insensitively, keeps the first spelling, drops blanks and sorts", () => {
    expect(mergeAssetTypes(["Laptop", "Monitor"], ["laptop", "Dock", "", undefined as unknown as string], [" Printer "]))
      .toEqual(["Dock", "Laptop", "Monitor", "Printer"]);
  });
});

describe("matchesAssetType", () => {
  it("matches everything for 'All'", () => {
    expect(matchesAssetType(log({ assetType: "Laptop" }), "All")).toBe(true);
  });

  it("compares resolved types exactly (case-insensitive)", () => {
    expect(matchesAssetType(log({ assetType: "Monitor", assetName: "Dell P2419H" }), "monitor")).toBe(true);
    expect(matchesAssetType(log({ assetType: "Monitor", title: "Updated Asset: Laptop stand" }), "Laptop")).toBe(false);
  });

  it("keeps the legacy text match for events whose type is unknown", () => {
    expect(matchesAssetType(log({ assetType: undefined, assetName: "Old Laptop 2019" }), "Laptop")).toBe(true);
    expect(matchesAssetType(log({ assetType: undefined, assetName: "Old Mouse" }), "Laptop")).toBe(false);
  });
});

describe("applyClientFilters", () => {
  const logs = [
    log({ id: "1", assetType: "Laptop", assetName: "ASUS TUF A15", timestamp: "2026-09-01 09:00:00" }),
    log({ id: "2", assetType: "Monitor", assetName: "Dell P2419H", timestamp: "2026-09-03 09:00:00", action: "manager approved" }),
    log({ id: "3", assetType: "Laptop", assetName: "HP Zbook", timestamp: "2026-09-02 09:00:00" })
  ];

  it("filters by asset type and sorts newest first", () => {
    expect(applyClientFilters(logs, filters({ assetType: "Laptop" })).map(l => l.id)).toEqual(["3", "1"]);
  });

  it("searches across fields including the asset type", () => {
    expect(applyClientFilters(logs, filters({ searchQuery: "monitor" })).map(l => l.id)).toEqual(["2"]);
  });

  it("combines status and sort order", () => {
    expect(applyClientFilters(logs, filters({ status: "approved", sortOrder: "OldestFirst" })).map(l => l.id)).toEqual(["2"]);
    expect(applyClientFilters(logs, filters({ sortOrder: "AssetNameAZ" })).map(l => l.id)).toEqual(["1", "2", "3"]);
  });

  it("does not mutate the input array", () => {
    const before = logs.map(l => l.id);
    applyClientFilters(logs, filters({ sortOrder: "AssetNameZA" }));
    expect(logs.map(l => l.id)).toEqual(before);
  });
});

describe("matchesUser", () => {
  it("matches the whole name case-insensitively", () => {
    expect(matchesUser(log({ user: "Akhila Dodla" }), "akhila dodla")).toBe(true);
    expect(matchesUser(log({ user: "Akhila Dodla" }), "Akhila")).toBe(false);
  });

  it("matches one person of a multi-person event", () => {
    expect(matchesUser(log({ user: "Akhila Dodla, Diego Siciliani" }), "Diego Siciliani")).toBe(true);
  });

  it("matches everything for 'All'", () => {
    expect(matchesUser(log({ user: "x" }), "All")).toBe(true);
  });
});

describe("buildUserOptions", () => {
  it("counts events per user, keeps extra names at 0 and drops REST references", () => {
    const opts = buildUserOptions(
      [
        log({ user: "Diego Siciliani" }),
        log({ user: "diego siciliani" }),
        log({ user: "Akhila Dodla" }),
        log({ user: "Web/Lists(guid'8de1c9c0')/Items(4)/Employee" })
      ],
      ["Loka Kiran Reddy", "Akhila Dodla"]
    );
    expect(opts).toEqual([
      { name: "Akhila Dodla", count: 1 },
      { name: "Diego Siciliani", count: 2 },
      { name: "Loka Kiran Reddy", count: 0 }
    ]);
  });
});

describe("applyClientFilters with user", () => {
  it("filters by user alongside other filters", () => {
    const logs = [
      log({ id: "a", user: "Akhila Dodla", assetType: "Laptop" }),
      log({ id: "b", user: "Diego Siciliani", assetType: "Laptop" }),
      log({ id: "c", user: "Akhila Dodla", assetType: "Monitor" })
    ];
    expect(applyClientFilters(logs, filters({ user: "Akhila Dodla", assetType: "Laptop" })).map(l => l.id)).toEqual(["a"]);
  });
});

describe("getPageNumbers", () => {
  it("lists all pages when there are few", () => {
    expect(getPageNumbers(1, 3)).toEqual([1, 2, 3]);
  });

  it("adds ellipses around the active window", () => {
    expect(getPageNumbers(1, 13)).toEqual([1, 2, "...", 13]);
    expect(getPageNumbers(7, 13)).toEqual([1, "...", 6, 7, 8, "...", 13]);
    expect(getPageNumbers(13, 13)).toEqual([1, "...", 12, 13]);
  });
});
