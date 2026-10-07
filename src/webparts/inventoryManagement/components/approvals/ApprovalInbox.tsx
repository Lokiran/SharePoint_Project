// The manager's Approvals page: a list of requests next to a decision pane that puts everything
// needed to decide (request, stock, what the employee already has) beside the Approve / Reject buttons.
import * as React from 'react';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react/lib/TextField';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { Icon } from '@fluentui/react/lib/Icon';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';
import { IRequest } from '../../models/IRequest';
import { IInventoryItem } from '../../models/IInventoryItem';
import { getAppConfig } from '../../config/AppConfig';
import { getAvailableStock } from '../../utils/StockUtils';
import { getSlaStage, evaluateRequestSla, SlaStage, IRequestSla } from '../../utils/RequestSlaUtils';
import { TONES, initials } from '../inventory/inventoryUi';
import { formatHours } from '../assignment/AssignmentQueue';
import { Pill, StatusChips, IStatusChip, priorityTone, formatFlexibleDay, parseFlexibleDate } from '../common/listUi';
import { isHeld, nameOf } from '../reports/reportData';
import { STAGES, STAGE_COLOR, stageLabel, stageTone } from '../reports/reportLabels';
import { RejectRequestDialog } from '../RejectRequestDialog';
import { RejectionReasonCard } from '../RejectionReasonCard';

export interface IApprovalInboxProps {
  /** Every request in the manager's queue, decided or not. */
  requests: IRequest[];
  items: IInventoryItem[];
  search: string;
  onSearchChange: (value: string) => void;
  onApproveRequest: (request: IRequest, comment?: string) => Promise<void>;
  onRejectRequest: (request: IRequest, reason: string) => Promise<void>;
  actionInProgressId?: string;
}

type StageFilter = 'all' | SlaStage;
type SortKey = 'waiting' | 'newest' | 'priority';

interface IRow {
  request: IRequest;
  stage: SlaStage;
  sla: IRequestSla;
  time: number;
}

const LINE = 'rgba(128, 128, 128, 0.22)';
const MUTED = 'var(--text-muted, #616161)';
const PRIORITY_RANK: { [p: string]: number } = { critical: 0, high: 0, medium: 1, low: 2 };

