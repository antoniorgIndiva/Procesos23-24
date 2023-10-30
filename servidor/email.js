
const nodemailer = require('nodemailer');
const url="http://localhost:3000/";
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'antoniorg.129@gmail.com',
        pass: 'leik puil olnj asfn'
    }
});

//send();

module.exports.enviarEmail=async function(direccion, key,men) {
    const result = await transporter.sendMail({
        from: 'antoniorg.129@gmail.com',
        to: direccion,
        subject: men,
        text: 'Pulsa aquí para confirmar cuenta',
        html: '<p>Bienvenido a Sistema</p><p><a href="'+url+'confirmarUsuario/'+direccion+'/'+key+'">Pulsa aquí para confirmar cuenta</a></p>'
    });
    console.log(JSON.stringify(result, null, 4));

}
