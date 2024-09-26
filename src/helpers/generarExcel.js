import { notificacion } from "./mensajes";
import * as XLSX from 'xlsx';

export const generarExcel = async (data, nombreArchivo, nombrePestana) => {
  try {
    const workbook = XLSX.utils.book_new();

    const sheet = XLSX.utils.json_to_sheet(data);

    const anchoColumnas = ajustarAnchoDeColumnas(XLSX.utils.sheet_to_json(sheet, {header: 1}));
    sheet['!cols'] = anchoColumnas.map(w => ({wch: w}));

    XLSX.utils.book_append_sheet(workbook, sheet, nombrePestana);

    XLSX.writeFile(workbook, `${nombreArchivo}.xlsx`);

    notificacion("positive", `Archivo generado correctamente`)
  } catch (error) {
    notificacion("negative", `No se pudo generar el archivo: ${error}`)
  } finally {
    return;
  }
}

const ajustarAnchoDeColumnas = (data) => {
  return data[0].map((_, colIndex) => data.reduce((max, row) => Math.max(max, row[colIndex] ? row[colIndex].toString().length : 0), 0));
}
