import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { KeycloakService } from '@services/keycloak.service';
import { filter, Subscription } from 'rxjs';
import { NavbarComponent } from '@shared/navbar/navbar.component';
import { ProductService } from '@services/product.service';
import { ProductResponse } from '@models/product-response.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement?: ElementRef<HTMLVideoElement>;

  backgroundVideoUrl: string = 'assets/background.mp4';
  private routerSubscription: Subscription | undefined;
  private videoLoadAttempts: number = 0;
  private maxVideoLoadAttempts: number = 3;

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
    // Apply global styles to ensure no white borders
    this.applyGlobalStyles();

    if (this.keycloakService.profile) {
      console.log('Utente autenticato');
    } else {
      console.log('Utente non autenticato');
    }

    // Subscribe to router events to handle video restart when returning to homepage
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Reset video when we navigate to this component
      setTimeout(() => this.resetBackgroundVideo(), 50);
    });

    // Load recommended products dynamically
    this.loadRecommendedProducts();
  }

  ngAfterViewInit(): void {
    // Initialize video after view is initialized
    setTimeout(() => this.initializeVideo(), 100);

    // Apply additional DOM manipulations if needed
    this.removeWhiteBorders();
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Apply global styles to ensure no white borders
  private applyGlobalStyles(): void {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.backgroundColor = '#000';

    // Ensure the component itself has no margins
    if (this.el && this.el.nativeElement) {
      this.renderer.setStyle(this.el.nativeElement, 'margin', '0');
      this.renderer.setStyle(this.el.nativeElement, 'padding', '0');
      this.renderer.setStyle(this.el.nativeElement, 'overflow', 'hidden');
    }
  }

  // Find and remove any potential white borders
  private removeWhiteBorders(): void {
    const elements = document.querySelectorAll('body, html, app-root, app-home');
    elements.forEach(el => {
      this.renderer.setStyle(el, 'margin', '0');
      this.renderer.setStyle(el, 'padding', '0');
      this.renderer.setStyle(el, 'overflow-x', 'hidden');
    });
  }

  // Initialize video event listener with better error handling
  private initializeVideo(): void {
    const video = document.getElementById('promoVideo') as HTMLVideoElement;
    if (video) {
      // When video can play
      video.addEventListener('canplay', () => {
        this.videoLoadAttempts = 0;
        console.log('Video can play');
      });

      // Error handling
      video.addEventListener('error', (e) => {
        console.error('Video error:', e);
        this.handleVideoError(video);
      });

      // When video is stuck
      video.addEventListener('stalled', () => {
        console.warn('Video stalled');
        this.handleVideoError(video);
      });

      // Ensure video is playing
      this.playVideo(video);

      // Set up the ended event
      video.addEventListener('ended', () => {
        const section = document.getElementById('recommendedSection');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  // Play video with error handling
  private playVideo(video: HTMLVideoElement): void {
    if (!video) return;

    video.currentTime = 0;
    video.load();

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('Video play failed:', error);
        setTimeout(() => this.retryVideoPlay(video), 200);
      });
    }
  }

  // Retry playing the video
  private retryVideoPlay(video: HTMLVideoElement): void {
    if (this.videoLoadAttempts < this.maxVideoLoadAttempts) {
      this.videoLoadAttempts++;
      console.log(`Retry video play attempt ${this.videoLoadAttempts}`);
      this.playVideo(video);
    }
  }

  // Handle video errors
  private handleVideoError(video: HTMLVideoElement): void {
    if (this.videoLoadAttempts < this.maxVideoLoadAttempts) {
      this.videoLoadAttempts++;
      console.log(`Video error, attempting reload ${this.videoLoadAttempts}`);

      // Recreate the video element if there's an error
      if (this.videoLoadAttempts === this.maxVideoLoadAttempts) {
        this.recreateVideoElement();
      } else {
        setTimeout(() => this.playVideo(video), 300);
      }
    }
  }

  // Recreate video element as a last resort
  private recreateVideoElement(): void {
    const videoContainer = document.querySelector('.home-container');
    const oldVideo = document.getElementById('promoVideo');

    if (videoContainer && oldVideo) {
      // Remove the old video
      oldVideo.remove();

      // Create a new video element
      const newVideo = this.renderer.createElement('video');
      this.renderer.setAttribute(newVideo, 'id', 'promoVideo');
      this.renderer.addClass(newVideo, 'background-video');
      this.renderer.setAttribute(newVideo, 'autoplay', 'true');
      this.renderer.setAttribute(newVideo, 'muted', 'true');
      this.renderer.setAttribute(newVideo, 'playsinline', 'true');

      // Create and add source
      const source = this.renderer.createElement('source');
      this.renderer.setAttribute(source, 'src', this.backgroundVideoUrl);
      this.renderer.setAttribute(source, 'type', 'video/mp4');

      this.renderer.appendChild(newVideo, source);

      // Add fallback text
      const fallbackText = this.renderer.createText('Il tuo browser non supporta i video HTML5.');
      this.renderer.appendChild(newVideo, fallbackText);

      // Insert the new video at the beginning of the container
      const firstChild = videoContainer.firstChild;
      this.renderer.insertBefore(videoContainer, newVideo, firstChild);

      // Initialize the new video
      setTimeout(() => this.initializeVideo(), 100);
    }
  }

  // Reset video when returning to the page with improved reliability
  private resetBackgroundVideo(): void {
    const video = document.getElementById('promoVideo') as HTMLVideoElement;
    if (video) {
      // Force video reload
      video.pause();
      video.currentTime = 0;
      video.load();

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Video autoplay failed on navigation:', err);
          setTimeout(() => this.retryVideoPlay(video), 200);
        });
      }
    } else {
      // If video element doesn't exist, recreate it
      console.warn('Video element not found, recreating...');
      this.recreateVideoElement();
    }
  }

  // Handle image load errors
  onImageError(product: any): void {
    console.warn(`Failed to load image: ${product.imageUrl}`);
    product.imageUrl = product.fallbackImageUrl;
  }

  // Load recommended products dynamically from the backend
  private loadRecommendedProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (data: ProductResponse[]) => {
        this.recommendedProducts = data.slice(0, 7); // Limit to the first 7 products
        this.loading = false;
      },
      error: err => {
        console.error(err);
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
