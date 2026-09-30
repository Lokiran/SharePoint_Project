import * as React from 'react';
import { Modal } from '@fluentui/react/lib/Modal';
import { PrimaryButton, IconButton } from '@fluentui/react/lib/Button';
import { Icon } from '@fluentui/react/lib/Icon';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { getId } from '@fluentui/react/lib/Utilities';
import * as strings from 'InventoryManagementWebPartStrings';

export interface IWorkflowPopupDetails {
  requestId?: string;
  incidentId?: string;
  assetTitle?: string;
  requesterName?: string;
  managerName?: string;
  status?: string;
  date?: string;
  comment?: string;
  quantity?: number;
  condition?: string;
}

export interface IWorkflowPopupProps {
  isOpen: boolean;
  title: string;
  stage: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  details?: IWorkflowPopupDetails;
  onDismiss: () => void;
}

interface ITone {
  icon: string;
  accent: string;
  soft: string;
  text: string;
}

const TONES: { [key: string]: ITone } = {
  success: { icon: 'CheckMark', accent: '#107c10', soft: '#dff6dd', text: '#0e5c0e' },
  error: { icon: 'ErrorBadge', accent: '#c50f1f', soft: '#fde7e9', text: '#a4262c' },
  warning: { icon: 'Clock', accent: '#bc4b09', soft: '#fff4ce', text: '#8a3707' },
  info: { icon: 'Info', accent: '#0f6cbd', soft: '#ebf3fc', text: '#0c3b5e' }
};

// Same precedence as before: a rejected/declined or pending status overrides the popup type.
const getTone = (type: IWorkflowPopupProps['type'], status?: string): ITone => {
  const s = (status || '').toLowerCase();
  if (type === 'error' || s.includes('reject') || s.includes('declin')) return TONES.error;
  if (type === 'warning' || s.includes('pending')) return TONES.warning;
  if (type === 'info') return TONES.info;
  return TONES.success;
};

// "2026-09-28" or an ISO timestamp -> "28 Sept 2026". Anything else is shown as given.
const formatDate = (value: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})(T.*)?$/.exec(value.trim());
  if (!match) return value;
  const date = match[4] ? new Date(value) : new Date(Date.UTC(+match[1], +match[2] - 1, +match[3]));
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: match[4] ? undefined : 'UTC'
  });
};

const classes = mergeStyleSets({
  main: {
    width: 'min(480px, calc(100vw - 32px))',
    maxWidth: 'none',
    minHeight: 0,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04)',
    fontFamily: '"Segoe UI", "Segoe UI Web (West European)", -apple-system, BlinkMacSystemFont, Roboto, sans-serif'
  },
  scrollable: { overflowY: 'auto', maxHeight: 'calc(100vh - 48px)' },
  accent: { height: 4 },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    padding: '20px 16px 0 24px'
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  icon: { fontSize: 20, fontWeight: 600 },
  heading: { flex: 1, minWidth: 0, paddingTop: 2 },
  stage: {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 4
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 600,
    lineHeight: '28px',
    color: '#242424',
    wordBreak: 'break-word'
  },
  close: { marginTop: -4, color: '#616161' },
  body: { padding: '12px 24px 0' },
  message: { margin: 0, fontSize: 14, lineHeight: '22px', color: '#424242' },
  details: {
    margin: '20px 0 0',
    padding: '4px 16px',
    borderRadius: 8,
    border: '1px solid #e0e0e0',
    backgroundColor: '#fafafa'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'minmax(96px, 38%) 1fr',
    alignItems: 'center',
    gap: 16,
    padding: '10px 0',
    fontSize: 14,
    selectors: { ':not(:last-child)': { borderBottom: '1px solid #ebebeb' } }
  },
  label: { margin: 0, color: '#616161' },
  value: { margin: 0, color: '#242424', fontWeight: 600, textAlign: 'right', wordBreak: 'break-word' },
  pill: {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    lineHeight: '20px'
  },
  comment: { marginTop: 16 },
  commentLabel: { display: 'block', fontSize: 12, fontWeight: 600, color: '#616161', marginBottom: 6 },
  commentText: {
    margin: 0,
    padding: '10px 14px',
    borderLeft: '3px solid',
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
    color: '#424242',
    fontSize: 14,
    lineHeight: '20px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  footer: { display: 'flex', justifyContent: 'flex-end', padding: '24px' }
});

