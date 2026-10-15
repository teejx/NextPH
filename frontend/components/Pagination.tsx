import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  basePath,
}) => {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    return page === 1 ? basePath : `${basePath}?page=${page}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination Navigation"
      className="mt-14 flex items-center justify-center gap-2 border-t border-[#CCC7BD] pt-8"
    >
      {/* Previous Page Link */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="inline-flex items-center gap-1 rounded-sm border border-[#CCC7BD] bg-white px-3 py-2 text-xs font-semibold text-[#141312] transition-colors hover:border-[#141312] hover:text-[#C43622] focus-visible:outline-2 focus-visible:outline-[#C43622]"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Link>
      ) : (
        <span
          className="inline-flex items-center gap-1 rounded-sm border border-[#E8E4DD] bg-[#FBF9F5] px-3 py-2 text-xs font-semibold text-[#CCC7BD] cursor-not-allowed"
          aria-disabled="true"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </span>
      )}

      {/* Numbered Page Buttons */}
      <div className="flex items-center gap-1.5">
        {pages.map((p) => {
          const isCurrent = p === currentPage;
          return isCurrent ? (
            <span
              key={p}
              aria-current="page"
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-[#141312] text-xs font-bold text-white"
            >
              {p}
            </span>
          ) : (
            <Link
              key={p}
              href={getPageUrl(p)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-[#CCC7BD] bg-white text-xs font-semibold text-[#141312] transition-colors hover:border-[#141312] hover:text-[#C43622] focus-visible:outline-2 focus-visible:outline-[#C43622]"
              aria-label={`Go to page ${p}`}
            >
              {p}
            </Link>
          );
        })}
      </div>

      {/* Next Page Link */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="inline-flex items-center gap-1 rounded-sm border border-[#CCC7BD] bg-white px-3 py-2 text-xs font-semibold text-[#141312] transition-colors hover:border-[#141312] hover:text-[#C43622] focus-visible:outline-2 focus-visible:outline-[#C43622]"
          aria-label="Go to next page"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span
          className="inline-flex items-center gap-1 rounded-sm border border-[#E8E4DD] bg-[#FBF9F5] px-3 py-2 text-xs font-semibold text-[#CCC7BD] cursor-not-allowed"
          aria-disabled="true"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
};
