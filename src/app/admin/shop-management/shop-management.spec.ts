import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopManagement } from './shop-management';

describe('ShopManagement', () => {
  let component: ShopManagement;
  let fixture: ComponentFixture<ShopManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
