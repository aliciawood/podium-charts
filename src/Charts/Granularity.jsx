import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, colors } from '@podiumhq/podium-ui';
import styled from 'styled-components';
import moment from 'moment';

const GranularityWrapper = styled.div`
  width: 200px;
  div span div {
    color: ${colors.jumbo};
    width: inherit;
    padding-right: 0px;
    border: 2px solid ${colors.mystic};
  }
  div ul {
    width: 90%;
  }
`;

const byMonth = { value: 'month', label: 'By Month' };
const byWeek = { value: 'week', label: 'By Week' };
const byDay = { value: 'day', label: 'By Day' };
const byHour = { value: 'hour', label: 'By Hour' };

const optionsMap = {
  gtNinetyDays: [byMonth, byWeek],
  gtThirtyOneDays: [byMonth, byWeek, byDay],
  ltThirtyOneDays: [byDay],
  lastMonth: [byWeek, byDay],
  last12Months: [byMonth, byWeek],
  lastWeek: [byDay, byHour],
  lastYear: [byMonth, byWeek],
  monthToDate: [byWeek, byDay],
  today: [byHour],
  weekToDate: [byDay, byHour],
  yearToDate: [byMonth, byWeek],
  yesterday: [byHour]
};

export const getOptions = (
  timeRange,
  exclude = [],
  dateStart = null,
  dateEnd = null
) => {
  const resolvedTimeRange =
    timeRange === 'custom' ? getCustomRange(dateStart, dateEnd) : timeRange;
  const availableOptions = optionsMap[resolvedTimeRange].filter(granularity => {
    return !exclude.includes(granularity.value);
  });
  return availableOptions || optionsMap.monthToDate;
};

const getCustomRange = (dateStart, dateEnd) => {
  const dateStartMoment = moment(dateStart);
  const dateEndMoment = moment(dateEnd);
  const days = dateEndMoment.diff(dateStartMoment, 'days');

  if (days <= 31) {
    return 'ltThirtyOneDays';
  } else if (days <= 90) {
    return 'gtThirtyOneDays';
  } else {
    return 'gtNinetyDays';
  }
};

export default class Granularity extends Component {
  timeRangeChanged = prevProps => {
    const { timeRange, dateStart, dateEnd } = this.props;
    return (
      prevProps.timeRange !== timeRange ||
      prevProps.dateStart !== dateStart ||
      prevProps.dateEnd !== dateEnd
    );
  };

  componentDidUpdate = prevProps => {
    const {
      value,
      onChange,
      timeRange,
      exclude,
      dateStart,
      dateEnd
    } = this.props;
    if (this.timeRangeChanged(prevProps)) {
      const options = getOptions(timeRange, exclude, dateStart, dateEnd);
      const validRangeValues = options.map(option => option.value);
      if (!validRangeValues.includes(value)) onChange(validRangeValues[0]);
    }
  };

  render() {
    const {
      value,
      onChange,
      timeRange,
      exclude,
      dateStart,
      dateEnd
    } = this.props;
    const options = getOptions(timeRange, exclude, dateStart, dateEnd);
    const placeholder = options[0].label || '';

    return (
      <GranularityWrapper>
        <Select
          options={options}
          placeholder={placeholder}
          onChange={onChange}
          theme="light"
          value={value}
        />
      </GranularityWrapper>
    );
  }
}

Granularity.propTypes = {
  value: PropTypes.string,
  dateEnd: PropTypes.string,
  onChange: PropTypes.func,
  dateStart: PropTypes.string,
  timeRange: PropTypes.oneOf([
    'custom',
    'lastMonth',
    'last12Months',
    'lastWeek',
    'lastYear',
    'monthToDate',
    'today',
    'weekToDate',
    'yearToDate',
    'yesterday'
  ]),
  exclude: PropTypes.arrayOf(PropTypes.oneOf(['month', 'week', 'day', 'hour']))
};

Granularity.defaultProps = {
  timeRange: 'monthToDate',
  exclude: []
};
