import { TestBed } from '@angular/core/testing';
import { KafkaService } from './kafka.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('KafkaService', () => {
  let service: KafkaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [KafkaService]
    });
    service = TestBed.inject(KafkaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Add your test cases here
});