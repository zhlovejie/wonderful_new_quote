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
        <a-form-item label="节日名称">
          <a-select
            placeholder="节日名称"
            :allowClear="true" 
            v-decorator="['festivalId',{initialValue:record.festivalId,rules: [{required: true,message: '选择节日名称'}]}]"
          >
            <a-select-option
              v-for="item in festivalList"
              :key="item.id"
              :value="item.id"
            >{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="金额(元)">
          <a-input-number
            style="width:100%;"
            :min="0"
            :max="99999"
            :step="1"
            :precision="2"
            v-decorator="['money', {initialValue:record.money, rules: [{ required: true, message: '请输入金额' }]}]"
          />
        </a-form-item>
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
  giftSettingAddOrUpdate
} from '@/api/welfareManagement'

import { getDictionary } from '@/api/common'
export default {
  name: 'welfare-management-healthy-config-AddForm',
  data() {
    return {
      form: this.$form.createForm(this, { name: 'welfare-management-healthy-config-AddForm' }),
      visible: false,
      spinning: false,
      type: 'view',
      festivalList:[],
      record: {},
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
    }
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
      let task1 = getDictionary({ text: '节日名称' }).then(res => {that.festivalList = res.data })
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
          that.spinning = true
          giftSettingAddOrUpdate(values)
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
      this.depSelectDataSource = []
      this.postSelectDataSource = []
      this.$nextTick(() => (this.visible = false))
    },
    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      return getStationList({ id: dep_id }).then(res => {
        that.postSelectDataSource = res.data
      })
    },
    postChangeHandler(post_id){
      let target = this.postSelectDataSource.find(item => item.id === post_id)
      if(target){
        console.log(target)
        this.isManagerCheck = target.level === 'A'
      }
    }
  }
}
</script>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item{
  display:flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label{
  width:125px;
}
.ant-form-item >>> .ant-form-item-control-wrapper{
  flex:1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  text-align: left;
}
</style>
