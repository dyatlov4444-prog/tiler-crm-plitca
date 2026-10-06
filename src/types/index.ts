export interface RoomDimensions {
  width: number;
  length: number;
  height?: number; // Высота стен (необязательная для чистого пола)
}

export interface TileDimensions {
  width: number;
  length: number;
}

export interface CalculationParams {
  calculationType: 'floor' | 'bathroom_walls'; // ТАБЫ: Пол или Стены санузла
  room: RoomDimensions;
  tile: TileDimensions;
  pricePerMeter: number;
  groutType: 'cement' | 'epoxy';
  miterCutsLength: number;
  doorWidth?: number;  // Вычитаемая дверь
  doorHeight?: number; // Вычитаемая дверь
}

export interface CalculationResult {
  surfaceArea: number;
  tileCountNeeded: number;
  glueKgNeeded: number;
  groutKgNeeded: number;
  totalCost: number;
}

export interface OrderProject {
  id: string;
  address: string;
  clientName: string;
  status: 'survey' | 'in_progress' | 'done';
  createdAt: string;
  params: CalculationParams;
  result: CalculationResult;
}
