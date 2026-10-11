import { Test, TestingModule } from '@nestjs/testing';
import { InternalEmailController } from './email.controller';
import { EmailService } from './email.service';

describe('EmailController', () => {
  let controller: InternalEmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InternalEmailController],
      providers: [EmailService],
    }).compile();

    controller = module.get<InternalEmailController>(InternalEmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
