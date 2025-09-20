const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// SVG transformer config
//@ts-ignore
config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");
//@ts-ignore
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
//@ts-ignore
config.resolver.sourceExts.push("svg");

// NativeWind integration
//@ts-ignore
module.exports = withNativeWind(config, { input: "./global.css" });
