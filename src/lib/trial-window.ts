/** Janela da campanha de acesso gratuito até 30/09/2026. */
export const TRIAL_FREE_START = new Date("2026-08-10T00:00:00-03:00");
export const TRIAL_FREE_UNTIL = new Date("2026-09-30T23:59:59-03:00");

export function isFreeTrialOpen(now: Date = new Date()): boolean {
  return now.getTime() <= TRIAL_FREE_UNTIL.getTime();
}

export const TRIAL_FREE_UNTIL_LABEL = "30/09/2026";
export const TRIAL_FREE_START_LABEL = "10/08/2026";
