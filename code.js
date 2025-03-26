/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/code.ts":
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
/***/ (() => {

eval("figma.showUI(__html__, {\n  width: 400,\n  height: 300,\n  themeColors: true\n});\n// Regular expression for price detection (matches numbers followed by €)\nconst priceRegex = /(\\d+([.,]\\d{1,2})?)\\s*€/g;\nfunction anonymizeText(node, options) {\n  if (options.anonymizePrices && priceRegex.test(node.characters)) {\n    node.characters = node.characters.replace(priceRegex, \"0.00€\");\n  }\n  if (options.anonymizeProducts) {\n    // Replace product text with Lorem ipsum\n    node.characters = \"Lorem ipsum dolor sit amet\";\n  }\n}\nfunction anonymizeImage(node, options) {\n  if (!options.anonymizeImages) return;\n  if (\"fills\" in node) {\n    const fills = node.fills;\n    fills.forEach((fill, index) => {\n      if (fill.type === \"IMAGE\") {\n        // Replace with a solid gray fill\n        fills[index] = {\n          type: \"SOLID\",\n          color: {\n            r: 0.8,\n            g: 0.8,\n            b: 0.8\n          }\n        };\n      }\n    });\n  }\n}\nfunction processNode(node, options) {\n  if (node.type === \"TEXT\") {\n    anonymizeText(node, options);\n  } else if (options.anonymizeImages && \"fills\" in node) {\n    anonymizeImage(node, options);\n  }\n  if (\"children\" in node) {\n    for (const child of node.children) {\n      processNode(child, options);\n    }\n  }\n}\nfigma.ui.onmessage = msg => {\n  if (msg.type === 'anonymize') {\n    const selection = figma.currentPage.selection;\n    if (selection.length === 0) {\n      figma.notify('Please select at least one layer');\n      return;\n    }\n    for (const node of selection) {\n      processNode(node, msg.options);\n    }\n    figma.notify('Content anonymized!');\n  } else if (msg.type === 'close') {\n    figma.closePlugin();\n  }\n};\n\n//# sourceURL=webpack://figma-anonymize-content/./src/code.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/code.ts"]();
/******/ 	
/******/ })()
;