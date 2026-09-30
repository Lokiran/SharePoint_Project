import * as React from 'react';
import { Icon } from '@fluentui/react/lib/Icon';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../utils/LocalizationUtils';

export interface IRejectionReasonCardProps {
  /** The stored reason ("Category: message" from the reject form, or older free text). */
  reason: string;
  managerName?: string;
  /** ISO timestamp of the manager's decision, when known. */
  decidedAt?: string;
  /** Compact version for request cards. */
  compact?: boolean;
}

const css = mergeStyleSets({
  card: {
    border: '1px solid #f1bbbc',
    borderLeft: '4px solid #c50f1f',
    borderRadius: 8,
    background: '#fdf3f4',
    padding: '12px 14px',
    color: '#242424'
  },
  compact: { padding: '6px 10px', borderRadius: 6 },
  head: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#a4262c' },
  meta: { margin: '2px 0 0 22px', fontSize: 12, color: '#616161' },
  tag: {
    display: 'inline-block',
    margin: '8px 0 0',
    padding: '1px 8px',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    color: '#a4262c',
    background: '#fde7e9'
  },
  text: { margin: '6px 0 0', fontSize: 13, lineHeight: '20px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
  compactText: { margin: '2px 0 0', fontSize: 12, lineHeight: '18px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }
});

const categoryLabels = (): string[] => {
  const d = strings.RejectDialog;
  return [d.CategoryNotJustified, d.CategoryBudget, d.CategoryDuplicate, d.CategoryAlreadyHas, d.CategoryUnavailable, d.CategoryOther];
};

/** Splits "Budget not approved: message" into its category and message when the prefix is a known category. */
const splitReason = (reason: string): { category?: string; message: string } => {
  const at = reason.indexOf(': ');
  if (at > 0) {
    const prefix = reason.substring(0, at).trim();
    if (categoryLabels().some(label => label.toLowerCase() === prefix.toLowerCase())) {
      return { category: prefix, message: reason.substring(at + 2).trim() };
    }
  }
  return { message: reason.trim() };
};

const formatDecisionDate = (iso?: string): string | undefined => {
  if (!iso) return undefined;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? undefined : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

export const RejectionReasonCard: React.FC<IRejectionReasonCardProps> = ({ reason, managerName, decidedAt, compact }) => {
  const r = strings.RejectDialog;
  const { category, message } = splitReason(reason || '');
  const date = formatDecisionDate(decidedAt);
  const meta = managerName && date ? formatString(r.RejectedByOn, managerName, date)
    : managerName ? formatString(r.RejectedBy, managerName)
      : undefined;

  if (compact) {
    return (
      <div className={`${css.card} ${css.compact}`}>
        <div className={css.head} style={{ fontSize: 12 }}>
          <Icon iconName="Blocked2" /> {category ? `${r.ReasonTitle} · ${category}` : r.ReasonTitle}
        </div>
        <p className={css.compactText}>{message}</p>
      </div>
    );
  }

  return (
    <div className={css.card} role="note" aria-label={r.ReasonTitle}>
      <div className={css.head}><Icon iconName="Blocked2" /> {r.ReasonTitle}</div>
      {meta && <p className={css.meta}>{meta}</p>}
      {category && <span className={css.tag}>{category}</span>}
      <p className={css.text}>{message}</p>
    </div>
  );
};
