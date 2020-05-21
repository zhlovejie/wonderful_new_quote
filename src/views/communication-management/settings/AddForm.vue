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
            <a-form-item label="部门">
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
          <a-col :span="12">
            <a-form-item label="岗位">
              <a-select
                placeholder="选择岗位"
                :disabled="isView"
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
            <a-form-item label="手机">
              <a-select
                placeholder="选择手机"
                :disabled="isView"
                v-decorator="['phone',{initialValue:detail.phone,rules: [{required: true,message: '请选择手机'}]}]"
                :allowClear="true"
              >
                <a-select-option :value="1">有</a-select-option>
                <a-select-option :value="0">无</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="手机号">
              <a-select
                placeholder="选择手机号"
                :disabled="isView"
                v-decorator="['mobile',{initialValue:detail.mobile,rules: [{required: true,message: '请选择手机号'}]}]"
                :allowClear="true"
              >
                <a-select-option :value="1">有</a-select-option>
                <a-select-option :value="0">无</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item label="手机套餐">
              <a-input-number
                style="width:100%;"
                :min="0"
                :step="1"
                :precision="4"
                v-decorator="['mobilePackage', { initialValue:detail.mobilePackage,rules: [{ required: true, message: '请输入手机套餐' }]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="套餐详情">
              <a-textarea
                :disabled="isView"
                placeholder
                :rows="3"
                v-decorator="['packageDetail', {initialValue:detail.packageDetail, rules: [{ required: true, message: '请输入套餐详情' }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="公司邮箱">
              <a-select
                placeholder="选择公司邮箱"
                :disabled="isView"
                v-decorator="['email',{initialValue:detail.email,rules: [{required: true,message: '请选择公司邮箱'}]}]"
                :allowClear="true"
              >
                <a-select-option :value="1">有</a-select-option>
                <a-select-option :value="0">无</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="公司微信号">
              <a-select
                placeholder="选择公司微信号"
                :disabled="isView"
                v-decorator="['wxNum',{initialValue:detail.wxNum,rules: [{required: true,message: '请选择公司微信号'}]}]"
                :allowClear="true"
              >
                <a-select-option :value="1">有</a-select-option>
                <a-select-option :value="0">无</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="公司QQ号">
              <a-select
                placeholder="选择公司QQ号"
                :disabled="isView"
                v-decorator="['qqNum',{initialValue:detail.qqNum,rules: [{required: true,message: '请选择公司QQ号'}]}]"
                :allowClear="true"
              >
                <a-select-option :value="1">有</a-select-option>
                <a-select-option :value="0">无</a-select-option>
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
  getStationList //获取所有岗位
} from '@/api/systemSetting'
import {
  comManageSettingsAddAndUpdate,
  comManageSettingsDetail,
  comManageSettingsGetSettingsByStationId
} from '@/api/communicationManagement'

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
    async query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      that.record = Object.assign({}, record)
      that.form.resetFields()
      await that.initData()
      if (type === 'view' || type === 'edit') {
        that.spinning = true
        comManageSettingsDetail({ id: record.id })
          .then(res => {
            console.log(res)
            that
              .depChangeHandler(res.data.departmentId)
              .then(() => {
                that.spinning = false
                that.detail = { ...res.data }
                that.form.setFieldsValue({
                  departmentId:res.data.departmentId,
                  stationId:res.data.stationId
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
      this.form.validateFields(async (err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          that.spinning = true
          comManageSettingsAddAndUpdate(values)
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
      that.form.setFieldsValue({stationId:undefined })
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
  width: 100px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
</style>
