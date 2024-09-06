import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  images = [
    { src: "https://merkuryinnovations.com/cdn/shop/files/1920x746_MI-E105T-534_6f8577f3-1325-4616-a48a-932e94149872.jpg?v=1700587757", description: "QUALITY COMFORT SOUND" },
    { src: "https://merkuryinnovations.com/cdn/shop/files/1920x746_MI-DC503-199_fb9b8e8c-c79a-418d-a40c-1e3dfa45429b.jpg?v=1700587825", description: "MODERN LIGHTING ACCENTS" },
    { src: "https://merkuryinnovations.com/cdn/shop/files/1920x746_MI-S196B-199_a374222f-2f89-406b-9b51-2b0b44dde826.jpg?v=1700587778", description: "SMART ESSENTIALS FOR THE OUTDOORS" },
    { src: "https://merkuryinnovations.com/cdn/shop/files/1920x746_MIC-ER101-600_f63b00c4-d8af-40f0-add3-41fcc300170b.jpg?v=1700587800", description: "ACCESSORIES ON-THE-GO" },
    { src: "https://merkuryinnovations.com/cdn/shop/files/1920x746_MI-PNF03-101_8951a3c9-4d4f-41ad-9e1d-8fb11de7a4c9.jpg?v=1700588265", description: "UPGRADE YOUR EVERYDAY" }
  ];
  currentSlide = 0;
  interval: any;

  ngOnInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  startCarousel() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 3000); // Change slide every 3 seconds
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.images.length) % this.images.length;
  }

  getTransform() {
    return `translateX(-${this.currentSlide * 100}%)`;
  }
}