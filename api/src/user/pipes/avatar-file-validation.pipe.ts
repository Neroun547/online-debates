
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { getImageExtByMimetype } from '../utils/utils';
import { rename } from "fs/promises";

@Injectable()
export class AvatarFileValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const maxSize = process.env.USER_AVATAR_MAX_SIZE ? Number(process.env.USER_AVATAR_MAX_SIZE) : 31457280;

    if(value.size > maxSize) {
      throw new BadRequestException({ message: "File too large" });
    }
    const fileExtension = getImageExtByMimetype(value.mimetype);

    if(!fileExtension) {
      throw new BadRequestException({ message: "Wrong extension" });
    }
    try {
      await rename(value.path, value.path + fileExtension);
    } catch(error) {
      throw new InternalServerErrorException({ message: "Failed to save file" });
    }
    return {
      ...value,
      filename: value.filename + fileExtension,
      path: value.path + fileExtension
    };
  }
}
