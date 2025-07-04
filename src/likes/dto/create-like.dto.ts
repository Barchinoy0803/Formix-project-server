import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLikeDto {
  @IsString()
  @IsNotEmpty()
  templateId: string;
}

export class GetLikesDto {
  @IsString()
  @IsNotEmpty()
  templateId: string;
}