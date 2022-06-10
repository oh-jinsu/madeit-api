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
import { RemoteFileStorage } from "src/infrastructure/sources/remote_file_storage";

@Injectable()
export class ImageRepositoryImpl implements ImageRepository {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly adaptee: Repository<ImageEntity>,
    private readonly storage: RemoteFileStorage,
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

    this.storage.upload(`${id}`, buffer, mimetype);

    const [mdpi, xhdpi, xxhdpi] = await Promise.all([
      sharp(buffer).resize(375).withMetadata().toBuffer(),
      sharp(buffer).resize(768).withMetadata().toBuffer(),
      sharp(buffer).resize(1024).withMetadata().toBuffer(),
    ]);

    await Promise.all([
      this.storage.upload(`${id}/mdpi`, mdpi, mimetype),
      this.storage.upload(`${id}/xhdpi`, xhdpi, mimetype),
      this.storage.upload(`${id}/xxhdpi`, xxhdpi, mimetype),
    ]);

    const entity = await this.adaptee.save(newone);

    return ImageMapper.toModel(entity);
  }

  async delete(id: string): Promise<void> {
    await Promise.all([this.adaptee.delete(id), this.storage.remove(id)]);
  }
}
