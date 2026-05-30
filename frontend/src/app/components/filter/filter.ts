import { Component, Output, EventEmitter, inject, OnInit, Input } from '@angular/core';
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
    category: null as Category | null
  };

  @Output() onFilterChange = new EventEmitter<any>();
  @Output() onSemanticSearch = new EventEmitter<string>();
  @Input() set initialQuery(val: string) {
    this.filterState.name = '';
  }

  ngOnInit() {
    this.categoryService.getCategories().pipe(
      map(data => [
        { categoryName: 'כל הקטגוריות' },
        ...data
      ])
    ).subscribe((data) => {
      this.categories = data;
    });
  }

  updateFilter(field: string, value: any) {
    (this.filterState as any)[field] = value;
    if (field !== 'name') {
      this.applyFilters();
    }
  }

  onNameInput(value: string) {
    this.filterState.name = value;
    if (value.trim().length === 0) {
      this.applyFilters();
    }
  }

  applyFilters() {
    const cat = this.filterState.category as any;
    const stateToSend = {
      ...this.filterState,
      category: (!cat || cat.categoryName === 'כל הקטגוריות') ? 'all' : cat,
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
      category: null
    };
    this.applyFilters();
  }
}