import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ToastStatus = 'success' | 'error';

@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      position: fixed;
      bottom: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      animation: toast-in 250ms ease-out forwards;
    }
  `,
  template: `
    <div [class]="containerClass()">
      <span class="material-symbols-outlined text-[18px] leading-none">{{ icon() }}</span>
      <span class="text-label-md">{{ text() }}</span>
    </div>
  `,
})
export class ToastComponent {
  readonly status = input.required<ToastStatus>();
  readonly text = input.required<string>();

  readonly icon = computed(() => (this.status() === 'success' ? 'check_circle' : 'error'));

  readonly containerClass = computed(() => {
    const base =
      'flex items-center gap-2 px-4 py-3 rounded-full shadow-md whitespace-nowrap';
    return this.status() === 'success'
      ? `${base} bg-secondary-container text-on-secondary-container`
      : `${base} bg-error-container text-on-error-container`;
  });
}
