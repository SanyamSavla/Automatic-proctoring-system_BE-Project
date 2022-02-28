"use strict";
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("@tensorflow/tfjs-core");
var box_1 = require("./box");
var keypoints_1 = require("./keypoints");
var util_1 = require("./util");
var LANDMARKS_COUNT = 468;
var UPDATE_REGION_OF_INTEREST_IOU_THRESHOLD = 0.25;
var MESH_MOUTH_INDEX = 13;
var MESH_KEYPOINTS_LINE_OF_SYMMETRY_INDICES = [MESH_MOUTH_INDEX, keypoints_1.MESH_ANNOTATIONS['midwayBetweenEyes'][0]];
var BLAZEFACE_MOUTH_INDEX = 3;
var BLAZEFACE_NOSE_INDEX = 2;
var BLAZEFACE_KEYPOINTS_LINE_OF_SYMMETRY_INDICES = [BLAZEFACE_MOUTH_INDEX, BLAZEFACE_NOSE_INDEX];
var LEFT_EYE_OUTLINE = keypoints_1.MESH_ANNOTATIONS['leftEyeLower0'];
var LEFT_EYE_BOUNDS = [LEFT_EYE_OUTLINE[0], LEFT_EYE_OUTLINE[LEFT_EYE_OUTLINE.length - 1]];
var RIGHT_EYE_OUTLINE = keypoints_1.MESH_ANNOTATIONS['rightEyeLower0'];
var RIGHT_EYE_BOUNDS = [RIGHT_EYE_OUTLINE[0], RIGHT_EYE_OUTLINE[RIGHT_EYE_OUTLINE.length - 1]];
var IRIS_UPPER_CENTER_INDEX = 3;
var IRIS_LOWER_CENTER_INDEX = 4;
var IRIS_IRIS_INDEX = 71;
var IRIS_NUM_COORDINATES = 76;
// Factor by which to enlarge the box around the eye landmarks so the input
// region matches the expectations of the iris model.
var ENLARGE_EYE_RATIO = 2.3;
var IRIS_MODEL_INPUT_SIZE = 64;
// A mapping from facemesh model keypoints to iris model keypoints.
var MESH_TO_IRIS_INDICES_MAP = [
    { key: 'EyeUpper0', indices: [9, 10, 11, 12, 13, 14, 15] },
    { key: 'EyeUpper1', indices: [25, 26, 27, 28, 29, 30, 31] },
    { key: 'EyeUpper2', indices: [41, 42, 43, 44, 45, 46, 47] },
    { key: 'EyeLower0', indices: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
    { key: 'EyeLower1', indices: [16, 17, 18, 19, 20, 21, 22, 23, 24] },
    { key: 'EyeLower2', indices: [32, 33, 34, 35, 36, 37, 38, 39, 40] },
    { key: 'EyeLower3', indices: [54, 55, 56, 57, 58, 59, 60, 61, 62] },
    { key: 'EyebrowUpper', indices: [63, 64, 65, 66, 67, 68, 69, 70] },
    { key: 'EyebrowLower', indices: [48, 49, 50, 51, 52, 53] }
];
// Replace the raw coordinates returned by facemesh with refined iris model
// coordinates.
// Update the z coordinate to be an average of the original and the new. This
// produces the best visual effect.
function replaceRawCoordinates(rawCoords, newCoords, prefix, keys) {
    for (var i = 0; i < MESH_TO_IRIS_INDICES_MAP.length; i++) {
        var _a = MESH_TO_IRIS_INDICES_MAP[i], key = _a.key, indices = _a.indices;
        var originalIndices = keypoints_1.MESH_ANNOTATIONS["" + prefix + key];
        var shouldReplaceAllKeys = keys == null;
        if (shouldReplaceAllKeys || keys.includes(key)) {
            for (var j = 0; j < indices.length; j++) {
                var index = indices[j];
                rawCoords[originalIndices[j]] = [
                    newCoords[index][0], newCoords[index][1],
                    (newCoords[index][2] + rawCoords[originalIndices[j]][2]) / 2
                ];
            }
        }
    }
}
// The Pipeline coordinates between the bounding box and skeleton models.
var Pipeline = /** @class */ (function () {
    function Pipeline(boundingBoxDetector, meshDetector, meshWidth, meshHeight, maxContinuousChecks, maxFaces, irisModel) {
        // An array of facial bounding boxes.
        this.regionsOfInterest = [];
        this.runsWithoutFaceDetector = 0;
        this.boundingBoxDetector = boundingBoxDetector;
        this.meshDetector = meshDetector;
        this.irisModel = irisModel;
        this.meshWidth = meshWidth;
        this.meshHeight = meshHeight;
        this.maxContinuousChecks = maxContinuousChecks;
        this.maxFaces = maxFaces;
    }
    Pipeline.prototype.transformRawCoords = function (rawCoords, box, angle, rotationMatrix) {
        var _this = this;
        var boxSize = box_1.getBoxSize({ startPoint: box.startPoint, endPoint: box.endPoint });
        var scaleFactor = [boxSize[0] / this.meshWidth, boxSize[1] / this.meshHeight];
        var coordsScaled = rawCoords.map(function (coord) { return ([
            scaleFactor[0] * (coord[0] - _this.meshWidth / 2),
            scaleFactor[1] * (coord[1] - _this.meshHeight / 2), coord[2]
        ]); });
        var coordsRotationMatrix = util_1.buildRotationMatrix(angle, [0, 0]);
        var coordsRotated = coordsScaled.map(function (coord) {
            return (util_1.rotatePoint(coord, coordsRotationMatrix).concat([coord[2]]));
        });
        var inverseRotationMatrix = util_1.invertTransformMatrix(rotationMatrix);
        var boxCenter = box_1.getBoxCenter({ startPoint: box.startPoint, endPoint: box.endPoint }).concat([
            1
        ]);
        var originalBoxCenter = [
            util_1.dot(boxCenter, inverseRotationMatrix[0]),
            util_1.dot(boxCenter, inverseRotationMatrix[1])
        ];
        return coordsRotated.map(function (coord) { return ([
            coord[0] + originalBoxCenter[0],
            coord[1] + originalBoxCenter[1], coord[2]
        ]); });
    };
    Pipeline.prototype.getLeftToRightEyeDepthDifference = function (rawCoords) {
        var leftEyeZ = rawCoords[LEFT_EYE_BOUNDS[0]][2];
        var rightEyeZ = rawCoords[RIGHT_EYE_BOUNDS[0]][2];
        return leftEyeZ - rightEyeZ;
    };
    // Returns a box describing a cropped region around the eye fit for passing to
    // the iris model.
    Pipeline.prototype.getEyeBox = function (rawCoords, face, eyeInnerCornerIndex, eyeOuterCornerIndex, flip) {
        if (flip === void 0) { flip = false; }
        var box = box_1.squarifyBox(box_1.enlargeBox(this.calculateLandmarksBoundingBox([rawCoords[eyeInnerCornerIndex], rawCoords[eyeOuterCornerIndex]]), ENLARGE_EYE_RATIO));
        var boxSize = box_1.getBoxSize(box);
        var crop = tf.image.cropAndResize(face, [[
                box.startPoint[1] / this.meshHeight,
                box.startPoint[0] / this.meshWidth, box.endPoint[1] / this.meshHeight,
                box.endPoint[0] / this.meshWidth
            ]], [0], [IRIS_MODEL_INPUT_SIZE, IRIS_MODEL_INPUT_SIZE]);
        if (flip) {
            crop = tf.image.flipLeftRight(crop);
        }
        return { box: box, boxSize: boxSize, crop: crop };
    };
    // Given a cropped image of an eye, returns the coordinates of the contours
    // surrounding the eye and the iris.
    Pipeline.prototype.getEyeCoords = function (eyeData, eyeBox, eyeBoxSize, flip) {
        if (flip === void 0) { flip = false; }
        var eyeRawCoords = [];
        for (var i = 0; i < IRIS_NUM_COORDINATES; i++) {
            var x = eyeData[i * 3];
            var y = eyeData[i * 3 + 1];
            var z = eyeData[i * 3 + 2];
            eyeRawCoords.push([
                (flip ? (1 - (x / IRIS_MODEL_INPUT_SIZE)) :
                    (x / IRIS_MODEL_INPUT_SIZE)) *
                    eyeBoxSize[0] +
                    eyeBox.startPoint[0],
                (y / IRIS_MODEL_INPUT_SIZE) * eyeBoxSize[1] + eyeBox.startPoint[1], z
            ]);
        }
        return { rawCoords: eyeRawCoords, iris: eyeRawCoords.slice(IRIS_IRIS_INDEX) };
    };
    // The z-coordinates returned for the iris are unreliable, so we take the z
    // values from the surrounding keypoints.
    Pipeline.prototype.getAdjustedIrisCoords = function (rawCoords, irisCoords, direction) {
        var upperCenterZ = rawCoords[keypoints_1.MESH_ANNOTATIONS[direction + "EyeUpper0"][IRIS_UPPER_CENTER_INDEX]][2];
        var lowerCenterZ = rawCoords[keypoints_1.MESH_ANNOTATIONS[direction + "EyeLower0"][IRIS_LOWER_CENTER_INDEX]][2];
        var averageZ = (upperCenterZ + lowerCenterZ) / 2;
        // Iris indices:
        // 0: center | 1: right | 2: above | 3: left | 4: below
        return irisCoords.map(function (coord, i) {
            var z = averageZ;
            if (i === 2) {
                z = upperCenterZ;
            }
            else if (i === 4) {
                z = lowerCenterZ;
            }
            return [coord[0], coord[1], z];
        });
    };
    /**
     * Returns an array of predictions for each face in the input.
     * @param input - tensor of shape [1, H, W, 3].
     * @param predictIrises - Whether to return keypoints for the irises.
     */
    Pipeline.prototype.predict = function (input, predictIrises) {
        return __awaiter(this, void 0, void 0, function () {
            var returnTensors, annotateFace, _a, boxes, scaleFactor_1, scaledBoxes;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.shouldUpdateRegionsOfInterest()) return [3 /*break*/, 2];
                        returnTensors = false;
                        annotateFace = true;
                        return [4 /*yield*/, this.boundingBoxDetector.getBoundingBoxes(input, returnTensors, annotateFace)];
                    case 1:
                        _a = _b.sent(), boxes = _a.boxes, scaleFactor_1 = _a.scaleFactor;
                        if (boxes.length === 0) {
                            this.regionsOfInterest = [];
                            return [2 /*return*/, null];
                        }
                        scaledBoxes = boxes.map(function (prediction) {
                            var predictionBoxCPU = {
                                startPoint: tf.squeeze(prediction.box.startPoint).arraySync(),
                                endPoint: tf.squeeze(prediction.box.endPoint).arraySync()
                            };
                            var scaledBox = box_1.scaleBoxCoordinates(predictionBoxCPU, scaleFactor_1);
                            var enlargedBox = box_1.enlargeBox(scaledBox);
                            var squarifiedBox = box_1.squarifyBox(enlargedBox);
                            return __assign({}, squarifiedBox, { landmarks: prediction.landmarks.arraySync() });
                        });
                        boxes.forEach(function (box) {
                            if (box != null && box.startPoint != null) {
                                box.startEndTensor.dispose();
                                box.startPoint.dispose();
                                box.endPoint.dispose();
                            }
                        });
                        this.updateRegionsOfInterest(scaledBoxes);
                        this.runsWithoutFaceDetector = 0;
                        return [3 /*break*/, 3];
                    case 2:
                        this.runsWithoutFaceDetector++;
                        _b.label = 3;
                    case 3: return [2 /*return*/, tf.tidy(function () {
                            return _this.regionsOfInterest.map(function (box, i) {
                                var angle = 0;
                                // The facial bounding box landmarks could come either from blazeface
                                // (if we are using a fresh box), or from the mesh model (if we are
                                // reusing an old box).
                                var boxLandmarksFromMeshModel = box.landmarks.length >= LANDMARKS_COUNT;
                                var indexOfMouth = MESH_KEYPOINTS_LINE_OF_SYMMETRY_INDICES[0], indexOfForehead = MESH_KEYPOINTS_LINE_OF_SYMMETRY_INDICES[1];
                                if (boxLandmarksFromMeshModel === false) {
                                    indexOfMouth = BLAZEFACE_KEYPOINTS_LINE_OF_SYMMETRY_INDICES[0], indexOfForehead = BLAZEFACE_KEYPOINTS_LINE_OF_SYMMETRY_INDICES[1];
                                }
                                angle = util_1.computeRotation(box.landmarks[indexOfMouth], box.landmarks[indexOfForehead]);
                                var faceCenter = box_1.getBoxCenter({ startPoint: box.startPoint, endPoint: box.endPoint });
                                var faceCenterNormalized = [faceCenter[0] / input.shape[2], faceCenter[1] / input.shape[1]];
                                var rotatedImage = input;
                                var rotationMatrix = util_1.IDENTITY_MATRIX;
                                if (angle !== 0) {
                                    rotatedImage =
                                        tf.image.rotateWithOffset(input, angle, 0, faceCenterNormalized);
                                    rotationMatrix = util_1.buildRotationMatrix(-angle, faceCenter);
                                }
                                var boxCPU = { startPoint: box.startPoint, endPoint: box.endPoint };
                                var face = tf.div(box_1.cutBoxFromImageAndResize(boxCPU, rotatedImage, [
                                    _this.meshHeight, _this.meshWidth
                                ]), 255);
                                // The first returned tensor represents facial contours, which are
                                // included in the coordinates.
                                var _a = _this.meshDetector.predict(face), flag = _a[1], coords = _a[2];
                                var coordsReshaped = tf.reshape(coords, [-1, 3]);
                                var rawCoords = coordsReshaped.arraySync();
                                if (predictIrises) {
                                    var _b = _this.getEyeBox(rawCoords, face, LEFT_EYE_BOUNDS[0], LEFT_EYE_BOUNDS[1], true), leftEyeBox = _b.box, leftEyeBoxSize = _b.boxSize, leftEyeCrop = _b.crop;
                                    var _c = _this.getEyeBox(rawCoords, face, RIGHT_EYE_BOUNDS[0], RIGHT_EYE_BOUNDS[1]), rightEyeBox = _c.box, rightEyeBoxSize = _c.boxSize, rightEyeCrop = _c.crop;
                                    var eyePredictions = (_this.irisModel.predict(tf.concat([leftEyeCrop, rightEyeCrop])));
                                    var eyePredictionsData = eyePredictions.dataSync();
                                    var leftEyeData = eyePredictionsData.slice(0, IRIS_NUM_COORDINATES * 3);
                                    var _d = _this.getEyeCoords(leftEyeData, leftEyeBox, leftEyeBoxSize, true), leftEyeRawCoords = _d.rawCoords, leftIrisRawCoords = _d.iris;
                                    var rightEyeData = eyePredictionsData.slice(IRIS_NUM_COORDINATES * 3);
                                    var _e = _this.getEyeCoords(rightEyeData, rightEyeBox, rightEyeBoxSize), rightEyeRawCoords = _e.rawCoords, rightIrisRawCoords = _e.iris;
                                    var leftToRightEyeDepthDifference = _this.getLeftToRightEyeDepthDifference(rawCoords);
                                    if (Math.abs(leftToRightEyeDepthDifference) <
                                        30) { // User is looking straight ahead.
                                        replaceRawCoordinates(rawCoords, leftEyeRawCoords, 'left');
                                        replaceRawCoordinates(rawCoords, rightEyeRawCoords, 'right');
                                    }
                                    else if (leftToRightEyeDepthDifference < 1) { // User is looking
                                        // towards the
                                        // right.
                                        // If the user is looking to the left or to the right, the iris
                                        // coordinates tend to diverge too much from the mesh coordinates
                                        // for them to be merged. So we only update a single contour line
                                        // above and below the eye.
                                        replaceRawCoordinates(rawCoords, leftEyeRawCoords, 'left', ['EyeUpper0', 'EyeLower0']);
                                    }
                                    else { // User is looking towards the left.
                                        replaceRawCoordinates(rawCoords, rightEyeRawCoords, 'right', ['EyeUpper0', 'EyeLower0']);
                                    }
                                    var adjustedLeftIrisCoords = _this.getAdjustedIrisCoords(rawCoords, leftIrisRawCoords, 'left');
                                    var adjustedRightIrisCoords = _this.getAdjustedIrisCoords(rawCoords, rightIrisRawCoords, 'right');
                                    rawCoords = rawCoords.concat(adjustedLeftIrisCoords)
                                        .concat(adjustedRightIrisCoords);
                                }
                                var transformedCoordsData = _this.transformRawCoords(rawCoords, box, angle, rotationMatrix);
                                var transformedCoords = tf.tensor2d(transformedCoordsData);
                                var landmarksBox = box_1.enlargeBox(_this.calculateLandmarksBoundingBox(transformedCoordsData));
                                var squarifiedLandmarksBox = box_1.squarifyBox(landmarksBox);
                                _this.regionsOfInterest[i] = __assign({}, squarifiedLandmarksBox, { landmarks: transformedCoords.arraySync() });
                                var prediction = {
                                    coords: tf.tensor2d(rawCoords, [rawCoords.length, 3]),
                                    scaledCoords: transformedCoords,
                                    box: landmarksBox,
                                    flag: tf.squeeze(flag)
                                };
                                return prediction;
                            });
                        })];
                }
            });
        });
    };
    // Updates regions of interest if the intersection over union between
    // the incoming and previous regions falls below a threshold.
    Pipeline.prototype.updateRegionsOfInterest = function (boxes) {
        for (var i = 0; i < boxes.length; i++) {
            var box = boxes[i];
            var previousBox = this.regionsOfInterest[i];
            var iou = 0;
            if (previousBox && previousBox.startPoint) {
                var _a = box.startPoint, boxStartX = _a[0], boxStartY = _a[1];
                var _b = box.endPoint, boxEndX = _b[0], boxEndY = _b[1];
                var _c = previousBox.startPoint, previousBoxStartX = _c[0], previousBoxStartY = _c[1];
                var _d = previousBox.endPoint, previousBoxEndX = _d[0], previousBoxEndY = _d[1];
                var xStartMax = Math.max(boxStartX, previousBoxStartX);
                var yStartMax = Math.max(boxStartY, previousBoxStartY);
                var xEndMin = Math.min(boxEndX, previousBoxEndX);
                var yEndMin = Math.min(boxEndY, previousBoxEndY);
                var intersection = (xEndMin - xStartMax) * (yEndMin - yStartMax);
                var boxArea = (boxEndX - boxStartX) * (boxEndY - boxStartY);
                var previousBoxArea = (previousBoxEndX - previousBoxStartX) *
                    (previousBoxEndY - boxStartY);
                iou = intersection / (boxArea + previousBoxArea - intersection);
            }
            if (iou < UPDATE_REGION_OF_INTEREST_IOU_THRESHOLD) {
                this.regionsOfInterest[i] = box;
            }
        }
        this.regionsOfInterest = this.regionsOfInterest.slice(0, boxes.length);
    };
    Pipeline.prototype.clearRegionOfInterest = function (index) {
        if (this.regionsOfInterest[index] != null) {
            this.regionsOfInterest = this.regionsOfInterest.slice(0, index).concat(this.regionsOfInterest.slice(index + 1));
        }
    };
    Pipeline.prototype.shouldUpdateRegionsOfInterest = function () {
        var roisCount = this.regionsOfInterest.length;
        var noROIs = roisCount === 0;
        if (this.maxFaces === 1 || noROIs) {
            return noROIs;
        }
        return roisCount !== this.maxFaces &&
            this.runsWithoutFaceDetector >= this.maxContinuousChecks;
    };
    Pipeline.prototype.calculateLandmarksBoundingBox = function (landmarks) {
        var xs = landmarks.map(function (d) { return d[0]; });
        var ys = landmarks.map(function (d) { return d[1]; });
        var startPoint = [Math.min.apply(Math, xs), Math.min.apply(Math, ys)];
        var endPoint = [Math.max.apply(Math, xs), Math.max.apply(Math, ys)];
        return { startPoint: startPoint, endPoint: endPoint };
    };
    return Pipeline;
}());
exports.Pipeline = Pipeline;
//# sourceMappingURL=pipeline.js.map