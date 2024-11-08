// index.js
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises'; // Import JSON file
const app = express();
app.use(cors({
    origin: '*'
}));
const port = process.env.PORT || 5002;


let jsonData;

// Function to read JSON data
const readJson = async () => {
    const data = await fs.readFile('data.json', 'utf-8');
    jsonData = JSON.parse(data);
};

readJson().then(() => {
    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
});

// Endpoint to get all components
app.get('/components', (req, res) => {
    res.json(jsonData.components);
});

// Endpoint to filter components by voltage
app.get('/voltage', (req, res) => {
    const reqVoltage = req.query.voltage;
    const filteredComponents = jsonData.components.filter(component => component.voltage === reqVoltage);
    res.json(filteredComponents.length ? filteredComponents : { message: 'No components found with that voltage' });
});

// Endpoint to filter components by application
app.get('/application', (req, res) => {
    const reqApplication = req.query.application;
    const filteredComponents = jsonData.components.filter(component => component.application.toLowerCase().includes(reqApplication.toLowerCase()));
    res.json(filteredComponents.length ? filteredComponents : { message: 'No components found for that application' });
});

// Endpoint to get specific component by name (URL parameter)
app.get('/component/:name', (req, res) => {
    const componentName = req.params.name.toLowerCase();
    const component = jsonData.components.find(c => c.name.toLowerCase().includes(componentName));
    if (component) {
        res.json(component);
    } else {
        res.status(404).json({ message: 'Component not found' });
    }
});
