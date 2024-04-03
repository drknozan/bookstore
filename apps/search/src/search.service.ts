import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async insertIndex<T>({
    index,
    id,
    data,
  }: {
    index: string;
    id: string;
    data: T;
  }) {
    const { body } = await this.elasticsearchService.index({
      index,
      id,
      body: {
        ...data,
      },
    });

    return body.result;
  }
}
