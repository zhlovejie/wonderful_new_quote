<template>
  <a-spin :spinning="spinning">
  <div class="monitor-index-wrapper">
    <div class="bar-chart" :style="{minHeight:height+'px'}">
      <a-row :gutter=20>
        <a-col :span=8 :style="{borderRight:'1px solid #eee'}">
          <span class="title-tag first-tag">CPU</span>
          <template v-if="cpuData.length > 0">
            <v-chart :forceFit="true" :height="height" :data="cpuData" :scale="scale" :padding="padding">
              <v-tooltip :showTitle="false" dataKey="item*percent" />
              <v-axis />
              <v-legend dataKey="item" />
              <v-pie position="percent" color="item" :v-style="pieStyle" :label="labelConfig" />
              <v-coord type="theta" />
            </v-chart>
            <p class="pie-desc"></p>
          </template>
          <template v-else>
            <p class="pie-desc" :style="{height:height+'px',lineHeight:height+'px',color:'#999'}">暂无数据</p>
          </template>
        </a-col>
        <a-col :span=8 :style="{borderRight:'1px solid #eee'}">
          <span class="title-tag">内存</span>
          <template v-if="memoryData.length > 0">
            <v-chart :forceFit="true" :height="height" :data="memoryData" :scale="scale" :padding="padding">
              <v-tooltip :showTitle="false" dataKey="item*percent" />
              <v-axis />
              <v-legend dataKey="item" />
              <v-pie position="percent" color="item" :v-style="pieStyle" :label="labelConfig" />
              <v-coord type="theta" />
            </v-chart>
            <p class="pie-desc">
              <span>总计内存：{{memSum}}</span>
              <span>运行内存：{{memUse}}</span>
            </p>
          </template>
          <template v-else>
            <p class="pie-desc" :style="{height:height+'px',lineHeight:height+'px',color:'#999'}">暂无数据</p>
          </template>
        </a-col>
        <a-col :span=8>
          <span class="title-tag">硬盘</span>
          <template v-if="diskData.length > 0">
            <v-chart :forceFit="true" :height="height" :data="diskData" :scale="scale" :padding="padding">
              <v-tooltip :showTitle="false" dataKey="item*percent" />
              <v-axis />
              <v-legend dataKey="item" />
              <v-pie position="percent" color="item" :v-style="pieStyle" :label="labelConfig" />
              <v-coord type="theta" />
            </v-chart>
            <p class="pie-desc">
              <span>总硬盘空间：{{diskSum}}</span>
              <span>已使用空间：{{diskUse}}</span>
            </p>
          </template>
          <template v-else>
            <p class="pie-desc" :style="{height:height+'px',lineHeight:height+'px',color:'#999'}">暂无数据</p>
          </template>
        </a-col>
      </a-row>
    </div>
    <div class="line-chart" :style="{minHeight:height+'px'}">
      <a-row>
        <a-col>
          <h3 style="text-align:center;padding:20px 0;margin-bottom:20px;background-color: #f9f9f9;">在线人数监控</h3>
          <div class="search-wrapper">
            <span class="online-tips">当前在线&nbsp;&nbsp;移动端&nbsp;{{onlinePerson.onlineNumberPhone}}&nbsp;人&nbsp;&nbsp;PC端&nbsp;{{onlinePerson.onlineNumberPc}}&nbsp;人</span>
            <a-date-picker  format="YYYY-MM-DD" v-model="onlineDate"/>
            <a-button style="margin-left:10px;" type="primary" icon="search" @click="search">查询</a-button>
          </div>
          <template v-if="lineData.length > 0">
            <v-chart :forceFit="true" :height="height" :data="lineData" :scale="lineScale" :padding="padding">
              <!-- <v-legend :offsetY="-7" /> -->
              <v-tooltip />
              <v-axis />
              <!-- <v-line position="time*在线人数" /> -->
              <v-line position="time*persons" color="onlineNumber" />
              <!-- <v-point position="time*persons" shape="circle" /> -->
              <v-guide
                type="dataMarker"
                :position="markerPosition"
                :content="markerContent"
                :style="style"
              >
              </v-guide>

              <v-guide
                type="dataMarker"
                :position="markerMinPosition"
                :content="markerMinContent"
                :style="style"
              >
              </v-guide>

              <!-- <v-guide
                type="line"
                :top="true"
                :start="lineAvgOpt.startPosition"
                :end="lineAvgOpt.endPosition"
                :lineStyle="lineAvgOpt.lineStyle"
                :text="lineAvgOpt.text"
              ></v-guide> -->

            </v-chart>
          </template>
          <template v-else>
            <p class="pie-desc" :style="{height:height+'px',lineHeight:height+'px',color:'#999'}">暂无 {{onlineDate.format('YYYY-MM-DD')}} 的数据</p>
          </template>

        </a-col>
      </a-row>
    </div>
  </div>
  </a-spin>
