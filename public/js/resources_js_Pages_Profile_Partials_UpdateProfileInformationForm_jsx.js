"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Pages_Profile_Partials_UpdateProfileInformationForm_jsx"],{

/***/ "./resources/js/Components/InputError.jsx":
/*!************************************************!*\
  !*** ./resources/js/Components/InputError.jsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InputError)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _excluded = ["message", "className"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
function InputError(_ref) {
  var message = _ref.message,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? '' : _ref$className,
    props = _objectWithoutProperties(_ref, _excluded);
  return message ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", _objectSpread(_objectSpread({}, props), {}, {
    className: 'text-sm text-red-600 ' + className,
    children: message
  })) : null;
}

/***/ }),

/***/ "./resources/js/Components/InputLabel.jsx":
/*!************************************************!*\
  !*** ./resources/js/Components/InputLabel.jsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InputLabel)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _excluded = ["value", "className", "children"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
function InputLabel(_ref) {
  var value = _ref.value,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? '' : _ref$className,
    children = _ref.children,
    props = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", _objectSpread(_objectSpread({}, props), {}, {
    className: "block font-medium text-sm text-gray-700 " + className,
    children: value ? value : children
  }));
}

/***/ }),

/***/ "./resources/js/Components/PrimaryButton.jsx":
/*!***************************************************!*\
  !*** ./resources/js/Components/PrimaryButton.jsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PrimaryButton)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _excluded = ["className", "disabled", "children"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
function PrimaryButton(_ref) {
  var _ref$className = _ref.className,
    className = _ref$className === void 0 ? '' : _ref$className,
    disabled = _ref.disabled,
    children = _ref.children,
    props = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", _objectSpread(_objectSpread({}, props), {}, {
    className: "inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ".concat(disabled && 'opacity-25', " ") + className,
    disabled: disabled,
    children: children
  }));
}

/***/ }),

/***/ "./resources/js/Components/TextInput.jsx":
/*!***********************************************!*\
  !*** ./resources/js/Components/TextInput.jsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _excluded = ["type", "className", "isFocused"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function TextInput(_ref, ref) {
  var _ref$type = _ref.type,
    type = _ref$type === void 0 ? 'text' : _ref$type,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? '' : _ref$className,
    _ref$isFocused = _ref.isFocused,
    isFocused = _ref$isFocused === void 0 ? false : _ref$isFocused,
    props = _objectWithoutProperties(_ref, _excluded);
  var input = ref ? ref : (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (isFocused) {
      input.current.focus();
    }
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", _objectSpread(_objectSpread({}, props), {}, {
    type: type,
    className: 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' + className,
    ref: input
  }));
}));

/***/ }),

/***/ "./resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.jsx":
/*!******************************************************************************!*\
  !*** ./resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.jsx ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UpdateProfileInformation)
/* harmony export */ });
/* harmony import */ var _Components_InputError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/Components/InputError */ "./resources/js/Components/InputError.jsx");
/* harmony import */ var _Components_InputLabel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/Components/InputLabel */ "./resources/js/Components/InputLabel.jsx");
/* harmony import */ var _Components_PrimaryButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/Components/PrimaryButton */ "./resources/js/Components/PrimaryButton.jsx");
/* harmony import */ var _Components_TextInput__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/Components/TextInput */ "./resources/js/Components/TextInput.jsx");
/* harmony import */ var _inertiajs_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @inertiajs/react */ "./node_modules/@inertiajs/react/dist/index.esm.js");
/* harmony import */ var _headlessui_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @headlessui/react */ "./node_modules/@headlessui/react/dist/components/transition/transition.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");







