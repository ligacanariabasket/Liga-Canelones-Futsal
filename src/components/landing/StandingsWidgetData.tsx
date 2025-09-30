import { getStandingsFromMatches } from '@/actions/season-actions';
import { StandingsWidget } from './StandingsWidget';

export async function StandingsWidgetData() {
  const standings = await getStandingsFromMatches(1); // Assuming season 1
  return <StandingsWidget standings={standings} />;
}
