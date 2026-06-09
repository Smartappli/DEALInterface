import { useI18n } from "../i18n/I18nProvider";
import type { ModuleHealth } from "../types";

interface StatusPillProps {
  status: ModuleHealth;
}

export function StatusPill({ status }: StatusPillProps) {
  const { t } = useI18n();

  return <span className={`status-pill status-pill--${status}`}>{t(`status.${status}`)}</span>;
}
