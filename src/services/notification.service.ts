import {
  ApplicationRef,
  createComponent,
  DOCUMENT,
  EnvironmentInjector,
  inject,
  Injectable,
} from '@angular/core';
import { ToastComponent, ToastStatus } from '../components/toast.component';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _appRef = inject(ApplicationRef);
  private readonly _injector = inject(EnvironmentInjector);
  private readonly _document = inject(DOCUMENT);

  show(status: ToastStatus, text: string): void {
    const ref = createComponent(ToastComponent, {
      environmentInjector: this._injector,
    });

    ref.setInput('status', status);
    ref.setInput('text', text);

    this._appRef.attachView(ref.hostView);

    const domNode = ref.location.nativeElement as HTMLElement;
    this._document.body.appendChild(domNode);

    setTimeout(() => {
      this._appRef.detachView(ref.hostView);
      ref.destroy();
    }, 3000);
  }
}
