<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false" 
  >
    <a-spin :spinning="spinning">
    <a-form :form="form" class="add-form-wrapper">
      
      <a-row type="flex" justify="space-around" align="middle">
        <a-col :span="18">
          <a-row type="flex" justify="space-around" align="middle">
            <a-col>
              <img src="@/assets/icon_contract.jpg" style="width:48px;height:56px;" alt="合同图标" />
            </a-col>
            <a-col>
              <div>江苏万德福公共设施科技有限公司</div>
              <div>JiangSu Wonderful Infrastructure Manufacturing co.,Ltd</div>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="6">
          公司产品报价单
        </a-col>
      </a-row>
      <!-- <div class="price-header">
        <div class="price-header-logo">
          <img src="@/assets/icon_contract.jpg" style="width:48px;height:56px;" alt="合同图标" />
          <div>
            <div>江苏万德福公共设施科技有限公司</div>
            <div>JiangSu Wonderful Infrastructure Manufacturing co.,Ltd</div>
          </div>
        </div>
        <div class="price-header-title">
          公司产品报价单
        </div>
      </div>
      <a-row>
        <a-col :span="10">
          <a-form-item label="报价方">
            江苏万德福公共设施科技有限公司
          </a-form-item>
        </a-col>
      </a-row> -->

      <table class="custom-table custom-table-border">
        <tr>
          <td style="width:120px;">配置名称</td>
          <td >
            <a-form-item>
              <a-input :disabled="isDisabled"  v-decorator="['itemName', { rules: [{ required: true, message: '请输入配置名称' }] }]" />
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td>备注</td>
          <td>
            <a-form-item>
              <a-textarea 
                :disabled="isDisabled" 
                placeholder="备注" 
                :rows="5" 
                v-decorator="['remarks', { rules: [{ required: false, message: '备注' }] }]"
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

import {
  priceAdjustItemConfigAddAndUpdate
} from '@/api/productOfferManagement'

export default {
  name:'AddForm',
  components:{

  },
  data(){
    return {
      form: this.$form.createForm(this, { name: 'addForm' }),
      visible:false,
      actionType:'add', 
      spinning:false
    }
  },
  computed:{
    modalTitle(){
      let m = {
        'view':'查看',
        'add':'新增',
        'edit' : '修改',
        'approval':'审批'
      }
      return `${m[this.actionType]}产品配置`
    },
    isView(){
      return this.actionType === 'view'
    },
    isAdd(){
      return this.actionType === 'add'
    },
    isEdit(){
      return this.actionType === 'edit'
    },
    isApproval(){
      return this.actionType === 'approval'
    },
    isDisabled(){
      return this.isView || this.isApproval
    }
  },
  methods:{
    init(){
      let that = this
    },
    async handleOk(){
      let that = this
      if(that.isView || that.isApproval){
        that.handleCancel()
        return 
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          if(that.isEdit){
            values.id = that.record.id
          }
          console.log('Received values of form: ', values)
          that.spinning = true
          priceAdjustItemConfigAddAndUpdate(values).then(res =>{
            that.spinning = false
            if(res.code === 200){
              that.visible = false 
              that.$message.success('操作成功')
              that.$emit('finish')
            }else{
              that.$message.warning(res.msg)
            }
          })
          .catch(err => {
            console.log(err)
            that.$message.error('操作失败')
            that.spinning = false
          })
        }
      });
    },
    handleCancel(){
      this.form.resetFields()
      this.$nextTick(() =>this.visible = false)
    },
    async query(type,record){
      let that = this
      that.actionType = type 
      that.record = record || {}
      that.form.resetFields()

      await that.init() 
      that.visible = true
      that.$nextTick(() =>that.form.setFieldsValue({
        itemName:that.record.itemName,
        remarks:that.record.remarks
      }))
    },
  }
}
</script>

<style scoped>
.add-form-wrapper >>> .ant-form-item{
  display: flex;
}
.add-form-wrapper >>> .ant-form-item-control-wrapper{
  flex: 1;
}

.custom-table-border th,.custom-table-border td{
  padding: 5px 10px;
}

.add-form-wrapper >>> .ant-form-item{
  margin-bottom: 0;
}

.add-form-wrapper >>> .custom-table{
  margin-bottom: 0;
}
</style>