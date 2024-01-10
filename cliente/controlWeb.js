function ControlWeb() {

  this.mostrarMsg = function (msg) {
    $("mMsg").remove();
    let cadena = '<h6 id="mMsg">' + msg + "</h6>";
    $("#msg").append(cadena);
  };
  this.comprobarSesion = function () {
    //let nick=localStorage.getItem("nick");
    let email = $.cookie("email");
    if (email) {
      //cw.mostrarMsg("Bienvenido al sistema, " + email);
      rest.comprobarUsuario(email)
    } else {
      // cw.mostrarAgregarUsuario();
      //cw.mostrarRegistro();
      cw.mostrarLogin()
      //cw.init();
    }
  };
  this.salir=function(){
    //localStorage.removeItem("nick");
    $.removeCookie("email");
    location.reload();
    rest.cerrarSesion();
    }

  this.init = function () {
    let cw = this;
    google.accounts.id.initialize({
      client_id:
        "259650379862-gkh4hvjdp1ku5v4grv1u77name2k9hlv.apps.googleusercontent.com", //prod
      auto_select: false,
      callback: cw.handleCredentialsResponse,
    });
    google.accounts.id.prompt();
  };
  this.handleCredentialsResponse = function (response) {
    let jwt = response.credential;
    //let user=JSON.parse(atob(jwt.split(".")[1]));
    //console.log(user.name);
    //console.log(user.email);
    //console.log(user.picture);
    rest.enviarJwt(jwt);
  };
  this.limpiar = function () {
    $("#mAU").remove();
    $("#fmLogin").remove();
    $("#fmRegistro").remove();
    $("#partidasDisponibles").remove();


  };
  this.mostrarRegistro = function () {
    $("#fmRegistro").remove();
    $("#fmLogin").remove();
    $("#registro").load("./cliente/registro.html", function () {
      $("#btnRegistro").on("click", function () {
        let email = $("#email").val();
        let pwd = $("#pwd").val();
        if (email && pwd) {
          rest.registrarUsuario(email, pwd);
          console.log(email + " " + pwd);
        }
        
      });
    });
  };
  this.mostrarLogin = function () {
    if ($.cookie("email")) return true;
    this.limpiar()
    $("#registro").load("./cliente/login.html", function () {
      $("#btnLogin").on("click", function (event) 
      {
        event.preventDefault();
        let email = $("#email").val();
        let pwd = $("#pwd").val();
        if (email && pwd) {
          rest.loginUsuario(email, pwd);
        } else {
          rest.datosErroneos();
        }
      });
    });
  };
  this.mostrarJuego = function () {
    this.limpiar()
    $("#juego").load("./cliente/juego.html", function () {
      $("#btnCrearPartida").on("click", function () 
      {
        ws.crearPartida()
      });
      $("#btnEliminarPartida").on("click", function () 
      {
        ws.abandonarPartida()
      });
    });

  }
}
