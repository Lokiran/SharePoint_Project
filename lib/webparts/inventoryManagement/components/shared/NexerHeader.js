import * as React from 'react';
import styles from './NexerHeader.module.scss';
import { NEXER_LOGO_WHITE_SVG, NEXER_LOGO_BLACK_SVG } from '../../utils/NexerTheme';
export const NexerHeader = ({ title, subtitle, logoVariant = 'white', isPanel = false, className, children, }) => {
    const logoSvg = logoVariant === 'white' ? NEXER_LOGO_WHITE_SVG : NEXER_LOGO_BLACK_SVG;
    const headerClass = `${styles.nexerHeader} ${isPanel ? styles.panelHeader : ''} ${className || ''}`.trim();
    return (React.createElement("div", { className: headerClass },
        React.createElement("div", { className: styles.brandSection },
            React.createElement("div", { className: styles.logoContainer, dangerouslySetInnerHTML: { __html: logoSvg } }),
            React.createElement("div", { className: styles.divider }),
            React.createElement("div", { className: styles.titleContainer },
                React.createElement("h3", { className: styles.title }, title),
                subtitle && React.createElement("p", { className: styles.subtitle }, subtitle))),
        children && React.createElement("div", { className: styles.actions }, children)));
};
//# sourceMappingURL=NexerHeader.js.map