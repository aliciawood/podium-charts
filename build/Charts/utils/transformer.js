function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import groupBy from 'lodash.groupby';
import cloneDeep from 'lodash.clonedeep';
import set from 'lodash.set';
export var singleDataset = function singleDataset(data) {
  var groupedData = groupBy(cloneDeep(data), 'granularity');
  return Object.keys(groupedData).map(function (gran) {
    return groupedData[gran].reduce(function (newRow, currData) {
      var dataKey = currData.groupBy || 'value';
      newRow[dataKey] = currData.value;
      return newRow;
    }, {
      date: gran
    });
  });
};
export var multiDataset = function multiDataset(data) {
  var groupBy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  if (!data) return [];
  var combinedData = Object.keys(data).reduce(function (outsideAcc, alias) {
    // Look at tests in src/__tests__/transformer.test.js for examples
    // There are three ways to use this transformer:
    //   1) Pass in custom groupBy resulting in:
    //     ({granularity: "2018-1-01", value}, groupBy) => { "2018-1-01": { groupBy: { alias1: 1, alias2: 2 }}}
    //   2) Use groupBy from query that's on the row resulting in:
    //     { "2018-1-01": { [row.groupBy]: { alias1: 1, alias2: 2 }}}
    //   3) No groupBy or row.groupBy resulting in no nesting resulting in:
    //     { "2018-1-01": { alias1: 1, alias2: 2 }}
    return data[alias].reduce(function (insideAcc, row) {
      if (groupBy) {
        return set(insideAcc, [row.granularity, groupBy, alias], row.value);
      } else if (row.groupBy) {
        return set(insideAcc, [row.granularity, row.groupBy, alias], row.value);
      }

      return set(insideAcc, [row.granularity, alias], row.value);
    }, outsideAcc);
  }, {}); // We now map through each date and flatten the object into a single layer
  // example: { date: "2018-1-01", google: { alias1: 1, alias2: 2 } }

  return Object.keys(combinedData).map(function (granularity) {
    var dateData = combinedData[granularity];
    return _objectSpread({}, dateData, {
      date: granularity
    });
  });
};
export default {
  singleDataset: singleDataset,
  multiDataset: multiDataset
};