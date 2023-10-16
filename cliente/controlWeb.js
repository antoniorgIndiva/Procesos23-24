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
            cw.mostrarAgregarUsuario();
        }
    }
    this.salir=function(){
        localStorage.removeItem("nick");
        $.removeCookie("nick")
        location.reload();
    }
       

}