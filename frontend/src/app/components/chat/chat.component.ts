import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  messages: { role: string; content: string }[] = [];
  input = '';
  loading = false;
  isOpen = false;

  constructor(private chatService: ChatService, private router: Router) {}

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
        this.messages.push({ role: 'assistant', content: cleanReply });
        if (navMatch) {
          setTimeout(() => {
            this.router.navigate([navMatch[1]]);
            this.isOpen = false;
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
}
