import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReminderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  patientId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  medicationId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  time: string;
}
