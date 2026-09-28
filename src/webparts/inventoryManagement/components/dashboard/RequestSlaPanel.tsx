import * as React from 'react';
import { Icon } from '@fluentui/react/lib/Icon';
import styles from '../Dashboard.module.scss';
import { IRequest } from '../../models/IRequest';
import { getAppConfig } from '../../config/AppConfig';
import { summarizeSla, splitDuration, IRequestSla } from '../../utils/RequestSlaUtils';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';

export interface IRequestSlaPanelProps {
  requests: IRequest[];
  /** Queue page to open from the header button ('Approvals' or 'AssetAssignmentQueue'). */
  queueKey?: string;
  onNavigate?: (key: string) => void;
}

const MAX_ROWS = 8;

export const formatHours = (hours?: number): string => {
  if (hours === undefined) return '—';
  const d = splitDuration(hours);
  return formatString(d.unit === 'h' ? strings.Features.DurationHours : strings.Features.DurationDays, d.value);
};

/** Time-to-approve / time-to-assign against the SLA targets set in the property pane, with overdue requests. */
export const RequestSlaPanel: React.FC<IRequestSlaPanelProps> = ({ requests, queueKey, onNavigate }) => {
  const f = strings.Features;
  const targets = getAppConfig().sla;
  const summary = React.useMemo(() => summarizeSla(requests, targets), [requests, targets.approvalHours, targets.assignmentHours]);
  const overdueTotal = summary.overdueApprovals + summary.overdueAssignments;

  const stageLabel = (item: IRequestSla): string =>
    item.stage === 'awaitingApproval' ? f.SlaStageAwaitingApproval : f.SlaStageAwaitingAssignment;

  return (
    <div className={styles.actionCenter}>
      <div className={styles.sectionHeader}>
        <div>
          <h3><Icon iconName="Timer" />{f.SlaTitle}</h3>
          <span className={styles.sectionSubtitle}>
            {formatString(f.SlaSubtitle, targets.approvalHours, targets.assignmentHours)}
          </span>
        </div>
        {onNavigate && queueKey && overdueTotal > 0 && (
          <button type="button" className={styles.headerAction} onClick={() => onNavigate(queueKey)}>
            <Icon iconName="OpenInNewWindow" /> {f.SlaOpenQueue}
          </button>
        )}
      </div>

      <div className={styles.slaStats}>
        <div className={styles.slaStat}>
          <span className={styles.slaStatValue}>{formatHours(summary.averageApprovalHours)}</span>
          <span className={styles.slaStatLabel}>{f.SlaAvgApprove}</span>
        </div>
        <div className={styles.slaStat}>
          <span className={styles.slaStatValue}>{formatHours(summary.averageAssignmentHours)}</span>
          <span className={styles.slaStatLabel}>{f.SlaAvgAssign}</span>
        </div>
        <div className={`${styles.slaStat} ${summary.approvalOnTimePercent !== undefined && summary.approvalOnTimePercent >= 80 ? styles.slaStatGood : ''}`}>
          <span className={styles.slaStatValue}>
            {summary.approvalOnTimePercent === undefined ? '—' : `${summary.approvalOnTimePercent}%`}
          </span>
          <span className={styles.slaStatLabel}>{f.SlaApprovedOnTime}</span>
        </div>
        <div className={`${styles.slaStat} ${overdueTotal > 0 ? styles.slaStatWarn : styles.slaStatGood}`}>
          <span className={styles.slaStatValue}>{overdueTotal}</span>
          <span className={styles.slaStatLabel}>
            {formatString(f.SlaOverdueBreakdown, summary.overdueApprovals, summary.overdueAssignments)}
          </span>
        </div>
      </div>

      {summary.overdueItems.length === 0 ? (
        <div className={styles.noDataMessage}>
          <Icon iconName="CompletedSolid" />
          <span>{f.SlaNoOverdue}</span>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.actionTable}>
            <thead>
              <tr>
                <th>{f.SlaColRequest}</th>
                <th>{strings.Dashboard.ColRequester}</th>
                <th>{f.SlaColAsset}</th>
                <th>{f.SlaColStage}</th>
                <th>{f.SlaColWaiting}</th>
                <th>{f.SlaColOverBy}</th>
              </tr>
            </thead>
            <tbody>
              {summary.overdueItems.slice(0, MAX_ROWS).map(item => (
                <tr key={item.request.id}>
                  <td><code>{item.request.requestKey || item.request.id}</code></td>
                  <td><strong>{item.request.requesterName}</strong></td>
                  <td>{item.request.assetTitle}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${item.stage === 'awaitingApproval' ? styles.badgePending : styles.badgeAssigned}`}>
                      {stageLabel(item)}
                    </span>
                  </td>
                  <td title={item.estimated ? f.SlaEstimatedHint : undefined}>
                    {item.estimated ? '~' : ''}{formatHours(item.openHours)}
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles.badgeDeclined}`}>
                      <Icon iconName="Warning" /> {formatHours(item.overdueByHours)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {summary.overdueItems.length > MAX_ROWS && (
            <span className={styles.sectionSubtitle}>
              {formatString(f.SlaMoreOverdue, summary.overdueItems.length - MAX_ROWS)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
