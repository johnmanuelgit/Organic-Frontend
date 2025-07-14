import { Injectable } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';


@Injectable({
  providedIn: 'root',
})
export class Toastr {
  constructor(private toastr:NgToastService) {}

  success(message: string, title?: string) {
    this.toastr.success(message, title || 'Success');
  }

  error(message: string, title?: string) {
    this.toastr.danger(message, title || 'Error');
  }

  info(message: string, title?: string) {
    this.toastr.info(message, title || 'Info');
  }

  warning(message: string, title?: string) {
    this.toastr.warning(message, title || 'Warning');
  }
}
