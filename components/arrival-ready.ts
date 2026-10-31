'use client';

import { useSyncExternalStore } from 'react';

export const ARRIVAL_COMPLETE_EVENT = 'muguetli:arrival-complete';
export const ARRIVAL_PENDING_EVENT = 'muguetli:arrival-pending';
export const HERO_CRITICAL_READY_EVENT = 'muguetli:hero-critical-ready';

export function markArrivalPending() {
  delete document.documentElement.dataset.arrivalReady;
  window.dispatchEvent(new Event(ARRIVAL_PENDING_EVENT));
}

export function markArrivalComplete() {
  document.documentElement.dataset.arrivalReady = 'true';
  window.dispatchEvent(new Event(ARRIVAL_COMPLETE_EVENT));
}

export function markHeroCriticalReady() {
  document.documentElement.dataset.heroCriticalReady = 'true';
  window.dispatchEvent(new Event(HERO_CRITICAL_READY_EVENT));
}

export function isHeroCriticalReady() {
  return document.documentElement.dataset.heroCriticalReady === 'true';
}

const subscribe = (notify: () => void) => {
  window.addEventListener(ARRIVAL_COMPLETE_EVENT, notify);
  window.addEventListener(ARRIVAL_PENDING_EVENT, notify);
  return () => {
    window.removeEventListener(ARRIVAL_COMPLETE_EVENT, notify);
    window.removeEventListener(ARRIVAL_PENDING_EVENT, notify);
  };
};
const snapshot = () => document.documentElement.dataset.arrivalReady === 'true' || !document.querySelector('[data-arrival-preloader]');
const serverSnapshot = () => false;

/** Keep below-fold motion work idle while the opening film covers the page. */
export function useArrivalReady() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
