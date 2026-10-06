import { OrderProject } from '../types/index';

interface CalculatorFormProps {
  isLoading: boolean;
  calculationType: 'floor' | 'bathroom_walls';
  setCalculationType: (v: 'floor' | 'bathroom_walls') => void;
  clientName: string;
  setClientName: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  projectStatus: OrderProject['status'];
  setProjectStatus: (v: OrderProject['status']) => void;
  roomWidth: string;
  setRoomWidth: (v: string) => void;
  roomLength: string;
  setRoomLength: (v: string) => void;
  roomHeight: string;
  setRoomHeight: (v: string) => void;
  tileWidth: string;
  setTileWidth: (v: string) => void;
  tileLength: string;
  setTileLength: (v: string) => void;
  groutType: 'cement' | 'epoxy';
  setGroutType: (v: 'cement' | 'epoxy') => void;
  miterCutsLength: string;
  setMiterCutsLength: (v: string) => void;
  pricePerMeter: string;
  setPricePerMeter: (v: string) => void;
  doorWidth: string;
  setDoorWidth: (v: string) => void;
  doorHeight: string;
  setDoorHeight: (v: string) => void;
  handleShowEstimate: () => void;
  handleSaveProject: () => void;
}

export function CalculatorForm({
  isLoading, calculationType, setCalculationType, clientName, setClientName, address, setAddress,
  projectStatus, setProjectStatus, roomWidth, setRoomWidth, roomLength, setRoomLength,
  roomHeight, setRoomHeight, tileWidth, setTileWidth, tileLength, setTileLength,
  groutType, setGroutType, miterCutsLength, setMiterCutsLength, pricePerMeter, setPricePerMeter,
  doorWidth, setDoorWidth, doorHeight, setDoorHeight, handleShowEstimate, handleSaveProject
}: CalculatorFormProps) {
  return (
    <div style={{ flex: '1.2', minWidth: '340px', backgroundColor: '#1e293b', border: '1px solid #334155', padding: '25px', borderRadius: '16px', boxSizing: 'border-box' }}>
      
      {/* ТАБЫ */}
      <div className="tab-container">
        <button onClick={() => setCalculationType('floor')} className="tab-btn" style={{ backgroundColor: calculationType === 'floor' ? '#0284c7' : 'transparent' }}>🔲 Пол</button>
        <button onClick={() => setCalculationType('bathroom_walls')} className="tab-btn" style={{ backgroundColor: calculationType === 'bathroom_walls' ? '#0284c7' : 'transparent' }}>🧱 Стены ванной</button>
      </div>

      <h3 style={{ marginTop: '0', marginBottom: '20px', fontSize: '18px', color: '#38bdf8', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
        📋 Объект: {calculationType === 'floor' ? 'Пол' : 'Стены ванной'}
      </h3>
      
      <input type="text" placeholder="Имя заказчика" value={clientName} onChange={(e) => setClientName(e.target.value)} className="form-input" />
      <input type="text" placeholder="Адрес объекта" value={address} onChange={(e) => setAddress(e.target.value)} className="form-input" />
      
      <select value={projectStatus} onChange={(e) => setProjectStatus(e.target.value as OrderProject['status'])} className="form-input">
        <option value="survey">Замер</option>
        <option value="in_progress">В работе</option>
        <option value="done">Сдан</option>
      </select>

      {/* ГАБАРИТЫ ПОМЕЩЕНИЯ */}
      <div className="form-row">
        <div className="input-group">
          <span className="input-label">Ширина комнаты (м)</span>
          <input type="number" value={roomWidth} onChange={(e) => setRoomWidth(e.target.value)} className="form-input" />
        </div>
        <div className="input-group">
          <span className="input-label">Длина комнаты (м)</span>
          <input type="number" value={roomLength} onChange={(e) => setRoomLength(e.target.value)} className="form-input" />
        </div>
        {calculationType === 'bathroom_walls' && (
          <div className="input-group">
            <span className="input-label" style={{ color: '#38bdf8' }}>Высота стен (м)</span>
            <input type="number" value={roomHeight} onChange={(e) => setRoomHeight(e.target.value)} className="form-input" style={{ borderColor: '#38bdf8' }} />
          </div>
        )}
      </div>

      {/* ВЫЧЕТ ДВЕРИ */}
      {calculationType === 'bathroom_walls' && (
        <div className="door-block">
          <div className="input-group">
            <span className="input-label">Ширина двери (м)</span>
            <input type="number" value={doorWidth} onChange={(e) => setDoorWidth(e.target.value)} className="form-input" />
          </div>
          <div className="input-group">
            <span className="input-label">Высота двери (м)</span>
            <input type="number" value={doorHeight} onChange={(e) => setDoorHeight(e.target.value)} className="form-input" />
          </div>
        </div>
      )}

      {/* РАЗМЕР ПЛИТКИ */}
      <div className="form-row">
        <div className="input-group">
          <span className="input-label">Ширина плитки (см)</span>
          <input type="number" value={tileWidth} onChange={(e) => setTileWidth(e.target.value)} className="form-input" />
        </div>
        <div className="input-group">
          <span className="input-label">Длина плитки (см)</span>
          <input type="number" value={tileLength} onChange={(e) => setTileLength(e.target.value)} className="form-input" />
        </div>
      </div>

      <select value={groutType} onChange={(e) => setGroutType(e.target.value as 'cement' | 'epoxy')} className="form-input">
        <option value="cement">Затирка: Цементная</option>
        <option value="epoxy">Затирка: Эпоксидная (+500 ₽/м²)</option>
      </select>

      <div className="form-row" style={{ marginBottom: '20px' }}>
        <div className="input-group">
          <span className="input-label">Углы 45° (м)</span>
          <input type="number" value={miterCutsLength} onChange={(e) => setMiterCutsLength(e.target.value)} className="form-input" />
        </div>
        <div className="input-group">
          <span className="input-label">Цена за м²</span>
          <input type="number" value={pricePerMeter} onChange={(e) => setPricePerMeter(e.target.value)} className="form-input" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={handleShowEstimate} disabled={isLoading} className="btn-calc" style={{ flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>Смету</button>
        <button onClick={handleSaveProject} disabled={isLoading} className="btn-save" style={{ flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>В CRM</button>
      </div>
    </div>
  );
}
