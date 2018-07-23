import { Component } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';
//import { SendPage } from '../send/send';
import { TopPage } from '../top/top';
import { Http, Headers, RequestOptions } from '@angular/http';


@Component({
  selector: 'page-log',
  templateUrl: 'log.html'
})

export class LogPage {
  logs = [];
  myAddress = "";
  transaction ="";
  loading: Loading;
  logsary = [[]];
  myLog = null;  //QR表示用

  constructor(public navCtrl: NavController,
     private loadingCtrl: LoadingController, public http: Http) {}

  get() {
    this.myLog = !this.myLog;
    this.getProfile();
    this.listTransactions();
  }

  decimal(s) {
    var result="";
    for(var i=0;i<s.length;i+=2){
      var h = (s.charCodeAt(i) + s.charCodeAt(i+1)).toString(10) ;
      result += h;
    }
    return result;
  }

  //履歴確認
  listTransactions(){
    this.logs = [];
    this.showLoading();
    var headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    //headers.append('Authorization', 'Basic bXVsdGljaGFpbnJwYzoyR2tXWjlnMjhYTDNBUHpXcGJVM0p4TmlYSHBSRWRmVTRmWTl1YXdYOWpoWg==');
    headers.append('Authorization', 'Basic bXVsdGljaGFpbnJwYzo4dGVoM2hoMm1UdFBSS29HeWtkQnptWDNlemtlR3AxNFVHS1RLd3h5TlpQQg==');
    var options = new RequestOptions({ "headers": headers });
    var body = {
      "method"  : "listaddresstransactions",
      "params"  : [this.myAddress],
      "id"    : 0,
      "chain_name": "chain1"
    }
     //this.http.post("https://yqqc8r7eeh.execute-api.us-west-2.amazonaws.com/prod/ab", body, options) //旧環境
     this.http.post("https://vdq0t1o9gf.execute-api.us-west-2.amazonaws.com/cafeneko_1", body, options)
      .map(response => response.json())
      .subscribe(result => {
        console.log("transactions: "+JSON.stringify(result));
        if(!JSON.stringify(result.result[1])) {
          console.log("no log");
        }else{
          for(var i = 0; i < result.result.length; i++) {
            if(JSON.stringify(result.result[i].balance.assets) == "[]" || JSON.stringify(result.result[i].balance.assets) == null){
              result.result.splice(i,1);
            }
              console.log("hairetu_no:"+i);
              console.log(JSON.stringify(result.result[i].balance.assets));
              console.log(JSON.stringify(result.result[i].comment));
              if(JSON.stringify(result.result[i].data) == "[]" || JSON.stringify(result.result[i].data) == null){
                //　旧実装（ver.1.2.4でのログ）・・・comment行（10進数）を取得
                this.logsary[i] = JSON.stringify(result.result[i].comment).replace( /"/g , "" ).split(',');
              }
              else{
                //新実装（ver.1.2.5でのログ）・・・data行（16進数）を取得して10進数に変換
                console.log(JSON.stringify(result.result[i].data[0]));
                console.log(this.utf8_hex_string_to_string(result.result[i].data[0]));
                this.logsary[i] = JSON.stringify(this.utf8_hex_string_to_string(result.result[i].data[0])).replace( /"/g , "" ).split(',');
              }
              console.log(this.logsary[i]);
          }
          this.logs = result.result;
          this.logsary.reverse();
          }
          this.loading.dismiss();
          },
          error => {
            console.log(error),// Error getting the data
            this.loading.dismiss();
          }
      );

  }

  //情報取得
  public getProfile() {
    var user = firebase.auth().currentUser;
    this.myAddress = user.photoURL;
  }

　public returntabs() {
      this.navCtrl.setRoot(TopPage);
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
