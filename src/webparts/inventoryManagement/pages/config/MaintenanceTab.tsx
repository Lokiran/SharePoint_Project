import * as React from 'react';
import { PrimaryButton, DefaultButton, ActionButton, MessageBar, MessageBarType, Icon } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import css from '../ConfigPage.module.scss';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';
import { IConfigState, IConfigActions } from '../../types/Config.types';
import { IInventoryItem } from '../../models/IInventoryItem';
import { IRequest } from '../../models/IRequest';
import { InventoryItemService } from '../../services/InventoryItemService';
import { RequestService } from '../../services/RequestService';
import { AuditLogService } from '../../services/AuditLogService';
import { getAppConfig } from '../../config/AppConfig';
import { getSlaStage, evaluateRequestSla } from '../../utils/RequestSlaUtils';
import { isOpenRequest, isSameRequester } from '../../utils/RequestDuplicateUtils';
import { exportRowsToCsv } from '../../utils/ReportExportUtils';
import { statusBucket } from '../../components/inventory/inventoryUi';
import { parseFlexibleDate } from '../../components/common/listUi';

export interface IMaintenanceTabProps {
  state: IConfigState;
  actions: IConfigActions;
}

/** One finding of a check: what is wrong and the records it applies to. */
interface IFinding {
  key: string;
  label: string;
  hint: string;
  severity: 'bad' | 'warn';
  records: { id: string; text: string }[];
}

interface ICheckResult {
  checkedAt: Date;
  total: number;
  findings: IFinding[];
}

const MAX_SHOWN = 50;

const local = mergeStyleSets({
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(380px, 100%), 1fr))', gap: 16 },
  tool: { display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0, padding: '16px 18px', borderRadius: 12, border: '1px solid rgba(128, 128, 128, 0.22)', background: 'var(--surface-bg, #ffffff)' },
  toolHead: { display: 'flex', gap: 12, alignItems: 'flex-start' },
  toolIcon: { width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, background: 'rgba(15, 108, 189, 0.12)', color: '#0f6cbd' },
  toolTitle: { margin: 0, fontSize: 15, fontWeight: 600 },
  toolDesc: { margin: '2px 0 0', fontSize: 13, color: 'var(--text-muted, #616161)', lineHeight: '18px' },
  buttons: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  summary: { fontSize: 13, color: 'var(--text-muted, #616161)' },
  findings: { listStyle: 'none', margin: 0, padding: 0, borderTop: '1px solid rgba(128, 128, 128, 0.18)' },
  finding: { borderBottom: '1px solid rgba(128, 128, 128, 0.12)' },
  findingRow: {
    display: 'grid', gridTemplateColumns: '16px minmax(0, 1fr) auto 14px', gap: 10, alignItems: 'center', width: '100%',
    padding: '9px 2px', border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', color: 'inherit', textAlign: 'left',
    selectors: { ':hover': { background: 'rgba(128, 128, 128, 0.07)' }, ':focus-visible': { outline: '2px solid #0f6cbd', outlineOffset: -2 } }
  },
  findingLabel: { fontSize: 13, fontWeight: 600 },
  findingHint: { display: 'block', fontSize: 12, fontWeight: 400, color: 'var(--text-muted, #616161)' },
  records: { margin: '0 0 10px 26px', padding: 0, listStyle: 'disc inside', fontSize: 12, lineHeight: '20px', color: 'var(--text-main, #242424)' },
  allGood: { display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#0e5c0e' }
});

const name = (i: IInventoryItem): string => (i.assetName || i.title || '').trim() || strings.InventoryExplorer.Unnamed;
const itemText = (i: IInventoryItem): string => `${name(i)} · ${i.serialNumber || strings.Common.NotAvailable}${i.assignedTo ? ` · ${i.assignedTo}` : ''}`;
const requestText = (r: IRequest): string => `${r.requestKey || `#${r.id}`} · ${r.requesterName || '—'} · ${r.assetTitle || '—'}${r.quantity > 1 ? ` × ${r.quantity}` : ''}`;

