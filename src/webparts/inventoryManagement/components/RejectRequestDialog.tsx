import * as React from 'react';
import { Modal } from '@fluentui/react/lib/Modal';
import { PrimaryButton, DefaultButton, IconButton } from '@fluentui/react/lib/Button';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react/lib/TextField';
import { Icon } from '@fluentui/react/lib/Icon';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { getId } from '@fluentui/react/lib/Utilities';
import * as strings from 'InventoryManagementWebPartStrings';
import { IRequest } from '../models/IRequest';
import { formatString } from '../utils/LocalizationUtils';

export interface IRejectRequestDialogProps {
  /** The request being rejected; the dialog is open while this is set. */
  request: IRequest | undefined;
  /** Saves the rejection. Resolves when done (errors are reported by the caller). */
  onConfirm: (request: IRequest, reason: string) => Promise<void>;
  onDismiss: () => void;
}

const MAX_LENGTH = 500;
const RED = '#c50f1f';

const css = mergeStyleSets({
  main: {
    width: 'min(520px, calc(100vw - 32px))',
    maxWidth: 'none',
    minHeight: 0,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04)'
  },
  scrollable: { overflowY: 'auto', maxHeight: 'calc(100vh - 48px)' },
  accent: { height: 4, background: RED },
  header: { display: 'flex', alignItems: 'flex-start', gap: 16, padding: '20px 16px 0 24px' },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: 20,
    color: RED,
    background: '#fde7e9'
  },
  heading: { flex: 1, minWidth: 0, paddingTop: 2 },
  stage: { display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: RED, marginBottom: 4 },
  title: { margin: 0, fontSize: 20, fontWeight: 600, lineHeight: '28px', color: '#242424' },
  body: { padding: '16px 24px 0', display: 'flex', flexDirection: 'column', gap: 16 },
  summary: { margin: 0, padding: '4px 16px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fafafa' },
  row: {
    display: 'grid',
    gridTemplateColumns: 'minmax(96px, 34%) 1fr',
    gap: 16,
    padding: '8px 0',
    fontSize: 13,
    selectors: { ':not(:last-child)': { borderBottom: '1px solid #ebebeb' } }
  },
  label: { margin: 0, color: '#616161' },
  value: { margin: 0, color: '#242424', fontWeight: 600, wordBreak: 'break-word' },
  quote: { margin: 0, color: '#424242', fontWeight: 400, fontStyle: 'italic', wordBreak: 'break-word' },
  note: { display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: '#616161', lineHeight: '18px' },
  error: { fontSize: 13, color: RED },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 24 }
});

/** Structured replacement for the old browser prompt: a reason category plus a message to the employee. */
export const RejectRequestDialog: React.FC<IRejectRequestDialogProps> = (props) => {
  const { request, onConfirm, onDismiss } = props;
  const s = strings.RejectDialog;
  const [titleId] = React.useState(() => getId('rejectDialogTitle'));
  const [category, setCategory] = React.useState<string | undefined>(undefined);
  const [details, setDetails] = React.useState('');
  const [touched, setTouched] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // Fresh form for every request opened.
  const requestId = request ? request.id : undefined;
  React.useEffect(() => {
    setCategory(undefined);
    setDetails('');
    setTouched(false);
    setSubmitting(false);
  }, [requestId]);

  if (!request) return null;

  const categories: IDropdownOption[] = [
    { key: 'notJustified', text: s.CategoryNotJustified },
    { key: 'budget', text: s.CategoryBudget },
    { key: 'duplicate', text: s.CategoryDuplicate },
    { key: 'alreadyHas', text: s.CategoryAlreadyHas },
    { key: 'unavailable', text: s.CategoryUnavailable },
    { key: 'other', text: s.CategoryOther }
  ];
  const categoryText = category ? (categories.find(c => c.key === category) || { text: '' }).text : '';
  const message = details.trim();
  const valid = !!category && message.length > 0;

  const submit = async (): Promise<void> => {
    setTouched(true);
    if (!valid || submitting) return;
    setSubmitting(true);
    try {
      // Stored in the request's manager comment column, which the employee and managers already see.
      await onConfirm(request, `${categoryText}: ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const assetLine = request.quantity && request.quantity > 1 ? `${request.assetTitle} × ${request.quantity}` : request.assetTitle;

  return (
    <Modal
      isOpen={true}
      onDismiss={submitting ? undefined : onDismiss}
      isBlocking={true}
      titleAriaId={titleId}
      containerClassName={css.main}
      scrollableContentClassName={css.scrollable}
    >
      <div className={css.accent} />
      <div className={css.header}>
        <div className={css.iconWrap} aria-hidden="true"><Icon iconName="Blocked2" /></div>
        <div className={css.heading}>
          <span className={css.stage}>{s.Stage}</span>
          <h2 id={titleId} className={css.title}>{formatString(s.Title, request.requestKey || `#${request.id}`)}</h2>
        </div>
        <IconButton iconProps={{ iconName: 'Cancel' }} ariaLabel={strings.Common.Close} onClick={onDismiss} disabled={submitting} />
      </div>

      <div className={css.body}>
        <dl className={css.summary}>
          <div className={css.row}><dt className={css.label}>{strings.WorkflowPopup.LabelRequester}</dt><dd className={css.value}>{request.requesterName}</dd></div>
          <div className={css.row}><dt className={css.label}>{strings.WorkflowPopup.LabelAsset}</dt><dd className={css.value}>{assetLine}</dd></div>
          <div className={css.row}><dt className={css.label}>{strings.RequestList.LabelRequestDate}</dt><dd className={css.value}>{request.requestDate}</dd></div>
          {request.reason && (
            <div className={css.row}><dt className={css.label}>{s.LabelEmployeeReason}</dt><dd className={css.quote}>&ldquo;{request.reason}&rdquo;</dd></div>
          )}
        </dl>

        <Dropdown
          label={s.LabelCategory}
          placeholder={s.CategoryPlaceholder}
          options={categories}
          selectedKey={category}
          onChange={(_, option) => option && setCategory(option.key as string)}
          errorMessage={touched && !category ? s.CategoryRequired : undefined}
          disabled={submitting}
          required
        />

        <TextField
          label={s.LabelMessage}
          placeholder={s.MessagePlaceholder}
          multiline
          rows={4}
          maxLength={MAX_LENGTH}
          value={details}
          onChange={(_, v) => setDetails(v || '')}
          onBlur={() => setTouched(true)}
          description={formatString(s.CharacterCount, details.length, MAX_LENGTH)}
          errorMessage={touched && !message ? s.MessageRequired : undefined}
          disabled={submitting}
          required
        />

        <div className={css.note}>
          <Icon iconName="Info" style={{ marginTop: 2 }} />
          <span>{s.VisibilityNote}</span>
        </div>
      </div>

      <div className={css.footer}>
        <DefaultButton text={strings.Common.Cancel} onClick={onDismiss} disabled={submitting} />
        <PrimaryButton
          text={submitting ? s.Rejecting : s.ConfirmButton}
          iconProps={{ iconName: 'Blocked2' }}
          onClick={() => { submit().catch(() => undefined); }}
          disabled={submitting || (touched && !valid)}
          styles={{
            root: { background: RED, borderColor: RED, borderRadius: 6 },
            rootHovered: { background: '#a4262c', borderColor: '#a4262c' },
            rootPressed: { background: '#8e1b22', borderColor: '#8e1b22' }
          }}
        />
      </div>
    </Modal>
  );
};
