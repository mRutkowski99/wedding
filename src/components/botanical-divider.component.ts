import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'botanical-divider',
  template: `
    <div class="flex items-center justify-center my-8">
      <div class="flex-1 border-b border-primary/30 mx-4"></div>
      <img ngSrc="divider.png" alt="Botanical divider" width="200" height="50" priority class="block mx-auto" />
      <div class="flex-1 border-b border-primary/30 mx-4"></div>
    </div>
  `,
  imports: [NgOptimizedImage],
})
export class BotanicalDivider {}