/** Inventory data problems that make reports, stock counts and assignments unreliable. */
const checkInventory = (items: IInventoryItem[]): IFinding[] => {
  const m = strings.Maintenance;
  const bySerial: { [serial: string]: IInventoryItem[] } = {};
  items.forEach(i => {
    const serial = (i.serialNumber || '').trim().toLowerCase();
    if (serial) (bySerial[serial] = bySerial[serial] || []).push(i);
  });
  const duplicates = Object.keys(bySerial).filter(k => bySerial[k].length > 1).reduce((all, k) => all.concat(bySerial[k]), [] as IInventoryItem[]);
  const toRecords = (list: IInventoryItem[]): { id: string; text: string }[] => list.map(i => ({ id: i.id, text: itemText(i) }));
  const warrantyBeforePurchase = items.filter(i => {
    const bought = parseFlexibleDate(i.purchaseDate);
    const ends = parseFlexibleDate(i.warrantyExpiry);
    return !!bought && !!ends && ends.getTime() < bought.getTime();
  });

  return [
    { key: 'dupSerial', label: m.InvDuplicateSerial, hint: m.InvDuplicateSerialHint, severity: 'bad', records: toRecords(duplicates) },
    { key: 'noSerial', label: m.InvMissingSerial, hint: m.InvMissingSerialHint, severity: 'warn', records: toRecords(items.filter(i => !(i.serialNumber || '').trim())) },
    { key: 'assignedNoPerson', label: m.InvAssignedNoPerson, hint: m.InvAssignedNoPersonHint, severity: 'bad', records: toRecords(items.filter(i => statusBucket(i.status) === 'assigned' && !(i.assignedTo || '').trim())) },
    { key: 'personInStock', label: m.InvPersonInStock, hint: m.InvPersonInStockHint, severity: 'warn', records: toRecords(items.filter(i => statusBucket(i.status) === 'inStock' && !!(i.assignedTo || '').trim())) },
    { key: 'unknownStatus', label: m.InvUnknownStatus, hint: m.InvUnknownStatusHint, severity: 'warn', records: toRecords(items.filter(i => statusBucket(i.status) === 'other')) },
    { key: 'noPurchase', label: m.InvMissingPurchase, hint: m.InvMissingPurchaseHint, severity: 'warn', records: toRecords(items.filter(i => !parseFlexibleDate(i.purchaseDate))) },
    { key: 'noWarranty', label: m.InvMissingWarranty, hint: m.InvMissingWarrantyHint, severity: 'warn', records: toRecords(items.filter(i => !parseFlexibleDate(i.warrantyExpiry))) },
    { key: 'warrantyOrder', label: m.InvWarrantyBeforePurchase, hint: m.InvWarrantyBeforePurchaseHint, severity: 'bad', records: toRecords(warrantyBeforePurchase) }
  ];
};

/** Requests that are stuck, duplicated or cannot be fulfilled as raised. */
const checkRequests = (requests: IRequest[], items: IInventoryItem[]): IFinding[] => {
  const m = strings.Maintenance;
  const targets = getAppConfig().sla;
  const now = Date.now();
  const sla = requests.map(r => ({ r, s: evaluateRequestSla(r, targets, now) }));
  const toRecords = (list: IRequest[]): { id: string; text: string }[] => list.map(r => ({ id: r.id, text: requestText(r) }));

  const open = requests.filter(isOpenRequest);
  const duplicates = open.filter(r => open.some(o => o.id !== r.id && (o.assetTitle || '').trim().toLowerCase() === (r.assetTitle || '').trim().toLowerCase() && isSameRequester(o.requesterName, r.requesterName)));
  const knownTypes = items.map(i => (i.assetType || '').trim().toLowerCase()).filter(Boolean);
  const unknownType = open.filter(r => knownTypes.indexOf((r.assetTitle || '').trim().toLowerCase()) < 0);

  return [
    { key: 'overdueApproval', label: m.ReqOverdueApproval, hint: formatString(m.ReqOverdueApprovalHint, targets.approvalHours), severity: 'warn', records: toRecords(sla.filter(x => x.s.stage === 'awaitingApproval' && x.s.overdue).map(x => x.r)) },
    { key: 'overdueAssignment', label: m.ReqOverdueAssignment, hint: formatString(m.ReqOverdueAssignmentHint, targets.assignmentHours), severity: 'bad', records: toRecords(sla.filter(x => x.s.stage === 'awaitingAssignment' && x.s.overdue).map(x => x.r)) },
    { key: 'duplicates', label: m.ReqDuplicates, hint: m.ReqDuplicatesHint, severity: 'warn', records: toRecords(duplicates) },
    { key: 'noManager', label: m.ReqNoManager, hint: m.ReqNoManagerHint, severity: 'warn', records: toRecords(open.filter(r => getSlaStage(r) === 'awaitingApproval' && !(r.managerName || '').trim())) },
    { key: 'unknownType', label: m.ReqUnknownType, hint: m.ReqUnknownTypeHint, severity: 'warn', records: toRecords(unknownType) }
  ];
};

