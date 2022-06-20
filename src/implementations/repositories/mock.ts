import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectID,
  ObjectLiteral,
  Repository,
  UpdateResult,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export class MockRepository<T extends ObjectLiteral> implements Repository<T> {
  target = "";
  manager = null;
  metadata = null;
  createQueryBuilder = jest.fn();
  hasId = jest.fn();
  getId = jest.fn();
  create = jest.fn();
  merge = jest.fn();
  preload = jest.fn();
  save = jest.fn();
  remove = jest.fn();
  softRemove = jest.fn();
  recover = jest.fn();
  insert = jest.fn();
  update = jest.fn<
    Promise<UpdateResult>,
    [
      (
        | string
        | string[]
        | number
        | number[]
        | Date
        | Date[]
        | ObjectID
        | ObjectID[]
        | FindOptionsWhere<T>
      ),
      QueryDeepPartialEntity<T>,
    ]
  >();
  upsert = jest.fn();
  delete = jest.fn<
    Promise<DeleteResult>,
    [
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectID
      | ObjectID[]
      | FindOptionsWhere<T>,
    ]
  >();
  softDelete = jest.fn();
  restore = jest.fn();
  count = jest.fn<Promise<number>, [FindManyOptions<T>]>();
  countBy = jest.fn();
  find = jest.fn<Promise<T[]>, [FindManyOptions<T>]>();
  findBy = jest.fn();
  findAndCount = jest.fn();
  findAndCountBy = jest.fn();
  findByIds = jest.fn();
  findOne = jest.fn<Promise<T | null>, [FindOneOptions<T>]>();
  findOneBy = jest.fn();
  findOneById = jest.fn();
  findOneOrFail = jest.fn();
  findOneByOrFail = jest.fn();
  query = jest.fn();
  clear = jest.fn();
  increment = jest.fn();
  decrement = jest.fn();
  extend = jest.fn();
}
