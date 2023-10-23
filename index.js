const fs=require("fs");
const express = require('express');
const app = express();
const passport=require("passport");
const bodyParser=require("body-parser");
const cookieSession=require("cookie-session");
const args = process.argv.slice(2); 


require("./servidor/passport-setup.js");
const modelo = require("./servidor/modelo.js");
const PORT = process.env.PORT || 3000;

let test=false; 
test=eval(args[0]); //test=true

app.use(express.static(__dirname + "/"));
app.use(cookieSession({
    name: 'Batalla Naval',
    keys: ['key1', 'key2']
   }));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

let sistema= new modelo.Sistema(test);

app.get("/auth/google",passport.authenticate('google', { scope: ['profile','email'] }));
app.get('/google/callback',
 passport.authenticate('google', { failureRedirect: '/fallo' }),
 function(req, res) {
 res.redirect('/good');
});
app.get("/good", function(request,response){
    let nick=request.user.emails[0].value;
    // if (nick){
    // sistema.agregarUsuario(nick);
    // }
    sistema.obtenerOCrearUsuario(nick)
    //console.log(request.user.emails[0].value);
    response.cookie('nick',nick);
    response.redirect('/');
   });
app.get("/fallo",function(request,response){
    response.send({nick:"nook"})
});

app.get("/", function(request,response){
    let contenido=fs.readFileSync(__dirname+"/cliente/index.html");
    response.setHeader("Content-type","text/html");
    response.send(contenido);
});


app.get("/agregarUsuario/:nick",function(request,response){ 
    let nick=request.params.nick;   
    let res=sistema.agregarUsuario(nick); response.send(res); 
});

app.get("/obtenerUsuarios",function(request,response){
    let lista=sistema.obtenerUsuarios();
    response.send(lista);
});

app.get("/usuarioActivo/:nick",function(request,response){
    let nick=request.params.nick;
    let res=sistema.usuarioActivo(nick);
    response.send(res);
});

app.get("/numeroUsuarios",function(request,response){
    let res=sistema.numeroUsuarios();
    response.send(res);
});

app.get("/eliminarUsuario/:nick",function(request,response){
    let nick=request.params.nick;
    let res=sistema.eliminarUsuario(nick);
    response.send(res);
})

app.listen(PORT, () => {
    console.log(`App está escuchando en el puerto ${PORT}`);
    console.log('Ctrl+C para salir');
});

app.post('/enviarJwt',function(request,response){
    let jwt=request.body.jwt;
    let user=JSON.parse(atob(jwt.split(".")[1]));
    let email=user.email;
    sistema.obtenerOCrearUsuario(email,function(obj){
    response.send({'nick':obj.email});
    })
   });