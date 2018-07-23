import { Component } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AlertController, NavController, ModalController, LoadingController, Loading } from 'ionic-angular';
import { AngularFire, FirebaseAuthState } from 'angularfire2';
import 'rxjs/add/operator/map';
import { Stripe } from '@ionic-native/stripe';
import { Clipboard } from '@ionic-native/clipboard';
import { LoginPage } from '../login/login';
import { ChargePage } from '../charge/charge';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
/**
 * Generated class for the TopPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-top',
  templateUrl: 'top.html',
  providers: [AngularFire]
})
export class TopPage {

  //インスタンス
  username = ''; //ユーザー名（firebase）
  email = '';  //email(firebase)(つかってない)
  coinAddress = ''; //ブロックチェーンアドレス（firebase）
  maru_balance = null; //保持コイン量（multi-chain）
  yourAddress = null; //送金相手のアドレス
  send_amount = 0;　 //送金する金額
  send_info = '';   //送金トランザクションに記述する追加情報
  QRstr = '';     //構造体QR読み取り用
  QRary = [];　//構造体QR読み取り用
  myQR = null;  //QR表示用
  myQRary = '';  //QR表示用のary(to String)データ
  loading: Loading; //ローディング用
  private authState: FirebaseAuthState; //farebase用
  check_flg: boolean;　//バリデーションチェック用
　date: string; //日付
　yourname_temp: string;

  //コンストラクタ
  constructor(public navCtrl: NavController, public http: Http, public stripe: Stripe,
    public angularFire: AngularFire, public modalCtrl: ModalController,
    public barcodeScanner: BarcodeScanner, public alertCtrl: AlertController,
    private loadingCtrl: LoadingController, private clipboard: Clipboard) {
      console.log("topPage constructor");
      //認証処理
      angularFire.auth.subscribe((state : FirebaseAuthState) => {
        this.authState = state;
        console.log("check state");
        if(this.authState != null) {        // 認証情報がnullでない場合（認証できている場合）
          console.log('already logined');
          if(this.maru_balance == null){
            this.getProfile();  //farebaseからユーザ情報を取得
            this.getMarubalance(); //multi-cainからコイン保持量を取得
            this.myQRary = "human," + this.coinAddress +　",0,99,," + this.username;      //レコード構成：処理区分,アドレス,金額,商品コード,相手名,自分名
          }
        } else {                            // 認証情報がnullの場合（認証できていない場合）
          console.log('to loginPage');
          let loginModal = this.modalCtrl.create(LoginPage,{},{"enableBackdropDismiss":false});
          loginModal.present();
        }
    });
  }

  //リロード
  reload(){
    this.getProfile();
    this.reloadGetMarubalance();
    var day = new Date();
    console.log('date:'+day);
  }

  //コイン量の取得
  getMarubalance() {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    //headers.append('Authorization', 'Basic bXVsdGljaGFpbnJwYzoyR2tXWjlnMjhYTDNBUHpXcGJVM0p4TmlYSHBSRWRmVTRmWTl1YXdYOWpoWg==');
    headers.append('Authorization', 'Basic bXVsdGljaGFpbnJwYzo4dGVoM2hoMm1UdFBSS29HeWtkQnptWDNlemtlR3AxNFVHS1RLd3h5TlpQQg==');
    var options = new RequestOptions({ "headers": headers });
    var body = {
      method  : "getaddressbalances",
      params  : [this.coinAddress],
      id    : 0,
      chain_name: "chain1"
    }
    //this.http.post("https://yqqc8r7eeh.execute-api.us-west-2.amazonaws.com/prod/ab", body, options)  //旧環境
    this.http.post("https://vdq0t1o9gf.execute-api.us-west-2.amazonaws.com/cafeneko_1", body, options)　//新環境
      .map(response => response.json())
      .subscribe(result => {
        //console.log("data: "+JSON.stringify(result));
        if(JSON.stringify(result.result) == "null" || JSON.stringify(result.result) == "[]"){
          console.log("no balance");
          this.maru_balance = 0;
        }else{
        console.log("qty: "+JSON.stringify(result.result[0].qty));
        this.maru_balance = JSON.stringify(result.result[0].qty);
        }
       }, error => {
        console.log(error);// Error getting the data
      });
  }

  //リロード表示&コイン量の取得
  reloadGetMarubalance() {
    this.showLoading();
    this.maru_balance = null;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    //headers.append('Authorization', 'Basic bXVsdGljaGFpbnJwYzoyR2tXWjlnMjhYTDNBUHpXcGJVM0p4TmlYSHBSRWRmVTRmWTl1YXdYOWpoWg==');
    headers.append('Authorization', 'Basic bXVsdGljaGFpbnJwYzo4dGVoM2hoMm1UdFBSS29HeWtkQnptWDNlemtlR3AxNFVHS1RLd3h5TlpQQg==');
    var options = new RequestOptions({ "headers": headers });
    var body = {
      method  : "getaddressbalances",
      params  : [this.coinAddress],
      id    : 0,
      chain_name: "chain1"
    }
      //this.http.post("https://yqqc8r7eeh.execute-api.us-west-2.amazonaws.com/prod/ab", body, options)  //旧環境
      this.http.post("https://vdq0t1o9gf.execute-api.us-west-2.amazonaws.com/cafeneko_1", body, options)
      .map(response => response.json())
      .subscribe(result => {
        console.log("data: "+JSON.stringify(result));
        if(JSON.stringify(result.result) == "null" || JSON.stringify(result.result) == "[]"){
          console.log("no balance");
          console.log(result);
          this.maru_balance = 0;
        }else{
        console.log("name: "+JSON.stringify(result.result[0].name));
        console.log("qty: "+JSON.stringify(result.result[0].qty));
        this.maru_balance = JSON.stringify(result.result[0].qty);
        }
        this.loading.dismiss();
        }, error => {
        console.log(error);// Error getting the data
        this.loading.dismiss();
      });
  }

  //ログアウト
  public logout() {
    this.username = '';
    this.email = '';
    this.maru_balance = null;
    this.coinAddress = '';
    console.log("logout");
    this.angularFire.auth.logout();
  }

  //ユーザー情報取得
  public getProfile() {
    var user = firebase.auth().currentUser;
    this.username = user.displayName; //画面表示用ユーザー名
    this.coinAddress = user.photoURL; //ブロックチェーンアドレス（farebase保存側）
    this.myQRary = "human," + this.coinAddress +　",0,,," + this.username;      //レコード構成：処理区分,アドレス,金額,商品コード,相手名,自分名
    console.log("user:" + user.displayName);
    console.log("coinAddress:" + this.coinAddress);
    console.log("myQRary:" + this.myQRary);
  }

  //ローディング表示
  showLoading() {
    if(this.loading){
      this.loading.dismiss();
    }
    this.loading = this.loadingCtrl.create({
      content: 'now loading',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  //QRコード表示切り替え判定
  showmyQR() {
    this.myQR = !this.myQR;
  }

  //QRをスキャンしてカフェ購入/送金/チャージを行う
  scanQR() {
    this.barcodeScanner.scan().then(barcodeData => {
      //QRレコードの取得
      this.QRstr = barcodeData.text;
      this.QRary = this.QRstr.split(',');
      //ログ
      console.log('mode:' + this.QRary[0]);
      console.log('address:' + this.QRary[1]);
      console.log('amount:' + this.QRary[2]);
      console.log('product:' + this.QRary[3]);
      console.log('you:' + this.QRary[4]);
      console.log('me:' + this.QRary[5]);
      //処理区分の判定
      if(this.coinAddress == this.QRary[1]){
        let alert = this.alertCtrl.create({
          title: 'error',
          subTitle: '自分には送信できません',
          buttons: ['OK']
        });
      alert.present();
      }
      else if(this.QRary[0] == 'cafe'){ //カフェ購入の場合
        this.proc_cafe();
      }
      else if(this.QRary[0] == 'human'){ //人へ送金の場合
        this.proc_human();
      }
      else{
        let alert = this.alertCtrl.create({
          title: 'error',
          subTitle: 'QRコードが不正です',
          buttons: ['OK']
        });
        alert.present();
      }
    }, (err) => {
        console.log('Error: ', err);
    });
  }

  //カフェへ送金する（処理区分：cafeの時のプロシージャ）
  proc_cafe() {
    //値の設定
    this.yourAddress = this.QRary[1]; //送金先：カフェ店のアドレスをセット
    this.send_amount = Number(this.QRary[2]); //金額 ：商品の金額をセット
    //コメントの作成
    this.QRary[2] = this.send_amount*-1;
    this.QRary[4] = '＊＊＊＊＊＊';
    var day = new Date();
    this.date = day.getFullYear() + "/" +  (Number(day.getMonth()) + 1).toString()  + "/"+ day.getDate()
              + " " + day.getHours() + ":" + day.getMinutes() + ":" + day.getSeconds();
    this.QRary[6] = this.date;
    this.send_info = this.QRary.join(',');
/*
        let alert = this.alertCtrl.create({
          title: 'デバッグ',
          subTitle: this.coinAddress+','+this.yourAddress+','+ this.send_amount+','+this.send_info,
          buttons: ['OK']
        });
        alert.present();
*/
    //バリデーションチェック
    this.check_main();
    //最終確認＆送金
    if(this.check_flg == false){
      this.cafe_confirmation(); //カフェ購入の最終確認
    }else{
    }
  }

  //バリデーションチェックのmain
  check_main(){
    //判定値を初期化
    this.check_flg = false;
    //チェック処理
    this.amount_check();
    if(this.check_flg == false){
      if(this.maru_balance == null){
        this.getMarubalance();
      }
      this.wallet_check();
    }
  }

  //金額null,下限チェック
  amount_check(){
    if(this.send_amount == null || this.send_amount == 0){
      this.check_flg = true;
      let alert = this.alertCtrl.create({
          title: 'error',
          subTitle: '金額が不正です',
          buttons: ['OK']
      });
      alert.present();
    }else{
      if(this.send_amount < 0){
        this.check_flg = true;
        let alert = this.alertCtrl.create({
          title: 'error',
          subTitle: '金額が不正です',
          buttons: ['OK']
        });
        alert.present();
      }else{
      }
    }
  }

  //所持金チェック
  wallet_check(){
    if(this.send_amount > this.maru_balance){
      this.check_flg = true;
      let alert = this.alertCtrl.create({
          title: 'error',
          subTitle: 'コインが不足しています'+this.send_amount+this.maru_balance,
          buttons: ['OK']
      });
      alert.present();
    }else{
    }
  }

  //カフェ購入の確認
  cafe_confirmation(){
    let prompt = this.alertCtrl.create({
      title: 'カフェを購入',
      message: this.QRary[3] + "(" + this.send_amount + "CFC)を購入しますか？",
      buttons: [
        {
          text: 'キャンセル',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '購入',
          handler: data => {
            if(this.coinAddress == this.yourAddress){
              let alert = this.alertCtrl.create({
                title: 'error',
                subTitle: '自分には送信できません',
                buttons: ['OK']
                });
              alert.present();
            }else{
              this.send_marucoin();
              console.log('Saved clicked');
            }
          }
        }
      ]
    });
    prompt.present();
  }

  hex(s) {
    var result="";
    for(var i=0;i<s.length;++i){
      var h = ("0"+s.charCodeAt(i).toString(16)).substr(-2);
      result += h;
    }
    return result;
  }


  //コインを送信
  send_marucoin(){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json' );
    //headers.append('Authorization', 'Basic bXVsdGljaGFpbnJwYzoyR2tXWjlnMjhYTDNBUHpXcGJVM0p4TmlYSHBSRWRmVTRmWTl1YXdYOWpoWg==');
    headers.append('Authorization', 'Basic bXVsdGljaGFpbnJwYzo4dGVoM2hoMm1UdFBSS29HeWtkQnptWDNlemtlR3AxNFVHS1RLd3h5TlpQQg==');
        var options = new RequestOptions({ "headers": headers });
        var body = {
         "method"  : "sendwithdatafrom",
         "params"  : [this.coinAddress, this.yourAddress, {"marucoin":Number(this.send_amount)}, this.string_to_utf8_hex_string(this.send_info) ],
         "id"    : 0,
         "chain_name": "chain1"
        }
          //this.http.post("https://yqqc8r7eeh.execute-api.us-west-2.amazonaws.com/prod/ab", body, options)  //旧環境
          this.http.post("https://vdq0t1o9gf.execute-api.us-west-2.amazonaws.com/cafeneko_1", body, options)  //新環境
          .map(response => response.json())
          .subscribe(result => {
            console.log("data: "+JSON.stringify(result));
            this.yourAddress = null;
            //
            let alert = this.alertCtrl.create({
              title: '送金完了',
              subTitle: '＼(^o^)／ご利用ありがとうございます。',
              buttons: ['OK']
            });
            alert.present();
           }, error => {
            console.log(error);// Error getting the data
            this.yourAddress = null;
          });
  }　

  //人へ送金する（処理区分：humanの時のプロシージャ）
  proc_human(){
    let prompt = this.alertCtrl.create({
      title:  this.QRary[5] + 'に送金',
      message: "金額を入力してください",
      inputs: [
        {
          name: 'input_amount',
          type: 'number',
          placeholder: '金額'
        },
      ],
      buttons: [
        {
          text: 'キャンセル',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '送金',
          handler: data => {
            //値の設定
            this.send_amount = Number(data.input_amount);
            this.yourAddress = this.QRary[1]; //送金先：送金相手のアドレスをセット
            //コメントの作成
            this.QRary[2] = this.send_amount*-1
            this.QRary[4] = '＊＊＊＊＊＊';
            this.yourname_temp = this.QRary[5];
            this.QRary[5] = '＊＊＊＊＊＊';
            var day = new Date();
            this.date = day.getFullYear() + "/" +  (Number(day.getMonth()) + 1).toString()  + "/"+ day.getDate()
                        + " " + day.getHours() + ":" + day.getMinutes() + ":" + day.getSeconds();
            this.QRary[6] = this.date;
            this.send_info = this.QRary.join(',');;
            //バリデーションチェック
            this.check_main();
            //最終確認＆送金
            if(this.check_flg == false){
              this.send_confirmation(); //送金の最終確認
            }else{
            }
          }
        }
      ]
    });
    prompt.present();
  }

  //送金の確認
  send_confirmation(){
    let prompt = this.alertCtrl.create({
      title: '確認',
      message: this.yourname_temp + "に" + this.send_amount + "CFCを送金しますか？",
      buttons: [
        {
          text: 'キャンセル',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '送金',
          handler: data => {
            this.send_marucoin();
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  //ブロックチェーンアドレスのコピー
  public copy(){
    this.clipboard.copy(this.coinAddress);
    let alert = this.alertCtrl.create({
      title: 'クリップボード',
      subTitle: 'アドレスをコピーしました',
      buttons: ['OK']
      });
    alert.present();
  }

  //指定口座に送金するプロンプト
  scanTXT(){
    let prompt = this.alertCtrl.create({
      title: 'このアドレスに送金',
      message: "入力してください",
      inputs: [
        {
          name: 'yourAddress',
          type: 'text',
          placeholder: 'アドレス'
        },
        {
          name: 'input_amount',
          type: 'number',
          placeholder: '金額'
        },
      ],
      buttons: [
        {
          text: 'キャンセル',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '送金',
          handler: data => {
            this.yourAddress = data.yourAddress;
            this.send_amount = Number(data.input_amount);
            //処理区分の判定
            if(this.coinAddress == this.yourAddress){
              let alert = this.alertCtrl.create({
                title: 'error',
                subTitle: '自分には送信できません',
                buttons: ['OK']
              });
              alert.present();
            }
            //コメントの作成
            this.QRary[0] = 'human';
            this.QRary[1] = this.yourAddress;
            this.QRary[2] = this.send_amount*-1;
            this.QRary[3] = '';
            this.QRary[4] = '＊＊＊＊＊＊';
            this.QRary[5] = '＊＊＊＊＊＊';
            var day = new Date();
            this.date = day.getFullYear() + "/" +  (Number(day.getMonth()) + 1).toString()  + "/"+ day.getDate()
                        + " " + day.getHours() + ":" + day.getMinutes() + ":" + day.getSeconds();
            this.QRary[6] = this.date;
            this.send_info = this.QRary.join(',');;
            //バリデーションチェック
            this.check_main();
            //最終確認＆送金
            if(this.check_flg == false){
              this.send_confirmation(); //送金の最終確認
            }else{
            }
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

    //10,16変換-------

    // 文字列をUTF8の16進文字列に変換
    string_to_utf8_hex_string	(text)
    {
    	var bytes1 = this.string_to_utf8_bytes(text);
    	var hex_str1 = this.bytes_to_hex_string(bytes1);
    	return hex_str1;
    }


    // UTF8の16進文字列を文字列に変換
    utf8_hex_string_to_string	(hex_str1)
    {
    	var bytes2 = this.hex_string_to_bytes(hex_str1);
    	var str2 = this.utf8_bytes_to_string(bytes2);
    	return str2;
    }



    // 文字列をUTF8のバイト配列に変換
    string_to_utf8_bytes	(text)
    {
        var result = [];
        if (text == null)
            return result;
        for (var i = 0; i < text.length; i++) {
            var c = text.charCodeAt(i);
            if (c <= 0x7f) {
                result.push(c);
            } else if (c <= 0x07ff) {
                result.push(((c >> 6) & 0x1F) | 0xC0);
                result.push((c & 0x3F) | 0x80);
            } else {
                result.push(((c >> 12) & 0x0F) | 0xE0);
                result.push(((c >> 6) & 0x3F) | 0x80);
                result.push((c & 0x3F) | 0x80);
            }
        }
        return result;
    }

    // バイト値を16進文字列に変換
    byte_to_hex	(byte_num)
    {
    	var digits = (byte_num).toString(16);
        if (byte_num < 16) return '0' + digits;
        return digits;
    }

    // バイト配列を16進文字列に変換
    bytes_to_hex_string		(bytes)
    {
    	var	result = "";

    	for (var i = 0; i < bytes.length; i++) {
    		result += this.byte_to_hex(bytes[i]);
    	}
    	return result;
    }

    // 16進文字列をバイト値に変換
    hex_to_byte		(hex_str)
    {
    	return parseInt(hex_str, 16);
    }

    // バイト配列を16進文字列に変換
    hex_string_to_bytes		(hex_str)
    {
    	var	result = [];

    	for (var i = 0; i < hex_str.length; i+=2) {
    		result.push(this.hex_to_byte(hex_str.substr(i,2)));
    	}
    	return result;
    }

    // UTF8のバイト配列を文字列に変換
    utf8_bytes_to_string	(arr)
    {
        if (arr == null)
            return null;
        var result = "";
        var i;
        while (i = arr.shift()) {
            if (i <= 0x7f) {
                result += String.fromCharCode(i);
            } else if (i <= 0xdf) {
                var c = ((i&0x1f)<<6);
                c += arr.shift()&0x3f;
                result += String.fromCharCode(c);
            } else if (i <= 0xe0) {
                var c = ((arr.shift()&0x1f)<<6)|0x0800;
                c += arr.shift()&0x3f;
                result += String.fromCharCode(c);
            } else {
                var c = ((i&0x0f)<<12);
                c += (arr.shift()&0x3f)<<6;
                c += arr.shift() & 0x3f;
                result += String.fromCharCode(c);
            }
        }
        return result;
    }
//end of code
}
