import passport from 'passport';
import { Router } from "express";
import {authenticateBearer} from "../middleware/users.js"

const appUsers = Router();

appUsers.use(passport.initialize());
appUsers.get('/', authenticateBearer ,(req, res) => {
  console.log(req.user.FK_roles.roles);
  if (req.user.FK_roles.roles === "admin"){ 
    res.send(`Bienvenido ${req.user.username} al área de administración.`);
  } else {
    res.status(403).send(`${req.user.username} no tienes permiso para acceder a esta área.`);
  }
});

export default appUsers;