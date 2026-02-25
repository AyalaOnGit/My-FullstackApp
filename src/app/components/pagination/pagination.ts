import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-pagination', // השם שבו נשתמש בתוך ה-HTML של האבא
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 8;
  @Input() currentPage: number = 1;
  
  // זה ה"רמקול" שפולט את האירוע החוצה
  @Output() pageChanged = new EventEmitter<number>(); 

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      // כאן אנחנו "פולטים" את המספר החדש לאבא
      this.pageChanged.emit(page); 
    }
  }
}