/** Config → Maintenance: data checks, the Mapping List sync and data backups. */
export const MaintenanceTab: React.FC<IMaintenanceTabProps> = ({ state, actions }) => {
  const s = strings.ConfigPage;
  const m = strings.Maintenance;

  const [inventoryResult, setInventoryResult] = React.useState<ICheckResult | undefined>();
  const [requestResult, setRequestResult] = React.useState<ICheckResult | undefined>();
  const [running, setRunning] = React.useState<'inventory' | 'requests' | 'backup' | undefined>();
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [error, setError] = React.useState<string | undefined>();
  const [backupNote, setBackupNote] = React.useState<string | undefined>();

  const run = async (which: 'inventory' | 'requests'): Promise<void> => {
    setRunning(which);
    setError(undefined);
    try {
      const items = await InventoryItemService.getItems();
      if (which === 'inventory') {
        setInventoryResult({ checkedAt: new Date(), total: items.length, findings: checkInventory(items) });
      } else {
        const requests = await RequestService.getRequests();
        setRequestResult({ checkedAt: new Date(), total: requests.length, findings: checkRequests(requests, items) });
      }
    } catch (e: any) {
      setError(formatString(m.CheckFailed, e && e.message ? e.message : String(e)));
    } finally {
      setRunning(undefined);
    }
  };

  const exportFindings = (result: ICheckResult, fileBase: string): void => exportRowsToCsv(
    fileBase,
    [m.ColCheck, m.ColRecord],
    result.findings.reduce((rows, f) => rows.concat(f.records.map(r => [f.label, r.text])), [] as string[][])
  );

  const backup = async (what: 'inventory' | 'requests' | 'audit'): Promise<void> => {
    setRunning('backup');
    setError(undefined);
    setBackupNote(undefined);
    try {
      if (what === 'inventory') {
        const items = await InventoryItemService.getItems();
        exportRowsToCsv('Inventory_Backup',
          ['ID', 'Title', 'Asset Name', 'Asset Type', 'Serial Number', 'Status', 'Condition', 'Assigned To', 'Assigned To Email', 'Assigned Date', 'Purchase Date', 'Warranty Expiry', 'Vendor', 'Specifications', 'Note'],
          items.map(i => [i.id, i.title, i.assetName, i.assetType, i.serialNumber, i.status, i.condition, i.assignedTo, i.assignedToEmail, i.assignedDate, i.purchaseDate, i.warrantyExpiry, i.vendor, i.specifications, i.note]));
        setBackupNote(formatString(m.BackupDone, items.length));
      } else if (what === 'requests') {
        const requests = await RequestService.getRequests();
        exportRowsToCsv('Requests_Backup',
          ['ID', 'Request ID', 'Requester', 'Employee ID', 'Manager', 'Asset Type', 'Quantity', 'Priority', 'Status', 'Asset Status', 'Request Date', 'Created', 'Manager Decision', 'Assigned', 'Reason', 'Manager Comment'],
          requests.map(r => [r.id, r.requestKey, r.requesterName, r.employeeId, r.managerName, r.assetTitle, r.quantity, r.priority, r.status, r.assetStatus, r.requestDate, r.createdAt, r.managerDecisionAt, r.assignedAt, r.reason, r.managerResponse]));
        setBackupNote(formatString(m.BackupDone, requests.length));
      } else {
        const logs = await AuditLogService.getAuditLogs();
        exportRowsToCsv('Audit_Log_Backup',
          ['ID', 'Timestamp', 'Action', 'Type', 'Record ID', 'Title', 'Asset', 'User', 'Details'],
          logs.map(l => [l.id, l.timestamp, l.action, l.entityType, l.entityId, l.title, l.assetName, l.user, l.details]));
        setBackupNote(formatString(m.BackupDone, logs.length));
      }
    } catch (e: any) {
      setError(formatString(m.CheckFailed, e && e.message ? e.message : String(e)));
    } finally {
      setRunning(undefined);
    }
  };

  const renderResult = (result: ICheckResult | undefined, scope: string, fileBase: string, countText: string): JSX.Element | null => {
    if (!result) return null;
    const found = result.findings.filter(f => f.records.length > 0);
    return (
      <>
        <span className={local.summary}>
          {formatString(countText, result.total)} · {formatString(m.CheckedAt, result.checkedAt.toLocaleTimeString())}
        </span>
        {found.length === 0 ? (
          <span className={local.allGood}><Icon iconName="CompletedSolid" /> {m.AllGood}</span>
        ) : (
          <>
            <ul className={local.findings}>
              {found.map(f => {
                const id = `${scope}-${f.key}`;
                const isOpen = !!expanded[id];
                return (
                  <li key={f.key} className={local.finding}>
                    <button type="button" className={local.findingRow} aria-expanded={isOpen} onClick={() => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))}>
                      <Icon iconName={f.severity === 'bad' ? 'ErrorBadge' : 'Warning'} style={{ color: f.severity === 'bad' ? '#c50f1f' : '#bc4b09' }} />
                      <span className={local.findingLabel}>
                        {f.label}
                        <span className={local.findingHint}>{f.hint}</span>
                      </span>
                      <span className={`${css.pill} ${f.severity === 'bad' ? css.pillBad : css.pillWarn}`}>{f.records.length}</span>
                      <Icon iconName={isOpen ? 'ChevronUp' : 'ChevronDown'} style={{ fontSize: 10 }} />
                    </button>
                    {isOpen && (
                      <ul className={local.records}>
                        {f.records.slice(0, MAX_SHOWN).map(r => <li key={r.id}>{r.text}</li>)}
                        {f.records.length > MAX_SHOWN && <li>{formatString(m.MoreRecords, f.records.length - MAX_SHOWN)}</li>}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
            <div><ActionButton iconProps={{ iconName: 'ExcelDocument' }} text={m.ExportFindings} onClick={() => exportFindings(result, fileBase)} /></div>
          </>
        )}
      </>
    );
  };

  const tool = (icon: string, title: string, desc: string, body: React.ReactNode): JSX.Element => (
    <section className={local.tool}>
      <div className={local.toolHead}>
        <span className={local.toolIcon} aria-hidden="true"><Icon iconName={icon} /></span>
        <div>
          <h5 className={local.toolTitle}>{title}</h5>
          <p className={local.toolDesc}>{desc}</p>
        </div>
      </div>
      {body}
    </section>
  );

  return (
    <div className={css.panel}>
      <div className={css.panelHeader}>
        <div>
          <h4>{m.Title}</h4>
          <p>{m.Subtitle}</p>
        </div>
      </div>

      {error && (
        <MessageBar messageBarType={MessageBarType.error} isMultiline onDismiss={() => setError(undefined)} styles={{ root: { marginBottom: 12 } }}>{error}</MessageBar>
      )}

      <div className={local.grid}>
        {tool('ProductList', m.InventoryTitle, m.InventoryDesc, (
          <>
            <div className={local.buttons}>
              <PrimaryButton
                text={running === 'inventory' ? m.Checking : inventoryResult ? m.RunAgain : m.RunCheck}
                iconProps={{ iconName: 'CheckList' }}
                onClick={() => { run('inventory').catch(() => undefined); }}
                disabled={!!running}
              />
            </div>
            {renderResult(inventoryResult, 'inventory', 'Inventory_Data_Check', m.AssetsChecked)}
          </>
        ))}

        {tool('Send', m.RequestsTitle, m.RequestsDesc, (
          <>
            <div className={local.buttons}>
              <PrimaryButton
                text={running === 'requests' ? m.Checking : requestResult ? m.RunAgain : m.RunCheck}
                iconProps={{ iconName: 'CheckList' }}
                onClick={() => { run('requests').catch(() => undefined); }}
                disabled={!!running}
              />
            </div>
            {renderResult(requestResult, 'requests', 'Request_Queue_Check', m.RequestsChecked)}
          </>
        ))}

        {tool('Sync', s.OperationsTitle, `${s.OperationsDescBefore} ${s.ListTitle_MappingList}. ${s.OperationsDescAfter}`, (
          <>
            <div className={local.buttons}>
              <PrimaryButton
                text={state.syncInProgress ? s.SyncButtonProcessing : s.SyncButtonDefault}
                iconProps={{ iconName: 'Sync' }}
                onClick={actions.onSyncAssignedAssets}
                disabled={state.syncInProgress}
              />
              <DefaultButton
                text={state.syncInProgress ? s.DiagnosticsButtonChecking : s.DiagnosticsButtonDefault}
                iconProps={{ iconName: 'Database' }}
                onClick={actions.onRunDiagnostics}
                disabled={state.syncInProgress}
              />
            </div>
            {state.syncMessage && (
              <MessageBar messageBarType={state.syncMessageType} isMultiline onDismiss={actions.onDismissSyncMessage} styles={{ root: { borderRadius: 6 } }}>
                {state.syncMessage}
              </MessageBar>
            )}
            {state.diagnosticInfo && (
              <div>
                <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>{s.DiagnosticLogLabel}</span>
                <textarea readOnly value={state.diagnosticInfo} rows={8} className={css.diagnosticLog} />
              </div>
            )}
          </>
        ))}

        {tool('CloudDownload', m.BackupTitle, m.BackupDesc, (
          <>
            <div className={local.buttons}>
              <DefaultButton text={m.BackupInventory} iconProps={{ iconName: 'ExcelDocument' }} onClick={() => { backup('inventory').catch(() => undefined); }} disabled={!!running} />
              <DefaultButton text={m.BackupRequests} iconProps={{ iconName: 'ExcelDocument' }} onClick={() => { backup('requests').catch(() => undefined); }} disabled={!!running} />
              <DefaultButton text={m.BackupAudit} iconProps={{ iconName: 'ExcelDocument' }} onClick={() => { backup('audit').catch(() => undefined); }} disabled={!!running} />
            </div>
            {running === 'backup' && <span className={local.summary}>{m.Preparing}</span>}
            {backupNote && <span className={local.summary}>{backupNote}</span>}
          </>
        ))}
      </div>
    </div>
  );
};
