function ClienteWS(){
    this.socket
    this.conectar = function(){
        this.socket = io.connect()
    }
}