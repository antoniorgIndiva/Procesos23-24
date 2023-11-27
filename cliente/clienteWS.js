function ClienteWS() {
  this.socket;
  
  this.lanzarServidorWS = function () {
    let cli = this
    this.socket.on("connect", function () {
      console.log("Usuario conectado al servidor de WebSockets");
    });
  };
  this.conectar = function () {
    this.socket = io.connect();
    this.lanzarServidorWS();
  };
  this.conectar()
}
