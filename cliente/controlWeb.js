function ControlWeb(){
    this.mostrarAgregarUsuario = function(){
        $('#bnv').remove();
        $('#mAU').remove();
        let cadena=`<div id="mAU">
        <div class="card"><div class="card-body">
        <div class="form-group">
        <label for="nick">Nick:</label>
        <p><input type="text" class="form-control" id="nick" placeholder="introduce un nick"></p>
        <button id="btnAU" type="submit" class="btn btn-primary">Submit</button>
        <div><a href="/auth/google"><img class="mt-2" src="./cliente/img/btn_google_signin_light_focus_web@2x.png" style="height:40px;"></a></div>
        </div>';
        </div></div></div>`; 
        $("#au").append(cadena);

        $("#btnAU").on("click", function(){
            let nick = $("#nick").val()
            if(nick){
                $('#mAU').remove();
                rest.agregarUsuario(nick)
            }
            //recoger valor input text
            //llamar al servidor usando rest
            
        })

    }
    this.mostrarMsg=function(msg){
        $('mMsg').remove()
        let cadena = '<h6 id="mMsg">'+msg+'</h6>'
        $('#msg').append(cadena)
    }
    this.comprobarSesion=function(){
        //let nick=localStorage.getItem("nick");
        let nick=$.cookie("nick");
        if (nick){
        cw.mostrarMsg("Bienvenido al sistema, "+nick);
        }
        else{
        // cw.mostrarAgregarUsuario();
        //cw.mostrarRegistro();
        cw.init();
        }
    }
    this.salir=function(){
        localStorage.removeItem("nick");
        $.removeCookie("nick")
        location.reload();
    }

    this.init=function(){
        let cw=this;
        google.accounts.id.initialize({
        client_id:"259650379862-gkh4hvjdp1ku5v4grv1u77name2k9hlv.apps.googleusercontent.com", //prod
        auto_select:false,
        callback:cw.handleCredentialsResponse
        });
        google.accounts.id.prompt();
        }
        this.handleCredentialsResponse=function(response){
            let jwt=response.credential;
            //let user=JSON.parse(atob(jwt.split(".")[1]));
            //console.log(user.name);
            //console.log(user.email);
            //console.log(user.picture);
            rest.enviarJwt(jwt);
        }
    this.limpiar=function(){
        $("#mAU").remove();
    }
    this.mostrarRegistro = function () {
        $("#fmRegistro").remove();
        $("#fmLogin").remove();
        $("#registro").load("./cliente/registro.html",function () {
            $("#btnRegistro").on("click", function(){
                let email = $("#email").val()
                let pwd = $("#pwd").val()
                if(email && pwd){
                    rest.registrarUsuario(email,pwd)
                    console.log(email+ " " +pwd )
                }
                //recoger valor input text
                //llamar al servidor usando rest
                
            })
        })

    }
    this.mostrarLogin = function () {
        if($.cookie('nick')) return true
        $("#fmLogin").remove();
        $("#fmRegistro").remove();
        $("#login").load("./cliente/login.html",function () {
            $("#btnLogin").on("click", function(){
                let email = $("#email").val()
                let pwd = $("#pwd").val()
                if(email && pwd){
                    rest.loginUsuario(email,pwd)
                    console.log(email+ " " +pwd )
                }
          
                
            })
        })

    }
    
       

}