"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NexerHeader = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const NexerHeader_module_scss_1 = tslib_1.__importDefault(require("./NexerHeader.module.scss"));
const NexerTheme_1 = require("../../utils/NexerTheme");
const NexerHeader = ({ title, subtitle, logoVariant = 'white', isPanel = false, className, children, }) => {
    const logoSvg = logoVariant === 'white' ? NexerTheme_1.NEXER_LOGO_WHITE_SVG : NexerTheme_1.NEXER_LOGO_BLACK_SVG;
    const headerClass = `${NexerHeader_module_scss_1.default.nexerHeader} ${isPanel ? NexerHeader_module_scss_1.default.panelHeader : ''} ${className || ''}`.trim();
    return (React.createElement("div", { className: headerClass },
        React.createElement("div", { className: NexerHeader_module_scss_1.default.brandSection },
            React.createElement("div", { className: NexerHeader_module_scss_1.default.logoContainer, dangerouslySetInnerHTML: { __html: logoSvg } }),
            React.createElement("div", { className: NexerHeader_module_scss_1.default.divider }),
            React.createElement("div", { className: NexerHeader_module_scss_1.default.titleContainer },
                React.createElement("h3", { className: NexerHeader_module_scss_1.default.title }, title),
                subtitle && React.createElement("p", { className: NexerHeader_module_scss_1.default.subtitle }, subtitle))),
        children && React.createElement("div", { className: NexerHeader_module_scss_1.default.actions }, children)));
};
exports.NexerHeader = NexerHeader;
//# sourceMappingURL=NexerHeader.js.map