function UpdateProfileInformation(_ref) {
  var mustVerifyEmail = _ref.mustVerifyEmail,
    status = _ref.status,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? '' : _ref$className;
  var user = (0,_inertiajs_react__WEBPACK_IMPORTED_MODULE_4__.usePage)().props.auth.user;
  var _useForm = (0,_inertiajs_react__WEBPACK_IMPORTED_MODULE_4__.useForm)({
      name: user.name,
      email: user.email
    }),
    data = _useForm.data,
    setData = _useForm.setData,
    patch = _useForm.patch,
    errors = _useForm.errors,
    processing = _useForm.processing,
    recentlySuccessful = _useForm.recentlySuccessful;
  var submit = function submit(e) {
    e.preventDefault();
    patch(route('profile.update'));
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("section", {
    className: className,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("header", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h2", {
        className: "text-lg font-medium text-gray-900",
        children: "Profile Information"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
        className: "mt-1 text-sm text-gray-600",
        children: "Update your account's profile information and email address."
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("form", {
      onSubmit: submit,
      className: "mt-6 space-y-6",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_Components_InputLabel__WEBPACK_IMPORTED_MODULE_1__["default"], {
          htmlFor: "name",
          value: "Name"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_Components_TextInput__WEBPACK_IMPORTED_MODULE_3__["default"], {
          id: "name",
          className: "mt-1 block w-full",
          value: data.name,
          onChange: function onChange(e) {
            return setData('name', e.target.value);
          },
          required: true,
          isFocused: true,
          autoComplete: "name"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_Components_InputError__WEBPACK_IMPORTED_MODULE_0__["default"], {
          className: "mt-2",
          message: errors.name
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_Components_InputLabel__WEBPACK_IMPORTED_MODULE_1__["default"], {
          htmlFor: "email",
          value: "Email"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_Components_TextInput__WEBPACK_IMPORTED_MODULE_3__["default"], {
          id: "email",
          type: "email",
          className: "mt-1 block w-full",
          value: data.email,
          onChange: function onChange(e) {
            return setData('email', e.target.value);
          },
          required: true,
          autoComplete: "username"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_Components_InputError__WEBPACK_IMPORTED_MODULE_0__["default"], {
          className: "mt-2",
          message: errors.email
        })]
      }), mustVerifyEmail && user.email_verified_at === null && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("p", {
          className: "text-sm mt-2 text-gray-800",
          children: ["Your email address is unverified.", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_inertiajs_react__WEBPACK_IMPORTED_MODULE_4__.Link, {
            href: route('verification.send'),
            method: "post",
            as: "button",
            className: "underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
            children: "Click here to re-send the verification email."
          })]
        }), status === 'verification-link-sent' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
          className: "mt-2 font-medium text-sm text-green-600",
          children: "A new verification link has been sent to your email address."
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "flex items-center gap-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_Components_PrimaryButton__WEBPACK_IMPORTED_MODULE_2__["default"], {
          disabled: processing,
          children: "Save"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_headlessui_react__WEBPACK_IMPORTED_MODULE_6__.Transition, {
          show: recentlySuccessful,
          enter: "transition ease-in-out",
          enterFrom: "opacity-0",
          leave: "transition ease-in-out",
          leaveTo: "opacity-0",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
            className: "text-sm text-gray-600",
            children: "Saved."
          })
        })]
      })]
    })]
  });
}

/***/ }),

