import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface StreamState {
    playing: boolean;
    readableCurrentTime: string;
    readableDuration: string;
    duration: number | undefined;
    currentTime: number | undefined;
    canplay: boolean;
    error: boolean;
  }
  
@Injectable({
  providedIn: 'root'
})
export class AudioService {

    private files: any = [
        // tslint:disable-next-line: max-line-length
            { url: 'https://ia801504.us.archive.org/3/items/EdSheeranPerfectOfficialMusicVideoListenVid.com/Ed_Sheeran_-_Perfect_Official_Music_Video%5BListenVid.com%5D.mp3', 
              name: 'Perfect',
              artist: ' Ed Sheeran'
            },
            {
        // tslint:disable-next-line: max-line-length
              url: 'https://ia801609.us.archive.org/16/items/nusratcollection_20170414_0953/Man%20Atkiya%20Beparwah%20De%20Naal%20Nusrat%20Fateh%20Ali%20Khan.mp3',
              name: 'Man Atkeya Beparwah',
              artist: 'Nusrat Fateh Ali Khan'
            },
            { url: 'https://ia801503.us.archive.org/15/items/TheBeatlesPennyLane_201805/The%20Beatles%20-%20Penny%20Lane.mp3',
              name: 'Penny Lane',
              artist: 'The Beatles'
            }
          ];
        
          getFiles() {
           return of(this.files);
          }

  private stop$ = new Subject();
  private audioObj = new Audio();
  audioEvents = [
    'ended', 'error', 'play', 'playing', 'pause', 'timeupdate', 'canplay', 'loadedmetadata', 'loadstart'
  ];
  private state: StreamState = {
    playing: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: undefined,
    currentTime: undefined,
    canplay: false,
    error: false,
  };

  private streamObservable(url: string) {
    return new Observable(observer => {
      // Play audio
      this.audioObj.src = url;
      this.audioObj.load();
      this.audioObj.play();
  
      const handler = (event: Event) => {
        this.updateStateEvents(event);
        observer.next(event);
      };
  
      this.addEvents(this.audioObj, this.audioEvents, handler);
      return () => {
        // Stop Playing
        this.audioObj.pause();
        this.audioObj.currentTime = 0;
        // remove event listeners
        this.removeEvents(this.audioObj, this.audioEvents, handler);
        // reset state
        this.resetState();
      };
    });
  }

  private addEvents(obj: HTMLAudioElement, events: any[], handler: (event: Event) => void) {
    events.forEach((event: any) => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj: HTMLAudioElement, events: any[], handler: (event: Event) => void) {
    events.forEach((event: any) => {
      obj.removeEventListener(event, handler);
    });
  }

  playStream(url: any) {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  play() {
    this.audioObj.play();
  }

  pause() {
    this.audioObj.pause();
  }

  stop() {
    this.stop$.next(null);
  }

  seekTo(seconds: number) {
    this.audioObj.currentTime = seconds;
  }

  formatTime(time: number, format: string = 'HH:mm:ss') {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(this.state);

  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case 'canplay':
        this.state.duration = this.audioObj.duration;
        this.state.readableDuration = this.formatTime(this.state.duration);
        this.state.canplay = true;
        break;
      case 'playing':
        this.state.playing = true;
        break;
      case 'pause':
        this.state.playing = false;
        break;
      case 'timeupdate':
        this.state.currentTime = this.audioObj.currentTime;
        this.state.readableCurrentTime = this.formatTime(this.state.currentTime);
        break;
      case 'error':
        this.resetState();
        this.state.error = true;
        break;
    }
    this.stateChange.next(this.state);
  }

  private resetState() {
    this.state = {
      playing: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: undefined,
      currentTime: undefined,
      canplay: false,
      error: false
    };
  }

  getState(): Observable<StreamState> {
    return this.stateChange.asObservable();
  }
}