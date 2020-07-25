"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _userModel = _interopRequireDefault(require("../models/userModel"));

var _util = require("../util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var userRoute = _express["default"].Router(); //create a route from admin


userRoute.get("/createadmin", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var user, newUser;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            user = new _userModel["default"]({
              name: 'Zejun',
              email: 'wangzejunnina@gmail.com',
              password: '1234',
              isAdmin: true
            });
            _context.next = 4;
            return user.save();

          case 4:
            newUser = _context.sent;
            res.send({
              msg: "hehe2",
              newUser: newUser
            });
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            res.send({
              msg: _context.t0.message + "wwtttff"
            });

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 8]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
userRoute.post("/signin", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var signinUser;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _userModel["default"].findOne({
              email: req.body.email,
              password: req.body.password
            });

          case 3:
            signinUser = _context2.sent;

            if (signinUser) {
              res.send({
                _id: signinUser.id,
                name: signinUser.name,
                email: signinUser.email,
                isAdmin: signinUser.isAdmin,
                token: (0, _util.getToken)(signinUser)
              });
            } else {
              res.status(401).send({
                message: 'Invalid Email or Password.'
              });
            }

            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            res.status(500).send({
              message: 'Server error'
            });

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 7]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}()); //update

userRoute.put('/:id', _util.isAuth, /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var userId, user, updatedUser;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            userId = req.params.id;
            _context3.next = 3;
            return _userModel["default"].findById(userId);

          case 3:
            user = _context3.sent;

            if (!user) {
              _context3.next = 14;
              break;
            }

            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.password = req.body.password || user.password;
            _context3.next = 10;
            return user.save();

          case 10:
            updatedUser = _context3.sent;
            res.send({
              _id: updatedUser.id,
              name: updatedUser.name,
              email: updatedUser.email,
              isAdmin: updatedUser.isAdmin,
              token: (0, _util.getToken)(updatedUser)
            });
            _context3.next = 15;
            break;

          case 14:
            res.status(404).send({
              message: 'User Not Found'
            });

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
userRoute.post("/register", /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var user, newUser;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            console.log("aaa");
            user = new _userModel["default"]({
              name: req.body.name,
              email: req.body.email,
              password: req.body.password
            });
            console.log("bbb");
            _context4.next = 6;
            return user.save();

          case 6:
            newUser = _context4.sent;
            console.log("ccc");

            if (newUser) {
              console.log('new name is ', newUser.name);
              res.send({
                _id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                isAdmin: newUser.isAdmin,
                token: (0, _util.getToken)(newUser)
              });
            } else {
              res.status(401).send({
                message: 'Invalid User Info'
              });
            }

            _context4.next = 14;
            break;

          case 11:
            _context4.prev = 11;
            _context4.t0 = _context4["catch"](0);
            res.status(500).send({
              msg: _context4.t0.message
            });

          case 14:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 11]]);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
var _default = userRoute;
exports["default"] = _default;