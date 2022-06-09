import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";

export const BearerToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    try {
      const request = ctx.switchToHttp().getRequest<Request>();

      const bearerToken = request.headers.authorization;

      return bearerToken.trim().replace("Bearer ", "");
    } catch {
      throw new UnauthorizedException();
    }
  },
);
