import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
  effect,
} from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { UploadPhotoService, UploadPhotoStatus } from '../services/upload-photo.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { NotificationService } from '../services/notification.service';
import { LoadingSpinner } from './loading-spinner.component';
import { untracked } from '@angular/core/primitives/signals';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'photo-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-12" id="upload">
      <div
        class="bg-surface-bright/70 backdrop-blur-md border border-primary/30 rounded-xl p-8 md:p-12 text-center max-w-3xl mx-auto shadow-[0_4px_30px_rgba(138,163,153,0.1)]"
      >
        <span class="material-symbols-outlined text-5xl text-primary mb-4">photo_camera</span>
        <h2 class="text-headline-md text-primary mb-4 italic">Podziel się wspomnieniami</h2>
        <p class="text-body-md text-on-surface-variant mb-8 max-w-lg mx-auto">
          Zrób zdjęcie lub wybierz z urządzenia, aby dodać je do naszego wspólnego albumu.
        </p>

        @if (isUploading()) {
          <loading-spinner [label]="statusMessage()" />
        } @else {
          <div class="flex flex-col gap-4 items-center">
            <button
              (click)="captureWithCamera()"
              class="bg-secondary text-on-secondary text-body-md px-8 py-4 rounded-full hover:bg-opacity-90 transition-all flex items-center justify-center mx-auto space-x-2 min-w-[265px]"
            >
              <span class="material-symbols-outlined">add_a_photo</span>
              <span>Zrób zdjęcie</span>
            </button>

            <button
              (click)="pickFromGallery()"
              class="border border-secondary text-secondary text-body-md px-8 py-4 rounded-full hover:bg-secondary/10 transition-all flex items-center justify-center mx-auto space-x-2 min-w-[265px]"
            >
              <span class="material-symbols-outlined">upload</span>
              <span>Wybierz z urządzenia</span>
            </button>

            <a
              [routerLink]="['/gallery']"
              class="text-body-md text-secondary hover:underline text-center px-8 py-4"
              >Zobacz zdjęcia</a
            >
          </div>
        }
      </div>
    </section>
  `,
  imports: [LoadingSpinner, RouterLink],
})
export class PhotoUpload {
  private readonly _photoService = inject(PhotoService);
  private readonly _uploadPhotoService = inject(UploadPhotoService);
  private readonly _notificationService = inject(NotificationService);

  private readonly _photo = signal<File | null>(null);

  private readonly _uploadPhotoResource = rxResource({
    params: () => this._photo() ?? undefined,
    stream: ({ params: photo }) => this._uploadPhotoService.upload(photo),
  });

  readonly isUploading = computed(() => {
    const status = this._uploadPhotoResource.status();
    const value = this._uploadPhotoResource.value();

    return status === 'loading' || (status === 'resolved' && value !== 'complete');
  });

  readonly statusMessage = computed(() =>
    this._mapUploadStatusToMessage(this._uploadPhotoResource.value() ?? 'preparing'),
  );

  constructor() {
    effect(() => {
      const uploadPhotoStatus = this._uploadPhotoResource.status();

      untracked(() => {
        if (uploadPhotoStatus === 'error') {
          this._notificationService.show('error', 'Coś poszło nie tak');
        }

        if (uploadPhotoStatus === 'resolved' && this._uploadPhotoResource.value() === 'complete') {
          this._notificationService.show('success', 'Zdjęcie zostało wysłane');
        }
      });
    });
  }

  async captureWithCamera(): Promise<void> {
    this._photo.set(await this._photoService.captureWithCamera());
  }

  async pickFromGallery(): Promise<void> {
    this._photo.set(await this._photoService.pickFromGallery());
  }

  private _mapUploadStatusToMessage(status: UploadPhotoStatus): string | undefined {
    switch (status) {
      case 'preparing':
        return 'Przygotowanie...';
      case 'compressing':
        return 'Kompresowanie...';
      case 'uploading':
        return 'Wysyłanie...';
      case 'complete':
        return undefined;
    }
  }
}
