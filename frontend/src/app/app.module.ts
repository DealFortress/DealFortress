import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '@app/shared/modules/app-routing.module';
import { AppComponent } from '@app/app.component';
import { SearchBarComponent } from '@app/shared/search-bar/search-bar.component';
import { NoticeDetailComponent } from '@app/notices/feature/notice-detail/notice-detail.component';
import { NoticeListComponent } from '@app/notices/feature/notice-list/notice-list.component';
import { ErrorComponent } from '@app/shared/error/error.component';
import { MainContainerComponent } from '@app/shared/main-container/main-container.component';
import { NoticeFormComponent } from '@app/notices/utils/notice-form/notice-form.component';
import { LoaderComponent } from '@app/shared/loader/loader.component';
import { NotFoundComponent } from '@app/shared/not-found/not-found.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NoticeCardComponent } from '@app/notices/utils/notice-card/notice-card.component';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from 'environments/environment.production';
import { AuthLoginButtonComponent } from './shared/auth/auth-login-button/auth-login-button.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AuthLogoutButtonComponent } from './shared/auth/auth-logout-button/auth-logout-button.component';
import { PopupCardComponent } from './shared/popup-card/popup-card.component';
import { UserProfileComponent } from './users/feature/user-profile/user-profile.component';
import { UsersApiService } from './users/data-access/services/users-api.service';
import { AsyncPipe } from '@angular/common';
import {
    faBars as fasBars,
    faArrowRightToBracket as fasArrowRightToBracket,
    faCashRegister as fasCashRegister,
    faChessRook as fasChessRook,
    faCrow as fasCrow,
    faCoins as fasCoins,
    faSackDollar as fasSackDollar,
    faFeather as fasFeather,
    faTrashCan as fasTrashCan,
    faDove as fasDove,
    faAngleLeft as fasAngleLeft,
    faAngleRight as fasAngleRight,
    faCircle as fasCircle,
  } from '@fortawesome/free-solid-svg-icons';
import {
    faMessage as farMessage
} from '@fortawesome/free-regular-svg-icons';
import { StoreModule } from '@ngrx/store';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { NoticesEffects } from './notices/data-access/store/notices.effects';
import { noticesReducer } from './notices/data-access/store/notices.reducer';
import { NoticesApiService } from './notices/data-access/services/notices-api/notices-api.service';
import { MaterialModule } from './shared/modules/material.module';
import { AppEffects } from './shared/store/app.effects';
import { UsersEffect } from './users/data-access/store/users.effects';
import { usersReducer } from './users/data-access/store/users.reducer';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { RequestRetryInterceptor } from './shared/interceptors/request-retry.interceptor';
import { UserCardComponent } from './users/utils/user-card/user-card.component';
import { ProductCardComponent } from './notices/feature/notice-detail/product-card/product-card.component';
import { ProductDetailComponent } from './notices/feature/notice-detail/product-detail/product-detail.component';
import { ImageCarouselComponent } from './notices/feature/notice-detail/product-detail/image-carousel/image-carousel.component';
import { FullscreenImageCarouselComponent } from './notices/feature/notice-detail/product-detail/fullscreen-image-carousel/fullscreen-image-carousel.component';
import { ProductFormComponent } from './notices/utils/notice-form/product-form/product-form.component';
import { CategoriesApiService } from './categories/data-access/services/categories-api.service';
import { categoriesReducer } from './categories/data-access/store/categories.reducer';
import { CategoriesEffects } from './categories/data-access/store/categories.effects';
import { NoticeCreateComponent } from './notices/feature/notice-create/notice-create.component';
import { NoticeEditComponent } from './notices/feature/notice-edit/notice-edit.component';
import { conversationsReducer } from './conversations/data-access/store/conversations.reducer';
import { ConversationsEffects } from './conversations/data-access/store/conversations.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SignalREffects, signalrReducer } from 'ngrx-signalr-core';
import { ConversationDetailComponent } from './conversations/feature/conversation-detail/conversation-detail.component';
import { ConversationListComponent } from './conversations/feature/conversation-list/conversation-list.component';
import { ConversationCardComponent } from './conversations/utils/conversation-card/conversation-card.component';
import { ConversationCreateComponent } from "./conversations/feature/conversation-create/conversation-create.component";
import { MessagesCreateComponent } from './conversations/feature/messages-create/messages-create.component';
import { MinimalNoticeCardComponent } from './notices/utils/minimal-notice-card/minimal-notice-card.component';
import { MessageCardComponent } from './conversations/utils/message-card/message-card.component';
import { ConversationsNotificationsDropdownComponent } from './conversations/utils/conversations-notifications-dropdown/conversations-notifications-dropdown.component';
import { NotificationCardComponent } from './conversations/utils/notification-card/notification-card.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';

@NgModule({
    declarations: [
        AppComponent,
        NoticeListComponent,
        ErrorComponent,
        SearchBarComponent,
        NavBarComponent,
        LoaderComponent,
        MainContainerComponent,
        NoticeFormComponent,
        NoticeDetailComponent,
        NotFoundComponent,
        NoticeCardComponent,
        AuthLoginButtonComponent,
        AuthLogoutButtonComponent,
        PopupCardComponent,
        UserProfileComponent,
        ProductDetailComponent,
        UserCardComponent,
        ProductCardComponent,
        ImageCarouselComponent,
        FullscreenImageCarouselComponent,
        ProductFormComponent,
        NoticeCreateComponent,
        NoticeEditComponent,
        ConversationDetailComponent,
        ConversationListComponent,
        ConversationCardComponent,
        ConversationCreateComponent,
        MessagesCreateComponent,
        MinimalNoticeCardComponent,
        MessageCardComponent,
        ConversationsNotificationsDropdownComponent,
        NotificationCardComponent
    ],
    providers: [
        NoticesApiService,
        CategoriesApiService,
        UsersApiService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: RequestRetryInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FontAwesomeModule,
        MaterialModule,
        FormsModule,
        HttpClientModule,
        AsyncPipe,
        MatPaginatorModule,
        AuthModule.forRoot({
            domain: environment.auth0Domain!,
            clientId: environment.auth0ClientId!,
            authorizationParams: {
                audience: environment.auth0Audience,
                redirect_uri: window.location.origin
            }
        }),
        BrowserAnimationsModule,
        StoreModule.forRoot({
            noticesState: noticesReducer,
            userState: usersReducer,
            categoriesState: categoriesReducer,
            conversationsState: conversationsReducer,
            signalr: signalrReducer
        }),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        EffectsModule.forRoot([
            NoticesEffects,
            AppEffects,
            UsersEffect,
            CategoriesEffects,
            ConversationsEffects,
            SignalREffects
        ]),
    ]
})
export class AppModule {

  constructor(library: FaIconLibrary) {
    library.addIcons(
      fasCashRegister,
      fasChessRook,
      fasCrow,
      fasArrowRightToBracket,
      fasBars,
      fasCoins,
      fasSackDollar,
      fasFeather,
      fasTrashCan,
      fasDove,
      fasAngleLeft,
      fasAngleRight,
      farMessage,
      fasCircle
    );
  }
 }
