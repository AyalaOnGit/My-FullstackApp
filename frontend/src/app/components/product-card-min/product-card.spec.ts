import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardMin } from './product-card';

describe('ProductCard', () => {
  let component: ProductCardMin;
  let fixture: ComponentFixture<ProductCardMin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardMin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardMin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
