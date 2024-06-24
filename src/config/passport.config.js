import local from 'passport-local'
import GithubStrategy from 'passport-github2'
import { UsersManagerMongo } from '../Dao/usersManagerMongo.js'
import { createHash, isValidPassword } from '../utils/bcrypt.js'
import {Strategy, ExtractJwt} from 'passport-jwt'
import passport from 'passport';
import { PRIVATE_KEY } from '../utils/jsonwebtocken.js'

const JWTStrategy = Strategy;
const JWSExtract = ExtractJwt;

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) token = req.cookies['token']
    return token;
}

export const initializePassport = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    })) 
}

// const userService = new UsersManagerMongo;
// const LocalStrategy = local.Strategy;

// export const initPassport = () => {
//     passport.use('github', new GithubStrategy({
//         clientID:'Iv23liMPasy94rrEUsDf',
//         clientSecret:'01c4f02c5be9631ab356c0c0aa9e0eba6160a5cb',
//         callbackURL:'http://localhost:8080/api/session/githubcallback'
//     }, async (accesToken, refresh, profile, done)=> {
//         try {
//             console.log(profile);
//             let user = await userService.getUserBy({email: profile._json.email})
//             if(!user) {
//                 let newUser = {
//                     first_name: profile._json.name,
//                     last_name: profile._json.name,
//                     email: profile._json.email,
//                     password: ''
//                 }
//                 let result = await userService.createUser(newUser);
//                 done(null,result)
//             } else {
//                 done(null,user)
//             }
//         } catch (error) {
//             console.log(error);
//             return done(error)
//         }
//     }))
//     passport.use('register', new LocalStrategy({
//         passReqToCallback: true,
//         usernameField: 'email'
//     }, async (req, username, password, done) => {
//         const {first_name, last_name} = req.body;
//         try {
//             let userFound = await userService.getUserBy({email: username});
//             if (userFound) {
//                 console.log('El usuario ya existe');
//                 return done(null, false);
//             }
//             const newUser = {
//                 first_name,
//                 last_name,
//                 email: username,
//                 password: createHash(password)
//                 };
//                 const userCreated = await userService.createUser(newUser);
//                 return done(null, userCreated);
//         } catch (error) {
//             console.log(error);
//             return done('Error al registrar el usuario')
//         }
//     }))
//     passport.use('login', new LocalStrategy({
//         usernameField: 'email'

//     }, async (username, password, done) => {
//         try {
//             const userFound = await userService.getUserBy({email: username});
//             if (!userFound) {
//                 console.log('Usuario no encontrado');
//                 return done(null, false);
//                 }
//                 if (!isValidPassword(password, {password: userFound.password})) {
//                     console.log('Contraseña incorrecta');
//                     return done(null, false);
//                     }
//                     return done(null, userFound);

//         } catch(error) {
//             console.log(error);
//             return done(error)
//         }
//     }));
//     passport.serializeUser((user, done) => {
//         done(null, user._id);
//     });
//     passport.deserializeUser(async (id, done) => {
//         try {
//             const userFound = await userService.getUserBy({_id: id});
//             done(null, userFound)
//     } catch(error) {
//         console.log(error);
//         done('Error al obtener el usuario')
//         }
//     });
// }
