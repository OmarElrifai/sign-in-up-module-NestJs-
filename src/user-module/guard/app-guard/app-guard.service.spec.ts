import { Test, TestingModule } from '@nestjs/testing';
import { AppGuardService } from './app-guard.service';

describe('AppGuardService', () => {
  let service: AppGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppGuard],
    }).compile();

    service = module.get<AppGuard>(AppGuardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
