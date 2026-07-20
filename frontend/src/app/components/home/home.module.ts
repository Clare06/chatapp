import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ChatListComponent } from '../chat-list/chat-list.component';
import { ChatMessageContainerComponent } from '../chat-message-container/chat-message-container.component';
import { FriendpopComponent } from '../friendpop/friendpop.component';
import { NewlineToBrPipe } from '../../services/newline-to-br.pipe';
import { VerifyEmailPopComponent } from '../verify-email-pop/verify-email-pop.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@NgModule({
  declarations: [
    HomeComponent,
    ChatListComponent,
    ChatMessageContainerComponent,
    FriendpopComponent,
    NewlineToBrPipe,
    VerifyEmailPopComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
