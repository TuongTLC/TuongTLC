import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tagModel } from '../models/tag-models';
@Injectable({
  providedIn: 'root',
})
export class TagService {
  constructor(private http: HttpClient) {}

  getTags(status: string): Observable<tagModel[]> {
    return this.http.get<tagModel[]>(
      'https://tuongtlc.ddns.net:8081/tag/get-tags?status=' + status
    );
  }
}
