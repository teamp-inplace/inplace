import { useMemo } from 'react';
import styled from 'styled-components';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  itemsPerPage,
}: PaginationProps) {
  const shouldShowPagination = useMemo(() => {
    if (itemsPerPage && totalItems) {
      return totalItems > itemsPerPage;
    }
    return true;
  }, [itemsPerPage, totalItems]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(currentPage - 2, 1);
    const end = Math.min(start + 4, totalPages);

    if (end === totalPages) {
      start = Math.max(totalPages - 4, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePageChange = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    }
  };

  if (!shouldShowPagination || totalPages <= 1) {
    return null;
  }

  return (
    <PaginationContainer>
      <ArrowButton aria-label="left_btn" onClick={() => handlePageChange(currentPage - 1)} disabled={isFirstPage}>
        <IoChevronBack size={20} />
      </ArrowButton>
      {pageNumbers.map((pageNum) => (
        <PageNumber
          key={pageNum}
          aria-label="page_number"
          onClick={() => handlePageChange(pageNum)}
          $active={pageNum === currentPage}
        >
          {pageNum}
        </PageNumber>
      ))}
      <ArrowButton aria-label="right_btn" onClick={() => handlePageChange(currentPage + 1)} disabled={isLastPage}>
        <IoChevronForward size={20} />
      </ArrowButton>
    </PaginationContainer>
  );
}

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 20px 0;
`;

const ArrowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
  color: white;
  box-shadow: none;
  border: none;

  &:hover:not(:disabled) {
    background: #c8c8c8;
    color: black;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  svg {
    display: block;
  }
`;

interface PageNumberProps {
  $active: boolean;
}

const PageNumber = styled.button<PageNumberProps>`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: ${(props) => (props.$active ? 'black' : 'white')};
  cursor: pointer;

  ${(props) =>
    props.$active &&
    `
    background: #c8c8c8;
    border: 1px solid #000;
  `}

  &:hover {
    background: ${(props) => (props.$active ? '#c8c8c8' : 'grey')};
  }
`;
