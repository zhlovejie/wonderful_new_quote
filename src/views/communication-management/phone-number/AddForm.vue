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
          <a-col :span="12">
            <a-form-item hidden>
              <a-input v-decorator="['id',{initialValue:detail.id}]" />
            </a-form-item>

            <a-form-item label="开户姓名">
              <a-input :disabled="isView" v-decorator="['accountName',{initialValue:detail.accountName,rules: [{required: true,message: '请输入开户姓名'}]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="部门">
              <a-select
                placeholder="选择部门"
                :disabled="isView || isEdit"
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
          <a-col :span="12">
            <a-form-item label="岗位">
              <a-select
                placeholder="选择岗位"
                :disabled="isView || isEdit"
                v-decorator="['stationId',{initialValue:detail.stationId,rules: [{required: true,message: '请选择岗位'}]}]"
                :allowClear="true"
              >
                <a-select-option :key="-1" :value="0">该部门所有岗位</a-select-option>
                <a-select-option
                  v-for="item in postSelectDataSource"
                  :key="item.id"
                  :value="item.id"
                >{{item.stationName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="使用人">
              <a-input disabled v-decorator="['userName',{initialValue:detail.userName}]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="手机号">
              <a-input :disabled="isView" v-decorator="['mobile',{initialValue:detail.mobile,rules: [{required: true,message: '输入手机号'},{pattern: /^1\d{10}$/,message:'请输入正确的手机号码'}]}]" placeholder="输入手机号"/>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="手机短号">
              <a-input :disabled="isView" v-decorator="['mobileShort',{initialValue:detail.mobileShort,rules: [{required: false,message: '输入手机短号'}]}]" placeholder="输入手机短号"/>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="手机密码">
              <a-input :disabled="isView" v-decorator="['mobilePassword',{initialValue:detail.mobilePassword,rules: [{required: false,message: '输入手机密码'}]}]" placeholder="输入手机密码"/>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="身份信息名称">
              <a-input :disabled="isView" v-decorator="['identityName',{initialValue:detail.identityName,rules: [{required: true,message: '输入身份信息名称'}]}]" placeholder="输入身份信息名称"/>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="开卡时间">
              <a-date-picker :disabled="isView" placeholder="开卡时间" v-decorator="['cardOpenTime',{initialValue:moment(detail.cardOpenTime),rules: [{required: true,message: '请选择开卡时间'}]}]" style="width:100%;" />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="备注">
              <a-input :disabled="isView" v-decorator="['remarks',{initialValue:detail.remarks,rules: [{required: false,message: '输入备注'}]}]" placeholder="输入备注"/>
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
  getStationList //获取所有岗位
} from '@/api/systemSetting'
import {
  comManageMobileManageAddAndUpdate,
  comManageMobileManageDetail
} from '@/api/communicationManagement'

import moment from 'moment'

export default {
  name: 'AddForm',
  data() {
    return {
      depSelectDataSource: [],
      postSelectDataSource: [],
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
      that.form.resetFields()
      await that.initData()
      if (type === 'view' || type === 'edit') {
        that.spinning = true
        comManageMobileManageDetail({ id: record.id })
          .then(res => {
            console.log(res)
            that
              .depChangeHandler(res.data.departmentId)
              .then(() => {
                that.spinning = false
                that.detail = { ...res.data }
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
      this.form.validateFields(async (err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          values.cardOpenTime = values.cardOpenTime.format('YYYY-MM-DD')
          that.spinning = true
          comManageMobileManageAddAndUpdate(values)
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
      that.postSelectDataSource = []
      return getStationList({ id: dep_id }).then(res => (that.postSelectDataSource = res.data))
    }
  }
}
</script>
<style scoped>
.wdf-custom-form-wrapper >>> .ant-form-item {
  display: flex;
}

.ant-form-item >>> .ant-form-item-label {
  width: 120px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
</style>
