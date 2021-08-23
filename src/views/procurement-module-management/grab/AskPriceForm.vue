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

        <a-form-model-item
            label="包装方式"
            prop="packageType"
          >
            <a-row>
              <a-col :span="11">
                <a-select style="width:100%;" allowClear v-model="form.packageType" placeholder="包装类型">
                  <a-select-option
                    v-for="item in packingType"
                    :key="item.text"
                    :value="item.text"
                  >{{item.text}}</a-select-option>
                </a-select>
              </a-col>
              <a-col
                :span="11"
                :offset="2"
              >
                <a-input-number
                  v-model="form.packageCount"
                  placeholder="包装内数量"
                  style="width:100%;"
                  :min="0"
                  :step="1"
                  :precision="0"
                />
              </a-col>
            </a-row>
        </a-form-model-item>
        <a-form-model-item
            label="品牌/型号"
            prop="modelName"
          >
            <template v-if="Array.isArray(form.manageBrands) && form.manageBrands.length > 0">
            <a-row v-for="(b,idx) in form.manageBrands" :key="b.id">
              <a-col :span="24">
                  <span>{{b.brandName}}</span>
                  <span style="margin:0 5px;">/</span>
                  <span>{{b.buyRequirementBrandModels.map(sub => sub.modelName).join(',')}}</span>
              </a-col>
            </a-row>

            </template>
            <template v-else>
              <span>该物料需求下暂未设置品牌</span>
            </template>

              <!-- <a-col :span="11">
                <a-input
                  v-model="form.modelName"
                  placeholder="品牌"
                />
              </a-col>
              <a-col
                :span="11"
                :offset="2"
              >
                <a-input
                  v-model="form.modelType"
                  placeholder="型号"
                />
              </a-col>
            </a-row> -->

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
          />
        </a-form-model-item>
        <a-form-model-item  label="交货周期" prop="deliveryCycle">
          <a-input-number
            placeholder="交货周期"
            v-model="form.deliveryCycle"
            style="width:100%;"
            :min="0"
            :max="30"
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
            :min="180"
            :step="1"
            :precision="0"
            :formatter="value => `${value}天`"
            :parser="value => value.replace('天', '')"
          />
        </a-form-model-item>
      </a-card>

      <a-card :bordered="cardBordered" title="发送至">
        <a-form-model-item label="供应商" prop="supplierId">
          <a-select
            v-model="form.supplierId"
            placeholder="选择供应商"
            allowClear
            @change="supplierChangeHandler"
          >
            <a-select-option v-for="item in supplierList" :value="item.id" :key="item.id">
              {{item.supplierName}}
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
import { getDictionary } from '@/api/common'
import { enquiryAdd,quotationSupplierList } from '@/api/procurementModuleManagement'
import { getBuyRequirement } from '@/api/routineMaterial'
export default {
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      form: {
        email:undefined
      },
      rules: {
        email:[{ required: true, message: '请输入邮箱信息' }],
      },
      cardBordered:true,
      visible:false,
      spinning:false,
      record:{},
      supplierList:[],
      packingType:[]
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
    async query(record){
      const that = this
      that.record = {...record}
      that.visible = true
      that.form = {}

      let materialRequirement = await getBuyRequirement({ materialId: that.record.materialId })
        .then(res => res.data)
        .catch(err => {
          console.log(err)
          return null
        })


        if(materialRequirement === null){
          let msg = `物料名称：${that.record.materialName} 要求获取失败`
          that.$message.error(msg);
          return
        }

        that.form = {
            requestId:that.record.id,
            materialId:that.record.materialId,
            materialName:that.record.materialName,
            materialModelType:that.record.materialModelType,
            // supplierId:materialRequirement.supplierId,
            lastPrice:materialRequirement.price || 0,
            invoiceType:materialRequirement.invoiceType, //物流发票类型(0为无限，1为增值税专用发票，2为普通发票)
            deliveryCycle:materialRequirement.maxDelivery,//交货期
            lowestNum:materialRequirement.maxPurchase,//采购量
            shelfLife:materialRequirement.minWarranty,//最短质保期
            nakedPrice:materialRequirement.nakedPrice,//裸价的标准(0为含运费，1为不含运费)
            packageType:materialRequirement.packMethod,//包装方式
            // packType:materialRequirement.packType,//是否固定包装(1是固定，2是不固定)
            packageCount:materialRequirement.pageNum,//包内数量
            newPrice:materialRequirement.price || 0,//最新采购价格
            materialRate:materialRequirement.taxRate,//物料税率

            manageBrands:materialRequirement.buyRequirementBrands || [],
            freightRate:0
          }

      //根据物料查询相应的供应商列表
      quotationSupplierList({materialId:that.record.materialId}).then(res => {
        that.supplierList = res.data
        if(that.supplierList.length === 0){
          that.$message.info(`暂无物料【${that.record.materialName}】的供应商信息`)
        }
      })

      getDictionary({ text: '采购包装类型' }).then(res => (that.packingType = res.data))

    },
    formatBrands(list){
      // list.map(item => {
      //   return `品牌：【${item.brandName}】 型号：【${item.buyRequirementBrandModels.map(sub => sub.modelName).join(',') }】`
      // })
    },
    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          const { modelName, modelType } = that.form
          that.spinning = true
          enquiryAdd({ ...that.form, model: `${modelName}-${modelType}` }).then(res => {
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
    },
    async supplierChangeHandler(v){
      const that = this

      let supplierList = [...that.supplierList]
      let target = supplierList.find(item => +item.id === +v)
      if(target){
        if(!target.supplierEmail){
          that.$message.info('该供应商暂无提供邮箱信息，请手动输入。')
        }
        that.form = {...that.form,supplierName:target.supplierName,email:target.supplierEmail || undefined}
      }



      //判断供应商是否有采购某一物料的资格，返回true为有资格
      // quotationCheckSupplier({supplierId:v,materialId:that.record.materialId}).then(res => {
      //   console.log(res)
      // })
    }
  },
};
</script>

<style scoped>
.ask-price-form-wrapper >>> .ant-card{
  margin-bottom: 20px;
}
.ask-price-form-wrapper >>> .ant-card:last-child{
  margin-bottom: 0;
}
.ask-price-form-wrapper >>> .ant-card .ant-card-body{
  padding: 10px 0;
}
.ask-price-form-wrapper >>> .ant-form-item{
  margin-bottom: 0;
}
</style>
