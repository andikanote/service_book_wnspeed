import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async getAll(@Request() req: any) {
    return this.bookingsService.getAllBookings(req.user);
  }

  @Get('occupied-slots')
  async getOccupiedSlots(
    @Request() req: any,
  ) {
    const date = req.query?.date;
    const branch = req.query?.branch;
    return this.bookingsService.getOccupiedSlots(date, branch);
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.getBookingById(id, req.user);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateBookingStatusDto,
    @Request() req: any,
  ) {
    return this.bookingsService.updateBookingStatus(
      id,
      body.status,
      body.bayNumber,
      body.mechanic,
      req.user,
    );
  }

  @Post()
  async create(@Body() body: CreateBookingDto, @Request() req: any) {
    return this.bookingsService.createBooking(body, req.user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.deleteBooking(id, req.user);
  }
}
