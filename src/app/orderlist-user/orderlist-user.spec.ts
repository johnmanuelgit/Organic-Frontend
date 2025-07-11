import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderlistUser } from './orderlist-user';

describe('OrderlistUser', () => {
  let component: OrderlistUser;
  let fixture: ComponentFixture<OrderlistUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderlistUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderlistUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
