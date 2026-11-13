import { Body, Card, Muted, Screen, SectionTitle, ThemeSwitcher } from '@/shared/components';
import { useReduceMotion } from '@/shared/hooks/useReduceMotion';
import { CURRENCY_SYMBOL, formatMoney } from '@/shared/lib/format';
import { useTheme } from '@/shared/theme';

export function SettingsScreen() {
  const { scheme, preference } = useTheme();
  const reduceMotion = useReduceMotion();

  return (
    <Screen hasHeader width="form">
      <SectionTitle>Appearance</SectionTitle>
      <ThemeSwitcher />
      <Muted>
        {preference === 'system'
          ? `Following your phone. It is in ${scheme} mode right now.`
          : `Always ${preference}, whatever your phone is set to.`}
      </Muted>

      <SectionTitle>Motion</SectionTitle>
      <Card>
        <Body>Animations</Body>
        <Muted>
          {reduceMotion
            ? "Reduced, because your phone's Reduce motion setting is on."
            : "On. They switch off automatically if you turn on Reduce motion in your phone's accessibility settings."}
        </Muted>
      </Card>

      <SectionTitle>Currency</SectionTitle>
      <Card>
        <Body>{`Indian rupee (${CURRENCY_SYMBOL})`}</Body>
        <Muted>{`Amounts use Indian digit grouping, for example ${formatMoney(1234567)}.`}</Muted>
      </Card>
    </Screen>
  );
}
