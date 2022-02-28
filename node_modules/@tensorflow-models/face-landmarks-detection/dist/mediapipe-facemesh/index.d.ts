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
import { Coord2D, Coords3D } from './util';
export interface EstimateFacesConfig {
    /**
     * The image to classify. Can be a tensor, DOM element image, video, or
     * canvas.
     */
    input: tf.Tensor3D | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement;
    /** Whether to return tensors as opposed to values. */
    returnTensors?: boolean;
    /** Whether to flip/mirror the facial keypoints horizontally. */
    flipHorizontal?: boolean;
    /**
     * Whether to return keypoints for the irises. Disabling may improve
     * performance. Defaults to true.
     */
    predictIrises?: boolean;
}
declare const PREDICTION_VALUES = "MediaPipePredictionValues";
declare type PredictionValuesKind = typeof PREDICTION_VALUES;
interface AnnotatedPredictionValues {
    kind: PredictionValuesKind;
    /** Probability of the face detection. */
    faceInViewConfidence: number;
    boundingBox: {
        /** The upper left-hand corner of the face. */
        topLeft: Coord2D;
        /** The lower right-hand corner of the face. */
        bottomRight: Coord2D;
    };
    /** Facial landmark coordinates. */
    mesh: Coords3D;
    /** Facial landmark coordinates normalized to input dimensions. */
    scaledMesh: Coords3D;
    /** Annotated keypoints. */
    annotations?: {
        [key: string]: Coords3D;
    };
}
declare const PREDICTION_TENSORS = "MediaPipePredictionTensors";
declare type PredictionTensorsKind = typeof PREDICTION_TENSORS;
interface AnnotatedPredictionTensors {
    kind: PredictionTensorsKind;
    faceInViewConfidence: number;
    boundingBox: {
        topLeft: tf.Tensor1D;
        bottomRight: tf.Tensor1D;
    };
    mesh: tf.Tensor2D;
    scaledMesh: tf.Tensor2D;
}
export declare type AnnotatedPrediction = AnnotatedPredictionValues | AnnotatedPredictionTensors;
/**
 * Load the model.
 *
 * @param options - a configuration object with the following properties:
 *  - `maxContinuousChecks` How many frames to go without running the bounding
 * box detector. Only relevant if maxFaces > 1. Defaults to 5.
 *  - `detectionConfidence` Threshold for discarding a prediction. Defaults to
 * 0.9.
 *  - `maxFaces` The maximum number of faces detected in the input. Should be
 * set to the minimum number for performance. Defaults to 10.
 *  - `iouThreshold` A float representing the threshold for deciding whether
 * boxes overlap too much in non-maximum suppression. Must be between [0, 1].
 * Defaults to 0.3.
 *  - `scoreThreshold` A threshold for deciding when to remove boxes based
 * on score in non-maximum suppression. Defaults to 0.75.
 *  - `shouldLoadIrisModel` Whether to also load the iris detection model.
 * Defaults to true.
 *  - `modelUrl` Optional param for specifying a custom facemesh model url or
 * a `tf.io.IOHandler` object.
 *  - `detectorModelUrl` Optional param for specifying a custom blazeface model
 * url or a `tf.io.IOHandler` object.
 *  - `irisModelUrl` Optional param for specifying a custom iris model url or
 * a `tf.io.IOHandler` object.
 */
export declare function load(config: {
    maxContinuousChecks?: number;
    detectionConfidence?: number;
    maxFaces?: number;
    iouThreshold?: number;
    scoreThreshold?: number;
    shouldLoadIrisModel?: boolean;
    modelUrl?: string | tf.io.IOHandler;
    detectorModelUrl?: string | tf.io.IOHandler;
    irisModelUrl?: string | tf.io.IOHandler;
}): Promise<FaceMesh>;
export interface MediaPipeFaceMesh {
    kind: 'MediaPipeFaceMesh';
    estimateFaces(config: EstimateFacesConfig): Promise<AnnotatedPrediction[]>;
}
declare class FaceMesh implements MediaPipeFaceMesh {
    private pipeline;
    private detectionConfidence;
    kind: "MediaPipeFaceMesh";
    constructor(blazeFace: blazeface.BlazeFaceModel, blazeMeshModel: tfconv.GraphModel, maxContinuousChecks: number, detectionConfidence: number, maxFaces: number, irisModel: tfconv.GraphModel | null);
    static getAnnotations(): {
        [key: string]: number[];
    };
    /**
     * Returns an array of UV coordinates for the 468 facial keypoint vertices in
     * mesh_map.jpg. Can be used to map textures to the facial mesh.
     */
    static getUVCoords(): Coord2D[];
    /**
     * Returns an array of faces in an image.
     *
     * @param input The image to classify. Can be a tensor, DOM element image,
     * video, or canvas.
     * @param returnTensors (defaults to `false`) Whether to return tensors as
     * opposed to values.
     * @param flipHorizontal Whether to flip/mirror the facial keypoints
     * horizontally. Should be true for videos that are flipped by default (e.g.
     * webcams).
     * @param predictIrises
     *
     * @return An array of AnnotatedPrediction objects.
     */
    estimateFaces(config: EstimateFacesConfig): Promise<AnnotatedPrediction[]>;
}
export {};
