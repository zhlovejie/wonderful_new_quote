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
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:125px;">员工级别</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="员工级别"
                  :allowClear="true" 
                  v-decorator="['userLevel',{initialValue:detail.userLevel,rules: [{required: true,message: '选择员工级别'}]}]"
                >
                  <a-select-option
                    v-for="val in ['A','B','C','D']"
                    :key="val"
                    :value="val"
                  >{{val}}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
        </table>

        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:125px;">节假日名称</td>
            <td>过节费(元)</td>
            <td style="width:70px;">操作</td>
          </tr>
          <tr v-for="(item,idx) in festivalDetails" :key="item.key">
            <td>
              <a-form-item>
                <a-select
                  placeholder="节日名称"
                  :allowClear="true" 
                  v-decorator="[`festivalDetails.${idx}.festivalId`,{initialValue:festivalDetails[idx]['festivalId'],rules: [{required: true,message: '选择节日名称'}]}]"
                >
                  <a-select-option
                    v-for="item in festivalList"
                    :key="item.id"
                    :value="item.id"
                  >{{item.text}}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width:100%;"
                  :min="0"
                  :max="99999"
                  :step="1"
                  :precision="2"
                  v-decorator="[`festivalDetails.${idx}.money`, {initialValue:festivalDetails[idx]['money'], rules: [{ required: true, message: '请输入金额' }]}]"
                />
              </a-form-item>
            </td>
            <td style="width:70px;" v-if="!isView">
              <a-form-item>
                <a href="javascript:void(0);" @click="itemAction('del',item.key)">删除</a>
              </a-form-item>
            </td>
          </tr>
        </table>
        <a-button
          v-if="!isView"
          style="width:100%;"
          type="dashed"
          icon="plus"
          @click="itemAction('add')"
        >添加节假日</a-button>

        <table v-if="isEdit" class="custom-table custom-table-border" style="margin-top:10px;">
          <tr>
            <td style="width:125px;">备注</td>
            <td>
              <a-form-item>
                <a-textarea
                  style="width:100%;"
                  placeholder="备注"
                  :rows="2"
                  v-decorator="['remark', {initialValue:detail.remark, rules: [{ required: false, message: '备注' }]}]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
        
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>

import { getDictionaryList } from '@/api/workBox'
import { festivalBonusSettingDetail,festivalBonusSettingAddOrUpdate } from '@/api/welfareManagement'

let uuid = () =>Math.random().toString(32).slice(-10)

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
      detail:{},
      festivalDetails:[]
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
    isView(){
      return this.type === 'view'
    }
  },
  methods: {
    async query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      that.record = Object.assign({}, record)
      that.detail = {}
      that.festivalDetails = []
      that.form.resetFields()
      await that.initData()
      if (that.isAdd) {
        return
      }
      festivalBonusSettingDetail({id:that.record.id}).then(res =>{
        that.detail = res.data
        that.festivalDetails = res.data.details.map(item =>{
          item.key = uuid()
          return item
        })
      })
      //that.form.setFieldsValue(Object.assign({}, that.record))
    },
    initData() {
      let that = this
      let queue = []
      let task1 = getDictionaryList({ parentId: 517 }).then(res => (that.festivalList = res.data))
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
          values.details = values.festivalDetails
          that.spinning = true
          festivalBonusSettingAddOrUpdate(values)
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
    itemAction(type,key){
      let festivalDetails = [...this.festivalDetails]
      if(type === 'add'){
        festivalDetails.push({
          key:uuid(),
          festivalId:undefined,
          money:undefined
        })
        this.festivalDetails = festivalDetails
      }
      if(type === 'del'){
        this.festivalDetails = festivalDetails.filter(item => item.key !== key)
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
