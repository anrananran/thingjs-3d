const DIR_BASE = '/uploads/wechat/Q-073E1D309A036FB2727B74243305D2C8/file/涪陵新区/' // 资源根路径

const LIB_UEARTH = 'https://www.thingjs.com/uearth/history/uearth.min.v1.7.8.9.js' // 支持GIS
const LIB_AJAX = DIR_BASE + 'request.js' // 网络请求库
const LIB_LOADING = DIR_BASE + 'loading.js' // 初始loading
const LIB_LOADING_CSS = DIR_BASE + 'loading.css' // 初始loading的样式

const GEO_BUILDING = DIR_BASE + 'building.json' // 建筑物
const GEO_ROAD = DIR_BASE + 'road.json' // 路网
const GEO_WATER = DIR_BASE + 'water.json' // 水体

const CONFIG_TILE_URL = 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}' // 瓦片地图服务
const CONFIG_EFFECT = DIR_BASE + 'effect.js' // 环境参数

const TEXTURE_BUILDING = [
  'https://static.3dmomoda.com/textures/210225159zjk7xedw9enatyhzynqgglr.png',
  // 'https://static.3dmomoda.com/textures/21022515tkmmbrvfiogxlcwc7rt9uoib.png',
  // 'https://static.3dmomoda.com/textures/21022515ru5l0k98pwbjgdzg2gmfrlsc.png',
  // 'https://static.3dmomoda.com/textures/21022515lxkrtkldbudfkajsujcslfhq.png',

  'https://static.3dmomoda.com/textures/21022515vhcxehhbbbyvutomemirow3g.png',
  // 'https://static.3dmomoda.com/textures/21022515u93kcqe03z4bmim99vnvfi2c.png',
  // 'https://static.3dmomoda.com/textures/21022515dwk3bjrylyk0owqxfcouprqg.png',
  // 'https://static.3dmomoda.com/textures/21022515ojaoauntcpagjtmuigtliope.png',
  // 'https://static.3dmomoda.com/textures/21022515uatvr7yxeqyi1yycuwit0rpd.png',

  'https://static.3dmomoda.com/textures/21022515fmloy7siptxmugb61zi036vu.png',
  // 'https://static.3dmomoda.com/textures/21022515l0syrdonvxyutfdlgmqtu3xv.png',
  // 'https://static.3dmomoda.com/textures/21022515c5j3p1sye7nqj5hekgdpq4ws.png',
  // 'https://static.3dmomoda.com/textures/21022515vgypzbfsq2zjdiumjkbkyx7a.png',
  // 'https://static.3dmomoda.com/textures/21022515jwbggkrj3saddi4r6vkb1ysj.png',

  'https://static.3dmomoda.com/textures/21022515yfsqpp6wlxsfnrvizdhyyc1k.png',
  // 'https://static.3dmomoda.com/textures/21022515an8hafkdiwg4xysdtpksd96p.png',
  // 'https://static.3dmomoda.com/textures/210225159ph0jo1maqtuut2cstvrfdvc.png',
  // 'https://static.3dmomoda.com/textures/21022515yn9oh1oiagm7126167nyxwuz.png',
  // 'https://static.3dmomoda.com/textures/21022515pqfbawjvehfm9vetnayf7tlm.png'
]

/**
 * 引用资源文件
 * @param {Array}} libs 资源文件路径集合
 */
function _import(libs) {
  return new Promise((resolve) => {
    THING.Utils.dynamicLoad(libs, resolve)
  })
}

/**
 * 初始化APP
 */
function createApp() {
  return new Promise((resolve) => {
    window.app = new THING.App({
      background: '#000',
      skyBox: 'MilkyWay'
    })
    // app.postEffect = effectConfig
    app.lighting = globalConfig
    resolve()
  })
}

/**
 * 创建地图
 */
function createMap() {
  return new Promise((resolve) => {
    window.map = app.create({
      type: 'Map',
      atmosphere: true,
      // restrictedLevel: [14, 18],
      style: {
        night: true,
        fog: false
      },
      attribution: '高德'
    })

    const tileLayer = app.create({
      type: 'TileLayer',
      name: 'tileLayer',
      url: CONFIG_TILE_URL,
      style: {
        brightness: 0.4,
        contrast: 0.9,
        saturation: 4.1,
        hue: 0.0,
        gamma: 0.7,
        template: CMAP.TileLayerStyle.DARKBLUE
      }
    })

    map.addLayer(tileLayer)
    app.camera.earthFlyTo({
      lonlat: [107.396164, 29.704977],
      height: 2000,
      time: 0,
      disablePick: false,
      complete: () => {
        CMAP.Util.correctSkyBox()
        resolve()
      }
    })
  })
}

