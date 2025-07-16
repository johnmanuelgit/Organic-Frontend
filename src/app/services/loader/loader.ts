import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Loader {
  private _isLoading = new BehaviorSubject<boolean>(false);
  public readonly isLoading = this._isLoading.asObservable();
  private _requestCount = 0;

  show(): void {
    this._requestCount++;
    if (this._requestCount === 1) {
      this._isLoading.next(true);
    }
  }

  hide(): void {
    if (this._requestCount > 0) {
      this._requestCount--;
    }
    if (this._requestCount === 0) {
      setTimeout(() => this._isLoading.next(false), 300);
    }
  }
}
