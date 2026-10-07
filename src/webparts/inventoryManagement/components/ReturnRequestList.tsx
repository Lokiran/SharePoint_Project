import * as React from 'react';
import { useState, useMemo } from 'react';
import { PrimaryButton, DefaultButton, ActionButton, IconButton } from '@fluentui/react/lib/Button';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react/lib/TextField';
import { Stack } from '@fluentui/react/lib/Stack';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { Icon } from '@fluentui/react/lib/Icon';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { Shimmer } from '@fluentui/react/lib/Shimmer';
import { IReturnRequest } from '../models/IReturnRequest';
import { RETURN_CONDITION_OPTIONS } from '../constants/DropdownConstants';
import styles from './InventoryManagement.module.scss';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../utils/LocalizationUtils';
import { getReturnRequestStatusDisplayText } from '../utils/RequestStatusUtils';
import { TONES, ITone, conditionTone } from './inventory/inventoryUi';
import { Pager } from './common/Pager';
import {
  recordCss as css,
  ACCENTS,
  cardButtonStyles,
  Pill,
  StatusChips,
  LayoutSwitch,
  useRecordLayout,
  RecordLayout,
  RecordCard,
  MetaItem,
  BoardLanes,
  IStatusChip,
  formatFlexibleDay,
  relativeDay,
  timeOf,
  dateRangeOptions,
  inDateRange,
  DateRangeKey
} from './common/listUi';

export interface IReturnRequestListProps {
  items: IReturnRequest[];
  isAdmin: boolean;
  isManager: boolean;
  onUpdateStatus: (
    requestId: string,
    status: 'Approved' | 'Rejected' | 'Completed' | 'Pending Manager Approval' | 'Pending Admin Verification',
    comment: string,
    finalCondition?: string,
    adminComments?: string,
    managerStatus?: 'Pending' | 'Approved' | 'Rejected',
    adminStatus?: 'Not Started' | 'Completed'
  ) => Promise<void>;
  loading: boolean;
  /** Page heading, rendered above the status chips. */
  title?: string;
  subtitle?: string;
}

const conditionOptions = RETURN_CONDITION_OPTIONS;

type Stage = 'manager' | 'admin' | 'completed' | 'rejected';
type QuickFilter = 'mine' | 'all' | Stage;
type SortKey = 'newest' | 'oldest' | 'employee' | 'asset';

const PAGE_SIZE = 10;
const STAGES: Stage[] = ['manager', 'admin', 'completed', 'rejected'];
const STAGE_COLOR: { [stage in Stage]: string } = { manager: ACCENTS.orange, admin: ACCENTS.blue, completed: ACCENTS.green, rejected: ACCENTS.red };

const stageOf = (status?: string): Stage => {
  switch (status) {
    case 'Approved':
    case 'Pending Admin Verification': return 'admin';
    case 'Rejected': return 'rejected';
    case 'Completed':
    case 'Returned': return 'completed';
    default: return 'manager'; // Pending, Pending Manager Approval
  }
};

const stageTone = (stage: Stage): ITone =>
  stage === 'manager' ? TONES.orange : stage === 'admin' ? TONES.blue : stage === 'rejected' ? TONES.red : TONES.green;

