const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const generatePemKey = () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
  console.log('-----', privateKey, publicKey);

  // specifying encoding makes the fs to stores the file as text not the binary

  fs.writeFileSync(
    path.join(__dirname, '..', 'certs', 'privateKey.pem'),
    privateKey,
    'utf8'
  );
  fs.writeFileSync(
    path.join(__dirname, '..', 'certs', 'publicKey.pem'),
    publicKey,
    'utf-8'
  );

  return {
    privateKey,
    publicKey,
  };
};

generatePemKey();
