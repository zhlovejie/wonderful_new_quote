<template>
  <a-modal
    title="原工序变化"
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
      <Parameter ref="parameter" :list="parameterList"></Parameter>
    </a-spin>
  </a-modal>
</template>

<script>
import { craftDetail } from '@/api/orderChange'
import Parameter from './Parameter.vue'

const columns = [
  {
    title: '序号',
    key: 'key',
    width: '70px',
    dataIndex: 'key'
  },
  {
    title: '工作中心部门',
    dataIndex: 'workshopName'
  },
  {
    title: '工序名',
    dataIndex: 'processName'
  },
  {
    title: '工序代码',
    dataIndex: 'processCode'
  },
  {
    title: '时长（秒）',
    dataIndex: 'duration'
  },
  {
    title: '人工费（元）',
    width: '150px',
    dataIndex: 'personCost'
  },
  {
    title: '状态',
    width: '150px',
    dataIndex: 'stateText', //变更后的原材料相较于之前的原材料状态变化：1、原物料 2、新物料 3、被替换
    scopedSlots: { customRender: 'stateText' }
  }
]

export default {
  name: 'outsourcing-order-change-craft-materialChange',
  data() {
    return {
      tip: '',
      visible: false,
      spinning: false,
      columns,
      dataSource: [], //替换后的工序
      parameterList: [] //替换后的参数
    }
  },
  components: {
    Parameter
  },
  methods: {
    query(type, record) {
      this.visible = true
      const that = this
      craftDetail({ id: record.id })
        .then(res => {
          that.spinning = false
          if (res.code === 200) {
            //替换后的原材料
            const { oldMaterialName, oldMaterialCode, newMaterialName, newMaterialCode } = res.data
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
            //替换后的工序
            that.dataSource = res.data.newCraftList.map((item, index) => {
              item.key = index + 1
              //变更后的工序相较于之前的工序状态变化：1、原工序 2、新工序 3、被替换
              item.stateText = { 1: '原工序', 2: '新工序', 3: '被替换' }[item.state] || '未知'
              return item
            })
            //替换后的参数/属性
            that.parameterList = res.data.newParameterList.map((item, index) => {
              item.key = index + 1
              //变更后的参数相较于之前的参数状态变化：1、原参数 2、新参数 3、被替换
              item.stateText = { 1: '原参数', 2: '新参数', 3: '被替换' }[item.state] || '未知'
              let subIndex = item.fileUrl.lastIndexOf('//')
              item.fileName = item.fileUrl.substring(subIndex + 2, item.fileUrl.length) //截取fileURL//后的字符
              return item
            })
            that.$refs.parameter.query(that.parameterList)
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
    },
    //预览
    viewFormat(record) {
      let url = String(record.fileUrl)
      let isWord = url => ['.doc', '.docx', '.xls', '.xlsx'].some(suffix => url.endsWith(suffix))
      let isPdf = url => url.endsWith('.pdf')
      let isImage = url => ['.png', '.jpg', 'jpeg', '.gif', '.bmp'].some(suffix => url.endsWith(suffix))
      if (url) {
        if (isPdf(url) || isImage(url)) {
          return url
        } else if (isWord) {
          return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`
        }
      }
      return '#'
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
