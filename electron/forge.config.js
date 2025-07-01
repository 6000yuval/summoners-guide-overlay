
module.exports = {
  packagerConfig: {
    name: 'League Coach Pro',
    executableName: 'league-coach-pro',
    icon: './public/favicon.ico',
    out: './dist-electron'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'league-coach-pro'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ]
};
