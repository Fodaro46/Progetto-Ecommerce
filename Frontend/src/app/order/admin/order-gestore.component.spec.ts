import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderGestoreComponent } from './order-gestore.component';

describe('OrderGestoreComponent', () => {
  let component: OrderGestoreComponent;
  let fixture: ComponentFixture<OrderGestoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderGestoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderGestoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
