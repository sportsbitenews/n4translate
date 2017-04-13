import { TestBed, inject } from '@angular/core/testing';

import { UserAgentService } from './user-agent.service';

describe('UserAgentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserAgentService]
    });
  });

  it('should ...', inject([UserAgentService], (service: UserAgentService) => {
    expect(service).toBeTruthy();
  }));
});
