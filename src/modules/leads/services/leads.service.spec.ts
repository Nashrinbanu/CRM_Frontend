import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';   // ✅
import { LeadsService } from './leads.service';

describe('LeadsService', () => {
  let service: LeadsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],   // ✅ provides HttpClient for tests
      providers: [LeadsService]             // optional but explicit
    });

    service = TestBed.inject(LeadsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
 