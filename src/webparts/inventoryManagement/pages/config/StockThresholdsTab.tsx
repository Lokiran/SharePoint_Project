import * as React from 'react';
import { PrimaryButton, DefaultButton, MessageBar, MessageBarType, TextField, Icon } from '@fluentui/react';
import css from '../ConfigPage.module.scss';
import { InventoryItemService } from '../../services/InventoryItemService';
import { StockThresholdService } from '../../services/StockThresholdService';
import { getAppConfig } from '../../config/AppConfig';
import { evaluateStockLevels, IStockLevel, IStockThreshold } from '../../utils/StockUtils';
import { IInventoryItem } from '../../models/IInventoryItem';
import { DEFAULT_ASSET_TYPE_OPTIONS } from '../../constants/DropdownConstants';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';

/** Config → Stock Alerts: per-asset-type minimum stock, saved to the Stock Thresholds list. */
export const StockThresholdsTab: React.FC = () => {
  const f = strings.Features;
  const defaultMinimum = getAppConfig().stock.defaultMinimum;

  const [items, setItems] = React.useState<IInventoryItem[]>([]);
  const [thresholds, setThresholds] = React.useState<IStockThreshold[]>([]);
  const [edits, setEdits] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: MessageBarType; text: string } | undefined>();

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
  }, []);

  React.useEffect(() => { load().catch(() => undefined); }, [load]);

  // Standard types are listed even when there are no items of that type yet.
  const levels: IStockLevel[] = React.useMemo(() => {
    const placeholderRows: IStockThreshold[] = DEFAULT_ASSET_TYPE_OPTIONS
      .map(o => String(o.key))
      .filter(type => type !== 'Other' && !thresholds.some(t => t.assetType.toLowerCase() === type.toLowerCase()))
      .map(type => ({ assetType: type }));
    return evaluateStockLevels(items, thresholds.concat(placeholderRows), defaultMinimum);
  }, [items, thresholds, defaultMinimum]);

  const valueFor = (level: IStockLevel): string =>
    edits[level.assetType] !== undefined ? edits[level.assetType] : level.hasCustomMinimum ? String(level.minimum) : '';

  const invalid = Object.keys(edits).some(k => edits[k].trim() !== '' && !(Number(edits[k]) >= 0));
  const dirty = Object.keys(edits).length > 0;

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

  const checkNow = async (): Promise<void> => {
    setBusy(true);
    setMessage(undefined);
    const result = await StockThresholdService.checkAndNotify(items);
    setBusy(false);
    if (!result) {
      setMessage({ type: MessageBarType.error, text: f.StockCheckFailed });
    } else if (result.alerted.length > 0) {
      setMessage({ type: MessageBarType.warning, text: formatString(f.StockAlertSent, result.alerted.join(', ')) });
    } else {
      setMessage({ type: MessageBarType.info, text: f.StockNoNewAlerts });
    }
    await load();
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
        </div>
      </div>

      {message && (
        <MessageBar messageBarType={message.type} onDismiss={() => setMessage(undefined)} styles={{ root: { marginBottom: 12 } }}>
          {message.text}
        </MessageBar>
      )}

      {loading ? (
        <span className={css.muted}>{strings.ConfigPage.LoadingButton}</span>
      ) : (
        <table className={css.dataTable}>
          <thead>
            <tr>
              <th>{f.StockColType}</th>
              <th>{f.StockColAvailable}</th>
              <th>{f.StockColTotal}</th>
              <th>{f.StockColMinimum}</th>
              <th>{f.StockColStatus}</th>
            </tr>
          </thead>
          <tbody>
            {levels.map(level => (
              <tr key={level.assetType}>
                <td><strong>{level.assetType}</strong></td>
                <td>{level.available}</td>
                <td>{level.total}</td>
                <td style={{ width: 170 }}>
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
                  {level.minimum === 0 ? (
                    <span className={`${css.pill} ${css.pillNeutral}`}>{f.StockNotMonitored}</span>
                  ) : level.isLow ? (
                    <span className={`${css.pill} ${css.pillBad}`}><Icon iconName="Warning" /> {f.StockLow}</span>
                  ) : (
                    <span className={`${css.pill} ${css.pillGood}`}><Icon iconName="Completed" /> {f.StockOk}</span>
                  )}
                  {level.threshold && level.threshold.lastAlertSent && (
                    <div className={css.muted} style={{ marginTop: 4 }}>
                      {formatString(f.StockAlertedAt, new Date(level.threshold.lastAlertSent).toLocaleString())}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
