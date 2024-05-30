import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import { UsersManagerMongo } from '../Dao/usersManagerMongo.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import passport from 'passport';
import { generateToken } from '../utils/jsonwebtocken.js';


const router = new Router();

const userService = new UsersManagerMongo()

router.get('/github', passport.authenticate('github', { scope: 'user:email' }), (req, res) => {})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect: '/login'}), (req, res) => {
    req.session.user = req.user
    res.redirect('/products')
})

router.get('/current', auth, (req, res) => {
    res.send('datos sensibles que solo puede ver el admin')
})

// router.post('/register', async (req, res) => {
//     try {
//         const { first_name, last_name, age, email, password } = req.body;
//         if (!email || !password) return res.status(401).send({ status: 'error', error: 'Se deben completar todos los datos' })
//         const userExists = await userService.getUserBy({ email })
//         console.log(userExists);
//         if (userExists) return res.status(401).send({ status: 'error', error: 'El usuario ya existe' })
//         const newUser = {
//             first_name,
//             last_name,
//             age,
//             email,
//             password: createHash(password),
//         };
//         const result = await userService.createUser(newUser);
//         console.log(result);
        // const token = generateToken({
        //     id: result._id;
        //     email
        // })

//         res.redirect('/login')
//     } catch (err) {
//         console.log(err);
//     }
// })

// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body
//         if (!email || !password) return res.status(401).send({ status: 'error', error: 'Se deben completar todos los datos' })
//         if (email === "adminCoder@coder.com" && password === "adminCod3er123") {
//             req.session.user = {
//                 first_name: email,
//                 admin: 'admin'
//             }
//             res.redirect('/products')
//         } else {
//             const userFound = await userService.getUserBy({ email })
//             if (!userFound) return res.status(401).send({ status: 'error', error: 'Usuario no encontrado o contraseña incorrecta' })
//         if (!isValidPassword(password, {password: userFound.password})) return res.status(401).send({status: 'error', error: 'Password incorrecta'})
//                 req.session.user = {
//                     email,
//                     first_name: userFound.first_name,
//                     admin: userFound.role === 'admin'
//                 }
//                 const token = generateToken({
//                     id: userFound._id,
//                     email
//                 })
//             res.redirect('/products')
//         }
//     } catch (err) {
//         console.log(err);
//     }
// })


router.post('/register', passport.authenticate('register', { failureRedirect: '/api/session/failregister' }), async (req, res) => {
    res.send({ status: 'success', message: 'Usuario registrado' })
})
router.get('/failregister', async (req, res) => {
    console.log('Fallo el registro');
    res.send({ error: 'failed' })
})
router.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/faillogin' }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: 'error', error: 'Credenciales inválidas' })
    req.session.user = {
        email: req.user.email,
        first_name: req.user.first_name,
        role: req.user.role
    }
    console.log(req.user);
    // res.send({ status: 'succes', payload: req.user })
    res.redirect('/products')

})
router.get('/faillogin', async (req, res) => {
    console.log('Fallo el login');
    res.send({ error: 'Falló el login' })
})




router.get('/restaurar', (req, res) => {
    res.render('restaurar')
})

router.put('/restaurar', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userFound = await userService.getUserBy({ email });
        if (!userFound) return res.status(401).send({ status: 'error', error: 'Usuario no encontrado' });
        const hashedPassword = createHash(password);
        const updateUser = await userService.updateUser({ email }, { password: hashedPassword });
        console.log(updateUser)
        res.send({ status: 'success', message: 'Contraseña actualizada correctamente' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: 'error', error: 'Error al actualizar contraseña' });
    }
});

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