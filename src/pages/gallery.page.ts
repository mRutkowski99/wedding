import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: 'gallery-page',
    template: `
        <h1>Gallery</h1>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GalleryPage {}