import { IsString, IsNotEmpty, IsBase64 } from 'class-validator';

export class CreatePostDTO {
  @IsBase64()
  @IsNotEmpty()
  public photo: string;

  @IsString()
  public caption: string;
}