export const ReturnRequestList: React.FC<IReturnRequestListProps> = (props) => {
  const { items, isAdmin, isManager, onUpdateStatus, loading } = props;
  const s = strings.RecordLists;

  const [layout, setLayout] = useRecordLayout('returns');
  const [searchQuery, setSearchQuery] = useState<string>('');
  // Cards start on the requests waiting for this role, as the page always has; the board shows the whole pipeline.
  const [quick, setQuick] = useState<QuickFilter>((isAdmin || isManager) && layout === 'cards' ? 'mine' : 'all');
  const [condition, setCondition] = useState('all');
  const [range, setRange] = useState<DateRangeKey>('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [page, setPage] = useState(1);

  // Dialog / State for Actions
  const [activeRequest, setActiveRequest] = useState<IReturnRequest | null>(null);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | 'Complete' | 'View' | null>(null);
  const [comment, setComment] = useState<string>('');
  const [finalCondition, setFinalCondition] = useState<string>('Good');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | undefined>();

  React.useEffect(() => setPage(1), [searchQuery, quick, condition, range, sort]);

  /** What this role can act on: managers approve, admins verify the check-in. */
  const needsMe = (item: IReturnRequest): boolean =>
    (isManager && stageOf(item.status) === 'manager') || (isAdmin && item.status === 'Pending Admin Verification');

  const stageLabel = (stage: Stage): string =>
    stage === 'manager' ? s.ReturnAwaitingManager : stage === 'admin' ? s.ReturnAwaitingAdmin : stage === 'completed' ? s.ReturnCompleted : s.ReturnRejected;

  const stageParts: IStatusChip[] = STAGES.map(stage => ({
    key: stage,
    label: stageLabel(stage),
    count: items.filter(i => stageOf(i.status) === stage).length,
    color: STAGE_COLOR[stage]
  }));
  const chips: IStatusChip[] = [
    ...(isAdmin || isManager ? [{ key: 'mine', label: s.ReturnNeedsMe, count: items.filter(needsMe).length, color: ACCENTS.blue }] : []),
    ...stageParts,
    { key: 'all', label: s.TileAll, count: items.length }
  ];

  const conditions = useMemo(() => Array.from(new Set(items.map(i => (i.proposedCondition || '').trim()).filter(Boolean))).sort(), [items]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = items.filter(item => {
      if (quick === 'mine' && !needsMe(item)) return false;
      if (quick !== 'mine' && quick !== 'all' && stageOf(item.status) !== quick) return false;
      if (condition !== 'all' && (item.proposedCondition || '').trim() !== condition) return false;
      if (!inDateRange(item.requestDate, range)) return false;
      if (!query) return true;
      return [item.id, item.assetName, item.serialNumber, item.requesterName, item.status, item.returnReason, item.managerComment]
        .some(v => (v || '').toLowerCase().includes(query));
    });

    const idOf = (i: IReturnRequest): number => parseInt((i.id || '0').replace(/\D/g, ''), 10) || 0;
    const newestFirst = (a: IReturnRequest, b: IReturnRequest): number => timeOf(b.requestDate) - timeOf(a.requestDate) || idOf(b) - idOf(a);
    return filtered.sort((a, b) => {
      switch (sort) {
        case 'oldest': return -newestFirst(a, b);
        case 'employee': return (a.requesterName || '').localeCompare(b.requesterName || '') || newestFirst(a, b);
        case 'asset': return (a.assetName || '').localeCompare(b.assetName || '') || newestFirst(a, b);
        default: return newestFirst(a, b);
      }
    });
  }, [items, searchQuery, quick, condition, range, sort, isAdmin, isManager]);

  const openDialog = (request: IReturnRequest, type: 'Approve' | 'Reject' | 'Complete' | 'View'): void => {
    setActiveRequest(request);
    setActionType(type);
    setComment('');
    setActionError(undefined);
    setFinalCondition(request.proposedCondition || 'Good');
  };

  const closeDialog = (): void => {
    setActiveRequest(null);
    setActionType(null);
    setComment('');
    setActionError(undefined);
    setSubmitting(false);
  };

  const handleAction = async (): Promise<void> => {
    if (!activeRequest || !actionType) return;

    if ((actionType === 'Reject' || actionType === 'Complete') && !comment.trim()) {
      setActionError(actionType === 'Reject' ? strings.ReturnRequestList.AlertRejectionRequired : strings.ReturnRequestList.AlertVerificationRequired);
      return;
    }

    try {
      setSubmitting(true);
      setActionError(undefined);
      if (actionType === 'Approve') {
        await onUpdateStatus(
          activeRequest.id,
          'Pending Admin Verification',
          comment || 'Approved by Manager',
          undefined,
          undefined,
          'Approved',
          'Not Started'
        );
      } else if (actionType === 'Reject') {
        await onUpdateStatus(
          activeRequest.id,
          'Rejected',
          comment,
          undefined,
          undefined,
          'Rejected',
          'Not Started'
        );
      } else if (actionType === 'Complete') {
        await onUpdateStatus(
          activeRequest.id,
          'Completed',
          activeRequest.managerComment || '',
          finalCondition,
          comment,
          'Approved',
          'Completed'
        );
      }
      closeDialog();
    } catch (e: any) {
      setActionError(strings.ReturnRequestList.AlertActionFailedPrefix + ' ' + (e.message || JSON.stringify(e)));
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusDisplayText = getReturnRequestStatusDisplayText;

  const changeLayout = (next: RecordLayout): void => {
    setLayout(next);
    // The board is the whole pipeline, so it starts unfiltered.
    if (next === 'board' && quick === 'mine') setQuick('all');
  };

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const activePage = Math.min(page, totalPages);
  const visible = filteredItems.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);

  // Only what this role may do for the request's current step.
  const renderActions = (item: IReturnRequest, compact: boolean): JSX.Element => {
    const ref = item.id.replace('RR-', '#');
    return (
      <>
        {compact ? (
          <IconButton iconProps={{ iconName: 'RedEye' }} title={strings.Common.View} ariaLabel={`${strings.Common.View} ${ref}`} onClick={() => openDialog(item, 'View')} />
        ) : (
          <DefaultButton text={strings.Common.View} iconProps={{ iconName: 'RedEye' }} ariaLabel={`${strings.Common.View} ${ref}`} onClick={() => openDialog(item, 'View')} styles={cardButtonStyles} />
        )}
        {isManager && stageOf(item.status) === 'manager' && (
          <>
            <DefaultButton
              text={strings.ReturnRequestList.ButtonReject}
              onClick={() => openDialog(item, 'Reject')}
              styles={{ ...cardButtonStyles, root: { ...cardButtonStyles.root, color: '#a4262c', borderColor: '#f1bbbc' } }}
            />
            <PrimaryButton text={strings.ReturnRequestList.ButtonApprove} iconProps={{ iconName: 'CheckMark' }} onClick={() => openDialog(item, 'Approve')} styles={cardButtonStyles} />
          </>
        )}
        {isAdmin && item.status === 'Pending Admin Verification' && (
          <PrimaryButton
            text={strings.ReturnRequestList.ButtonVerifyComplete}
            iconProps={{ iconName: 'CheckMark' }}
            onClick={() => openDialog(item, 'Complete')}
            styles={{
              ...cardButtonStyles,
              root: { ...cardButtonStyles.root, backgroundColor: '#107c10', borderColor: '#107c10' },
              rootHovered: { backgroundColor: '#0e5c0e', borderColor: '#0e5c0e' }
            }}
          />
        )}
      </>
    );
  };

  const renderCard = (item: IReturnRequest, compact: boolean): JSX.Element => {
    const stage = stageOf(item.status);
    const ago = relativeDay(item.requestDate);
    return (
      <RecordCard
        key={item.id}
        compact={compact}
        idText={item.id.replace('RR-', '#')}
        badges={
          <>
            {!compact && <Pill tone={stageTone(stage)} text={getStatusDisplayText(item.status)} title={strings.Columns.Status} />}
            {item.proposedCondition && <Pill tone={conditionTone(item.proposedCondition)} text={item.proposedCondition} title={strings.Columns.Condition} />}
          </>
        }
        title={item.assetName || s.Unspecified}
        text={item.returnReason}
        meta={
          <>
            {item.serialNumber && <MetaItem icon="Tag" title={strings.Columns.SerialNumber}>{item.serialNumber}</MetaItem>}
            <MetaItem icon="Contact" title={strings.ReturnRequestList.ColEmployee}>{item.requesterName || '—'}</MetaItem>
            <MetaItem icon="Calendar" title={strings.Columns.RequestedDate}>{formatFlexibleDay(item.requestDate)}{ago ? ` · ${ago}` : ''}</MetaItem>
          </>
        }
        actions={renderActions(item, compact)}
        onOpen={() => openDialog(item, 'View')}
      />
    );
  };

  const conditionFilterOptions: IDropdownOption[] = [{ key: 'all', text: s.AllConditions }].concat(conditions.map(c => ({ key: c, text: c })));
  const sortOptions: IDropdownOption[] = [
    { key: 'newest', text: s.SortNewest },
    { key: 'oldest', text: s.SortOldest },
    { key: 'employee', text: s.SortEmployee },
    { key: 'asset', text: s.SortAsset }
  ];
  const hasFilters = condition !== 'all' || range !== 'all' || !!searchQuery.trim();

  // A stage chip narrows the board to that one lane; every other filter keeps all four.
  const laneStages = STAGES.filter(stage => quick === 'all' || quick === 'mine' || quick === stage);

  const renderEmpty = (): JSX.Element => {
    // Nothing waiting for this role, but other returns exist: say so and offer the full list.
    if (quick === 'mine' && !hasFilters && items.length > 0) {
      return (
        <div className={css.empty}>
          <Icon iconName="CompletedSolid" style={{ fontSize: 28, display: 'block', marginBottom: 8, color: ACCENTS.green }} />
          <div style={{ fontWeight: 600, color: 'var(--text-main, #242424)', marginBottom: 4 }}>{s.ReturnNothingForMe}</div>
          <ActionButton iconProps={{ iconName: 'List' }} text={formatString(s.ReturnShowAll, items.length)} onClick={() => setQuick('all')} />
        </div>
      );
    }
    return (
      <div className={css.empty}>
        <Icon iconName={items.length === 0 ? 'ReturnToSession' : 'Search'} style={{ fontSize: 28, display: 'block', marginBottom: 8 }} />
        {items.length === 0 ? strings.ReturnRequestList.EmptyState : s.EmptyFiltered}
      </div>
    );
  };

  return (
    <div className={css.root}>
      <div className={css.header}>
        <div>
          {props.title && <h3 className={css.title}>{props.title}</h3>}
          {props.subtitle && <p className={css.subtitle}>{props.subtitle}</p>}
        </div>
        <LayoutSwitch layout={layout} onChange={changeLayout} />
      </div>

      <StatusChips chips={chips} selected={quick} ariaLabel={s.TilesAria} onSelect={(key) => setQuick(key as QuickFilter)} />

      <div className={css.filters}>
        <SearchBox
          className={css.search}
          placeholder={strings.ReturnRequestList.SearchPlaceholder}
          value={searchQuery}
          onChange={(_, val) => setSearchQuery(val || '')}
          onClear={() => setSearchQuery('')}
        />
        {conditions.length > 1 && (
          <Dropdown label={strings.Columns.Condition} options={conditionFilterOptions} selectedKey={condition} onChange={(_, o) => o && setCondition(String(o.key))} styles={{ root: { width: 150 } }} />
        )}
        <Dropdown label={strings.Columns.RequestedDate} options={dateRangeOptions()} selectedKey={range} onChange={(_, o) => o && setRange(o.key as DateRangeKey)} styles={{ root: { width: 150 } }} />
        <Dropdown label={s.SortLabel} options={sortOptions} selectedKey={sort} onChange={(_, o) => o && setSort(o.key as SortKey)} styles={{ root: { width: 180 } }} />
      </div>

      <div className={css.resultLine}>
        <span>{formatString(s.ReturnResultCount, filteredItems.length, items.length)}</span>
        {hasFilters && (
          <ActionButton iconProps={{ iconName: 'ClearFilter' }} text={s.ClearFilters} onClick={() => { setCondition('all'); setRange('all'); setSearchQuery(''); }} />
        )}
      </div>

      {loading && items.length === 0 ? (
        <div className={css.grid} aria-busy="true" aria-label={strings.ReturnRequestList.LoadingReturnRequests}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={css.card} style={{ cursor: 'default' }}>
              <Shimmer width="35%" />
              <Shimmer width="70%" />
              <Shimmer />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? renderEmpty() : layout === 'board' ? (
        <BoardLanes
          lanes={laneStages.map(stage => ({ key: stage, label: stageLabel(stage), color: STAGE_COLOR[stage], items: filteredItems.filter(i => stageOf(i.status) === stage) }))}
          keyOf={(item) => item.id}
          renderCard={(item) => renderCard(item, true)}
        />
      ) : (
        <>
          <div className={css.grid}>{visible.map(item => renderCard(item, false))}</div>
          <div className={css.pager}><Pager page={activePage} pageSize={PAGE_SIZE} totalItems={filteredItems.length} onChange={setPage} /></div>
        </>
      )}

      {/* Details / confirmation dialog */}
      <Dialog
        hidden={!activeRequest}
        onDismiss={closeDialog}
        minWidth={560}
        maxWidth={640}
        dialogContentProps={{
          type: DialogType.normal,
          title: actionType === 'Approve' ? strings.ReturnRequestList.DialogTitleApprove :
                 actionType === 'Reject' ? strings.ReturnRequestList.DialogTitleReject :
                 actionType === 'Complete' ? strings.ReturnRequestList.DialogTitleComplete : strings.ReturnRequestList.DialogTitleView,
          subText: activeRequest ? formatString(strings.ReturnRequestList.DialogSubtext, activeRequest.requesterName, activeRequest.assetName) : ''
        }}
        modalProps={{ isBlocking: actionType !== 'View' }}
      >
        <Stack tokens={{ childrenGap: 15 }} style={{ marginTop: '15px' }}>
          {/* Asset Return Details Card */}
          {activeRequest && (
            <div style={{
              backgroundColor: 'rgba(128, 128, 128, 0.05)',
              border: '1px solid rgba(128, 128, 128, 0.15)',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '0.85rem',
              fontFamily: 'inherit'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, margin: '0 0 12px 0', borderBottom: '1px solid rgba(128, 128, 128, 0.1)', paddingBottom: '6px' }}>
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main, #333333)' }}>
                  {strings.ReturnRequestList.CardTitle}
                </h4>
                <Pill tone={stageTone(stageOf(activeRequest.status))} text={getStatusDisplayText(activeRequest.status)} />
              </div>
              <div className={styles.responsiveGrid} style={{ gap: '12px 16px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>{strings.Columns.RequestId}</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{activeRequest.id.replace('RR-', '#')}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>{strings.Columns.RequestedDate}</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{formatFlexibleDay(activeRequest.requestDate)}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>{strings.Columns.AssetName}</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{activeRequest.assetName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>{strings.Columns.SerialNumber}</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{activeRequest.serialNumber || strings.Common.NotAvailable}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>{strings.ReturnRequestList.ColEmployee}</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{activeRequest.requesterName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>{strings.ReturnRequestList.LabelProposedCondition}</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{activeRequest.proposedCondition}</strong>
                </div>
                {(activeRequest.completedDate || activeRequest.verifiedDate) && (
                  <div>
                    <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>{s.ReturnCompletedOn}</span>
                    <strong style={{ color: 'var(--text-main, #333333)' }}>{formatFlexibleDay(activeRequest.completedDate || activeRequest.verifiedDate)}</strong>
                  </div>
                )}
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>{strings.ReturnRequestList.LabelReturnReason}</span>
                  <div style={{
                    backgroundColor: 'rgba(128, 128, 128, 0.05)',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    marginTop: '4px',
                    border: '1px solid rgba(128, 128, 128, 0.1)',
                    fontWeight: 500,
                    color: 'var(--text-main, #333333)'
                  }}>
                    {activeRequest.returnReason}
                  </div>
                </div>
                {activeRequest.managerComment && (
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>{strings.Columns.ManagerNotes}</span>
                    <div style={{
                      backgroundColor: 'rgba(128, 128, 128, 0.05)',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      marginTop: '4px',
                      border: '1px solid rgba(128, 128, 128, 0.1)',
                      fontWeight: 500,
                      color: 'var(--text-main, #333333)'
                    }}>
                      {activeRequest.managerComment}
                    </div>
                  </div>
                )}
                {activeRequest.adminComments && (
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>{strings.ReturnRequestList.LabelVerificationComments}</span>
                    <div style={{
                      backgroundColor: 'rgba(128, 128, 128, 0.05)',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      marginTop: '4px',
                      border: '1px solid rgba(128, 128, 128, 0.1)',
                      fontWeight: 500,
                      color: 'var(--text-main, #333333)'
                    }}>
                      {activeRequest.adminComments}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/*
            REDUNDANT / REVIEW-ONLY: This condition selection is part of the secondary
            check-in step, which is now redundant. Retained for review only.
          */}
          {actionType === 'Complete' && (
            <Dropdown
              label={strings.ReturnRequestList.LabelFinalCondition}
              selectedKey={finalCondition}
              options={conditionOptions}
              onChange={(_, opt) => setFinalCondition(opt ? (opt.key as string) : 'Good')}
            />
          )}

          {actionType !== 'View' && (
            <TextField
              label={
                actionType === 'Reject' ? strings.ReturnRequestList.LabelRejectionReason :
                actionType === 'Complete' ? strings.ReturnRequestList.LabelVerificationComments :
                strings.ReturnRequestList.LabelManagerComments
              }
              placeholder={
                actionType === 'Reject' ? strings.ReturnRequestList.PlaceholderRejectionReason :
                actionType === 'Complete' ? strings.ReturnRequestList.PlaceholderVerificationComments :
                strings.ReturnRequestList.PlaceholderManagerComments
              }
              multiline
              rows={3}
              value={comment}
              onChange={(_, val) => { setComment(val || ''); setActionError(undefined); }}
              required={actionType === 'Reject' || actionType === 'Complete'}
            />
          )}

          {actionError && (
            <MessageBar messageBarType={MessageBarType.error} isMultiline onDismiss={() => setActionError(undefined)}>
              {actionError}
            </MessageBar>
          )}
        </Stack>

        <DialogFooter>
          {actionType !== 'View' ? (
            <>
              <PrimaryButton
                text={actionType === 'Approve' ? strings.ReturnRequestList.ButtonApprove :
                      actionType === 'Reject' ? strings.ReturnRequestList.ButtonReject : strings.ReturnRequestList.ButtonVerifyComplete}
                onClick={handleAction}
                disabled={submitting || ((actionType === 'Reject' || actionType === 'Complete') && !comment.trim())}
              />
              <DefaultButton text={strings.Common.Cancel} onClick={closeDialog} disabled={submitting} />
            </>
          ) : (
            <>
              {/* Opened from the card: offer the step this role can take next. */}
              {activeRequest && isManager && stageOf(activeRequest.status) === 'manager' && (
                <>
                  <PrimaryButton text={strings.ReturnRequestList.ButtonApprove} onClick={() => setActionType('Approve')} />
                  <DefaultButton text={strings.ReturnRequestList.ButtonReject} onClick={() => setActionType('Reject')} />
                </>
              )}
              {activeRequest && isAdmin && activeRequest.status === 'Pending Admin Verification' && (
                <PrimaryButton text={strings.ReturnRequestList.ButtonVerifyComplete} onClick={() => setActionType('Complete')} />
              )}
              <DefaultButton text={strings.Common.Close} onClick={closeDialog} />
            </>
          )}
        </DialogFooter>
      </Dialog>
    </div>
  );
};
