import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, MyDataSourceOptions, MyQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onOffsetChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, offset: parseFloat(event.target.value) });
    // executes the query
    onRunQuery();
  };

  onFrequencyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, frequency: parseInt(event.target.value) });
    // executes the query
    onRunQuery();
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { frequency, offset } = query;

    return (
      <div className="gf-form">
        <FormField
          width={4}
          value={offset}
          onChange={this.onOffsetChange}
          label="Offset"
          type="number"
          step="0.1"
        />
        <FormField
          width={4}
          value={frequency}
          onChange={this.onFrequencyChange}
          label="Frequency"
          type="number"
          step="1"
        />
      </div>
    );
  }
}
