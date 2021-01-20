<template>
  <a-modal
    title="波动图"
    :width="960"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-form layout="inline">
      <a-form-item>
        <a-range-picker v-model="sDate" :allowClear="true" />
      </a-form-item>
      <a-form-item>
        <a-button class="a-button" type="primary" icon="search" @click="searchAction()">查询</a-button>
      </a-form-item>
    </a-form>

    <v-chart :force-fit="true" :height="height" :data="sourceData" :scale="scale">
      <v-tooltip />
      <v-axis />
      <v-legend />
      <v-line position="month*temperature" color="city" />
      <v-point position="month*temperature" color="city" :size="4" :v-style="style" :shape="'circle'" />
    </v-chart>
  </a-modal>
</template>

<script>
import { getFloatingFigure } from '@/api/workBox'
const DataSet = require('@antv/data-set')
const sourceData = [
  { month: 'Jan', Tokyo: 7.0, London: 3.9 },
  { month: 'Feb', Tokyo: 6.9, London: 4.2 },
  { month: 'Mar', Tokyo: 9.5, London: 5.7 },
  { month: 'Apr', Tokyo: 14.5, London: 8.5 },
  { month: 'May', Tokyo: 18.4, London: 11.9 },
  { month: 'Jun', Tokyo: 21.5, London: 15.2 },
  { month: 'Jul', Tokyo: 25.2, London: 17.0 },
  { month: 'Aug', Tokyo: 26.5, London: 16.6 },
  { month: 'Sep', Tokyo: 23.3, London: 14.2 },
  { month: 'Oct', Tokyo: 18.3, London: 10.3 },
  { month: 'Nov', Tokyo: 13.9, London: 6.6 },
  { month: 'Dec', Tokyo: 9.6, London: 4.8 },
]
export default {
  name: 'PriceEdit',
  data() {
    return {
      sourceData,
      visible: false, // 表单对话框是否可见
      record: {},
      dataSource: [],
      scale: [
        {
          dataKey: 'month',
          min: 0,
          max: 1,
        },
      ],
      height: 400,
      style: { stroke: '#fff', lineWidth: 1 },
    }
  },
  computed: {
    chartData() {
      // 参考 https://viserjs.github.io/demo.html#/viser/bar/grouped-column
      //   let fields = [...new Set(this.dataSource.map((item) => item.date))]
      //   let _formatChartData = (records) => {
      //     if (!Array.isArray(records)) {
      //       return []
      //     }
      //     if (records.length === 0) {
      //       return []
      //     }
      // let keys = Object.keys(records[0]).filter(
      //   (v) => v !== 'date' && v !== 'key' && v !== 'sumMoney' && v.indexOf('占比%') === -1
      // )
      // let result = []
      // records.map((item) => {
      //   keys.map((k) => {
      //     let target = result.find((item) => item.name === k + '(万元)')
      //     if (target) {
      //       target[`${item.date}`] = +item[k]
      //     } else {
      //       let obj = {}
      //       obj.name = k + '(万元)'
      //       obj[`${item.date}`] = +item[k]
      //       result.push(obj)
      //     }
      //   })
      // })
      // return result
      //   }
      const dv = new DataSet.View().source(_formatChartData(this.dataSource))
      dv.transform({
        type: 'fold',
        fields: fields,
        key: '月份',
        value: '销售金额',
      })
      return dv.rows
    },
  },
  methods: {
    async query(record) {
      // 父页面点击修改调用
      this.visible = true
      this.record = record
      this.searchAction()
    },
    searchAction() {
      getFloatingFigure(this.record).then((res) => {
        let { code, data, msg } = res
        if (code !== 200) {
          return
        }
        let res1 = []
        let len = Math.max([...data.map((item) => item.priceChangeRecordVo.length)])
        console.log(len)
        for (let i = 0; i < len; i++) {
          res.push({
            priceType,
          })
        }
      })
    },
    handleSubmit() {
      this.visible = false
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>

<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
