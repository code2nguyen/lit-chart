export interface ColumnData {
  columns: string[];
  keys?: string[];
  values: Array<Array<string | number>>;
}

export type RowData = Array<{ [key: string]: string | number }>;

export type DataSource = ColumnData | RowData;

export function isColumnData(ds: DataSource): ds is ColumnData {
  return (ds as ColumnData).columns !== undefined;
}

// export interface DiffItem {
//   col: number;
//   row: number;
//   previousValue?: number;
//   currentValue?: number;
// }

// export interface DataChange {
//   type: "insert" | "update" | "remove";
// }
