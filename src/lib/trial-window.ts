/** Janela do período gratuito de 15 dias (deve espelhar handle_new_user no banco). */
export const TRIAL_FREE_START = new Date("2026-08-10T00:00:00-03:00");
export const TRIAL_FREE_UNTIL = new Date("2026-09-10T23:59:59-03:00");

export function isFreeTrialOpen(now: Date = new Date()): boolean {
  return now.getTime() <= TRIAL_FREE_UNTIL.getTime();
}

export const TRIAL_FREE_UNTIL_LABEL = "10/09/2026";
export const TRIAL_FREE_START_LABEL = "10/08/2026";
