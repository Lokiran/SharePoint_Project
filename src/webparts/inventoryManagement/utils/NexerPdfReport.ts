// Nexer-branded single-record PDF (incident and replacement reports).
// Pure layout: callers pass already-localised text. A4 portrait, millimetres.
import { jsPDF } from 'jspdf';
import { NEXER_LOGO_WHITE_PNG, NEXER_LOGO_BLACK_PNG, NEXER_LOGO_ASPECT } from '../assets/NexerLogo';

export interface INexerReportField {
  label: string;
  value: unknown;
}

export interface INexerReportSection {
  title: string;
  text: string;
  /** 'positive' draws a green edge (resolution); default is the black brand edge. */
  tone?: 'neutral' | 'positive';
}

export interface INexerReportOptions {
  /** Small caps label in the header, e.g. "Incident report". */
  documentType: string;
  /** Record reference shown large in the header, e.g. "INC-12". */
  reference: string;
  /** Main heading under the header, e.g. the asset name. */
  heading: string;
  subheading?: string;
  status?: string;
  /** Heading above the field grid. */
  fieldsTitle: string;
  fields: INexerReportField[];
  sections: INexerReportSection[];
  /** Product name in the header and footer. */
  productName: string;
  /** Already formatted, e.g. "Generated on: 29/9/2026, 12:10". */
  generatedText: string;
  fileName: string;
}

type RGB = [number, number, number];

const PAGE_W = 210;
const MARGIN = 16;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_TOP = 280;

const INK: RGB = [17, 17, 17];
const BODY: RGB = [38, 38, 38];
const MUTED: RGB = [107, 107, 107];
const RULE: RGB = [229, 229, 229];
const PANEL: RGB = [245, 245, 245];
const HEADER_MUTED: RGB = [179, 179, 179];

/** Status tag colours; the same meanings as the Incident History page. */
const statusColours = (status: string): { fill: RGB; text: RGB } => {
  const s = (status || '').toLowerCase();
  if (s.indexOf('resolv') >= 0 || s.indexOf('complet') >= 0 || s.indexOf('approv') >= 0) return { fill: [223, 246, 221], text: [14, 92, 14] };
  if (s.indexOf('progress') >= 0 || s.indexOf('pending') >= 0) return { fill: [255, 244, 206], text: [138, 55, 7] };
  if (s.indexOf('closed') >= 0) return { fill: [237, 237, 237], text: [66, 66, 66] };
  return { fill: [253, 231, 233], text: [164, 38, 44] }; // Open / Rejected / anything else
};

const asText = (raw: unknown): string =>
  raw === undefined || raw === null || String(raw).trim() === '' ? '—' : String(raw);

/** Field labels in the app end with a colon ("Incident ID:"); the grid prints them without. */
const cleanLabel = (label: string): string => (label || '').replace(/\s*:\s*$/, '');

