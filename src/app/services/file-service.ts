import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../auth';
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
    return this.http.post(
      'https://tuongtlc.ddns.net:8081/file/upload-files',
      data,
      { headers: { Authorization: 'Bearer ' + token } }
    );
  }
  getFiles() {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.get('https://tuongtlc.ddns.net:8081/file/get-files', {
      headers: { Authorization: 'Bearer ' + token },
    });
  }
  removeFiles(fileUrl: string) {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.delete(
      'https://tuongtlc.ddns.net:8081/file/delete-file?fileUrl=' + fileUrl,
      {
        headers: { Authorization: 'Bearer ' + token },
      }
    );
  }
}
