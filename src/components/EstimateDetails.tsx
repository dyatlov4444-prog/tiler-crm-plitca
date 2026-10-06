import { CalculationResult } from '../types/index';

interface EstimateDetailsProps {
  result: CalculationResult | null;
}

export function EstimateDetails({ result }: EstimateDetailsProps) {
  return (
    <div style={{ flex: '0.8', minWidth: '320px', backgroundColor: '#1e293b', border: '1px dashed #475569', padding: '25px', borderRadius: '16px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <h3 style={{ marginTop: '0', color: '#94a3b8' }}>📋 Детализация текущего расчета</h3>
      {result ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #334155', paddingBottom: '6px' }}>
              <span style={{ color: '#94a3b8' }}>Площадь облицовки:</span><strong>{result.surfaceArea} м²</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #334155', paddingBottom: '6px' }}>
              <span style={{ color: '#94a3b8' }}>Плитка (+10%):</span><strong>{result.tileCountNeeded} шт.</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #334155', paddingBottom: '6px' }}>
              <span style={{ color: '#94a3b8' }}>Клей плиточный:</span><strong>{result.glueKgNeeded} кг.</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #334155', paddingBottom: '6px' }}>
              <span style={{ color: '#94a3b8' }}>Объем затирки:</span><strong>{result.groutKgNeeded} кг.</strong>
            </div>
          </div>
          <div style={{ marginTop: '20px', backgroundColor: '#0f172a', padding: '15px', borderRadius: '10px', textAlign: 'center', border: '1px solid #334155' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>ИТОГО СУММА РАБОТ</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#34d399', marginTop: '5px' }}>{result.totalCost.toLocaleString('ru-RU')} ₽</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', fontStyle: 'italic', textAlign: 'center', margin: 'auto' }}>
          Данные расчета появятся здесь.
        </div>
      )}
    </div>
  );
}
