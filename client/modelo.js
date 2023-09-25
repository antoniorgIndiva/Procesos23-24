function Sistema(){
    this.usuarios=[];
    this.agregarUsuario=function(nick){
        if (!this.usuarios[nick]) {
            console.log("Nuevo usuario con nick: ", nick)
            this.usuarios[nick]=new Usuario(nick);
        } else {
            console.log("El nick esta en uso")
        }
    }
    this.obtenerUsuarios=function(){
        return this.usuarios;
    }
    this.usuarioActivo = function(nick) {
        if (this.usuarios[nick]) {
            return true; // El usuario está activo
        } else {
            return false; // El usuario no está activo
        }
    }
    this.eliminarUsuario = function(nick) {
        if (this.usuarios && this.usuarios[nick]) {
            // Eliminar el usuario de la lista
            delete this.usuarios[nick];
            console.log("Usuario eliminado:", nick);
            return true; // Usuario eliminado exitosamente
        } else {
            console.log("El usuario no existe:", nick);
            return false; // El usuario no existe en la lista
        }
    }
    
   }
   function Usuario(nick){
    this.nick=nick;
   }