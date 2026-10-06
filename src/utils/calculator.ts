import { CalculationParams, CalculationResult } from '../types/index';

export const calculateFloorTile = (params: CalculationParams): CalculationResult => {
  const { room, tile, pricePerMeter, groutType, miterCutsLength } = params;

  // 1. Площадь облицовки
  const surfaceArea = room.width * room.length;

  // 2. Расчет плитки (+10% на подрезку)
  const tileAreaInMeters = (tile.width / 100) * (tile.length / 100);
  const baseTileCount = surfaceArea / tileAreaInMeters;
  const tileCountNeeded = Math.ceil(baseTileCount * 1.1);

  // 3. Расчет материалов
  const glueKgNeeded = Math.round(surfaceArea * 4); // 4кг клея на кв.м.
  const groutKgNeeded = Number((surfaceArea * 0.4).toFixed(1)); // 0.4кг затирки на кв.м.

  // 4. Базовая стоимость укладки
  let workCost = surfaceArea * pricePerMeter;

  // Добавляем наценку за эпоксидную затирку
  if (groutType === 'epoxy') {
    workCost += surfaceArea * 500;
  }

  // Добавляем стоимость запила углов под 45 градусов
  workCost += miterCutsLength * 1000;

  return {
    surfaceArea: Number(surfaceArea.toFixed(2)),
    tileCountNeeded,
    glueKgNeeded,
    groutKgNeeded,
    totalCost: Math.round(workCost),
  };
};