const css = mergeStyleSets({
  root: { color: 'var(--text-main, #242424)' },
  header: { marginBottom: 14 },
  title: { margin: 0, fontSize: 22, fontWeight: 600, lineHeight: '28px' },
  subtitle: { margin: '4px 0 0', fontSize: 14, color: MUTED },

  // Side by side when there is room; the decision pane drops below the list on narrow pages.
  layout: { display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' },
  listPane: { flex: '1 1 250px', minWidth: 0, border: `1px solid ${LINE}`, borderRadius: 12, background: 'var(--surface-bg, #ffffff)', overflow: 'hidden' },
  tools: { display: 'flex', flexDirection: 'column', gap: 8, padding: 12, borderBottom: `1px solid ${LINE}` },
  count: { fontSize: 12, color: MUTED },
  list: { listStyle: 'none', margin: 0, padding: 6, maxHeight: 'min(640px, 70vh)', overflowY: 'auto' },
  item: {
    display: 'grid', gridTemplateColumns: '34px minmax(0, 1fr)', columnGap: 10, alignItems: 'start', width: '100%',
    padding: '10px', border: 'none', borderRadius: 10, background: 'transparent', cursor: 'pointer',
    font: 'inherit', color: 'inherit', textAlign: 'left',
    selectors: { ':hover': { background: 'rgba(128, 128, 128, 0.08)' }, ':focus-visible': { outline: '2px solid #0f6cbd', outlineOffset: -2 } }
  },
  itemSelected: { background: 'rgba(15, 108, 189, 0.1)', selectors: { ':hover': { background: 'rgba(15, 108, 189, 0.1)' } } },
  coin: { width: 34, height: 34, borderRadius: '50%', background: '#0f6cbd', color: '#ffffff', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  itemTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  itemName: { fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  itemTime: { fontSize: 12, color: MUTED, whiteSpace: 'nowrap', flexShrink: 0 },
  itemAsset: { display: 'block', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  itemTags: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  emptyList: { padding: '32px 16px', textAlign: 'center', fontSize: 13, color: MUTED },

  pane: { flex: '2 1 340px', minWidth: 0, border: `1px solid ${LINE}`, borderRadius: 12, background: 'var(--surface-bg, #ffffff)', padding: '18px 20px' },
  paneEmpty: { padding: '64px 16px', textAlign: 'center', color: MUTED },
  paneHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' },
  paneKey: { fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', color: MUTED },
  paneTitle: { margin: '2px 0 0', fontSize: 20, fontWeight: 600, lineHeight: '26px' },
  panePills: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  person: { display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 },
  personName: { fontSize: 14, fontWeight: 600 },
  personMeta: { fontSize: 12, color: MUTED },

  steps: { display: 'flex', alignItems: 'flex-start', margin: '18px 0 4px', padding: 0, listStyle: 'none' },
  step: { flex: '1 1 0', minWidth: 0, position: 'relative', textAlign: 'center', fontSize: 12, color: MUTED },
  // Connector to the previous step, behind the markers.
  stepLine: { position: 'absolute', top: 11, right: '50%', width: '100%', height: 2, background: LINE },
  stepDot: {
    position: 'relative', zIndex: 1, width: 24, height: 24, margin: '0 auto 6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, background: 'var(--surface-bg, #ffffff)', border: `2px solid ${LINE}`, color: MUTED
  },
  stepLabel: { display: 'block', fontWeight: 600, color: 'var(--text-main, #242424)' },

  section: { marginTop: 18 },
  sectionTitle: { margin: '0 0 8px', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: MUTED },
  facts: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px 16px', margin: 0 },
  factLabel: { margin: 0, fontSize: 12, color: MUTED },
  factValue: { margin: '1px 0 0', fontSize: 14, fontWeight: 600, wordBreak: 'break-word' },
  quote: { margin: 0, padding: '10px 14px', borderRadius: 10, background: 'rgba(128, 128, 128, 0.08)', fontSize: 14, lineHeight: '20px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
  bullets: { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 },
  bullet: { display: 'flex', gap: 8, alignItems: 'flex-start' },
  bulletIcon: { marginTop: 3, fontSize: 12, flexShrink: 0 },
  decision: { marginTop: 20, paddingTop: 16, borderTop: `1px solid ${LINE}` },
  buttons: { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }
});

const same = (a?: string, b?: string): boolean => !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase();
const refOf = (request: IRequest): string => request.requestKey || `#${request.id}`;
const assetLine = (request: IRequest): string => request.quantity > 1 ? `${request.assetTitle} × ${request.quantity}` : request.assetTitle;
const requestedAt = (request: IRequest): Date | undefined => parseFlexibleDate(request.createdAt) || parseFlexibleDate(request.requestDate);

const Fact: React.FC<{ label: string }> = ({ label, children }) => (
  <div>
    <dt className={css.factLabel}>{label}</dt>
    <dd className={css.factValue}>{children}</dd>
  </div>
);

export const ApprovalInbox: React.FC<IApprovalInboxProps> = (props) => {
  const { requests, items, search, actionInProgressId } = props;
  const t = strings.Approvals;
  const targets = getAppConfig().sla;

  const rows: IRow[] = React.useMemo(() => {
    const now = Date.now();
    return requests.map(request => {
      const date = requestedAt(request);
      return { request, stage: getSlaStage(request), sla: evaluateRequestSla(request, targets, now), time: date ? date.getTime() : 0 };
    });
  }, [requests, targets.approvalHours, targets.assignmentHours]);

  const toDecide = rows.filter(r => r.stage === 'awaitingApproval').length;
  // Until a chip is chosen: what needs a decision (also once the last one is decided), or the
  // full history when nothing was waiting. Requests may still be loading when the page opens.
  const [stageChoice, setStage] = React.useState<StageFilter | undefined>();
  const sawPending = React.useRef(false);
  if (toDecide > 0) sawPending.current = true;
  const stage: StageFilter = stageChoice || (sawPending.current ? 'awaitingApproval' : 'all');
  const [sort, setSort] = React.useState<SortKey>('waiting');
  const [selectedId, setSelectedId] = React.useState<string | undefined>();
  const [comment, setComment] = React.useState('');
  const [rejectTarget, setRejectTarget] = React.useState<IRequest | undefined>();

  const query = search.trim().toLowerCase();
  const searched = !query ? rows : rows.filter(r =>
    [r.request.requestKey, r.request.id, r.request.requesterName, r.request.requesterEmail, r.request.assetTitle]
      .some(v => (v || '').toLowerCase().indexOf(query) >= 0));

  const visible = searched.filter(r => stage === 'all' || r.stage === stage).sort((a, b) => {
    if (sort === 'newest') return b.time - a.time;
    if (sort === 'priority') {
      const rank = (r: IRow): number => PRIORITY_RANK[(r.request.priority || 'medium').toLowerCase()] ?? 1;
      return rank(a) - rank(b) || a.time - b.time;
    }
    // Longest waiting first: open requests before decided ones, oldest at the top.
    const open = (r: IRow): number => (r.stage === 'awaitingApproval' ? 0 : 1);
    return open(a) - open(b) || (open(a) === 0 ? a.time - b.time : b.time - a.time);
  });

  // The selected request, or the first in the list: after a decision the next one is shown straight away.
  const current = visible.filter(r => r.request.id === selectedId)[0] || visible[0];
  const currentId = current ? current.request.id : undefined;
  React.useEffect(() => setComment(''), [currentId]);

  const chips: IStatusChip[] = [
    ...STAGES.map(s => ({
      key: s as string,
      label: s === 'awaitingApproval' ? t.ChipToDecide : stageLabel(s),
      count: searched.filter(r => r.stage === s).length,
      color: STAGE_COLOR[s]
    })),
    { key: 'all', label: strings.RecordLists.TileAll, count: searched.length }
  ];

  const sortOptions: IDropdownOption[] = [
    { key: 'waiting', text: t.SortWaiting },
    { key: 'newest', text: strings.RecordLists.SortNewest },
    { key: 'priority', text: strings.RecordLists.SortPriority }
  ];

  const confirmReject = async (request: IRequest, reason: string): Promise<void> => {
    await props.onRejectRequest(request, reason).catch(err => console.error(err));
    setRejectTarget(undefined);
  };

  const renderItem = (row: IRow): JSX.Element => {
    const r = row.request;
    const selected = !!current && current.request.id === r.id;
    const waiting = row.stage === 'awaitingApproval';
    return (
      <li key={r.id}>
        <button type="button" className={`${css.item} ${selected ? css.itemSelected : ''}`} aria-current={selected ? 'true' : undefined} onClick={() => setSelectedId(r.id)}>
          <span className={css.coin} aria-hidden="true">{initials(r.requesterName)}</span>
          <span style={{ minWidth: 0 }}>
            <span className={css.itemTop}>
              <span className={css.itemName}>{r.requesterName || '—'}</span>
              <span className={css.itemTime} title={formatFlexibleDay(r.createdAt || r.requestDate)}>
                {waiting ? formatHours(row.sla.openHours) : formatFlexibleDay(r.createdAt || r.requestDate)}
              </span>
            </span>
            <span className={css.itemAsset}>{assetLine(r)} · {refOf(r)}</span>
            <span className={css.itemTags}>
              {(stage === 'all' || !waiting) && <Pill tone={stageTone(row.stage)} text={waiting ? t.ChipToDecide : stageLabel(row.stage)} />}
              {(r.priority || 'Medium') !== 'Medium' && <Pill tone={priorityTone(r.priority)} text={r.priority || ''} title={strings.Columns.Priority} />}
              {row.sla.overdue && <Pill tone={TONES.red} text={formatString(strings.AssignmentQueue.OverdueBy, formatHours(row.sla.overdueByHours))} />}
            </span>
          </span>
        </button>
      </li>
    );
  };

  const renderSteps = (row: IRow): JSX.Element => {
    const r = row.request;
    const rejected = row.stage === 'rejected';
    const decided = row.stage !== 'awaitingApproval';
    const steps: { key: string; label: string; note: string; icon?: string; tone?: { bg: string; fg: string } }[] = [
      { key: 'requested', label: t.StepRequested, note: formatFlexibleDay(r.createdAt || r.requestDate), icon: 'CheckMark', tone: TONES.green },
      {
        key: 'decision', label: t.StepDecision,
        note: rejected ? stageLabel('rejected') : decided ? (r.managerDecisionAt ? formatFlexibleDay(r.managerDecisionAt) : strings.Dropdowns.AuditLogStatus.Approved) : strings.Dropdowns.AuditLogStatus.Pending,
        icon: rejected ? 'Cancel' : decided ? 'CheckMark' : undefined,
        tone: rejected ? TONES.red : decided ? TONES.green : undefined
      },
      {
        key: 'assigned', label: t.StepAssigned,
        note: rejected ? strings.Common.NotAvailable : row.stage === 'assigned' ? (r.assignedAt ? formatFlexibleDay(r.assignedAt) : stageLabel('assigned')) : strings.Dropdowns.AuditLogStatus.Pending,
        icon: row.stage === 'assigned' ? 'CheckMark' : undefined,
        tone: row.stage === 'assigned' ? TONES.green : undefined
      }
    ];
    return (
      <ol className={css.steps}>
        {steps.map((step, i) => (
          <li key={step.key} className={css.step}>
            {i > 0 && <span className={css.stepLine} aria-hidden="true" />}
            <span className={css.stepDot} style={step.tone ? { background: step.tone.bg, borderColor: step.tone.bg, color: step.tone.fg } : undefined} aria-hidden="true">
              {step.icon ? <Icon iconName={step.icon} /> : i + 1}
            </span>
            <span className={css.stepLabel}>{step.label}</span>
            {step.note}
          </li>
        ))}
      </ol>
    );
  };

  const renderPane = (row: IRow): JSX.Element => {
    const r = row.request;
    const waiting = row.stage === 'awaitingApproval';
    const busy = actionInProgressId === r.id;

    // Stock for the requested type; approval is refused while there is not enough.
    const stock = getAvailableStock(items, r);
    const needed = Number(r.quantity || 0);
    const enough = stock >= needed;

    // What the employee already holds and has asked for.
    const holds = items.filter(i => isHeld(i) && (same(i.assignedToEmail, r.requesterEmail) || same(i.assignedTo, r.requesterName)));
    const sameType = holds.filter(i => same(i.assetType, r.assetTitle) || same(i.title, r.assetTitle));
    const others = rows.filter(o => o.request.id !== r.id && (same(o.request.requesterEmail, r.requesterEmail) || same(o.request.requesterName, r.requesterName)));
    const othersOpen = others.filter(o => o.stage === 'awaitingApproval' || o.stage === 'awaitingAssignment');
    const duplicates = othersOpen.filter(o => same(o.request.assetTitle, r.assetTitle));

    const approve = (): void => {
      props.onApproveRequest(r, comment.trim()).catch(err => console.error(err));
    };

    return (
      <>
        <div className={css.paneHead}>
          <div>
            <span className={css.paneKey}>{refOf(r)}</span>
            <h4 className={css.paneTitle}>{assetLine(r)}</h4>
          </div>
          <span className={css.panePills}>
            <Pill tone={stageTone(row.stage)} text={waiting ? t.ChipToDecide : stageLabel(row.stage)} />
            <Pill tone={priorityTone(r.priority)} text={r.priority || 'Medium'} title={strings.Columns.Priority} />
            {row.sla.overdue && <Pill tone={TONES.red} text={formatString(strings.AssignmentQueue.OverdueBy, formatHours(row.sla.overdueByHours))} />}
          </span>
        </div>

        <div className={css.person}>
          <span className={css.coin} aria-hidden="true">{initials(r.requesterName)}</span>
          <span style={{ minWidth: 0 }}>
            <span className={css.personName}>{r.requesterName || '—'}</span>
            <span className={css.personMeta} style={{ display: 'block' }}>
              {[r.employeeId ? formatString(strings.AssignmentQueue.EmployeeId, r.employeeId) : '', r.requesterEmail || ''].filter(Boolean).join(' · ')}
            </span>
          </span>
        </div>

        {renderSteps(row)}

        <div className={css.section}>
          <h5 className={css.sectionTitle}>{strings.RequestList.SectionRequestInformation}</h5>
          <dl className={css.facts}>
            <Fact label={strings.RequestList.LabelAssetCategory}>{r.assetTitle || '—'}</Fact>
            <Fact label={strings.RequestForm.LabelQuantity}>{r.quantity}</Fact>
            <Fact label={strings.RequestList.LabelRequestDate}>{formatFlexibleDay(r.createdAt || r.requestDate)}</Fact>
            {waiting && <Fact label={strings.AssignmentQueue.ColWaiting}>{formatHours(row.sla.openHours)}</Fact>}
            <Fact label={strings.Columns.ManagerName}>{r.managerName || '—'}</Fact>
          </dl>
        </div>

        <div className={css.section}>
          <h5 className={css.sectionTitle}>{strings.RequestList.SectionJustification}</h5>
          <p className={css.quote} style={r.reason ? undefined : { color: MUTED }}>{r.reason || t.NoJustification}</p>
        </div>

        {waiting && (
          <div className={css.section}>
            <h5 className={css.sectionTitle}>{t.SectionStock}</h5>
            <MessageBar messageBarType={enough ? MessageBarType.success : MessageBarType.severeWarning} isMultiline>
              {enough
                ? formatString(t.StockEnough, stock, r.assetTitle, needed)
                : stock > 0 ? formatString(t.StockShort, stock, r.assetTitle, needed) : formatString(t.StockNone, r.assetTitle)}
            </MessageBar>
          </div>
        )}

        <div className={css.section}>
          <h5 className={css.sectionTitle}>{t.SectionEmployee}</h5>
          <ul className={css.bullets}>
            <li className={css.bullet}>
              <Icon iconName="Devices3" className={css.bulletIcon} aria-hidden="true" />
              <span>
                {holds.length === 0 ? t.HoldsNone : formatString(t.HoldsCount, holds.length)}
                {holds.length > 0 && <span style={{ color: MUTED }}> — {holds.map(i => nameOf(i) || i.assetType).join(', ')}</span>}
              </span>
            </li>
            {sameType.length > 0 && (
              <li className={css.bullet} style={{ color: TONES.amber.fg }}>
                <Icon iconName="Warning" className={css.bulletIcon} aria-hidden="true" />
                <span>{formatString(t.HoldsSameType, sameType.length, r.assetTitle)}</span>
              </li>
            )}
            {duplicates.length > 0 && (
              <li className={css.bullet} style={{ color: TONES.amber.fg }}>
                <Icon iconName="Warning" className={css.bulletIcon} aria-hidden="true" />
                <span>{formatString(t.DuplicateOpen, r.assetTitle, duplicates.map(o => refOf(o.request)).join(', '))}</span>
              </li>
            )}
            <li className={css.bullet}>
              <Icon iconName="Send" className={css.bulletIcon} aria-hidden="true" />
              <span>
                {others.length === 0
                  ? t.OtherNone
                  : formatString(t.OtherRequests, others.length, othersOpen.length, others.filter(o => o.stage === 'rejected').length)}
              </span>
            </li>
          </ul>
        </div>

        {waiting ? (
          <div className={css.decision}>
            <h5 className={css.sectionTitle}>{t.SectionDecision}</h5>
            <TextField
              label={t.CommentLabel}
              placeholder={t.CommentPlaceholder}
              multiline
              rows={2}
              maxLength={500}
              value={comment}
              onChange={(_, v) => setComment(v || '')}
              disabled={busy}
            />
            <div className={css.buttons}>
              <PrimaryButton
                text={busy ? strings.Common.Processing : strings.Common.Approve}
                iconProps={{ iconName: 'Accept' }}
                onClick={approve}
                disabled={busy || !enough}
                title={enough ? undefined : t.ApproveBlocked}
              />
              <DefaultButton
                text={strings.Common.Reject}
                iconProps={{ iconName: 'Cancel' }}
                onClick={() => setRejectTarget(r)}
                disabled={busy}
                styles={{ root: { color: '#a4262c', borderColor: '#f1bbbc' }, icon: { color: '#a4262c' }, rootHovered: { color: '#a4262c', borderColor: '#a4262c' } }}
              />
            </div>
          </div>
        ) : (
          <div className={css.decision}>
            <h5 className={css.sectionTitle}>{strings.RequestList.SectionManagerApproval}</h5>
            {row.stage === 'rejected' ? (
              r.managerResponse
                ? <RejectionReasonCard reason={r.managerResponse} managerName={r.managerName} decidedAt={r.managerDecisionAt} />
                : <p className={css.quote}>{stageLabel('rejected')}</p>
            ) : (
              <>
                {r.managerResponse && <p className={css.quote}>{r.managerResponse}</p>}
                <p style={{ margin: '10px 0 0', fontSize: 13, color: MUTED }}>
                  {row.stage === 'assigned' ? strings.RequestList.AllocationAllocated : strings.RequestList.AllocationPendingAdmin}
                </p>
              </>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className={css.root}>
      <div className={css.header}>
        <h3 className={css.title}>{strings.ApprovalsPage.Title}</h3>
        <p className={css.subtitle}>{t.Subtitle}</p>
      </div>

      <StatusChips chips={chips} selected={stage} ariaLabel={strings.Columns.Status} onSelect={(key) => setStage(key as StageFilter)} />

      <div className={css.layout}>
        <div className={css.listPane}>
          <div className={css.tools}>
            <SearchBox placeholder={t.SearchPlaceholder} value={search} onChange={(_, v) => props.onSearchChange(v || '')} onClear={() => props.onSearchChange('')} />
            <Dropdown ariaLabel={strings.RecordLists.SortLabel} options={sortOptions} selectedKey={sort} onChange={(_, o) => o && setSort(o.key as SortKey)} />
            <span className={css.count}>{formatString(t.ListCount, visible.length)}</span>
          </div>
          {visible.length === 0 ? (
            <div className={css.emptyList}>
              <Icon iconName={stage === 'awaitingApproval' && !query ? 'CompletedSolid' : 'Search'} style={{ fontSize: 24, display: 'block', marginBottom: 8 }} />
              {stage === 'awaitingApproval' && !query ? t.AllCaughtUp : strings.RecordLists.EmptyFiltered}
            </div>
          ) : (
            <ul className={css.list} aria-label={strings.ApprovalsPage.Title}>{visible.map(renderItem)}</ul>
          )}
        </div>

        <div className={css.pane}>
          {current ? renderPane(current) : (
            <div className={css.paneEmpty}>
              <Icon iconName="DoubleChevronRight12" style={{ fontSize: 24, display: 'block', marginBottom: 8 }} />
              {t.SelectPrompt}
            </div>
          )}
        </div>
      </div>

      <RejectRequestDialog request={rejectTarget} onConfirm={confirmReject} onDismiss={() => setRejectTarget(undefined)} />
    </div>
  );
};
