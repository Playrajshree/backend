const bcrypt = require('bcryptjs');
const Config = require('../configs/Config.js');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const handleHashPassword = async (userPassword) => {
  const SALT_ROUND = parseInt(Config.SALT_ROUND) || 10;
  const salt = await bcrypt.genSalt(SALT_ROUND);
  const hashedPassword = await bcrypt.hash(userPassword, salt);
  return hashedPassword;
};

const comparePasswordHandler = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};

const generateAccessToken = (payload) => {
  try {
    const privateKeyPath = path.join(
      __dirname,
      '..',
      '..',
      'certs',
      'privateKey.pem'
    );
    const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '1d',
    });

    return accessToken;
  } catch (error) {
    console.error('Error generating access token', error);
    throw new Error('Failed to generate access token');
  }
};

const generateRefreshToken = (payload) => {
  try {
    const privateKeyPath = path.join(
      __dirname,
      '..',
      '..',
      'certs',
      'privateKey.pem'
    );
    const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
    const refreshToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7d',
    });
    return refreshToken;
  } catch (error) {
    console.error('Error generating refresh token', error);
    throw new Error('Failed to generate refresh token');
  }
};

module.exports = {
  handleHashPassword,
  comparePasswordHandler,
  generateAccessToken,
  generateRefreshToken,
};
