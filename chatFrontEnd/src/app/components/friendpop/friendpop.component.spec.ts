import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendpopComponent } from './friendpop.component';

describe('FriendpopComponent', () => {
  let component: FriendpopComponent;
  let fixture: ComponentFixture<FriendpopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendpopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendpopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
