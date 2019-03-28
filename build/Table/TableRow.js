"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TableRow;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _TableStyledComponents = require("./TableStyledComponents");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TableRow(_ref) {
  var children = _ref.children;
  return _react.default.createElement(_TableStyledComponents.TableRowWrapper, null, children);
}

TableRow.propTypes = {
  children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.node), _propTypes.default.node])
};
TableRow.defaultProps = {
  children: null
};