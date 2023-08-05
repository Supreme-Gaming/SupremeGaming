import { Test, TestingModule } from '@nestjs/testing';
import { PaypalRestService } from './paypal-rest.service';

describe('PaypalRestService', () => {
  let service: PaypalRestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaypalRestService],
    }).compile();

    service = module.get<PaypalRestService>(PaypalRestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
