import { Injectable } from '@angular/core';

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ChatData {
    messages: Message[];
    systemPrompt: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChatStorageService {
    private readonly DB_NAME = 'GlorzoChatDB';
    private readonly STORE_NAME = 'chats';
    private readonly CHAT_KEY = 'current_chat';
    private dbPromise: Promise<IDBDatabase>;

    constructor() {
        this.dbPromise = this.initDB();
    }

    private initDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, 1);

            request.onerror = (event) => {
                console.error('IndexedDB error:', event);
                reject(event);
            };

            request.onsuccess = (event: any) => {
                resolve(event.target.result);
            };

            request.onupgradeneeded = (event: any) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    db.createObjectStore(this.STORE_NAME);
                }
            };
        });
    }

    async saveChat(data: ChatData): Promise<void> {
        const db = await this.dbPromise;
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.put(data, this.CHAT_KEY);

            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e);
        });
    }

    // Deprecated: use saveChat instead
    async saveMessages(messages: Message[]): Promise<void> {
        return this.saveChat({ messages, systemPrompt: '' });
    }

    async loadChat(): Promise<ChatData | null> {
        const db = await this.dbPromise;
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.STORE_NAME], 'readonly');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.get(this.CHAT_KEY);

            request.onsuccess = (event: any) => {
                const result = event.target.result;
                if (!result) {
                    resolve(null);
                    return;
                }

                // Backward compatibility: check if result is array (old format) or object (new format)
                if (Array.isArray(result)) {
                    resolve({ messages: result, systemPrompt: '' });
                } else {
                    resolve(result);
                }
            };
            request.onerror = (e) => reject(e);
        });
    }

    // Deprecated wrapper
    async loadMessages(): Promise<Message[] | null> {
        const data = await this.loadChat();
        return data ? data.messages : null;
    }

    async clearChat(): Promise<void> {
        const db = await this.dbPromise;
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.delete(this.CHAT_KEY);

            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e);
        });
    }
}
