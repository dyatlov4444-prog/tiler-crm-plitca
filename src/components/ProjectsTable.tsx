import { OrderProject } from '../types/index';

interface ProjectsTableProps {
  filteredProjects: OrderProject[];
  updateProjectStatus: (id: string, status: OrderProject['status']) => void;
  deleteProject: (id: string) => void;
  handleExportToTxt: (p: OrderProject) => void;
}

export function ProjectsTable({
  filteredProjects,
  updateProjectStatus,
  deleteProject,
  handleExportToTxt
}: ProjectsTableProps) {
  return (
    <div style={{ marginTop: '50px', borderTop: '1px solid #334155', paddingTop: '30px' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#f8fafc', textAlign: 'left' }}>🗃️ Сохраненная база объектов</h3>

      {filteredProjects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#1e293b', borderRadius: '12px', color: '#64748b', border: '1px dashed #334155', fontStyle: 'italic' }}>
          Нет объектов по выбранному фильтру.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #334155' }}>
<table className="crm-mobile-table" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1e293b', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', color: '#94a3b8', fontSize: '13px' }}>
                <th style={{ padding: '14px' }}>Дата</th>
                <th style={{ padding: '14px' }}>Объект / Заказчик</th>
                <th style={{ padding: '14px' }}>Объемы и материалы</th>
                <th style={{ padding: '14px' }}>Смета</th>
                <th style={{ padding: '14px' }}>Статус</th>
                <th style={{ padding: '14px', textAlign: 'center' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #334155', fontSize: '14px' }}>
                  <td style={{ padding: '14px', color: '#64748b', fontSize: '12px' }}>{p.createdAt}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ fontWeight: 'bold', color: '#f8fafc', display: 'block' }}>{p.clientName}</span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{p.address}</span>
                    <span style={{ fontSize: '11px', color: '#38bdf8', display: 'block', marginTop: '4px' }}>
                      {p.params.calculationType === 'floor' ? '🔲 Пол' : '🧱 Стены ванной'}
                    </span>
                  </td>
                  <td style={{ padding: '14px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
                    <div style={{ marginBottom: '2px' }}>📐 Площадь: <strong style={{ color: '#38bdf8' }}>{p.result.surfaceArea} м²</strong></div>
                    <div style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '6px' }}>
                      (Габариты: {p.params.room.width}м × {p.params.room.length}м {p.params.calculationType === 'bathroom_walls' && `× H:${p.params.room.height}м`})
                    </div>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 'bold', color: '#34d399', fontSize: '15px' }}>{p.result.totalCost.toLocaleString('ru-RU')} ₽</td>
                  <td style={{ padding: '14px' }}>
                    <select value={p.status} onChange={(e) => updateProjectStatus(p.id, e.target.value as OrderProject['status'])} style={{ padding: '6px 10px', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '6px', color: '#f8fafc', fontSize: '13px' }}>
                      <option value="survey">🔍 Замер</option>
                      <option value="in_progress">⚡ В работе</option>
                      <option value="done">✅ Сдан</option>
                    </select>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <button onClick={() => handleExportToTxt(p)} style={{ padding: '6px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', marginRight: '5px' }}>
                      ⬇️ Смета
                    </button>
                    <button onClick={() => deleteProject(p.id)} style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
