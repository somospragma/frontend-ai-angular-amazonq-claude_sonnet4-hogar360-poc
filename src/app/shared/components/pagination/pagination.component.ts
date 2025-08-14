import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6" *ngIf="totalPages > 1">
      <div class="flex flex-1 justify-between sm:hidden">
        <button (click)="goToPage(currentPage - 1)" 
                [disabled]="currentPage <= 1"
                class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          Anterior
        </button>
        <button (click)="goToPage(currentPage + 1)" 
                [disabled]="currentPage >= totalPages"
                class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          Siguiente
        </button>
      </div>
      
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Mostrando {{ startItem }}-{{ endItem }} de {{ total }}
          </p>
        </div>
        
        <div class="flex items-center space-x-2">
          <button (click)="goToPage(currentPage - 1)" 
                  [disabled]="currentPage <= 1"
                  class="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50">
            ←
          </button>
          
          <button *ngFor="let page of visiblePages" 
                  (click)="goToPage(page)"
                  [class]="page === currentPage ? 
                    'px-3 py-1 rounded bg-blue-600 text-white text-sm font-medium' :
                    'px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-50'">
            {{ page }}
          </button>
          
          <button (click)="goToPage(currentPage + 1)" 
                  [disabled]="currentPage >= totalPages"
                  class="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50">
            →
          </button>
        </div>
      </div>
    </div>
  `
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() total = 0;
  @Input() pageSize = 10;
  
  @Output() pageChange = new EventEmitter<number>();

  get startItem(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.total);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}