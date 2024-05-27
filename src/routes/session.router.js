import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import { UsersManagerMongo } from '../Dao/usersManagerMongo.js';

const router = new Router();

const userService = new UsersManagerMongo()

router.get('/current', auth, (req, res) => {
    res.send('datos sensibles que solo puede ver el admin')
})

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, age, email, password } = req.body;
        if (!email || !password) return res.status(401).send({ status: 'error', error: 'Se deben completar todos los datos' })
        const userExists = await userService.getUserBy({ email })
        console.log(userExists);
        if (userExists) return res.status(401).send({ status: 'error', error: 'El usuario ya existe' })
        const newUser = {
            first_name,
            last_name,
            age,
            email,
            password,
        };
        const result = await userService.createUser(newUser);
        console.log(result);

        res.redirect('/login')
    } catch (err) {
        console.log(err);
    }
})

router.post('/login', async (req, res) => {
    try {
    const { email, password } = req.body
    if (!email || !password) return res.status(401).send({ status: 'error', error: 'Se deben completar todos los datos' })
    if (email === "adminCoder@coder.com" && password === "adminCod3er123") {
        req.session.user = {
            first_name: email,
            admin: 'admin'
        }
        res.redirect('/products')
    } else {
    const userFound = await userService.getUserBy({ email, password })
    if (!userFound) return res.status(401).send({ status: 'error', error: 'Usuario no encontrado o contraseña incorrecta' })
    req.session.user = {
        email,
        first_name: userFound.first_name,
        admin: userFound.role === 'admin'
    }
    res.redirect('/products')}
    } catch (err) {
        console.log(err);
        }
})

router.get('/', (req, res) => {
    if (req.session.counter) {
        req.session.counter++
        res.send(`Se ha visitado el sitio ${req.session.counter} veces`)
    } else {
        req.session.counter = 1,
            res.send('Bienvenido')
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) return res.redirect('/login')
        else return res.send({ status: 'error', error: err })
    })
})

export default router