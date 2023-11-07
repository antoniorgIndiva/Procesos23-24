
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
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">
                <h1 style="color: #007BFF;">Bienvenido al Sistema</h1>
                <p style="font-size: 16px; color: #333;">Gracias por registrarte en nuestro sistema.</p>
                <p style="font-size: 16px; color: #333;">
                    Para confirmar tu cuenta, pulsa el siguiente enlace:
                    <a href="${url}confirmarUsuario/${direccion}/${key}" style="color: #007BFF;">Confirmar Cuenta</a>
                </p>
            </div>
        `
    });
    
    console.log(JSON.stringify(result, null, 4));

}