import { TestBed } from '@angular/core/testing';

import { NotificatonService } from './notificaton.service';

describe('NotificatonService', () => {
  let service: NotificatonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificatonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
