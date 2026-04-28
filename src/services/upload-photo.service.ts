import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import imageCompression from 'browser-image-compression';
import { catchError, filter, map, Observable, of, switchMap, tap, throwError } from 'rxjs';

type GetUploadUrlResponse = {
  uploadUrl: string;
};

type UploadProgress = {
  status: 'idle' | 'compressing' | 'uploading';
  progress?: number;
};

@Injectable({ providedIn: 'root' })
export class UploadPhotoService {
  private readonly _http = inject(HttpClient);

  private readonly _uploadProgress = signal<UploadProgress>({
    status: 'idle',
  });

  readonly uploadProgress = computed(() => this._uploadProgress());

  upload(photo: File) {
    this._uploadProgress.set({ status: 'compressing', progress: 0 });
    
    return this._getUploadUrl(photo.name).pipe(
      switchMap(async (uploadUrl) => {
        const compressedPhoto = await this._compressPhoto(photo);
        return { compressedPhoto, uploadUrl };
      }),
      switchMap(({ compressedPhoto, uploadUrl }) =>
        this._uploadToDrive(compressedPhoto, uploadUrl),
      ),
      catchError((error) => {
        this._uploadProgress.set({
          status: 'idle',
        });
        return throwError(() => error);
      }),
    );
  }

  private _getUploadUrl(filename: string): Observable<string> {
    return this._http
      .post<GetUploadUrlResponse>('/api/get-upload-url', { filename })
      .pipe(map((response) => response.uploadUrl));
  }

  private _compressPhoto(photo: File): Promise<File> {
    return imageCompression(photo, {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.85,
      fileType: 'image/jpeg',
      onProgress: (progress) => {
        this._uploadProgress.set({
          status: 'compressing',
          progress,
        });
      },
    });
  }

  private _uploadToDrive(photo: File, uploadUrl: string) {
    return this._http
      .put(uploadUrl, photo, {
        observe: 'events',
        reportProgress: true,
        headers: { 'Content-Type': 'image/jpeg' },
        responseType: 'text',
      })
      .pipe(
        tap((event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this._uploadProgress.set({
              status: 'uploading',
              progress: Math.round((100 * event.loaded) / (event.total || 1)),
            });
          }
        }),
        filter((event) => event.type === HttpEventType.Response),
        catchError((error) => {
          if (error.status === 200 || error.status === 201) {
            // This was a successful upload blocked by CORS response headers
            return of(new HttpResponse({ status: 200 }));
          }
          return throwError(() => error);
        }),
        tap(() => {
          this._uploadProgress.set({ status: 'idle' });
        }),
      );
  }
}
