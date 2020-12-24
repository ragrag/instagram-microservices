import { IsEmail, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  public email: string;

  @IsString()
  public username: string;

  @IsString()
  public password: string;
}
