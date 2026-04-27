import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';


type Source = 'camera' | 'gallery';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  private readonly _document = inject(DOCUMENT);

  pickFromGallery(): Promise<File | null> {
    return this._openPicker('gallery');
  }

  captureWithCamera(): Promise<File | null> {
    return this._openPicker('camera');
  }

  private _openPicker(source: Source): Promise<File | null> {
    return new Promise((resolve) => {
      const input = this._document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      if (source === 'camera') input.setAttribute('capture', 'environment');

      input.onchange = () => resolve(input.files?.[0] ?? null);
      input.oncancel = () => resolve(null);
      input.click();
    });
  }
}
