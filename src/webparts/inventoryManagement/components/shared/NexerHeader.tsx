import * as React from 'react';
import styles from './NexerHeader.module.scss';
import { NEXER_LOGO_WHITE_SVG, NEXER_LOGO_BLACK_SVG } from '../../utils/NexerTheme';

export interface INexerHeaderProps {
  title: string;
  subtitle?: string;
  logoVariant?: 'white' | 'black';
  isPanel?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const NexerHeader: React.FC<INexerHeaderProps> = ({
  title,
  subtitle,
  logoVariant = 'white',
  isPanel = false,
  className,
  children,
}) => {
  const logoSvg = logoVariant === 'white' ? NEXER_LOGO_WHITE_SVG : NEXER_LOGO_BLACK_SVG;
  const headerClass = `${styles.nexerHeader} ${isPanel ? styles.panelHeader : ''} ${className || ''}`.trim();

  return (
    <div className={headerClass}>
      <div className={styles.brandSection}>
        <div
          className={styles.logoContainer}
          dangerouslySetInnerHTML={{ __html: logoSvg }}
        />
        <div className={styles.divider} />
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>
      {children && <div className={styles.actions}>{children}</div>}
    </div>
  );
};
