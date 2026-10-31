'use client';

import { useSyncExternalStore } from 'react';
import { Heart } from 'lucide-react';
import type { Locale } from '@/lib/muguetli';

const key = 'muguetli-saved-artworks';
let fallback = '[]';
let memoryOnly = false;
function snapshot() {
  if (memoryOnly) return fallback;
  try { return localStorage.getItem(key) ?? '[]'; } catch { return fallback; }
}
function subscribe(callback: () => void) {
  const storageChanged = (event: StorageEvent) => {
    if (event.key !== key && event.key !== null) return;
    fallback = event.newValue ?? '[]';
    memoryOnly = false;
    callback();
  };
  window.addEventListener('storage', storageChanged);
  window.addEventListener('muguetli-saved', callback);
  return () => { window.removeEventListener('storage', storageChanged); window.removeEventListener('muguetli-saved', callback); };
}
export function useSavedArtworks() {
  const value = useSyncExternalStore(subscribe, snapshot, () => '[]');
  let saved: string[] = [];
  try { const parsed: unknown = JSON.parse(value); if (Array.isArray(parsed)) saved = parsed.filter((id): id is string => typeof id === 'string'); } catch { /* Ignore invalid browser storage. */ }
  function toggle(id: string) {
    let current: string[] = [];
    try { const parsed = JSON.parse(snapshot()); if (Array.isArray(parsed)) current = parsed.filter(item => typeof item === 'string'); } catch { /* Start a fresh list. */ }
    fallback = JSON.stringify(current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
    try { localStorage.setItem(key, fallback); memoryOnly = false; } catch { memoryOnly = true; }
    window.dispatchEvent(new Event('muguetli-saved'));
  }
  return { saved, toggle };
}
export function SaveArtwork({ id, locale, className, showLabel = false }: { id: string; locale: Locale; className?: string; showLabel?: boolean }) {
  const { saved, toggle } = useSavedArtworks();
  const active = saved.includes(id);
  const label = locale === 'fa' ? (active ? 'حذف از پسندیده‌ها' : 'ذخیرهٔ اثر') : (active ? 'Remove from favourites' : 'Save artwork');
  return <button type="button" className={className} aria-label={label} aria-pressed={active} onClick={() => toggle(id)}><Heart aria-hidden="true" size={18} strokeWidth={1.4} fill={active ? 'currentColor' : 'none'} />{showLabel && <span>{label}</span>}</button>;
}
