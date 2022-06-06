<template>
  <a-table :columns="columns" :dataSource="dataArr" :pagination="false" size="small">
    <div slot="stateText" slot-scope="text, record">
      <span :class="{ newStyle: record.state === 2, replaceStyle: record.state === 3 }">{{ text }}</span>
    </div>
    <div slot="action" slot-scope="text, record, index">
      <a target="_blank" :href="record.fileUrl">预览</a>
      <a-divider type="vertical" />
      <a v-download="record.fileUrl">下载</a>
      <template v-if="bEdit">
        <a-divider type="vertical" />
        <a type="primary" @click="onDel(index, record)">删除</a>
      </template>
    </div>
  </a-table>
</template>

<script>
const renderContent = (text, record, index) => {
  const obj = {
    children: text,
    attrs: {}
  }
  obj.attrs.rowSpan = 1
  // if (index == 0) {
  //   obj.attrs.rowSpan = 4
  // } else {
  //   obj.attrs.rowSpan = 0
  // }
  return obj
}

const columns = [
  {
    title: '序号',
    key: 'key',
    width: '70px',
    dataIndex: 'key'
  },
  {
    title: '属性',
    dataIndex: 'propertiesDicName',
    customRender: renderContent
  },
  {
    title: '文件名称',
    dataIndex: 'fileName'
  },
  {
    align: 'center',
    title: '操作',
    width: '220px',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  },
  {
    title: '状态',
    width: '130px',
    dataIndex: 'stateText',
    scopedSlots: { customRender: 'stateText' }
  }
]

export default {
  name: 'outsourcing-order-change-craft-parameter',
  props: {
    list: {
      type: Array,
      required: true,
      default: function() {
        return []
      }
    },
    bEdit: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      columns
    }
  },
  computed: {
    dataArr() {
      //相同的属性合并行显示
      //[{fileUrl: "http://22",propertiesDicCode: "002",propertiesDicId: 2,propertiesDicName: "文件2",state: 3}]
      let arr = this.list.map((item, index) => {
        item.key = index + 1
        //变更后的参数相较于之前的参数状态变化：1、原参数 2、新参数 3、被替换
        item.stateText = { 1: '原参数', 2: '新参数', 3: '被替换' }[item.state] || '未知'
        // let subIndex = item.fileUrl.lastIndexOf('//')
        //item.fileName = item.fileUrl.substring(subIndex + 2, item.fileUrl.length) //截取fileURL//后的字符
        return item
      })
      return arr
    }
  },
  methods: {
    //删除
    onDel(index, record) {
      this.$emit('delete', index, record)
    }
  }
}
</script>
<style scoped>
.newStyle {
  color: green;
}
.replaceStyle {
  color: red;
}
</style>
