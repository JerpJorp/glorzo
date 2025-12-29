import { Component, signal, inject } from '@angular/core';
import { ApiService } from '../api.service';
import { TestApiResponse } from '@glorzo/shared';
import { JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [JsonPipe, NgIf],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private apiService = inject(ApiService);
  protected apiData = signal<TestApiResponse | null>(null);

  constructor() {
    this.apiService.getTestData().subscribe({
      next: (data) => this.apiData.set(data),
      error: (err) => console.error('API Error:', err)
    });
  }
}
