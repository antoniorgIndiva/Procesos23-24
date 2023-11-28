function ServidorWS() {
  this.enviarAlRemitente = function (socket, mensaje, datos) {
    socket.emit(mensaje, datos);
  };
  this.enviarGlobal = function (io, mens, datos) {
    io.emit(mens, datos);
  };

  this.enviarATodosMenosRemitente = function (socket, mens, datos) {
    socket.broadcast.emit(mens, datos);
  };
  this.lanzarServidor = function (io, sistema) {
    let srv = this;
    io.on("connection", function (socket) {
      console.log("Capa WS activa");
      socket.on("crearPartida", function (datos) {
        let codigo = sistema.crearPartida(datos.email);
        if (codigo != -1) {
          socket.join(codigo);
        }
        srv.enviarAlRemitente(socket, "partidaCreada", { codigo: codigo });
        let lista = sistema.obtenerPartidasDisponibles();
        srv.enviarATodosMenosRemitente(socket, "listaPartidas", lista);
      });
      socket.on("unirPartida",function(datos){
        let codigo = sistema.unirAPartida(datos.email,datos.codigo)
        if (codigo != -1) {
          socket.join(codigo);
        }
        srv.enviarAlRemitente(socket, "unidoPartida", { codigo: codigo });
        let lista = sistema.obtenerPartidasDisponibles();
        srv.enviarATodosMenosRemitente(socket, "listaPartidas", lista);
      })
    });
  };
}
module.exports.ServidorWS = ServidorWS;
