<template>
  <a-table :columns="columns" :dataSource="list" :pagination="false">
        <div slot="stateText" slot-scope="text, record">
          <span :class="{ newStyle: record.state === 2, replaceStyle: record.state === 3 }">{{ text }}</span>
        </div>
        <div slot="action" slot-scope="text, record">
            <a target="_blank" :href="viewFormat(record)">预览</a>
            <a-divider type="vertical" />
            <a v-download="record.fileUrl">下载</a>
        </div>
  </a-table>
</template>

<script>
const columns = [
  {
    title: '序号',
    key: 'key',
    width:'70px',
    dataIndex: 'key'
  },
  {
    title: '属性',
    dataIndex: 'propertiesDicName'
  },
  {
    title: '文件名称',
    dataIndex: 'fileName'
  },
  {
    align: 'center',
    title: '操作',
    width:'200px',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  },
  {
    title: '状态',
    width:'150px',
    dataIndex: 'stateText',
    scopedSlots: { customRender: 'stateText' }
  }
]

export default {
  name: 'outsourcing-order-change-craft-parameter',
  props: {
    list: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      columns,
      list:[]
    }
  },
  methods: {
    async query(list) {
      this.list = { ...list }
    }, 
    //预览
     viewFormat(record){
      let url = String(record.fileUrl)
      let isWord = url => ['.doc','.docx','.xls','.xlsx'].some(suffix => url.endsWith(suffix))
      let isPdf = url => url.endsWith('.pdf')
      let isImage = url => ['.png','.jpg','jpeg','.gif','.bmp'].some(suffix => url.endsWith(suffix))
      if(url){
        if(isPdf(url) || isImage(url)){
          return url
        }else if(isWord){
          return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`
        }
      }
      return '#'
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
