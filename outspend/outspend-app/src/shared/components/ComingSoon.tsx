import { Muted, Title } from './Typography';
import { Screen } from './Screen';

export function ComingSoon({ title }: { title: string }) {
  return (
    <Screen>
      <Title>{title}</Title>
      <Muted>This screen is built in an upcoming step.</Muted>
    </Screen>
  );
}
