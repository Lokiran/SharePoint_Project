// Localised labels, colours and tones for the categories the Reports page groups by.
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';
import { SlaStage, splitDuration } from '../../utils/RequestSlaUtils';
import { StatusBucket, ITone, TONES } from '../inventory/inventoryUi';
import { AgeBand, WarrantyBucket } from './reportData';
import { PALETTE } from './reportsUi';

export const STATUS_COLOR: { [bucket in StatusBucket]: string } = {
  inStock: PALETTE.green,
  assigned: PALETTE.blue,
  pendingReturn: PALETTE.orange,
  maintenance: PALETTE.amber,
  retired: PALETTE.red,
  other: PALETTE.grey
};

/** Where a request stands: waiting for the manager, waiting for the admin, fulfilled or rejected. */
export const STAGES: SlaStage[] = ['awaitingApproval', 'awaitingAssignment', 'assigned', 'rejected'];

export const STAGE_COLOR: { [stage in SlaStage]: string } = {
  awaitingApproval: PALETTE.amber,
  awaitingAssignment: PALETTE.blue,
  assigned: PALETTE.green,
  rejected: PALETTE.red
};

export const stageLabel = (stage: SlaStage): string => {
  const t = strings.Reports;
  return stage === 'awaitingApproval' ? t.OutcomeAwaitingApproval
    : stage === 'awaitingAssignment' ? t.OutcomeAwaitingAssignment
      : stage === 'assigned' ? t.OutcomeFulfilled : t.OutcomeRejected;
};

export const stageTone = (stage: SlaStage): ITone =>
  stage === 'awaitingApproval' ? TONES.amber : stage === 'awaitingAssignment' ? TONES.blue : stage === 'assigned' ? TONES.green : TONES.red;

export const AGE_COLOR: { [band in AgeBand]: string } = {
  under1: PALETTE.green,
  oneToThree: PALETTE.blue,
  overThree: PALETTE.orange,
  unknown: PALETTE.grey
};

export const ageBandLabel = (band: AgeBand): string => {
  const r = strings.ReportsPage;
  return band === 'under1' ? r.LegendAgingUnder1 : band === 'oneToThree' ? r.LegendAging1to3 : band === 'overThree' ? r.LegendAgingOver3 : r.LegendAgingUnknown;
};

export const WARRANTY_COLOR: { [bucket in WarrantyBucket]: string } = {
  expired: PALETTE.red,
  within30: PALETTE.orange,
  within90: PALETTE.amber,
  later: PALETTE.green,
  none: PALETTE.grey
};

export const warrantyBucketLabel = (bucket: WarrantyBucket): string => {
  const t = strings.Reports;
  return bucket === 'expired' ? t.WarrantyExpired
    : bucket === 'within30' ? t.WarrantyWithin30
      : bucket === 'within90' ? t.WarrantyWithin90
        : bucket === 'later' ? t.WarrantyLater : t.WarrantyNoDate;
};

/** "5 h" under two days, otherwise "3.5 d"; "—" when nothing was measured. */
export const durationText = (hours?: number): string => {
  if (hours === undefined) return '—';
  const d = splitDuration(hours);
  return formatString(d.unit === 'h' ? strings.Features.DurationHours : strings.Features.DurationDays, d.value);
};
