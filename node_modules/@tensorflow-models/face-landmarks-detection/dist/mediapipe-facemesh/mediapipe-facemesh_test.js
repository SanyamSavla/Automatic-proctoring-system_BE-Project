"use strict";
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
var tf = require("@tensorflow/tfjs-core");
// tslint:disable-next-line: no-imports-from-dist
var jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
var faceLandmarksDetection = require("../index");
var test_util_1 = require("./test_util");
jasmine_util_1.describeWithFlags('Face landmarks detection', jasmine_util_1.ALL_ENVS, function () {
    var model;
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, faceLandmarksDetection.load()];
                case 1:
                    // Note: this makes a network request for model assets.
                    model = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('estimateFaces does not leak memory', function () { return __awaiter(_this, void 0, void 0, function () {
        var input, numTensors, returnTensors, flipHorizontal, predictIrises;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = tf.zeros([128, 128, 3]);
                    numTensors = tf.memory().numTensors;
                    returnTensors = false;
                    flipHorizontal = false;
                    return [4 /*yield*/, model.estimateFaces({ input: input, returnTensors: returnTensors, flipHorizontal: flipHorizontal })];
                case 1:
                    _a.sent();
                    expect(tf.memory().numTensors).toEqual(numTensors);
                    // returnTensors = false, flipHorizontal = true
                    numTensors = tf.memory().numTensors;
                    returnTensors = false;
                    flipHorizontal = true;
                    return [4 /*yield*/, model.estimateFaces({ input: input, returnTensors: returnTensors, flipHorizontal: flipHorizontal })];
                case 2:
                    _a.sent();
                    expect(tf.memory().numTensors).toEqual(numTensors);
                    // returnTensors = true, flipHorizontal = false
                    numTensors = tf.memory().numTensors;
                    returnTensors = true;
                    flipHorizontal = false;
                    return [4 /*yield*/, model.estimateFaces({ input: input, returnTensors: returnTensors, flipHorizontal: flipHorizontal })];
                case 3:
                    _a.sent();
                    expect(tf.memory().numTensors).toEqual(numTensors);
                    // returnTensors = true, flipHorizontal = true, predictIrises = true
                    numTensors = tf.memory().numTensors;
                    returnTensors = true;
                    flipHorizontal = true;
                    predictIrises = true;
                    return [4 /*yield*/, model.estimateFaces({ input: input, returnTensors: returnTensors, flipHorizontal: flipHorizontal, predictIrises: predictIrises })];
                case 4:
                    _a.sent();
                    expect(tf.memory().numTensors).toEqual(numTensors);
                    return [2 /*return*/];
            }
        });
    }); });
    it('estimateFaces returns objects with expected properties', function () { return __awaiter(_this, void 0, void 0, function () {
        var input, numTensors, result, face, topLeft, bottomRight;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = tf.tensor3d(test_util_1.stubbedImageVals, [128, 128, 3]);
                    // Call estimateFaces once up front to exclude any initialization tensors
                    // from memory test.
                    return [4 /*yield*/, model.estimateFaces({
                            input: input,
                            returnTensors: false,
                            flipHorizontal: false,
                            predictIrises: true
                        })];
                case 1:
                    // Call estimateFaces once up front to exclude any initialization tensors
                    // from memory test.
                    _a.sent();
                    numTensors = tf.memory().numTensors;
                    return [4 /*yield*/, model.estimateFaces({ input: input })];
                case 2:
                    result = _a.sent();
                    face = result[0];
                    expect(tf.memory().numTensors).toEqual(numTensors);
                    expect(face.faceInViewConfidence).toBeDefined();
                    expect(face.boundingBox).toBeDefined();
                    expect(face.mesh).toBeDefined();
                    expect(face.scaledMesh).toBeDefined();
                    topLeft = face.boundingBox.topLeft;
                    bottomRight = face.boundingBox.bottomRight;
                    expect(topLeft[0]).toBeDefined();
                    expect(topLeft[0]).not.toBeNaN();
                    expect(topLeft[1]).toBeDefined();
                    expect(topLeft[1]).not.toBeNaN();
                    expect(bottomRight[0]).toBeDefined();
                    expect(bottomRight[0]).not.toBeNaN();
                    expect(bottomRight[1]).toBeDefined();
                    expect(bottomRight[1]).not.toBeNaN();
                    return [2 /*return*/];
            }
        });
    }); });
    it('estimateFaces returns objects with expected properties when ' +
        'predicting irises', function () { return __awaiter(_this, void 0, void 0, function () {
        var input, numTensors, result, face, mesh;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = tf.tensor3d(test_util_1.stubbedImageVals, [128, 128, 3]);
                    // Call estimateFaces once up front to exclude any initialization tensors
                    // from memory test.
                    return [4 /*yield*/, model.estimateFaces({ input: input })];
                case 1:
                    // Call estimateFaces once up front to exclude any initialization tensors
                    // from memory test.
                    _a.sent();
                    numTensors = tf.memory().numTensors;
                    return [4 /*yield*/, model.estimateFaces({ input: input })];
                case 2:
                    result = _a.sent();
                    face = result[0];
                    expect(tf.memory().numTensors).toEqual(numTensors);
                    expect(face.faceInViewConfidence).toBeDefined();
                    expect(face.boundingBox).toBeDefined();
                    expect(face.mesh).toBeDefined();
                    expect(face.scaledMesh).toBeDefined();
                    mesh = face.scaledMesh;
                    expect(mesh.length).toEqual(478);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=mediapipe-facemesh_test.js.map