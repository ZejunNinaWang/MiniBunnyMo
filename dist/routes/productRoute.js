"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _productModel = _interopRequireDefault(require("../models/productModel"));

var _util = require("../util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var productRoute = _express["default"].Router();

productRoute.get('/', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var category, searchKeyword, sortOrder, products;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            category = req.query.category ? {
              category: req.query.category
            } : {};
            searchKeyword = req.query.searchKeyword ? {
              name: {
                $regex: req.query.searchKeyword,
                $options: 'i' //case insensitive

              }
            } : {};
            sortOrder = req.query.sortOrder ? req.query.sortOrder === 'lowest' ? {
              price: 1
            } //ascending
            : {
              price: -1
            } //descending
            : {
              _id: -1
            };
            _context.next = 5;
            return _productModel["default"].find(_objectSpread(_objectSpread({}, category), searchKeyword)).sort(sortOrder);

          case 5:
            products = _context.sent;
            res.send(products);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
productRoute.get('/:id', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var product;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _productModel["default"].findById(req.params.id);

          case 2:
            product = _context2.sent;

            if (product) {
              res.send(product);
            } else {
              res.status(404).send({
                message: 'Product Not Found.'
              });
            }

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
productRoute.post("/", /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var product, newProduct;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log("in post product");
            _context3.prev = 1;
            product = new _productModel["default"]({
              name: req.body.name,
              price: req.body.price,
              image: req.body.image,
              brand: req.body.brand,
              category: req.body.category,
              countInStock: req.body.countInStock,
              description: req.body.description // rating: req.body.rating,
              // numReviews: req.body.numReviews,

            });
            _context3.next = 5;
            return product.save();

          case 5:
            newProduct = _context3.sent;

            if (newProduct) {
              res.status(201).send({
                msg: "New Product Created",
                data: newProduct
              });
            } else {
              res.status(500).send({
                msg: 'Error in Creating Product.'
              });
            }

            _context3.next = 12;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](1);
            res.status(500).send({
              msg: _context3.t0.message
            });

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 9]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
productRoute.put("/:id", /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var productId, product, updatedProduct;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            productId = req.params.id;
            _context4.next = 4;
            return _productModel["default"].findById(productId);

          case 4:
            product = _context4.sent;

            if (!product) {
              _context4.next = 17;
              break;
            }

            product.name = req.body.name;
            product.price = req.body.price;
            product.image = req.body.image;
            product.brand = req.body.brand;
            product.category = req.body.category;
            product.countInStock = req.body.countInStock;
            product.description = req.body.description;
            _context4.next = 15;
            return product.save();

          case 15:
            updatedProduct = _context4.sent;

            if (updatedProduct) {
              res.status(200).send({
                msg: "Product Updated.",
                data: updatedProduct
              });
            } else {
              res.status(500).send({
                msg: 'Error in Updating Product.'
              });
            }

          case 17:
            _context4.next = 22;
            break;

          case 19:
            _context4.prev = 19;
            _context4.t0 = _context4["catch"](0);
            res.status(500).send({
              msg: _context4.t0.message
            });

          case 22:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 19]]);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
productRoute["delete"]("/:id", /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var deletedProduct;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return _productModel["default"].findById(req.params.id);

          case 3:
            deletedProduct = _context5.sent;

            if (!deletedProduct) {
              _context5.next = 10;
              break;
            }

            _context5.next = 7;
            return deletedProduct.remove();

          case 7:
            res.send({
              msg: 'Product Deleted.'
            });
            _context5.next = 11;
            break;

          case 10:
            res.status(404).send({
              msg: 'Rroduct Not Found.'
            });

          case 11:
            _context5.next = 16;
            break;

          case 13:
            _context5.prev = 13;
            _context5.t0 = _context5["catch"](0);
            res.status(500).send({
              msg: "Error in Deletion " + _context5.t0.message
            });

          case 16:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 13]]);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
productRoute.post('/:id/reviews', _util.isAuth, /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    var product, review, updatedProduct;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _productModel["default"].findById(req.params.id);

          case 2:
            product = _context6.sent;

            if (!product) {
              _context6.next = 14;
              break;
            }

            review = {
              name: req.body.name,
              rating: Number(req.body.rating),
              comment: req.body.comment
            };
            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce(function (a, c) {
              return c.rating + a;
            }, 0) / product.reviews.length;
            _context6.next = 10;
            return product.save();

          case 10:
            updatedProduct = _context6.sent;
            res.status(201).send({
              data: updatedProduct.reviews[updatedProduct.reviews.length - 1],
              message: 'Review saved successfully.'
            });
            _context6.next = 15;
            break;

          case 14:
            res.status(404).send({
              message: 'Product Not Found'
            });

          case 15:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());
var _default = productRoute;
exports["default"] = _default;