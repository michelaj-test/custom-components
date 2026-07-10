//this component create the dialog window for added permalink link
import { Component, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'custom-nde-custom-permalink-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDividerModule, 
    MatTooltipModule
  ],
  templateUrl: './nde-custom-permalink-dialog.component.html',
  styleUrl: './nde-custom-permalink-dialog.component.scss'
})
export class NdeCustomPermalinkDialogComponent {
  copied: boolean = false; 
  tooltipLabel = '';
  ariaLabel = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { permalink: string },
    private translate: TranslateService
  ) {}

  
  ngOnInit() {
    // Imposta i testi iniziali
    this.tooltipLabel = this.translate.instant('nui.permalink.button');
    this.ariaLabel = this.tooltipLabel;
  }

  copyPermalink() {
    const link = this.data?.permalink ?? '';
    if (!link) { return; }

    navigator.clipboard.writeText(link).then(() => {
      this.copied = true;
      // Aggiorna tooltip e aria-label con la chiave di successo
      this.tooltipLabel = this.translate.instant('nde.permalink.copiedTooltip');
      this.ariaLabel = this.tooltipLabel;

      // Reset dopo 10 secondi
      setTimeout(() => {
        this.copied = false;
        this.tooltipLabel = this.translate.instant('nui.permalink.button');
        this.ariaLabel = this.tooltipLabel;
      }, 10000);
    });
  }
}



