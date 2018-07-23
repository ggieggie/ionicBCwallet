import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, ToastController,AlertController,Alert } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { TabsPage } from '../pages/tabs/tabs';
import { AccountPage } from '../pages/account/account';
import { SupportPage } from '../pages/support/support';
import { LogoutPage } from '../pages/logout/logout';

import { TransactionPage } from '../pages/transaction/transaction';
import { ChargePage } from '../pages/charge/charge';
//import { TopPage } from '../pages/top/top';
//import { TutorialPage } from '../pages/tutorial/tutorial';
import { ModalController } from 'ionic-angular';

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
  }

import { SplashScreen } from '@ionic-native/splash-screen';

declare var window;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  alert: Alert;
  platform: Platform;
  @ViewChild(Nav) navCtrl: Nav;
   rootPage:any = TabsPage;

   appPages: PageInterface[] = [
    { title: 'アカウント情報', name: 'AccountPage', component: AccountPage, icon: 'person' },
    { title: 'チャージ', name: 'ChargePage', component: ChargePage, icon: 'cash'  },
    { title: '各種設定', name: 'SupportPage', component: SupportPage, icon: 'information-circle'  },
    { title: 'ログアウト', name: 'LogoutPage', component: LogoutPage, icon: 'information-circle'  },
  ];


  constructor(platform: Platform, statusBar: StatusBar,
    private toastCtrl: ToastController, private alertCtrl: AlertController, public modalCtrl: ModalController) {
     this.platform = platform;
     platform.ready().then(() => {
       platform.registerBackButtonAction(() => {
         if(this.alert){
           this.alert.dismiss();
           this.alert =null;
         }else{
           this.showAlert();
         }
       });
       // Okay, so the platform is ready and our plugins are available.
       // Here you can do any higher level native things you might need.
        statusBar.styleDefault();

        window["ApiAIPlugin"].init(
          {
            clientAccessToken: "daf2adce73b84ea8b7660605863735e3", // insert your client access key here
            lang: "en" // set lang tag from list of supported languages
          },
          function(result) {
            alert("開発中のモデルです")
          },
          function(error) { /* error processing */ }
        );

     });
   }

   showAlert() {
     this.alert = this.alertCtrl.create({
       title: 'Exit?',
       message: 'Do you want to exit the app?',
       buttons: [
         {
           text: 'Cancel',
           role: 'cancel',
           handler: () => {
             this.alert =null;
           }
         },
         {
           text: 'Exit',
           handler: () => {
             this.platform.exitApp();
           }
         }
       ]
     });
     this.alert.present();
   }

   showToast() {
     let toast = this.toastCtrl.create({
       message: 'Press Again to exit',
       duration: 2000,
       position: 'bottom'
     });

     toast.onDidDismiss(() => {
       console.log('Dismissed toast');
     });

     toast.present();
   }

   openPage(page: PageInterface) {
     let params = {};

     // the nav component was found using @ViewChild(Nav)
     // setRoot on the nav to remove previous pages and only have this page
     // we wouldn't want the back button to show in this scenario
     if (page.index) {
       params = { tabIndex: page.index };
     }

     // If we are already on tabs just change the selected tab
     // don't setRoot again, this maintains the history stack of the
     // tabs even if changing them from the menu
     if (this.navCtrl.getActiveChildNavs().length && page.index != undefined) {
       this.navCtrl.getActiveChildNavs()[0].select(page.index);
     // Set the root of the nav with params if it's a tab index
   } else {
       this.navCtrl.setRoot(page.name, params).catch((err: any) => {
         console.log(`Didn't set nav root: ${err}`);
       });
     }

   }


   openAccount() {
     let loginModal = this.modalCtrl.create(AccountPage,{},{"enableBackdropDismiss":false});
     loginModal.present();  }

   openSupport() {
     let loginModal = this.modalCtrl.create(SupportPage,{},{"enableBackdropDismiss":false});
     loginModal.present();  }

   openCharge() {
     let loginModal = this.modalCtrl.create(ChargePage,{},{"enableBackdropDismiss":false});
     loginModal.present();  }

   openLogout() {
     let loginModal = this.modalCtrl.create(LogoutPage,{},{"enableBackdropDismiss":false});
     loginModal.present();  }

   isActive(page: PageInterface) {
     let childNav = this.navCtrl.getActiveChildNavs()[0];

     // Tabs are a special case because they have their own navigation
     if (childNav) {
       if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
         return 'primary';
       }
       return;
     }

     if (this.navCtrl.getActive() && this.navCtrl.getActive().name === page.name) {
       return 'primary';
     }
     return;
   }

 }

