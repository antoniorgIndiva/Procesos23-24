function ControlWeb(){
    this.mostrarAgregarUsuario = function(){
        $('#mAU').remove();
       let cadena=` <div id="mAU" class="form-group">
        <label for="nick">Introduce el nick:</label>
        <input type="text" class="form-control" id="nick">
        <button id="btnAU" type="submit" class="btn btn-primary">Submit</button>
        </div>`
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