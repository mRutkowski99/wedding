import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="text-label-sm text-center mb-1">{{ statusLabel() }} ({{ progress() }}%)</div>
    <div class="w-full h-2 bg-primary/20 rounded-full">
      <div class="h-full bg-primary rounded-full" [style.width.%]="progress()"></div>
    </div>
  `,
})
export class ProgressBar {
  readonly status = input.required<'idle' | 'compressing' | 'uploading'>();
  readonly progress = input.required<number>();

  readonly statusLabel = computed(() => {
    if (this.status() === 'compressing') return 'Kompresowanie';
    if (this.status() === 'uploading') return 'Wysyłanie';

    return '';
  });
}
