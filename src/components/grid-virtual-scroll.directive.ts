import {
  CdkVirtualScrollViewport,
  VIRTUAL_SCROLL_STRATEGY,
  VirtualScrollStrategy,
} from '@angular/cdk/scrolling';
import { Directive, effect, forwardRef, input } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export class GridVirtualScrollStrategy implements VirtualScrollStrategy {
  private _viewport: CdkVirtualScrollViewport | null = null;
  private readonly _scrolledIndexChange$ = new Subject<number>();

  readonly scrolledIndexChange: Observable<number> =
    this._scrolledIndexChange$.asObservable();

  constructor(
    private _rowHeight: number,
    private _columns: number,
    private _minBufferPx: number,
    private _maxBufferPx: number,
  ) {}

  updateSizes(
    rowHeight: number,
    columns: number,
    minBufferPx: number,
    maxBufferPx: number,
  ): void {
    this._rowHeight = rowHeight;
    this._columns = columns;
    this._minBufferPx = minBufferPx;
    this._maxBufferPx = maxBufferPx;
    this._updateTotalContentSize();
    this._updateRenderedRange();
  }

  attach(viewport: CdkVirtualScrollViewport): void {
    this._viewport = viewport;
    this._updateTotalContentSize();
    this._updateRenderedRange();
  }

  detach(): void {
    this._scrolledIndexChange$.complete();
    this._viewport = null;
  }

  onContentScrolled(): void {
    this._updateRenderedRange();
  }

  onDataLengthChanged(): void {
    this._updateTotalContentSize();
    this._updateRenderedRange();
  }

  onContentRendered(): void {}

  onRenderedOffsetChanged(): void {}

  scrollToIndex(index: number, behavior: ScrollBehavior): void {
    if (!this._viewport) return;
    const rowIndex = Math.floor(index / this._columns);
    this._viewport.scrollToOffset(rowIndex * this._rowHeight, behavior);
  }

  private _totalRows(): number {
    return Math.ceil((this._viewport?.getDataLength() ?? 0) / this._columns);
  }

  private _updateTotalContentSize(): void {
    if (!this._viewport) return;
    this._viewport.setTotalContentSize(this._totalRows() * this._rowHeight);
  }

  private _updateRenderedRange(): void {
    if (!this._viewport) return;

    const scrollOffset = this._viewport.measureScrollOffset();
    const viewportSize = this._viewport.getViewportSize();
    const dataLength = this._viewport.getDataLength();
    const totalRows = this._totalRows();

    const firstVisibleRow = Math.floor(scrollOffset / this._rowHeight);
    const visibleRows = Math.ceil(viewportSize / this._rowHeight);
    const bufferRows = Math.ceil(this._maxBufferPx / this._rowHeight);

    const startRow = Math.max(0, firstVisibleRow - bufferRows);
    const endRow = Math.min(totalRows, firstVisibleRow + visibleRows + bufferRows);

    const start = startRow * this._columns;
    const end = Math.min(dataLength, endRow * this._columns);

    this._viewport.setRenderedRange({ start, end });
    this._viewport.setRenderedContentOffset(startRow * this._rowHeight);
    this._scrolledIndexChange$.next(start);
  }
}

@Directive({
  selector: 'cdk-virtual-scroll-viewport[gridVirtualScroll]',
  providers: [
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useFactory: (d: GridVirtualScrollDirective) => d._scrollStrategy,
      deps: [forwardRef(() => GridVirtualScrollDirective)],
    },
  ],
})
export class GridVirtualScrollDirective {
  readonly rowHeight = input(220);
  readonly columns = input(2);
  readonly minBufferPx = input(440);
  readonly maxBufferPx = input(880);

  readonly _scrollStrategy = new GridVirtualScrollStrategy(
    this.rowHeight(),
    this.columns(),
    this.minBufferPx(),
    this.maxBufferPx(),
  );

  constructor() {
    effect(() => {
      this._scrollStrategy.updateSizes(
        this.rowHeight(),
        this.columns(),
        this.minBufferPx(),
        this.maxBufferPx(),
      );
    });
  }
}
