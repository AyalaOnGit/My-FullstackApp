import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = `${environment.apiUrl}/chat`;
  private searchUrl = `${environment.apiUrl}/search`;

  constructor(private http: HttpClient) {}

  send(message: string, history: { role: string; content: string }[]) {
    return this.http.post<{ reply: string }>(this.apiUrl, { message, history });
  }

  search(query: string) {
    return this.http.post<{ results: any[] }>(this.searchUrl, { query });
  }

  analyzeEmotion(imageBase64: string) {
    return this.http.post<{ emotion: string; scores: Record<string, number> }>(
      `${this.apiUrl}/analyze-emotion`, { image: imageBase64 }
    );
  }
}
