import { Component } from '@angular/core';
import { AlertController, NavController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})

export class AccountPage {
  //インスタンス
  username = '';
  email = '';
  iconId = '';
　coinAddress = '';

  constructor(public alertCtrl: AlertController, public navCtrl: NavController,
    public viewCtrl: ViewController) {
    this.getProfile();
  }

  //サイドバーを閉じる
  public returntabs() {
    this.viewCtrl.dismiss();
  }

  //情報取得
  public getProfile() {
    var user = firebase.auth().currentUser;
    this.username = user.displayName;
    this.email = user.email;
    this.coinAddress = user.photoURL;
    if(this.username.charAt(0).match(/[A-Za-z]/)){
      this.iconId = this.username.charAt(0)+".jpg";
    }else{
      this.iconId = "none.png";

    }
  }



}
