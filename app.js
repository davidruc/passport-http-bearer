import { log } from 'console';
import express from 'express';
import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';

const app = express();
const port = 3000;


// Ejemplo de collection 
const users = [
    { id: 1, username: 'usuario1', token: 'miTokenSecreto', roles: ['usuario'] },
    { id: 2, username: 'admin1', token: 'otroTokenSecreto', roles: ['admin', 'usuario'] }
];
  

app.use(passport.initialize());

// Validacion de permo¿isos y token 
passport.use(new BearerStrategy(
    (token, done) => {
      const user = users.find(u => u.token === token);
      if (!user) return done(null, false);
      
      // Verificar roles
      const roles = user.roles || [];
      user.roles = roles;
  
      return done(null, user);
    }
  ));

app.get('/admin', passport.authenticate('bearer', { session: false }), (req, res) => {
  if (req.user.roles.includes('admin')) {
    res.send('Bienvenido al área de administración.');
  } else {
    res.status(403).send('No tienes permiso para acceder a esta área.');
  }
});



app.listen(port, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});