/***/ "./node_modules/@headlessui/react/dist/components/transition/transition.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/components/transition/transition.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Transition: () => (/* binding */ Xe),
/* harmony export */   TransitionChild: () => (/* binding */ Ie)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _hooks_use_disposables_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/use-disposables.js */ "./node_modules/@headlessui/react/dist/hooks/use-disposables.js");
/* harmony import */ var _hooks_use_event_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/use-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-event.js");
/* harmony import */ var _hooks_use_is_mounted_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/use-is-mounted.js */ "./node_modules/@headlessui/react/dist/hooks/use-is-mounted.js");
/* harmony import */ var _hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../hooks/use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
/* harmony import */ var _hooks_use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../hooks/use-latest-value.js */ "./node_modules/@headlessui/react/dist/hooks/use-latest-value.js");
/* harmony import */ var _hooks_use_on_disappear_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../hooks/use-on-disappear.js */ "./node_modules/@headlessui/react/dist/hooks/use-on-disappear.js");
/* harmony import */ var _hooks_use_server_handoff_complete_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../hooks/use-server-handoff-complete.js */ "./node_modules/@headlessui/react/dist/hooks/use-server-handoff-complete.js");
/* harmony import */ var _hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/use-sync-refs.js */ "./node_modules/@headlessui/react/dist/hooks/use-sync-refs.js");
/* harmony import */ var _hooks_use_transition_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../hooks/use-transition.js */ "./node_modules/@headlessui/react/dist/hooks/use-transition.js");
/* harmony import */ var _internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../internal/open-closed.js */ "./node_modules/@headlessui/react/dist/internal/open-closed.js");
/* harmony import */ var _utils_class_names_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../utils/class-names.js */ "./node_modules/@headlessui/react/dist/utils/class-names.js");
/* harmony import */ var _utils_match_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/match.js */ "./node_modules/@headlessui/react/dist/utils/match.js");
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/render.js */ "./node_modules/@headlessui/react/dist/utils/render.js");
"use client";function le(e){var t;return!!(e.enter||e.enterFrom||e.enterTo||e.leave||e.leaveFrom||e.leaveTo)||((t=e.as)!=null?t:ue)!==react__WEBPACK_IMPORTED_MODULE_0__.Fragment||react__WEBPACK_IMPORTED_MODULE_0__.Children.count(e.children)===1}let V=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);V.displayName="TransitionContext";var xe=(i=>(i.Visible="visible",i.Hidden="hidden",i))(xe||{});function Ne(){let e=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(V);if(e===null)throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");return e}function _e(){let e=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(w);if(e===null)throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");return e}let w=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);w.displayName="NestingContext";function M(e){return"children"in e?M(e.children):e.current.filter(({el:t})=>t.current!==null).filter(({state:t})=>t==="visible").length>0}function ae(e,t){let i=(0,_hooks_use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__.useLatestValue)(e),l=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([]),S=(0,_hooks_use_is_mounted_js__WEBPACK_IMPORTED_MODULE_2__.useIsMounted)(),E=(0,_hooks_use_disposables_js__WEBPACK_IMPORTED_MODULE_3__.useDisposables)(),u=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_4__.useEvent)((s,r=_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.RenderStrategy.Hidden)=>{let n=l.current.findIndex(({el:o})=>o===s);n!==-1&&((0,_utils_match_js__WEBPACK_IMPORTED_MODULE_6__.match)(r,{[_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.RenderStrategy.Unmount](){l.current.splice(n,1)},[_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.RenderStrategy.Hidden](){l.current[n].state="hidden"}}),E.microTask(()=>{var o;!M(l)&&S.current&&((o=i.current)==null||o.call(i))}))}),y=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_4__.useEvent)(s=>{let r=l.current.find(({el:n})=>n===s);return r?r.state!=="visible"&&(r.state="visible"):l.current.push({el:s,state:"visible"}),()=>u(s,_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.RenderStrategy.Unmount)}),c=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([]),f=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(Promise.resolve()),p=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({enter:[],leave:[]}),m=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_4__.useEvent)((s,r,n)=>{c.current.splice(0),t&&(t.chains.current[r]=t.chains.current[r].filter(([o])=>o!==s)),t==null||t.chains.current[r].push([s,new Promise(o=>{c.current.push(o)})]),t==null||t.chains.current[r].push([s,new Promise(o=>{Promise.all(p.current[r].map(([R,x])=>x)).then(()=>o())})]),r==="enter"?f.current=f.current.then(()=>t==null?void 0:t.wait.current).then(()=>n(r)):n(r)}),C=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_4__.useEvent)((s,r,n)=>{Promise.all(p.current[r].splice(0).map(([o,R])=>R)).then(()=>{var o;(o=c.current.shift())==null||o()}).then(()=>n(r))});return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>({children:l,register:y,unregister:u,onStart:m,onStop:C,wait:f,chains:p}),[y,u,l,m,C,p,f])}let ue=react__WEBPACK_IMPORTED_MODULE_0__.Fragment,Te=_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.RenderFeatures.RenderStrategy;function De(e,t){var Z,$;let{transition:i=!0,beforeEnter:l,afterEnter:S,beforeLeave:E,afterLeave:u,enter:y,enterFrom:c,enterTo:f,entered:p,leave:m,leaveFrom:C,leaveTo:s,...r}=e,n=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),o=le(e),R=(0,_hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_7__.useSyncRefs)(...o?[n,t]:t===null?[]:[t]),x=(Z=r.unmount)==null||Z?_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.RenderStrategy.Unmount:_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.RenderStrategy.Hidden,{show:T,appear:h,initial:X}=Ne(),[g,U]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(T?"visible":"hidden"),z=_e(),{register:A,unregister:I}=z;(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_8__.useIsoMorphicEffect)(()=>A(n),[A,n]),(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_8__.useIsoMorphicEffect)(()=>{if(x===_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.RenderStrategy.Hidden&&n.current){if(T&&g!=="visible"){U("visible");return}return (0,_utils_match_js__WEBPACK_IMPORTED_MODULE_6__.match)(g,{["hidden"]:()=>I(n),["visible"]:()=>A(n)})}},[g,n,A,I,T,x]);let j=(0,_hooks_use_server_handoff_complete_js__WEBPACK_IMPORTED_MODULE_9__.useServerHandoffComplete)();(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_8__.useIsoMorphicEffect)(()=>{if(o&&j&&g==="visible"&&n.current===null)throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?")},[n,g,j,o]);let fe=X&&!h,K=h&&T&&X,G=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),F=ae(()=>{G.current||(U("hidden"),I(n))},z),Q=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_4__.useEvent)(B=>{G.current=!0;let L=B?"enter":"leave";F.onStart(n,L,D=>{D==="enter"?l==null||l():D==="leave"&&(E==null||E())})}),Y=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_4__.useEvent)(B=>{let L=B?"enter":"leave";G.current=!1,F.onStop(n,L,D=>{D==="enter"?S==null||S():D==="leave"&&(u==null||u())}),L==="leave"&&!M(F)&&(U("hidden"),I(n))});(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{o&&i||(Q(T),Y(T))},[T,o,i]);let me=(()=>!(!i||!o||!j||fe))(),[,a]=(0,_hooks_use_transition_js__WEBPACK_IMPORTED_MODULE_10__.useTransition)(me,n,T,{start:Q,end:Y}),ce=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.compact)({ref:R,className:(($=(0,_utils_class_names_js__WEBPACK_IMPORTED_MODULE_11__.classNames)(r.className,K&&y,K&&c,a.enter&&y,a.enter&&a.closed&&c,a.enter&&!a.closed&&f,a.leave&&m,a.leave&&!a.closed&&C,a.leave&&a.closed&&s,!a.transition&&T&&p))==null?void 0:$.trim())||void 0,...(0,_hooks_use_transition_js__WEBPACK_IMPORTED_MODULE_10__.transitionDataAttributes)(a)}),_=0;return g==="visible"&&(_|=_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.State.Open),g==="hidden"&&(_|=_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.State.Closed),a.enter&&(_|=_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.State.Opening),a.leave&&(_|=_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.State.Closing),react__WEBPACK_IMPORTED_MODULE_0__.createElement(w.Provider,{value:F},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.OpenClosedProvider,{value:_},(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.render)({ourProps:ce,theirProps:r,defaultTag:ue,features:Te,visible:g==="visible",name:"Transition.Child"})))}function He(e,t){let{show:i,appear:l=!1,unmount:S=!0,...E}=e,u=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),y=le(e),c=(0,_hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_7__.useSyncRefs)(...y?[u,t]:t===null?[]:[t]);(0,_hooks_use_server_handoff_complete_js__WEBPACK_IMPORTED_MODULE_9__.useServerHandoffComplete)();let f=(0,_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.useOpenClosed)();if(i===void 0&&f!==null&&(i=(f&_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.State.Open)===_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.State.Open),i===void 0)throw new Error("A <Transition /> is used but it is missing a `show={true | false}` prop.");let[p,m]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(i?"visible":"hidden"),C=ae(()=>{i||m("hidden")}),[s,r]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!0),n=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([i]);(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_8__.useIsoMorphicEffect)(()=>{s!==!1&&n.current[n.current.length-1]!==i&&(n.current.push(i),r(!1))},[n,i]);let o=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>({show:i,appear:l,initial:s}),[i,l,s]);(0,_hooks_use_on_disappear_js__WEBPACK_IMPORTED_MODULE_13__.useOnDisappear)(i,u,()=>m("hidden")),(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_8__.useIsoMorphicEffect)(()=>{i?m("visible"):!M(C)&&u.current!==null&&m("hidden")},[i,C]);let R={unmount:S},x=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_4__.useEvent)(()=>{var h;s&&r(!1),(h=e.beforeEnter)==null||h.call(e)}),T=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_4__.useEvent)(()=>{var h;s&&r(!1),(h=e.beforeLeave)==null||h.call(e)});return react__WEBPACK_IMPORTED_MODULE_0__.createElement(w.Provider,{value:C},react__WEBPACK_IMPORTED_MODULE_0__.createElement(V.Provider,{value:o},(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.render)({ourProps:{...R,as:react__WEBPACK_IMPORTED_MODULE_0__.Fragment,children:react__WEBPACK_IMPORTED_MODULE_0__.createElement(de,{ref:c,...R,...E,beforeEnter:x,beforeLeave:T})},theirProps:{},defaultTag:react__WEBPACK_IMPORTED_MODULE_0__.Fragment,features:Te,visible:p==="visible",name:"Transition"})))}function Ae(e,t){let i=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(V)!==null,l=(0,_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.useOpenClosed)()!==null;return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,!i&&l?react__WEBPACK_IMPORTED_MODULE_0__.createElement(J,{ref:t,...e}):react__WEBPACK_IMPORTED_MODULE_0__.createElement(de,{ref:t,...e}))}let J=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.forwardRefWithAs)(He),de=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.forwardRefWithAs)(De),Ie=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.forwardRefWithAs)(Ae),Xe=Object.assign(J,{Child:Ie,Root:J});


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-disposables.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-disposables.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useDisposables: () => (/* binding */ p)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _utils_disposables_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/disposables.js */ "./node_modules/@headlessui/react/dist/utils/disposables.js");
function p(){let[e]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(_utils_disposables_js__WEBPACK_IMPORTED_MODULE_1__.disposables);return (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>()=>e.dispose(),[e]),e}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-event.js":
/*!****************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-event.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useEvent: () => (/* binding */ o)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-latest-value.js */ "./node_modules/@headlessui/react/dist/hooks/use-latest-value.js");
let o=function(t){let e=(0,_use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__.useLatestValue)(t);return react__WEBPACK_IMPORTED_MODULE_0__.useCallback((...r)=>e.current(...r),[e])};


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-flags.js":
/*!****************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-flags.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useFlags: () => (/* binding */ c)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
function c(u=0){let[t,l]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(u),g=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e=>l(e),[t]),s=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e=>l(a=>a|e),[t]),m=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e=>(t&e)===e,[t]),n=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e=>l(a=>a&~e),[l]),F=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e=>l(a=>a^e),[l]);return{flags:t,setFlag:g,addFlag:s,hasFlag:m,removeFlag:n,toggleFlag:F}}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-is-mounted.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-is-mounted.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useIsMounted: () => (/* binding */ f)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
function f(){let e=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1);return (0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.useIsoMorphicEffect)(()=>(e.current=!0,()=>{e.current=!1}),[]),e}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useIsoMorphicEffect: () => (/* binding */ n)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _utils_env_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/env.js */ "./node_modules/@headlessui/react/dist/utils/env.js");
let n=(e,t)=>{_utils_env_js__WEBPACK_IMPORTED_MODULE_1__.env.isServer?(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(e,t):(0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(e,t)};


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-latest-value.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-latest-value.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useLatestValue: () => (/* binding */ s)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
function s(e){let r=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(e);return (0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.useIsoMorphicEffect)(()=>{r.current=e},[e]),r}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-on-disappear.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-on-disappear.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useOnDisappear: () => (/* binding */ m)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _utils_disposables_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/disposables.js */ "./node_modules/@headlessui/react/dist/utils/disposables.js");
/* harmony import */ var _use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-latest-value.js */ "./node_modules/@headlessui/react/dist/hooks/use-latest-value.js");
function m(s,n,l){let i=(0,_use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__.useLatestValue)(t=>{let e=t.getBoundingClientRect();e.x===0&&e.y===0&&e.width===0&&e.height===0&&l()});(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{if(!s)return;let t=n===null?null:n instanceof HTMLElement?n:n.current;if(!t)return;let e=(0,_utils_disposables_js__WEBPACK_IMPORTED_MODULE_2__.disposables)();if(typeof ResizeObserver!="undefined"){let r=new ResizeObserver(()=>i.current(t));r.observe(t),e.add(()=>r.disconnect())}if(typeof IntersectionObserver!="undefined"){let r=new IntersectionObserver(()=>i.current(t));r.observe(t),e.add(()=>r.disconnect())}return()=>e.dispose()},[n,i,s])}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-server-handoff-complete.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-server-handoff-complete.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

