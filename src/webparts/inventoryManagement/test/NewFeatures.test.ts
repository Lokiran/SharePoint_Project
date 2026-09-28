import { buildAppConfig, resolveRoleFromGroups, DEFAULT_APP_CONFIG, parseNonNegativeNumber } from "../config/AppConfig";
import { evaluateStockLevels, planStockAlerts, isAvailableStatus } from "../utils/StockUtils";
import { summarizeSla, getSlaStage, splitDuration } from "../utils/RequestSlaUtils";
import { parseKitItems, formatKitItems, buildOffboardingChecklist, listAssetHolders } from "../utils/KitUtils";
import { IInventoryItem } from "../models/IInventoryItem";
import { IRequest } from "../models/IRequest";
import { IReturnRequest } from "../models/IReturnRequest";

const item = (o: Partial<IInventoryItem>): IInventoryItem => ({
  id: "1", title: "", assetName: "", assetType: "Laptop", serialNumber: "", purchaseDate: "", status: "In Stock", ...o
});

const request = (o: Partial<IRequest>): IRequest => ({
  id: "1", requestKey: "REQ-000001", requesterName: "Akhila Dodla", assetId: "", assetTitle: "Laptop",
  quantity: 1, status: "Pending", requestDate: "2026-09-01", ...o
});

const ret = (o: Partial<IReturnRequest>): IReturnRequest => ({
  id: "RR-1", title: "", assetId: "", assetName: "", serialNumber: "", requesterName: "", requestDate: "",
  returnReason: "", proposedCondition: "Good", status: "Pending", ...o
});

describe("AppConfig", () => {
  it("keeps every default when the property pane is empty", () => {
    expect(buildAppConfig({})).toEqual(DEFAULT_APP_CONFIG);
  });

  it("uses trimmed values and falls back on blank or invalid input", () => {
    const c = buildAppConfig({ adminGroupName: "  IT Admins ", requestListTitle: " ", approvalSlaHours: "24", assignmentSlaHours: "-3", defaultMinimumStock: "2.7" });
    expect(c.roleGroups.admin).toBe("IT Admins");
    expect(c.lists.request).toBe("RequestList");
    expect(c.sla.approvalHours).toBe(24);
    expect(c.sla.assignmentHours).toBe(72);
    expect(c.stock.defaultMinimum).toBe(2);
    expect(parseNonNegativeNumber("abc", 5)).toBe(5);
  });

  it("resolves the highest role, matching names by equality or containment", () => {
    const g = { admin: "IT Admins", manager: "Stock Managers", employee: "Staff" };
    expect(resolveRoleFromGroups(["Staff", "Contoso IT Admins"], g)).toBe("Admin");
    expect(resolveRoleFromGroups(["stock managers"], g)).toBe("Inventory Manager");
    expect(resolveRoleFromGroups(["Staff"], g)).toBe("Inventory Employee");
    expect(resolveRoleFromGroups([], g)).toBe("Inventory Employee");
  });
});

describe("Low-stock evaluation", () => {
  const items = [
    item({ id: "1", assetType: "Laptop", status: "In Stock" }),
    item({ id: "2", assetType: "Laptop", status: "Assigned" }),
    item({ id: "3", assetType: "Monitor", status: "Assigned" }),
    item({ id: "4", assetType: "Monitor", status: "Yes" })
  ];

  it("recognises available statuses", () => {
    expect(isAvailableStatus("In Stock")).toBe(true);
    expect(isAvailableStatus("Assigned")).toBe(false);
  });

  it("applies per-type thresholds over the default and includes threshold-only types", () => {
    const levels = evaluateStockLevels(items, [{ id: 7, assetType: "monitor", minimumStock: 3 }, { assetType: "Dock", minimumStock: 1 }], 1);
    const by = (t: string) => levels.find(l => l.assetType.toLowerCase() === t.toLowerCase());
    expect(by("Laptop")).toMatchObject({ available: 1, total: 2, minimum: 1, hasCustomMinimum: false, isLow: false });
    expect(by("Monitor")).toMatchObject({ available: 1, minimum: 3, hasCustomMinimum: true, isLow: true });
    expect(by("Dock")).toMatchObject({ available: 0, total: 0, isLow: true });
  });

  it("treats a minimum of 0 as not monitored", () => {
    const levels = evaluateStockLevels(items, [{ assetType: "Laptop", minimumStock: 0 }], 5);
    expect(levels.find(l => l.assetType === "Laptop")).toMatchObject({ minimum: 0, isLow: false });
  });

  it("alerts once per drop and resets after recovery", () => {
    const levels = evaluateStockLevels(items, [
      { id: 1, assetType: "Monitor", minimumStock: 3, lastAlertSent: "2026-09-20T10:00:00Z" },
      { id: 2, assetType: "Laptop", minimumStock: 5 },
      { id: 3, assetType: "Keyboard", minimumStock: 0, lastAlertSent: "2026-09-20T10:00:00Z" }
    ], 1);
    const plan = planStockAlerts(levels);
    expect(plan.toAlert.map(l => l.assetType)).toEqual(["Laptop"]);
    expect(plan.toReset.map(l => l.assetType)).toEqual(["Keyboard"]);
  });
});

