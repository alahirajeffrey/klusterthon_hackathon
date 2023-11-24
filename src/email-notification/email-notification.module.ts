import { Module } from '@nestjs/common';
import { EmailNotificationService } from './email-notification.service';

@Module({
  providers: [EmailNotificationService]
})
export class EmailNotificationModule {}
