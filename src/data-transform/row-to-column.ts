import { ColumnData, DataSource, isColumnData } from "../data/data-source";

export function rowToColumn(data: DataSource): ColumnData {
  if (isColumnData(data)) return data;

  if (data.length === 0) {
    return { columns: [], values: [] };
  }
  const columns = Object.keys(data[0]);
  const values: Array<Array<string | number>> = [];
  for (const item of data) {
    values.push(columns.map((column) => item[column]));
  }

  return { columns, values };
}
