//this component convert the expand button option to a string
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'custom-nde-expand-option-custom',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './nde-expand-option-custom.component.html',
  styleUrl: './nde-expand-option-custom.component.scss'
})
export class NdeExpandOptionCustomComponent {
  @Input() private hostComponent!: any;
  expandChecked!: boolean;
  ngOnInit() {
    console.log("host", this.hostComponent);
    this.expandChecked =
      this.hostComponent.isExpandMyResultsToggleChecked();
  }
  onExpandClick() {
    const checked = this.hostComponent.isExpandMyResultsToggleChecked();

    this.hostComponent.expandMyResultsToggleChange({
      checked: !checked
    } as any);
  }

}
