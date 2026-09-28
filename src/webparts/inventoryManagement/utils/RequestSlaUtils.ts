// Request SLA calculations: time to approve and time to assign, with overdue flags.
// Pure (no SharePoint / localization imports) so it is unit-testable.
import { IRequest } from '../models/IRequest';

export type SlaStage = 'awaitingApproval' | 'awaitingAssignment' | 'assigned' | 'rejected';

export interface ISlaTargets {
  /** 0 disables the approval target. */
  approvalHours: number;
  /** 0 disables the assignment target. */
  assignmentHours: number;
}

export interface IRequestSla {
  request: IRequest;
  stage: SlaStage;
  /** Hours from submission to the manager decision, when both times are known. */
  approvalHours?: number;
  /** Hours from the manager decision to assignment, when both times are known. */
  assignmentHours?: number;
  /** For open requests: hours spent in the current stage so far. */
  openHours?: number;
  /** True when the open stage has exceeded its target. */
  overdue: boolean;
  /** Hours past the target (0 when not overdue). */
  overdueByHours: number;
  /** True when the stage start time had to be approximated (no decision date recorded). */
  estimated: boolean;
}

export interface ISlaSummary {
  items: IRequestSla[];
  averageApprovalHours?: number;
  averageAssignmentHours?: number;
  /** Share of decided requests (with known times) decided within the approval target, 0–100. */
  approvalOnTimePercent?: number;
  /** Share of assigned requests (with known times) assigned within the assignment target, 0–100. */
  assignmentOnTimePercent?: number;
  overdueApprovals: number;
  overdueAssignments: number;
  /** Open overdue requests, most overdue first. */
  overdueItems: IRequestSla[];
}

const HOUR_MS = 60 * 60 * 1000;

const toTime = (iso?: string): number | undefined => {
  if (!iso) return undefined;
  const t = new Date(iso).getTime();
  return isNaN(t) ? undefined : t;
};

const hoursBetween = (from?: number, to?: number): number | undefined =>
  from !== undefined && to !== undefined && to >= from ? (to - from) / HOUR_MS : undefined;

export const getSlaStage = (request: IRequest): SlaStage => {
  // "Asset Assigned" is mapped to status 'Pending' by the query service, so check assetStatus first.
  if ((request.assetStatus || '').toString().toLowerCase() === 'approved') return 'assigned';
  const status = (request.status || '').toString().toLowerCase();
  if (status.indexOf('declin') >= 0 || status.indexOf('reject') >= 0) return 'rejected';
  if (status.indexOf('approv') >= 0) return 'awaitingAssignment';
  return 'awaitingApproval';
};

export const evaluateRequestSla = (request: IRequest, targets: ISlaTargets, now: number): IRequestSla => {
  const stage = getSlaStage(request);
  const created = toTime(request.createdAt) ?? toTime(request.requestDate);
  const decided = toTime(request.managerDecisionAt);
  const assigned = toTime(request.assignedAt);

  const result: IRequestSla = {
    request,
    stage,
    approvalHours: hoursBetween(created, decided),
    assignmentHours: hoursBetween(decided, assigned),
    overdue: false,
    overdueByHours: 0,
    estimated: false
  };

  let stageStart: number | undefined;
  let target = 0;
  if (stage === 'awaitingApproval') {
    stageStart = created;
    target = targets.approvalHours;
  } else if (stage === 'awaitingAssignment') {
    // Approved before the decision date was recorded: measure from submission (conservative).
    stageStart = decided ?? created;
    result.estimated = decided === undefined;
    target = targets.assignmentHours;
  }

  if (stageStart !== undefined) {
    result.openHours = hoursBetween(stageStart, now);
    if (target > 0 && result.openHours !== undefined && result.openHours > target) {
      result.overdue = true;
      result.overdueByHours = result.openHours - target;
    }
  }
  return result;
};

const average = (values: number[]): number | undefined =>
  values.length ? values.reduce((a, b) => a + b, 0) / values.length : undefined;

const percentWithin = (values: number[], target: number): number | undefined =>
  values.length && target > 0 ? Math.round((values.filter(v => v <= target).length / values.length) * 100) : undefined;

export const summarizeSla = (requests: IRequest[], targets: ISlaTargets, now: number = Date.now()): ISlaSummary => {
  const items = requests.map(r => evaluateRequestSla(r, targets, now));
  const approvals = items.map(i => i.approvalHours).filter((h): h is number => h !== undefined);
  const assignments = items.map(i => i.assignmentHours).filter((h): h is number => h !== undefined);
  const overdueItems = items.filter(i => i.overdue).sort((a, b) => b.overdueByHours - a.overdueByHours);

  return {
    items,
    averageApprovalHours: average(approvals),
    averageAssignmentHours: average(assignments),
    approvalOnTimePercent: percentWithin(approvals, targets.approvalHours),
    assignmentOnTimePercent: percentWithin(assignments, targets.assignmentHours),
    overdueApprovals: overdueItems.filter(i => i.stage === 'awaitingApproval').length,
    overdueAssignments: overdueItems.filter(i => i.stage === 'awaitingAssignment').length,
    overdueItems
  };
};

/** Compact duration: under 48 hours in hours ("5 h"), otherwise days with one decimal ("3.5 d"). */
export const splitDuration = (hours: number): { value: number; unit: 'h' | 'd' } =>
  hours < 48
    ? { value: Math.round(hours), unit: 'h' }
    : { value: Math.round((hours / 24) * 10) / 10, unit: 'd' };
