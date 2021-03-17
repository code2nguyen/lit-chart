// import { spread } from '@open-wc/lit-helpers';
// import {Coordinate} from '../models/coordinate'
// import { Template } from '../models/chart-model'
// import { template } from '../template';
// import { SVGPath } from '../models/svg-path';

// function isValidatePoint(point: Coordinate): boolean {
//   return point && point.x === +point.x && point.y === +point.y;
// };

// function getParsedPoints(points: Coordinate[] = []): Coordinate[][]{
//   let segmentPoints: Coordinate[][] = [[]];

//   points.forEach(entry => {
//     if (isValidatePoint(entry)) {
//       segmentPoints[segmentPoints.length - 1].push(entry);
//     } else if (segmentPoints[segmentPoints.length - 1].length > 0) {
//       // add another path
//       segmentPoints.push([]);
//     }
//   });

//   if (isValidatePoint(points[0])) {
//     segmentPoints[segmentPoints.length - 1].push(points[0]);
//   }

//   if (segmentPoints[segmentPoints.length - 1].length <= 0) {
//     segmentPoints = segmentPoints.slice(0, -1);
//   }

//   return segmentPoints;
// }

// function getSinglePolygonPath(points: Coordinate[], connectNulls?: boolean): SVGPath {
//   let segmentPoints = getParsedPoints(points);

//   if (connectNulls) {
//     segmentPoints = [
//       segmentPoints.reduce((res: Coordinate[], segPoints: Coordinate[]) => {
//         return [...res, ...segPoints];
//       }, []),
//     ];
//   }

//   const polygonPath = segmentPoints
//     .map(segPoints => {
//       return segPoints.reduce((path: string, point: Coordinate, index: number) => {
//         return `${path}${index === 0 ? 'M' : 'L'}${point.x},${point.y}`;
//       }, '');
//     })
//     .join('');

//   return segmentPoints.length === 1 ? `${polygonPath}Z` : polygonPath;
// };

// export interface PolygonProps {
//   className?: string;
//   points?: Coordinate[];
//   connectNulls?: boolean;
//   [other: string]: any
// }

// export function polygon({ points, className = 'fds-polygon', connectNulls, ...others }: PolygonProps): Template {
//   if (!points || !points.length) {
//     return template``;
//   }
//     const singlePath = getSinglePolygonPath(points, connectNulls);

//     return template`<path ...=${others}
//         class="${className}"
//         d=${singlePath}
//       />`;
// }
