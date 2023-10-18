import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../auth';
import { Observable } from 'rxjs';
import { FileModel } from '../models/file-model';
import { environment } from 'src/ext';
@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: Auth
  ) {}

  uploadFiles(data: FormData) {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.post(environment.BASE_URL + '/file/upload-files', data, {
      headers: { Authorization: 'Bearer ' + token },
    });
  }
  getFiles(): Observable<FileModel[]> {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.get<FileModel[]>(
      environment.BASE_URL + '/file/get-files',
      {
        headers: { Authorization: 'Bearer ' + token },
      }
    );
  }
  removeFiles(fileUrl: string) {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.delete(
      environment.BASE_URL + '/file/delete-file?fileUrl=' + fileUrl,
      {
        headers: { Authorization: 'Bearer ' + token },
      }
    );
  }
}