export const saveNexerReport = (o: INexerReportOptions): void => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const color = (c: RGB, kind: 'text' | 'fill' | 'draw'): void => {
    if (kind === 'text') doc.setTextColor(c[0], c[1], c[2]);
    else if (kind === 'fill') doc.setFillColor(c[0], c[1], c[2]);
    else doc.setDrawColor(c[0], c[1], c[2]);
  };
  const font = (style: 'normal' | 'bold', size: number, c: RGB): void => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    color(c, 'text');
  };

  // ---------- Header: black band with the white wordmark ----------
  const drawHeader = (compact: boolean): number => {
    const bandH = compact ? 16 : 40;
    color([0, 0, 0], 'fill');
    doc.rect(0, 0, PAGE_W, bandH, 'F');
    const logoH = compact ? 5 : 8.5;
    // A fixed alias embeds each logo once per file; 'FAST' deflates it (uncompressed it adds about 1 MB).
    doc.addImage(NEXER_LOGO_WHITE_PNG, 'PNG', MARGIN, compact ? 5.5 : 12, logoH * NEXER_LOGO_ASPECT, logoH, 'nexer-logo-white', 'FAST');
    if (compact) {
      font('bold', 9, [255, 255, 255]);
      doc.text(o.reference, PAGE_W - MARGIN, 10, { align: 'right' });
      return bandH + 10;
    }
    font('normal', 8, HEADER_MUTED);
    doc.text(o.productName, MARGIN, 29);
    doc.setCharSpace(0.6);
    font('bold', 7.5, HEADER_MUTED);
    doc.text(o.documentType.toUpperCase(), PAGE_W - MARGIN, 15.5, { align: 'right' });
    doc.setCharSpace(0);
    font('bold', 20, [255, 255, 255]);
    doc.text(o.reference, PAGE_W - MARGIN, 27, { align: 'right' });
    return bandH + 14;
  };

  let y = drawHeader(false);

  const ensureSpace = (needed: number): void => {
    if (y + needed > FOOTER_TOP - 6) {
      doc.addPage();
      y = drawHeader(true);
    }
  };

  // ---------- Title block: heading, subheading, status tag ----------
  const tagW = o.status ? (() => { font('bold', 8, INK); return doc.getTextWidth(o.status.toUpperCase()) + 8 + 0.4 * o.status.length; })() : 0;
  font('bold', 17, INK);
  const headingLines: string[] = doc.splitTextToSize(asText(o.heading), CONTENT_W - (tagW ? tagW + 8 : 0)).slice(0, 2);
  headingLines.forEach((line, i) => doc.text(line, MARGIN, y + i * 7.5));
  if (o.status) {
    const c = statusColours(o.status);
    color(c.fill, 'fill');
    doc.roundedRect(PAGE_W - MARGIN - tagW, y - 5.2, tagW, 7.4, 3.7, 3.7, 'F');
    doc.setCharSpace(0.4);
    font('bold', 8, c.text);
    doc.text(o.status.toUpperCase(), PAGE_W - MARGIN - tagW / 2, y - 0.2, { align: 'center' });
    doc.setCharSpace(0);
  }
  y += (headingLines.length - 1) * 7.5;
  if (o.subheading) {
    font('normal', 9.5, MUTED);
    doc.text(o.subheading, MARGIN, y + 6.5);
    y += 6.5;
  }
  y += 8;
  color(RULE, 'draw');
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 10;

  // ---------- Section label: small caps with a short black underline ----------
  const sectionLabel = (title: string): void => {
    ensureSpace(20);
    doc.setCharSpace(0.6);
    font('bold', 8, MUTED);
    doc.text(title.toUpperCase(), MARGIN, y);
    doc.setCharSpace(0);
    color(INK, 'fill');
    doc.rect(MARGIN, y + 2, 10, 0.8, 'F');
    y += 8;
  };

  // ---------- Field grid: two columns ----------
  sectionLabel(o.fieldsTitle);
  const colW = (CONTENT_W - 10) / 2;
  for (let i = 0; i < o.fields.length; i += 2) {
    const pair = o.fields.slice(i, i + 2);
    font('normal', 10.5, INK);
    const wrapped = pair.map(f => (doc.splitTextToSize(asText(f.value), colW) as string[]).slice(0, 2));
    const rowH = 10 + (Math.max(...wrapped.map(w => w.length)) - 1) * 5;
    ensureSpace(rowH + 2);
    pair.forEach((f, j) => {
      const x = MARGIN + j * (colW + 10);
      font('normal', 8, MUTED);
      doc.text(cleanLabel(f.label), x, y);
      font('normal', 10.5, INK);
      wrapped[j].forEach((line, k) => doc.text(line, x, y + 5.5 + k * 5));
    });
    y += rowH + 3;
  }
  y += 4;

  // ---------- Text sections: panel with a coloured left edge, split across pages ----------
  o.sections.forEach(section => {
    sectionLabel(section.title);
    font('normal', 10, BODY);
    const lines: string[] = doc.splitTextToSize(asText(section.text), CONTENT_W - 14);
    const edge: RGB = section.tone === 'positive' ? [16, 124, 16] : INK;
    const lineH = 5.2;
    let index = 0;
    while (index < lines.length) {
      ensureSpace(lineH + 12);
      const room = Math.floor((FOOTER_TOP - 6 - y - 10) / lineH);
      const chunk = lines.slice(index, index + Math.max(1, room));
      const boxH = chunk.length * lineH + 9;
      color(PANEL, 'fill');
      doc.rect(MARGIN, y, CONTENT_W, boxH, 'F');
      color(edge, 'fill');
      doc.rect(MARGIN, y, 1.2, boxH, 'F');
      font('normal', 10, BODY);
      chunk.forEach((line, k) => doc.text(line, MARGIN + 7, y + 6.5 + k * lineH));
      y += boxH;
      index += chunk.length;
      if (index < lines.length) {
        doc.addPage();
        y = drawHeader(true);
      }
    }
    y += 10;
  });

  // ---------- Footer on every page ----------
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    color(RULE, 'draw');
    doc.setLineWidth(0.3);
    doc.line(MARGIN, FOOTER_TOP, PAGE_W - MARGIN, FOOTER_TOP);
    const logoH = 3.2;
    doc.addImage(NEXER_LOGO_BLACK_PNG, 'PNG', MARGIN, FOOTER_TOP + 5, logoH * NEXER_LOGO_ASPECT, logoH, 'nexer-logo-black', 'FAST');
    font('normal', 7.5, MUTED);
    doc.text(o.productName, MARGIN + logoH * NEXER_LOGO_ASPECT + 4, FOOTER_TOP + 7.7);
    doc.text(`${o.generatedText}   ·   ${p} / ${pages}`, PAGE_W - MARGIN, FOOTER_TOP + 7.7, { align: 'right' });
  }

  doc.save(o.fileName);
};

