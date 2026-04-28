import {
  Component,
  ChangeDetectionStrategy,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { UploadPhotoService } from '../services/upload-photo.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressBar } from './progress-bar.component';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'photo-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-12" id="upload">
      <div
        class="bg-surface-bright/70 backdrop-blur-md border border-primary/30 rounded-xl p-8 md:p-12 text-center max-w-3xl mx-auto shadow-[0_4px_30px_rgba(138,163,153,0.1)]"
      >
        <span
          class="material-symbols-outlined text-5xl text-primary mb-4"
          style="font-variation-settings: 'FILL' 0;"
          >photo_camera</span
        >
        <h2 class="text-headline-md text-primary mb-4 italic">Podziel się wspomnieniami</h2>
        <p class="text-body-md text-on-surface-variant mb-8 max-w-lg mx-auto">
          Zrób zdjęcie lub wybierz z urządzenia, aby dodać je do naszego wspólnego albumu.
        </p>

        @if (photo(); as _photo) {
          <div class="flex items-center space-x-2 text-label-md min-w-0 mb-4">
            <span class="material-symbols-outlined"> attachment </span>
            <span class="truncate flex-1 text-left">{{ _photo.name }}</span>
            @if (isIdle()) {
              <button class="text-error " (click)="removePhoto()">
                <span class="material-symbols-outlined "> close </span>
              </button>
            }
          </div>
          <div class="flex items-center justify-end">
            @if (isIdle()) {
              <button
                (click)="uploadPhoto()"
                class="bg-secondary text-on-secondary text-body-md px-4 py-2 rounded-full hover:bg-opacity-90 transition-all flex items-center justify-center space-x-2 "
              >
                <span class="material-symbols-outlined"> send </span>
                <span>Wyślij</span>
              </button>
            } @else {
              <progress-bar
                class="block flex-1"
                [status]="uploadStatus()"
                [progress]="uploadProgress() || 0"
              />
            }
          </div>
        } @else {
          <button
            (click)="captureWithCamera()"
            class="bg-secondary text-on-secondary text-body-md px-8 py-4 rounded-full hover:bg-opacity-90 transition-all flex items-center justify-center mx-auto space-x-2 min-w-[265px]"
          >
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;"
              >add_a_photo</span
            >
            <span>Zrób zdjęcie</span>
          </button>

          <button
            (click)="pickFromGallery()"
            class="border border-secondary text-secondary text-body-md px-8 py-4 rounded-full hover:bg-secondary/10 transition-all flex items-center justify-center mx-auto space-x-2 mt-4 min-w-[265px]"
          >
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;"
              >upload</span
            >
            <span>Wybierz z urządzenia</span>
          </button>
        }
      </div>
    </section>
  `,
  imports: [ProgressBar],
})
export class PhotoUpload {
  private readonly _photoService = inject(PhotoService);
  private readonly _uploadPhotoService = inject(UploadPhotoService);
  private readonly _notificationService = inject(NotificationService);
  private readonly _destroyRef = inject(DestroyRef);

  protected readonly photo = signal<File | null>(null);
  readonly uploadStatus = computed(() => this._uploadPhotoService.uploadProgress().status);
  readonly uploadProgress = computed(() => this._uploadPhotoService.uploadProgress().progress);
  readonly isIdle = computed(() => this.uploadStatus() === 'idle');

  async captureWithCamera(): Promise<void> {
    const photo = await this._photoService.captureWithCamera();
    if (photo) {
      this.photo.set(photo);
    }
  }

  async pickFromGallery(): Promise<void> {
    const photo = await this._photoService.pickFromGallery();
    if (photo) {
      this.photo.set(photo);
    }
  }

  removePhoto(): void {
    this.photo.set(null);
  }

  uploadPhoto(): void {
    const photo = this.photo();

    if (!photo) return;

    this._uploadPhotoService
      .upload(photo)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.photo.set(null);
          this._notificationService.show('success', 'Zdjęcie zostało wysłane');
        },
        error: () => {
          this._notificationService.show('error', 'Coś poszło nie tak');
        },
      });
  }
}
