import { Post } from "@nestjs/common";
import { AbstractController } from "./adapter";

export abstract class PostAdapter extends AbstractController {
  @Post()
  protected post(): any {
    return null;
  }
}
