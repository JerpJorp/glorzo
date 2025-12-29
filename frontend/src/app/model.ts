import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  private readonly router = inject(Router);
  readonly selectedModel = signal<any | null>(null);
  private readonly STORAGE_KEY = 'glorzo_selected_model';

  constructor() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const model = JSON.parse(stored);
        this.selectedModel.set(model);
        this.router.navigate(['/chat']);
      } catch (e) {
        console.error('Failed to parse stored model', e);
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  selectModel(model: any) {
    this.selectedModel.set(model);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(model));
  }
}
