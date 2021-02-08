function getPostEffect() {
  return {
    temporalSuperSampling: {
      enable: false,
      size: 21
    },
    postEffect: {
      enable: true,
      bloom: {
        enable: false,
        strength: 0.557,
        radius: 0
      },
      screenSpaceAmbientOcclusion: {
        enable: false,
        radius: 0.4,
        intensity: 0.8
      },
      colorCorrection: {
        enable: true,
        exposure: 0.6,
        brightness: 0.032,
        contrast: 1.2,
        saturation: 1.5,
        gamma: 0.8
      },
      vignette: {
        enable: true,
        type: 'color',
        color: '0x000000',
        offset: 2.2
      },
      film: {
        enable: false,
        grayscale: false,
        noiseIntensity: 0.5,
        scanlinesIntensity: 0.42000000000000004,
        scanlinesCount: 442
      },
      chromaticAberration: {
        enable: false,
        chromaFactor: 0.01
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
}
