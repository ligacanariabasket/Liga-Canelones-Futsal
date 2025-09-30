import { getFinishedMatchesForHomepage } from '@/actions/match-actions';
import { FinishedMatches } from './FinishedMatches';

export async function FinishedMatchesData() {
  const finishedMatches = await getFinishedMatchesForHomepage();
  return <FinishedMatches finishedMatches={finishedMatches} />;
}
