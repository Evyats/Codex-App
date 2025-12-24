const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  config.resolver = {
    ...config.resolver,
    sourceExts: [...config.resolver.sourceExts, 'cjs'],
    extraNodeModules: {
      ...(config.resolver?.extraNodeModules || {}),
      'react-native-vector-icons': path.join(
        __dirname,
        'node_modules',
        '@expo',
        'vector-icons'
      ),
    },
  };

  return withNativeWind(config, { input: './global.css' });
})();
