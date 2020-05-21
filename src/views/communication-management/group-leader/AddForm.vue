<template>
  <a-modal
    :title="modalTitle"
    :width="660"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="wdf-custom-form-wrapper">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item hidden>
              <a-input v-decorator="['id',{initialValue:detail.id}]" />
            </a-form-item>

            <a-form-item label="群名称">
              <a-input :disabled="isView" v-decorator="['groupName',{initialValue:detail.groupName,rules: [{required: true,message: '请输入群名称'}]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="14">
            <a-form-item label="群主">
              <a-select
                placeholder="选择部门"
                :disabled="isView"
                v-decorator="['departmentId',{initialValue:detail.departmentId,rules: [{required: true,message: '请选择部门'}]}]"
                @change="depChangeHandler"
                :allowClear="true"
              >
                <a-select-option
                  v-for="item in depSelectDataSource"
                  :key="item.id"
                  :value="item.id"
                >{{item.departmentName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item >
              <a-select
                placeholder="选择人员"
                :disabled="isView"
                v-decorator="['userId',{initialValue:detail.userId,rules: [{required: true,message: '请选择人员'}]}]"
                :allowClear="true"
              >
                <a-select-option
                  v-for="item in personSelectDataSource"
                  :key="item.id"
                  :value="item.id"
                >{{item.trueName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  departmentList, //所有部门
  getStationList, //获取所有岗位
  getUserByDep
} from '@/api/systemSetting'
import {
  comManageGroupAddAndUpdate,
  comManageGroupDetail
} from '@/api/communicationManagement'

import moment from 'moment'

export default {
  name: 'AddForm',
  data() {
    return {
      depSelectDataSource: [],
      personSelectDataSource: [],
      form: this.$form.createForm(this, { name: 'add_form' }),
      visible: false,
      spinning: false,
      type: 'view',
      record: {},
      detail: {}
    }
  },
  computed: {
    isView() {
      return this.type === 'view'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    modalTitle() {
      return this.type === 'add' ? '新增' : this.type === 'view' ? '查看' : '编辑'
    }
  },
  methods: {
    moment,
    async query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      that.record = Object.assign({}, record)
      that.detail = {}
      that.depSelectDataSource = []
      that.personSelectDataSource = []
      that.form.resetFields()
      await that.initData()
      if (type === 'view' || type === 'edit') {
        that.spinning = true


        comManageGroupDetail({ id: record.id })
          .then(res => {
            console.log(res)
            that
              .depChangeHandler(res.data.departmentId)
              .then(() => {
                that.spinning = false
                that.detail = { ...res.data }
                that.form.setFieldsValue({
                  departmentId:res.data.departmentId,
                  userId:res.data.userId
                })
              })
              .catch(err => {
                that.spinning = false
              })
          })
          .catch(err => {
            that.spinning = false
          })
      }
    },
    initData() {
      let that = this
      let task1 = departmentList().then(res => (that.depSelectDataSource = res.data))
      return Promise.all([task1])
    },

    handleSubmit() {
      let that = this
      if(that.isView){
        that.handleCancel()
        return
      }
      this.form.validateFields(async (err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          that.spinning = true
          comManageGroupAddAndUpdate(values)
            .then(res => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch(err => {
              that.spinning = false
              that.$message.error('操作失败')
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    depChangeHandler(dep_id) {
      let that = this
      that.form.setFieldsValue({userId:undefined })
      that.personSelectDataSource = []
      return getUserByDep({ departmentId: dep_id }).then(res => (this.personSelectDataSource = res.data))
    }
  }
}
</script>
<style scoped>
.wdf-custom-form-wrapper >>> .ant-form-item {
  display: flex;
}

.ant-form-item >>> .ant-form-item-label {
  width: 100px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
</style>
