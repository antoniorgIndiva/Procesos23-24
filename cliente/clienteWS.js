function ClienteWS() {
  this.socket;
  this.email;
  this.codigo;
  this.tipoPartida
  this.partidas = [];
  this.lanzarServidorWS = function () {
    let cli = this;
    this.socket.on("connect", function () {
      console.log("Usuario conectado al servidor de WebSockets");
    });
    this.socket.on("partidaCreada", function (datos) {
      console.log(datos.codigo);
      ws.codigo = datos.codigo;
      $("#miHojaDeEstilos").prop('disabled', false);
      //Mostrar esperando a rival
      cw.limpiar();
      $("#contenidoJuego").load("/cliente/blackjack.html", function () {
        $("#modalCrearPartidaIndividual").show();
        $("#btnAbandonar").on("click", function () {
          ws.abandonarPartida();
          cw.limpiar()
          cw.mostrarJuego()
        });
      });
    });
    this.socket.on("listaPartidas", function (lista) {
      console.log(lista);
      cli.partidas = lista;
      cli.renderizarTablaPartidas();
      //cw Mostrar lista partidas
    });
    this.socket.on("unidoPartida", function (datos) {
      console.log(datos.codigo);
      ws.codigo = datos.codigo;
      cw.limpiar()
      $("#contenidoJuego").load("/cliente/blackjack.html", function () {
        $("#modalCrearPartidaIndividual").show();
        $("#btnAbandonar").on("click", function () {
          ws.abandonarPartida();
          cw.limpiar()
          cw.mostrarJuego()
        });
      });
    });
    this.socket.on("partidaAbandonada", function () {
      ws.codigo = undefined; // el pone cli
      //enviarle a home
    });
  };
  this.crearPartida = function () {
    this.socket.emit("crearPartida", { email: this.email , tipoPartida:this.tipoPartida});
  };
  this.unirPartida = function (codigo) {
    this.socket.emit("unirPartida", { email: this.email, codigo: codigo });
  };
  this.listaPartidas = function () {
    this.socket.emit("listaPartidas", { email: this.email });
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
