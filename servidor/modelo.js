const datos = require("./cad.js")
const correo = require("./email.js")
function Sistema(test){
    this.usuarios={}; //this.usuarios=[]
    this.cad= new datos.CAD();
    this.test = test
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
    this.usuarioGoogle=function(usr,callback){
        this.cad.buscarOCrearUsuario(usr,function(res){
            console.log("El usuario "+res.email+" ya estaba registrado");
            callback(res);
        });
    }
    this.registrarUsuario=function(obj,callback){
        let modelo=this;
        if (!obj.nick){
        obj.nick=obj.email;
        }
        this.cad.buscarUsuario(obj,function(usr){
        if (!usr){
            obj.key=Date.now().toString()
            obj.confirmada = false
            modelo.cad.insertarUsuario(obj,function(res){
        callback(res);
        });
        correo.enviarEmail(obj.email,obj.key,"Confirmar cuenta")
        //correo.enviarEmail("antoniorg.129@gmail.com","hola","Confirmar cuenta")
        }
        else
        {
        callback({"email":-1});
        }
        });
    }

    
    this.loginUsuario=function(obj, callback){
        this.cad.buscarUsuario({"email":obj.email, "confirmada":true}, function(usr){
          if (usr && obj.password==usr.password)
          {
            callback(usr)
          }
          else
          {
            callback({"email": -1});
          }
        })
    }
    
    this.confirmarUsuario=function(obj,callback){
        modelo = this
        this.cad.buscarUsuario({"email":obj.email, "confirmada":false,"key":obj.key}, function(usr){
            if(usr){
                usr.confirmada=true
                modelo.cad.actualizarUsuario(usr,function(res){
                    callback({"email":res.email}) // es lo mismo que devolver res
                })
            }else
          {
            callback({"email": -1});
          }
        })
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
    if (!this.test) {
        this.cad.conectar(function(){
            console.log("Conectado a Mongo Atlas")
        })
    }

}

function Usuario(nick,clave){
    this.nick=nick;
    this.clave=clave
}

module.exports.Sistema=Sistema;