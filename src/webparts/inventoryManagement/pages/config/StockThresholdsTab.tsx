import * as React from 'react';
import { PrimaryButton, DefaultButton, ActionButton, MessageBar, MessageBarType, TextField, SearchBox, Icon } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import css from '../ConfigPage.module.scss';
import { InventoryItemService } from '../../services/InventoryItemService';
import { RequestService } from '../../services/RequestService';
import { StockThresholdService, IStockAlertResult } from '../../services/StockThresholdService';
import { EmailSettingsService } from '../../services/EmailSettingsService';
import { getAppConfig } from '../../config/AppConfig';
import { evaluateStockLevels, IStockLevel, IStockThreshold } from '../../utils/StockUtils';
import { getSlaStage } from '../../utils/RequestSlaUtils';
import { exportRowsToCsv } from '../../utils/ReportExportUtils';
import { IInventoryItem } from '../../models/IInventoryItem';
import { IRequest } from '../../models/IRequest';
import { DEFAULT_ASSET_TYPE_OPTIONS } from '../../constants/DropdownConstants';
import { statusBucket } from '../../components/inventory/inventoryUi';
import { StatusChips, IStatusChip } from '../../components/common/listUi';
import { KpiRow, IKpi, PALETTE } from '../../components/reports/reportsUi';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';

type RowState = 'out' | 'low' | 'risk' | 'ok' | 'off';
type Filter = 'all' | 'attention' | 'ok' | 'off';

interface IStockRow {
  level: IStockLevel;
  assigned: number;
  /** Units asked for in requests still waiting for the manager. */
  awaitingApproval: number;
  /** Units approved and waiting for the admin to assign. */
  awaitingAssignment: number;
  /** Available once the approved requests are fulfilled. */
  afterPending: number;
  state: RowState;
}

