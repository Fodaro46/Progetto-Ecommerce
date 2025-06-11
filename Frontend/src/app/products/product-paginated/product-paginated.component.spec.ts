import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPaginatedComponent } from './product-paginated.component';

describe('ProductPaginatedComponent', () => {
  let component: ProductPaginatedComponent;
  let fixture: ComponentFixture<ProductPaginatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPaginatedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPaginatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
