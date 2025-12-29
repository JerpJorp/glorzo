import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TestApiResponse } from '@glorzo/shared';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl + '/api/test';
    private baseUrl = environment.apiUrl;

    getTestData(): Observable<TestApiResponse> {
        return this.http.get<TestApiResponse>(this.apiUrl);
    }

    getModels(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/api/models`);
    }

    chat(model: string, messages: any[], options: any = {}): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/api/chat`, { model, messages, ...options });
    }
}
