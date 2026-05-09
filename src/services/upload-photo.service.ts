import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import imageCompression from 'browser-image-compression';
import {
  catchError,
  endWith,
  map,
  Observable,
  of,
  switchMap,
  throwError,
  from,
  ignoreElements,
  startWith,
} from 'rxjs';

type GetUploadUrlResponse = {
  uploadUrl: string;
};

export type UploadPhotoStatus = 'preparing' | 'compressing' | 'uploading' | 'complete';

@Injectable({ providedIn: 'root' })
export class UploadPhotoService {
  private readonly _http = inject(HttpClient);

  upload(photo: File): Observable<UploadPhotoStatus> {
    return this._getUploadUrl(photo.name).pipe(
      switchMap((uploadUrl) =>
        from(this._compressPhoto(photo)).pipe(
          switchMap((compressedPhoto) =>
            this._uploadToDrive(compressedPhoto, uploadUrl).pipe(
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

  private _getUploadUrl(filename: string): Observable<string> {
    return this._http
      .post<GetUploadUrlResponse>('/api/get-upload-url', { filename })
      .pipe(map((response) => response.uploadUrl));
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

  private _uploadToDrive(photo: File, uploadUrl: string) {
    return this._http
      .put(uploadUrl, photo, {
        headers: { 'Content-Type': 'image/jpeg' },
        responseType: 'text',
      })
      .pipe(
        catchError((error) => {
          // CORS blocks the response after a successful upload.
          // The network tab shows the real HTTP status (200/201), but Angular
          // receives status 0 because the browser drops the response before
          // JavaScript can read it. Both cases are treated as success.
          const isCorsBlock = error.status === 0 && error.error instanceof ProgressEvent;
          const isSuccess = error.status === 200 || error.status === 201;
          if (isCorsBlock || isSuccess) {
            return of(new HttpResponse({ status: 200 }));
          }
          return throwError(() => error);
        }),
      );
  }
}
