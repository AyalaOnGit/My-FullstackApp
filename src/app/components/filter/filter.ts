import { Component, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CategoryService } from '../../services/category';
import { Category } from '../../models/category';
import { map } from 'rxjs'; // ייבוא map עבור הוספת הקטגוריה

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [InputTextModule, InputNumberModule, ButtonModule, SelectModule, FormsModule],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class Filter implements OnInit {
  private categoryService = inject(CategoryService);

  categories: any[] = []; // שינוי ל-any כדי להכיל את האופציה הכללית
  
  filterState = {
    name: '',
    maxPrice: null as number | null,
    minPrice: null as number | null,
    category: 'all' // ערך ברירת מחדל
  };

  @Output() onFilterChange = new EventEmitter<any>();

  ngOnInit() {
    this.categoryService.getCategories().pipe(
      map(data => [
        { categoryName: 'כל הקטגוריות', categoryId: 0 }, // הוספת האופציה הכללית לראש הרשימה
        ...data
      ])
    ).subscribe((data) => {
      this.categories = data;
    });
  }

  updateFilter(field: string, value: any) {
    (this.filterState as any)[field] = value;
    
    // סינון אוטומטי בשינוי קטגוריה או מחיר
    if (field !== 'name') {
      this.applyFilters();
    }
  }

  applyFilters() {
    const stateToSend = {
      ...this.filterState,
      // אם נבחר "כל הקטגוריות" (categoryId: 0) או 'all', נשלח ערך ריק או 'all' לאבא
      category: (this.filterState.category === 'כל הקטגוריות' || this.filterState.category === 'all') 
                ? 'all' 
                : this.filterState.category,
      maxPrice: this.filterState.maxPrice ?? Infinity,
      minPrice: this.filterState.minPrice ?? 0
    };
    this.onFilterChange.emit(stateToSend);
  }

  clearAllFilters() {
    this.filterState = {
      name: '',
      maxPrice: null,
      minPrice: null,
      category: 'all'
    };
    this.applyFilters();
  }
}