const local = mergeStyleSets({
  toolbar: { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end', margin: '4px 0 12px' },
  search: { flex: '1 1 220px', minWidth: 180 },
  bulk: { display: 'flex', gap: 8, alignItems: 'flex-end' },
  meter: { display: 'block', width: 90, height: 6, marginTop: 4, borderRadius: 999, background: 'rgba(128, 128, 128, 0.2)', overflow: 'hidden' },
  meterFill: { display: 'block', height: '100%', borderRadius: 999 },
  note: { display: 'block', marginTop: 4, fontSize: 12, color: 'var(--text-muted, #616161)' },
  tableWrap: { overflowX: 'auto' }
});

const sameType = (a?: string, b?: string): boolean => (a || '').trim().toLowerCase() === (b || '').trim().toLowerCase();

/** Config → Stock Alerts: stock against per-type minimums, pending demand, alert state and settings. */
export const StockThresholdsTab: React.FC = () => {
  const f = strings.Features;
  const t = strings.StockAlerts;
  const config = getAppConfig();
  const defaultMinimum = config.stock.defaultMinimum;

  const [items, setItems] = React.useState<IInventoryItem[]>([]);
  const [requests, setRequests] = React.useState<IRequest[]>([]);
  const [thresholds, setThresholds] = React.useState<IStockThreshold[]>([]);
  const [recipients, setRecipients] = React.useState<string[] | undefined>();
  const [emailOn, setEmailOn] = React.useState<boolean | undefined>();
  const [edits, setEdits] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: MessageBarType; text: string } | undefined>();
  const [filter, setFilter] = React.useState<Filter>('all');
  const [search, setSearch] = React.useState('');
  const [bulk, setBulk] = React.useState('');

  const load = React.useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const [loadedItems, loadedThresholds] = await Promise.all([
        InventoryItemService.getItems(),
        StockThresholdService.getThresholds()
      ]);
      setItems(loadedItems);
      setThresholds(loadedThresholds);
      setEdits({});
    } catch (e: any) {
      setMessage({ type: MessageBarType.error, text: e && e.message ? e.message : String(e) });
    } finally {
      setLoading(false);
    }
    // Demand and alert settings are extras: the table works without them.
    RequestService.getRequests().then(setRequests).catch(() => setRequests([]));
    StockThresholdService.getAlertRecipients().then(setRecipients).catch(() => setRecipients([]));
    EmailSettingsService.get().then(st => setEmailOn(st.enabled)).catch(() => setEmailOn(undefined));
  }, []);

  React.useEffect(() => { load().catch(() => undefined); }, [load]);

  // Standard types are listed even when there are no items of that type yet.
  const levels: IStockLevel[] = React.useMemo(() => {
    const placeholderRows: IStockThreshold[] = DEFAULT_ASSET_TYPE_OPTIONS
      .map(o => String(o.key))
      .filter(type => type !== 'Other' && !thresholds.some(th => th.assetType.toLowerCase() === type.toLowerCase()))
      .map(type => ({ assetType: type }));
    return evaluateStockLevels(items, thresholds.concat(placeholderRows), defaultMinimum);
  }, [items, thresholds, defaultMinimum]);

  const rows: IStockRow[] = levels.map(level => {
    const ofType = requests.filter(r => sameType(r.assetTitle, level.assetType));
    const units = (stage: string): number => ofType.filter(r => getSlaStage(r) === stage).reduce((sum, r) => sum + (Number(r.quantity) || 1), 0);
    const awaitingAssignment = units('awaitingAssignment');
    const afterPending = level.available - awaitingAssignment;
    const state: RowState = level.minimum === 0 ? 'off'
      : level.available === 0 ? 'out'
        : level.isLow ? 'low'
          : afterPending < level.minimum ? 'risk' : 'ok';
    return {
      level,
      assigned: items.filter(i => sameType(i.assetType, level.assetType) && statusBucket(i.status) === 'assigned').length,
      awaitingApproval: units('awaitingApproval'),
      awaitingAssignment,
      afterPending,
      state
    };
  });

  const needsAttention = (r: IStockRow): boolean => r.state === 'out' || r.state === 'low' || r.state === 'risk';
  const query = search.trim().toLowerCase();
  const visible = rows.filter(r =>
    (filter === 'all' || (filter === 'attention' ? needsAttention(r) : filter === 'ok' ? r.state === 'ok' : r.state === 'off')) &&
    (!query || r.level.assetType.toLowerCase().indexOf(query) >= 0));

  const valueFor = (level: IStockLevel): string =>
    edits[level.assetType] !== undefined ? edits[level.assetType] : level.hasCustomMinimum ? String(level.minimum) : '';

  const invalid = Object.keys(edits).some(k => edits[k].trim() !== '' && !(Number(edits[k]) >= 0));
  const dirty = Object.keys(edits).length > 0;
  const bulkValid = bulk.trim() !== '' && Number(bulk) >= 0;

  const save = async (): Promise<void> => {
    setBusy(true);
    setMessage(undefined);
    try {
      await StockThresholdService.saveThresholds(Object.keys(edits).map(type => ({
        assetType: type,
        minimumStock: edits[type].trim() === '' ? undefined : Number(edits[type])
      })));
      setMessage({ type: MessageBarType.success, text: f.StockSaved });
      await load();
    } catch (e: any) {
      setMessage({ type: MessageBarType.error, text: formatString(f.StockSaveFailed, e && e.message ? e.message : String(e)) });
    } finally {
      setBusy(false);
    }
  };

  const describeCheck = (result: IStockAlertResult): { type: MessageBarType; text: string } => {
    if (result.held && result.held.length > 0) return { type: MessageBarType.warning, text: formatString(strings.EmailCenter.StockAlertsHeld, result.held.join(', ')) };
    if (result.failed && result.failed.length > 0) return { type: MessageBarType.error, text: formatString(t.CheckEmailFailed, result.failed.join(', '), result.emailError || '') };
    if (result.noRecipients && result.noRecipients.length > 0) return { type: MessageBarType.warning, text: formatString(t.CheckNoRecipients, result.noRecipients.join(', '), config.roleGroups.admin) };
    if (result.alerted.length > 0) return { type: MessageBarType.warning, text: formatString(f.StockAlertSent, result.alerted.join(', ')) };
    return { type: MessageBarType.info, text: f.StockNoNewAlerts };
  };

  const checkNow = async (): Promise<void> => {
    setBusy(true);
    setMessage(undefined);
    const result = await StockThresholdService.checkAndNotify(items);
    setBusy(false);
    setMessage(result ? describeCheck(result) : { type: MessageBarType.error, text: f.StockCheckFailed });
    await load();
  };

  const resetAlert = async (level: IStockLevel): Promise<void> => {
    if (!level.threshold || !level.threshold.id) return;
    setBusy(true);
    try {
      await StockThresholdService.resetAlert(level.threshold.id);
      setMessage({ type: MessageBarType.success, text: formatString(t.ResetDone, level.assetType) });
      await load();
    } catch (e: any) {
      setMessage({ type: MessageBarType.error, text: e && e.message ? e.message : String(e) });
    } finally {
      setBusy(false);
    }
  };

  const applyBulk = (): void => {
    if (!bulkValid) return;
    setEdits(prev => {
      const next = { ...prev };
      visible.forEach(r => { next[r.level.assetType] = String(Math.floor(Number(bulk))); });
      return next;
    });
    setBulk('');
  };

  const stateText = (state: RowState): string =>
    state === 'out' ? t.StatusOut : state === 'low' ? f.StockLow : state === 'risk' ? t.StatusRisk : state === 'ok' ? f.StockOk : f.StockNotMonitored;

  const exportCsv = (): void => exportRowsToCsv(
    'Stock_Levels',
    [f.StockColType, f.StockColAvailable, f.StockColTotal, t.ColAssigned, t.ColAwaitingApproval, t.ColAwaitingAssignment, t.ColAfter, f.StockColMinimum, f.StockColStatus],
    rows.map(r => [r.level.assetType, r.level.available, r.level.total, r.assigned, r.awaitingApproval, r.awaitingAssignment, r.afterPending, r.level.minimum, stateText(r.state)])
  );

  const monitored = rows.filter(r => r.state !== 'off');
  const below = rows.filter(r => r.state === 'out' || r.state === 'low');
  const kpis: IKpi[] = [
    { key: 'monitored', icon: 'BarChartVertical', color: PALETTE.blue, label: t.TileMonitored, value: monitored.length, hint: formatString(t.TileMonitoredHint, rows.length) },
    { key: 'below', icon: 'Warning', color: PALETTE.orange, label: t.TileBelow, value: below.length, hint: below.length ? below.map(r => r.level.assetType).join(', ') : t.TileBelowNone, onClick: () => setFilter('attention') },
    { key: 'out', icon: 'Blocked2', color: PALETTE.red, label: t.TileOut, value: rows.filter(r => r.state === 'out').length, hint: t.TileOutHint, onClick: () => setFilter('attention') },
    { key: 'waiting', icon: 'Clock', color: PALETTE.purple, label: t.TileWaiting, value: rows.reduce((sum, r) => sum + r.awaitingAssignment, 0), hint: t.TileWaitingHint }
  ];

  const chips: IStatusChip[] = [
    { key: 'all', label: strings.RecordLists.TileAll, count: rows.length },
    { key: 'attention', label: t.ChipAttention, count: rows.filter(needsAttention).length, color: PALETTE.orange },
    { key: 'ok', label: f.StockOk, count: rows.filter(r => r.state === 'ok').length, color: PALETTE.green },
    { key: 'off', label: f.StockNotMonitored, count: rows.filter(r => r.state === 'off').length, color: PALETTE.grey }
  ];

  const pillFor = (state: RowState): JSX.Element => {
    const cls = state === 'out' || state === 'low' ? css.pillBad : state === 'risk' ? css.pillWarn : state === 'ok' ? css.pillGood : css.pillNeutral;
    const icon = state === 'out' ? 'Blocked2' : state === 'low' || state === 'risk' ? 'Warning' : state === 'ok' ? 'Completed' : undefined;
    return <span className={`${css.pill} ${cls}`}>{icon && <Icon iconName={icon} />} {stateText(state)}</span>;
  };

  return (
    <div className={css.panel}>
      <div className={css.panelHeader}>
        <div>
          <h4>{f.StockTabTitle}</h4>
          <p>{formatString(f.StockTabDesc, defaultMinimum)}</p>
        </div>
        <div className={css.actions}>
          <PrimaryButton text={f.StockSave} iconProps={{ iconName: 'Save' }} onClick={() => { save().catch(() => undefined); }} disabled={!dirty || invalid || busy} />
          <DefaultButton text={f.StockCheckNow} iconProps={{ iconName: 'Mail' }} onClick={() => { checkNow().catch(() => undefined); }} disabled={busy || loading} />
          <DefaultButton text={strings.ReportsPage.ExportExcel} iconProps={{ iconName: 'ExcelDocument' }} onClick={exportCsv} disabled={loading || rows.length === 0} />
        </div>
      </div>

      {message && (
        <MessageBar messageBarType={message.type} isMultiline onDismiss={() => setMessage(undefined)} styles={{ root: { marginBottom: 12 } }}>
          {message.text}
        </MessageBar>
      )}

      {/* Where alerts go, and whether they can go at all. */}
      {emailOn === false ? (
        <MessageBar messageBarType={MessageBarType.warning} isMultiline styles={{ root: { marginBottom: 12 } }}>{t.EmailOff}</MessageBar>
      ) : recipients && recipients.length === 0 ? (
        <MessageBar messageBarType={MessageBarType.warning} isMultiline styles={{ root: { marginBottom: 12 } }}>{formatString(t.NoRecipients, config.roleGroups.admin)}</MessageBar>
      ) : recipients ? (
        <MessageBar messageBarType={MessageBarType.info} isMultiline styles={{ root: { marginBottom: 12 } }}>{formatString(t.Recipients, config.roleGroups.admin, recipients.join(', '))}</MessageBar>
      ) : null}

      {loading ? (
        <span className={css.muted}>{strings.ConfigPage.LoadingButton}</span>
      ) : (
        <>
          <KpiRow kpis={kpis} />
          <StatusChips chips={chips} selected={filter} ariaLabel={f.StockColStatus} onSelect={(key) => setFilter(key as Filter)} />

          <div className={local.toolbar}>
            <SearchBox className={local.search} placeholder={t.SearchPlaceholder} value={search} onChange={(_, v) => setSearch(v || '')} onClear={() => setSearch('')} />
            <div className={local.bulk}>
              <TextField label={t.BulkLabel} type="number" min={0} value={bulk} onChange={(_, v) => setBulk(v || '')} styles={{ root: { width: 190 } }} />
              <DefaultButton text={t.BulkApply} onClick={applyBulk} disabled={!bulkValid || visible.length === 0} />
            </div>
          </div>

          {visible.length === 0 ? (
            <span className={css.muted}>{strings.RecordLists.EmptyFiltered}</span>
          ) : (
            <div className={local.tableWrap}>
              <table className={css.dataTable}>
                <thead>
                  <tr>
                    <th>{f.StockColType}</th>
                    <th>{f.StockColAvailable}</th>
                    <th>{t.ColAssigned}</th>
                    <th>{t.ColWaiting}</th>
                    <th>{t.ColAfter}</th>
                    <th>{f.StockColMinimum}</th>
                    <th>{f.StockColStatus}</th>
                    <th aria-label={strings.Common.Actions} />
                  </tr>
                </thead>
                <tbody>
                  {visible.map(r => {
                    const level = r.level;
                    const share = level.total > 0 ? Math.round((level.available / level.total) * 100) : 0;
                    const shortfall = level.minimum - level.available;
                    return (
                      <tr key={level.assetType}>
                        <td><strong>{level.assetType}</strong></td>
                        <td>
                          {formatString(t.AvailableOfTotal, level.available, level.total)}
                          <span className={local.meter} aria-hidden="true">
                            <span className={local.meterFill} style={{ width: `${share}%`, background: r.state === 'out' || r.state === 'low' ? PALETTE.red : r.state === 'risk' ? PALETTE.amber : PALETTE.green }} />
                          </span>
                        </td>
                        <td>{r.assigned}</td>
                        <td>
                          {r.awaitingApproval === 0 && r.awaitingAssignment === 0 ? <span className={css.muted}>—</span> : (
                            <>
                              {r.awaitingAssignment > 0 && <span style={{ display: 'block' }}>{formatString(t.WaitingAssignment, r.awaitingAssignment)}</span>}
                              {r.awaitingApproval > 0 && <span className={local.note}>{formatString(t.WaitingApproval, r.awaitingApproval)}</span>}
                            </>
                          )}
                        </td>
                        <td style={{ color: r.afterPending < 0 ? PALETTE.red : undefined, fontWeight: r.afterPending < level.minimum && level.minimum > 0 ? 600 : undefined }}>{r.afterPending}</td>
                        <td style={{ width: 150 }}>
                          <TextField
                            value={valueFor(level)}
                            placeholder={formatString(f.StockDefaultPlaceholder, defaultMinimum)}
                            onChange={(_, v) => setEdits(prev => ({ ...prev, [level.assetType]: v || '' }))}
                            errorMessage={valueFor(level).trim() !== '' && !(Number(valueFor(level)) >= 0) ? f.StockInvalid : undefined}
                            ariaLabel={formatString(f.StockMinimumAria, level.assetType)}
                            type="number"
                            min={0}
                          />
                        </td>
                        <td>
                          {pillFor(r.state)}
                          {(r.state === 'out' || r.state === 'low') && shortfall > 0 && <span className={local.note}>{formatString(t.Shortfall, shortfall)}</span>}
                          {r.state === 'risk' && <span className={local.note}>{t.RiskNote}</span>}
                          {level.threshold && level.threshold.lastAlertSent && (
                            <span className={local.note}>{formatString(f.StockAlertedAt, new Date(level.threshold.lastAlertSent).toLocaleString())}</span>
                          )}
                        </td>
                        <td>
                          {level.threshold && level.threshold.id && level.threshold.lastAlertSent && (
                            <ActionButton iconProps={{ iconName: 'Undo' }} text={t.ResetAlert} title={t.ResetAlertHint} onClick={() => { resetAlert(level).catch(() => undefined); }} disabled={busy} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};
