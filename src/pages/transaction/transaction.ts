import{Component, NgZone, ViewChild}from '@angular/core';
import {NavController, Content}from 'ionic-angular';

import { TextToSpeech } from '@ionic-native/text-to-speech';

declare var window;

@Component({
  selector: 'page-transaction',
  templateUrl: 'transaction.html'
})
export class TransactionPage {

  messages: any[]=[];
  text: string = "";
  @ViewChild(Content) content: Content;

// , public tts: TextToSpeech

  constructor(public navCtrl: NavController, public ngZone: NgZone) {
      this.messages.push({
        text: "やぁ、僕は開発中のAIです。何かご用かにゃ？",
        sender: "api"
      })
  }

  sendText(){
    let message = this.text;

    this.messages.push({
      text: message,
      sender: "me"
    });
    this.content.scrollToBottom(200);

    this.text = "";

    window["ApiAIPlugin"].requestText({
      query: message
    }, (response)=>{
      this.ngZone.run(()=>{
        this.messages.push({
          text: response.result.fulfillment.speech,
          sender: "api"
        });
        this.content.scrollToBottom(200);
      })
    }, (error)=> {
      alert(JSON.stringify(error))
    })
  }

  sendVoice(){
/*
    window["ApiAIPlugin"].requestVoice({},
      (response) => {
        this.tts.speak({
          text: response.result.fulfillment.speech,
          locale: "en-IN",
          rate: 1
        })
      }, (error) => {
        alert(error)
      }
    )
*/
  }

}
