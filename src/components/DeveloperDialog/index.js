import React, {useState, useEffect, useCallback} from 'react';
import styles from './styles.module.css';
import developers from '@site/src/pages/developer/developers.json';

const avatarColors = ['#5b7f95', '#7b8f6a', '#957b5b', '#6a6f8f', '#8f6a6a'];

function EmailIcon() {
  return (
    <svg
      className={styles.contactIcon}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      className={styles.contactIcon}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      className={styles.contactIcon}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ContactLink({contact, contactType}) {
  let href, display, Icon;

  switch (contactType) {
    case 'email':
      href = `mailto:${contact}`;
      display = contact;
      Icon = EmailIcon;
      break;
    case 'github':
      href = contact;
      display = contact.replace('https://github.com/', '@');
      Icon = GithubIcon;
      break;
    case 'phone':
      href = `tel:${contact}`;
      display = contact;
      Icon = PhoneIcon;
      break;
    default:
      href = contact;
      display = contact;
      Icon = EmailIcon;
  }

  return (
    <a
      className={styles.contactLink}
      href={href}
      target={contactType === 'github' ? '_blank' : undefined}
      rel={contactType === 'github' ? 'noopener noreferrer' : undefined}>
      <Icon />
      <span>{display}</span>
    </a>
  );
}

export default function DeveloperDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.closest('#developer-info-btn')) {
        open();
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [open]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={close}>
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="开发者信息">
        <div className={styles.header}>
          <h3 className={styles.title}>贡献者团队</h3>
          <button className={styles.closeBtn} onClick={close} aria-label="关闭">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className={styles.body}>
          {developers.map((dev, idx) => (
            <div key={dev.studentId} className={styles.card}>
              <div
                className={styles.avatar}
                style={{background: avatarColors[idx % avatarColors.length]}}>
                {dev.name.charAt(0)}
              </div>
              <div className={styles.info}>
                <div className={styles.name}>{dev.name}</div>
                <div className={styles.studentId}>{dev.studentId}</div>
                <ContactLink
                  contact={dev.contact}
                  contactType={dev.contactType}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
