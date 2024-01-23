const fs = require("fs");
const express = require("express");
const app = express();
const { Server } = require("socket.io");
const httpServer = require("http").Server(app);
const passport = require("passport");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const args = process.argv.slice(2);
const haIniciado = function (request, response, next) {
  if (request.user) {
    next();
  } else {
    response.redirect("/");
  }
};

const LocalStrategy = require("passport-local").Strategy;

require("./servidor/passport-setup.js");
const modelo = require("./servidor/modelo.js");
const moduloWS = require("./servidor/servidorWS.js");
const PORT = process.env.PORT || 3000;


let test = false;
test = eval(args[0]); //test=true
let sistema = new modelo.Sistema(test);

let ws = new moduloWS.ServidorWS();
let io = new Server();
//io.listen(httpServer);

app.use(express.static(__dirname + "/"));
app.use(
  cookieSession({
    name: "Aplicacion Procesos",
    keys: ["key1", "key2"],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    function (email, password, done) {
      sistema.loginUsuario(
        { email: email, password: password },
        function (user) {
          return done(null, user);
        }
      );
    }
  )
);

app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/fallo" }),

  function (req, res) {
    res.redirect("/good");
  }
);

app.post(
  "/oneTap/callback",
  passport.authenticate("google-one-tap", { failureRedirect: "/fallo" }),

  function (req, res) {
    res.redirect("/good");
  }
);
app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/fallo" }),
  function (req, res) {
    res.redirect("/goodGitHub");
  }
);


app.get("/good", function (request, response) {
  let email = request.user.emails[0].value;
  sistema.usuarioGoogle({ email: email }, function (obj) {
    response.cookie("email", obj.email);
    response.redirect("/");
  });
});
app.get("/goodGitHub", function (request, response) {
  let email = request.user.username;
  sistema.usuarioGithub({ email: email }, function (obj) {
    response.cookie("email", obj.email);
    response.redirect("/");
  });
});

app.get("/fallo", function (request, response) {
  response.send({ email: "-1" });
});
app.post("/registrarUsuario", function (request, response) {
  sistema.registrarUsuario(request.body, function (res) {
    response.send({ email: res.email });
  });
});
app.post(
  "/loginUsuario",
  passport.authenticate("local", {
    failureRedirect: "/fallo",
    successRedirect: "/ok",
  })
);
app.get("/cerrarSesion", haIniciado, function (request, response) {
  let email = request.user.email;
  request.logout();
  response.redirect("/");
  if (email) {
    sistema.eliminarUsuario(email);
  }
});

app.get("/ok", function (request, response) {
  response.send({ email: request.user.email });
});

app.get("/", function (request, response) {
  let contenido = fs.readFileSync(__dirname + "/cliente/index.html");
  response.setHeader("Content-type", "text/html");
  response.send(contenido);
});

// app.get("/agregarUsuario/:nick", function (request, response) {
//   let nick = request.params.nick;
//   let res = sistema.agregarUsuario(nick);
//   response.send(res);
// });
app.get("/obtenerUsuariosDB",haIniciado, function (request, response) {
  sistema.obtenerUsuariosDB(function(lista){
    response.send(lista)
  })
});
app.get("/obtenerLogs", haIniciado, function (request, response) {
  sistema.obtenerLogs(function(lista){
    response.send(lista)
  })
});

app.get("/obtenerUsuarios", haIniciado, function (request, response) {
  let lista = sistema.obtenerUsuarios();
  response.send(lista);
});

app.get("/usuarioActivo/:email", haIniciado, function (request, response) {
  let email = request.params.email;
  let res = sistema.usuarioActivo(email);
  response.send(res);
});

app.get("/numeroUsuarios", haIniciado, function (request, response) {
  let res = sistema.numeroUsuarios();
  response.send(res);
});

app.get("/eliminarUsuario/:email", haIniciado, function (request, response) {
  let email = request.params.email;
  let res = sistema.eliminarUsuario(email);
  response.send(res);
});
app.get("/comprobarUsuario/:email",function(request,response){
  let email=request.params.email;
  if (sistema.usuarios[email]){
    response.send({"email":email});
  }
  else{
    response.send({"email":-1});
  }
})


httpServer.listen(PORT, () => {
  console.log(`App está escuchando en el puerto ${PORT}`);
  console.log("Ctrl+C para salir");
});


app.get("/confirmarUsuario/:email/:key", function (request, response) {
  let email = request.params.email;
  let key = request.params.key;
  console.log({ email: email, key: key });
  sistema.confirmarUsuario({ email: email, key: key }, function (usr) {
    if (usr.email != -1) response.cookie("email", usr.email);
    response.redirect("/");
  });
});

app.post("/enviarJwt", function (request, response) {
  let jwt = request.body.jwt;
  let user = JSON.parse(atob(jwt.split(".")[1]));
  let email = user.email;
  sistema.usuarioGoogle({ email: email }, function (obj) {
    response.send({ email: obj.email });
  });
});

io.listen(httpServer)
ws.lanzarServidor(io, sistema);