describe("Request SLA", () => {
  const now = new Date("2026-09-10T12:00:00Z").getTime();
  const targets = { approvalHours: 48, assignmentHours: 72 };

  it("derives the stage, checking asset assignment first", () => {
    expect(getSlaStage(request({ status: "Pending", assetStatus: "Approved" }))).toBe("assigned");
    expect(getSlaStage(request({ status: "Declined" }))).toBe("rejected");
    expect(getSlaStage(request({ status: "Approved" }))).toBe("awaitingAssignment");
    expect(getSlaStage(request({ status: "Pending" }))).toBe("awaitingApproval");
  });

  it("computes averages, on-time share and overdue items", () => {
    const summary = summarizeSla([
      // decided in 24h, assigned 48h later
      request({ id: "a", status: "Pending", assetStatus: "Approved", createdAt: "2026-09-01T12:00:00Z", managerDecisionAt: "2026-09-02T12:00:00Z", assignedAt: "2026-09-04T12:00:00Z" }),
      // decided in 72h (late), waiting for assignment 4 days -> overdue by 24h
      request({ id: "b", status: "Approved", createdAt: "2026-09-03T12:00:00Z", managerDecisionAt: "2026-09-06T12:00:00Z" }),
      // waiting for approval 3 days -> overdue by 24h
      request({ id: "c", status: "Pending", createdAt: "2026-09-07T12:00:00Z" }),
      // waiting for approval 1 day -> fine
      request({ id: "d", status: "Pending", createdAt: "2026-09-09T12:00:00Z" })
    ], targets, now);

    expect(summary.averageApprovalHours).toBe(48);
    expect(summary.averageAssignmentHours).toBe(48);
    expect(summary.approvalOnTimePercent).toBe(50);
    expect(summary.overdueApprovals).toBe(1);
    expect(summary.overdueAssignments).toBe(1);
    expect(summary.overdueItems.map(i => i.request.id).sort()).toEqual(["b", "c"]);
    expect(summary.overdueItems[0].overdueByHours).toBe(24);
  });

  it("measures legacy approvals (no decision date) from submission and flags them as estimated", () => {
    const s = summarizeSla([request({ status: "Approved", createdAt: "2026-09-01T12:00:00Z" })], targets, now);
    expect(s.items[0]).toMatchObject({ stage: "awaitingAssignment", estimated: true, overdue: true });
  });

  it("disables a target set to 0", () => {
    const s = summarizeSla([request({ status: "Pending", createdAt: "2026-01-01T00:00:00Z" })], { approvalHours: 0, assignmentHours: 0 }, now);
    expect(s.overdueItems).toHaveLength(0);
    expect(s.approvalOnTimePercent).toBeUndefined();
  });

  it("formats durations compactly", () => {
    expect(splitDuration(5.4)).toEqual({ value: 5, unit: "h" });
    expect(splitDuration(84)).toEqual({ value: 3.5, unit: "d" });
  });
});

describe("Kits", () => {
  it("parses one type per line with optional quantities and merges repeats", () => {
    expect(parseKitItems("Laptop\nMonitor x2\n2 x Keyboard\nMouse, 3\n\nlaptop;Headset")).toEqual([
      { assetType: "Laptop", quantity: 2 },
      { assetType: "Monitor", quantity: 2 },
      { assetType: "Keyboard", quantity: 2 },
      { assetType: "Mouse", quantity: 3 },
      { assetType: "Headset", quantity: 1 }
    ]);
  });

  it("round-trips through formatKitItems", () => {
    const lines = [{ assetType: "Laptop", quantity: 1 }, { assetType: "Monitor", quantity: 2 }];
    expect(parseKitItems(formatKitItems(lines))).toEqual(lines);
  });

  it("builds the offboarding checklist from held items and returns", () => {
    const items = [
      item({ id: "10", assetName: "HP Zbook", serialNumber: "S10", assignedTo: "Diego Siciliani", assignedToEmail: "diego@contoso.com", status: "Assigned" }),
      item({ id: "11", assetName: "Dell P2419H", serialNumber: "S11", assignedTo: "Diego Siciliani", assignedToEmail: "diego@contoso.com", status: "Assigned" }),
      item({ id: "12", assetName: "Mouse", serialNumber: "S12", assignedTo: "Akhila Dodla", status: "Assigned" })
    ];
    const returns = [
      ret({ assetId: "11", serialNumber: "S11", status: "Pending Manager Approval", requesterName: "Diego Siciliani" }),
      ret({ assetId: "9", assetName: "Headset", serialNumber: "S9", status: "Completed", requesterName: "Diego Siciliani" }),
      ret({ assetId: "10", serialNumber: "S10", status: "Rejected", requesterName: "Diego Siciliani" })
    ];
    const rows = buildOffboardingChecklist(items, returns, "Diego Siciliani", "diego@contoso.com");
    expect(rows.map(r => [r.assetId, r.state])).toEqual([["10", "held"], ["11", "returnInProgress"], ["9", "returned"]]);
  });

  it("lists asset holders with counts", () => {
    const holders = listAssetHolders([
      item({ assignedTo: "Diego Siciliani", assignedToEmail: "diego@contoso.com" }),
      item({ assignedTo: "Diego Siciliani", assignedToEmail: "DIEGO@contoso.com" }),
      item({ assignedTo: "" })
    ]);
    expect(holders).toEqual([{ name: "Diego Siciliani", email: "diego@contoso.com", count: 2 }]);
  });
});
