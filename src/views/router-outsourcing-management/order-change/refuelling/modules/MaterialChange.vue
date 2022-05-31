<template>
  <a-modal
    title="原物料变化"
    :width="1000"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :footer="null"
  >
    <a-spin :spinning="spinning">
      <span class="tip">{{ tip }}</span>
      <a-table :columns="columns" :dataSource="dataSource" :pagination="false">
        <div slot="stateText" slot-scope="text, record">
          <span :class="{ newStyle: record.state === 2, replaceStyle: record.state === 3 }">{{ text }}</span>
        </div>
      </a-table>
    </a-spin>
  </a-modal>
</template>

<script>
import { refuellingDetail } from '@/api/orderChange'

const columns = [
  {
    title: '序号',
    key: 'key',
    dataIndex: 'key'
  },
  {
    title: '原料名称',
    dataIndex: 'materialName'
  },
  {
    title: '原料代码',
    dataIndex: 'materialCode'
  },
  {
    title: '原料规格型号',
    dataIndex: 'specification'
  },
  {
    title: '原料单位（辅单位）',
    dataIndex: 'subUnit'
  },
  {
    title: '单个加工原料量',
    dataIndex: 'needCount'
  },
  {
    title: '所需原料总量',
    dataIndex: 'needCountSum'
  },
  {
    title: '状态',
    dataIndex: 'stateText', //变更后的原材料相较于之前的原材料状态变化：1、原物料 2、新物料 3、被替换
    scopedSlots: { customRender: 'stateText' }
  }
]

export default {
  name: 'outsourcing-order-change-refuelling-materialChange',
  data() {
    return {
      tip: '',
      visible: false,
      spinning: false,
      columns,
      dataSource:[]
    }
  },
  methods: {
    query(type, record) {
      this.visible = true
      const that = this
      refuellingDetail({ id: record.id })
        .then(res => {
          that.spinning = false
          if (res.code === 200) {
            let list = res.data.newSourceList || [] //替换后的原材料
            const { needCount, oldMaterialName, oldMaterialCode, newMaterialName, newMaterialCode } = res.data
            that.tip =
              '原成品物料【' +
              oldMaterialName +
              '(物料代码：' +
              oldMaterialCode +
              ')】,变更为【' +
              newMaterialName +
              '(物料代码：' +
              newMaterialCode +
              ')】'
            that.dataSource = list.map((item, index) => {
              item.key = index + 1
              //变更后的原材料相较于之前的原材料状态变化：1、原物料 2、新物料 3、被替换
              item.stateText = { 1: '原物料', 2: '新物料', 3: '被替换' }[item.state] || '未知'
              item.needCountSum = item.needCount * needCount
              return item
            })
          } else {
            that.$message.error(res.msg)
          }
        })
        .catch(err => {
          that.spinning = false
          that.$message.error(err.message)
        })
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>
<style scoped>
.tip {
  margin-bottom: 16px;
}
.newStyle {
  color: green;
}
.replaceStyle {
  color: red;
}
</style>
