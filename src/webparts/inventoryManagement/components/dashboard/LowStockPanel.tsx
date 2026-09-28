import * as React from 'react';
import { Icon } from '@fluentui/react/lib/Icon';
import styles from '../Dashboard.module.scss';
import { IInventoryItem } from '../../models/IInventoryItem';
import { getAppConfig } from '../../config/AppConfig';
import { evaluateStockLevels, IStockThreshold } from '../../utils/StockUtils';
import { StockThresholdService } from '../../services/StockThresholdService';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';

export interface ILowStockPanelProps {
  items: IInventoryItem[];
  /** When set, shows a "Manage thresholds" button (admins). */
  onManageThresholds?: () => void;
}

/** Warning listing asset types below their minimum stock. Renders nothing when stock is healthy. */
export const LowStockPanel: React.FC<ILowStockPanelProps> = ({ items, onManageThresholds }) => {
  const f = strings.Features;
  const [thresholds, setThresholds] = React.useState<IStockThreshold[]>([]);

  React.useEffect(() => {
    let active = true;
    StockThresholdService.getThresholds()
      .then(t => { if (active) setThresholds(t); })
      .catch(err => console.warn('[LowStockPanel] Could not load stock thresholds:', err));
    return () => { active = false; };
  }, [items]);

  const lowLevels = React.useMemo(
    () => evaluateStockLevels(items, thresholds, getAppConfig().stock.defaultMinimum).filter(l => l.isLow),
    [items, thresholds]
  );

  if (lowLevels.length === 0) return null;

  return (
    <div className={styles.actionCenter} role="alert">
      <div className={styles.sectionHeader}>
        <div>
          <h3><Icon iconName="Warning" style={{ color: '#d83b01' }} />{formatString(f.LowStockTitle, lowLevels.length)}</h3>
          <span className={styles.sectionSubtitle}>{f.LowStockSubtitle}</span>
        </div>
        {onManageThresholds && (
          <button type="button" className={styles.headerAction} onClick={onManageThresholds}>
            <Icon iconName="Settings" /> {f.LowStockManage}
          </button>
        )}
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.actionTable}>
          <thead>
            <tr>
              <th>{f.StockColType}</th>
              <th>{f.StockColAvailable}</th>
              <th>{f.StockColMinimum}</th>
              <th>{f.StockColTotal}</th>
            </tr>
          </thead>
          <tbody>
            {lowLevels.map(level => (
              <tr key={level.assetType}>
                <td><strong>{level.assetType}</strong></td>
                <td>
                  <span className={`${styles.statusBadge} ${level.available === 0 ? styles.badgeDeclined : styles.badgePending}`}>
                    {level.available}
                  </span>
                </td>
                <td>{level.minimum}{level.hasCustomMinimum ? '' : ` (${f.StockDefaultTag})`}</td>
                <td>{level.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
