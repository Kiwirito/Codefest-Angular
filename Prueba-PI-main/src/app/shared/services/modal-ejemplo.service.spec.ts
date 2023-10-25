import { TestBed } from '@angular/core/testing';

import { ModalEjemploService } from './modal-ejemplo.service';

describe('ModalEjemploService', () => {
  let service: ModalEjemploService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalEjemploService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