export const WorkflowPopup: React.FC<IWorkflowPopupProps> = (props) => {
  const { isOpen, title, stage, type, message, details, onDismiss } = props;
  const [titleId] = React.useState(() => getId('workflowPopupTitle'));
  const [messageId] = React.useState(() => getId('workflowPopupMessage'));

  if (!isOpen) return null;

  const tone = getTone(type, details?.status);

  const rows: { label: string; value: React.ReactNode }[] = [];
  if (details) {
    if (details.requestId) rows.push({ label: strings.WorkflowPopup.LabelRequestId, value: details.requestId });
    if (details.incidentId) {
      rows.push({
        label: details.incidentId.startsWith('REP-') ? strings.WorkflowPopup.LabelReplacementId : strings.WorkflowPopup.LabelIncidentId,
        value: details.incidentId
      });
    }
    if (details.assetTitle) {
      rows.push({
        label: strings.WorkflowPopup.LabelAsset,
        value: details.quantity ? `${details.assetTitle} (Qty: ${details.quantity})` : details.assetTitle
      });
    }
    if (details.requesterName) rows.push({ label: strings.WorkflowPopup.LabelRequester, value: details.requesterName });
    if (details.managerName) rows.push({ label: strings.WorkflowPopup.LabelManagerName, value: details.managerName });
    if (details.status) {
      rows.push({
        label: strings.WorkflowPopup.LabelWorkflowStatus,
        value: <span className={classes.pill} style={{ backgroundColor: tone.soft, color: tone.text }}>{details.status}</span>
      });
    }
    if (details.date) rows.push({ label: strings.WorkflowPopup.LabelDate, value: formatDate(details.date) });
    if (details.condition) rows.push({ label: strings.WorkflowPopup.LabelCondition, value: details.condition });
  }

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      isBlocking={true}
      titleAriaId={titleId}
      subtitleAriaId={messageId}
      containerClassName={classes.main}
      scrollableContentClassName={classes.scrollable}
    >
      <div className={classes.accent} style={{ backgroundColor: tone.accent }} />

      <div className={classes.header}>
        <div className={classes.iconWrap} style={{ backgroundColor: tone.soft }}>
          <Icon iconName={tone.icon} className={classes.icon} style={{ color: tone.accent }} />
        </div>
        <div className={classes.heading}>
          {stage && <span className={classes.stage} style={{ color: tone.accent }}>{stage}</span>}
          <h2 id={titleId} className={classes.title}>{title}</h2>
        </div>
        <IconButton
          className={classes.close}
          iconProps={{ iconName: 'Cancel' }}
          ariaLabel={strings.Common.Close}
          onClick={onDismiss}
        />
      </div>

      <div className={classes.body}>
        {message && <p id={messageId} className={classes.message}>{message}</p>}

        {rows.length > 0 && (
          <dl className={classes.details}>
            {rows.map(row => (
              <div key={row.label} className={classes.row}>
                <dt className={classes.label}>{row.label}</dt>
                <dd className={classes.value}>{row.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {details?.comment && (
          <div className={classes.comment}>
            <span className={classes.commentLabel}>{strings.WorkflowPopup.LabelManagerAdminNotes}</span>
            <p className={classes.commentText} style={{ borderLeftColor: tone.accent }}>{details.comment}</p>
          </div>
        )}
      </div>

      <div className={classes.footer}>
        <PrimaryButton
          text={strings.WorkflowPopup.GotIt}
          onClick={onDismiss}
          styles={{ root: { borderRadius: 6, minWidth: 96, height: 36 } }}
        />
      </div>
    </Modal>
  );
};
