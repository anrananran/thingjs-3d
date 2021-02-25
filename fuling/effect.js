const effectConfig = {
  temporalSuperSampling: {
    enable: false,
    size: 30
  },
  postEffect: {
    enable: true,
    bloom: {
      enable: false,
      strength: 0.14,
      radius: 0.4
    },
    screenSpaceAmbientOcclusion: {
      enable: false,
      radius: 0.2,
      intensity: 0.8
    },
    colorCorrection: {
      enable: false,
      exposure: 0,
      brightness: 0,
      contrast: 1.1,
      saturation: 1.2,
      gamma: 1
    },
    vignette: {
      enable: true,
      type: 'color',
      color: '0x000000',
      offset: 1.5
    },
    film: {
      enable: false,
      grayscale: false,
      noiseIntensity: 0.35,
      scanlinesIntensity: 0,
      scanlinesCount: 2048
    },
    chromaticAberration: {
      enable: false,
      chromaFactor: 0.025
    },
    dof: {
      enable: false,
      focalDepth: 1,
      focalLength: 24,
      maxblur: 1
    },
    FXAA: {
      enable: false
    }
  }
}

// 环境光对象
const ambientLight = {
  intensity: 0.1,
  color: '#ed1c70'
}
// 半球光照
const hemisphereLight = {
  intensity: 0,
  color: '3310847',
  groundColor: '16763007'
}
// 主灯光对象
const mainLight = {
  shadow: true,
  intensity: 0.5,
  color: '16772829',
  alpha: 3,
  beta: 3
}
// 第二光源对象
const secondaryLight = {
  shadow: true,
  intensity: 1.8,
  color: '16772829',
  alpha: 134,
  beta: 6
}
// 全局配置
const globalConfig = {
  showHelper: false,
  ambientLight,
  hemisphereLight,
  mainLight,
  secondaryLight
}
