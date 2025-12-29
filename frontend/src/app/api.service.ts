import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TestApiResponse } from '@glorzo/shared';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/test';

    getTestData(): Observable<TestApiResponse> {
        return this.http.get<TestApiResponse>(this.apiUrl);
    }

    getModels(): Observable<any> {
        return this.http.get<any>('http://localhost:3000/api/models');
    }

    chat(model: string, messages: any[], options: any = {}): Observable<any> {
        return this.http.post<any>('http://localhost:3000/api/chat', { model, messages, ...options });
    }
}