// =====================================================================================
// List report: the same Nexer header and footer around a summary row and a table.
// =====================================================================================

export type NexerTagTone = 'green' | 'blue' | 'amber' | 'red' | 'grey';

export interface INexerTableColumn {
  header: string;
  /** Relative width; the columns share the page width in these proportions. */
  width: number;
  /** Draws the cell as a coloured tag; returns the tone for the cell in the given row. */
  tag?: (value: string, rowIndex: number) => NexerTagTone;
}

export interface INexerTableReportOptions {
  /** Small caps label in the header, e.g. "Asset report". */
  documentType: string;
  /** Shown large in the header, e.g. the report date. */
  reference: string;
  heading: string;
  subheading?: string;
  summaryTitle: string;
  /** Headline numbers in a row of boxes (up to four per row). */
  summary: INexerReportField[];
  tableTitle: string;
  columns: INexerTableColumn[];
  /** One array of cell texts per row, in column order. */
  rows: string[][];
  /** Printed instead of the table when there are no rows. */
  emptyText: string;
  productName: string;
  generatedText: string;
  fileName: string;
}

const TAG_COLOURS: { [tone in NexerTagTone]: { fill: RGB; text: RGB } } = {
  green: { fill: [223, 246, 221], text: [14, 92, 14] },
  blue: { fill: [235, 243, 252], text: [15, 84, 140] },
  amber: { fill: [255, 244, 206], text: [138, 55, 7] },
  red: { fill: [253, 231, 233], text: [164, 38, 44] },
  grey: { fill: [237, 237, 237], text: [66, 66, 66] }
};

