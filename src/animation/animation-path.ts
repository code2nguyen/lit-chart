// import { Observable, of } from "rxjs";
// import { mergeMap } from "rxjs/operators";
// import { ChartModel, Template } from "../models/chart-model";

// interface PathItem {
//   item: Template;
//   index: number;
// }
// export function getPaths(template: Template): PathItem[] {
//   const items: PathItem[] = [];
//   for (let index = 0; index < template.strings.length; index++) {
//     if (template.strings[index].includes("<path")) {
//       items.push({ item: template, index });
//     }
//   }

//   if (template.children) {
//     for (const child of template.children) {
//       items.push(...getPaths(child));
//     }
//   }
//   return items;
// }
// export function animationPath() {
//   return (source: Observable<ChartModel>) => {
//     return source.pipe(
//       mergeMap((data) => {
//         // const pathItems = getPaths(data.template);

//         return of(data);
//       })
//     );
//   };
// }
