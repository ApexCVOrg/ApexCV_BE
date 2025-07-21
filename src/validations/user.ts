// Helper functions, API clients, reusable logic

import 'reflect-metadata';
import { IsNotEmpty, IsString, Matches, IsEmail, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{9,11}$/)
  phone!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  fullName!: string;

  // Add other fields if needed...
}
