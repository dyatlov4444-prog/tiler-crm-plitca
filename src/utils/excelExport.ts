import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { OrderProject } from '../types/index';

export const exportProjectToExcel = async (p: OrderProject) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Смета');

  // 1. Настройка ширины колонок
  worksheet.columns = [
    { header: 'Наименование работ / материалов', key: 'name', width: 40 },
    { header: 'Кол-во', key: 'qty', width: 15 },
    { header: 'Ед. изм.', key: 'unit', width: 12 },
    { header: 'Цена (₽)', key: 'price', width: 15 },
    { header: 'Итого (₽)', key: 'total', width: 15 },
  ];

  // 2. Шапка документа (Заголовок)
  worksheet.mergeCells('A1:E1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = `ОФИЦИАЛЬНАЯ СМЕАТА НА РАБОТЫ: ${p.params.calculationType === 'floor' ? 'УКЛАДКА ПОЛА' : 'ОБЛИЦОВКА СТЕН'}`;
  titleCell.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0284C7' } }; // Красивый синий фон
titleCell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(1).height = 40;

  // 3. Информация о заказчике
  worksheet.addRow([]); // Пустая строка для отступа
  worksheet.addRow(['Заказчик:', p.clientName]);
  worksheet.addRow(['Адрес объекта:', p.address]);
  worksheet.addRow(['Дата замера:', p.createdAt]);
  worksheet.addRow([]); // Пустая строка

  // Стилизуем блок инфо
  ['A3', 'A4', 'A5'].forEach(cellRef => {
    worksheet.getCell(cellRef).font = { bold: true, color: { argb: 'FF64748B' } };
  });

  // 4. Шапка таблицы позиций
  const headerRow = worksheet.addRow(['Наименование позиций', 'Объём', 'Ед. изм.', 'Цена за ед.', 'Стоимость работ']);
  headerRow.height = 25;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } }; // Графитовый фон
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // 5. Наполнение данными
  const typeLabel = p.params.calculationType === 'floor' ? 'Укладка плитки на пол' : 'Облицовка стен плиткой';
  
  const rowsData = [
    [typeLabel, p.result.surfaceArea, 'м²', p.params.pricePerMeter, p.result.surfaceArea * p.params.pricePerMeter],
    ['Необходимый объем плитки (+10% подрезка)', p.result.tileCountNeeded, 'шт.', '-', '-'],
    ['Плиточный клей (высокоадгезивный)', p.result.glueKgNeeded, 'кг', '-', '-'],
    [`Затирка швов (${p.params.groutType === 'cement' ? 'цементная' : 'эпоксидная'})`, p.result.groutKgNeeded, 'кг', '-', '-'],
    ['Запил углов под 45° (еврозапил)', p.params.miterCutsLength, 'пог. м', 1000, p.params.miterCutsLength * 1000],
  ];

  rowsData.forEach((data) => {
    const r = worksheet.addRow(data);
    r.height = 20;
    r.getCell(2).alignment = { horizontal: 'center' };
    r.getCell(3).alignment = { horizontal: 'center' };
    // Добавляем тонкие границы к каждой ячейке данных
    r.eachCell((cell) => {
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
        right: { style: 'thin', color: { argb: 'E2E8F0' } }
      };
    });
  });

  // 6. Итоговая сумма (Финальный жирный блок)
  worksheet.addRow([]);
  const totalRow = worksheet.addRow(['', '', '', 'ИТОГО К ОПЛАТЕ:', p.result.totalCost]);
  totalRow.height = 30;
  const totalLabelCell = totalRow.getCell(4);
  const totalValueCell = totalRow.getCell(5);

  totalLabelCell.font = { bold: true, size: 11 };
  totalValueCell.font = { bold: true, size: 14, color: { argb: 'FF15803D' } }; // Зеленый цвет для денег
  totalValueCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } }; // Светло-зеленый фон
  totalValueCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // 7. Сборка и скачивание файла браузером
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Смета_${p.clientName}_${p.address.replace(/\s+/g, '_')}.xlsx`);
};
