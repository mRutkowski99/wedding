import { Injectable, signal } from '@angular/core';
import type { GalleryPhoto } from '../models/gallery-photo';

const STORAGE_KEY = 'wedding-pending-photos';

@Injectable({ providedIn: 'root' })
export class PendingGalleryPhotosService {
  private readonly _pending = signal<GalleryPhoto[]>(this._loadFromStorage());

  readonly pending = this._pending.asReadonly();

  add(photo: GalleryPhoto): void {
    const updated = [photo, ...this._pending().filter((item) => item.id !== photo.id)];
    this._pending.set(updated);
    this._saveToStorage(updated);
  }

  removeIfPresentIn(apiPhotoIds: readonly string[]): void {
    const apiIdSet = new Set(apiPhotoIds);
    const remaining = this._pending().filter((photo) => !apiIdSet.has(photo.id));
    if (remaining.length === this._pending().length) {
      return;
    }

    this._pending.set(remaining);
    this._saveToStorage(remaining);
  }

  private _loadFromStorage(): GalleryPhoto[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }

      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter(this._isGalleryPhoto);
    } catch {
      return [];
    }
  }

  private _saveToStorage(photos: GalleryPhoto[]): void {
    try {
      if (photos.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    } catch {
      // Ignore quota or privacy mode errors.
    }
  }

  private _isGalleryPhoto(value: unknown): value is GalleryPhoto {
    return (
      typeof value === 'object' &&
      value !== null &&
      'id' in value &&
      'url' in value &&
      'previewUrl' in value &&
      typeof value.id === 'string' &&
      typeof value.url === 'string' &&
      typeof value.previewUrl === 'string'
    );
  }
}
