import { Component } from '@angular/core';
import { AlertController, NavController, ViewController } from 'ionic-angular';
import { AngularFire, FirebaseAuthState } from 'angularfire2';

@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html'
})

export class LogoutPage {
  //インスタンス
  username = '';
  email = '';
  maru_balance = null;
  coinAddress = '';
  private authState: FirebaseAuthState;


  constructor(public alertCtrl: AlertController, public navCtrl: NavController,
    public viewCtrl: ViewController,public angularFire: AngularFire) {
  }

  //ログアウト
  public logout() {
    this.viewCtrl.dismiss();
    this.username = '';
    this.email = '';
    this.maru_balance = null;
    this.coinAddress = '';
    console.log("logout");
    this.angularFire.auth.logout();
  }

  //サイドバーを閉じる
  public returntabs() {
    this.viewCtrl.dismiss();
  }

}
