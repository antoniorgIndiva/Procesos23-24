function ClienteWS() {
  this.socket;
  this.email;
  this.codigo;
  this.tipoPartida;
  this.partidas = [];
  this.todasPartidas=[]
  this.lanzarServidorWS = function () {
    let cli = this;
    this.socket.on("connect", function () {
      console.log("Usuario conectado al servidor de WebSockets");
    });
    this.socket.on("partidaCreada", function (datos) {
      ws.codigo = datos.codigo;
      $("#miHojaDeEstilos").prop("disabled", false);
      cw.limpiar();
      cli.obtenerTodasPartidas()
      $("#contenidoJuego").load("/cliente/blackjack.html", function () {
        cli.actualizarInformacionJugador(datos.codigo);
        $("#modalCrearPartidaIndividual").show();
        $("#btnAbandonar").on("click", function () {
          ws.abandonarPartida();
          cw.limpiar();
          cw.mostrarJuego();
        });
        $("#btnEliminarPartida").on("click", function () {
          ws.abandonarPartida();
          cw.limpiar();
          cw.mostrarJuego();
        });
      });
    });
    this.socket.on("todasPartidas", function (lista) {
      cli.todasPartidas = lista;
      let partidaActual = lista.find(partida => partida.codigo === ws.codigo);
      if (partidaActual) {
        console.log("actual",partidaActual)
        cli.actualizarInformacionJugador(partidaActual.codigo);
    }

    });
    this.socket.on("listaPartidas", function (lista) {
      cli.partidas = lista;
      cli.renderizarTablaPartidas();
      //cw Mostrar lista partidas
    });
    this.socket.on("unidoPartida", function (datos) {
      ws.codigo = datos.codigo;
      cw.limpiar();
      cli.obtenerTodasPartidas()
      
      $("#contenidoJuego").load("/cliente/blackjack.html", function () {
        console.log(datos.codigo)
        cli.actualizarInformacionJugador(datos.codigo)
        document.getElementById('contenedorCargando').style.display = 'none';
        $("#modalCrearPartidaIndividual").show();
        $("#btnAbandonar").on("click", function () {
          ws.abandonarPartida();
          cw.limpiar();
          cw.mostrarJuego();
        });
      });
    });
    this.socket.on("partidaAbandonada", function () {
      ws.codigo = undefined; // el pone cli
      //enviarle a home
    });
    this.socket.on("partidaLista", function(datos) {
      document.getElementById('contenedorCargando').style.display = 'none';
    });
    
  };
  this.crearPartida = function () {
    this.socket.emit("crearPartida", {
      email: this.email,
      tipoPartida: this.tipoPartida,
    });
  };
  this.unirPartida = function (codigo) {
    this.socket.emit("unirPartida", { email: this.email, codigo: codigo });
  };
  this.listaPartidas = function () {
    this.socket.emit("listaPartidas", { email: this.email });
  };
  this.obtenerTodasPartidas = function () {
    this.socket.emit("todasPartidas", { email: this.email });
  };
  this.abandonarPartida = function () {
    this.socket.emit("abandonarPartida", {
      email: this.email,
      codigo: this.codigo,
    });
  };
  this.conectar = function () {
    this.socket = io.connect();
    this.lanzarServidorWS();
  };
  this.conectar();

  this.actualizarInformacionJugador = function (codigo) {
    this.todasPartidas.forEach((partida) => {
        if (partida.codigo == codigo) {
            document.getElementById("nombreJugador1").innerHTML =
                partida.jugadores[0].email || "Jugador 1";
            if (partida.jugadores.length == 2) {
                document.getElementById("nombreJugador2").innerHTML =
                  partida.jugadores[1].email || "Computadora";
            }
        }
    });
    document.getElementById("codigo-partida").innerHTML = 
    "Código de la partida: " + codigo;
};


  this.renderizarTablaPartidas = function () {
    var tbody = document.getElementById("tablaPartidasBody");
    if (tbody) {
      tbody.innerHTML = "";

      if (!this.partidas || this.partidas.length === 0) {
        var noPartidasRow = document.createElement("tr");
        noPartidasRow.innerHTML = `
        <td colspan="3">No hay partidas disponibles.</td>
      `;
        tbody.appendChild(noPartidasRow);
      } else {
        this.partidas.forEach(function (partida) {
          var row = document.createElement("tr");
          if (partida.creador === ws.email) {
            row.classList.add("partida-creada-por-usuario");
          }
          row.innerHTML = `
          <td>${partida.codigo}</td>
          <td>${partida.jugadores.length}/${partida.maxJug}</td>
          <td><button id="btnUnirPartida_${partida.codigo}">Unirse</button></td>
        `;
          tbody.appendChild(row);
        });

        this.partidas.forEach(function (partida) {
          $("#btnUnirPartida_" + partida.codigo).on("click", function () {
            ws.unirPartida(partida.codigo.toString());
          });
        });
      }
    } else {
      return true;
    }
  };
}
