require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

// ========== CONEXION A MONGODB ATLAS ==========
const MONGODB_URI = process.env.MONGODB_URI;

console.log('Intentando conectar a MongoDB Atlas...');

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Conectado a MongoDB Atlas');
        console.log('Base de datos:', mongoose.connection.db.databaseName);
    })
    .catch(err => {
        console.error('Error conectando a MongoDB:', err);
        process.exit(1);
    });

// ========== SCHEMA Y MODELO ==========
const productoSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es requerido'],
        trim: true 
    },
    categoria: { 
        type: String, 
        required: [true, 'La categoria es requerida'],
        default: 'General'
    },
    precio: { 
        type: Number, 
        required: [true, 'El precio es requerido'],
        min: [0, 'El precio no puede ser negativo']
    },
    stock: { 
        type: Number, 
        required: [true, 'El stock es requerido'],
        min: [0, 'El stock no puede ser negativo'],
        default: 0
    },
    marca: { 
        type: String, 
        required: [true, 'La marca es requerida'],
        trim: true 
    },
    descripcion: { 
        type: String, 
        default: '',
        trim: true 
    }
}, { 
    timestamps: true 
});

const Producto = mongoose.model('Producto', productoSchema);

// ========== DATOS INICIALES ==========
const productosIniciales = [
    { nombre: "Driver TaylorMade Qi10", categoria: "Driver", precio: 599.99, stock: 10, marca: "TaylorMade", descripcion: "Driver de ultima generacion" },
    { nombre: "Hierro 7 Callaway Paradym", categoria: "Hierro", precio: 249.99, stock: 15, marca: "Callaway", descripcion: "Hierro de alta precision" },
    { nombre: "Putter Scotty Cameron", categoria: "Putter", precio: 429.99, stock: 8, marca: "Titleist", descripcion: "Putter profesional" }
];

async function inicializarProductos() {
    try {
        const count = await Producto.countDocuments();
        if (count === 0) {
            await Producto.insertMany(productosIniciales);
            console.log('Productos iniciales cargados en MongoDB');
        } else {
            console.log(`Ya existen ${count} productos en la base de datos`);
        }
    } catch (error) {
        console.error('Error al inicializar productos:', error);
    }
}

// ========== ENDPOINTS CRUD ==========

// GET - Obtener todos
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Producto.find({}).sort({ createdAt: -1 });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Obtener uno
app.get('/api/productos/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Crear
app.post('/api/productos', async (req, res) => {
    try {
        const { nombre, categoria, precio, stock, marca, descripcion } = req.body;
        
        if (!nombre || !precio) {
            return res.status(400).json({ error: 'Nombre y precio son requeridos' });
        }
        
        const nuevoProducto = new Producto({
            nombre,
            categoria: categoria || 'General',
            precio: parseFloat(precio),
            stock: stock !== undefined ? parseInt(stock) : 0,
            marca: marca || '',
            descripcion: descripcion || ''
        });
        
        const productoSave = await nuevoProducto.save();
        res.status(201).json(productoSave);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT - Actualizar
app.put('/api/productos/:id', async (req, res) => {
    try {
        const { nombre, categoria, precio, stock, marca, descripcion } = req.body;
        
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        if (nombre !== undefined) producto.nombre = nombre;
        if (categoria !== undefined) producto.categoria = categoria;
        if (precio !== undefined) {
            if (precio < 0) {
                return res.status(400).json({ error: 'El precio no puede ser negativo' });
            }
            producto.precio = precio;
        }
        if (stock !== undefined) {
            if (stock < 0) {
                return res.status(400).json({ error: 'El stock no puede ser negativo' });
            }
            producto.stock = stock;
        }
        if (marca !== undefined) producto.marca = marca;
        if (descripcion !== undefined) producto.descripcion = descripcion;
        
        const productoActualizado = await producto.save();
        res.json(productoActualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE - Eliminar
app.delete('/api/productos/:id', async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado', producto: producto });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========== INICIAR SERVIDOR ==========
async function iniciarServidor() {
    await inicializarProductos();
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}

iniciarServidor();
