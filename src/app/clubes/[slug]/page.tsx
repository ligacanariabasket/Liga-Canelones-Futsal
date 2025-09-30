import { getTeamBySlug } from '@/actions/team-actions';
import { notFound } from 'next/navigation';
import { TeamHeader } from '@/components/clubes/TeamHeader';
import { TeamTabs } from '@/components/clubes/TeamTabs';
import type { Team } from '@/types';

// El tipo 'ClubPageProps' ya no es necesario, puedes eliminarlo.
// type ClubPageProps = {
//   params: { slug: string };
//   searchParams: { [key: string]: string | string[] | undefined };
// };

// Tipamos las props directamente en la firma de la función.
export default async function ClubPage({
    params,
}: {
    params: { slug: string };
}) {
    const { slug } = params;
    const team = await getTeamBySlug(slug);

    if (!team) {
        notFound();
    }

    return (
        <div className="flex min-h-screen flex-col bg-muted/40">
            <main className="flex-1">
                <TeamHeader team={team as Team} />
                <TeamTabs team={team as Team} />
            </main>
        </div>
    );
}