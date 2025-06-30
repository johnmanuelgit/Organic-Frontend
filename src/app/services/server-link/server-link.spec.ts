import { TestBed } from '@angular/core/testing';

import { ServerLink } from './server-link';

describe('ServerLink', () => {
  let service: ServerLink;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerLink);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
