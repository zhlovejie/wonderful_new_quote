<template>
  <a-card
    :bordered="false"
    class="product-offer-management-control-system-options"
  >
    <div class="wrapper">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        @expand="expandHandler"
        :expandedRowKeys="expandedRowKeys"
        class="components-table-demo-nested"
        :customRow="customRowFunction"
        :pagination="false"
      >
        <div slot="order" slot-scope="text, record, index">
          <span style="font-size: 20px">{{ index + 1 }}</span>
        </div>
        <div slot="commissionRate" slot-scope="text, record, index">
          <span style="font-size: 20px">{{ text }}</span>
        </div>
        <div slot="price" slot-scope="text, record, index">
          <span style="font-size: 20px">{{ text }}</span>
        </div>
        <div slot="intervalValueName" slot-scope="text, record, index">
          <span style="font-size: 20px">{{ text }}</span>
        </div>
        <a-table
          slot="expandedRowRender"
          slot-scope="record, text"
          size="small"
          :columns="innerColumns"
          :dataSource="record.innerData"
          :pagination="false"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
        </a-table>
      </a-table>
    </div>
    <p style="text-align:center;margin-top:20px;">
      <a-button
        type="primary"
        @click="stepAction('prev')"
      >上一步</a-button>
      <a-button
        type="primary"
        @click="stepAction('next')"
        style="margin-left:10px;"
      >下一步</a-button>
    </p>
  </a-card>
</template>
<script>
import { priceAdjustProductQuoteDownload, productEvaluation } from '@/api/productOfferManagement'
import { typeConfigDetail } from '@/api/productOfferManagement'
const innerColumns = [
  {
    align: 'center',
    title: '序号',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '区间值名称',
    dataIndex: 'intervalValueName',
  },
  {
    align: 'center',
    title: '提成比率',
    dataIndex: 'commissionRate',
  },
  {
    align: 'center',
    title: '销售价格',
    dataIndex: 'price',
  },
];
const columns = [
  {
    align: 'center',
    title: '序号',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '区间值名称',
    dataIndex: 'intervalValueName',
    scopedSlots: { customRender: 'intervalValueName' },
  },
  {
    align: 'center',
    title: '提成比率',
    dataIndex: 'commissionRate',
    scopedSlots: { customRender: 'commissionRate' },
  },
  {
    align: 'center',
    title: '销售价格',
    dataIndex: 'price',
    scopedSlots: { customRender: 'price' },
  },
];
export default {
  inject:['addForm'],
  data() {
    return {
      columns,
      innerColumns,
      dataSource:[],
      expandedRowKeys: [],
    }
  },
  watch:{
    'addForm.currentStep':{
      handler(val, oldVal){
        if(val === 4){
          this.init()
        }
      },
      deep:true
    }
  },

  methods: {
    init() {
      const that = this

      let {
        step1:productsPath,
        step2:controls,
        step3:stands,
        step4:choices,
        productSeries,
        productName,
        productTypeConfigId,
        productTypeConfigName
      } = that.addForm.form

      let {optStandItems,optChoiceItems} = controls

      let items = [optStandItems,optChoiceItems,stands.items,choices.items]
      let {allOptionsList} = that.addForm

      let allNodes = items.map(nodes => that.getNodes(nodes)).flat(Infinity)
      let result = allNodes.map(node => {
        debugger
        let target = allOptionsList.find(opt => opt.id === node.itemConfigId)
        console.log(node,target)
        if(target){
          return Number(target.price) || 0
        }
        return 0
      })
      that.sumPrice = result.reduce((p1,p2) => p1 + p2 ,0)

      that.assessment(productTypeConfigId,that.sumPrice)
    },
    stepAction(type) {
      const that = this
      if (type === 'next') {
        that.$emit('change', 'step5', 'next', null)
      } else if (type === 'prev') {
        that.$emit('change', 'step5', 'prev', null)
      }
    },
    expandHandler(expanded, record) {
      console.log(arguments)
      const that = this
      if (expanded) {
        that.expandedRowKeys = [...that.expandedRowKeys, record.key]
        productEvaluation({
          rangeId: record.rangeId,
          id: that.productTypeConfigId,
          sumPrice: that.sumPrice,
        }).then((res) => {
          if (res.code === 200) {
            let react = that.dataSource.find((item) => item.key === record.key)
            react.innerData = res.data
          } else {
            that.$message.error(res.msg)
          }
        })
      } else {
        that.expandedRowKeys = that.expandedRowKeys.filter((val) => val !== record.key)
      }
    },
    customRowFunction(record) {
      //rateType 1 总区间 蓝色  2 推荐区间 黄色 3竞争力区间 红色
      let { rateType } = record
      return {
        style: {
          'background-color': rateType === 1 ? '#E6F7FF ' : +rateType === 2 ? '#FFFBE6' : '#FFF1F0',
        },
      }
    },
    assessment(id,sumPrice) {
      productEvaluation({ id, sumPrice }).then((res) => {
        if (res.code === 200) {
          this.dataSource = res.data.map((item, index) => {
            item.key = index + 1
            item.innerData = []
            return item
          })
          this.expandedRowKeys = that.dataSource.map((item) => item.key) || []
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    getNodes(nodes) {
      let arr = []
      const f = n => {
        if(n.itemConfigType === 1){
          arr.push({...n})
        }
        if (Array.isArray(n.childrenList) && n.childrenList.length > 0) {
          n.childrenList = n.childrenList.map(node => f(node))
        }
        return n
      };
      nodes.map(n => f(n))

      return arr
    },
  }
}
</script>

<style scoped>
</style>

