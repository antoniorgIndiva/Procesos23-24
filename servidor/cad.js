var mongo = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;

function CAD() {
  this.usuarios;
  this.logs;
  this.insertarLog = function (log, callback) {
    insertar(this.logs, log, callback);
  };

  function buscarTodos(coleccion, callback) {
    coleccion.find().toArray(function (error, usr) {
      callback(usr);
    });
  }
  this.buscarOCrearUsuario = function (usr, callback) {
    //buscarOCrear(this.usuarios,{email:email},callback);
    buscarOCrear(this.usuarios, usr, callback);
  };

  function buscarOCrear(coleccion, criterio, callback) {
    coleccion.findOneAndUpdate(
      criterio,
      { $set: criterio },
      { upsert: true, returnDocument: "after", projection: { email: 1 } },
      function (err, doc) {
        if (err) {
          throw err;
        } else {
          console.log("Elemento actualizado");
          console.log(doc.value.email);
          callback({ email: doc.value.email });
        }
      }
    );
  }

  this.buscarUsuario = function (obj, callback) {
    buscar(this.usuarios, obj, callback);
  };
  this.insertarUsuario = function (usuario, callback) {
    insertar(this.usuarios, usuario, callback);
  };
  function buscarTodos(coleccion, callback) {
    coleccion.find().toArray(function (error, lista) {
      callback(lista);
    });
  }

  this.bucarTodosUsuarios = function (callback) {
    buscarTodos(this.usuarios, callback);
  };
  this.buscarLogs = function (callback) {
    buscarTodos(this.logs, callback);
  };

  function insertar(coleccion, elemento, callback) {
    coleccion.insertOne(elemento, function (err, result) {
      if (err) {
        console.log("error");
      } else {
        console.log("Nuevo elemento creado");
        callback(elemento);
      }
    });
  }
  function buscar(coleccion, criterio, callback) {
    let col = coleccion;
    coleccion.find(criterio).toArray(function (error, usuarios) {
      if (usuarios.length == 0) {
        callback(undefined);
      } else {
        callback(usuarios[0]);
      }
    });
  }
  this.actualizarUsuario = function (obj, callback) {
    actualizar(this.usuarios, obj, callback);
  };

  function actualizar(coleccion, obj, callback) {
    coleccion.findOneAndUpdate(
      { _id: ObjectId(obj._id) },
      { $set: obj },
      { upsert: false, returnDocument: "after", projection: { email: 1 } },
      function (err, doc) {
        if (err) {
          throw err;
        } else {
          console.log("Elemento actualizado");
          //console.log(doc);
          //console.log(doc);
          callback({ email: doc.value.email });
        }
      }
    );
  }

  this.conectar = async function (callback) {
    let cad = this;
    try {
      let client = new mongo(
        "mongodb+srv://antoniorg:uGW4SpvQDhCIyCvz@cluster0.m0kff5n.mongodb.net/?retryWrites=true&w=majority"
      );
      await client.connect();
      const database = client.db("sistema");
      cad.usuarios = database.collection("usuarios");
      cad.logs = database.collection("logs");
      callback(database);
    } catch (err) {
      console.error("Error al conectar a MongoDB:", err);
    }
  };
  this.eliminarUsuario = function (criterio, callback) {
    eliminar(this.usuarios, criterio, callback);
  };

  function eliminar(coleccion, criterio, callback) {
    coleccion.deleteOne(criterio, function (err, result) {
      if (err) throw err;
      callback(result);
    });
  }
}

module.exports.CAD = CAD;
