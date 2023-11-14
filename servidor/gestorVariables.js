const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');

const client = new SecretManagerServiceClient();

module.exports.accessCLAVECORREO= async function(callback) {
    const name = 'projects/259650379862/secrets/CLAVECORREO/versions/1';
      const [version] = await client.accessSecretVersion({
        name: name,
      });
      //console.info(`Found secret ${version.name} with state ${version.state}`);
      const datos=version.payload.data.toString("utf8");
      //console.log("Datos "+datos);
      callback(datos);
}
