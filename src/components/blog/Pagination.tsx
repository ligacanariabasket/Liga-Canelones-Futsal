
'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export function BlogPagination({ currentPage, totalPages, basePath }: Props) {
  const prevPage = currentPage > 1 ? `${basePath}?page=${currentPage - 1}` : undefined;
  const nextPage = currentPage < totalPages ? `${basePath}?page=${currentPage + 1}` : undefined;

  const renderPageNumbers = () => {
    const pages = [];
    
    let lastPage = 0;
    for (let i = 1; i <= totalPages; i++) {
        if (i > 0 && i <= totalPages && (i <= 2 || i >= totalPages - 1 || (i >= currentPage - 1 && i <= currentPage + 1))) {
            if (lastPage > 0 && i > lastPage + 1) {
                pages.push(<PaginationEllipsis key={`ellipsis-${lastPage}`} />);
            }
            pages.push(
                <PaginationItem key={i}>
                    <PaginationLink href={`${basePath}?page=${i}`} isActive={i === currentPage}>
                    {i}
                    </PaginationLink>
                </PaginationItem>
            );
            lastPage = i;
        }
    }
    return pages;
  }

  return (
    <Pagination>
      <PaginationContent>
        {prevPage && (
            <PaginationItem>
                <PaginationPrevious href={prevPage} />
            </PaginationItem>
        )}
        
        {renderPageNumbers()}
        
        {nextPage && (
            <PaginationItem>
                <PaginationNext href={nextPage} />
            </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
