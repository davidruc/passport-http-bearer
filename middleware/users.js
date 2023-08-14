import passport from 'passport';
import {Strategy as BearerStrategy} from 'passport-http-bearer';
import { conexion } from "../db/atlas.js";

let db = await conexion();
let usuario = db.collection("usuarios");

// Configuración de la estrategia de autenticación con token de portador y roles
passport.use(new BearerStrategy(
    async (token, done) => {
      let data =  await usuario.aggregate([
        {
          $lookup: {
            from: "roles",
            localField: "id_rol",
            foreignField: "id",
            as: "FK_roles"
          }
        },
        {
          $unwind: "$FK_roles"
        }
      ]).toArray(); 
       
      const user = data.find(u => u.token === token);
      if (!user) return done(null, false);
      
      // Verificar roles
      const roles = user.FK_roles.roles;
      user.FK_roles.roles = roles;
      return done(null, user); 
    }
  ));

export const authenticateBearer = passport.authenticate('bearer', {
    session: false
})