import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '@prisma/client';

export class UpdateBookingStatusDto {
  @IsNotEmpty()
  @IsEnum(BookingStatus)
  status: BookingStatus;

  @IsOptional()
  @IsNumber()
  bayNumber?: number;

  @IsOptional()
  @IsString()
  mechanic?: string;
}
