import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchStateService {
  readonly query$ = new BehaviorSubject<string | null>(null);

  search(q: string) { this.query$.next(q); }
  clear() { this.query$.next(''); }
}
