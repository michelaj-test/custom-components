// this component add custom header menu to mobile menu
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'custom-nde-main-menu-dialog-custom',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './nde-main-menu-dialog-custom.component.html',
  styleUrl: './nde-main-menu-dialog-custom.component.scss'
})
export class NdeMainMenuDialogCustomComponent {
  isOpen=false;
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  private observer: MutationObserver | null = null;

  ngAfterViewInit() {
    if (window.innerWidth < 600) {
      this.tryMoveComponent();
    }
  }

  private tryMoveComponent() {
    const targetClass = '.show-more-main-menu-out-wrapper';
    const target = document.querySelector(targetClass);

    if (target) {
      this.performMove(target);
    } else {
      // Se non c'è, osserviamo il body finché non appare il menu
      this.observer = new MutationObserver((mutations, obs) => {
        const lateTarget = document.querySelector(targetClass);
        if (lateTarget) {
          this.performMove(lateTarget);
          obs.disconnect(); // Smettiamo di osservare una volta fatto
        }
      });

      this.observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  private performMove(target: Element) {
    const dialogActions = target.querySelector('mat-dialog-actions');
    if (dialogActions) {
      this.renderer.insertBefore(target, this.el.nativeElement, dialogActions.nextSibling);
    }
  }

  ngOnDestroy() {
    // Pulizia per evitare memory leak
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
}
