import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 } from "uuid";
import { ImageEntity } from "./entity";
import { ImageMapper } from "./mapper";
import * as sharp from "sharp";
import { None, Option, Some } from "src/domain/common/enum";
import { ImageModel } from "src/domain/models/image";
import { ImageRepository, SaveImageDto } from "src/domain/repositories/image";
import s3 from "src/infrastructure/sources/s3";

@Injectable()
export class ImageRepositoryImpl implements ImageRepository {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly adaptee: Repository<ImageEntity>,
  ) {}

  async findOne(id: string): Promise<Option<ImageModel>> {
    const entity = await this.adaptee.findOne({ where: { id } });

    if (!entity) {
      return new None();
    }

    return new Some(ImageMapper.toModel(entity));
  }

  async save({ userId, buffer, mimetype }: SaveImageDto): Promise<ImageModel> {
    const id = v4();

    const newone = this.adaptee.create({ id, userId });

    s3.upload(`${id}`, buffer, mimetype);

    const [mdpi, xhdpi, xxhdpi] = await Promise.all([
      sharp(buffer).resize(375).withMetadata().toBuffer(),
      sharp(buffer).resize(768).withMetadata().toBuffer(),
      sharp(buffer).resize(1024).withMetadata().toBuffer(),
    ]);

    await Promise.all([
      s3.upload(`${id}/mdpi`, mdpi, mimetype),
      s3.upload(`${id}/xhdpi`, xhdpi, mimetype),
      s3.upload(`${id}/xxhdpi`, xxhdpi, mimetype),
    ]);

    const entity = await this.adaptee.save(newone);

    return ImageMapper.toModel(entity);
  }

  async delete(id: string): Promise<void> {
    await Promise.all([this.adaptee.delete(id), s3.remove(id)]);
  }
}