/**
 * 创建外围建筑
 */
function createBuilding() {
  return new Promise(async(resolve) => {
    const building = await request({
      type: 'GET',
      url: GEO_BUILDING
    })
    window.buildingLayer = app.create({
      type: 'ThingLayer',
      name: 'buildingLayer'
    })
    map.addLayer(buildingLayer)
    building.features.forEach((item, index) => {
      if (item.geometry && item.geometry.coordinates) {
        let textureIndex = 0
        if (item.properties) {
          const h = Number(item.properties.Height) || 50
          if (h > 30) {
            textureIndex = 1
          } else if (h > 60) {
            textureIndex = 2
          } else if (h > 90) {
            textureIndex = 3
          }
        }
        const textureSide = TEXTURE_BUILDING[textureIndex]
        const textureTop = TEXTURE_BUILDING[2]
        const building = app.create({
          type: 'GeoBuilding',
          name: 'building' + index,
          coordinates: item.geometry.coordinates,
          userData: item.properties,
          extrudeField: 'Height',
          extrudeFactor: 3,
          renderer: {
            type: 'image',
            imageUrl: [textureTop, textureSide], // 楼宇顶部贴图和侧边贴图
					  blending: false, // 贴图叠加混合
            textureWrap: CMAP.TextureWrapMode.Stretch,
            // textureSize: [6, 6]
          }
        })
        buildingLayer.add(building)
      }
    })
    resolve()
  })
}

/**
 * 创建建筑流光
 */
function createBuildingFlow() {
  return new Promise(async(resolve) => {
    const building = await request({
      type: 'GET',
      url: GEO_BUILDING
    })
    building.features.forEach((item, index) => {
      if (index < 900 || index > 1200) return
      if (item.geometry && item.geometry.coordinates) {
        const len = Math.floor(item.properties.Height*3 / 30)
        for(let i = 0; i < len; i++) {
          const heightArray = new Array(item.geometry.coordinates[0].length).fill(i*30)
          const flowLine = app.create({
            type: 'GeoLine',
            name: 'flowLine' + index + '_' + i,
            coordinates: item.geometry.coordinates[0],
            heightArray,
            renderer: {
              type: 'vector',
              lineType: 'Plane',
              // imageUrl: '/guide/image/uGeo/path.png', // 贴图路径
              effect: true,
              speed: 0,
              numPass: 5,
              opacity: 0.8,
              color: '#ff4200',
              width: 8,
              glowStrength: 3,
              blending: true
            }
          })
          buildingLayer.add(flowLine)
        }
      }
    })
    resolve()
  })
}

/**
 * 创建街道道路
 */
function createRoadFlow() {
  return new Promise(async(resolve) => {
    const road = await request({
      type: 'GET',
      url: GEO_ROAD
    })
    const roadLayer = app.create({
      type: 'ThingLayer',
      name: 'roadLayer'
    })
    map.addLayer(roadLayer)
    road.features.forEach((item, index) => {
      if (item.geometry && item.geometry.coordinates) {
        const road = app.create({
          type: 'GeoLine',
          name: 'road' + index,
          coordinates: item.geometry.coordinates,
          renderer: {
            type: 'image',
            lineType: 'Plane',
            imageUrl: 'https://www.thingjs.com/citybuilder_console/upload/lineIcons/3d/lightFlow_strip07.png', // 贴图路径
            effect: true,
            speed: Math.random(),
            numPass: 4,
            width: 5,
            glowStrength: 1.5,
            blending: true
          }
        })
        roadLayer.add(road)
      }
    })
    resolve()
  })
}

/**
 * 创建水体
 */
