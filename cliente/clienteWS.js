function ClienteWS() {
  this.socket;
  this.conectar = function () {
    this.socket = io.connect();
    this.lanzarServidorWS();
  };
  this.lanzarServidorWS = function () {
    let cli = this
    this.socket.on("connect", function () {
      console.log("Usuario conectado al servidor de WebSockets");
    });
  };
}
