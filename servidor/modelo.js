const datos = require("./cad.js");
const correo = require("./email.js");
const bcrypt = require("bcrypt");
function Sistema(test) {
  this.usuarios = {}; //this.usuarios=[]
  this.cad = new datos.CAD();
  this.test = test;
  this.agregarUsuario = function (usr) {
    let res = { email: -1 };
    let email = usr.email;
    if (!this.usuarios[email]) {
      this.usuarios[email] = new Usuario(usr);
      res.email = email;
    } else {
      console.log("el email " + email + " está en uso");
    }
    return res;
  };
  this.usuarioGoogle = function (usr, callback) {
    let modelo = this;
    this.cad.buscarOCrearUsuario(usr, function (res) {
      callback(res);
      modelo.agregarUsuario(usr);
    });
  };
  this.registrarUsuario = function (obj, callback) {
    let modelo = this;
    this.cad.buscarUsuario(obj, function (usr) {
      if (!usr) {
        obj.key = Date.now().toString();
        obj.confirmada = false;

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
    let res = { num: lista.length };
    return res;
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

module.exports.Sistema = Sistema;
