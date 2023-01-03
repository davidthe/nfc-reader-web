import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AudioService } from './audio-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isScanning = false;

  constructor(public translate: TranslateService,private audioService: AudioService , private snackBar: MatSnackBar) {
    translate.addLangs(['en', 'ar', 'he']);
    translate.setDefaultLang('he');
    // this.initAndstartScanNFC();
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }

  async start() {
    try {
      const ndef = new (window as any).NDEFReader();
      this.isScanning = true;
      await ndef.scan();
      this.notify("Scanning...");

      ndef.addEventListener("readingerror", () => {
        this.notify(`Error reading tag`);
      });

      ndef.addEventListener("reading", ({ message, serialNumber }: { message: any, serialNumber: string }) => {

        for (const record of message.records) {
          this.notify("Record id:    " + record.id);
          switch (record.recordType) {
            case "text":
              const textDecoder = new TextDecoder(record.encoding);
              this.notify(`Scanned: ${textDecoder.decode(record.data)}`);
              break;
            case "url":
              // TODO: Read URL record with record data.
              break;
            default:
            // TODO: Handle other records with record data.
          }
        }
      });
    } catch (error) {
      this.isScanning = false;
    }
  }

  notify(message: string) {
    this.snackBar.open(message, 'OK');
  }
}
