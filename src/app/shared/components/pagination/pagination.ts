import {Component, computed, input, output} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  imports: [MatIconModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss'
})
export class Pagination {
  private readonly ELLIPSIS = -1;

  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly isLoading = input<boolean>(false);

  readonly pageChange = output<number>();
  readonly previousPage = output<void>();
  readonly nextPage = output<void>();

  readonly hasPreviousPage = computed(() => this.currentPage() > 1);
  readonly hasNextPage = computed(() => this.currentPage() < this.totalPages());

  readonly pages = computed(() => {
    const totalPages = this.totalPages();
    const currentPage = this.currentPage();

    if (totalPages <= 5) {
      return Array.from({length: totalPages}, (_, i) => i + 1);
    }

    const pages: number[] = [1];

    if (currentPage <= 3) {
      pages.push(2, 3, this.ELLIPSIS, totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(this.ELLIPSIS, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(this.ELLIPSIS, currentPage, this.ELLIPSIS, totalPages);
    }

    return pages;
  });

  onPageClick(page: number): void {
    if (page !== this.ELLIPSIS && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }

  onPrevious(): void {
    if (this.hasPreviousPage()) {
      this.previousPage.emit();
    }
  }

  onNext(): void {
    if (this.hasNextPage()) {
      this.nextPage.emit();
    }
  }

  isEllipsis(page: number): boolean {
    return page === this.ELLIPSIS;
  }
}
