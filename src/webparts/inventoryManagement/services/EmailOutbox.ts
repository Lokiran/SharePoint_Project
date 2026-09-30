export type EmailOutboxStatus = 'sent' | 'failed' | 'skipped';

export interface IEmailOutboxEntry {
  id: string;
  to: string[];
  subject: string;
  body: string;
  status: EmailOutboxStatus;
  /** Failure reason, or a delivery caveat for a message sent through the fallback channel. */
  error?: string;
  method?: 'graph' | 'spUtility';
  /** ISO timestamp. */
  timestamp: string;
}

const MAX_ENTRIES = 50;

/**
 * In-memory log of every email the app tried to send in this browser session
 * (newest first). Feeds the Email Center panel; nothing is persisted.
 */
export class EmailOutbox {
  private static _entries: IEmailOutboxEntry[] = [];
  private static _listeners: Array<() => void> = [];
  private static _counter = 0;

  public static add(entry: Omit<IEmailOutboxEntry, 'id' | 'timestamp'>): IEmailOutboxEntry {
    const full: IEmailOutboxEntry = {
      ...entry,
      id: `mail-${Date.now()}-${++EmailOutbox._counter}`,
      timestamp: new Date().toISOString()
    };
    EmailOutbox._entries = [full].concat(EmailOutbox._entries).slice(0, MAX_ENTRIES);
    EmailOutbox._notify();
    return full;
  }

  public static getAll(): IEmailOutboxEntry[] {
    return EmailOutbox._entries;
  }

  public static get(id: string): IEmailOutboxEntry | undefined {
    return EmailOutbox._entries.find(e => e.id === id);
  }

  public static getFailedCount(): number {
    return EmailOutbox._entries.filter(e => e.status === 'failed').length;
  }

  public static clear(): void {
    EmailOutbox._entries = [];
    EmailOutbox._notify();
  }

  /** Returns an unsubscribe function. */
  public static subscribe(listener: () => void): () => void {
    EmailOutbox._listeners.push(listener);
    return () => {
      EmailOutbox._listeners = EmailOutbox._listeners.filter(l => l !== listener);
    };
  }

  private static _notify(): void {
    EmailOutbox._listeners.forEach(listener => {
      try {
        listener();
      } catch (err) {
        console.warn('[EmailOutbox] Listener failed:', err);
      }
    });
  }
}
