import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import fetchWithTimeout from '@/helpers/fetchWithTimeout.js';
import Button from '@/components/Button.jsx';

const Dashboard = () => {
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { allCenters, selectCenter } = useAuth();
  const navigate = useNavigate();

  // Cargar todos los POIs al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      const fetchPois = fetchWithTimeout('/api/pois', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') }
      }, 5000);
      try {
        const response = await fetchPois;
        const data = await response.json();
        if (!response.ok) throw new Error('No se pudo cargar el listado de POIs: ' + (data.message));
        setPois(Array.isArray(data) ? data : Array.isArray(data.pois) ? data.pois : []);
      } catch (err) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPois = pois.length;
  const uniqueCenters = [...new Set(pois.map((p) => p.centerId))].length;
  const lastChanges = [...pois]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 5);


  // Helper para obtener el nombre del centro por ID
  const getCenterName = (centerId) => {
    if (!allCenters || allCenters.length === 0) return null;
    const center = allCenters.find((c) => Number(c.id) === Number(centerId));
    return center ? center.name : null;
  };

  // Calcular distribución de POIs por centro
  const poisByCenter = (allCenters && allCenters.length > 0)
    ? pois.reduce((acc, poi) => {
        const centerName = getCenterName(poi.centerId);
        if (!centerName) return acc; // Ignorar POIs sin centro válido
        const existingCenter = acc.find((c) => c.name === centerName);
        if (existingCenter) {
          existingCenter.value++;
        } else {
          acc.push({ name: centerName, value: 1 });
        }
        return acc;
      }, [])
    : [];

  // Ordenar por mayor cantidad para resaltar los centros más activos
  poisByCenter.sort((a, b) => b.value - a.value);

  const recentCountsByCenter = lastChanges.reduce((acc, poi) => {
    const centerName = getCenterName(poi.centerId);
    if (!centerName) return acc;
    acc[centerName] = (acc[centerName] || 0) + 1;
    return acc;
  }, {});

  const poisByCenterWithPercent = poisByCenter.map((item) => ({
    ...item,
    percentage: totalPois > 0 ? Number(((item.value / totalPois) * 100).toFixed(1)) : 0,
    recentCount: recentCountsByCenter[item.name] || 0,
  }));

  const mostActiveCenter = poisByCenterWithPercent[0] || null;

  const [mostRecentCenterName, mostRecentCenterCount] = Object.entries(recentCountsByCenter)
    .sort(([, a], [, b]) => b - a)[0] || [null, 0];

  const filteredPoisByCenter = searchQuery
    ? poisByCenterWithPercent.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : poisByCenterWithPercent;

  // Handler para click en las barras del gráfico
  const handleBarClick = (data) => {
    const centerName = data.name;
    const center = allCenters.find((c) => c.name === centerName);
    if (center) {
      selectCenter(center);
      navigate('/home');
    }
  };

  return (
    <div className="flex flex-col min-h-screen gap-4 p-10 pb-16">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">DASHBOARD</h1>
          <p className="text-slate-600 mt-2 text-sm font-medium">Resumen completo de puntos de interés y actividad reciente</p>
        </div>
          <Link
          to="/listpois"
        >
          <Button variant="primary" size="normal" className="w-full">
            Ir a POIs
          </Button>
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

          <section className="grid gap-4 sm:grid-cols-2">
            <article className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">Centro con más POIs</p>
              <p className="text-2xl font-bold text-slate-800">{mostActiveCenter ? mostActiveCenter.name : '—'}</p>
              <p className="text-sm text-slate-500 mt-1">{mostActiveCenter ? `${mostActiveCenter.value} POIs` : 'Sin datos'}</p>
            </article>
            <article className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">Centro con más cambios recientes</p>
              <p className="text-2xl font-bold text-slate-800">{mostRecentCenterName || '—'}</p>
              <p className="text-sm text-slate-500 mt-1">{mostRecentCenterName ? `${mostRecentCenterCount} cambios` : 'Sin datos recientes'}</p>
            </article>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Últimos cambios en POIs</h2>
            {lastChanges.length === 0 ? (
              <p className="text-slate-500">No hay POIs disponibles.</p>
            ) : (
              <ul className="space-y-3">
                {lastChanges.map((poi) => {
                  const centerName = getCenterName(poi.centerId) || 'Sin centro';
                  return (
                    <li key={poi.id} className="border border-slate-100 rounded-lg p-3 hover:bg-slate-50">
                      <p className="font-semibold text-slate-800">{poi.name}</p>
                      <p className="text-xs text-slate-500">Centro: {centerName}</p>
                      <p className="text-sm text-slate-600 mt-1">{poi.description}</p>
                    </li>
                  );
                })}
              </ul>
              
            )}
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <label htmlFor="search-centers" className="block text-sm font-semibold text-slate-700 mb-2">
          Buscar centro
        </label>
        <input
          id="search-centers"
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Escribe el nombre del centro..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 focus:border-blue-500 focus:ring-blue-500"
        />
      </section>

          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">POIs totales y últimos cambios por Centro</h2>
            {filteredPoisByCenter.length === 0 ? (
              <p className="text-slate-500">No hay datos disponibles para mostrar el gráfico.</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={520}>
                  <BarChart data={filteredPoisByCenter} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      label={{ value: 'Centro', position: 'insideBottomRight'}}
                      textAnchor="middle"
                      height={80}
                    />
                    <YAxis 
                      label={{ value: 'Cantidad', angle: -90, position: 'insideLeft', offset: 0, textAnchor: 'middle' }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                      formatter={(value, name) => {
                        if (name === 'recentCount') return [`${value} recientes`, 'Últimos cambios'];
                        if (name === 'value') return [`${value} POIs`, 'Total'];
                        return [value, name];
                      }}
                      labelFormatter={(label) => `Centro: ${label}`}
                    />
                    <Legend formatter={(value) => (value === 'recentCount' ? 'Últimos cambios' : 'Total POIs')} />
                    <Bar 
                      dataKey="recentCount" 
                      fill="#10b981" 
                      name="recentCount" 
                      radius={[8, 8, 0, 0]}
                      cursor="pointer"
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#2563eb" 
                      name="value" 
                      radius={[8, 8, 0, 0]}
                      onClick={handleBarClick}
                      cursor="pointer"
                    >
                      <LabelList dataKey="percentage" position="top" formatter={(value) => `${value}%`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="mt-3 text-sm text-slate-500">
                  La barra verde muestra cuántos POIs de los últimos cambios recientes pertenecen al centro.
                </p>
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;