var react__WEBPACK_IMPORTED_MODULE_0___namespace_cache;
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useServerHandoffComplete: () => (/* binding */ l)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _utils_env_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/env.js */ "./node_modules/@headlessui/react/dist/utils/env.js");
function s(){let r=typeof document=="undefined";return"useSyncExternalStore" in /*#__PURE__*/ (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(react__WEBPACK_IMPORTED_MODULE_0__, 2)))?(o=>o.useSyncExternalStore)(/*#__PURE__*/ (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(react__WEBPACK_IMPORTED_MODULE_0__, 2))))(()=>()=>{},()=>!1,()=>!r):!1}function l(){let r=s(),[e,n]=react__WEBPACK_IMPORTED_MODULE_0__.useState(_utils_env_js__WEBPACK_IMPORTED_MODULE_1__.env.isHandoffComplete);return e&&_utils_env_js__WEBPACK_IMPORTED_MODULE_1__.env.isHandoffComplete===!1&&n(!1),react__WEBPACK_IMPORTED_MODULE_0__.useEffect(()=>{e!==!0&&n(!0)},[e]),react__WEBPACK_IMPORTED_MODULE_0__.useEffect(()=>_utils_env_js__WEBPACK_IMPORTED_MODULE_1__.env.handoff(),[]),r?!1:e}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-sync-refs.js":
/*!********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-sync-refs.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   optionalRef: () => (/* binding */ T),
/* harmony export */   useSyncRefs: () => (/* binding */ y)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _use_event_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-event.js");
let u=Symbol();function T(t,n=!0){return Object.assign(t,{[u]:n})}function y(...t){let n=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(t);(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{n.current=t},[t]);let c=(0,_use_event_js__WEBPACK_IMPORTED_MODULE_1__.useEvent)(e=>{for(let o of n.current)o!=null&&(typeof o=="function"?o(e):o.current=e)});return t.every(e=>e==null||(e==null?void 0:e[u]))?void 0:c}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-transition.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-transition.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   transitionDataAttributes: () => (/* binding */ A),
/* harmony export */   useTransition: () => (/* binding */ V)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _utils_disposables_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/disposables.js */ "./node_modules/@headlessui/react/dist/utils/disposables.js");
/* harmony import */ var _utils_once_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/once.js */ "./node_modules/@headlessui/react/dist/utils/once.js");
/* harmony import */ var _use_disposables_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./use-disposables.js */ "./node_modules/@headlessui/react/dist/hooks/use-disposables.js");
/* harmony import */ var _use_flags_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-flags.js */ "./node_modules/@headlessui/react/dist/hooks/use-flags.js");
/* harmony import */ var _use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
var D=(i=>(i[i.None=0]="None",i[i.Closed=1]="Closed",i[i.Enter=2]="Enter",i[i.Leave=4]="Leave",i))(D||{});function A(e){let a={};for(let t in e)e[t]===!0&&(a[`data-${t}`]="");return a}function V(e,a,t,r){let[i,u]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(t),{hasFlag:d,addFlag:f,removeFlag:s}=(0,_use_flags_js__WEBPACK_IMPORTED_MODULE_1__.useFlags)(e&&i?3:0),l=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),n=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),o=(0,_use_disposables_js__WEBPACK_IMPORTED_MODULE_2__.useDisposables)();return (0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_3__.useIsoMorphicEffect)(function p(){var T;if(!e)return;t&&u(!0);let c=a.current;return c?((T=r==null?void 0:r.start)==null||T.call(r,t),M(c,{inFlight:l,prepare(){n.current?n.current=!1:n.current=l.current,l.current=!0,!n.current&&(t?(f(3),s(4)):(f(4),s(2)))},run(){n.current?t?(s(3),f(4)):(s(4),f(3)):t?s(1):f(1)},done(){var m;n.current&&typeof c.getAnimations=="function"&&c.getAnimations().length>0||(l.current=!1,s(7),t||u(!1),(m=r==null?void 0:r.end)==null||m.call(r,t))}})):t?(f(3),o.nextFrame(()=>p())):void 0},[e,t,a,o]),e?[i,{closed:d(1),enter:d(2),leave:d(4),transition:d(2)||d(4)}]:[t,{closed:void 0,enter:void 0,leave:void 0,transition:void 0}]}function M(e,{prepare:a,run:t,done:r,inFlight:i}){let u=(0,_utils_disposables_js__WEBPACK_IMPORTED_MODULE_4__.disposables)();return R(e,{prepare:a,inFlight:i}),u.nextFrame(()=>{u.add(F(e,r)),t()}),u.dispose}function F(e,a){let t=(0,_utils_once_js__WEBPACK_IMPORTED_MODULE_5__.once)(a),r=(0,_utils_disposables_js__WEBPACK_IMPORTED_MODULE_4__.disposables)();if(!e)return r.dispose;let{transitionDuration:i,transitionDelay:u}=getComputedStyle(e),[d,f]=[i,u].map(l=>{let[n=0]=l.split(",").filter(Boolean).map(o=>o.includes("ms")?parseFloat(o):parseFloat(o)*1e3).sort((o,p)=>p-o);return n}),s=d+f;if(s!==0){let l=r.group(n=>{let o=n.setTimeout(()=>{t(),n.dispose()},s);n.addEventListener(e,"transitionrun",p=>{p.target===p.currentTarget&&(o(),n.addEventListener(e,"transitioncancel",c=>{c.target===c.currentTarget&&(t(),l())}))})});r.addEventListener(e,"transitionend",n=>{n.target===n.currentTarget&&(t(),r.dispose())})}else t();return r.dispose}function R(e,{inFlight:a,prepare:t}){if(a!=null&&a.current){t();return}let r=e.style.transition;e.style.transition="none",t(),e.offsetHeight,e.style.transition=r}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/internal/open-closed.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/internal/open-closed.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OpenClosedProvider: () => (/* binding */ c),
/* harmony export */   ResetOpenClosedProvider: () => (/* binding */ s),
/* harmony export */   State: () => (/* binding */ i),
/* harmony export */   useOpenClosed: () => (/* binding */ u)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
let n=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);n.displayName="OpenClosedContext";var i=(e=>(e[e.Open=1]="Open",e[e.Closed=2]="Closed",e[e.Closing=4]="Closing",e[e.Opening=8]="Opening",e))(i||{});function u(){return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(n)}function c({value:o,children:t}){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(n.Provider,{value:o},t)}function s({children:o}){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(n.Provider,{value:null},o)}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/class-names.js":
/*!******************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/class-names.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   classNames: () => (/* binding */ t)
/* harmony export */ });
function t(...r){return Array.from(new Set(r.flatMap(n=>typeof n=="string"?n.split(" "):[]))).filter(Boolean).join(" ")}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/disposables.js":
/*!******************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/disposables.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   disposables: () => (/* binding */ o)
/* harmony export */ });
/* harmony import */ var _micro_task_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./micro-task.js */ "./node_modules/@headlessui/react/dist/utils/micro-task.js");
function o(){let n=[],r={addEventListener(e,t,s,a){return e.addEventListener(t,s,a),r.add(()=>e.removeEventListener(t,s,a))},requestAnimationFrame(...e){let t=requestAnimationFrame(...e);return r.add(()=>cancelAnimationFrame(t))},nextFrame(...e){return r.requestAnimationFrame(()=>r.requestAnimationFrame(...e))},setTimeout(...e){let t=setTimeout(...e);return r.add(()=>clearTimeout(t))},microTask(...e){let t={current:!0};return (0,_micro_task_js__WEBPACK_IMPORTED_MODULE_0__.microTask)(()=>{t.current&&e[0]()}),r.add(()=>{t.current=!1})},style(e,t,s){let a=e.style.getPropertyValue(t);return Object.assign(e.style,{[t]:s}),this.add(()=>{Object.assign(e.style,{[t]:a})})},group(e){let t=o();return e(t),this.add(()=>t.dispose())},add(e){return n.includes(e)||n.push(e),()=>{let t=n.indexOf(e);if(t>=0)for(let s of n.splice(t,1))s()}},dispose(){for(let e of n.splice(0))e()}};return r}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/env.js":
/*!**********************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/env.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   env: () => (/* binding */ s)
/* harmony export */ });
var i=Object.defineProperty;var d=(t,e,n)=>e in t?i(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var r=(t,e,n)=>(d(t,typeof e!="symbol"?e+"":e,n),n);class o{constructor(){r(this,"current",this.detect());r(this,"handoffState","pending");r(this,"currentId",0)}set(e){this.current!==e&&(this.handoffState="pending",this.currentId=0,this.current=e)}reset(){this.set(this.detect())}nextId(){return++this.currentId}get isServer(){return this.current==="server"}get isClient(){return this.current==="client"}detect(){return typeof window=="undefined"||typeof document=="undefined"?"server":"client"}handoff(){this.handoffState==="pending"&&(this.handoffState="complete")}get isHandoffComplete(){return this.handoffState==="complete"}}let s=new o;


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/match.js":
/*!************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/match.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   match: () => (/* binding */ u)
/* harmony export */ });
function u(r,n,...a){if(r in n){let e=n[r];return typeof e=="function"?e(...a):e}let t=new Error(`Tried to handle "${r}" but there is no handler defined. Only defined handlers are: ${Object.keys(n).map(e=>`"${e}"`).join(", ")}.`);throw Error.captureStackTrace&&Error.captureStackTrace(t,u),t}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/micro-task.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/micro-task.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   microTask: () => (/* binding */ t)
/* harmony export */ });
function t(e){typeof queueMicrotask=="function"?queueMicrotask(e):Promise.resolve().then(e).catch(o=>setTimeout(()=>{throw o}))}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/once.js":
/*!***********************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/once.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   once: () => (/* binding */ l)
/* harmony export */ });
function l(r){let e={called:!1};return(...t)=>{if(!e.called)return e.called=!0,r(...t)}}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/render.js":
/*!*************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/render.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RenderFeatures: () => (/* binding */ M),
/* harmony export */   RenderStrategy: () => (/* binding */ O),
/* harmony export */   compact: () => (/* binding */ m),
/* harmony export */   forwardRefWithAs: () => (/* binding */ W),
/* harmony export */   mergeProps: () => (/* binding */ D),
/* harmony export */   render: () => (/* binding */ H),
/* harmony export */   useMergeRefsFn: () => (/* binding */ I)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _class_names_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./class-names.js */ "./node_modules/@headlessui/react/dist/utils/class-names.js");
/* harmony import */ var _match_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./match.js */ "./node_modules/@headlessui/react/dist/utils/match.js");
var M=(a=>(a[a.None=0]="None",a[a.RenderStrategy=1]="RenderStrategy",a[a.Static=2]="Static",a))(M||{}),O=(e=>(e[e.Unmount=0]="Unmount",e[e.Hidden=1]="Hidden",e))(O||{});function H({ourProps:r,theirProps:n,slot:e,defaultTag:a,features:s,visible:t=!0,name:l,mergeRefs:i}){i=i!=null?i:A;let o=N(n,r);if(t)return b(o,e,a,l,i);let y=s!=null?s:0;if(y&2){let{static:f=!1,...u}=o;if(f)return b(u,e,a,l,i)}if(y&1){let{unmount:f=!0,...u}=o;return (0,_match_js__WEBPACK_IMPORTED_MODULE_1__.match)(f?0:1,{[0](){return null},[1](){return b({...u,hidden:!0,style:{display:"none"}},e,a,l,i)}})}return b(o,e,a,l,i)}function b(r,n={},e,a,s){let{as:t=e,children:l,refName:i="ref",...o}=h(r,["unmount","static"]),y=r.ref!==void 0?{[i]:r.ref}:{},f=typeof l=="function"?l(n):l;"className"in o&&o.className&&typeof o.className=="function"&&(o.className=o.className(n)),o["aria-labelledby"]&&o["aria-labelledby"]===o.id&&(o["aria-labelledby"]=void 0);let u={};if(n){let d=!1,p=[];for(let[c,T]of Object.entries(n))typeof T=="boolean"&&(d=!0),T===!0&&p.push(c.replace(/([A-Z])/g,g=>`-${g.toLowerCase()}`));if(d){u["data-headlessui-state"]=p.join(" ");for(let c of p)u[`data-${c}`]=""}}if(t===react__WEBPACK_IMPORTED_MODULE_0__.Fragment&&(Object.keys(m(o)).length>0||Object.keys(m(u)).length>0))if(!(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(f)||Array.isArray(f)&&f.length>1){if(Object.keys(m(o)).length>0)throw new Error(['Passing props on "Fragment"!',"",`The current component <${a} /> is rendering a "Fragment".`,"However we need to passthrough the following props:",Object.keys(m(o)).concat(Object.keys(m(u))).map(d=>`  - ${d}`).join(`
`),"","You can apply a few solutions:",['Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".',"Render a single element as the child so that we can forward the props onto that element."].map(d=>`  - ${d}`).join(`
`)].join(`
`))}else{let d=f.props,p=d==null?void 0:d.className,c=typeof p=="function"?(...F)=>(0,_class_names_js__WEBPACK_IMPORTED_MODULE_2__.classNames)(p(...F),o.className):(0,_class_names_js__WEBPACK_IMPORTED_MODULE_2__.classNames)(p,o.className),T=c?{className:c}:{},g=N(f.props,m(h(o,["ref"])));for(let F in u)F in g&&delete u[F];return (0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(f,Object.assign({},g,u,y,{ref:s(f.ref,y.ref)},T))}return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(t,Object.assign({},h(o,["ref"]),t!==react__WEBPACK_IMPORTED_MODULE_0__.Fragment&&y,t!==react__WEBPACK_IMPORTED_MODULE_0__.Fragment&&u),f)}function I(){let r=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([]),n=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e=>{for(let a of r.current)a!=null&&(typeof a=="function"?a(e):a.current=e)},[]);return(...e)=>{if(!e.every(a=>a==null))return r.current=e,n}}function A(...r){return r.every(n=>n==null)?void 0:n=>{for(let e of r)e!=null&&(typeof e=="function"?e(n):e.current=n)}}function N(...r){var a;if(r.length===0)return{};if(r.length===1)return r[0];let n={},e={};for(let s of r)for(let t in s)t.startsWith("on")&&typeof s[t]=="function"?((a=e[t])!=null||(e[t]=[]),e[t].push(s[t])):n[t]=s[t];if(n.disabled||n["aria-disabled"])for(let s in e)/^(on(?:Click|Pointer|Mouse|Key)(?:Down|Up|Press)?)$/.test(s)&&(e[s]=[t=>{var l;return(l=t==null?void 0:t.preventDefault)==null?void 0:l.call(t)}]);for(let s in e)Object.assign(n,{[s](t,...l){let i=e[s];for(let o of i){if((t instanceof Event||(t==null?void 0:t.nativeEvent)instanceof Event)&&t.defaultPrevented)return;o(t,...l)}}});return n}function D(...r){var a;if(r.length===0)return{};if(r.length===1)return r[0];let n={},e={};for(let s of r)for(let t in s)t.startsWith("on")&&typeof s[t]=="function"?((a=e[t])!=null||(e[t]=[]),e[t].push(s[t])):n[t]=s[t];for(let s in e)Object.assign(n,{[s](...t){let l=e[s];for(let i of l)i==null||i(...t)}});return n}function W(r){var n;return Object.assign((0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(r),{displayName:(n=r.displayName)!=null?n:r.name})}function m(r){let n=Object.assign({},r);for(let e in n)n[e]===void 0&&delete n[e];return n}function h(r,n=[]){let e=Object.assign({},r);for(let a of n)a in e&&delete e[a];return e}


/***/ })

}]);