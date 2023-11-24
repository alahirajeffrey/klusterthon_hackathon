import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateReminderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  patientId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  medicationId: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty()
  time: Date;
}
