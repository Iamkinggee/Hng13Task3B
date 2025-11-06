// {
//   "expo": {
//     "name": "my-expo-app",
//     "slug": "my-expo-app",
//     "version": "1.0.0",

//     "web": {
//       "favicon": "./assets/favicon.png"
//     },

//     "experiments": {
//       "tsconfigPaths": true
//     },

//     "plugins": [
    
//       "nativewind",
//       {
//           "tailwindConfig": "./tailwind.config.js"
//         }

//     ],

//     "orientation": "portrait",
//     "icon": "./assets/icon.png",

//     "userInterfaceStyle": "light",

//     "splash": {
//       "image": "./assets/splash.png",
//       "resizeMode": "contain",
//       "backgroundColor": "#ffffff"
//     },
//     "assetBundlePatterns": ["**/*"],
//     "ios": {
//       "supportsTablet": true
//     },
//     "android": {
//       "adaptiveIcon": {
//         "foregroundImage": "./assets/adaptive-icon.png",
//         "backgroundColor": "#ffffff"
//       }
//     }
//   }
// }




// module.exports = function (api) {
//   api.cache(true);
//   let plugins = [];

//   plugins.push('react-native-worklets/plugin');

//   return {
//     presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],

//     plugins,
//   };
// };

