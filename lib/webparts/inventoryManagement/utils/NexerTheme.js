import { jsPDF } from 'jspdf';
export const NEXER_COLORS = {
    darkHeader: '#111827',
    headerText: '#ffffff',
    subtitleText: '#94a3b8',
    accent: '#0284c7',
    border: '#e2e8f0',
    bgLight: '#f8fafc',
};
export const NEXER_LOGO_WHITE_SVG = `<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1457.17 322.98"><defs><style>.cls-1{fill:#fff;}</style></defs><polygon class="cls-1" points="210.07 311.18 95.12 0 0 0 0 322.98 48.17 322.98 48.17 11.9 163.08 322.98 258.24 322.98 258.24 0 210.07 0 210.07 311.18"/><polygon class="cls-1" points="877.18 0 792.31 119.05 707.43 0 646.86 0 762.02 161.53 646.92 322.98 707.5 322.98 792.31 204.01 877.12 322.98 937.69 322.98 822.6 161.53 937.76 0 877.18 0"/><polygon class="cls-1" points="595.91 0 535.34 0 650.5 161.53 535.4 322.98 595.97 322.98 711.07 161.53 595.91 0"/><polygon class="cls-1" points="306.14 322.98 518.47 322.98 518.47 276.92 354.56 276.92 354.56 184.52 509.2 184.52 509.2 138.46 354.56 138.46 354.56 46.2 518.47 46.2 518.47 0 306.14 0 306.14 322.98"/><polygon class="cls-1" points="954.66 322.98 1166.99 322.98 1166.99 276.92 1003.07 276.92 1003.07 184.52 1157.72 184.52 1157.72 138.46 1003.07 138.46 1003.07 46.2 1166.99 46.2 1166.99 0 954.66 0 954.66 322.98"/><path class="cls-1" d="M1358.55,184.39c53.48-2.66,94.95-36.41,94.95-92.1,0-58.5-45.06-92.29-101.82-92.29h-144.62v322.98h48.17v-138.4h42.87l98.49,138.4h60.59l-98.62-138.59ZM1255.22,138.46V46.2h94.1c31.8,0,55.55,16.88,55.55,46.33s-23.75,45.93-55.55,45.93h-94.1Z"/></svg>`;
export const NEXER_LOGO_BLACK_SVG = `<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1457.17 322.98"><polygon points="210.07 311.18 95.12 0 0 0 0 322.98 48.17 322.98 48.17 11.9 163.08 322.98 258.24 322.98 258.24 0 210.07 0 210.07 311.18"/><polygon points="877.18 0 792.31 119.05 707.43 0 646.86 0 762.02 161.53 646.92 322.98 707.5 322.98 792.31 204.01 877.12 322.98 937.69 322.98 822.6 161.53 937.76 0 877.18 0"/><polygon points="595.91 0 535.34 0 650.5 161.53 535.4 322.98 595.97 322.98 711.07 161.53 595.91 0"/><polygon points="306.14 322.98 518.47 322.98 518.47 276.92 354.56 276.92 354.56 184.52 509.2 184.52 509.2 138.46 354.56 138.46 354.56 46.2 518.47 46.2 518.47 0 306.14 0 306.14 322.98"/><polygon points="954.66 322.98 1166.99 322.98 1166.99 276.92 1003.07 276.92 1003.07 184.52 1157.72 184.52 1157.72 138.46 1003.07 138.46 1003.07 46.2 1166.99 46.2 1166.99 0 954.66 0 954.66 322.98"/><path d="M1358.55,184.39c53.48-2.66,94.95-36.41,94.95-92.1,0-58.5-45.06-92.29-101.82-92.29h-144.62v322.98h48.17v-138.4h42.87l98.49,138.4h60.59l-98.62-138.59ZM1255.22,138.46V46.2h94.1c31.8,0,55.55,16.88,55.55,46.33s-23.75,45.93-55.55,45.93h-94.1Z"/></svg>`;
let cachedWhitePng;
let cachedBlackPng;
export const getNexerLogoPng = (variant = 'white') => {
    if (variant === 'white' && cachedWhitePng) {
        return Promise.resolve(cachedWhitePng);
    }
    if (variant === 'black' && cachedBlackPng) {
        return Promise.resolve(cachedBlackPng);
    }
    return new Promise((resolve) => {
        try {
            if (typeof window === 'undefined' || typeof document === 'undefined') {
                resolve('');
                return;
            }
            const svgString = variant === 'white' ? NEXER_LOGO_WHITE_SVG : NEXER_LOGO_BLACK_SVG;
            const img = new Image();
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = 1457;
                    canvas.height = 323;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0);
                        const pngDataUrl = canvas.toDataURL('image/png');
                        if (variant === 'white')
                            cachedWhitePng = pngDataUrl;
                        else
                            cachedBlackPng = pngDataUrl;
                        URL.revokeObjectURL(url);
                        resolve(pngDataUrl);
                        return;
                    }
                }
                catch {
                    // Fallback if canvas context fails
                }
                URL.revokeObjectURL(url);
                resolve('');
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                resolve('');
            };
            img.src = url;
        }
        catch {
            resolve('');
        }
    });
};
export const generateNexerPdfReport = async (options) => {
    try {
        const doc = new jsPDF();
        // Top Dark Nexer Header Banner
        doc.setFillColor(17, 24, 39); // #111827 (Dark Nexer Header)
        doc.rect(0, 0, 210, 28, 'F');
        // Try rendering White Nexer Logo
        const logoPng = await getNexerLogoPng('white');
        if (logoPng) {
            doc.addImage(logoPng, 'PNG', 14, 7, 36, 8);
        }
        else {
            // Fallback Nexer text logo
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.text('NEXER', 14, 17);
        }
        // Header Right Subtitle
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('INVENTORY MANAGEMENT', 196, 17, { align: 'right' });
        // Document Main Title
        doc.setTextColor(17, 24, 39); // Slate 900
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(options.reportTitle, 14, 40);
        // Metadata line
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139); // Slate 500
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 46);
        // Separator line
        doc.setDrawColor(226, 232, 240); // Slate 200
        doc.line(14, 50, 196, 50);
        // Specifications Section Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59); // Slate 800
        doc.text(options.docTitle, 14, 60);
        // Specifications Grid
        let y = 68;
        const printField = (label, value) => {
            if (y > 265) {
                doc.addPage();
                y = 20;
            }
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(100, 116, 139);
            doc.text(label, 14, y);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9.5);
            doc.setTextColor(15, 23, 42);
            doc.text(value || '-', 55, y);
            y += 8;
        };
        printField(options.idLabel, options.idValue);
        printField('Asset Name:', options.assetName);
        printField(options.typeLabel || 'Type:', options.typeValue);
        printField('Priority:', options.priority || 'Medium');
        printField('Current Status:', options.status || 'Open');
        let formattedReported = options.reportedDate;
        try {
            if (options.reportedDate)
                formattedReported = new Date(options.reportedDate).toLocaleString();
        }
        catch {
            // keep raw string
        }
        printField('Reported Date:', formattedReported);
        if (options.assignedTo) {
            printField('Assigned To:', options.assignedTo);
        }
        if (options.resolvedDate) {
            let formattedResolved = options.resolvedDate;
            try {
                formattedResolved = new Date(options.resolvedDate).toLocaleString();
            }
            catch {
                // keep raw string
            }
            printField('Resolved Date:', formattedResolved);
        }
        // Description Section
        y += 4;
        if (y > 260) {
            doc.addPage();
            y = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59);
        doc.text(options.descriptionTitle, 14, y);
        y += 6;
        const splitDesc = doc.splitTextToSize(options.description || 'No details provided.', 170);
        const descHeight = splitDesc.length * 6 + 10;
        if (y + descHeight > 270) {
            doc.addPage();
            y = 20;
        }
        // Draw description background box
        doc.setFillColor(248, 250, 252); // slate 50
        doc.setDrawColor(226, 232, 240); // slate 200
        doc.rect(14, y, 182, descHeight, 'FD');
        // Draw left accent bar
        doc.setFillColor(100, 116, 139); // slate 500
        doc.rect(14, y, 3, descHeight, 'F');
        // Draw description text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        let textY = y + 8;
        splitDesc.forEach((line) => {
            doc.text(line, 22, textY);
            textY += 6;
        });
        y += descHeight + 10;
        // Resolution Details (if available)
        if (options.resolution) {
            if (y > 250) {
                doc.addPage();
                y = 20;
            }
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.setTextColor(30, 41, 59);
            doc.text('RESOLUTION SUMMARY', 14, y);
            y += 6;
            const splitRes = doc.splitTextToSize(options.resolution, 170);
            const resHeight = splitRes.length * 6 + 10;
            if (y + resHeight > 270) {
                doc.addPage();
                y = 20;
            }
            // Draw green background box
            doc.setFillColor(240, 253, 244); // green 50
            doc.setDrawColor(220, 252, 231); // green 200
            doc.rect(14, y, 182, resHeight, 'FD');
            // Draw green left accent bar
            doc.setFillColor(22, 101, 52); // green 800
            doc.rect(14, y, 3, resHeight, 'F');
            // Draw resolution text
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9.5);
            doc.setTextColor(22, 101, 52);
            let resTextY = y + 8;
            splitRes.forEach((line) => {
                doc.text(line, 22, resTextY);
                resTextY += 6;
            });
        }
        // Add footer to all pages
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setDrawColor(226, 232, 240);
            doc.line(14, 280, 196, 280);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184); // slate 400
            doc.text('Nexer Inventory Management System', 14, 286);
            doc.text(`Page ${i} of ${totalPages}`, 196, 286, { align: 'right' });
        }
        doc.save(options.fileName);
    }
    catch (error) {
        console.error('Error generating branded PDF report:', error);
    }
};
//# sourceMappingURL=NexerTheme.js.map