export const saveNexerTableReport = (o: INexerTableReportOptions): void => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const color = (c: RGB, kind: 'text' | 'fill' | 'draw'): void => {
    if (kind === 'text') doc.setTextColor(c[0], c[1], c[2]);
    else if (kind === 'fill') doc.setFillColor(c[0], c[1], c[2]);
    else doc.setDrawColor(c[0], c[1], c[2]);
  };
  const font = (style: 'normal' | 'bold', size: number, c: RGB): void => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    color(c, 'text');
  };
  /** Shortens text with an ellipsis until it fits the width (at the current font). */
  const fit = (raw: string, width: number): string => {
    let text = asText(raw);
    if (doc.getTextWidth(text) <= width) return text;
    while (text.length > 1 && doc.getTextWidth(text + '…') > width) text = text.slice(0, -1);
    return text.replace(/\s+$/, '') + '…';
  };

  // ---------- Header: black band with the white wordmark (same as the single-record report) ----------
  const drawHeader = (compact: boolean): number => {
    const bandH = compact ? 16 : 40;
    color([0, 0, 0], 'fill');
    doc.rect(0, 0, PAGE_W, bandH, 'F');
    const logoH = compact ? 5 : 8.5;
    doc.addImage(NEXER_LOGO_WHITE_PNG, 'PNG', MARGIN, compact ? 5.5 : 12, logoH * NEXER_LOGO_ASPECT, logoH, 'nexer-logo-white', 'FAST');
    if (compact) {
      font('bold', 9, [255, 255, 255]);
      doc.text(`${o.documentType}  ·  ${o.reference}`, PAGE_W - MARGIN, 10, { align: 'right' });
      return bandH + 10;
    }
    font('normal', 8, HEADER_MUTED);
    doc.text(o.productName, MARGIN, 29);
    doc.setCharSpace(0.6);
    font('bold', 7.5, HEADER_MUTED);
    doc.text(o.documentType.toUpperCase(), PAGE_W - MARGIN, 15.5, { align: 'right' });
    doc.setCharSpace(0);
    font('bold', 20, [255, 255, 255]);
    doc.text(o.reference, PAGE_W - MARGIN, 27, { align: 'right' });
    return bandH + 14;
  };

  let y = drawHeader(false);

  // ---------- Title block ----------
  font('bold', 17, INK);
  doc.text(fit(o.heading, CONTENT_W), MARGIN, y);
  if (o.subheading) {
    font('normal', 9.5, MUTED);
    doc.text(fit(o.subheading, CONTENT_W), MARGIN, y + 6.5);
    y += 6.5;
  }
  y += 8;
  color(RULE, 'draw');
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 10;

  const sectionLabel = (title: string): void => {
    doc.setCharSpace(0.6);
    font('bold', 8, MUTED);
    doc.text(title.toUpperCase(), MARGIN, y);
    doc.setCharSpace(0);
    color(INK, 'fill');
    doc.rect(MARGIN, y + 2, 10, 0.8, 'F');
    y += 8;
  };

  // ---------- Summary: a row of boxes, label over number ----------
  if (o.summary.length) {
    sectionLabel(o.summaryTitle);
    const perRow = Math.min(4, o.summary.length);
    const gap = 4;
    const boxW = (CONTENT_W - gap * (perRow - 1)) / perRow;
    const boxH = 18;
    o.summary.forEach((field, i) => {
      const col = i % perRow;
      if (i > 0 && col === 0) y += boxH + gap;
      const x = MARGIN + col * (boxW + gap);
      color(PANEL, 'fill');
      doc.rect(x, y, boxW, boxH, 'F');
      font('normal', 7.5, MUTED);
      doc.text(fit(cleanLabel(field.label), boxW - 8), x + 4, y + 6);
      font('bold', 14, INK);
      doc.text(fit(asText(field.value), boxW - 8), x + 4, y + 14);
    });
    y += boxH + 12;
  }

  // ---------- Table ----------
  sectionLabel(o.tableTitle);
  const totalWeight = o.columns.reduce((sum, c) => sum + c.width, 0) || 1;
  const widths = o.columns.map(c => (CONTENT_W * c.width) / totalWeight);
  const lefts = widths.map((_, i) => MARGIN + widths.slice(0, i).reduce((sum, w) => sum + w, 0));
  const PAD = 2.5;
  const HEAD_H = 8;
  const ROW_H = 8.5;

  const drawTableHead = (): void => {
    color(INK, 'fill');
    doc.rect(MARGIN, y, CONTENT_W, HEAD_H, 'F');
    doc.setCharSpace(0.3);
    font('bold', 7, [255, 255, 255]);
    o.columns.forEach((c, i) => doc.text(fit(c.header.toUpperCase(), widths[i] - PAD * 2), lefts[i] + PAD, y + 5.3));
    doc.setCharSpace(0);
    y += HEAD_H;
  };

  if (o.rows.length === 0) {
    font('normal', 10, MUTED);
    doc.text(o.emptyText, MARGIN, y + 4);
  } else {
    drawTableHead();
    o.rows.forEach((row, rowIndex) => {
      if (y + ROW_H > FOOTER_TOP - 6) {
        doc.addPage();
        y = drawHeader(true);
        drawTableHead();
      }
      o.columns.forEach((c, i) => {
        const value = asText(row[i]);
        if (c.tag && value !== '—') {
          const tone = TAG_COLOURS[c.tag(value, rowIndex)];
          font('bold', 7.5, tone.text);
          const text = fit(value, widths[i] - PAD * 2 - 5);
          const tagW = doc.getTextWidth(text) + 5;
          color(tone.fill, 'fill');
          doc.roundedRect(lefts[i] + PAD, y + 1.7, tagW, 5.2, 2.6, 2.6, 'F');
          doc.text(text, lefts[i] + PAD + 2.5, y + 5.4);
        } else {
          // The first column names the record, so it is set in bold.
          font(i === 0 ? 'bold' : 'normal', 8.5, i === 0 ? INK : BODY);
          doc.text(fit(value, widths[i] - PAD * 2), lefts[i] + PAD, y + 5.6);
        }
      });
      y += ROW_H;
      color(RULE, 'draw');
      doc.setLineWidth(0.2);
      doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    });
  }

  // ---------- Footer on every page ----------
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    color(RULE, 'draw');
    doc.setLineWidth(0.3);
    doc.line(MARGIN, FOOTER_TOP, PAGE_W - MARGIN, FOOTER_TOP);
    const logoH = 3.2;
    doc.addImage(NEXER_LOGO_BLACK_PNG, 'PNG', MARGIN, FOOTER_TOP + 5, logoH * NEXER_LOGO_ASPECT, logoH, 'nexer-logo-black', 'FAST');
    font('normal', 7.5, MUTED);
    doc.text(o.productName, MARGIN + logoH * NEXER_LOGO_ASPECT + 4, FOOTER_TOP + 7.7);
    doc.text(`${o.generatedText}   ·   ${p} / ${pages}`, PAGE_W - MARGIN, FOOTER_TOP + 7.7, { align: 'right' });
  }

  doc.save(o.fileName);
};

/** "6 Aug 2026, 16:13" for a stored date, or the raw value when it isn't a date. */
export const formatReportDate = (raw?: string, withTime: boolean = true): string | undefined => {
  if (!raw) return undefined;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return withTime
    ? d.toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};
