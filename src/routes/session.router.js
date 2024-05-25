import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import { Long } from 'mongodb';

const router = new Router();

router.get('/current', auth , (req, res) => {
    res.send('datos sensibles que solo puede ver el admin')
})

router.post('/login', (req, res) => {
    const { email, password } = req.body
    if (email != 'f@gmail.com' || password != 'Soycra') return res.send('login failed')
    req.session.user = {
        email,
        admin: true
    }   
    console.log(req.session.user);
    res.send('login success')
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
        if (!err) return res.send('logout')
        else return res.send({ status: 'error', error: err })
    })
})

export default router