import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth.js';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPois = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/pois`);  
        if (!response.ok) throw new Error('No se pudo cargar el listado de POIs');
        const data = await response.json();
        setPois(data);
      } catch (err) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchPois();
  }, []);

  const totalPois = pois.length;
  const uniqueCenters = [...new Set(pois.map((p) => p.centerId))].length;
  const lastChanges = [...pois]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 5);

  // Calcular distribución de POIs por centro
  const poisByCenter = pois.reduce((acc, poi) => {
    const existingCenter = acc.find((c) => c.name === String(poi.centerId));
    if (existingCenter) {
      existingCenter.value++;
    } else {
      acc.push({ name: String(poi.centerId), value: 1 });
    }
    return acc;
  }, []);

  // Ordenar por nombre para consistent visualization
  poisByCenter.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col h-full gap-4 p-10">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl text-center font-bold text-slate-900">DASHBOARD</h1>
          <p className="text-center mt-1">Resumen rápido de POIs y última actividad</p>
        </div>
        <Link
          to="/listpois"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
        >
          Ir a POIs
        </Link>
      </header>

      {loading ? (
        <div className="p-6 bg-white rounded-xl shadow border border-slate-200">Cargando datos...</div>
      ) : error ? (
        <div className="p-6 bg-red-50 rounded-xl border border-red-200 text-red-700">{error}</div>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            <article className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">POIs totales</p>
              <p className="text-3xl font-bold text-blue-700">{totalPois}</p>
            </article>
            <article className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">Centros con POIs</p>
              <p className="text-3xl font-bold text-blue-700">{uniqueCenters}</p>
            </article>
            <article className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">Actualización reciente</p>
              <p className="text-3xl font-bold text-blue-700">{lastChanges.length}</p>
              <p className="text-xs text-slate-500">Últimos 5 POIs</p>
            </article>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Últimos cambios en POIs</h2>
            {lastChanges.length === 0 ? (
              <p className="text-slate-500">No hay POIs disponibles.</p>
            ) : (
              <ul className="space-y-3">
                {lastChanges.map((poi) => (
                  <li key={poi.id} className="border border-slate-100 rounded-lg p-3 hover:bg-slate-50">
                    <p className="font-semibold text-slate-800">{poi.name}</p>
                    <p className="text-xs text-slate-500">Centro: {poi.centerId}</p>
                    <p className="text-sm text-slate-600 mt-1">{poi.description}</p>
                  </li>
                ))}
              </ul>
              
            )}
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Distribución de POIs por Centro</h2>
            {poisByCenter.length === 0 ? (
              <p className="text-slate-500">No hay datos disponibles para mostrar el gráfico.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={poisByCenter} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    label={{ value: 'Centro', position: 'insideBottomRight', offset: -10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    label={{ value: 'Cantidad de POIs', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                    formatter={(value) => [value, 'POIs']}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#2563eb" name="POIs" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;