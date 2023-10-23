const modelo=require("./modelo.js");

describe('El sistema...', function() {
   let sistema;
  
   beforeEach(function() {
     sistema=new modelo.Sistema(true);
   });
  
  it('Inicialmente no hay usuarios', function() {
    let res=sistema.numeroUsuarios();
    expect(res.num).toEqual(0);
  });

  it('Agregar usuario',function(){
    let num=Object.keys(sistema.usuarios).length;
    expect(num).toEqual(0);
    sistema.agregarUsuario("Pepe");
    let res=sistema.numeroUsuarios();
    expect(res.num).toEqual(1);
    //num=Object.keys(sistema.usuarios).length;
    //expect(num).toEqual(1);
    expect(sistema.usuarios["Pepe"].nick).toEqual("Pepe");
  });

  it("Eliminar usuario",function(){
    let res=sistema.numeroUsuarios();
    expect(res.num).toEqual(0);
    sistema.agregarUsuario("Pepe");
    res=sistema.numeroUsuarios();
    expect(res.num).toEqual(1);
    let res2=sistema.eliminarUsuario("Pepe");
    expect(res2.nick).toEqual("Pepe");
    res2=sistema.eliminarUsuario("Luis");
    expect(res2.nick).toEqual(-1);
    res=sistema.numeroUsuarios();
    expect(res.num).toEqual(0);
  });

  it("Usuario activo", function(){
    sistema.agregarUsuario("Pepe");
    let res=sistema.usuarioActivo("Pepe");
    expect(res.activo).toEqual(true);
  });

  it("Obtener usuarios",function(){
    let lista=sistema.obtenerUsuarios();
    expect(Object.keys(lista).length).toEqual(0);
    sistema.agregarUsuario("Pepe");
    sistema.agregarUsuario("Pepe1");
    lista=sistema.obtenerUsuarios();
    expect(Object.keys(lista).length).toEqual(2);
  });

  it("Número usuarios",function(){
    let res=sistema.numeroUsuarios();
    expect(res.num).toBe(0);
    sistema.agregarUsuario("Pepe");
    sistema.agregarUsuario("Pepe1");
    res=sistema.numeroUsuarios();
    expect(res.num).toBe(2);
  })
})
  