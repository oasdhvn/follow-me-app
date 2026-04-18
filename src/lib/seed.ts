import { PublishedCard } from './types'

const GRADIENTS = [
  { from: '#0ea5e9', to: '#d946ef' },
  { from: '#f97316', to: '#ef4444' },
  { from: '#10b981', to: '#06b6d4' },
  { from: '#8b5cf6', to: '#ec4899' },
  { from: '#f59e0b', to: '#f97316' },
  { from: '#06b6d4', to: '#8b5cf6' },
  { from: '#ef4444', to: '#f59e0b' },
  { from: '#14b8a6', to: '#22d3ee' },
]

function randomGradient() {
  const g = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]
  return { gradientFrom: g.from, gradientTo: g.to }
}

export function seedDemoData() {
  if (typeof window === 'undefined') return
  if (localStorage.getItem('followme_seeded')) return

  const demoUsers = [
    { id: 'demo-1', username: '旅行家小王', password: 'demo', avatar: '🧑‍✈️', bio: '足迹遍布30+国家，分享旅途中的每一份感动', createdAt: '2024-01-01T00:00:00Z' },
    { id: 'demo-2', username: '背包客阿花', password: 'demo', avatar: '👩‍🎨', bio: '用镜头记录世界的每一个角落', createdAt: '2024-02-15T00:00:00Z' },
    { id: 'demo-3', username: '美食旅人', password: 'demo', avatar: '👨‍🍳', bio: '走到哪吃到哪，旅行就是一场味蕾的冒险', createdAt: '2024-03-20T00:00:00Z' },
  ]

  const demoCards: PublishedCard[] = [
    {
      id: 'card-1', userId: 'demo-1', username: '旅行家小王', avatar: '🧑‍✈️',
      cardData: {
        title: '京都古韵之旅：穿越千年，探寻日本灵魂',
        location: '日本京都',
        duration: '3-5天',
        budget: '5000-8000元人民币',
        highlights: ['金阁寺的黄金闪耀', '清水寺的古老氛围', '伏见稻荷大社的千本鸟居', '岚山的竹林小径'],
        tips: ['提前规划行程，避开人流高峰', '京都地铁和巴士覆盖全面，出行方便', '注意尊重当地文化，穿着得体', '品尝京都传统美食，如抹茶甜点、豆腐料理'],
        bestTime: '春季樱花盛开，秋季红叶遍野',
        tags: ['日本旅游', '古都文化', '佛教圣地', '美食天堂'],
      },
      userCaption: '京都真的是一个让人去了就不想走的地方！春天的樱花、秋天的红叶，每个季节都有不同的美 🌸🍁',
      likes: 128, likedBy: ['demo-2', 'demo-3'],
      bookmarks: 45, bookmarkedBy: ['demo-2'],
      comments: [
        { id: 'c1', userId: 'demo-2', username: '背包客阿花', avatar: '👩‍🎨', content: '金阁寺真的太美了！上次去的时候还下着小雪，绝了 ❄️', createdAt: '2024-11-10T08:30:00Z' },
        { id: 'c2', userId: 'demo-3', username: '美食旅人', avatar: '👨‍🍳', content: '推荐锦市场的抹茶冰淇淋！', createdAt: '2024-11-11T14:20:00Z' },
      ],
      createdAt: '2024-11-09T10:00:00Z',
      ...randomGradient(),
    },
    {
      id: 'card-2', userId: 'demo-2', username: '背包客阿花', avatar: '👩‍🎨',
      cardData: {
        title: '大理风花雪月：苍山洱海间的诗意栖居',
        location: '云南大理',
        duration: '3-4天',
        budget: '2000-4000元人民币',
        highlights: ['洱海环湖骑行', '大理古城夜游', '苍山索道观景', '双廊古镇日落'],
        tips: ['环洱海骑行是最推荐的体验', '住古城里方便逛吃，住海边更安静', '防晒很重要！高原紫外线强烈', '白族扎染体验很值得尝试'],
        bestTime: '3-5月春暖花开，9-11月秋高气爽',
        tags: ['云南旅游', '洱海', '古城', '骑行'],
      },
      userCaption: '在洱海边发呆的那几天，感觉时间都慢了下来。这就是我想要的生活啊~ 🏔️🌊',
      likes: 96, likedBy: ['demo-1'],
      bookmarks: 32, bookmarkedBy: ['demo-1', 'demo-3'],
      comments: [
        { id: 'c3', userId: 'demo-1', username: '旅行家小王', avatar: '🧑‍✈️', content: '洱海日出太美了，下次一起去！', createdAt: '2024-10-22T09:15:00Z' },
      ],
      createdAt: '2024-10-20T16:00:00Z',
      ...randomGradient(),
    },
    {
      id: 'card-3', userId: 'demo-3', username: '美食旅人', avatar: '👨‍🍳',
      cardData: {
        title: '成都美食地图：舌尖上的天府之国',
        location: '四川成都',
        duration: '2-3天',
        budget: '1500-3000元人民币',
        highlights: ['宽窄巷子的市井烟火', '锦里古街的川味小吃', '春熙路的潮酷打卡', '人民公园的盖碗茶'],
        tips: ['火锅建议选微辣入门，别逞强', '早上去人民公园喝茶，体验本地生活', '大熊猫基地一定要早去，上午最活跃', '带好肠胃药，以防万一'],
        bestTime: '3-6月和9-11月，避开盛夏酷暑',
        tags: ['成都美食', '火锅', '熊猫', '休闲'],
      },
      userCaption: '作为一个吃货，成都简直就是天堂！三天吃了十几顿，每顿都不踩雷 🌶️🍲',
      likes: 203, likedBy: ['demo-1', 'demo-2'],
      bookmarks: 78, bookmarkedBy: ['demo-1'],
      comments: [
        { id: 'c4', userId: 'demo-2', username: '背包客阿花', avatar: '👩‍🎨', content: '马路边边的串串yyds！', createdAt: '2024-09-15T20:30:00Z' },
        { id: 'c5', userId: 'demo-1', username: '旅行家小王', avatar: '🧑‍✈️', content: '大熊猫太可爱了！不过确实要早点去', createdAt: '2024-09-16T11:00:00Z' },
      ],
      createdAt: '2024-09-14T12:00:00Z',
      ...randomGradient(),
    },
    {
      id: 'card-4', userId: 'demo-1', username: '旅行家小王', avatar: '🧑‍✈️',
      cardData: {
        title: '拉萨日光之城：离天空最近的朝圣',
        location: '西藏拉萨',
        duration: '5-7天',
        budget: '5000-10000元人民币',
        highlights: ['布达拉宫的庄严肃穆', '大昭寺的虔诚转经', '八廓街的藏式风情', '纳木错的天湖倒影'],
        tips: ['提前3天到达适应高反，别剧烈运动', '带好防晒和保暖衣物，昼夜温差大', '尊重当地宗教习俗，转经顺时针方向', '建议跟团或包车，自驾风险较大'],
        bestTime: '6-9月气候最舒适，含氧量最高',
        tags: ['西藏旅游', '布达拉宫', '高原', '朝圣'],
      },
      userCaption: '站在布达拉宫前的那一刻，所有的疲惫都值了。这是灵魂被洗涤的感觉 🙏🏔️',
      likes: 167, likedBy: ['demo-2', 'demo-3'],
      bookmarks: 89, bookmarkedBy: ['demo-2', 'demo-3'],
      comments: [],
      createdAt: '2024-08-05T09:00:00Z',
      ...randomGradient(),
    },
    {
      id: 'card-5', userId: 'demo-2', username: '背包客阿花', avatar: '👩‍🎨',
      cardData: {
        title: '鼓浪屿慢时光：琴声与海风交织的浪漫',
        location: '厦门鼓浪屿',
        duration: '2-3天',
        budget: '1500-3000元人民币',
        highlights: ['日光岩的绝美日落', '菽庄花园的钢琴博物馆', '龙头路的文艺小店', '环岛路的黄金海岸'],
        tips: ['提前在微信购票，现场排队人多', '穿舒适的鞋，岛上全靠步行', '清晨的鼓浪屿最安静，适合拍照', '海蛎煎和沙茶面必吃'],
        bestTime: '3-5月和10-12月，避开暑期高峰',
        tags: ['厦门旅游', '鼓浪屿', '文艺', '海岛'],
      },
      userCaption: '鼓浪屿的每一条小巷都藏着惊喜，转角就是一家百年老店或一间文艺咖啡馆 ☕🌊',
      likes: 75, likedBy: ['demo-3'],
      bookmarks: 28, bookmarkedBy: [],
      comments: [
        { id: 'c6', userId: 'demo-3', username: '美食旅人', avatar: '👨‍🍳', content: '赵小姐的店的红茶很好喝！', createdAt: '2024-07-20T17:45:00Z' },
      ],
      createdAt: '2024-07-18T14:00:00Z',
      ...randomGradient(),
    },
    {
      id: 'card-6', userId: 'demo-3', username: '美食旅人', avatar: '👨‍🍳',
      cardData: {
        title: '重庆8D魔幻城：火锅与夜景的双重暴击',
        location: '重庆',
        duration: '2-3天',
        budget: '1500-3000元人民币',
        highlights: ['洪崖洞的千与千寻', '解放碑的繁华不夜城', '长江索道的空中穿梭', '磁器口古镇的巴渝风情'],
        tips: ['导航在重庆可能不太靠谱，多问路人', '穿平底鞋！全是坡坡坎坎', '夜景推荐南山一棵树观景台', '洞子火锅是最地道的体验'],
        bestTime: '3-5月和9-11月，避开火炉夏天',
        tags: ['重庆旅游', '火锅', '夜景', '8D城市'],
      },
      userCaption: '在重庆，你永远不知道自己在1楼还是10楼。但每一层都有好吃的！🔥🌃',
      likes: 145, likedBy: ['demo-1', 'demo-2'],
      bookmarks: 56, bookmarkedBy: ['demo-1'],
      comments: [],
      createdAt: '2024-06-12T18:00:00Z',
      ...randomGradient(),
    },
  ]

  localStorage.setItem('followme_users', JSON.stringify(demoUsers))
  localStorage.setItem('followme_cards', JSON.stringify(demoCards))
  localStorage.setItem('followme_seeded', 'true')
}
