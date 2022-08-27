import defaults from 'lodash/defaults';
import { Observable, merge } from 'rxjs';
import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  CircularDataFrame,
  FieldType,
  LoadingState,
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions, defaultQuery } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(
    instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>
  ) {
    super(instanceSettings);
  }

  query(options: DataQueryRequest<MyQuery>): Observable<DataQueryResponse> {
    // const { range } = options;
    // const from = range!.from.valueOf();
    // const to = range!.to.valueOf();

    // Return a constant for each query.
    const data = options.targets.map((target) => {
      const query = defaults(target, defaultQuery);
      return new Observable<DataQueryResponse>((subscriber) => {
        const frame = new CircularDataFrame({
          append: 'tail',
          capacity: 10000,
        });

        frame.refId = query.refId;
        frame.addField({ name: 'time', type: FieldType.time });
        frame.addField({ name: 'value', type: FieldType.number });
        frame.addField({ name: 'debug', type: FieldType.other });
        let t = 0;
        const intervalId = setInterval(() => {
          frame.add({
            time: Date.now(),
            value:
              Math.sin((2 * Math.PI * t++ * query.frequency) / 1000) +
              query.offset,
          });
          subscriber.next({
            data: [frame],
            key: query.refId,
            state: LoadingState.Streaming,
          });
        }, 100);

        return () => {
          console.log(`cleaning up query: ${query}`);
          clearInterval(intervalId);
        };
      });
    });

    return merge(...data);
    // return { data };
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
