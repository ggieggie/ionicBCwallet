import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams,AlertController, LoadingController, Loading } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Stripe } from '@ionic-native/stripe';

/**
 * Generated class for the ChargePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-charge',
  templateUrl: 'charge.html',
})
export class ChargePage {
  number: '4242424242424242';
  expMonth: 12;
  expYear: 2020;
  cvc: '220';
  amount: string;
  check_flg: boolean;
　date: string;
  y: number;

  cardinfo: any = {
    number: this.number,
    expMonth: this.expMonth,
    expYear: this.expYear,
    cvc: this.cvc
  };

  loading: Loading;
  myAddress = "";
  username = ""; //ユーザー名（firebase）
  QRary = [];
  send_info = "";
  //masterAddress = "1Zz3rAJ5mBTQepG5uJbkuvF79f3FaKvmyR7f3r";
  masterAddress = "1ZiouHt9c73iZfa6EiCyCNGGRvCEUzqPNxxXMU";


constructor(public navCtrl: NavController, public alertCtrl: AlertController, public viewCtrl: ViewController,
  public navParams: NavParams, public stripe: Stripe, public http: Http, private loadingCtrl: LoadingController) {
    this.getProfile();
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChargePage');
  }

  creditRegister() {
    this.showLoading();
    console.log('hogehoge');
    this.stripe.setPublishableKey('pk_live_ZMjJ6YRq7wyQgfsgBYR9fi5p'); //新コード
    //this.stripe.setPublishableKey('pk_test_ZR1Wpiz87qoXuxvy32h9XLtP'); //旧コード
    console.log('hogepiyo');
    console.log(this.cardinfo);
    this.stripe.createCardToken(this.cardinfo)
      .then(token => {
        console.log('createCardToken()起動');
        var myToken = token.id;
        console.log('myToken:' + myToken);
        console.log('pay()起動');
        this.pay(myToken);
        console.log('token:' + token);
      })
      .catch(error => {
        let alert = this.alertCtrl.create({
          title: 'error',
          subTitle: '登録失敗',
          buttons: ['OK']
          });
          this.loading.dismiss();
          this.viewCtrl.dismiss();
        alert.present();
        console.error('error1:' + error);
      });
  }

  pay(myToken) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    var options = new RequestOptions({ "headers": headers });
    var body = {
      "amount" : this.amount,
      "currency" : "JPY",
      "description" : this.username,
      "source" : myToken,
      "mode" : "0"
      //amount : this.amount,
      //currency : "JPY",
      //description : "Example charge_OR",
      //source : myToken
    }
    console.log('body.amount:' + body.amount);
    console.log('body.currency:' + body.currency);
    console.log('body.description:' + body.description);
    console.log('body.source:' + body.source);
    //this.http.post('https://demofunction001.azurewebsites.net/api/GenericWebhookJS4?code=kRXr4sOfrMDWEzynsDF6WRolC9W2VfofL/OKiPl/xDW4XMr8ahv2oA==&clientId=default', body, options) //旧コードazure
    //this.http.post('https://getstripe.azurewebsites.net/api/genericwebhookjs1?code=/mCqVyTguB8xLqJXEVw/zqMM1IPgbRKNUokaqZwvv9oyjbroIAA/7w==&clientId=default',body,options) //新コードaure
    this.http.post('https://qyelao1kqh.execute-api.us-west-2.amazonaws.com/prod/charge',body,options) //新コードaws
    .map(response => response.json())
    .subscribe(res => {
      console.log('res:' + res);
        let alert = this.alertCtrl.create({
          title: 'success',
          subTitle: 'チャージ完了',
          buttons: ['OK']
          });
          console.log('send_marucoin()起動');
          this.send_marucoin();
          this.loading.dismiss();
          this.viewCtrl.dismiss();
        alert.present();
     }, err => {
      console.log(err);// Error getting the data
      let alert = this.alertCtrl.create({
        title: 'error',
        subTitle: 'チャージ失敗',
        buttons: ['OK']
        });
        this.loading.dismiss();
        this.viewCtrl.dismiss();
      alert.present();
      console.error('error2:' + err);
    });
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

  //マルコインの送信 //stripe使用のためamountから3.6%を計算でカット
  send_marucoin(){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    //headers.append('Authorization', 'Basic bXVsdGljaGFpbnJwYzoyR2tXWjlnMjhYTDNBUHpXcGJVM0p4TmlYSHBSRWRmVTRmWTl1YXdYOWpoWg==');
    headers.append('Authorization', 'Basic bXVsdGljaGFpbnJwYzo4dGVoM2hoMm1UdFBSS29HeWtkQnptWDNlemtlR3AxNFVHS1RLd3h5TlpQQg==');
    var options = new RequestOptions({ "headers": headers });
    var body = {
     //"method"  : "sendfromaddress",
     //"params"  : [this.masterAddress, this.myAddress, {"marucoin":this.y}, this.send_info],
     "method"  : "sendwithdatafrom",
     "params"  : [this.masterAddress, this.myAddress, {"marucoin":this.y}, this.string_to_utf8_hex_string(this.send_info) ],
     "id"    : 0,
     "chain_name": "chain1"
    }
      //this.http.post("https://yqqc8r7eeh.execute-api.us-west-2.amazonaws.com/prod/ab", body, options)  //旧環境
      this.http.post("https://vdq0t1o9gf.execute-api.us-west-2.amazonaws.com/cafeneko_1", body, options)
      .map(response => response.json())
      .subscribe(result => {
        console.log("data: "+JSON.stringify(result));
       }, error => {
        console.log(error);// Error getting the data
      });
  }

  //コール元
  charge(){
  //ブラウザから構造体へコピー
    this.cardinfo.number = this.number;
    this.cardinfo.expMonth = this.expMonth;
    this.cardinfo.expYear = this.expYear;
    this.cardinfo.cvc = this.cvc;
  //boolean初期化
    this.check_flg = false;
  //チェック処理
    this.card_check();
    console.log("number:" + this.number);
    console.log("Month:" + this.expMonth);
    console.log("Year:" + this.expYear);
    console.log("cvc:" + this.cvc);
    console.log("amount:" + this.amount);
    if(this.check_flg == false){
    this.amount_check();
    }
    //コメントの作成
    this.y = Math.floor(+this.amount * 0.964);
    this.QRary[0] = 'charge';
    this.QRary[1] = '';
    this.QRary[2] = this.y;
    this.QRary[3] = '';
    this.QRary[4] = '';
    this.QRary[5] = '';
    var day = new Date();
    this.date = day.getFullYear() + "/" +  (Number(day.getMonth()) + 1).toString()  + "/"+ day.getDate()
                        + " " + day.getHours() + ":" + day.getMinutes() + ":" + day.getSeconds();
    this.QRary[6] = this.date;
    this.send_info = this.QRary.join(',');
  //最終確認＆チャージ処理
    if(this.check_flg == false){
      this.final_check();
    }else{
          }
  }

  //入力nullチェック
  //#桁チェック未実装です
  card_check(){
    if(this.number == null || this.expMonth == null || this.expYear == null || this.cvc == null ){
      this.check_flg = true;
      let alert = this.alertCtrl.create({
        title: 'error',
        subTitle: '入力に不備があります',
        buttons: ['OK']
      });
      alert.present();
    }else{
          }
  }

  //金額null,下限,上限チェック
  amount_check(){
    if(this.amount == null){
      this.check_flg = true;
      let alert = this.alertCtrl.create({
          title: 'error',
          subTitle: '金額が空白です',
          buttons: ['OK']
      });
      alert.present();
    }else{
      if(Number(this.amount) < 50 || Number(this.amount) > 10000){
        this.check_flg = true;
        let alert = this.alertCtrl.create({
          title: 'error',
          subTitle: '一度にチャージできる金額は50円以上〜10000円以下です',
          buttons: ['OK']
        });
        alert.present();
      }else{
      }
    }
  }

  //最終確認
  final_check(){
    let prompt2 = this.alertCtrl.create({
      title: '確認',
      message: this.amount+"円をチャージしますか？",
      buttons: [
        {
          text: 'キャンセル',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'チャージ',
          handler: data => {
            this.getProfile();
            this.creditRegister();
            console.log('charge clicked');
          }
        }
      ]
    });
    prompt2.present();
  }


  //情報取得
  public getProfile() {
    var user = firebase.auth().currentUser;
    this.username = user.displayName; //画面表示用ユーザー名
    this.myAddress = user.photoURL;
  }

  public return(){
    this.viewCtrl.dismiss();
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
}
