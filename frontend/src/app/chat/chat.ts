import { Component, inject, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ModelService } from '../model';
import { ApiService } from '../api.service';
import { ChatStorageService, Message } from './chat-storage.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements AfterViewChecked {
  private modelService = inject(ModelService);
  private apiService = inject(ApiService);
  private chatStorage = inject(ChatStorageService);

  protected selectedModel = this.modelService.selectedModel;
  protected messages = signal<Message[]>([]);
  protected currentInput = signal('');
  protected isLoading = signal(false);

  // Settings
  protected showSettings = signal(false);
  protected temperature = signal(0.7);
  protected maxTokens = signal(2048);
  protected topP = signal(1);
  protected frequencyPenalty = signal(0);
  protected presencePenalty = signal(0);
  protected systemPrompt = signal('');

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor() {
    this.loadChat();
  }

  private async loadChat() {
    try {
      const chatData = await this.chatStorage.loadChat();
      if (chatData && chatData.messages.length > 0) {
        this.messages.set(chatData.messages);
        this.systemPrompt.set(chatData.systemPrompt || '');
      } else if (this.selectedModel()) {
        // Only show welcome message if no history exists
        const welcome = [{ role: 'assistant', content: `Hello! I'm ready to chat using **${this.selectedModel().name}**. How can I help you today?` } as Message];
        this.messages.set(welcome);
        this.saveChatState();
      }
    } catch (err) {
      console.error('Error loading chat from DB:', err);
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  async clearChat() {
    if (!confirm('Are you sure you want to clear the chat history?')) return;

    await this.chatStorage.clearChat();

    if (this.selectedModel()) {
      const welcome = [{ role: 'assistant', content: `Hello! I'm ready to chat using **${this.selectedModel().name}**. How can I help you today?` } as Message];
      this.messages.set(welcome);
      this.systemPrompt.set('');
      this.saveChatState();
    } else {
      this.messages.set([]);
      this.systemPrompt.set('');
    }
  }

  // Create a helper to save state consistently
  private saveChatState() {
    this.chatStorage.saveChat({
      messages: this.messages(),
      systemPrompt: this.systemPrompt()
    });
  }

  // Save on system prompt change
  updateSystemPrompt(prompt: string) {
    this.systemPrompt.set(prompt);
    this.saveChatState();
  }

  sendMessage() {
    const input = this.currentInput().trim();
    const model = this.selectedModel();

    if (!input || !model || this.isLoading()) return;

    // Add user message
    this.messages.update(msgs => {
      const newMsgs = [...msgs, { role: 'user', content: input } as Message];
      return newMsgs;
    });
    this.saveChatState(); // Save after update

    this.currentInput.set('');
    this.isLoading.set(true);

    // Prepare messages for API
    let apiMessages = this.messages().map(m => ({ role: m.role, content: m.content }));

    // Add system prompt if present
    if (this.systemPrompt().trim()) {
      apiMessages = [
        { role: 'system', content: this.systemPrompt().trim() },
        ...apiMessages
      ];
    }

    const options = {
      temperature: this.temperature(),
      max_tokens: this.maxTokens(),
      top_p: this.topP(),
      frequency_penalty: this.frequencyPenalty(),
      presence_penalty: this.presencePenalty()
    };

    this.apiService.chat(model.id, apiMessages, options).subscribe({
      next: (response) => {
        const reply = response.choices?.[0]?.message?.content || 'No response received.';
        this.messages.update(msgs => {
          const newMsgs = [...msgs, { role: 'assistant', content: reply } as Message];
          return newMsgs;
        });
        this.saveChatState();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.messages.update(msgs => {
          const newMsgs = [...msgs, { role: 'assistant', content: 'Error: Could not connect to the model.' } as Message];
          return newMsgs;
        });
        this.saveChatState();
        this.isLoading.set(false);
      }
    });
  }
}
