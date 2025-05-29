const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('cjs'); // 👈 support CommonJS
config.resolver.sourceExts.push('cjs'); // 👈 support CommonJS

module.exports = config;