function createWater() {
  return new Promise(async(resolve) => {
    const water = await request({
      type: 'GET',
      url: GEO_WATER
    })
    const waterLayer = app.create({
      type: 'ThingLayer',
      name: 'waterLayer'
    })
    map.addLayer(waterLayer)
    water.features.forEach((item, index) => {
      if (item.geometry && item.geometry.coordinates) {
        const water = app.create({
          type: 'GeoWater',
          name: 'water' + index,
          coordinates: item.geometry.coordinates,
          renderer: {
            reflectionNormal: 'https://www.thingjs.com/citybuilder_console/static/texture/waternormals.jpg',//反射法线贴图
            refractionNormal: 'https://www.thingjs.com/citybuilder_console/static/texture/Water_2_M_Normal.jpg',//折射法线贴图
            reflectionImage: 'https://www.thingjs.com/citybuilder_console/static/texture/refraction.jpg',//反射图
            refractionImage: 'https://www.thingjs.com/citybuilder_console/static/texture/refraction.jpg',//折射图
            color: '#364DF2',
            waveLength: 0.25, // 波纹长度
            flowSpeed: 1.0 // 水体流速，默认1.0
          }
        })
        waterLayer.add(water)
      }
    })
    resolve()
  })
}

/**
 * 创建3D飞线效果
 */
function createFlyLine() {
  return new Promise((resolve) => {
    window.flylineLayer = app.create({
      type: 'ThingLayer',
      name: 'flylineLayer'
    })
    map.addLayer(flylineLayer)
    const features = [
      { coordinates: [[107.393851,29.702475], [107.409559,29.694406]] },
      { coordinates: [[107.393851,29.702475], [107.376085,29.714013]] },
      { coordinates: [[107.393851,29.702475], [107.378231,29.688217]] },
    ]
    features.forEach((item, index) => {
      const lineTextures = [
        'https://www.thingjs.com/uploads/wechat/153565/file/3D%E5%B0%84%E7%BA%BF%E6%BC%94%E7%A4%BA/z1.png',
        'https://www.thingjs.com/uploads/wechat/153565/file/3D%E5%B0%84%E7%BA%BF%E6%BC%94%E7%A4%BA/z_11.png',
        'https://www.thingjs.com/uploads/wechat/153565/file/3D%E5%B0%84%E7%BA%BF%E6%BC%94%E7%A4%BA/z3.png'
      ]
      const flyline = app.create({
        type: 'GeoFlyLine',
        name: 'flyline' + index,
        coordinates: item.coordinates,
        offsetHeight: 200,
        renderer: {
          type: 'image',
          lineType: 'Plane',
          imageUrl: lineTextures[index],
          effect: true,
          speed: 1,
          numPass: 3,
          width: 20,
          blending: true
        }
      })
      const verticalLine = app.create({
        type: 'GeoLine',
        name: 'verticalLine' + index,
        coordinates: [item.coordinates[1], item.coordinates[1]],
        heightArray: [5, 580],
        renderer: {
          type: 'image',
          lineType: 'Plane',
          imageUrl: 'https://www.thingjs.com/uploads/wechat/153565/file/3D%E5%B0%84%E7%BA%BF%E6%BC%94%E7%A4%BA/h1.png', // 贴图路径
          effect: true,
          speed: 2,
          numPass: 3,
          width: 16,
          glowStrength: 1.8,
          blending: true
        }
      })
      flylineLayer.add(flyline)
      flylineLayer.add(verticalLine)
    })


    // const sceneLonlat = [107.393851,29.702475]
    // const angles = CMAP.Util.getAnglesFromLonlat(sceneLonlat, 0)
    // for(let i = 0; i < 5; i++) {
    //   const position = CMAP.Util.convertLonlatToWorld(sceneLonlat, i*40)
    //   const circle = app.create({
    //     type: 'Thing',
    //     name: '辉光' + i,
    //     url: '/api/models/c0ddc3e7815e4711b4a74d19fd69428b/0/gltf/', 
    //     // url: '/api/models/b0f37b2520a8446fa2ca9430bd532cd4/0/gltf/',
    //     position,
    //     angles,
    //     scale: [10, 10, 10]
    //   })
    //   flylineLayer.add(circle)
    // }

    resolve()
  })
}


/**
 * 初始化程序
 */
async function init() {
  try {
    await _import([LIB_LOADING, LIB_LOADING_CSS])
    showLoading()
    await _import([LIB_UEARTH, LIB_AJAX, CONFIG_EFFECT])
    await createApp()
    await createMap()
    await createBuilding()
    await createBuildingFlow()
    await createRoadFlow()
    await createWater()
    await createFlyLine()
    hideLoading()
  } catch (e) {
    console.error('捕获异常：', e)
  }
}

init()
