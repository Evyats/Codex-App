module.exports = function (api) {
  api.cache(true);
  return {
    // Presets run right-to-left; keep nativewind last so it can transform className for native.
    presets: ['nativewind/babel', 'babel-preset-expo'],
  };
};
