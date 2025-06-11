import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { KeycloakService } from '@services/keycloak.service';
import { filter, Subscription } from 'rxjs';
import { ProductService } from '@services/product.service';
import { ProductResponse } from '@models/product-response.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement?: ElementRef<HTMLVideoElement>;

  isLoggedIn = false;
  backgroundVideoUrl = 'assets/background.mp4';
  private routerSubscription?: Subscription;
  private videoLoadAttempts = 0;
  private maxVideoLoadAttempts = 3;

  isMuted = true;
  recommendedProducts: ProductResponse[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private keycloakService: KeycloakService,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // determina se l'utente è autenticato
    this.isLoggedIn = !this.keycloakService.isTokenExpired();

    this.applyGlobalStyles();

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => setTimeout(() => this.resetBackgroundVideo(), 50));

    this.loadRecommendedProducts();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initializeVideo(), 100);
    this.removeWhiteBorders();
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  toggleMute(): void {
    const video = this.videoElement?.nativeElement;
    if (video) {
      video.muted = !video.muted;
      this.isMuted = video.muted;
    }
  }

  private applyGlobalStyles(): void {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.backgroundColor = '#000';

    this.renderer.setStyle(this.el.nativeElement, 'margin', '0');
    this.renderer.setStyle(this.el.nativeElement, 'padding', '0');
    this.renderer.setStyle(this.el.nativeElement, 'overflow', 'hidden');
  }

  private removeWhiteBorders(): void {
    const elements = document.querySelectorAll('body, html, app-root, app-home');
    elements.forEach(el => {
      this.renderer.setStyle(el, 'margin', '0');
      this.renderer.setStyle(el, 'padding', '0');
      this.renderer.setStyle(el, 'overflow-x', 'hidden');
    });
  }

  private initializeVideo(): void {
    const video = document.getElementById('promoVideo') as HTMLVideoElement;
    if (!video) return;

    video.addEventListener('canplay', () => {
      this.videoLoadAttempts = 0;
    });
    video.addEventListener('error', () => this.handleVideoError(video));
    video.addEventListener('stalled', () => this.handleVideoError(video));
    video.addEventListener('ended', () => {
      const section = document.getElementById('recommendedSection');
      section?.scrollIntoView({ behavior: 'smooth' });
    });

    this.playVideo(video);
  }

  private playVideo(video: HTMLVideoElement): void {
    video.currentTime = 0;
    video.load();
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => setTimeout(() => this.retryVideoPlay(video), 200));
    }
  }

  private retryVideoPlay(video: HTMLVideoElement): void {
    if (this.videoLoadAttempts < this.maxVideoLoadAttempts) {
      this.videoLoadAttempts++;
      this.playVideo(video);
    }
  }

  private handleVideoError(video: HTMLVideoElement): void {
    if (this.videoLoadAttempts < this.maxVideoLoadAttempts) {
      this.videoLoadAttempts++;
      if (this.videoLoadAttempts === this.maxVideoLoadAttempts) {
        this.recreateVideoElement();
      } else {
        setTimeout(() => this.playVideo(video), 300);
      }
    }
  }

  private recreateVideoElement(): void {
    const container = document.querySelector('.home-container');
    const old = document.getElementById('promoVideo');
    if (!container || !old) return;

    old.remove();
    const newVideo = this.renderer.createElement('video');
    this.renderer.setAttribute(newVideo, 'id', 'promoVideo');
    this.renderer.addClass(newVideo, 'background-video');
    ['autoplay', 'muted', 'playsinline'].forEach(attr =>
      this.renderer.setAttribute(newVideo, attr, 'true')
    );

    const source = this.renderer.createElement('source');
    this.renderer.setAttribute(source, 'src', this.backgroundVideoUrl);
    this.renderer.setAttribute(source, 'type', 'video/mp4');
    this.renderer.appendChild(newVideo, source);
    this.renderer.appendChild(newVideo, this.renderer.createText('Il tuo browser non supporta i video HTML5.'));

    container.insertBefore(newVideo, container.firstChild);
    setTimeout(() => this.initializeVideo(), 100);
  }

  private resetBackgroundVideo(): void {
    const video = document.getElementById('promoVideo') as HTMLVideoElement;
    if (video) {
      video.pause();
      video.currentTime = 0;
      video.load();
      video.play().catch(() => setTimeout(() => this.retryVideoPlay(video), 200));
    } else {
      this.recreateVideoElement();
    }
  }

  onImageError(product: any): void {
    product.imageUrl = product.fallbackImageUrl;
  }

  private loadRecommendedProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (data: ProductResponse[]) => {
        this.recommendedProducts = data.slice(0, 7);
        this.loading = false;
      },
      error: () => {
        this.error = 'Errore durante il caricamento dei prodotti consigliati.';
        this.loading = false;
      }
    });
  }

  login(): void {
    this.keycloakService.login();
  }

  register(): void {
    this.keycloakService.register();
  }
}
