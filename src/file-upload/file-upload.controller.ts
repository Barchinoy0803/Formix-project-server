import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'nestjs-cloudinary';
import { Express } from 'express';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File) {
    const { url } = await this.cloudinaryService.uploadFile(file);
    return { url };
  }
}
