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

// Crear o Actualizar (CRUD completo)
app.post('/api/pois', (req, res) => {
    const pois = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const newPoi = { ...req.body, id: Date.now().toString() };
    pois.push(newPoi);
    fs.writeFileSync(DATA_FILE, JSON.stringify(pois, null, 2));
    res.status(201).json(newPoi);
});

app.put('/api/pois/:id', (req, res) => {
    let pois = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    pois = pois.map(p => p.id === req.params.id ? req.body : p);
    fs.writeFileSync(DATA_FILE, JSON.stringify(pois, null, 2));
    res.json(req.body);
});

app.delete('/api/pois/:id', (req, res) => {
    let pois = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    pois = pois.filter(p => p.id !== req.params.id);
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
