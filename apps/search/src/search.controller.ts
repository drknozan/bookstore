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

  @MessagePattern({ cmd: 'search_es' })
  async searchIndex(
    @Ctx() context: RmqContext,
    @Payload()
    payload: {
      index: string;
      query: string;
      fields: string[];
      page: number;
      limit: number;
    },
  ) {
    const { index, query, fields, page, limit } = payload;

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);

    const result = await this.searchService.searchIndex({
      index,
      query,
      fields,
      page,
      limit,
    });

    return result;
  }

  @MessagePattern({ cmd: 'update_es' })
  async updateIndex<T>(
    @Ctx() context: RmqContext,
    @Payload()
    payload: {
      index: string;
      id: string;
      data: T;
    },
  ) {
    const { index, id, data } = payload;

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);

    const result = await this.searchService.updateIndex({
      index,
      id,
      data,
    });

    return result;
  }

  @MessagePattern({ cmd: 'delete_es' })
  async deleteIndex(
    @Ctx() context: RmqContext,
    @Payload()
    payload: {
      index: string;
      id: string;
    },
  ) {
    const { index, id } = payload;

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);

    const result = await this.searchService.deleteIndex({
      index,
      id,
    });

    return result;
  }
}
