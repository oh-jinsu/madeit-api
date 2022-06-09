import { HttpException } from "@nestjs/common";
import { UseCaseResult } from "src/domain/common/usecase_result";

export type ExceptionResponse = {
  status: number;
  message: string;
};

export abstract class AbstractController {
  response<T>(result: UseCaseResult<T>): { [key: string]: any } {
    if (result.isException()) {
      const { code } = result;

      const { status, message } = this.getExceptionResult(code);

      throw new HttpException(
        {
          code,
          message,
        },
        status,
      );
    }

    if (result.isOk()) {
      return AbstractController.mapSnakeCase(result.value);
    }

    throw Error();
  }

  private static mapSnakeCase(value: any): any {
    if (value === null || value === undefined) {
      return null;
    }

    if (Array.isArray(value)) {
      return value.map(AbstractController.mapSnakeCase);
    }

    if (value.constructor === Object) {
      const result = {};

      Object.entries(value).forEach(([key, value]) => {
        const mappedKey = key.replace(/[A-Z]/g, (substring) => {
          return `_${substring.toLowerCase()}`;
        });

        result[mappedKey] = AbstractController.mapSnakeCase(value);
      });

      return result;
    }

    return value;
  }

  private getExceptionResult(code: number): ExceptionResponse {
    switch (code) {
      case 102:
        return {
          status: 401,
          message: "유효하지 않은 인증정보입니다.",
        };
      case 104:
        return {
          status: 403,
          message: "권한이 없습니다.",
        };
      default:
        return (
          this.inform(code) ?? {
            status: 500,
            message: "처리되지 않은 예외입니다.",
          }
        );
    }
  }

  protected inform(code: number): ExceptionResponse {
    switch (code) {
      default:
        return null;
    }
  }
}
