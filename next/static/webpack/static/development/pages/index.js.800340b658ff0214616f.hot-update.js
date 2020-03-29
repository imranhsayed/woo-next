webpackHotUpdate("static/development/pages/index.js",{

/***/ "./components/category/category-block/ParentCategoryBlock.js":
/*!*******************************************************************!*\
  !*** ./components/category/category-block/ParentCategoryBlock.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/link */ "./node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_1__);
var _jsxFileName = "/Users/imransayed/Projects/woo-next/components/category/category-block/ParentCategoryBlock.js";

var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;

;

var ParentCategoryBlock = function ParentCategoryBlock(props) {
  var category = props.category;
  return __jsx("div", {
    className: "col-lg-3 col-md-6 col-sm-12",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  }, __jsx("h3", {
    className: "card-header text-center",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    },
    __self: this
  }, category.name), __jsx(next_link__WEBPACK_IMPORTED_MODULE_1___default.a, {
    as: "/category/".concat(category.slug, "-").concat(category.id),
    href: "/category?slug=".concat(category.slug, "-").concat(category.id),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: this
  }, __jsx("a", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: this
  }, __jsx("img", {
    src: null !== category.image ? category.image.sourceUrl : '',
    alt: "ParentCategoryBlock image",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }))));
};

/* harmony default export */ __webpack_exports__["default"] = (ParentCategoryBlock);

/***/ })

})
//# sourceMappingURL=index.js.800340b658ff0214616f.hot-update.js.map