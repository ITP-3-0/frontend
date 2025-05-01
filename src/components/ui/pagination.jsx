"use client"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange, className, ...props }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    // Don't render pagination if there's only one page
    if (totalPages <= 1) {
        return null
    }

    // Calculate the range of pages to display
    const getPageRange = () => {
        const maxPagesToShow = 5

        if (totalPages <= maxPagesToShow) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        // Always show first and last page
        const firstPage = 1
        const lastPage = totalPages

        // Calculate middle pages
        let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1)
        let endPage = startPage + maxPagesToShow - 1

        if (endPage > totalPages) {
            endPage = totalPages
            startPage = Math.max(endPage - maxPagesToShow + 1, 1)
        }

        const pages = []

        // Add first page
        if (startPage > 1) {
            pages.push(1)
            // Add ellipsis if there's a gap
            if (startPage > 2) {
                pages.push("ellipsis-start")
            }
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
            if (i !== 1 && i !== totalPages) {
                pages.push(i)
            }
        }

        // Add last page
        if (endPage < totalPages) {
            // Add ellipsis if there's a gap
            if (endPage < totalPages - 1) {
                pages.push("ellipsis-end")
            }
            pages.push(totalPages)
        }

        return pages
    }

    const pageRange = getPageRange()

    return (
        <nav
            role="navigation"
            aria-label="pagination"
            className={cn("mx-auto flex w-full justify-center", className)}
            {...props}
        >
            <ul className="flex flex-row items-center gap-1">
                <li>
                    <PaginationItem
                        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                        aria-label="Go to previous page"
                        className="gap-1 pl-2.5"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous</span>
                    </PaginationItem>
                </li>
                {pageRange.map((page, index) => {
                    if (page === "ellipsis-start" || page === "ellipsis-end") {
                        return (
                            <li key={`ellipsis-${index}`}>
                                <span className="flex h-9 w-9 items-center justify-center">
                                    <MoreHorizontal className="h-4 w-4" />
                                </span>
                            </li>
                        )
                    }

                    return (
                        <li key={page}>
                            <PaginationItem
                                onClick={() => onPageChange(page)}
                                isActive={page === currentPage}
                                aria-label={`Go to page ${page}`}
                                aria-current={page === currentPage ? "page" : undefined}
                            >
                                {page}
                            </PaginationItem>
                        </li>
                    )
                })}
                <li>
                    <PaginationItem
                        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        aria-label="Go to next page"
                        className="gap-1 pr-2.5"
                    >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-4 w-4" />
                    </PaginationItem>
                </li>
            </ul>
        </nav>
    )
}

const PaginationItem = ({ className, isActive, children, disabled, onClick, ...props }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                buttonVariants({
                    variant: isActive ? "default" : "outline",
                    size: "icon",
                }),
                disabled && "opacity-50 cursor-not-allowed",
                className,
            )}
            {...props}
        >
            {children}
        </button>
    )
}

export { Pagination }
