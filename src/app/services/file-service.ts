import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}

  uploadFiles(data: FormData) {
    let token = sessionStorage.getItem('token');
    return this.http.post(
      'https://tuongtlc.ddns.net:8081/file/upload-files',
      data,
      { headers: { Authorization: 'Bearer ' + token } }
    );
  }
  getFiles() {
    let token = sessionStorage.getItem('token');
    return this.http.get('https://tuongtlc.ddns.net:8081/file/get-files', {
      headers: { Authorization: 'Bearer ' + token },
    });
  }
  removeFiles(fileUrl: string) {
    let token = sessionStorage.getItem('token');
    return this.http.delete(
      'https://tuongtlc.ddns.net:8081/file/delete-file?fileUrl=' + fileUrl,
      {
        headers: { Authorization: 'Bearer ' + token },
      }
    );
  }
}
