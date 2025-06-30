import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addtocart } from './addtocart';

describe('Addtocart', () => {
  let component: Addtocart;
  let fixture: ComponentFixture<Addtocart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addtocart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addtocart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
