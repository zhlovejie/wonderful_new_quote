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
        <a-date-picker
          style="width: 280px; margin-right: 10px"
          mode="year"
          placeholder="请选择年份"
          format="YYYY"
          v-model="yearPick"
          :open="yearPickShow"
          @panelChange="handlePanelChange"
          @openChange="handleOpenChange"
        />
      </a-form-item>
      <a-form-item>
        <a-button class="a-button" type="primary" icon="search" @click="searchAction()">查询</a-button>
      </a-form-item>
    </a-form>

    <v-chart :force-fit="true" :height="height" :data="chartData" :scale="scale">
      <v-tooltip />
      <v-axis />
      <v-legend />
      <v-line position="createdTime*temperature" color="city" />
      <v-point position="createdTime*temperature" color="city" :size="4" :v-style="style" :shape="'circle'" />
    </v-chart>
  </a-modal>
</template>

<script>
import { getFloatingFigure } from '@/api/workBox'
import moment from 'moment'
const DataSet = require('@antv/data-set')
export default {
  name: 'PriceEdit',
  data() {
    return {
      visible: false, // 表单对话框是否可见
      yearPick: null, //年选择器的值
      yearPickShow: false, //年选择器的显示隐藏
      confirmLoading: false,
      searchParam: {},
      record: {},
      dataSource: [],
      scale: [
        {
          dataKey: 'createdTime',
          type: 'timeCat',
        },
      ],
      height: 400,
      style: { stroke: '#fff', lineWidth: 1 },
    }
  },
  computed: {
    chartData() {
      const dv = new DataSet.View().source(this.dataSource)
      dv.transform({
        type: 'fold',
        fields: ['成本价', 'A价', 'B价', 'C价'],
        key: 'city',
        value: 'temperature',
      })
      return dv.rows
    },
  },
  methods: {
    moment,
    async query(record) {
      // 父页面点击修改调用
      this.visible = true
      this.record = record
      this.searchAction()
    },
    // 得到年份选择器的值
    handlePanelChange(value) {
      this.yearPick = value
      this.yearPickShow = false
    },
    handleOpenChange(status) {
      this.yearPickShow = status
    },
    searchAction(opt) {
      if (this.yearPick) {
        this.searchParam.date = moment(this.yearPick).format('YYYY')
      } else {
        this.searchParam = {}
      }
      let _searchParam = Object.assign({ productId: this.record.productId }, { ...this.searchParam }, opt || {})
      getFloatingFigure(_searchParam).then((res) => {
        let { code, data, msg } = res
        if (code !== 200) {
          return
        }
        let arr = []
        let len = Math.max(...[...data.map((item) => item.priceChangeRecordVo.length)])
        console.log(len)
        for (let i = 0; i < len; i++) {
          let obj = {}
          let item = data.map((item) => item.priceChangeRecordVo[i])
          item.map((_item) => {
            if (!obj.createdTime) {
              obj.createdTime = _item.createdTime
            }
            if (_item.priceType === 0) {
              obj[`成本价`] = _item.newPrice
            }
            if (_item.priceType === 1) {
              obj[`A价`] = _item.newPrice
            }
            if (_item.priceType === 2) {
              obj[`B价`] = _item.newPrice
            }
            if (_item.priceType === 3) {
              obj[`C价`] = _item.newPrice
            }
          })
          arr.push(obj)
        }
        this.dataSource = arr
        console.log(this.dataSource)
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
