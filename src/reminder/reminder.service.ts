import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Reminder } from 'src/schemas/reminder.schema';
import { MessageService } from 'src/utils/message.service';
import { Logger } from 'winston';

@Injectable()
export class ReminderService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel(Reminder.name)
    private reminderModel: Model<Reminder>,
    private messageService: MessageService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async triggerReminder() {
    const reminders = await this.reminderModel.find({ time: {} });

    // loop through reminders and send text message
    for (let i = 0; i < reminders.length; i++) {
      const reminder = reminders[i];

      await this.messageService.sendTestMessage(
        reminder.patientMobileNumber,
        `Its time to take your drugs. 
        
        Medication name : ${reminder.medicationName}
        
        Dosage: ${reminder.dosage}`,
      );
    }
  }
}
