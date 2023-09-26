const modelo = require("./modelo.js");

describe('El sistema', function() {
  let sistema;

  beforeEach(function() {
    sistema = new modelo.Sistema();
  });

  it('inicialmente no hay usuarios', function() {
    expect(sistema.numeroUsuarios()).toEqual(0);
  });

  it('puede agregar usuarios', function() {
    sistema.agregarUsuario('usuario1');
    expect(sistema.numeroUsuarios()).toEqual(1);
    expect(sistema.usuarios["usuario1"].nick).toEqual("usuario1")

  });

  it('puede obtener la lista de usuarios', function() {
    sistema.agregarUsuario('usuario1');
    sistema.agregarUsuario('usuario2');
    const usuarios = sistema.obtenerUsuarios();
    expect(usuarios).toEqual(['usuario1', 'usuario2']);
  });

  it('puede verificar si un usuario está activo', function() {
    sistema.agregarUsuario('usuario1');
    expect(sistema.usuarioActivo('usuario1')).toEqual(true);
    expect(sistema.usuarioActivo('usuario2')).toEqual(false);
  });

  it('puede eliminar usuarios', function() {
    sistema.agregarUsuario('usuario1');
    expect(sistema.eliminarUsuario('usuario1')).toEqual(true);
    expect(sistema.numeroUsuarios()).toEqual(0);
    expect(sistema.eliminarUsuario('usuario2')).toEqual(false);
  });
});
