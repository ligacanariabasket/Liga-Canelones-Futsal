
import { getLatestChronicles } from '@/actions/match-actions';
import { LatestChroniclesBanner } from './LatestChroniclesBanner';
import type { MatchChronicle, FullMatch } from '@/types';

export async function LatestChroniclesBannerData() {
  const chronicles = await getLatestChronicles(5);
  return <LatestChroniclesBanner chronicles={chronicles as unknown as (MatchChronicle & { match: FullMatch })[]} />;
}
