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

    app.postEffect = getPostEffect()
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
      restrictedLevel: [14, 18],
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
        template: CMAP.TileLayerStyle.DARKBLUE
      }
    })

    map.addLayer(tileLayer)

    app.camera.earthFlyTo({
      lonlat: [106.569739, 29.574505],
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
 * 创建街道道路
 */
function createRoad() {
  const roadData = getGeojson()
  roadData.features = roadData.features.filter((item) => item.geometry.type === 'LineString')

  const roadLayer = app.create({
    type: 'FeatureLayer',
    name: 'roadLayer',
    dataSource: roadData,
    geometryType: 'GeoLine',
    renderer: {
      type: 'image',
      lineType: 'Plane',
      imageUrl: 'https://static.3dmomoda.com/textures/21020510ejfqdfcdoqsk9ymmr4q9ifqv.png', // 贴图路径
      effect: true,
      speed: 0.4,
      numPass: 4,
      width: 5,
      glowStrength: 1.5,
      blending: true
    }
  })
  map.addLayer(roadLayer)
}

/**
 * 创建外围建筑
 */
function createBuilding() {
  const buildingData = getGeojson()
  buildingData.features = buildingData.features.filter((item) => item.geometry.type === 'Polygon')

  window.buildingLayer = app.create({
    type: 'ThingLayer',
    name: 'buildingLayer'
  })
  map.addLayer(buildingLayer)

  buildingData.features.forEach((item, index) => {
    const randomTextures = [
      'https://static.3dmomoda.com/textures/210205176yarckwav7zwppu7qj5uwfvf.jpg',
      'https://static.3dmomoda.com/textures/21020517lkxetbzbcgilhjoggt1cooxs.jpg',
      'https://static.3dmomoda.com/textures/21020517zxvr9jgmjbsyyaaigijgl8ho.jpg',
      'https://static.3dmomoda.com/textures/21020517tkqtgfbgb9w73gskc9cackdj.jpg',
      'https://static.3dmomoda.com/textures/210205173zwypn5b1rxo2fhey7pyxzn8.jpg'
    ]
    const isLowBuild = item.properties.height < 160
    const texture = randomTextures[Math.floor(Math.random() * randomTextures.length)]
    const building = app.create({
      type: 'GeoBuilding',
      name: 'building' + index,
      coordinates: item.geometry.coordinates,
      userData: item.properties,
      extrudeField: 'height',
      renderer: {
        type: isLowBuild ? 'vector' : 'image',
        color: '#0D2162',
        opacity: 0.7,
        imageUrl: ['https://static.3dmomoda.com/textures/21020517dbkngsgv1wugn3ldfrje3izv.png', texture],
        blending: false,
        effect: true,
        textureWrap: CMAP.TextureWrapMode.Stretch
      }
    })
    buildingLayer.add(building)
  })
}

/**
 * 创建园区场景
 */
function createCampus() {
  const sceneLonlat = [106.571739, 29.575505]
  const position = CMAP.Util.convertLonlatToWorld(sceneLonlat, 0.5)
  const angles = CMAP.Util.getAnglesFromLonlat(sceneLonlat, 180)

  window.campus = app.create({
    type: 'Campus',
    name: '江北城',
    url: '/api/scene/cb923fc19366477f1df7dcfe', // 园区地址
    position: position, // 位置
    angles: angles, // 旋转
    complete: () => {
      setTimeout(() => {
        app.camera.rotateAround({
          target: app.camera.target, // 围绕摄像机当前目标点
          isEarth: true,
          yRotateAngle: 50,
          time: 20 * 1000
        })
        updateCampusEffect()
      }, 1000)
    }
  })
}

/**
 * 修改园区建筑及动画效果
 */
function updateCampusEffect() {
  const circle = app.query('#anime1')[0]
  if (circle) {
    circle.playAnimation({
      name: '_defaultAnim_',
      loopType: THING.LoopType.Repeat,
      speed: 1
    })
  }
  const things = campus.query('物体').initObjectPool
  const colors = ['#0D2162', '#3854AD', '#3A84FE']
  things.forEach((item, index) => {
    if (item.type === 'Thing') {
    } else {
      item.style.color = colors[index % colors.length]
      item.style.opacity = 0.8
    }
  })
}

/**
 * 创建图表
 */
function createChart() {
  const chartLayer = document.createElement('div')
  const style = `
    z-index: 100;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: url('https://static.3dmomoda.com/textures/21020709v127flsvwuoajmqyg1ahcxa4.png') no-repeat center center;
    background-size: 100% 100%;
    pointer-events: none;
  `
  chartLayer.setAttribute('style', style)
  document.body.appendChild(chartLayer)
  document.querySelector('#dataAttribution').style.display = 'none'
}

/**
 * 初始化程序
 */
async function init() {
  try {
    await _import([LIB_UEARTH, DATA_GEOJSON, CONFIG_EFFECT])

    await createApp()
    await createMap()

    createRoad()
    createBuilding()
    createCampus()
    createChart()
  } catch (e) {
    console.error('捕获异常：', e)
  }
}

init()
