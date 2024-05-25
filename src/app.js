import express from 'express';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import sessionRouter from './routes/session.router.js';
import viewsRouter from './routes/view.router.js';
import { __dirname, uploader } from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import ProductManagerMongo from './Dao/productManagerMongo.js';
import connectDB from './config/index.js';
import cookieParser from 'cookie-parser';
import session from 'express-session'
import FileStore from 'session-file-store'


const app = express();
const PORT = process.env.PORT || 8080

const httpServer = app.listen(PORT, err => {
    if (err) console.log(err);
    console.log('Server escuchando en puerto 8080');
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

connectDB()

console.log('Base de datos conectada');

const io = new Server(httpServer);

const productManager = new ProductManagerMongo();

io.on('connection', (socket) => {

    socket.on('addProduct', async (data) => {
        await productManager.addProduct(data);
        const products = await productManager.getProducts(); 
        io.emit('update-products', products);
    });

    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProduct(id);
        const products = await productManager.getProducts();
        io.emit('update-products', products);
    });
});

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');



app.use('/upload-file', uploader.single('myFile'), (req, res) => {
    if (!req.file) {
        return res.send('No se pudo subir el archivo')
    };
    res.status(200).send('Archivo subido con éxito')
});

app.use('/', viewsRouter);

app.use('/api/products', productsRouter);

app.use('/api/cart', cartRouter);

app.use('/api/session', sessionRouter);


let messages = []
io.on('connection', socket => {
    console.log('Cliente conectado');

    socket.on('message', data => {
        messages.push(data)
        io.emit('messageLogs', messages)
    })

});


