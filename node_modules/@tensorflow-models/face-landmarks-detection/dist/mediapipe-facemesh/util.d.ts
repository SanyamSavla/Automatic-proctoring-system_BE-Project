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
export declare type Coord2D = [number, number];
export declare type Coord3D = [number, number, number];
export declare type Coords3D = Coord3D[];
export declare type TransformationMatrix = [[number, number, number], [number, number, number], [number, number, number]];
export declare const IDENTITY_MATRIX: TransformationMatrix;
/**
 * Normalizes the provided angle to the range -pi to pi.
 * @param angle The angle in radians to be normalized.
 */
export declare function normalizeRadians(angle: number): number;
/**
 * Computes the angle of rotation between two anchor points.
 * @param point1 First anchor point
 * @param point2 Second anchor point
 */
export declare function computeRotation(point1: Coord2D | Coord3D, point2: Coord2D | Coord3D): number;
export declare function radToDegrees(rad: number): number;
export declare function dot(v1: number[], v2: number[]): number;
export declare function getColumnFrom2DArr(arr: number[][], columnIndex: number): number[];
export declare function buildRotationMatrix(rotation: number, center: Coord2D): TransformationMatrix;
export declare function invertTransformMatrix(matrix: TransformationMatrix): TransformationMatrix;
export declare function rotatePoint(homogeneousCoordinate: Coord3D, rotationMatrix: TransformationMatrix): Coord2D;
export declare function xyDistanceBetweenPoints(a: Coord2D | Coord3D, b: Coord2D | Coord3D): number;
