import styles from './journal-icon.module.css';

export type JournalIconKind = 'flower' | 'weave' | 'scissors' | 'pixels' | 'fire' | 'earth' | 'water' | 'wind';

/** One botanical seal family, drawn as native vectors in the site's theme. */
export function JournalIcon({ kind, className = '' }: { kind: JournalIconKind; className?: string }) {
  return <svg className={`${styles.icon} ${className}`} width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <circle className={styles.wash} cx="40" cy="40" r="35" stroke="none" />
    <path className={styles.orbit} d="M18 14a34 34 0 1 1-8 41M8 41A34 34 0 0 1 18 14" />
    {kind === 'flower' && <>
      <path d="M34 62c-2-12-2-26 2-36 4-12 18-13 24-3M34 57C19 55 18 43 19 34c12 5 19 12 15 23Z" />
      <path className={styles.accent} d="M35 60c13-3 19-12 18-22-11 3-18 11-18 22" />
      <path d="M39 25c-4 0-6 4-6 8l-3 3c3 4 10 4 13 0l-3-3v-8M51 23c-4 1-5 5-4 9l-2 4c4 3 10 1 12-3l-4-2-2-8M60 25c-3 2-3 6-2 9l-1 3c3 2 8-1 9-4l-3-1-3-7" />
    </>}
    {kind === 'weave' && <>
      <path d="m22 24 34 32M18 35l27 27M33 18l29 27M56 22 24 56M45 18 18 45M62 33 33 62" />
      <path className={styles.accent} strokeWidth="4" d="m25 29 9 8m8 8 9 8M51 27l-8 9m-8 8-8 9" />
      <path d="M20 21c13-8 26-8 40 0 8 14 8 27 0 39-14 8-27 8-40 0-8-13-8-26 0-39Z" />
    </>}
    {kind === 'scissors' && <>
      <circle cx="25" cy="54" r="8" /><circle cx="51" cy="55" r="8" />
      <path d="m30 48 24-29c2 12-5 21-11 26M46 49 23 20c-1 13 6 21 14 26" />
      <circle className={styles.accent} cx="38" cy="40" r="2" />
      <path className={styles.accent} d="M62 24c-6 4 5 8-1 12M64 41v17m-4-14h4m-4 5h4m-4 5h4" />
    </>}
    {kind === 'pixels' && <>
      <path d="M18 55c7-20 9-30 20-31 9-1 10 10 8 19-2 11-6 16-14 16-7 0-6-12-2-18 4-6 9-7 15-5" />
      <path className={styles.accent} d="M50 21h7v7h-7zM58 34h5v5h-5zM48 43h7v7h-7zM60 52h4v4h-4zM44 58h4v4h-4z" />
      <path d="M62 20h2M54 59h2" />
    </>}
    {kind === 'fire' && <>
      <path d="M42 17c4 14-13 17-7 29 5-1 7-7 7-12 12 8 17 17 9 26-7 8-22 6-26-4-5-14 5-22 17-39Z" />
      <path className={styles.accent} d="M39 63c-8-6-5-13 1-19-1 7 10 11 3 19" />
    </>}
    {kind === 'earth' && <>
      <path d="M18 42h44M40 59V32M40 40c-14-1-17-9-17-17 13 1 18 7 17 17Z" />
      <path className={styles.accent} d="M40 33c0-11 8-15 18-15-1 10-7 16-18 15" />
      <path d="m40 49-10 8m10-3 9 8m-9-3-3 7M21 49h7m23 0h8M20 59h4m30 3h5" />
    </>}
    {kind === 'water' && <>
      <path d="M40 17c-4 11-17 23-17 33a17 17 0 0 0 34 0c0-10-13-22-17-33Z" />
      <path className={styles.accent} d="M28 48c5-5 9 5 14 0s9 5 12 0M31 56c4-3 7 3 11 0s7 2 10 0" />
    </>}
    {kind === 'wind' && <>
      <path d="M17 34h32c13 0 13-17 3-17-5 0-8 4-8 8M17 43h39c12 0 12 17 2 17-5 0-8-4-8-8" />
      <path className={styles.accent} d="M22 52h13c11 0 11 12 3 12M28 25h7M59 33h5" />
    </>}
  </svg>;
}
