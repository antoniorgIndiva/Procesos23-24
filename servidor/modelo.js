const datos = require("./cad.js");
const correo = require("./email.js");
const bcrypt = require("bcrypt");
function Sistema(test) {
  this.usuarios = {}; //this.usuarios=[]
  this.partidas = [];
  this.cad = new datos.CAD();
  this.test = test;
  this.agregarUsuario = function (usr) {
    let res = { email: -1 };
    let modelo = this;
    let email = usr.email;
    if (!this.usuarios[email]) {
      this.usuarios[email] = new Usuario(usr);
      res.email = email;
      if (res.nick == undefined) {
        res.nick = email; //por si se inicia con github
      }
      //modelo.cad.insertarLog({"tipo":"local","usr":email,"fecha":new Date()})

    } else {
      console.log("el email " + email + " está en uso");
    }
    return res;
  };
//   this.agregarUsuario = function (usr) {
//     let res = { "email": -1 };


//     if (usr && usr.email) {
//         let email = usr.email;
//         let nick = usr.nick;

//         if (!this.usuarios[email]) {
//             this.usuarios[email] = new Usuario(usr);
//             res.email = email;
//             console.log("Nuevo usuario en el sistema: " + email);
//         } else {
//             console.log("El email " + email + " está en uso");
//         }
//     }

//     return res;
// };
  this.usuarioGoogle = function (usr, callback) {
    let modelo = this;
    this.cad.buscarOCrearUsuario(usr, function (res) {
      callback(res);
      modelo.agregarUsuario(usr);
      modelo.cad.insertarLog({"tipo":"google","usr":res.email,"fecha":new Date()},function(){})
    });
  };
  this.usuarioGithub = function (usr, callback) {
    let modelo = this;
    this.cad.buscarOCrearUsuario(usr, function (res) {
      callback(res);
      modelo.agregarUsuario(usr);
      modelo.cad.insertarLog({"tipo":"github","usr":res.email,"fecha":new Date()},function(){})

    });
  };
  this.registrarUsuario = function (obj, callback) {
    let modelo = this;
    this.cad.buscarUsuario(obj, function (usr) {
      if (!usr) {
        obj.key = Date.now().toString();
        obj.confirmada = false; // false;

        // Hashear la contraseña antes de insertarla en la base de datos
        bcrypt.hash(obj.password, 10, function (err, hash) {
          if (err) {
            console.error("Error al hashear la contraseña:", err);
            callback({ error: "Error al hashear la contraseña" });
          } else {
            obj.password = hash;

            modelo.cad.insertarUsuario(obj, function (res) {
              callback(res);
            });
            if (!modelo.test) {
              correo.enviarEmail(obj.email, obj.key, "Confirmar cuenta");
            }
          }
        });
      } else {
        callback({ email: -1 });
      }
    });
  };

  correo.conectar(function(){
    console.log("Variables secretas obtenidas");
})

  this.loginUsuario = function (obj, callback) {
    let modelo = this;
    this.cad.buscarUsuario(
      { email: obj.email, confirmada: true },
      function (usr) {
        if (usr) {
          bcrypt.compare(obj.password, usr.password, function (err, result) {
            if (err) {
              console.error("Error al comparar contraseñas:", err);
              callback({ error: "Error al comparar contraseñas" });
            } else if (result) {
              // Contraseña válida
              callback(usr);
              modelo.agregarUsuario(usr);
            } else {
              // Contraseña incorrecta
              callback({ email: -1 });
            }
          });
        } else {
          callback({ email: -1 });
        }
      }
    );
  };

  this.confirmarUsuario = function (obj, callback) {
    modelo = this;
    this.cad.buscarUsuario(
      { email: obj.email, confirmada: false, key: obj.key },
      function (usr) {
        if (usr) {
          usr.confirmada = true;
          modelo.cad.actualizarUsuario(usr, function (res) {
            callback({ email: res.email }); // es lo mismo que devolver res
          });
        } else {
          callback({ email: -1 });
        }
      }
    );
  };

  this.obtenerUsuarios = function () {
    return this.usuarios;
  };
  this.obtenerUsuariosDB = function (callback) {
    this.cad.bucarTodosUsuarios(function (lista) {
      callback(lista);
    });
  };
  this.obtenerLogs = function (callback) {
    this.cad.buscarLogs(function (lista) {
      callback(lista);
    });
  };
  this.obtenerTodosNick = function () {
    return Object.keys(this.usuarios);
  };
  this.usuarioActivo = function (email) {
    //return !(this.usuarios[nick]==undefined)
    let res = { activo: false };
    res.activo = email in this.usuarios;
    return res;
  };
  this.eliminarUsuario = function (email) {
    let res = { email: -1 };
    if (this.usuarios[email]) {
      delete this.usuarios[email];
      res.email = email;
      console.log("Usuario " + email + " eliminado");
    } else {
      console.log("El usuario no existe");
    }
    return res;
  };
  this.numeroUsuarios = function () {
    let lista = Object.keys(this.usuarios);
    let res = lista.length;
    return res;
  };

  this.crearPartida = function (email) {
    if (this.usuarios.hasOwnProperty(email)) {

      const codigoPartida = this.obtenerCodigo();
      const nuevaPartida = new Partida(codigoPartida);

      nuevaPartida.jugadores.push(this.usuarios[email]);
      nuevaPartida.sistema=this

      this.partidas.push(nuevaPartida);

      this.usuarios[email].partidaActual = codigoPartida;

      console.log(`Partida creada con código: ${codigoPartida}`);
      return codigoPartida;
    } else {
      console.log("Usuario no encontrado");
      return -1;
    }
  };

  this.eliminarPartida = function (codigo) {
    let res = { codigo: -1 };
    let index = this.partidas.findIndex((partida) => partida.codigo === codigo);
  
    if (index !== -1) {
      // Eliminar la partida del array
      this.partidas.splice(index, 1);
      res.codigo = codigo;
      console.log("Partida " + codigo + " eliminada");
    } else {
      console.log("La partida no existe");
    }
  
    return res;
  };
  

  this.abandonarPartida = function (email, codigo) {
    console.log({email,codigo})
    const usuario = this.usuarios.hasOwnProperty(email)
      ? this.usuarios[email]
      : null;  
    const partida = this.partidas.find((p) => p.codigo === codigo);
  
    if (usuario && partida) {
      if (partida.jugadorNoEsta(email)) {
        console.log(`El usuario ${email} no está en la partida ${codigo}`);
      } else {
        partida.jugadorAbandona(usuario);
        console.log(`Usuario ${email} abandonó la partida ${codigo}`);
      }
    } else {
      console.log("Usuario o partida no encontrados");
    }
  };
  

  this.obtenerPartidasDisponibles = function () {
    //obtener todas o solo las disponibles
    //inicializar un array[]
    const partidasDisponibles = [];
    this.partidas.forEach((partidas) => {
      if (partidas.jugadores.length < partidas.maxJug) {
        partidasDisponibles.push({
          creador: partidas.jugadores[0].email,
          codigo: partidas.codigo,
          jugadores:partidas.jugadores,
          maxJug:partidas.maxJug
        });
      }
    });
    return partidasDisponibles;
    //recorrer el array asociativo
    //crear una lista
  };

  this.unirAPartida = function (email,codigo) {
    const usuario = this.usuarios.hasOwnProperty(email)
      ? this.usuarios[email]
      : null;

    const partida = this.partidas.find((p) => p.codigo === codigo);
    console.log(partida)

    if (usuario && usuario.partidaActual === codigo) {
      console.log(
        `El usuario ${email} ya está en la partida ${codigo}. No se puede unir nuevamente.`
      );
      return -1;
    }

    if (partida && partida.jugadores.length < partida.maxJug) {
      partida.jugadores.push(usuario);

      usuario.partidaActual = codigo;
      console.log(`Usuario ${email} unido a la partida ${codigo}`);
      return codigo;
    } else if (partida && partida.jugadores.length >= partida.maxJug) {
      console.log(`La partida ${codigo} está llena. No se puede unir.`);
      return -1;
    } else {
      console.log("Usuario o partida no encontrados");
      return -1;
    }
  };

  this.obtenerCreadorPartida = function (codigo) {
    const partida = this.partidas.find((p) => p.codigo === codigo);

    if (partida) {
      return partida.jugadores.length > 0 ? partida.jugadores[0].nick : null;
    } else {
      console.log(`Partida ${codigo} no encontrada`);
      return null;
    }
  };

  this.obtenerCodigo = function () {
    const longitud = 6;
    const caracteres =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let codigo = "";

    for (let i = 0; i < longitud; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      codigo += caracteres.charAt(indice);
    }

    return codigo;
  };

  if (!this.test) {
    this.cad.conectar(function () {
      console.log("Conectado a Mongo Atlas");
    });
  }
}

function Usuario(usr) {
  this.nick = usr.nick;
  this.email = usr.email;
  //this.clave=clave
}

function Partida(codigo) {
  this.codigo = codigo;
  this.jugadores = [];
  this.maxJug = 2;
  this.sistema

  this.jugadorNoEsta=function(email){
    return (this.jugadores.filter(e=>e.email==email).length==0)
  }

  this.jugadorAbandona=function(usr){
    let index = this.jugadores.indexOf(usr)
    this.jugadores.splice(index,1)
    if (this.jugadores.length==0){
      this.sistema.eliminarPartida(this.codigo)
    }
  }
}

module.exports.Sistema = Sistema;
