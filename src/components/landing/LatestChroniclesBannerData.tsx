import { getLatestChronicles } from '@/actions/match-actions';
import { LatestChroniclesBanner } from './LatestChroniclesBanner';

export async function LatestChroniclesBannerData() {
  const chronicles = await getLatestChronicles(5);
  return <LatestChroniclesBanner chronicles={chronicles} />;
}

    