import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgOptimizedImage } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

type GetImagesResponse = Array<{ thumbnailLink: string }>;

@Component({
  selector: 'image-gallery',
  template: `
    <cdk-virtual-scroll-viewport
      [itemSize]="itemSize"
      appendOnly
      [style.gridTemplateRows]="itemSize + 'px'"
      class="grid grid-cols-2 gap-4"
    >
      <div
        *cdkVirtualFor="let chunk of chunks(); trackBy: trackByFn"
        class="col-span-2 grid grid-cols-subgrid justify-items-center"
      >
        @for (url of chunk; track url) {
          <img [ngSrc]="url" [height]="itemSize" [width]="itemSize" />
        }
      </div>
    </cdk-virtual-scroll-viewport>
  `,
  imports: [ScrollingModule, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGalleryComponent {
  readonly itemSize = 400;
  readonly rowSize = 2;

  private readonly _photosResource = httpResource(() => ({ url: '/api/get-photos' }), {
    parse: (response) =>
      (response as GetImagesResponse)
        .map((item) => item.thumbnailLink)
        .map((link) => link.replace('=s220', `=s${this.itemSize}`)),
  });

  readonly chunks = computed(() =>
    this._rowChunkItems(this._photosResource.value() ?? [], this.rowSize),
  );

  readonly trackByFn = (index: number, chunk: string[]) => index;

  private _rowChunkItems(items: string[], chunkSize: number) {
    return items.reduce((acc, item, index) => {
      const rowIndex = Math.floor(index / chunkSize);
      if (!acc[rowIndex]) {
        acc[rowIndex] = [];
      }
      acc[rowIndex].push(item);
      return acc;
    }, [] as string[][]);
  }
}
