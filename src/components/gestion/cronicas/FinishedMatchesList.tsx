
'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import type { FullMatch } from '@/types';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { MatchCard } from './MatchCard';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';

interface FinishedMatchesListProps {
    matches: FullMatch[];
}

const ITEMS_PER_PAGE = 10;

export function FinishedMatchesList({ matches }: FinishedMatchesListProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRound, setSelectedRound] = useState<number | 'all'>('all');

    const rounds = useMemo(() => {
        const roundSet = new Set(matches.map(m => m.round).filter((r): r is number => r !== null && r !== undefined));
        return Array.from(roundSet).sort((a, b) => a - b);
    }, [matches]);

    const filteredMatches = useMemo(() => {
        let filtered = matches;

        if (searchTerm) {
            filtered = filtered.filter(match =>
                match.teamA.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                match.teamB.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedRound !== 'all') {
            filtered = filtered.filter(match => match.round === selectedRound);
        }
        
        return filtered;
    }, [matches, searchTerm, selectedRound]);

    const totalPages = Math.ceil(filteredMatches.length / ITEMS_PER_PAGE);

    const currentMatches = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredMatches.slice(startIndex, endIndex);
    }, [filteredMatches, currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedRound]);

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        let lastPage = 0;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                 if (lastPage !== 0 && i > lastPage + 1) {
                    pages.push(<PaginationEllipsis key={`ellipsis-${i}`} />);
                }
                pages.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            href="#"
                            onClick={(e) => { e.preventDefault(); handlePageChange(i); }}
                            isActive={currentPage === i}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
                lastPage = i;
            }
        }

        return (
             <Pagination>
                <PaginationContent>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                    {pages}
                    <PaginationNext
                        href="#"
                        onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationContent>
            </Pagination>
        );
    }

    return (
        <div className="space-y-6">
            <CardHeader className="p-0 mb-4 flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
                <CardTitle>Selecciona un Partido Finalizado</CardTitle>
                <div className="w-full sm:w-auto sm:max-w-xs">
                    <Input
                        placeholder="Buscar por equipo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </CardHeader>
            
            {rounds.length > 0 && (
                 <Carousel
                    opts={{ align: "start", containScroll: "trimSnaps" }}
                    className="w-full max-w-lg mx-auto"
                >
                    <CarouselContent className="-ml-2">
                         <CarouselItem className="pl-2 basis-auto">
                            <Button
                                variant={selectedRound === 'all' ? 'default' : 'outline'}
                                onClick={() => setSelectedRound('all')}
                                size="sm"
                            >
                                Todas las Jornadas
                            </Button>
                        </CarouselItem>
                        {rounds.map(round => (
                            <CarouselItem key={round} className="pl-2 basis-auto">
                            <Button
                                variant={selectedRound === round ? 'default' : 'outline'}
                                onClick={() => setSelectedRound(round)}
                                className="w-full"
                                size="sm"
                            >
                                Jornada {round}
                            </Button>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
              </Carousel>
            )}

            {currentMatches.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentMatches.map(match => (
                        <MatchCard key={match.id} match={match} />
                    ))}
                 </div>
            ) : (
                <div className="text-center py-16 text-muted-foreground">
                    <p>No se encontraron partidos para los filtros seleccionados.</p>
                </div>
            )}
            
            <div className="mt-8">
                {renderPagination()}
            </div>
        </div>
    )
}
