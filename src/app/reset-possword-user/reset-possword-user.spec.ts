import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPosswordUser } from './reset-possword-user';

describe('ResetPosswordUser', () => {
  let component: ResetPosswordUser;
  let fixture: ComponentFixture<ResetPosswordUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPosswordUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPosswordUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
