import {
  all
} from "q"

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome() {
  const arr = [
    "人在一起，不叫团队；心在一起才叫团队。",
    "失败的团队没有成功者，成功的团队成就每一个人！凝聚团队，聚焦目标，为梦想创造无限可能。",
    "一个人如果有自己的信仰，那么无论与谁合作，他的信仰都不会贬值；如果他没有信仰，那么不管他加入到什么团队，都不过是茫茫众生中的一员，终其一生都随波漂流。",
    "团队不是单个人单个人的守护，而是每个人互相守护，这才叫团队。",
    "心往一处使叫团队，力往一处使叫团伙。",
    "一人强，不是强，再强也是一只羊。团队强，才是强，团结起来就是狼，只有团结才有强大的能量，凝聚在一起才是团队！",
    "一支优秀的团队，塑造出优秀团队文化，一个优秀的团队文化，酿造出优秀的人。",
    "不管一个人多么聪明，但是集体常常比他更聪明更有力。",
    "五人团结一只虎，十人团结一条龙，百人团结像泰山。",
    "一致是强有力的，而纷争易于被征服，这就是团队团结的力量。",
    "不管努力的目标是什么，不管他干什么，他单枪匹马总是没有力量的。合群永远是一切善良思想的人的最高需要。",
    "人只有在布满陡峭的路上，才能使自我的脚跟变的更稳；人只有在布满荆棘的路上，才能使自我的身体变的不怕伤痕；人只有在布满危险的路上，才能使自我的战斗力变的无比之强！",
    "团队精神的“三心二意”：信心恒心决心；创意愿意。",
    "真诚的合作，可以丰富彼此的心智，挑战极限;可以壮大势力，昂首阔步地前行;可以相惜相依，风雨同舟;可以多一双有力的手，力挽波澜;可以多一个宽大的翅膀，结实可靠。",
    "要成功，就要时时怀着得意淡然失意坦然的乐观态度，笑对自我的挫折和苦难，去做，去发奋，去争取成功！",
    "认真的分析自我，客观的评价自我，从容的面对自我，奋发的激励自我，勤奋的努力自我，用心的拼搏自我，自信的超越自我，才会演绎人生的精彩!。",
    "面对困难",
    "另一个极端的例子，我在一个权力分散以至于非常混乱的公司里工作过，每个部门都按照自己的想法自行其事。",
    "人生就像参加着一场马拉松比赛，在奔跑的途中懦夫因疲惫而停下了脚步，而强者则凭着坚强的意志，奋力拼搏着各种压力和困难，到达了终点收获了成功。",
    "平庸目标导致平庸团队，平庸团队导致平庸业绩，平庸业绩导致平庸企业，而这一切，都来平庸的思维和平庸的管理！。",
    "单个的人是软弱无力的，就像漂流的鲁滨逊一样，只有同别人在一起，他才能完成许多事业。",
    "这两种环境都无法使工作高效。但是，在一个人们能够获得信任的公司，人们将会付出最大努力。",
    "当恶棍凑合在一起的时候，好人必须联合一致。否则，好人会在这可鄙的斗争中一个一个地被击败，作出无谓的牺牲。",
    "纵使生活中存在着千千万万个困难，但也共存着许许多多的精彩与幸福，我们只有多去挖掘",
    "我知道经过漫长的时间，很难说没有什么成见，很难说是否已经疏远，也很难说有没有机会再次见面，因为我还将面对新的生活，也将迎来崭新的一天。",
    "社会的长足发展需要的就是合作精神，唯有相互之间伸出真诚的手，以诚信的理念建立起人与人的关系我们才能真正让精神世界丰富起来。",
    "千年古都南京，这个城市凝聚了太多的繁华光彩，太多的`颠沛沧桑，厚重得难以想象。",
    "哪一天你若和集体脱离，那便是末路的开始。",
    "眼泪和汗水的化学成分一样，但前者给你带来同情，后者给你带来荣耀。",
    "即使在现代到处都充斥着欺骗的社会，人们依然欣赏诚信",
    "中国人民历来不缺乏团结和奉献精神。正是无数革命先辈流血牺牲才换来了中国的独立，正是全国各族人民的团结奋斗才实现了中国的富强。",
    "团结一致，同心同德，任何强大的敌人，任何困难的环境，都会向我们投降。",
    "一个人总要走陌生的路，看陌生的风景，听陌生的歌，然后在某个不经意的瞬间，你会发现，原本费尽心机想要忘记的事情真的就这么忘记了。",
    "两个聪明人在一起商量，就会生出更好的主张;黄和红的两种颜色混和，就会变出另一种色彩。",
    "最好的教育是以身作则。孩子们对谎言或虚伪非常敏感，极易察觉。如果他们尊重你",
    "生命因追求而精彩，追求因指引而成功，个体因团队而强大!失败的团队没有成功者，成功的团队成就每一个人，当好领头狼，爱她就迫使她成长!",
    "合作的力量是伟大的，成功的合作不仅要有统一的目标，还要有自我牺牲的.精神。如果人人都有一种无私的精神，合作的精神，重视团队的力量，世界将变得何等的美妙!",
    "运动是培养人的体力，增强体魄，激发拼搏争先的斗志，形成合作的团队精神的最好形式。",
    "共识之前非常民主，共识之后绝对独裁。民主是为了决策正确无误，独裁则是培养服从习惯。",
    "个人如果但靠自己，如果置身于集体的关系之外，置身于任何团结民众的伟大思想的范围之外，就会变成怠惰的",
    "一堆沙子是松散的，可是它和水泥",
    "为了达到伟大的目标和团结，为此所必需的千百万大军应当时刻牢记主要的东西，不因那些无谓的吹毛求疵而迷失方向。",
    "为了进行斗争，我们必须把我们的一切力量拧成一股绳，并使这些力量集中在同一个攻击点上。",
    "一滴水飘不起纸片，大海上能航行轮船和军舰；一棵孤树不顶用，一片树林挡狂风……这就是团队精神重要性力量的直观表现，这也是我所理解的团队精神，也是团队精神重要之所在。",
    "我不如起个磨刀石的作用，能使钢刀锋利，虽然它自己切不动什麽。",
    "团队合作在实现既定目标上具有很多优势，有着与其他群体不可替代的作用，这也是团队合作重要之所在。所以我们要学会与他人合作，学会做一只合群的大雁，这样才使得我们的团队能飞得更高更快更远。",
    "凡是经过考验的朋友，就应该把他们紧紧地团结在你的周围。",
    "人的巨大的力量就在这里——觉得自己是在友好的集体里面。",
    "“团结就是力量，团结就是力量，这力量是铁，这力量是钢……”当我们还是孩提时，老师就教我们唱这首《团结就是力量》的歌，而此时此刻，这首歌再次在我的耳边响起，因为我们互换团结，团结无处不在。",
    "不但要团结和自己意见相同的人，而且要善于团结那些和自己意见不同的人，还要善于团结那些反对自己并且已被实践证明是犯了错误的人。"
  ]
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader(callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

/**
 * 产品核价计算ABC价格
 * @param {*} costPrice 成本价
 * @param {*} areaPercentageObj 区域计算用的百分比
 */
export function calculatePrice(costPrice, areaPercentageObj) {
  let _costPrice = parseFloat(costPrice)
  _costPrice = isNaN(_costPrice) ? 0 : _costPrice
  let apriceRate = areaPercentageObj['1'], //a价
    bpriceRate = areaPercentageObj['2'], //b价
    cpriceRate = areaPercentageObj['3'] //c价
  apriceRate = isNaN(parseFloat(apriceRate)) ? 0 : parseFloat(apriceRate)
  bpriceRate = isNaN(parseFloat(bpriceRate)) ? 0 : parseFloat(bpriceRate)
  cpriceRate = isNaN(parseFloat(cpriceRate)) ? 0 : parseFloat(cpriceRate)
  let __a = _costPrice * apriceRate
  let __b = _costPrice * bpriceRate
  let __c = _costPrice * cpriceRate
  __a = isNaN(__a) ? 0 : Number(__a).toFixed(2)
  __b = isNaN(__b) ? 0 : Number(__b).toFixed(2)
  __c = isNaN(__c) ? 0 : Number(__c).toFixed(2)
  return {
    aPrice: __a,
    bPrice: __b,
    cPrice: __c
  }
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

export function companyFormat(company) {
  //单位 0套， 1台， 2个,3块，4条，5根，6张，7卷
  let companyMap = {
    0: '套',
    1: '台',
    2: '个',
    3: '块',
    4: '条',
    5: '根',
    6: '张',
    7: '卷',
  }
  let _company = parseInt(company, 10) || 0
  return companyMap[_company]
}
