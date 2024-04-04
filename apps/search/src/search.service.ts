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

  async searchIndex({
    index,
    query,
    fields,
    page,
    limit,
  }: {
    index: string;
    query: string;
    fields: string[];
    page?: number;
    limit?: number;
  }) {
    const from = (page - 1) * limit;
    const size = limit;

    const { body } = await this.elasticsearchService.search({
      index,
      body: {
        from,
        size,
        query: {
          multi_match: {
            query,
            type: 'cross_fields',
            fields,
            operator: 'or',
          },
        },
      },
    });

    const results = body.hits.hits.map((res) => res._source);

    return { resultCount: body.hits.total.value, results };
  }

  async updateIndex<T>({
    index,
    id,
    data,
  }: {
    index: string;
    id: string;
    data: T;
  }) {
    const { body } = await this.elasticsearchService.update({
      index,
      id,
      body: {
        doc: data,
      },
    });

    return body.result;
  }

  async deleteIndex({ index, id }: { index: string; id: string }) {
    const { body } = await this.elasticsearchService.delete({
      index,
      id,
    });

    return body.result;
  }
}