</template>
<script>
import {getServerInfo, getOnlineUser} from '@/api/system/monitor'
import moment from 'moment'
const DataSet = require('@antv/data-set');
const scale = [{
  dataKey: 'percent',
  min: 0,
  max:100,
  formatter: '.2%',
}];

const style = {
  text: {
    fontSize: 12
  }
}

export default {
  name:'monitorIndex',
  data(){
    return {
      style:style,
      memoryData:[],
      cpuData:[],
      diskData:[],
      scale:scale,
      height: 300,
      pieStyle: {
        stroke: "#fff",
        lineWidth: 2
      },
      labelConfig: ['percent', {
        formatter: (val, item) => {
          return item.point.item + ' ' + val;
        }
      }],
      lineData:[],
      lineScale:[],
      onlineDate:moment(),
      onlinePerson:{
        onlineNumberPhone:0,
        onlineNumberPc:0
      },
      padding:[50,50,50,80],
      memSum:0,
      memUse:0,
      memRate:0,
      diskSum:'0GB',
      diskUse:'0GB',
      diskRate:0,
      spinning:false,
      markerPosition:[0,0],
      markerContent:'',
      markerMinPosition:[0,0],
      markerMinContent:'',
      lineAvgOpt:{
        startPosition:[0,0],
        endPosition:[0,0],
        lineStyle:{
          stroke: '#999',
          lineWidth: 1,
          lineDash: [3, 3]
        },
        text:{
          position: 'start',
          style: {
            fill: '#8c8c8c',
            fontSize: 12,
            fontWeight: 300
          },
          content: '均值线',
          offsetY: -5
        }
      }
    }
  },
  mounted(){
    this.init()
  },
  methods:{
    async init(){
      let that = this
      that.spinning = true
      let {MEM,CPU,DISK} = await this.fetchServeData()
      if(CPU){
        let sourceCpuData = [
          { item: '系统使用率', count: parseFloat(CPU['cpuSy']) || 0},
          { item: '用户使用率', count: parseFloat(CPU['cpuUs']) || 0},
          { item: '当前空闲率', count: parseFloat(CPU['cpuId']) || 0}
        ]
        this.cpuData = new DataSet.View()
          .source(sourceCpuData)
          .transform({type: 'percent',field: 'count',dimension: 'item',as: 'percent'})
          .rows
      }else{
        this.cpuData = []
      }
      if(MEM){
        let sourceMemData = [
          { item: '缓存', count: parseFloat(MEM['memCa']) || 0},
          { item: '运行内存', count: parseFloat(MEM['memUs']) || 0},
          { item: '剩余内存', count: parseFloat(MEM['memSp']) || 0}
        ]

        this.memSum = this.formatSize((parseInt(MEM['memSum']) || 0) * 1024)
        this.memUse = this.formatSize((parseInt(MEM['memUs']) || 0) * 1024)
        // this.memRate = (parseFloat(MEM['memUs']) / parseFloat(MEM['memSum']) * 100)
        // this.memRate = isNaN(this.memRate) ? 0 : this.memRate
        // this.memRate = this.memRate.toFixed(2)
        //MEM['memSum']
        this.memoryData = new DataSet.View()
          .source(sourceMemData)
          .transform({type: 'percent',field: 'count',dimension: 'item',as: 'percent'})
          .rows
      }else{
        this.memoryData = []
      }
      if(DISK){
        let sourceDiskData = [
          { item: '可用', count: parseFloat(DISK['diskSp']) || 0},
          { item: '已用', count: parseFloat(DISK['diskUs']) || 0}
        ]
        this.diskSum = DISK['diskSum']+'GB'
        this.diskUse = DISK['diskUs'] +'GB'
        this.diskData = new DataSet.View()
          .source(sourceDiskData)
          .transform({type: 'percent',field: 'count',dimension: 'item',as: 'percent'})
          .rows
      }else{
        this.diskData = []
      }
      await this.search()
      that.spinning = false
    },
    //生成系统在线人数模拟数据
    makeData(){
      let data = []
      for(let i=0;i<24;i++){
        data.push({time:('0'+i).slice(-2)+':00','在线人数':random()})
      }
      return data
      function random(){
        return Math.floor(Math.random() * 100)
      }
    },
    makeDataTest(){
      let _random = (n) =>Math.floor(Math.random() * n)
      while(true){
        let n1 = _random(100),n2 = _random(100),n3 = _random(100)
        if((n1 + n2 + n3) === 100){
          return [n1,n2,n3]
        }
      }
    },
    makePieData(){
      let res = this.makeDataTest()
      let sourceData = [
        { item: '系统使用率', count: res[0] },
        { item: '用户使用率', count: res[1] },
        { item: '当前空闲率', count: res[2] }
      ]

      const dv = new DataSet.View().source(sourceData);
      dv.transform({
        type: 'percent',
        field: 'count',
        dimension: 'item',
        as: 'percent'
      })

      return dv.rows
    },
    fetchData(){
      let _onlineDate = this.onlineDate
    },
    fetchServeData(){
      return getServerInfo().then(res => res.data).catch(err=>{
        console.log(err)
        return {}
      })
    },
    fetchOnlineData(){
      let _date = this.onlineDate.format('YYYY-MM-DD')
      return getOnlineUser({date:_date}).then(res => res.data).catch(err=>{
        console.log(err)
        return []
      })
    },
    async search(){
      this.spinning = true
      let onlineDate = await this.fetchOnlineData()
      console.log(onlineDate)
      /*
      {"code":200,"msg":"操作成功","data":[{"date":"2019-12-04 01:17:34","onlineNumberPhone":10,"onlineNumberPc":20},{"date":"2019-12-04 02:18:00","onlineNumberPhone":5,"onlineNumberPc":10},{"date":"2019-12-04 03:19:54","onlineNumberPhone":5,"onlineNumberPc":10},{"date":"2019-12-04 04:20:09","onlineNumberPhone":6,"onlineNumberPc":8},{"date":"2019-12-04 05:20:23","onlineNumberPhone":7,"onlineNumberPc":9}]}
      */
      //onlineDate = [{"date":"2019-12-04 01:17:34","onlineNumberPhone":10,"onlineNumberPc":20},{"date":"2019-12-04 02:18:00","onlineNumberPhone":5,"onlineNumberPc":10},{"date":"2019-12-04 03:19:54","onlineNumberPhone":5,"onlineNumberPc":10},{"date":"2019-12-04 04:20:09","onlineNumberPhone":6,"onlineNumberPc":8},{"date":"2019-12-04 05:20:23","onlineNumberPhone":7,"onlineNumberPc":9}]

      //生成测试数据
      // onlineDate = _testData()
      // function _testData(){
      //   let data = []
      //   for(let i=0;i<24;i++){
      //     data.push({date:'2019-12-04 '+(('0'+i).slice(-2))+':00:00',onlineNumberPhone:random(),onlineNumberPc:random()})
      //   }
      //   return data
      //   function random(){
      //     return Math.floor(Math.random() * 100)
      //   }
      // }

      //onlineDate
      if(onlineDate.length > 0){
        //处理数据
        let _first = onlineDate[0]
        let _last = onlineDate[onlineDate.length - 1]
        //onlinePerson.onlineNumberPhone
        //onlinePerson.onlineNumberPc
        //this.onlinePerson = '&nsbsp;&nsbsp;移动端：'+parseInt(_last.onlineNumberPhone)+'&nsbsp;&nsbsp;PC端：'+parseInt(_last.onlineNumberPc)
        this.onlinePerson = _last
        let sourceLineData = onlineDate.map(item =>{
          return {
            time:item.date.slice(-8,-3),
            date:item.date,
            '移动端':parseInt(item.onlineNumberPhone),
            '电脑端':parseInt(item.onlineNumberPc),
            all:parseInt(item.onlineNumberPhone) + parseInt(item.onlineNumberPc)
          }
        })
        //辅助平均线设置
        let _all = sourceLineData.reduce((calc,current) =>calc + parseInt(current.all),0)
        let _avg = parseInt( _all / sourceLineData.length / 2)
        this.lineAvgOpt.startPosition = [_first.date.slice(-8,-3),_avg]
        this.lineAvgOpt.endPosition = [_last.date.slice(-8,-3),_avg]
        this.lineAvgOpt.text.content = `平均在线人数：${_avg * 2}`
        this.lineAvgOpt = Object.assign({},this.lineAvgOpt)
        //最高，最低在线人数 标记设置
        const {maxMobile, maxPC} = this.findMax(sourceLineData)
        //console.log(maxMobile, maxPC)
        this.markerPosition = [maxMobile.time,maxMobile['移动端']]
        this.markerContent = '移动端最高在线人数：'+maxMobile['移动端']+'人'
        this.markerMinPosition = [maxPC.time,maxPC['电脑端']]
        this.markerMinContent = 'PC端最高在线人数：'+maxPC['电脑端']+'人'
        //设置数据渲染
        this.lineData = new DataSet.View()
          .source(sourceLineData)
          .transform({type: 'fold',fields:['移动端','电脑端'],key:'onlineNumber',value:'persons'})
          .rows
      }else{
        this.lineData = []
      }
      this.spinning = false
    },
    //格式化size显示
    formatSize(b,times=0){
      if(b>1024){
          let temp = b / 1024;
          return this.formatSize(temp,times+1);
      }else{
          let unit='B';
          switch(times){
              case 0:unit='B';break;
              case 1:unit='KB';break;
              case 2:unit='MB';break;
              case 3:unit='GB';break;
              case 4:unit='TB';break;
              case 5:unit='PB';break;
              case 6:unit='EB';break;
              case 7:unit='ZB';break;
              default: unit='单位未知';
          }
          return `${b.toFixed(2)}${unit}`;
      }
    },
    findMaxMin(data){
      var maxValue = 0;
      var minValue = 50000;
      var maxObj = null;
      var minObj = null;
      for (var i = 0; i < data.length; i++) {
        var d = data[i];
        if (d.all > maxValue) {
          maxValue = d.all;
          maxObj = d;
        }
        if (d.all < minValue) {
          minValue = d.all;
          minObj = d;
        }
      }
      return {
        max: maxObj,
        min: minObj
      }
    },
    findMax(data){
      var maxMobileValue = 0;
      var maxPCValue = 0;
      var maxMobileObj = null;
      var maxPCObj = null;
      for (var i = 0; i < data.length; i++) {
        var d = data[i];
        if (d['移动端'] >= maxMobileValue) {
          maxMobileValue = d['移动端'];
          maxMobileObj = d;
        }
        if (d['电脑端'] >= maxPCValue) {
          maxPCValue = d['电脑端'];
          maxPCObj = d;
        }
      }
      return {
        maxMobile: maxMobileObj,
        maxPC: maxPCObj
      }
    },
    formatHtmlContent(title,items){
      console.log(arguments)
      return '<span>123</span>'
    }
  }
}
</script>

<style scoped>
  .monitor-index-wrapper{
    background-color: #fff;
    padding: 40px 20px 20px 0;
  }

  .monitor-index-wrapper .title-tag {
    position: absolute;
    top: 0;
    left: 20px;
    font-size: 150%;
  }
  .monitor-index-wrapper .title-tag.first-tag {
    left: 30px;
  }

  .monitor-index-wrapper .search-wrapper{
    margin-left: 50px;
    margin-bottom: 30px;
  }
  .monitor-index-wrapper .search-wrapper .online-tips{
    font-style: normal;
    margin-right: 50px;
  }

  .monitor-index-wrapper .pie-desc{
    text-align: center;
    height: 30px;
    line-height: 30px;
  }
  .monitor-index-wrapper .pie-desc span{
    margin: 0 7px;
  }

  /* .monitor-index-wrapper >>> canvas[id^='canvas']{
    width: 100% !important;
  } */
</style>
