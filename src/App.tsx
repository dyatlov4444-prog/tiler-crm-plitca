import { useState } from 'react';
import { calculateFloorTile } from './utils/calculator';
import { useProjects } from './hooks/useProjects';
import { CalculationResult, OrderProject } from './types/index';
import { ProjectsTable } from './components/ProjectsTable';
import { CalculatorForm } from './components/CalculatorForm';
import { EstimateDetails } from './components/EstimateDetails'; // Импортируем наш чек
import { exportProjectToExcel } from './utils/excelExport';


export default function App() {
  const { projects, isLoading, addProject, deleteProject, updateProjectStatus } = useProjects();

  const [calculationType, setCalculationType] = useState<'floor' | 'bathroom_walls'>('floor');
  const [roomWidth, setRoomWidth] = useState<string>('3');
  const [roomLength, setRoomLength] = useState<string>('4');
  const [roomHeight, setRoomHeight] = useState<string>('2.5');
  const [tileWidth, setTileWidth] = useState<string>('30');
  const [tileLength, setTileLength] = useState<string>('30');
  const [pricePerMeter, setPricePerMeter] = useState<string>('1500');
  const [groutType, setGroutType] = useState<'cement' | 'epoxy'>('cement');
  const [miterCutsLength, setMiterCutsLength] = useState<string>('0');
  const [doorWidth, setDoorWidth] = useState<string>('0.7');
  const [doorHeight, setDoorHeight] = useState<string>('2');

  const [address, setAddress] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [projectStatus, setProjectStatus] = useState<OrderProject['status']>('survey');

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleCalculate = () => {
    const width = Number(roomWidth);
    const length = Number(roomLength);
    const height = Number(roomHeight);
    const tWidth = Number(tileWidth);
    const tLength = Number(tileLength);
    const price = Number(pricePerMeter);
    const miter = Number(miterCutsLength);
    const dWidth = Number(doorWidth);
    const dHeight = Number(doorHeight);

    if (width > 0 && length > 0 && tWidth > 0 && tLength > 0 && price > 0 && miter >= 0) {
      return calculateFloorTile({
        calculationType,
        room: { width, length, height },
        tile: { width: tWidth, length: tLength },
        pricePerMeter: price,
        groutType,
        miterCutsLength: miter,
        doorWidth: dWidth,
        doorHeight: dHeight
      });
    }
    return null;
  };

  const handleShowEstimate = () => {
    const calcData = handleCalculate();
    if (calcData) setResult(calcData);
    else alert('Заполните поля корректными числами!');
  };

  const handleSaveProject = async () => {
    const calcData = handleCalculate();
    if (!address.trim() || !clientName.trim()) {
      alert('Введите адрес и имя клиента!');
      return;
    }
    if (!calcData) return;

    await addProject({
      address,
      clientName,
      status: projectStatus,
      params: {
        calculationType,
        room: { width: Number(roomWidth), length: Number(roomLength), height: Number(roomHeight) },
        tile: { width: Number(tileWidth), length: Number(tileLength) },
        pricePerMeter: Number(pricePerMeter),
        groutType,
        miterCutsLength: Number(miterCutsLength),
        doorWidth: Number(doorWidth),
        doorHeight: Number(doorHeight)
      },
      result: calcData
    });

    setAddress('');
    setClientName('');
    setResult(null);
  };

    const handleExportToTxt = async (p: OrderProject) => {
    await exportProjectToExcel(p);
  };

  const totalEarned = projects.filter((p) => p.status === 'done').reduce((sum, p) => sum + p.result.totalCost, 0);
  const inProgressCost = projects.filter((p) => p.status === 'in_progress').reduce((sum, p) => sum + p.result.totalCost, 0);
  const filteredProjects = projects.filter((p) => filterStatus === 'all' ? true : p.status === filterStatus);

  return (
<div style={{ padding: '30px 20px', fontFamily: '"Segoe UI", sans-serif', width: '100%', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', boxSizing: 'border-box' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#38bdf8', fontSize: '28px', fontWeight: '800' }}>
        ⚒️ Строительная CRM-система плиточника PRO
      </h2>

      {/* ДАШБОРД АНАЛИТИКИ */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '20px', flex: '1', borderRadius: '12px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>ВСЕГО ОБЪЕКТОВ</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '5px' }}>{projects.length} шт.</div>
        </div>
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '20px', flex: '1', borderRadius: '12px' }}>
          <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 'bold' }}>В ПРОЦЕССЕ РАБОТЫ</div>
          <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '5px', color: '#fbbf24' }}>{inProgressCost.toLocaleString()} ₽</div>
        </div>
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '20px', flex: '1', borderRadius: '12px' }}>
          <div style={{ fontSize: '11px', color: '#34d399', fontWeight: 'bold' }}>СДАНО И ЗАРАБОТАНО</div>
          <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '5px', color: '#34d399' }}>{totalEarned.toLocaleString()} ₽</div>
        </div>
      </div>

      {/* ОСНОВНОЙ БЛОК */}
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginBottom: '30px', position: 'relative' }}>
        {isLoading && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10, borderRadius: '16px', backdropFilter: 'blur(2px)' }}>
            <div style={{ color: '#38bdf8', fontWeight: 'bold', padding: '20px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}>
              ⚡ Соединение с сервером CRM...
            </div>
          </div>
        )}

        {/* ПОДКЛЮЧАЕМ НАШУ ФОРМУ КАЛЬКУЛЯТОРА */}
        <CalculatorForm 
          isLoading={isLoading} calculationType={calculationType} setCalculationType={setCalculationType}
          clientName={clientName} setClientName={setClientName} address={address} setAddress={setAddress}
          projectStatus={projectStatus} setProjectStatus={setProjectStatus} roomWidth={roomWidth} setRoomWidth={setRoomWidth}
          roomLength={roomLength} setRoomLength={setRoomLength} roomHeight={roomHeight} setRoomHeight={setRoomHeight}
          tileWidth={tileWidth} setTileWidth={setTileWidth} tileLength={tileLength} setTileLength={setTileLength}
          groutType={groutType} setGroutType={setGroutType} miterCutsLength={miterCutsLength} setMiterCutsLength={setMiterCutsLength}
          pricePerMeter={pricePerMeter} setPricePerMeter={setPricePerMeter} doorWidth={doorWidth} setDoorWidth={setDoorWidth}
          doorHeight={doorHeight} setDoorHeight={setDoorHeight} handleShowEstimate={handleShowEstimate} handleSaveProject={handleSaveProject}
        />

        {/* ПОДКЛЮЧАЕМ НАШ ВЫНЕСЕННЫЙ ЧЕК ДЕТАЛИЗАЦИИ РАСЧЕТА */}
        <EstimateDetails result={result} />
      </div>

      {/* ПОДКЛЮЧАЕМ НАШУ ТАБЛИЦУ */}
        <ProjectsTable 
        filteredProjects={filteredProjects}
        updateProjectStatus={updateProjectStatus}
        deleteProject={deleteProject}
        handleExportToTxt={handleExportToTxt}
      />

    </div>
  );
}
