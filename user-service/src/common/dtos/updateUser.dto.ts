import { IsString, IsBase64 } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  displayName: string;

  @IsString()
  profileBio: string;

  @IsBase64()
  photo: string;
}
