import { getAllTeams } from '@/actions/team-actions';
import { TeamCarousel } from './TeamCarousel';

export async function TeamCarouselData() {
  const teams = await getAllTeams();
  return <TeamCarousel teams={teams} />;
}
