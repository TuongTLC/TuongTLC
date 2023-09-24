import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class TagService {
  constructor(private http: HttpClient) {}

  getTags(status: string) {
    return this.http.get(
      'https://tuongtlc.ddns.net:8081/tag/get-tags?status=' + status
    );
  }
}
