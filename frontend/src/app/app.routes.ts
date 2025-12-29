import { Routes } from '@angular/router';

import { Home } from './home/home';
import { ModelList } from './model-list/model-list';
import { Chat } from './chat/chat';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'models', component: ModelList },
    { path: 'chat', component: Chat }
];
