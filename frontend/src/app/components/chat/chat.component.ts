import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef, NgZone, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { SearchStateService } from '../../services/search-state.service';

// canonical emotion keys are lower-case
const EMOTION_EMOJI: Record<string, string> = {
  happy: '😊', sad: '😢', angry: '😠', surprise: '😲',
  fear: '😨', neutral: '😐', disgust: '🤢', contempt: '😒'
};

// ordered emotions for stepped chart (bottom -> top)
const EMOTIONS_ORDER = ['sad', 'neutral', 'happy', 'surprise', 'angry', 'fear', 'disgust', 'contempt'];
const EMOTION_COLORS: Record<string, string> = {
  happy: '#d1fae5', sad: '#eff6ff', neutral: '#f1f5f9', surprise: '#fff7ed',
  angry: '#ffe4e6', fear: '#f3e8ff', disgust: '#ecfdf5', contempt: '#fff1f2'
};

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasEl') canvasEl!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartEl') chartEl!: ElementRef<HTMLCanvasElement>;

  messages: { role: string; content: string; html?: string }[] = [];
  input = '';
  loading = false;
  isOpen = false;
  activeTab = 'chat';

  // emotion
  cameraActive = false;
  currentEmoji = '';
  currentEmotion = '';
  videoReady = false;
  analyzingEmotion = false;
  private stream: MediaStream | null = null;
  private typingTimer: any = null;
  private chart: any = null;
  private emotionHistory: { time: string; emotion: string }[] = [];
  private lastCaptureAt: number | null = null;
  private captureCooldownMs = 800;

  constructor(private chatService: ChatService, private router: Router, private searchState: SearchStateService, private cdr: ChangeDetectorRef, private zone: NgZone) {}

  ngOnInit() {
    window.addEventListener('chat-navigate', (e: any) => {
      const url = new URL(e.detail, window.location.origin);
      this.router.navigate([url.pathname], { queryParams: { q: url.searchParams.get('q') } });
    });
  }

  ngAfterViewInit() {
    // ensure the chart is initialized (empty) so mirror tab shows graph immediately
    this.updateChart();
  }

  ngOnDestroy() { this.stopCamera(); }

  async toggleCamera() {
    if (this.cameraActive) { this.stopCamera(); return; }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.cameraActive = true;
      this.videoReady = false;
      // attach stream and ensure playback starts so captures work while typing
      setTimeout(() => {
        if (this.videoEl?.nativeElement) {
          try {
            this.videoEl.nativeElement.srcObject = this.stream;
            // some browsers require explicit play() when autoplay is muted
            const p = this.videoEl.nativeElement.play();
            if (p && p.catch) p.catch(() => {});
          } catch { /* ignore */ }
        }
      }, 300);
    } catch { this.cameraActive = false; }
  }

  stopCamera() {
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
    this.cameraActive = false;
    this.currentEmoji = '';
    this.videoReady = false;
  }

  async captureOnce() {
    const video = this.videoEl?.nativeElement;
    const canvas = this.canvasEl?.nativeElement;
    if (!video || !canvas || this.analyzingEmotion) return;
    // ensure video is ready; wait briefly up to ~500ms
    await this.ensureVideoReady(video, 500);
    canvas.width = 640; canvas.height = 480;
    try {
      canvas.getContext('2d')!.drawImage(video, 0, 0, 640, 480);
    } catch (err) {
      // fallback: if drawImage fails, try to capture from track using ImageCapture
      try {
        const track = this.stream?.getVideoTracks()[0];
        if (track && (window as any).ImageCapture) {
          const ic = new (window as any).ImageCapture(track);
          const bitmap = await ic.grabFrame();
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        }
      } catch {
        // give up quietly
      }
    }
    const base64 = canvas.toDataURL('image/jpeg', 0.95).split(',')[1];
    this.analyzingEmotion = true;
    this.lastCaptureAt = Date.now();
    this.chatService.analyzeEmotion(base64).subscribe({
      next: res => {
        this.zone.run(() => {
          const emo = (res.emotion || '').toString().toLowerCase();
          this.currentEmoji = EMOTION_EMOJI[emo] ?? '';
          this.currentEmotion = emo;
          this.analyzingEmotion = false;
          this.addToChart(emo);
        });
      },
      error: () => this.zone.run(() => { this.analyzingEmotion = false; })
    });
  }

  private ensureVideoReady(video: HTMLVideoElement, timeout = 500) {
    return new Promise<void>((resolve) => {
      if (video.readyState >= 2) return resolve();
      let waited = 0;
      const interval = 100;
      const t = setInterval(() => {
        if (video.readyState >= 2) {
          clearInterval(t);
          resolve();
        } else {
          waited += interval;
          if (waited >= timeout) {
            clearInterval(t);
            resolve();
          }
        }
      }, interval);
    });
  }

  emotionColor(emo: string) {
    if (!emo) return '';
    const k = emo.toLowerCase();
    return EMOTION_COLORS[k] ?? '';
  }

  parseReply(reply: string): string { return reply; }

  addToChart(emotion: string) {
    const time = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const e = (emotion || 'neutral').toLowerCase();
    this.emotionHistory.push({ time, emotion: e });
    if (this.emotionHistory.length > 60) this.emotionHistory.shift();
    this.updateChart();
  }

  updateChart() {
    const canvas = this.chartEl?.nativeElement;
    if (!canvas) return;
    const Chart = (window as any).Chart;
    if (!Chart) return;

    const labels = this.emotionHistory.map(h => h.time);
    // map emotions to numeric index based on EMOTIONS_ORDER
    const dataPoints = this.emotionHistory.map(h => {
      const idx = EMOTIONS_ORDER.indexOf(h.emotion);
      return idx >= 0 ? idx : EMOTIONS_ORDER.indexOf('neutral');
    });

    const dataset = {
      label: 'emotion',
      data: dataPoints,
      borderColor: '#61c6cb',
      backgroundColor: '#61c6cb33',
      fill: false,
      tension: 0,
      stepped: 'before',
      pointRadius: 4
    };

    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets = [dataset];
      this.chart.update();
    } else {
      this.chart = new Chart(canvas, {
        type: 'line',
        data: { labels, datasets: [dataset] },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              min: 0,
              max: EMOTIONS_ORDER.length - 1,
              ticks: {
                stepSize: 1,
                callback: function(value: any) {
                  const v = Number(value);
                  return EMOTIONS_ORDER[v] ? EMOTIONS_ORDER[v] : '';
                }
              },
              grid: { color: '#e2e8f0' }
            },
            x: { ticks: { font: { size: 9 } } }
          }
        }
      });
    }
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
        this.loading = false;

        // don't auto-capture after Maya's reply; captures are done while user types (debounced)

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
      },
      error: () => this.loading = false
    });
  }

  onKey(e: KeyboardEvent) {
    if (e.key === 'Tab' && this.currentEmoji) {
      e.preventDefault();
      this.input = (this.input + ' ' + this.currentEmoji).trim();
      this.currentEmoji = '';
      return;
    }
    if (e.key === 'Escape') { this.currentEmoji = ''; return; }
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send(); return; }
    if (this.cameraActive && !this.analyzingEmotion) {
      clearTimeout(this.typingTimer);
      const now = Date.now();
      const shouldImmediate = !this.typingTimer && (!this.lastCaptureAt || (now - this.lastCaptureAt) > this.captureCooldownMs);
      if (shouldImmediate) {
        // capture immediately on first keydown
        this.captureOnce();
      }
      // schedule debounce for continuing typing
      this.typingTimer = setTimeout(() => this.captureOnce(), 1000);
    }
  }

  navigateToProduct(query: string) {
    this.router.navigate(['/products'], { queryParams: { q: query } });
    this.isOpen = false;
  }
}
