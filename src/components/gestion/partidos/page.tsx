

'use client';

import { useEffect, useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { getAllMatches } from '@/actions/match-actions';
import { getAllSeasonsWithTeams } from '@/actions/season-actions';
import type { FullMatch, Team } from '@/types';
import type { Season } from '@prisma/client';
import { MatchDataTable } from '@/components/gestion/partidos/DataTable';
import { columns } from '@/components/gestion/partidos/Columns';
import { CreateMatchForm } from '@/components/gestion/partidos/CreateMatchForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

type SeasonWithTeams = Season & { teams: { team: Team }[] };

export default function GestionPartidosPage() {
    const [matches, setMatches] = useState<FullMatch[]>([]);
    const [seasons, setSeasons] = useState<SeasonWithTeams[]>([]);
    const [selectedSeasonId, setSelectedSeasonId] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const [matchesData, seasonsData] = await Promise.all([
                getAllMatches(),
                getAllSeasonsWithTeams()
            ]);
            setMatches(matchesData);
            setSeasons(seasonsData as unknown as SeasonWithTeams[]);
            if (seasonsData.length > 0) {
                setSelectedSeasonId(String(seasonsData[0].id));
            }
            setLoading(false);
        }
        loadData();
    }, []);

    const filteredMatches = useMemo(() => {
        if (!selectedSeasonId) return [];
        return matches.filter(match => String(match.seasonId) === selectedSeasonId);
    }, [matches, selectedSeasonId]);

    const selectedSeason = useMemo(() => {
        return seasons.find(season => String(season.id) === selectedSeasonId);
    }, [seasons, selectedSeasonId]);

    const teamsForSelectedSeason = useMemo(() => {
        if (!selectedSeason) return [];
        return selectedSeason.teams.map(st => st.team);
    }, [selectedSeason]);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <PageHero
                    title="Gestión de Partidos"
                    description="Crea, visualiza y administra todos los partidos de la liga."
                />
                <div className="container mx-auto p-4 py-8 md:p-8">
                     {loading ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                <Skeleton className="h-10 w-64" />
                                <Skeleton className="h-[400px] w-full" />
                            </div>
                            <Skeleton className="h-96 w-full" />
                        </div>
                    ) : (
                    <>
                        <div className="mb-6">
                            <label htmlFor="season-select" className="text-lg font-semibold text-primary">
                                Seleccionar Temporada
                            </label>
                            <Select onValueChange={setSelectedSeasonId} value={selectedSeasonId}>
                                <SelectTrigger id="season-select" className="mt-2 max-w-sm">
                                    <SelectValue placeholder="Seleccione una temporada para ver los partidos" />
                                </SelectTrigger>
                                <SelectContent>
                                    {seasons.map(season => (
                                        <SelectItem key={season.id} value={String(season.id)}>
                                            {season.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            <div className="lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Lista de Partidos</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <MatchDataTable columns={columns} data={filteredMatches} />
                                    </CardContent>
                                </Card>
                            </div>
                            <div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Crear Nuevo Partido</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {selectedSeason ? (
                                            <CreateMatchForm
                                                teams={teamsForSelectedSeason}
                                                seasonId={selectedSeason.id}
                                                onMatchCreated={(newMatch) => setMatches(prev => [...prev, newMatch])}
                                            />
                                        ) : (
                                            <p className="text-muted-foreground text-center">Seleccione una temporada para crear un partido.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </>
                )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
