import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Footer1 } from './footer';

describe('Footer', () => {
  let component: Footer1;
  let fixture: ComponentFixture<Footer1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Footer1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
