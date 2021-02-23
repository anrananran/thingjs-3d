const DIR_BASE = '/uploads/wechat/Q-073E1D309A036FB2727B74243305D2C8/file/江北城园区/' // 资源根路径
const LIB_UEARTH = 'https://www.thingjs.com/uearth/history/uearth.min.v1.7.8.9.js' // 支持GIS
const DATA_GEOJSON = DIR_BASE + 'geojson.js' // GEOJSON数据
const CONFIG_TILE_URL = 'https://webst0{1,2,3,4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}' // 瓦片地图服务
const CONFIG_EFFECT = DIR_BASE + 'post-effect.js' // 后期效果配置

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

    // app.postEffect = getPostEffect()
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
        night: false,
        fog: false
      },
      attribution: '高德'
    })

    const tileLayer = app.create({
      type: 'TileLayer',
      name: 'tileLayer',
      url: CONFIG_TILE_URL,
      style: {
        // template: CMAP.TileLayerStyle.DARKBLUE
      }
    })

    map.addLayer(tileLayer)

    app.camera.earthFlyTo({
      lonlat: [113.086522, 22.652449],
      height: 2000,
      time: 6000,
      disablePick: false,
      complete: () => {
        CMAP.Util.correctSkyBox()
        resolve()
      }
    })
  })
}


/**
 * 初始化程序
 */
async function init() {
  try {
    await _import([LIB_UEARTH, CONFIG_EFFECT])

    await createApp()
    await createMap()

    const tile3dLayer = app.create({
      type: 'Tile3dLayer',
      name: 'tile3d',
      url: '/uearth/3dtiles/Tileset.json',
      offsetHeight: 2
    })
    map.userLayers.add(tile3dLayer)
  } catch (e) {
    console.error('捕获异常：', e)
  }
}

init()
