import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './App-Shared/login/login.component';
import { SidebarComponent } from './App-Shared/sidebar/sidebar.component';
import { LayoutComponent } from './App-Shared/layout/layout.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireFunctionsModule,  FunctionsRegionToken } from '@angular/fire/functions';
import { MessagingService } from './Shared-Services/messaging.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxLoadingModule,ngxLoadingAnimationTypes  } from 'ngx-loading';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { 
          MatFormFieldModule,
          MatAutocompleteModule,
          MatButtonModule,
          MatBadgeModule,
          MatButtonToggleModule,
          MatCardModule,
          MatDatepickerModule,
          MatCheckboxModule,
          MatChipsModule,
          MatDialogModule,
          MatExpansionModule,
          MatGridListModule,
          MatIconModule,
          MatInputModule,
          MatListModule,
          MatMenuModule,
          MatNativeDateModule,
          MatPaginatorModule,
          MatProgressBarModule,
          MatProgressSpinnerModule,
          MatRadioModule,
          MatRippleModule,
          MatSelectModule,
          MatSidenavModule,
          MatSliderModule,
          MatSlideToggleModule,
          MatSnackBarModule,
          MatSortModule,
          MatTableModule,
          MatTabsModule,
          MatToolbarModule,
          MatTooltipModule,
          MatStepperModule,
        } from '@angular/material';

import { environment } from '../environments/environment';
import { UnauthorizedComponent } from './App-Shared/unauthorized/unauthorized.component';
import { ServiceWorkerModule } from '@angular/service-worker';




const firebaseUiAuthConfig: firebaseui.auth.Config =
      {
        signInFlow: 'popup',
        signInOptions: [
                          {
                            provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                            recaptchaParameters: {
                              type: 'image', // 'audio'
                              size: 'invisible', // 'invisible' or 'compact'
                              badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
                            },
                          defaultCountry: 'ZW', // Set default country to the United Kingdom (+44).
                          // For prefilling the national number, set defaultNationNumber.
                          // This will only be observed if only phone Auth provider is used since
                          // for multiple providers, the NASCAR screen will always render first
                          // with a 'sign in with phone number' button.
                          defaultNationalNumber: '',
                          // You can also pass the full phone number string instead of the
                          // 'defaultCountry' and 'defaultNationalNumber'. However, in this case,
                          // the first country ID that matches the country code will be used to
                          // populate the country selector. So for countries that share the same
                          // country code, the selected country may not be the expected one.
                          // In that case, pass the 'defaultCountry' instead to ensure the exact
                          // country is selected. The 'defaultCountry' and 'defaultNationaNumber'
                          // will always have higher priority than 'loginHint' which will be ignored
                          // in their favor. In this case, the default country will be 'GB' even
                          // though 'loginHint' specified the country code as '+1'.
                          loginHint: '',
                          // You can provide a 'whitelistedCountries' or 'blacklistedCountries' for
                          // countries to select. It takes an array of either ISO (alpha-2) or
                          // E164 (prefix with '+') formatted country codes. If 'defaultCountry' is
                          // not whitelisted or is blacklisted, the default country will be set to the
                          // first country available (alphabetical order). Notice that
                          // 'whitelistedCountries' and 'blacklistedCountries' cannot be specified
                          // at the same time.
                          whitelistedCountries: ['ZW', 'ZA']
                          
                        }
                       ],
        tosUrl: 'https://fir-ui-demo-84a6c.firebaseapp.com',
        privacyPolicyUrl: 'https://fir-ui-demo-84a6c.firebaseapp.com',
        credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM
      };

@NgModule({

  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    LayoutComponent,
    UnauthorizedComponent,

  ],
  imports: [
    AngularSvgIconModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatBadgeModule,
    AmazingTimePickerModule,
    MatIconModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    MatButtonModule, MatCheckboxModule,
    AngularFirestoreModule,
    AngularFireMessagingModule,
    AngularFireFunctionsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      backdropBackgroundColour: 'rgba(256,256,256,1)', 
      backdropBorderRadius: '4px',
      primaryColour: '#f44336', 
      secondaryColour: '#f44336', 
      tertiaryColour: '#f44336'
    }),
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    AngularFirestoreModule.enablePersistence(),
  //  ServiceWorkerModule.register('combined-worker.js', { enabled: environment.production })
  ],
  providers: [MessagingService],
  bootstrap: [AppComponent]
})
export class AppModule { }

@NgModule({
  imports: [
    AngularSvgIconModule,
    HttpClientModule,
    AmazingTimePickerModule,
          MatFormFieldModule,
          MatDatepickerModule,
          MatAutocompleteModule,
          MatButtonModule,
          MatButtonToggleModule,
          MatCardModule,
          MatCheckboxModule,
          MatChipsModule,
          MatDialogModule,
          MatExpansionModule,
          MatGridListModule,
          MatIconModule,
          MatInputModule,
          MatListModule,
          MatMenuModule,
          MatNativeDateModule,
          MatPaginatorModule,
          MatProgressBarModule,
          MatProgressSpinnerModule,
          MatRadioModule,
          MatRippleModule,
          MatSelectModule,
          MatSidenavModule,
          MatSliderModule,
          MatSlideToggleModule,
          MatSnackBarModule,
          MatSortModule,
          MatTableModule,
          MatTabsModule,
          MatToolbarModule,
          MatTooltipModule,
          MatStepperModule,
         
    ],

  exports: [
    AngularSvgIconModule,
    HttpClientModule,
          MatDatepickerModule,
          MatFormFieldModule, 
          MatAutocompleteModule,
          MatButtonModule,
          MatButtonToggleModule,
          MatCardModule,
          MatCheckboxModule,
          MatChipsModule,
          MatDialogModule,
          MatExpansionModule,
          MatGridListModule,
          MatIconModule,
          MatInputModule,
          MatListModule,
          MatMenuModule,
          MatNativeDateModule,
          MatPaginatorModule,
          MatProgressBarModule,
          MatProgressSpinnerModule,
          MatRadioModule,
          MatRippleModule,
          MatSelectModule,
          MatSidenavModule,
          MatSliderModule,
          MatSlideToggleModule,
          MatSnackBarModule,
          MatSortModule,
          MatTableModule,
          MatTabsModule,
          MatToolbarModule,
          MatTooltipModule,
          MatStepperModule,
  ],
  providers: [
    { provide: FunctionsRegionToken, useValue: 'us-central1' }
   ]
})
export class MaterialModule { }
