"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var tfconv = require("@tensorflow/tfjs-converter");
var tf = require("@tensorflow/tfjs-core");
// tslint:disable-next-line: no-imports-from-dist
var jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
var index_1 = require("./index");
jasmine_util_1.describeWithFlags('ObjectDetection', jasmine_util_1.NODE_ENVS, function () {
    beforeEach(function () {
        spyOn(tfconv, 'loadGraphModel').and.callFake(function () {
            var model = {
                executeAsync: function (x) { return [tf.ones([1, 1917, 90]), tf.ones([1, 1917, 1, 4])]; },
                dispose: function () { return true; }
            };
            return model;
        });
    });
    it('ObjectDetection detect method should not leak', function () { return __awaiter(_this, void 0, void 0, function () {
        var objectDetection, x, numOfTensorsBefore;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, index_1.load()];
                case 1:
                    objectDetection = _a.sent();
                    x = tf.zeros([227, 227, 3]);
                    numOfTensorsBefore = tf.memory().numTensors;
                    return [4 /*yield*/, objectDetection.detect(x, 1)];
                case 2:
                    _a.sent();
                    expect(tf.memory().numTensors).toEqual(numOfTensorsBefore);
                    return [2 /*return*/];
            }
        });
    }); });
    it('ObjectDetection e2e should not leak', function () { return __awaiter(_this, void 0, void 0, function () {
        var numOfTensorsBefore, objectDetection, x;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    numOfTensorsBefore = tf.memory().numTensors;
                    return [4 /*yield*/, index_1.load()];
                case 1:
                    objectDetection = _a.sent();
                    x = tf.zeros([227, 227, 3]);
                    return [4 /*yield*/, objectDetection.detect(x, 1)];
                case 2:
                    _a.sent();
                    x.dispose();
                    objectDetection.dispose();
                    expect(tf.memory().numTensors).toEqual(numOfTensorsBefore);
                    return [2 /*return*/];
            }
        });
    }); });
    it('ObjectDetection detect method should generate output', function () { return __awaiter(_this, void 0, void 0, function () {
        var objectDetection, x, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, index_1.load()];
                case 1:
                    objectDetection = _a.sent();
                    x = tf.zeros([227, 227, 3]);
                    return [4 /*yield*/, objectDetection.detect(x, 1)];
                case 2:
                    data = _a.sent();
                    expect(data).toEqual([{ bbox: [227, 227, 0, 0], class: 'person', score: 1 }]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should allow custom model url', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, index_1.load({ base: 'mobilenet_v1' })];
                case 1:
                    _a.sent();
                    expect(tfconv.loadGraphModel)
                        .toHaveBeenCalledWith('https://storage.googleapis.com/tfjs-models/' +
                        'savedmodel/ssd_mobilenet_v1/model.json');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should allow custom model url', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, index_1.load({ modelUrl: 'https://test.org/model.json' })];
                case 1:
                    _a.sent();
                    expect(tfconv.loadGraphModel)
                        .toHaveBeenCalledWith('https://test.org/model.json');
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=ssd_test.js.map