import { UseCaseResult } from "./usecase_result";

export abstract class UseCase<T, K> {
  abstract execute(params: T): Promise<UseCaseResult<K>>;
}
