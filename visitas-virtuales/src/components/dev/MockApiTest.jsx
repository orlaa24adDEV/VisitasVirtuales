import { useState } from 'react';

export default function MockAPITest() {
	const [pois, setPois] = useState([]);

	const getPois = async () => {
		try {
			const response = await fetch('/api/pois');
			const data = await response.json();
			setPois(data);
			console.log('POIs:', data);
		} catch (error) {
			setPois([]);
			console.error('Error al obtener POIs:', error);
		}
	};

	return (
		<>
			<h1 className="text-3xl font-bold text-zinc-900 ">
				Mock de listado de POIs
			</h1>
			<button
				className="px-4 py-2 bg-blue-500 text-white rounded"
				onClick={getPois}>
				Obtener POIs
			</button>
			{pois.length > 0 && (
				<table className="w-full max-w-2xl border border-zinc-300 bg-white overflow-hidden">
					<thead className="bg-zinc-300 p-2">
						<tr>
							<th className="px-4 py-2 text-left">ID</th>
							<th className="px-4 py-2 text-left">Nombre</th>
							<th className="px-4 py-2 text-left">Descripción</th>
						</tr>
					</thead>
					{pois.map((poi) => (
						<tbody key={poi.id} className="border-t border-zinc-300">
							<tr key={poi.id}>
								<td className="px-6 py-4">{poi.id}</td>
								<td className="px-6 py-4">{poi.name}</td>
								<td className="px-6 py-4">{poi.description}</td>
							</tr>
						</tbody>
					))}
				</table>
			)}
		</>
	);
}
