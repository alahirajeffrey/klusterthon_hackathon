import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reminder, ReminderShema } from 'src/schemas/reminder.schema';
import { JwtModule } from '@nestjs/jwt';
import { MessageService } from 'src/utils/message.service';

@Module({
  providers: [ReminderService],
  imports: [
    MongooseModule.forFeature([{ name: Reminder.name, schema: ReminderShema }]),
    JwtModule.register({}),
    MessageService,
  ],
})
export class ReminderModule {}
