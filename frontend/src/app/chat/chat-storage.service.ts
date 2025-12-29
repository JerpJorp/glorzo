import { Injectable } from '@angular/core';

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
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

    async saveMessages(messages: Message[]): Promise<void> {
        const db = await this.dbPromise;
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.put(messages, this.CHAT_KEY);

            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e);
        });
    }

    async loadMessages(): Promise<Message[] | null> {
        const db = await this.dbPromise;
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.STORE_NAME], 'readonly');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.get(this.CHAT_KEY);

            request.onsuccess = (event: any) => {
                resolve(event.target.result || null);
            };
            request.onerror = (e) => reject(e);
        });
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
