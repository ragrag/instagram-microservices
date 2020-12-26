import { IsEmail, IsString, IsNotEmpty, ValidateIf, IsAlphanumeric, MinLength } from 'class-validator';

export class LoginUserDTO {
  @ValidateIf(o => o.email || !o.username)
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ValidateIf(o => o.username || !o.email)
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @MinLength(3)
  public username: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
