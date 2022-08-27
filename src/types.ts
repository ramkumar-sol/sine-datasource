import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MyQuery extends DataQuery {
  /**
   * Offset for the sine wave
   */
  offset: number;
  /**
   * Frequency of the wave - cycles per minute
   */
  frequency: number;
}

export const defaultQuery: Partial<MyQuery> = {
  offset: 0,
  frequency: 2,
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  path?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey?: string;
}
