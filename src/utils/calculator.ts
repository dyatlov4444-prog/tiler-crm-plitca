import { CalculationParams, CalculationResult } from '../types/index';
import {
  TILE_WASTE_PERCENT,
  GLUE_PER_M2,
  GROUT_PER_M2,
  EPOXY_SURCHARGE_PER_M2,
  MITER_CUT_PRICE_PER_M,
} from './constants';

export const calculateFloorTile = (params: CalculationParams): CalculationResult => {
  const { room, tile, pricePerMeter, groutType, miterCutsLength } = params;

  // 1. Площадь облицовки
  const surfaceArea = room.width * room.length;

  // 2. Расчет плитки (+10% на подрезку)
  const tileAreaInMeters = (tile.width / 100) * (tile.length / 100);
  const baseTileCount = surfaceArea / tileAreaInMeters;
  const tileCountNeeded = Math.ceil(baseTileCount * (1 + TILE_WASTE_PERCENT));

  // 3. Расчет материалов
  const glueKgNeeded = Math.round(surfaceArea * GLUE_PER_M2);
  const groutKgNeeded = Number((surfaceArea * GROUT_PER_M2).toFixed(1));

  // 4. Базовая стоимость укладки
  let workCost = surfaceArea * pricePerMeter;

  // Добавляем наценку за эпоксидную затирку
  if (groutType === 'epoxy') {
    workCost += surfaceArea * EPOXY_SURCHARGE_PER_M2;
  }

  // Добавляем стоимость запила углов под 45 градусов
  workCost += miterCutsLength * MITER_CUT_PRICE_PER_M;

  return {
    surfaceArea: Number(surfaceArea.toFixed(2)),
    tileCountNeeded,
    glueKgNeeded,
    groutKgNeeded,
    totalCost: Math.round(workCost),
  };
};

// Новый функция для расчёта стен ванной
export const calculateBathroomWalls = (params: CalculationParams): CalculationResult => {
  const { room, tile, pricePerMeter, groutType, miterCutsLength, doorWidth, doorHeight } = params;

  // 1. Площадь стен = периметр × высота
  const perimeter = 2 * (room.width + room.length);
  const totalWallArea = perimeter * (room.height ?? 0);

  // 2. Вычитаем дверь (если указана)
  const doorArea = (doorWidth ?? 0) * (doorHeight ?? 0);
  const surfaceArea = Math.max(0, totalWallArea - doorArea);

  // 3. Расчет плитки (+10% на подрезку)
  const tileAreaInMeters = (tile.width / 100) * (tile.length / 100);
  const baseTileCount = surfaceArea / tileAreaInMeters;
  const tileCountNeeded = Math.ceil(baseTileCount * (1 + TILE_WASTE_PERCENT));

  // 4. Расчет материалов
  const glueKgNeeded = Math.round(surfaceArea * GLUE_PER_M2);
  const groutKgNeeded = Number((surfaceArea * GROUT_PER_M2).toFixed(1));

  // 5. Базовая стоимость укладки
  let workCost = surfaceArea * pricePerMeter;

  if (groutType === 'epoxy') {
    workCost += surfaceArea * EPOXY_SURCHARGE_PER_M2;
  }

  workCost += miterCutsLength * MITER_CUT_PRICE_PER_M;

  return {
    surfaceArea: Number(surfaceArea.toFixed(2)),
    tileCountNeeded,
    glueKgNeeded,
    groutKgNeeded,
    totalCost: Math.round(workCost),
  };
};
