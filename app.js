// Task1: initiate app and run server at 3000

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend build (try both possible folder names used in the starter)
app.use(express.static(path.join(__dirname, 'dist/FrontEnd')));
app.use(express.static(path.join(__dirname, 'dist/Frontend')));

// --- MongoDB connection ---
// Use environment variable MONGODB_URI in production. Replace placeholder below with your Atlas URI if testing locally.
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/employeeDB?retryWrites=true&w=majority';

mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err.message));

// Employee schema & model
const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: String,
    position: String,
    salary: Number,
}, { timestamps: true });
const Employee = mongoose.model('Employee', employeeSchema);

// GET all employees
app.get('/api/employeelist', async (req, res) => {
    try {
        const list = await Employee.find().sort({ createdAt: -1 });
        res.json(list);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch employee list' });
    }
});

// GET single employee
app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const emp = await Employee.findById(req.params.id);
        if (!emp) return res.status(404).json({ error: 'Employee not found' });
        res.json(emp);
    } catch (err) {
        console.error(err);
        // if invalid ObjectId, return 400
        if (err.kind === 'ObjectId') return res.status(400).json({ error: 'Invalid id' });
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
});

// POST add employee
app.post('/api/employeelist', async (req, res) => {
    try {
        const { name, location, position, salary } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });
        const created = await Employee.create({ name, location, position, salary });
        res.status(201).json(created);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add employee' });
    }
});

// DELETE employee
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const removed = await Employee.findByIdAndDelete(req.params.id);
        if (!removed) return res.status(404).json({ error: 'Employee not found' });
        res.json({ message: 'Employee deleted', id: removed._id });
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') return res.status(400).json({ error: 'Invalid id' });
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});

// PUT update (by :id)
app.put('/api/employeelist/:id', async (req, res) => {
    try {
        const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ error: 'Employee not found' });
        res.json(updated);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') return res.status(400).json({ error: 'Invalid id' });
        res.status(500).json({ error: 'Failed to update employee' });
    }
});

// Also accept PUT with _id in body
app.put('/api/employeelist', async (req, res) => {
    try {
        const { _id, ...rest } = req.body;
        if (!_id) return res.status(400).json({ error: '_id required in body' });
        const updated = await Employee.findByIdAndUpdate(_id, rest, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ error: 'Employee not found' });
        res.json(updated);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') return res.status(400).json({ error: 'Invalid id' });
        res.status(500).json({ error: 'Failed to update employee' });
    }
});

// Keep this route - connects the front end file.
app.get('/*', function (req, res) {
    const index1 = path.join(__dirname, 'dist/Frontend/index.html');
    const index2 = path.join(__dirname, 'dist/FrontEnd/index.html');
    if (fs.existsSync(index1)) return res.sendFile(index1);
    if (fs.existsSync(index2)) return res.sendFile(index2);
    res.status(404).send('Index file not found');
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
