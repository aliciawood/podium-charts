import get from 'lodash.get';

export function getRowSummaryMetric(dataRow, aggregationOptions) {
  const { type, dataKeys, options } = aggregationOptions;

  return rowSummaryFunctions[type](dataRow, dataKeys, options);
}

export function getOverallSummaryMetric(data, aggregationOptions) {
  const { type, dataKeys, options } = aggregationOptions;
  return datasetSummaryFunctions[type](data, dataKeys, options);
}

// Helpers

const rowTotal = (row, dataKeys) => {
  let sum = 0;
  for (let key of dataKeys) {
    const value = get(row, key, 0);
    if (isNumeric(value)) {
      sum += value;
    }
  }
  return sum;
};

const rowAvg = (row, dataKeys) => {
  let sum = 0;
  let usedKeys = 0;
  for (let key of dataKeys) {
    const value = get(row, key, 0);
    if (isNumeric(value)) {
      sum += value;
      usedKeys++;
    }
  }
  return usedKeys === 0 ? null : sum / usedKeys;
};

const isWeightedAvgOptions = options => {
  return options && options.valueKey && options.countKey;
};

const rowWeightedAvg = (row, dataKeys, options) => {
  if (!isWeightedAvgOptions(options)) {
    throw new TypeError('Malformed weighted average options');
  }
  const { valueKey, countKey } = options;
  let sum = 0;
  let totalCount = 0;
  for (let key of dataKeys) {
    const value = get(row, [key, valueKey], null);
    const count = get(row, [key, countKey], null);
    if (isNumeric(value) && isNumeric(count)) {
      sum += value * count;
      totalCount += count;
    }
  }
  return totalCount === 0 ? null : sum / totalCount;
};

const rowSummaryFunctions = {
  total: rowTotal,
  avg: rowAvg,
  weightedAvg: rowWeightedAvg
};

const dataSetTotal = (data, dataKeys) =>
  data.reduce((acc, row) => {
    return rowSummaryFunctions.total(row, dataKeys) + acc;
  }, 0);

const datasetAvg = (data, dataKeys) => {
  let sum = 0;
  let usedKeys = 0;
  for (let row of data) {
    for (let key of dataKeys) {
      const value = get(row, key, 0);
      if (isNumeric(value)) {
        sum += value;
        usedKeys++;
      }
    }
  }
  return usedKeys === 0 ? null : sum / usedKeys;
};

const datasetWeightedAvg = (data, dataKeys, options) => {
  if (!isWeightedAvgOptions(options)) {
    throw new TypeError('Malformed weighted average options');
  }
  const { valueKey, countKey } = options;
  let sum = 0;
  let totalCount = 0;
  for (let row of data) {
    for (let key of dataKeys) {
      const value = get(row, [key, valueKey], null);
      const count = get(row, [key, countKey], null);
      if (isNumeric(value) && isNumeric(count)) {
        sum += value * count;
        totalCount += count;
      }
    }
  }
  return totalCount === 0 ? null : sum / totalCount;
};

const datasetSummaryFunctions = {
  total: dataSetTotal,
  avg: datasetAvg,
  weightedAvg: datasetWeightedAvg
};

function isNumeric(value) {
  return value !== undefined && value !== null;
}
