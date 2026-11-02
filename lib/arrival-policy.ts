export const ARRIVAL_HOLD_MS = 1200;
export const ARRIVAL_FILM_MS = 9934;
export const ARRIVAL_VISIT_KEY = 'muguetli-arrival-seen';

export function canEnterArrival(state: {
  returning: boolean;
  skipRequested: boolean;
  criticalReady: boolean;
  assetsReady: boolean;
  filmEndedAt: number | null;
  now: number;
}) {
  if (!state.criticalReady) return false;
  if (state.returning && state.skipRequested) return true;
  return state.assetsReady && state.filmEndedAt !== null && state.now - state.filmEndedAt >= ARRIVAL_HOLD_MS;
}
