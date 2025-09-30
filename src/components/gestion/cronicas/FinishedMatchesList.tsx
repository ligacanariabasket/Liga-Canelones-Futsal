
'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import type { FullMatch } from '@/types';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { MatchCard } from './MatchCard';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';

interface FinishedMatchesListProps {
    matches: FullMatch[];
}

const ITEMS_PER_PAGE = 9;

export function FinishedMatchesList({ matches }: FinishedMatchesListProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMatches = useMemo(() => {
        if (!searchTerm) {
            return matches;
        }
        return matches.filter(match =>
            match.teamA.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            match.teamB.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [matches, searchTerm]);

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
    
    // Reset to page 1 when search term changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

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
            <CardHeader className="p-0 mb-4 flex-row items-center justify-between">
                <CardTitle>Selecciona un Partido Finalizado</CardTitle>
                <div className="w-full max-w-sm">
                    <Input
                        placeholder="Buscar por equipo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </CardHeader>

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
