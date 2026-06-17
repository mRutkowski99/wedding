import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import imageCompression from 'browser-image-compression';
import {
  endWith,
  Observable,
  switchMap,
  from,
  ignoreElements,
  startWith,
} from 'rxjs';

type GetUploadSignatureResponse = {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
};

export type UploadPhotoStatus = 'preparing' | 'compressing' | 'uploading' | 'complete';

@Injectable({ providedIn: 'root' })
export class UploadPhotoService {
  private readonly _http = inject(HttpClient);

  upload(photo: File): Observable<UploadPhotoStatus> {
    return this._getUploadSignature().pipe(
      switchMap((signatureData) =>
        from(this._compressPhoto(photo)).pipe(
          switchMap((compressedPhoto) =>
            this._uploadToCloudinary(compressedPhoto, signatureData).pipe(
              ignoreElements(),
              endWith('complete' as const),
              startWith('uploading' as const),
            ),
          ),
          startWith('compressing' as const),
        ),
      ),
      startWith('preparing' as const),
    );
  }

  private _getUploadSignature(): Observable<GetUploadSignatureResponse> {
    return this._http.post<GetUploadSignatureResponse>('/api/get-upload-url', {});
  }

  private _compressPhoto(photo: File): Promise<File> {
    return imageCompression(photo, {
      maxSizeMB: 3,
      maxWidthOrHeight: 2048,
      useWebWorker: true,
      initialQuality: 0.85,
      fileType: 'image/jpeg',
    });
  }

  private _uploadToCloudinary(photo: File, signatureData: GetUploadSignatureResponse) {
    const formData = new FormData();
    formData.append('file', photo);
    formData.append('api_key', signatureData.apiKey);
    formData.append('timestamp', signatureData.timestamp.toString());
    formData.append('signature', signatureData.signature);
    formData.append('folder', signatureData.folder);

    return this._http.post(
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
      formData
    );
  }
}
