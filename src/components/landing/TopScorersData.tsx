
import { getAggregatedPlayerStats } from '@/actions/player-actions';
import { TopScorers } from './TopScorers';

export async function TopScorersData() {
  const players = await getAggregatedPlayerStats();
  return <TopScorers players={players} loading={false} />;
}
