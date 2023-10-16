function Sistema(){
    this.usuarios={}; //this.usuarios=[]
    this.agregarUsuario=function(nick){
        let res={"nick":-1}; 
        if (!this.usuarios[nick]){ 
            this.usuarios[nick]=new Usuario(nick);
            res.nick=nick; 
        } 
        else{ 
            console.log("el nick "+nick+" está en uso"); 
        } return res;
    }
    this.obtenerUsuarios=function(){
        return this.usuarios;
    }
    this.obtenerTodosNick=function(){
        return Object.keys(this.usuarios);
    }
    this.usuarioActivo=function(nick){
        //return !(this.usuarios[nick]==undefined)
        let res={activo:false};
        res.activo=(nick in this.usuarios);
        return res;
    }
    this.eliminarUsuario=function(nick){
        let res={nick:-1};
        if (this.usuarios[nick]){
            delete this.usuarios[nick];
            res.nick=nick;
            console.log("Usuario "+nick+" eliminado");
        }
        else{
            console.log("El usuario no existe");
        }
        return res;
    }
    this.numeroUsuarios=function(){
        let lista=Object.keys(this.usuarios);
        let res={num:lista.length};
        return res;
    }
}

function Usuario(nick,clave){
    this.nick=nick;
    this.clave=clave
}

module.exports.Sistema=Sistema;