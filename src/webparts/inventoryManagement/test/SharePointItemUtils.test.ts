import {
  isODataAnnotationKey,
  looksLikeODataReference,
  findItemKey,
  getPersonDisplayName,
  firstPersonName
} from "../utils/SharePointItemUtils";

// Shape of a Request list item as returned with odata=minimalmetadata and an expanded person column.
const requestItem = {
  "odata.type": "SP.Data.RequestListListItem",
  "odata.id": "1b2c…",
  "Employee@odata.navigationLinkUrl": "Web/Lists(guid'8de1c9c0-1111-2222-3333-444455556666')/Items(4)/Employee",
  Employee: { Title: "Akhila Dodla", Id: 11 },
  EmployeeId: 11,
  "Author@odata.navigationLinkUrl": "Web/Lists(guid'8de1c9c0-1111-2222-3333-444455556666')/Items(4)/Author",
  Author: { Title: "Loka Kiran Reddy", Id: 7 },
  AssetType: "Headset",
  Title: "Request for Headset"
};

describe("isODataAnnotationKey", () => {
  it("flags annotation and metadata keys only", () => {
    expect(isODataAnnotationKey("Employee@odata.navigationLinkUrl")).toBe(true);
    expect(isODataAnnotationKey("odata.type")).toBe(true);
    expect(isODataAnnotationKey("__metadata")).toBe(true);
    expect(isODataAnnotationKey("Employee")).toBe(false);
    expect(isODataAnnotationKey("AssetType")).toBe(false);
  });
});

describe("looksLikeODataReference", () => {
  it("detects REST references", () => {
    expect(looksLikeODataReference("Web/Lists(guid'8de1c9c0')/Items(4)/Employee")).toBe(true);
    expect(looksLikeODataReference("https://contoso.sharepoint.com/sites/x/_api/Web/Lists(guid'a')")).toBe(true);
    expect(looksLikeODataReference("Akhila Dodla")).toBe(false);
  });
});

describe("findItemKey", () => {
  it("never returns an annotation key (the original bug)", () => {
    expect(findItemKey(requestItem, "employee")).toBe("Employee");
  });

  it("prefers the non-Id column and does not match odata.type for 'type'", () => {
    expect(findItemKey(requestItem, "type")).toBe("AssetType");
  });

  it("falls back to an Id column when that is the only match", () => {
    expect(findItemKey({ EmployeeId: 3 }, "employee")).toBe("EmployeeId");
  });

  it("ignores _x0020_ encoding", () => {
    expect(findItemKey({ Asset_x0020_Type: "Laptop" }, "assettype")).toBe("Asset_x0020_Type");
  });
});

describe("getPersonDisplayName", () => {
  it("reads expanded users, arrays and verbose results", () => {
    expect(getPersonDisplayName({ Title: "Diego Siciliani" })).toBe("Diego Siciliani");
    expect(getPersonDisplayName([{ Title: "A" }, { Title: "B" }])).toBe("A, B");
    expect(getPersonDisplayName({ results: [{ Title: "A" }] })).toBe("A");
  });

  it("returns '' for references, deferred links and IDs", () => {
    expect(getPersonDisplayName("Web/Lists(guid'8de1c9c0')/Items(4)/Employee")).toBe("");
    expect(getPersonDisplayName({ __deferred: { uri: "https://x/_api/Web/Lists(guid'a')/Items(1)/Employee" } })).toBe("");
    expect(getPersonDisplayName(11)).toBe("");
  });
});

describe("firstPersonName", () => {
  it("skips unusable candidates", () => {
    expect(firstPersonName([requestItem["Employee@odata.navigationLinkUrl"], requestItem.Author], "System")).toBe("Loka Kiran Reddy");
  });

  it("uses the fallback when nothing is usable", () => {
    expect(firstPersonName([undefined, "", 5], "System")).toBe("System");
  });
});
