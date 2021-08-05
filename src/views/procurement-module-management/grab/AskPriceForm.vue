<template>
<a-modal
    title="物料询价单"
    :width="650"
    :visible="visible"
    :destroyOnClose="true"
    :footer="footer"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      class="ask-price-form-wrapper"
    >
      <a-card :bordered="cardBordered">
        <a-form-model-item label="物料名称">
          <span>{{record.materialName}}</span>
        </a-form-model-item>
        <a-form-model-item label="规格型号">
          <span>{{record.materialModelType}}</span>
        </a-form-model-item>
        <a-form-model-item  label="包装方式"  prop="packageCount">
          <a-input-number
            v-model="form.packageCount"
            placeholder="包装内数量"
            style="width:100%;"
            :min="0"
            :step="1"
            :precision="2"
          />
        </a-form-model-item>
        <a-form-model-item  label="品牌型号" prop="model">
          <a-input v-model="form.model" placeholder="品牌型号">
            <a-tooltip slot="suffix" title="限制品牌型号">
              <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
            </a-tooltip>
          </a-input>
        </a-form-model-item>
      </a-card>

      <a-card :bordered="cardBordered">
        <a-form-model-item label="发票类型" prop="invoiceType">
          <a-select v-model="form.invoiceType" placeholder="发票类型">
            <a-select-option :value="1">
              不限
            </a-select-option>
            <a-select-option :value="2">
              增值税专用发票
            </a-select-option>
            <a-select-option :value="3">
              普通发票
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="裸价标准" prop="nakedPrice">
          <a-select v-model="form.nakedPrice" placeholder="裸价标准">
            <a-select-option :value="1">
              含税运
            </a-select-option>
            <a-select-option :value="2">
              含税不含运
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item  label="最新报价" prop="newPrice">
          <a-input-number
            placeholder="最新报价"
            v-model="form.newPrice"
            style="width:100%;"
            :min="0"
            :step="1"
            :precision="2"
            :formatter="value => `${value}元`"
            :parser="value => value.replace('元', '')"
          />
        </a-form-model-item>
        <a-form-model-item  label="物料税率" prop="materialRate">
          <a-input-number
            placeholder="物料税率"
            v-model="form.materialRate"
            style="width:100%;"
            :min="0"
            :max="100"
            :step="1"
            :precision="0"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
          />
        </a-form-model-item>
        <a-form-model-item  label="运费税率" prop="freightRate">
          <a-input-number
            placeholder="运费税率"
            v-model="form.freightRate"
            style="width:100%;"
            :min="0"
            :max="100"
            :step="1"
            :precision="0"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
          />
        </a-form-model-item>
        <a-form-model-item  label="最低采购数量" prop="lowestNum">
          <a-input-number
            placeholder="最低采购数量"
            v-model="form.lowestNum"
            style="width:100%;"
            :min="0"
            :step="1"
            :precision="0"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
          />
        </a-form-model-item>
        <a-form-model-item  label="交货周期" prop="deliveryCycle">
          <a-input-number
            placeholder="交货周期"
            v-model="form.deliveryCycle"
            style="width:100%;"
            :min="30"
            :step="1"
            :precision="0"
            :formatter="value => `${value}天`"
            :parser="value => value.replace('天', '')"
          />
        </a-form-model-item>
        <a-form-model-item  label="保质期" prop="shelfLife">
          <a-input-number
            placeholder="保质期"
            v-model="form.shelfLife"
            style="width:100%;"
            :min="1"
            :max="180"
            :step="1"
            :precision="0"
            :formatter="value => `${value}天`"
            :parser="value => value.replace('天', '')"
          />
        </a-form-model-item>
      </a-card>

      <a-card :bordered="cardBordered" title="发送至">
        <a-form-model-item label="供应商" prop="supplierId">
          <a-select v-model="form.supplierId" placeholder="选择供应商">
            <a-select-option value="test1">
              测试供应商1
            </a-select-option>
            <a-select-option value="test2">
              测试供应商1
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item  label="邮箱信息" prop="email">
          <a-input v-model="form.email" placeholder="邮箱信息" />
        </a-form-model-item>
      </a-card>
    </a-form-model>
    </a-spin>
</a-modal>
</template>
<script>
import { enquiryAdd } from '@/api/procurementModuleManagement'
export default {
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      form: {

      },
      rules: {
        desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
      },
      cardBordered:true,
      visible:false,
      spinning:false,
      record:{}
    };
  },
  computed:{
    footer() {
      const that = this
      const h = that.$createElement
      const btn = []
      btn.push(h('a-button', { key: 'cancel', on: { click: that.handleCancel } }, '取消'))
      btn.push(
        h(
          'a-button',
          {
            key: 'submit',
            on: { click: () => that.handleSubmit() },
            props: { type: 'primary', loading: that.spinning }
          },
          '提交'
        )
      )
      return btn
    }
  },
  methods: {
    query(record){
      const that = this
      that.record = {...record}
      that.visible = true

    },
    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          alert('submit!');
          that.spinning = true
          enquiryAdd({...that.form}).then(res => {
            that.spinning = false
            that.$message.info(res.msg)
            if(res.code === 200){
              that.$emit('finished')
              that.handleCancel()
            }
          }).catch(err => {
            that.spinning = false
            that.$message.info(err)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    handleCancel(){
      this.resetForm()
      this.visible = false
    }
  },
};
</script>

<style scoped>
.ask-price-form-wrapper >>> .ant-card{
  margin-bottom: 20px;
}
.ask-price-form-wrapper >>> .ant-card .ant-card-body{
  padding: 10px 0;
}
.ask-price-form-wrapper >>> .ant-form-item{
  margin-bottom: 0;
}
</style>
