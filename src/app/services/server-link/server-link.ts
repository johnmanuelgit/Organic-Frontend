import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServerLink {
  constructor() {}

  serverlinks = 'http://localhost:3000';
}
