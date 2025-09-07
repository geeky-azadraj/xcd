import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsObject, IsEmail, IsOptional, IsUrl } from 'class-validator';

export class EventVenueDto {
  @ApiProperty({ description: 'City where the event is taking place' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'Venue name' })
  @IsString()
  @IsOptional()
  venue?: string;
}

export class PrimarySupportContactDto {
  @ApiProperty({ description: 'First name of the support contact' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ description: 'Last name of the support contact' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ description: 'Support email address' })
  @IsEmail()
  @IsOptional()
  supportEmail?: string;

  @ApiProperty({ description: 'Phone number of the support contact' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ description: 'Support URL' })
  @IsUrl()
  @IsOptional()
  supportUrl?: string;
}

export class CreateEventDto {
  @ApiProperty({ description: 'Title of the event' })
  @IsString()
  @IsOptional()
  eventTitle?: string;

  @ApiProperty({ description: 'Start date of the event', format: 'date' })
  @IsDateString()
  @IsOptional()
  eventStartDate?: string;

  @ApiProperty({ description: 'End date of the event', format: 'date' })
  @IsDateString()
  @IsOptional()
  eventEndDate?: string;

  @ApiProperty({ description: 'Currency for the event' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ description: 'Start date for booking', format: 'date' })
  @IsDateString()
  @IsOptional()
  bookingStartDate?: string;

  @ApiProperty({ description: 'End date for booking', format: 'date' })
  @IsDateString()
  @IsOptional()
  bookingEndDate?: string;

  @ApiProperty({ description: 'Event venue information' })
  @IsObject()
  @IsOptional()
  eventVenue?: EventVenueDto;

  @ApiProperty({ description: 'Event logo URL', format: 'uri' })
  @IsUrl()
  @IsOptional()
  eventLogo?: string;

  @ApiProperty({ description: 'Primary support contact information' })
  @IsObject()
  @IsOptional()
  primarySupportContact?: PrimarySupportContactDto;
}
