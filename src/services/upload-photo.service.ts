import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { switchMap } from 'rxjs';

type GetUploadUrlResponse = {
  uploadUrl: string;
};

@Injectable({ providedIn: 'root' })
export class UploadPhotoService {
  private readonly _http = inject(HttpClient);

  upload(photo: File) {
    return this._http.post<GetUploadUrlResponse>('/api/get-upload-url', { filename: photo.name });
  }
}
