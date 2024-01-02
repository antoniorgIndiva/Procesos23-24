function ClienteWS() {
  this.socket;
  this.email;
  this.codigo
  this.lanzarServidorWS = function () {
    let cli = this
    this.socket.on("connect", function () {
      console.log("Usuario conectado al servidor de WebSockets");
    });
    this.socket.on("partidaCreada",function(datos){
      console.log(datos.codigo)
      ws.codigo=datos.codigo
      //Mostrar esperando a rival
    })
    this.socket.on("listaPartidas",function(lista){
      console.log(lista)
      //cw Mostrar lista partidas
    })
    this.socket.on("unidoPartida",function(datos){
      console.log(datos.codigo)
      ws.codigo=datos.codigo
    })
    this.socket.on("partidaAbandonada",function(){
      ws.codigo=undefined // el pone cli
      //enviarle a home
    })
  };
  this.crearPartida = function(){
    this.socket.emit("crearPartida",{"email":this.email})
  }
  this.unirPartida = function(codigo){
    this.socket.emit("unirPartida",{"email":this.email,"codigo":codigo})
  }
  this.abandonarPartida = function(){
    this.socket.emit("abandonarPartida",{"email":this.email,"codigo":this.codigo})
  }
  this.conectar = function () {
    this.socket = io.connect();
    this.lanzarServidorWS();
  };
  this.conectar()
}
