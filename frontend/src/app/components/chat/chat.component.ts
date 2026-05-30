import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { SearchStateService } from '../../services/search-state.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  messages: { role: string; content: string; html?: string }[] = [];
  input = '';
  loading = false;
  isOpen = false;

  constructor(private chatService: ChatService, private router: Router, private searchState: SearchStateService) {}

  ngOnInit() {
    window.addEventListener('chat-navigate', (e: any) => {
      const url = new URL(e.detail, window.location.origin);
      this.router.navigate([url.pathname], { queryParams: { q: url.searchParams.get('q') } });
    });
  }

  parseReply(reply: string): string {
    return reply;
  }

  send() {
    if (!this.input.trim() || this.loading) return;
    const msg = this.input;
    this.input = '';
    this.loading = true;
    this.messages.push({ role: 'user', content: msg });

    this.chatService.send(msg, this.messages.slice(0, -1)).subscribe({
      next: res => {
        const reply = res.reply;
        const navMatch = reply.match(/\[NAVIGATE:(\/[^\]]+)\]/);
        const cleanReply = reply.replace(/\[NAVIGATE:\/[^\]]+\]/g, '').trim();
        const html = this.parseReply(cleanReply);
        this.messages.push({ role: 'assistant', content: cleanReply, html });
        if (navMatch) {
          const fullPath = navMatch[1];
          const [path, queryString] = fullPath.split('?');
          const queryParams: any = {};
          if (queryString) {
            queryString.split('&').forEach(p => {
              const [k, v] = p.split('=');
              queryParams[k] = decodeURIComponent(v);
            });
          }
          setTimeout(() => {
            if (queryParams.q) {
              this.router.navigate([path]);
              setTimeout(() => this.searchState.search(queryParams.q), 300);
            } else {
              this.router.navigate([path]);
            }
          }, 1500);
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onKey(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send(); }
  }

  navigateToProduct(query: string) {
    this.router.navigate(['/products'], { queryParams: { q: query } });
    this.isOpen = false;
  }
}
