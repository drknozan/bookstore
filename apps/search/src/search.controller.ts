import { Controller } from '@nestjs/common';
import { SearchService } from './search.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @MessagePattern({ cmd: 'insert_es' })
  async insertIndex<T>(
    @Ctx() context: RmqContext,
    @Payload() payload: { index: string; id: string; data: T },
  ) {
    const { index, id, data } = payload;

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);

    const result = await this.searchService.insertIndex({
      index: index,
      id,
      data,
    });

    return result;
  }
}
