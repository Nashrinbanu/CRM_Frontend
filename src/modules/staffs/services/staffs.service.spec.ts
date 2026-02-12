import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';   // ✅
import { StaffsService } from './staffs.service';

describe('StaffsService', () => {
  let service: StaffsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // ✅ supplies HttpClient
      providers: [StaffsService]           // optional but explicit
    });

    service = TestBed.inject(StaffsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
