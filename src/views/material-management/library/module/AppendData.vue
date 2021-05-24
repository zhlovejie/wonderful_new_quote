<template>
  <div>
    <h3 style="overflow:hidden;">
      <span
        style="float:right;"
        v-if="normalAddForm.isAdd || normalAddForm.isEdit"
      >
        <UploadFile
          key="AppendData"
          ref="uploadFile"
          :config="uploadConfig"
          @change="fileChange"
        />
      </span>
    </h3>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
      size="middle"
      style="margin-top:10px;"
    >
      <div
        slot="order"
        slot-scope="text, record, index"
      >
        <span>{{ index + 1 }}</span>
      </div>

      <div
        slot="action"
        slot-scope="text, record"
      >
        <a
          type="primary"
          @click="doAction('view',record)"
        >查看</a>
        <template v-if="normalAddForm.isEdit">
          <a-divider type="vertical" />
          <a
            type="primary"
            @click="doAction('del',record)"
          >删除</a>
        </template>
      </div>
    </a-table>
  </div>
</template>

<script>
import moment from 'moment'
import UploadFile from './UploadFile'
const columns = [
  {
    align: 'center',
    title: '文件名称',
    dataIndex: 'fileName'
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName'
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime'
  },
  {
    align: 'center',
    title: '修改时间',
    dataIndex: 'modifyTime'
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

import {
  routineMaterialAccessoryDelete,
  productMaterialAccessoryDelete
} from '@/api/routineMaterial'

let uuid = () =>
  Math.random()
    .toString(32)
    .slice(-10)
export default {
  name: 'AppendData',
  components: {
    UploadFile
  },
  inject: ['normalAddForm'],
  data() {
    return {
      loading:false,
      columns,
      dataSource: [],
      detail: {},
      uploadConfig: {
        maxFileCount: 100,
        fileType: 'file', // file img
        enableCompress: false,
        enablePreview: false,
        showFileList: false,
        fileValidate: () => true,
        btn: {
          text: '上传',
          attr: {
            icon: 'upload',
            type: 'primary'
          }
        }
      },
      userInfo: this.$store.getters.userInfo // 当前登录人
    }
  },
  created() {
    const that = this
    let accessory = that.normalAddForm.submitParams.accessory
    if (accessory) {
      that.dataSource = accessory.map(item => {
        let uuid = uuid()
        item.key = uuid
        item.uid = uuid
        item.url = item.fileUrl
        return item
      })
      that.$nextTick(() => {
        that.$refs.uploadFile && that.$refs.uploadFile.setFiles([...that.dataSource])
      })
    }else{
      that.$nextTick(() => {
        that.$refs.uploadFile && that.$refs.uploadFile.setFiles([...that.dataSource])
      })
    }
  },
  methods: {
    moment,
    doAction(type, record) {
      const that = this
      if (type === 'view') {
        that.$message.info('暂不支持预览')
        return
      } else if (type === 'del') {
        let _api_del = that.normalAddForm.isNormal ? routineMaterialAccessoryDelete : productMaterialAccessoryDelete
        if(record.id){
          that.loading = true
          _api_del({id:record.id}).then(res => {
            that.loading = false
            that.$message.info(res.msg)
            if(+res.code === 200){
              that.dataSource = that.dataSource.filter(item => item.key !== record.key)
              that.$refs.uploadFile && that.$refs.uploadFile.setFiles([...that.dataSource])
              that.updateData()
            }
          }).catch(err =>{
            that.loading = false
            that.$message.error(err)
          })
        }else{
          that.dataSource = that.dataSource.filter(item => item.key !== record.key)
          that.$refs.uploadFile && that.$refs.uploadFile.setFiles([...that.dataSource])
          that.updateData()
        }
        return
      }
    },
    fileChange(files) {
      const that = this
      let dataSource = [...that.dataSource]
      let keys = dataSource.map(item => item.key)
      let filesForAdd = files.filter(f => f && f.status === 'done' && keys.includes(f.uid))

      filesForAdd.map(f => {
        let _time = that.moment().format('YYYY-MM-DD HH:mm:ss')
        let _uid = uuid()
        dataSource.push({
          key: _uid,
          fileName: f.name,
          fileUrl: f.url,
          createdName: that.userInfo.trueName,
          createdTime: _time,
          modifyTime: _time,
          uid: _uid,
          url:f.url
        })
      })
      that.dataSource = dataSource
      that.updateData()
    },
    updateData() {
      const that = this
      let id = that.normalAddForm.getId()
      that.normalAddForm.submitParams.accessory = [...that.dataSource].map(item => {
        return { ...item, materialId: id }
      })
    }
  }
}
</script>

<style scoped>
</style>
