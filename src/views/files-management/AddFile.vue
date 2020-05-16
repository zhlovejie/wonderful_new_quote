<template>
  <a-modal
    :title="modalTitle"
    :width="450"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form class="add-file-form-wrapper">
        <a-form-item
          label="文件"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <UploadFile ref="uploadFile" style="width:100%;" />
        </a-form-item>
        <a-form-item
          label="查看权限"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-tree-select
            v-model="authoritySaveBoList"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            placeholder="选择权限"
            tree-checkable
            :show-checked-strategy="SHOW_PARENT"
            :load-data="onLoadData"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  departmentList, //所有部门
  getStationList //获取部门下面的岗位
} from '@/api/systemSetting'
import { docFileAddOrUpdate } from '@/api/files-management'
import UploadFile from './UploadFile'

import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT

let uuid = function() {
  return Math.random()
    .toString(32)
    .slice(-10)
}

export default {
  name: 'AddFile',
  components: {
    UploadFile
  },
  data() {
    return {
      visible: false,
      spinning: false,
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      depSelectDataSource: [],
      postSelectDataSource: [],
      record: {},
      type: 'add',
      authoritySaveBoList: [],
      SHOW_PARENT,
      treeData: []
    }
  },
  computed: {
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    modalTitle() {
      return this.isAdd ? '新增' : '修改'
    }
  },
  methods: {
    init() {
      let that = this
      let queue = []
      let task1 = departmentList().then(res => {
        that.treeData = res.data.map(item => {
          let _uuid = uuid()
          return {
            id: item.id,
            key: _uuid,
            value: _uuid,
            title: item.departmentName,
            isLeaf: false
          }
        })
      })
      queue.push(task1)

      return Promise.all(queue)
    },
    async query(type, record) {
      let that = this
      that.type = type
      that.record = Object.assign({}, record)
      that.visible = true
      that.authoritySaveBoList = []

      await that.init()

      that.$refs.uploadFile && that.$refs.uploadFile.setFiles([])

      if (that.isEdit) {
        that.$refs.uploadFile &&
          that.$refs.uploadFile.setFiles([
            {
              url: that.record.record.filePath,
              fileName: that.record.record.fileName
            }
          ])
        let authoritySaveBoList = that.record.record.authoritySaveBoList
        let queue = []
        let __authoritySaveBoList = []
        authoritySaveBoList.map(auth => {
          let target = that.treeData.find(item => item.id === auth.departmentId)
          if (target) {
            queue.push(
              that.onLoadData({
                dataRef: {
                  id: target.id,
                  value: target.value
                }
              })
            )
          }
        })
        await Promise.all(queue)
        authoritySaveBoList.map(auth => {
          let target = that.treeData.find(item => item.id === auth.departmentId)
          if (auth.stationIds) {
            auth.stationIds.split(',').map(v => {
              let _target = target.children.find(item => +item.id === +v)
              if (_target) {
                __authoritySaveBoList.push(_target.value)
              }
            })
          } else {
            __authoritySaveBoList.push(target.value)
          }
        })
        that.authoritySaveBoList = __authoritySaveBoList
        return
      }
    },
    handleSubmit() {
      let that = this
      let files = that.$refs.uploadFile.getFiles()
      if (files.length === 0) {
        that.$message.info('您还没有上传文件')
        return
      }
      const formData = new FormData()
      that.isEdit && formData.append('id', that.record.record.id)
      let _auth = that.makeAuth()
      _auth.map((item, index) => {
        if (item.departmentId) {
          formData.append(`authoritySaveBoList[${index}].departmentId`, item.departmentId)
        }
        if (item.stationIds) {
          formData.append(`authoritySaveBoList[${index}].stationIds`, item.stationIds)
        }
      })
      if (that.isAdd) {
        formData.append('file', files[0].originFileObj)
      }

      formData.append('dirId', that.record.dir.id)
      that.spinning = true
      docFileAddOrUpdate(formData)
        .then(res => {
          that.spinning = false
          that.$message.info(res.msg)
          if (res.code !== 200) {
            return
          }
          that.$refs.uploadFile.setFiles([])
          that.handleCancel()
          that.$emit('finish')
        })
        .catch(err => {
          that.spinning = false
        })
    },
    handleCancel() {
      //this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    onLoadData(treeNode) {
      let that = this
      let { id, value } = treeNode.dataRef
      let treeData = [...that.treeData]
      let target = treeData.find(item => item.id === id)
      if (target.children) {
        return
      }
      if (target) {
        return getStationList({ id: id }).then(res => {
          target.children = res.data.map(item => {
            let _uuid = uuid()
            return {
              id: item.id,
              key: _uuid,
              parentId: id,
              parentValue: value,
              value: _uuid,
              title: item.stationName,
              isLeaf: true
            }
          })
          that.treeData = [...treeData]
        })
      }
      return Promise.resolve([])
    },
    makeAuth() {
      let result = []
      let authoritySaveBoList = [...this.authoritySaveBoList]
      let nodes = this.treeData.map(item => {
        return { id: item.id, value: item.value }
      })

      let selectNodes = [], //选中的父节点列表
        selectLeafs = [] //选中的子节点列表
      authoritySaveBoList.map(v => {
        let target = nodes.find(n => n.value === v)
        if (target) {
          selectNodes.push(Object.assign({}, target))
        }
      })

      let leafs = this.treeData.map(item => item.children || []).flat(3)
      authoritySaveBoList.map(v => {
        let target = leafs.find(n => n.value === v)
        if (target) {
          selectLeafs.push(Object.assign({}, target))
          //选中子节点后并不包括父节点，这里加上父节点
          if (!selectNodes.find(n => n.value === target.parentValue)) {
            selectNodes.push({ id: target.parentId, value: target.parentValue })
          }
        }
      })

      selectNodes.map(item => {
        //父节点对应的子节点
        let _leafs = selectLeafs
          .filter(l => l.parentId === item.id)
          .map(item => item.id)
          .join(',')
        result.push({
          departmentId: +item.id, //部门
          stationIds: _leafs //岗位字符串
        })
      })
      return result
    }
  }
}
</script>