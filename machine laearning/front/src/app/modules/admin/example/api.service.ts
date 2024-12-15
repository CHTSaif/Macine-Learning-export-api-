// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:5000/predict';  // URL to Flask API

  constructor(private http: HttpClient) {}

  // Function to call the prediction API
  predictEconomicData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
