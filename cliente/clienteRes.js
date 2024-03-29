function ClienteRest() {
  // this.agregarUsuario = function (nick) {
  //   var cli = this;
  //   $.getJSON("/agregarUsuario/" + nick, function (data) {
  //     let msg = "El nick " + nick + " está ocupado";
  //     if (data.nick != -1) {
  //       console.log("Usuario " + nick + " ha sido registrado");
  //       msg = "Bienvenido al sistema, " + nick;
  //       $.cookie(clave, valor);
  //       // localStorage.setItem("nick",nick);
  //     } else {
  //       console.log("El nick ya está ocupado");
  //     }
  //     cw.mostrarMensaje(msg);
  //   });
  // };
  // this.agregarUsuario2 = function (nick) {
  //   $.ajax({
  //     type: "GET",
  //     url: "/agregarUsuario/" + nick,
  //     success: function (data) {
  //       if (data.nick != -1) {
  //         console.log("Usuario " + nick + " ha sido registrado");
  //       } else {
  //         console.log("El nick ya está ocupado");
  //       }
  //     },
  //     error: function (xhr, textStatus, errorThrown) {
  //       console.log("Status: " + textStatus);
  //       console.log("Error: " + errorThrown);
  //     },
  //     contentType: "application/json",
  //   });
  // };
  this.obtenerUsuarios = function () {
    $.getJSON("/obtenerUsuarios", function (data) {
      console.log(data);
    });
  };
  this.numeroUsuarios = function () {
    $.getJSON("/numeroUsuarios", function (data) {
      console.log("Número de usuarios en el sistema es: " + data.num);
    });
  };
  this.usuarioActivo = function (email) {
    $.getJSON("/usuarioActivo/" + email, function (data) {
      if (data.activo) {
        console.log("El usuario " + email + " está activo");
      } else {
        console.log("El usuario " + email + " NO está activo");
      }
    });
  };
  this.eliminarUsuario = function (email) {
    $.getJSON("/eliminarUsuario/" + email, function (data) {
      if (data.email != -1) {
        console.log("El usuario " + email + " ha sido eliminado");
      } else {
        console.log("El usuario " + email + " no se ha podido eliminar");
      }
    });
  };
  this.enviarJwt = function (jwt) {
    $.ajax({
      type: "POST",
      url: "/enviarJwt",
      data: JSON.stringify({ jwt: jwt }),
      success: function (data) {
        let msg = "El email " + data.email + " está ocupado";
        if (data.email != -1) {
          console.log("Usuario " + data.email + " ha sido registrado");
          msg = "Bienvenido al sistema, " + data.email;
          $.cookie("email", data.email);
        } else {
          console.log("El email ya está ocupado");
        }
        cw.limpiar();
        cw.mostrarMsg(msg);
      },
      error: function (xhr, textStatus, errorThrown) {
        //console.log(JSON.parse(xhr.responseText));
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
      },
      contentType: "application/json",
      //dataType:'json'
    });
  };
  this.registrarUsuario = function (email, password) {
    $.ajax({
      type: "POST",
      url: "/registrarUsuario",
      data: JSON.stringify({ email: email, password: password }),
      success: function (data) {
        if (data.email != -1) {
          console.log("Usuario " + data.email + " ha sido registrado");
          //$.cookie("nick",data.nick);
          cw.limpiar();
          Swal.fire({
            icon: "info",
            title: "Revise su correo " + email + " para confirmar la cuenta",
            showConfirmButton: false,
            timer: 3000,
          });
          cw.mostrarLogin();
        } else {
          console.log("El email está ocupado");
          Swal.fire({
            icon: "info",
            title: "El email, " + email + " , está ocupado",
            showConfirmButton: false,
            timer: 3000,
          });
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
      },
      contentType: "application/json",
    });
  };
  this.cerrarSesion = function () {
    $.getJSON("/cerrarSesion", function () {
      console.log("Sesión cerrada");
      $.removeCookie("email");
    });
  };

  this.comprobarUsuario = function (email) {
    $.getJSON("/comprobarUsuario/"+email, function (datos) {
      // console.log("Sesión cerrada");
      // $.removeCookie("email");
      if(datos.email==-1){
        $.removeCookie("email");
        cw.limpiar()
        cw.mostrarLogin()
      }else{
        ws.email=email
        cw.mostrarMsg("Bienvenido al sistema, " + email);
        cw.mostrarJuego()
      }
    });
  };

  this.loginUsuario = function (email, password) {
    $.ajax({
      type: "POST",
      url: "/loginUsuario",
      data: JSON.stringify({ email: email, password: password }),
      success: function (data) {
        if (data.email != -1) {
          console.log("Usuario " + data.email + " ha sido registrado");
          $.cookie("email", data.email);
          ws.email=data.email 
          cw.limpiar();
          cw.mostrarMsg("Bienvenido al sistema, " + data.email);
          cw.mostrarJuego()
          //cw.mostrarLogin();
        }else {
          Swal.fire({
            icon: "error",
            title: "Contraseña/usuario incorrecto. Recuerda haber confirmado la cuenta",
            showConfirmButton: false,
            timer: 3000,
          });

          console.log("No se pudo iniciar sesión");
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
      },
      contentType: "application/json",
    });
    this.datosErroneos = function () {
      Swal.fire({
        icon: "error",
        title: "Contraseña/usuario incorrecto",
        showConfirmButton: false,
        timer: 3000,
      });
    };
  };
}
