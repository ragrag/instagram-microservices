import { IsEmail, IsString, IsNotEmpty, MinLength, IsAlphanumeric } from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(3)
  public username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  public password: string;
}
