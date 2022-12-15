import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AudioService } from './audio-service.service';
declare  var jQuery:  any;
declare var NDEFReader: any;
declare var navigator: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public translate: TranslateService,private audioService: AudioService ) {
    translate.addLangs(['en', 'ar', 'he']);
    translate.setDefaultLang('he');
    // this.initAndstartScanNFC();

    (function ($) {
      $(document).ready(async function(){
        try {
          const ndef = new NDEFReader();
          await ndef.scan();
      
          ndef.addEventListener("readingerror", () => {
          });
      
          ndef.addEventListener("reading", (a: any) => {
            alert(a)
            alert("not playing music")
          });
        } catch (error) {
          alert("error starting "+ error)
        }
      });
    })(jQuery);
  }
  
  switchLang(lang: string) {
    this.translate.use(lang);
  }

  async initAndstartScanNFC(){

    try {
      if ('NDEFReader' in window) { 
        alert('starting nfc')

        navigator.permissions.query({ name: "nfc" } as any).then((permissionStatus: any) => {
          alert(`NFC user permission: ${permissionStatus.state}`);
          permissionStatus.onchange = () => {
            alert(`NFC user permission changed: ${permissionStatus.state}`);
          };
        });

        /* ... Scan NDEF Tags */ 
        try {
          const ndef = new NDEFReader();
          await ndef.scan();
          alert("> Scan started");
      
          ndef.addEventListener("readingerror", () => {
            alert("Argh! Cannot read data from the NFC tag. Try another one?");
          });
      
          ndef.addEventListener("reading", (a: any) => {
            alert('reading');
            alert(a);
            this.audioService.getFiles().subscribe(files=>{
              const file = files[Math.floor(Math.random() * 3)];
              console.log(file.url);
    
              this.audioService.playStream(file.url) .subscribe(events => {
                // listening for fun here
              });
              this.audioService.pause();
              this.audioService.play();
            });
          });
        } catch (error) {
          alert("Argh! " + error);
        }

      // const ndef = new NDEFReader();
      // ndef.scan().then(() => {
      //   ndef.onreading = event => {
      //     console.log(event.serialNumber);
      //     console.log(event)
         
          
      //     // this.musicPlayerService.addTrack()
      //   };
      // });
    
    }else{alert("window device dosent support nfc")}
      console.log("> Scan started");
    } catch (error) {
      console.log("Argh! " + error);
      alert("your device dosent support nfc")
    }
  }
}