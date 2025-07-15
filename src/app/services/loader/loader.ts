import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Loader {
  private requestCount = 0;
  private _isLoading = new BehaviorSubject<boolean>(false);
  isLoading = this._isLoading.asObservable();

  private _loading = new BehaviorSubject<boolean>(false);
  loading$ = this._loading.asObservable();

  show() {
    this._loading.next(true);
  }

  hide() {
     setTimeout(() => this._loading.next(false), 300);
  }
  
}
