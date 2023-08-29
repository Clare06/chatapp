import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessageContainerComponent } from './chat-message-container.component';

describe('ChatMessageContainerComponent', () => {
  let component: ChatMessageContainerComponent;
  let fixture: ComponentFixture<ChatMessageContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatMessageContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatMessageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
