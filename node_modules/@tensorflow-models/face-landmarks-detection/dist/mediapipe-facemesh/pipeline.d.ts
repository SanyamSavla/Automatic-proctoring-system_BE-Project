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
import * as blazeface from '@tensorflow-models/blazeface';
import * as tfconv from '@tensorflow/tfjs-converter';
import * as tf from '@tensorflow/tfjs-core';
import { Box } from './box';
import { Coords3D, TransformationMatrix } from './util';
export declare type Prediction = {
    coords: tf.Tensor2D;
    scaledCoords: tf.Tensor2D;
    box: Box;
    flag: tf.Scalar;
};
export declare class Pipeline {
    private boundingBoxDetector;
    private meshDetector;
    private meshWidth;
    private meshHeight;
    private maxContinuousChecks;
    private maxFaces;
    irisModel: tfconv.GraphModel | null;
    private regionsOfInterest;
    private runsWithoutFaceDetector;
    constructor(boundingBoxDetector: blazeface.BlazeFaceModel, meshDetector: tfconv.GraphModel, meshWidth: number, meshHeight: number, maxContinuousChecks: number, maxFaces: number, irisModel: tfconv.GraphModel | null);
    transformRawCoords(rawCoords: Coords3D, box: Box, angle: number, rotationMatrix: TransformationMatrix): [number, number, number][];
    private getLeftToRightEyeDepthDifference;
    getEyeBox(rawCoords: Coords3D, face: tf.Tensor4D, eyeInnerCornerIndex: number, eyeOuterCornerIndex: number, flip?: boolean): {
        box: Box;
        boxSize: [number, number];
        crop: tf.Tensor4D;
    };
    getEyeCoords(eyeData: Float32Array, eyeBox: Box, eyeBoxSize: [number, number], flip?: boolean): {
        rawCoords: Coords3D;
        iris: Coords3D;
    };
    private getAdjustedIrisCoords;
    /**
     * Returns an array of predictions for each face in the input.
     * @param input - tensor of shape [1, H, W, 3].
     * @param predictIrises - Whether to return keypoints for the irises.
     */
    predict(input: tf.Tensor4D, predictIrises: boolean): Promise<Prediction[]>;
    updateRegionsOfInterest(boxes: Box[]): void;
    clearRegionOfInterest(index: number): void;
    shouldUpdateRegionsOfInterest(): boolean;
    calculateLandmarksBoundingBox(landmarks: Coords3D): Box;
}
