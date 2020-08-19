<template>
  <a-modal
    :title="modalTitle"
    :width="550"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="wdf-custom-add-form-wrapper">
        <a-form-item label="资产类别">
          <a-select
            placeholder="选择资产类型"
            v-decorator="['typeDicId',{initialValue:record.typeDicId,rules: [{required: true,message: '选择资产类型'}]}]"
            :allowClear="true"
            style="width:100%;"
          >
            <a-select-option v-for="item in assetTypeList" :key="item.id" :value="item.id">{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="资产编码">
          <a-input
            style="width:100%;"
            v-decorator="['code', {initialValue:record.code, rules: [{ required: true, message: '请输入资产编码' }]}]"
          />
        </a-form-item>
        <a-form-item label="资产名称">
          <a-input
            style="width:100%;"
            v-decorator="['name', {initialValue:record.name, rules: [{ required: true, message: '请输入资产名称' }]}]"
          />
        </a-form-item>

        <a-form-item label="资产归属">
          <a-select
            placeholder="选择资产归属"
            v-decorator="['beyondType', {initialValue:record.beyondType, rules: [{ required: true, message: '选择资产归属' }]}]"
            :allowClear="true"
            style="width:100%;"
          >
            <a-select-option :value="1">个人</a-select-option>
            <a-select-option :value="2">部门</a-select-option>
            <a-select-option :value="3">资产库</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="购买时间">
          <a-date-picker
            v-decorator="['buyTime',{initialValue:record.buyTime ? moment(record.buyTime) : undefined,rules: [{required: true,message: '请选择购买时间'}]}]"
            style="width:100%;"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  departmentList, //所有部门
  getStationList, //获取所有岗位
} from '@/api/systemSetting'
import { getDictionaryList } from '@/api/workBox'
import { oaAssertsInfoAssertsAdd } from '@/api/assetManagement'
import moment from 'moment'
export default {
  name: 'asset-management-management-AddForm',
  data() {
    return {
      form: this.$form.createForm(this, { name: 'asset-management-management-AddForm' }),
      visible: false,
      spinning: false,
      type: 'view',
      assetTypeList:[],
      record: {},
      isManagerCheck: false,
    }
  },
  computed: {
    modalTitle() {
      return this.type === 'add' ? '新增' : '编辑'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
  },
  methods: {
    async query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      that.record = Object.assign({}, record)

      await that.initData()
      if (that.isEdit) {
        that.$nextTick(() => {
          that.form.setFieldsValue(Object.assign({}, that.record))
        })
      }
    },
    initData() {
      let that = this
      let queue = []
      let task1 = getDictionaryList({ parentId: 532 }).then((res) => (that.assetTypeList = res.data))
      queue.push(task1)
      return Promise.all(queue)
    },
    handleSubmit() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          if (that.isEdit) {
            values.id = that.record.id
          }
          if(values.buyTime && values.buyTime instanceof moment){
            values.buyTime = values.buyTime.format('YYYY-MM-DD')
          }
          that.spinning = true
          oaAssertsInfoAssertsAdd(values)
            .then((res) => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch((err) => {
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
  },
}
</script>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 100px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  text-align: left;
}
</style>
