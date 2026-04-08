const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'pois.json');

app.use(cors());
app.use(express.json());

// Leer POIs
app.get('/api/pois', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
});

// Crear o Actualizar 
app.post('/api/pois', (req, res) => {
    const pois = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const { centerId, name, description } = req.body;

    // 1. Filtramos los POIs que pertenecen a ese centro específico
    const poisDelCentro = pois.filter(p => p.centerId === centerId);

    // 2. Buscamos el ID máximo dentro de ese centro
    const maxId = poisDelCentro.length > 0 
        ? Math.max(...poisDelCentro.map(p => parseInt(p.id))) 
        : 0;

    // 3. El nuevo ID será el máximo del centro + 1
    const newPoi = { 
        id: (maxId + 1).toString(), 
        centerId: centerId,         
        name: name,                 
        description: description 
    };
    pois.push(newPoi);
    fs.writeFileSync(DATA_FILE, JSON.stringify(pois, null, 2));
    res.status(201).json(newPoi);
});

app.put('/api/pois/:id', (req, res) => {
    let pois = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const poiId = req.params.id;
    const centerId = req.body.centerId; 

    pois = pois.map(p => 
        (p.id === poiId && p.centerId === centerId) ? req.body : p
    );
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(pois, null, 2));
    res.json(req.body);
});

// Eliminar
app.delete('/api/pois/:id', (req, res) => {
    let pois = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const poiId = req.params.id;
    const centerId = req.query.centerId; 

    pois = pois.filter(p => !(p.id === poiId && p.centerId === centerId));
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(pois, null, 2));
    res.status(204).send();
});


//-------------------------------------------------------------------

const CENTERS_FILE = path.join(__dirname, 'centers.json');

// Leer POIs
app.get('/api/centers', (req, res) => {
     try {
        const data = fs.readFileSync(CENTERS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error al leer centros:', error);
        res.status(500).json({ error: 'No se pudieron cargar los centros' });
    }
});




//----------------------------------------------------------------
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
//Conectar el servidor con node index.js.