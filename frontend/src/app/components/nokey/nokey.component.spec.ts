import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NokeyComponent } from './nokey.component';

describe('NokeyComponent', () => {
  let component: NokeyComponent;
  let fixture: ComponentFixture<NokeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NokeyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NokeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
