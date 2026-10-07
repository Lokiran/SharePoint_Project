import { findOpenRequest, isOpenRequest, isSameRequester, isSameAssetType } from "../utils/RequestDuplicateUtils";
import { IRequest } from "../models/IRequest";

const request = (o: Partial<IRequest>): IRequest => ({
  id: "1", requestKey: "REQ-000001", requesterName: "Alex Wilber", assetId: "", assetTitle: "Laptop",
  quantity: 1, status: "Pending", requestDate: "2026-09-01", ...o
});

describe("RequestDuplicateUtils", () => {
  it("treats a request as open until the asset is assigned or the manager rejects it", () => {
    expect(isOpenRequest(request({ status: "Pending" }))).toBe(true);
    expect(isOpenRequest(request({ status: "Pending Manager Approval" }))).toBe(true);
    expect(isOpenRequest(request({ status: "Approved", assetStatus: "Pending" }))).toBe(true);
    expect(isOpenRequest(request({ status: "Approved", assetStatus: "Approved" }))).toBe(false);
    expect(isOpenRequest(request({ status: "Declined" }))).toBe(false);
    expect(isOpenRequest(request({ status: "Rejected" }))).toBe(false);
  });

  it("matches requesters and asset types without regard to case, spacing or punctuation", () => {
    expect(isSameRequester("Alex Wilber", "alex  wilber")).toBe(true);
    expect(isSameRequester("Alex Wilber (Contoso)", "Alex Wilber")).toBe(true);
    expect(isSameRequester("Alex Wilber", "Adele Vance")).toBe(false);
    expect(isSameRequester("", "Alex Wilber")).toBe(false);
    expect(isSameAssetType(" laptop ", "Laptop")).toBe(true);
    expect(isSameAssetType("Laptop", "Monitor")).toBe(false);
    expect(isSameAssetType("", "")).toBe(false);
  });

  it("blocks only the same person's open request for the same type", () => {
    const requests = [
      request({ id: "1", requestKey: "REQ-000001", status: "Declined" }),
      request({ id: "2", requestKey: "REQ-000002", status: "Approved", assetStatus: "Approved" }),
      request({ id: "3", requestKey: "REQ-000003", status: "Approved", assetStatus: "Pending" }),
      request({ id: "4", requestKey: "REQ-000004", assetTitle: "Mouse" }),
      request({ id: "5", requestKey: "REQ-000005", requesterName: "Adele Vance", assetTitle: "Monitor" })
    ];
    expect(findOpenRequest(requests, "Alex Wilber", "Laptop")?.requestKey).toBe("REQ-000003");
    expect(findOpenRequest(requests, "Alex Wilber", "mouse")?.requestKey).toBe("REQ-000004");
    expect(findOpenRequest(requests, "Alex Wilber", "Monitor")).toBeUndefined();
    expect(findOpenRequest(requests, "Adele Vance", "Laptop")).toBeUndefined();
    expect(findOpenRequest(requests.slice(0, 2), "Alex Wilber", "Laptop")).toBeUndefined();
  });
});
