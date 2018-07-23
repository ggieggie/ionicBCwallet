import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

import { TopPage } from '../pages/top/top';
//import { SendPage } from '../pages/send/send';
import { TransactionPage } from '../pages/transaction/transaction';
import { LogPage } from '../pages/log/log';
import { TabsPage } from '../pages/tabs/tabs';

import { ChargePage } from '../pages/charge/charge';
//import { ChargePageModule} from '../pages/charge/charge.module'
import { LoginPage } from '../pages/login/login';
import { LoginPageModule } from '../pages/login/login.module';
import { CreatePage } from '../pages/create/create';
import { CreatePageModule } from '../pages/create/create.module';

import { AccountPage } from '../pages/account/account';
//import { AccountPageModule } from '../pages/account/account.module';
import { SupportPage } from '../pages/support/support';
import { LogoutPage } from '../pages/logout/logout';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { Clipboard } from '@ionic-native/clipboard';

import { AngularFireModule, AuthMethods, AuthProviders } from 'angularfire2';
import { Firebase } from '@ionic-native/firebase';
import { Stripe } from '@ionic-native/stripe';

import { TextToSpeech } from '@ionic-native/text-to-speech';

export const firebaseConfig = {
    apiKey: "AIzaSyBUJKj1l1ruJKRoBUuaQFNhpqqkJYMpA6Y",
    authDomain: "cafeneko-or.firebaseapp.com",
    databaseURL: "https://cafeneko-or.firebaseio.com",
    projectId: "cafeneko-or",
    storageBucket: "cafeneko-or.appspot.com",
    messagingSenderId: "278424332193"
};

@NgModule({
  declarations: [
    MyApp,

    TopPage,
    //SendPage,
    TransactionPage,
    LogPage,
    TabsPage,

    AccountPage,
    ChargePage,
    SupportPage,
    LogoutPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig,{
      provider: AuthProviders.Password,
      method: AuthMethods.Password
    }),
    LoginPageModule,
    //ChargePageModule,
    CreatePageModule,
    NgxQRCodeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

    TopPage,
    //SendPage,
    TransactionPage,
    LogPage,
    TabsPage,

    LoginPage,
    CreatePage,

    AccountPage,
    ChargePage,
    SupportPage,
    LogoutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Firebase,
    BarcodeScanner,
    Clipboard,
    Stripe
  ]
})
export class AppModule {}
