import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEmailPopComponent } from './verify-email-pop.component';

describe('VerifyEmailPopComponent', () => {
  let component: VerifyEmailPopComponent;
  let fixture: ComponentFixture<VerifyEmailPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyEmailPopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyEmailPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
