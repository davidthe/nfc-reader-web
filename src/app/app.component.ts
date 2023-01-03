import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogService } from '@ngneat/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Accessibility } from 'accessibility';
import { StartingDialogComponent } from './app.starting-dialog';
import { AudioService } from './audio-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isScanning = false;
  private dialog = inject(DialogService);

  constructor(
    public translate: TranslateService,
    private audioService: AudioService ,
    private snackBar: MatSnackBar,
    ) {
    translate.addLangs(['en', 'ar', 'he']);
    translate.setDefaultLang('he');
    window.addEventListener('load', function() { new Accessibility(); }, false);

    translate.get('please make sure to give permission for NFC scanning').subscribe((res: string) => {
      const dialogRef = this.dialog.open(StartingDialogComponent, {
        // data is typed based on the passed generic
        data: {
          title: res,
        },
      });

      dialogRef.afterClosed$.subscribe((result) => {
        this.start();
      });
    });


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
        //todo make logic here

        this.playMusic();
      });
    } catch (error) {
      this.isScanning = false;
    }
  }

  private playMusic(){
    this.audioService.getFiles().subscribe(files => {
      const file = files[0];
      console.log(file.url);

      this.audioService.playStream(file.url).subscribe(events => {
        // listening for fun here
      });
      this.audioService.pause();
      this.audioService.play();

    });
  }

  notify(message: string) {
    this.snackBar.open(message, 'OK', {duration: 2000});
  }
}
