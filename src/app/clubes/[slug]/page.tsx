
import { getTeamBySlug } from '@/actions/team-actions';
import { notFound } from 'next/navigation';
import { TeamHeader } from '@/components/clubes/TeamHeader';
import { TeamTabs } from '@/components/clubes/TeamTabs';
import type { Team } from '@/types';

interface ClubPageProps {
    params: {
        slug: string;
    };
}

export default async function ClubPage({ params }: ClubPageProps) {
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
