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
      rest.comprobarUsuario(email);
    } else {
      // cw.mostrarAgregarUsuario();
      //cw.mostrarRegistro();
      cw.mostrarLogin();
      //cw.init();
    }
  };
  this.salir = function () {
    //localStorage.removeItem("nick");
    $.removeCookie("email");
    location.reload();
    rest.cerrarSesion();
  };

  this.init = function () {
    let cw = this;
    google.accounts.id.initialize({
      //"259650379862-kc0j05v4s83djch10c8a382n5qa85761.apps.googleusercontent.com",
      client_id:
        "259650379862-ucl3mbm85f5tmou8v2lqd0idpp8ntocp.apps.googleusercontent.com", //prod
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
    $("#blackjack").remove();
    $("#tablaLogins").remove();
    $("#miHojaDeEstilos").prop("disabled", true);
  };
  this.mostrarRegistro = function () {
    if ($.cookie("email")) return true;
    this.limpiar();
    $("#registro").load("./cliente/registro.html", function () {
      $("#btnRegistro").on("click", function () {
        let email = $("#email").val();
        let pwd = $("#pwd").val();
        if (email && pwd) {
          rest.registrarUsuario(email, pwd);
        }
      });
    });
  };
  this.mostrarLogin = function () {
    if ($.cookie("email")) return true;
    this.limpiar();
    $("#registro").load("./cliente/login.html", function () {
      $("#btnLogin").on("click", function (event) {
        event.preventDefault();
        let email = $("#email").val();
        let pwd = $("#pwd").val();
        if (email && pwd) {
          rest.loginUsuario(email, pwd);
          verificarUsuarioYMostrarElemento(email);
        } else {
          rest.datosErroneos();
        }
      });
    });
  };

  function verificarUsuarioYMostrarElemento(emailUsuario) {
    const emailEspecifico = "antonio.romero13@alu.uclm.es";
    if (emailUsuario === emailEspecifico) {
      document.getElementById("controlLogsMenu").style.display = "block";
    }
  }

  this.mostrarJuego = function () {
    this.limpiar();
    $("#juego").load("./cliente/juego.html", function () {
      $("#btnCrearPartida").on("click", function () {
        ws.crearPartida();
      });
      $("#btnCrearPartidaIndividual").click(function () {
        crearPartida("individual");
      });
      $("#btnEliminarPartida").on("click", function () {
        ws.abandonarPartida();
      });
    });
  };
  function crearPartida(tipoPartida) {
    if (tipoPartida === "individual") {
      ws.tipoPartida="individual"
      ws.crearPartida()
    } else {
      ws.tipoPartida="multijugador"
      ws.crearPartida()
    }
  }
  this.mostrarLogs = function () {
    this.limpiar();
    if (!$.cookie("email")) return true;

    $("#logs").load("./cliente/controlLog.html", function () {
      $.ajax({
        url: "/obtenerLogs",
        type: "GET",
        success: function (listaLogs) {
          llenarTablaConLogs(listaLogs);
        },
        error: function (error) {
          console.error("Error al obtener los logs: ", error);
        },
      });
    });
  };

  function llenarTablaConLogs(datos) {
    datos.sort(function (a, b) {
      return new Date(b.fecha) - new Date(a.fecha);
    });

    var tabla = $("#tablaLogins tbody");
    tabla.empty();

    datos.forEach(function (log) {
      var fila = $("<tr></tr>");
      fila.append("<td>" + log.tipo + "</td>");
      fila.append("<td>" + log.usr + "</td>");
      fila.append("<td>" + new Date(log.fecha).toLocaleString() + "</td>");
      tabla.append(fila);
    });
  }
}
