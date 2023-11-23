import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ChangeMedicationDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  medicationName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  diagnosis: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  timesToBeTaken: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  dosage: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  durationInHours: number;
}
