import * as React from 'react';
import { IGroup } from '@fluentui/react/lib/DetailsList';
import * as strings from 'InventoryManagementWebPartStrings';
import styles from '../InventoryManagement.module.scss';
import { formatString } from '../../utils/LocalizationUtils';

export interface IPagerProps {
  /** 1-based. */
  page: number;
  pageSize: number;
  totalItems: number;
  onChange: (page: number) => void;
}

/** Page numbers with gaps: 1 … 4 5 6 … 12. */
const pageNumbers = (active: number, total: number): Array<number | '…'> => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: Array<number | '…'> = [1];
  const start = Math.max(2, active - 1);
  const end = Math.min(total - 1, active + 1);
  if (start > 2) pages.push('…');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('…');
  pages.push(total);
  return pages;
};

/** The app's standard pager (same look as the original inventory list). Hidden when everything fits on one page. */
export const Pager: React.FC<IPagerProps> = ({ page, pageSize, totalItems, onChange }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalPages <= 1) return null;
  const active = Math.min(Math.max(1, page), totalPages);
  const first = (active - 1) * pageSize + 1;
  const last = Math.min(active * pageSize, totalItems);
  const p = strings.Pagination;

  return (
    <div className={styles.paginationContainer} style={{ padding: '10px 16px', margin: 0, borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
      <div className={styles.paginationInfo}>{formatString(p.ShowingEntries, first, last, totalItems)}</div>
      <nav className={styles.paginationControls} aria-label={formatString(strings.InventoryExplorer.PageOf, active, totalPages)}>
        <button type="button" className={styles.paginationButton} disabled={active === 1} onClick={() => onChange(1)} title={p.FirstPage} aria-label={p.FirstPage}>&laquo;</button>
        <button type="button" className={styles.paginationButton} disabled={active === 1} onClick={() => onChange(active - 1)} title={p.PreviousPage} aria-label={p.PreviousPage}>&lsaquo;</button>
        {pageNumbers(active, totalPages).map((n, i) => n === '…' ? (
          <span key={`gap-${i}`} style={{ padding: '0 6px', color: 'var(--text-muted)' }} aria-hidden="true">…</span>
        ) : (
          <button
            key={n}
            type="button"
            className={`${styles.paginationButton} ${n === active ? styles.active : ''}`}
            aria-current={n === active ? 'page' : undefined}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
        <button type="button" className={styles.paginationButton} disabled={active === totalPages} onClick={() => onChange(active + 1)} title={p.NextPage} aria-label={p.NextPage}>&rsaquo;</button>
        <button type="button" className={styles.paginationButton} disabled={active === totalPages} onClick={() => onChange(totalPages)} title={p.LastPage} aria-label={p.LastPage}>&raquo;</button>
      </nav>
    </div>
  );
};

/** Carried on each IGroup.data so a header can show the whole group, not just this page's slice. */
export interface IPagedGroupData<T> {
  /** Every row of the group across all pages (for counts and breakdowns). */
  members: T[];
  /** 1-based positions, within the group, of the first and last rows on this page. */
  first: number;
  last: number;
}

/**
 * Groups for one page of an already group-ordered list. A group that runs across a page
 * boundary appears on both pages; its header keeps the full count and knows which part is shown.
 */
export const buildPageGroups = <T,>(
  pageRows: T[],
  keyOf: (row: T) => string,
  membersByKey: { [key: string]: T[] },
  collapsed: { [key: string]: boolean }
): IGroup[] => {
  const groups: IGroup[] = [];
  pageRows.forEach((row, index) => {
    const key = keyOf(row);
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.count++;
      (last.data as IPagedGroupData<T>).last++;
    } else {
      const members = membersByKey[key] || [row];
      const position = members.indexOf(row) + 1;
      groups.push({
        key,
        name: key,
        startIndex: index,
        count: 1,
        isCollapsed: !!collapsed[key],
        data: { members, first: position, last: position } as IPagedGroupData<T>
      });
    }
  });
  return groups;
};
