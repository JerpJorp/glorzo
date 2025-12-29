import { Component, inject, signal, computed } from '@angular/core';
import { ApiService } from '../api.service';
import { ModelService } from '../model';
import { NgFor, NgIf, NgClass, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OpenRouterModel } from '@glorzo/shared';

@Component({
  selector: 'app-model-list',
  imports: [NgFor, NgIf, FormsModule, NgClass, RouterLink, DecimalPipe],
  templateUrl: './model-list.html',
  styleUrl: './model-list.css',
})
export class ModelList {
  private apiService = inject(ApiService);
  private modelService = inject(ModelService);

  protected messages = signal<any[]>([]); // This seems unused or from chat? Let's check imports. No, I am editing ModelList.

  protected models = signal<OpenRouterModel[]>([]);
  protected loading = signal(false);
  protected searchTerm = signal('');
  protected maxPriceFilter = signal<number>(0);

  protected selectedModel = this.modelService.selectedModel;

  protected overallMaxPrice = computed(() => {
    const models = this.models();
    if (models.length === 0) return 10;
    const prices = models.map(m => {
      const p = parseFloat(m.pricing.prompt);
      return isNaN(p) ? 0 : p * 1000000;
    });
    return Math.ceil(Math.max(...prices, 0.1));
  });

  protected filteredModels = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const maxPrice = this.maxPriceFilter();
    const allModels = this.models();

    return allModels.filter(m => {
      const price = parseFloat(m.pricing.prompt);
      const costPerMillion = isNaN(price) ? 0 : price * 1000000;

      const matchesTerm = !term ||
        m.name.toLowerCase().includes(term) ||
        m.id.toLowerCase().includes(term) ||
        m.description?.toLowerCase().includes(term);

      return matchesTerm && costPerMillion <= maxPrice;
    });
  });

  getCostPerMillion(price: string): string {
    const cost = parseFloat(price);
    if (isNaN(cost)) return '0.00';
    return (cost * 1000000).toFixed(2);
  }

  fetchModels() {
    this.loading.set(true);
    this.apiService.getModels().subscribe({
      next: (response) => {
        this.models.set(response.data);

        // Auto-set filter to maximum found price so everything is visible initially
        const models = response.data as OpenRouterModel[];
        const prices = models.map((m) => {
          const p = parseFloat(m.pricing.prompt);
          return isNaN(p) ? 0 : p * 1000000;
        });
        const max = Math.ceil(Math.max(...prices, 10));
        this.maxPriceFilter.set(max);

        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  selectModel(model: OpenRouterModel) {
    this.modelService.selectModel(model);
  }
}
