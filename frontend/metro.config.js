const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Добавляем поддержку SVG, сохраняя остальные трансформеры
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

// Добавляем svg к sourceExts, но не трогаем assetExts кроме svg
config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...config.resolver.sourceExts, "svg"],
};

module.exports = config;
