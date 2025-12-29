import { Component, signal, inject } from '@angular/core';
import { ModelService } from './model';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Glorzo');
  protected readonly modelService = inject(ModelService);
}
