import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AudioService } from './audio-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public translate: TranslateService,private audioService: AudioService ) {
    translate.addLangs(['en', 'ar', 'he']);
    translate.setDefaultLang('he');
    this.initAndstartScanNFC();
  }
  
  switchLang(lang: string) {
    this.translate.use(lang);
  }

  async initAndstartScanNFC(){

    try {
      if ('NDEFReader' in window) { 
        alert('starting nfc')
        const nfcPermissionStatus = await navigator.permissions.query({ name: "nfc" } as any);

        /* ... Scan NDEF Tags */ 


      const ndef = new NDEFReader();
      ndef.scan().then(() => {
        ndef.onreading = event => {
          console.log(event.serialNumber);
          console.log(event)
          this.audioService.getFiles().subscribe(files=>{
            const file = files[Math.floor(Math.random() * 3)];
            console.log(file.url);
  
            this.audioService.playStream(file.url) .subscribe(events => {
              // listening for fun here
            });
            this.audioService.pause();
            this.audioService.play();
          });
          
          // this.musicPlayerService.addTrack()
        };
      });
    
    }else{alert("window device dosent support nfc")}
      console.log("> Scan started");
    } catch (error) {
      console.log("Argh! " + error);
      alert("your device dosent support nfc")
    }
  }
}