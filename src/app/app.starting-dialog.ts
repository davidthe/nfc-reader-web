import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogRef } from '@ngneat/dialog';

interface Data {
 title: string
}

@Component({
  template: `
    <h1>{{title}}</h1>
    <button (click)="ref.close(true)">Close</button>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartingDialogComponent {
  ref: DialogRef<Data> = inject(DialogRef);

  get title() {
    if (!this.ref.data) return 'Hello world';
    return this.ref.data.title;
  }
}
