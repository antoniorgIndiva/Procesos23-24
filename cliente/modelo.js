function Sistema(test) {
  this.usuarios = {}; //this.usuarios=[]
  this.partidas = [];
  //this.cad = new datos.CAD();
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

  this.crearPartida = function (email) {
    // Si existe el usuario con el email proporcionado en usuarios activos, entonces:
    if (sistema.usuarios.hasOwnProperty(email)) {
      // Obtener un código único
      const codigoPartida = this.obtenerCodigo();
      // Crear la partida con ese código
      const nuevaPartida = {
        codigo: codigoPartida,
        jugadores: [sistema.usuarios[email]], // El usuario es el primer jugador de la partida
        maxJug:2
        
      };

      // Incluir la nueva partida en la colección
      sistema.partidas.push(nuevaPartida);

      // Asignar al usuario como jugador de la partida
      // Puedes guardar el código de la partida en el objeto del usuario
      sistema.usuarios[email].partidaActual = codigoPartida;

      // También puedes realizar otras acciones según tus necesidades

      console.log(`Partida creada con código: ${codigoPartida}`);
    } else {
      console.log("Usuario no encontrado en sistema.usuarios");
    }
  };

  this.unirAPartida = function (email, codigo) {
    // Obtener el usuario cuyo email es “email”
    const usuario = sistema.usuarios.hasOwnProperty(email)
      ? sistema.usuarios[email]
      : null;

    // Obtener la partida cuyo código es “codigo”
    const partida = sistema.partidas.find((p) => p.codigo === codigo);
    // Si existen el usuario y la partida, y aún hay espacio para más jugadores, entonces
    if (usuario && partida && partida.jugadores.length < partida.maxJug) {
      // Asignar al usuario a la partida
      partida.jugadores.push(usuario);

      // Asignar al usuario como jugador de la partida
      usuario.partidaActual = codigo;

      console.log(`Usuario ${email} unido a la partida ${codigo}`);
    } else if (partida && partida.jugadores.length >= partida.maxJug) {
      console.log(`La partida ${codigo} está llena. No se puede unir.`);
    } else {
      console.log("Usuario o partida no encontrados");
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
}
