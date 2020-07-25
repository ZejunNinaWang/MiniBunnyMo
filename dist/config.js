"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var _default = {
  PORT: process.env.PORT || 5000,
  MONGODB_URL1: process.env.MONGODB_URL || 'mongodb://localhost/MiniBunnyMo',
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb+srv://zejunWang:jackcaI1!@bunnycluster.gx7o1.mongodb.net/<dbname>?retryWrites=true&w=majority',
  JWT_SECRET: process.env.JWT_SECRET || 'somethingsecret'
};
exports["default"] = _default;