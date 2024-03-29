const modelo = require("./modelo.js");

describe("El sistema...", function () {
  let sistema;
  let usr; 
  beforeEach(function () {
    sistema = new modelo.Sistema(true);
    usr={"nick":"Pepe","email":"pepe@pepe.es"}
  });

  it("Inicialmente no hay usuarios", function () {
    let res = sistema.numeroUsuarios();
    expect(res).toEqual(0);
  });

  it("Agregar usuario", function () {
    let num = Object.keys(sistema.usuarios).length;
    expect(num).toEqual(0);
    sistema.agregarUsuario(usr);
    let res = sistema.numeroUsuarios();
    expect(res).toEqual(1);
    //num=Object.keys(sistema.usuarios).length;
    //expect(num).toEqual(1);
    expect(sistema.usuarios[usr.email].nick).toEqual("Pepe");
    expect(sistema.usuarios[usr.email].email).toEqual("pepe@pepe.es");

  });

  it("Eliminar usuario", function () {
    let res = sistema.numeroUsuarios();
    expect(res).toEqual(0);
    sistema.agregarUsuario(usr);
    res = sistema.numeroUsuarios();
    expect(res).toEqual(1);
    let res2 = sistema.eliminarUsuario("pepe@pepe.es");
    expect(res2.email).toEqual(usr.email);
    res2 = sistema.eliminarUsuario("Luis");
    expect(res2.email).toEqual(-1);
    res = sistema.numeroUsuarios();
    expect(res).toEqual(0);
  });

  it("Usuario activo", function () {
    sistema.agregarUsuario(usr);
    let res = sistema.usuarioActivo("pepe@pepe.es");
    expect(res.activo).toEqual(true);
  });

  it("Obtener usuarios", function () {
    let lista = sistema.obtenerUsuarios();
    expect(Object.keys(lista).length).toEqual(0);
    sistema.agregarUsuario(usr);
    sistema.agregarUsuario({"nick":"Pepe1","email":"pepe1@pepe1.es"});
    lista = sistema.obtenerUsuarios();
    expect(Object.keys(lista).length).toEqual(2);
  });

  it("Número usuarios", function () {
    let res = sistema.numeroUsuarios();
    expect(res).toBe(0);
    sistema.agregarUsuario(usr);
    sistema.agregarUsuario({"nick":"Pepe1","email":"pepe1@pepe1.es"});
    res = sistema.numeroUsuarios();
    expect(res).toBe(2);
  });

  describe("Métodos que acceden a datos",function(){
    let usrTest={"email":"test@test.es","password":"test","nick":"test"}
    beforeEach(function(done){
      sistema.cad.conectar(function(){
        //sistema.registrarUsuario(usrTest,function(res){
          //sistema.confirmarCuenta(usrTest.email,function(){
            done()
          //})
        //})
        //done()
      })
    })
    it("Inicio de sesion correcto",function(done){
      sistema.loginUsuario(usrTest,function(res){
        expect(res.email).toEqual(usrTest.email)
        expect(res.email).not.toEqual(-1)
        done()
      })
    })
    it("Inicio de sesion incorrecto",function(done){
      let usr1={"email":"test@test.es","password":"test23","nick":"test"}
      sistema.loginUsuario(usr1,function(res){
        expect(res.email).toEqual(-1)
        //expect(res.email).toNotEqual(-1)
        done()
      })
    })
  })
  describe("Pruebas de las partidas", function(){
    let usr2
    let usr3
    beforeEach(function(){
      usr2={"nick":"Pepa","email":"pepa@pepa.es"}
      usr3={"nick":"Pepo","email":"pepo@pepo.es"}
      sistema.agregarUsuario(usr)
      sistema.agregarUsuario(usr2)
      sistema.agregarUsuario(usr3)
    })
    it("Usuarios y partidas en el sistema", function(){
      expect(sistema.numeroUsuarios()).toEqual(3)
      expect(sistema.obtenerPartidasDisponibles().length).toEqual(0)
    })
    it("Crear partida", function(){
      let codigo = sistema.crearPartida(usr.email)
      expect(sistema.obtenerPartidasDisponibles().length).toEqual(1)
      sistema.eliminarPartida(codigo)
      expect(sistema.obtenerPartidasDisponibles().length).toEqual(0)
    })
    it("Unir a partida", function(){
      res = sistema.crearPartida(usr.email)
      expect(sistema.obtenerPartidasDisponibles().length).toEqual(1)
      sistema.unirAPartida(usr2.email,res)
      expect(sistema.obtenerPartidasDisponibles().length).toEqual(0)
    })
    it("Un usuario no puede estar dos veces en una partida", function(){
      res = sistema.crearPartida(usr.email)
      expect(sistema.obtenerPartidasDisponibles().length).toEqual(1)
      sistema.unirAPartida(usr.email,res)
      expect(sistema.obtenerPartidasDisponibles().length).toEqual(1)
      sistema.unirAPartida(usr2.email,res)
      expect(sistema.obtenerPartidasDisponibles().length).toEqual(0)


    })
    it("Obtener partidas", function(){
      res = sistema.crearPartida(usr.email)
      expect(sistema.obtenerPartidasDisponibles().length).toEqual(1)
      res1 = sistema.crearPartida(usr2.email)
      expect(sistema.obtenerPartidasDisponibles().length).toEqual(2)

    })
  })
  // it("Usuario registrado", function () {
  //   let res = sistema.numeroUsuarios();
  //   console.log('usuarios: '+cad.usuarios)
  //   expect(res.num).toBe(0);
  //   let newUser = {
  //     email: "pepito@example.com",
  //     password: "password123",
  //   };
  //   sistema.registrarUsuario(newUser, function (result) {
  //     expect(result.nick).toBe(newUser.email);
  //   });
  //   res = sistema.numeroUsuarios();
  //   expect(res.num).toBe(1);
  // });
});
