import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImageGalleryComponent } from '../components/image-gallery.component';

@Component({
  selector: 'gallery-page',
  template: ` <image-gallery /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ImageGalleryComponent],
  host: {
    class: 'block h-dvh overflow-hidden',
  },
})
export default class GalleryPage {}
