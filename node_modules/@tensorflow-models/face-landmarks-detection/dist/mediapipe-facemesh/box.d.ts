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
import * as tf from '@tensorflow/tfjs-core';
import { Coord2D, Coords3D } from './util';
export declare type Box = {
    startPoint: Coord2D;
    endPoint: Coord2D;
    landmarks?: Coords3D;
};
export declare function scaleBoxCoordinates(box: Box, factor: Coord2D): Box;
export declare function getBoxSize(box: Box): Coord2D;
export declare function getBoxCenter(box: Box): Coord2D;
export declare function cutBoxFromImageAndResize(box: Box, image: tf.Tensor4D, cropSize: Coord2D): tf.Tensor4D;
/**
 * Enlarges the box by the provided factor.
 * @param box An object with startPoint and endPoint properties describing the
 * outlines of the box to be enlarged.
 * @param factor optional The enlargement factor. Defaults to 1.5
 */
export declare function enlargeBox(box: Box, factor?: number): Box;
/**
 * Squarifies the provided box by setting its length and height equal to
 * max(length, height) while preserving its center point.
 * @param box An object with startPoint and endPoint properties describing the
 * outlines of the box to be squarified.
 */
export declare function squarifyBox(box: Box): Box;
