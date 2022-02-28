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
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("@tensorflow/tfjs-core");
function scaleBoxCoordinates(box, factor) {
    var startPoint = [box.startPoint[0] * factor[0], box.startPoint[1] * factor[1]];
    var endPoint = [box.endPoint[0] * factor[0], box.endPoint[1] * factor[1]];
    return { startPoint: startPoint, endPoint: endPoint };
}
exports.scaleBoxCoordinates = scaleBoxCoordinates;
function getBoxSize(box) {
    return [
        Math.abs(box.endPoint[0] - box.startPoint[0]),
        Math.abs(box.endPoint[1] - box.startPoint[1])
    ];
}
exports.getBoxSize = getBoxSize;
function getBoxCenter(box) {
    return [
        box.startPoint[0] + (box.endPoint[0] - box.startPoint[0]) / 2,
        box.startPoint[1] + (box.endPoint[1] - box.startPoint[1]) / 2
    ];
}
exports.getBoxCenter = getBoxCenter;
function cutBoxFromImageAndResize(box, image, cropSize) {
    var h = image.shape[1];
    var w = image.shape[2];
    var boxes = [[
            box.startPoint[1] / h, box.startPoint[0] / w, box.endPoint[1] / h,
            box.endPoint[0] / w
        ]];
    return tf.image.cropAndResize(image, boxes, [0], cropSize, 'bilinear' /* method */, 0 /* extrapolation value */);
}
exports.cutBoxFromImageAndResize = cutBoxFromImageAndResize;
/**
 * Enlarges the box by the provided factor.
 * @param box An object with startPoint and endPoint properties describing the
 * outlines of the box to be enlarged.
 * @param factor optional The enlargement factor. Defaults to 1.5
 */
function enlargeBox(box, factor) {
    if (factor === void 0) { factor = 1.5; }
    var center = getBoxCenter(box);
    var size = getBoxSize(box);
    var newHalfSize = [factor * size[0] / 2, factor * size[1] / 2];
    var startPoint = [center[0] - newHalfSize[0], center[1] - newHalfSize[1]];
    var endPoint = [center[0] + newHalfSize[0], center[1] + newHalfSize[1]];
    return { startPoint: startPoint, endPoint: endPoint, landmarks: box.landmarks };
}
exports.enlargeBox = enlargeBox;
/**
 * Squarifies the provided box by setting its length and height equal to
 * max(length, height) while preserving its center point.
 * @param box An object with startPoint and endPoint properties describing the
 * outlines of the box to be squarified.
 */
function squarifyBox(box) {
    var centers = getBoxCenter(box);
    var size = getBoxSize(box);
    var maxEdge = Math.max.apply(Math, size);
    var halfSize = maxEdge / 2;
    var startPoint = [centers[0] - halfSize, centers[1] - halfSize];
    var endPoint = [centers[0] + halfSize, centers[1] + halfSize];
    return { startPoint: startPoint, endPoint: endPoint, landmarks: box.landmarks };
}
exports.squarifyBox = squarifyBox;
//# sourceMappingURL=box.js.map