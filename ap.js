import express from 'express';
import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';

const app = express();
const port = 3000;

// Datos simulados de usuarios y tokens con roles (solo para este ejemplo)
const users = [
  { id: 1, username: 'usuario1', token: 'miTokenSecreto', roles: ['usuario'] },
  { id: 2, username: 'admin1', token: 'otroTokenSecreto', roles: ['admin', 'usuario'] }
];

// Configuración de la estrategia de autenticación con token de portador y roles
passport.use(new BearerStrategy(
  (token, done) => {
    const user = users.find(u => u.token === token);
    if (!user) return done(null, false);

    // Verificar roles
    const roles = user.roles || [];
    user.roles = roles;

    return done(null, user);
  }
));S

// Middleware de Passport
app.use(passport.initialize());

// Ruta protegida para usuarios con rol 'usuario'
app.get('/usuario', passport.authenticate('bearer', { session: false }), (req, res) => {
  if (req.user.roles.includes('usuario')) {
    res.send(`Hola, ${req.user.username}! Tienes acceso al recurso para usuarios.`);
  } else {
    res.status(403).send('No tienes permiso para acceder a este recurso.');
  }
});

// Ruta protegida para usuarios con rol 'admin'
app.get('/admin', passport.authenticate('bearer', { session: false }), (req, res) => {
  if (req.user.roles.includes('admin')) {
    res.send(`Hola, ${req.user.username}! Tienes acceso al área de administración.`);
  } else {
    res.status(403).send('No tienes permiso para acceder a este área.');
  }
});

app.listen(port, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});
