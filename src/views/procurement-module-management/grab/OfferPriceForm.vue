<template>
  <a-modal
    :title="modalTitle"
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




        <a-card :bordered="cardBordered" >
          <a-form-model-item
            label="有无供应商"
            prop="hasSupplier"
          >
            <a-radio-group
              name="hasSupplier"
              v-model="form.hasSupplier"
              @change="hasSupplierChange"
            >
              <a-radio v-for="(item,idx) in hasSupplierList" :key="idx" :value="item.id">{{item.label}}</a-radio>
            </a-radio-group>
          </a-form-model-item>

          <template v-if="form.hasSupplier === 1">
            <a-form-model-item
              label="供应商"
              prop="supplierId"
            >
              <a-select
                v-model="form.supplierId"
                placeholder="选择供应商"
                allowClear
                @change="supplierChangeHandler"
              >
                <a-select-option
                  v-for="item in supplierList"
                  :value="item.id"
                  :key="item.id"
                >
                  {{item.supplierName}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </template>

          <template v-if="form.hasSupplier === 2">
            <a-form-model-item
              label="供应商"
              prop="supplierName"
            >
              <a-input
                v-model="form.supplierName"
                placeholder="请输入供应商名称，输入后不可更改"
              />
            </a-form-model-item>
          </template>
        </a-card>



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
                <a-select
                  style="width:100%;"
                  allowClear
                  v-model="form.packageType"
                  placeholder="包装类型"
                >
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
              <a-row
                v-for="(b,idx) in form.manageBrands"
                :key="b.id"
              >
                <a-col :span="24">
                  <span>{{b.brandName}}</span>
                  <span style="margin:0 5px;">：</span>
                  <span>{{Array.isArray(b.manageBrandModels) && b.manageBrandModels.length > 0 ? b.manageBrandModels.map(sub => sub.modelName).join(',') : '无'}}</span>
                </a-col>
              </a-row>

              <a-row v-if="!supplierRequirement.manageBrands || (Array.isArray(supplierRequirement.manageBrands) && supplierRequirement.manageBrands.length === 0)">
                <a-col>
                  <a-button @click="brandsAction('edit')">修改品牌型号</a-button>
                </a-col>
              </a-row>

            </template>
            <template v-else>
              <span>该物料需求下暂未设置品牌，请手动添加</span>
              <div>
                <a-button @click="brandsAction('add')">添加品牌型号</a-button>
              </div>
            </template>

            <!-- <a-row>

              <a-col :span="11">
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
          <a-form-model-item
            label="最后一次采购单价"
            prop="lastPrice"
          >
            {{`${form.lastPrice || 0} 元`}}
            <!-- <a-input-number
              placeholder="最新采购单价"
              v-model="form.lastPrice"
              style="width:100%;"
              :min="0"
              :step="1"
              :precision="2"
              :formatter="value => `${value}元`"
              :parser="value => value.replace('元', '')"
            /> -->
          </a-form-model-item>
        </a-card>

        <a-card :bordered="cardBordered">
          <a-form-model-item
            label="结算方式"
            prop="settlementMode"
          >
            <template v-if="form.hasSupplier === 2">
              <a-select
                v-model="form.settlementMode"
                placeholder="结算方式"
              >
                <a-select-option :value="0">
                  现款现货
                </a-select-option>
                <a-select-option :value="1">
                  账期结算
                </a-select-option>
              </a-select>

            </template>
            <template v-else>
              {{ {0:'现款现货',1:'账期结算'}[form.settlementMode] || '-' }}
            </template>
          </a-form-model-item>

          <a-form-model-item
            label="发票类型"
            prop="invoiceType"
          >
            <a-select
              v-model="form.invoiceType"
              placeholder="发票类型"
            >
              <a-select-option :value="0">
                不限
              </a-select-option>
              <a-select-option :value="1">
                增值税专用发票
              </a-select-option>
              <a-select-option :value="2">
                普通发票
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item
            label="裸价标准"
            prop="nakedPrice"
          >
            <a-select
              v-model="form.nakedPrice"
              placeholder="裸价标准"
            >
              <a-select-option :value="1">
                含税运
              </a-select-option>
              <a-select-option :value="2">
                含税不含运
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            label="最新报价"
            prop="newPrice"
          >
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
          <a-form-model-item
            label="物料税率"
            prop="materialRate"
          >
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
          <a-form-model-item
            label="运费税率"
            prop="freightRate"
          >
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
          <a-form-model-item
            label="最低采购数量"
            prop="lowestNum"
          >
            <a-input-number
              placeholder="最低采购数量"
              v-model="form.lowestNum"
              style="width:100%;"
              :min="0"
              :step="1"
              :precision="0"
            />
          </a-form-model-item>

          <a-form-model-item
            label="交货周期"
            prop="deliveryCycle"
          >
            <a-input-number
              placeholder="交货周期"
              v-model="form.deliveryCycle"
              style="width:100%;"
              :min="0"
              :step="1"
              :precision="0"
              :formatter="value => `${value}天`"
              :parser="value => value.replace('天', '')"
            />
          </a-form-model-item>
          <a-form-model-item
            label="保质期"
            prop="shelfLife"
          >
            <a-input-number
              placeholder="保质期"
              v-model="form.shelfLife"
              style="width:100%;"
              :min="0"
              :step="1"
              :precision="0"
              :formatter="value => `${value}天`"
              :parser="value => value.replace('天', '')"
            />
          </a-form-model-item>
        </a-card>
      </a-form-model>
      <BrandFrom ref="brandFrom" @brandChange="brandChange"/>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  quotationAdd,
  quotationDetail,
  quotationDetailForUpdate,
  quotationSupplierList,
  quotationCheckSupplier,
  getOrderLastPrice
} from '@/api/procurementModuleManagement'
import { getBuyRequirement, getSupplierOffer } from '@/api/routineMaterial'
import BrandFrom from '@/views/supplier/modules/BrandFrom'
import { getDictionary } from '@/api/common'
export default {
  components:{BrandFrom},
  data() {
    let isExists = (obj) => obj !== undefined && obj !== null && obj !== ''
    let validateDeliveryCycle = (rule, value, callback) => {
      let deliveryCycle = this.extendsValidate.deliveryCycle
      if(isExists(deliveryCycle)){
        callback()
      }else{
        if(!isExists(value)){
          callback(new Error('请输入交货周期'));
        }
        if(+value >= 0 && +value <= 30){
          callback()
        }else{
          callback(new Error('交货周期必须在30天内'));
        }
      }
    }

    let validateShelfLife = (rule, value, callback) => {
      let shelfLife = this.extendsValidate.shelfLife
      if(isExists(shelfLife)){
        callback()
      }else{
        if(!isExists(value)){
          callback(new Error('请输入交保质期'));
        }
        if(+value >= 180){
          callback()
        }else{
          callback(new Error('保质期必须大于等于 180 天'));
        }
      }
    }

    return {
      type: 'add',
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      form: {
        // hasSupplier: 1,
        // packageCount: undefined,
        // model: '',
        // invoiceType: 1,
        // nakedPrice: 1,
        // newPrice: 0,
        // materialRate: 0,
        // freightRate: 0,
        // lowestNum: 1,
        // deliveryCycle: 30,
        // shelfLife: 180,
        // supplierId: undefined,
        // email: undefined,
        // supplierName: undefined,
        source: 1
      },
      rules: {
        // lastPrice:[{ required: true, message: '请输入最新采购单价' }],
        settlementMode: [{ required: true, message: '请选择结算方式' }],
        packageType: [{ required: true, message: '请输入包装类型' }],
        packageCount: [{ required: true, message: '请输入包装内数量' }],
        //modelName: [{ required: true, message: '请输入品牌' }],
        //modelType: [{ required: true, message: '请输入品牌型号' }],
        invoiceType: [{ required: true, message: '请选择发票类型' }],
        nakedPrice: [{ required: true, message: '请输入裸价标准' }],
        newPrice: [{ required: true, message: '请输入最新报价' }],
        materialRate: [{ required: true, message: '请输入物料税率' }],
        freightRate: [{ required: true, message: '请输入运费税率' }],
        lowestNum: [{ required: true, message: '请输入最低采购数量' }],
        deliveryCycle: [{ validator: validateDeliveryCycle, trigger: 'change' }],
        shelfLife: [{ validator: validateShelfLife, trigger: 'change' }],
        supplierId: [{ required: true, message: '请选择供应商' }],
        supplierName: [{ required: true, message: '请输入供应商名称' }],
        email: [{ required: true, message: '请输入邮箱信息' }]
      },
      cardBordered: true,
      visible: false,
      spinning: false,
      record: {},
      detail: {},
      detailUpdate: {},
      supplierList: [],
      packingType: [],
      materialRequirement: {},
      supplierRequirement: {},
      needValidateMaterialRequiredAndSupplierRequired: true,
      isDesignatedSupplier:false,//是否指定供应商


      extendsValidate:{
        deliveryCycle:null,
        shelfLife:null
      }

    }
  },
  computed: {
    modalTitle() {
      const type = this.type
      const t = type === 'add' ? '新增' : type === 'edit' ? '修改' : type === 'view' ? '查看' : '审批'
      return `${t}报价单`
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isView() {
      return this.type === 'view'
    },
    isApproval() {
      return this.type === 'approval'
    },
    isDisabled() {
      return this.isView || this.isApproval
    },
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
    },
    hasSupplierList(){
      let list= [
        {id:1,label:'有'},
        {id:2,label:'无' }
      ]
      if(this.isDesignatedSupplier){
        return [{id:1,label:'有'}]
      }
      return list
    }
  },
  methods: {
    async query(type, record) {
      const that = this
      that.type = type
      that.record = { ...record }
      that.visible = true
      that.needValidateMaterialRequiredAndSupplierRequired = true
      that.form = {
        requestId: that.record.requestId || that.record.id,
        materialId: that.record.materialId,
        materialName: that.record.materialName,
        materialModelType: that.record.materialModelType,
        source: record.source
      }
      if (!that.isAdd) {
        const [d1, d2] = Promise.all([
          quotationDetail({ id: that.record.id })
            .then(res => res.data)
            .catch(err => {
              that.$message.error(err)
              return null
            }),
          quotationDetailForUpdate({ id: that.record.id })
            .then(res => res.data)
            .catch(err => {
              that.$message.error(err)
              return null
            })
        ])
        if (d1 === null || d2 === null) {
          return
        }
        that.detail = d1
        that.detailUpdate = d2
      } else {
        //判断供应商是否有采购某一物料的资格，返回true为有资格
        // quotationCheckSupplier({supplierId:d2.supplierId,materialId:d2.materialId}).then(res => {

        // })

        await getDictionary({ text: '采购包装类型' }).then(res => (that.packingType = res.data))

        //根据物料查询相应的供应商列表
        await quotationSupplierList({ materialId: that.record.materialId }).then(res => {
          that.supplierList = res.data
          if (that.supplierList.length === 0) {
            that.$message.info(`暂无物料【${that.record.materialName}】的供应商信息`)
          }
          that.form = {
            ...that.form,
            hasSupplier: that.supplierList.length > 0 ? 1 : 2
          }
        })

        //根据物料id获取该物料最新采购价  目前尚未使用
        const newLastPrice = await getOrderLastPrice({ materialId: that.record.materialId })
          .then(res => {
            if (res && res.code === 200) {
              return res.data || 0
            } else {
              that.$message.info(`获取物料最新采购单价失败:${res.msg}`)
              return 0
            }
          })
          .catch(err => {
            that.$message.info(`获取物料最新采购单价失败:${err}`)
            return 0
          })
        that.form = {...that.form,lastPrice: newLastPrice || 0}
        // await that.initMaterialRequired()
        await that.testSupplierByMaterial()
      }
    },
    async testSupplierByMaterial(){
      const that = this
      that.spinning = true

      const materialRequirement = await getBuyRequirement({ materialId: that.record.materialId })
        .then(res => res.data || {})
        .catch(err => {
          that.spinning = false
          console.log(err)
          return {}
        })

      that.spinning = false
      that.materialRequirement = materialRequirement
      let {supplierId,supplierName} = that.materialRequirement

      //是否指定供应商
      that.isDesignatedSupplier = (supplierId !== undefined && supplierId !== null) &&  +supplierId !== 0
      //没有物料要求的时候  可选供应商 是同部门该物料的供应商都可以用
      //有采购要求 并且指定供应商了 只能选择被指定的几个供应商 且是自己部门的数据
      if(that.isDesignatedSupplier){
        // that.form = {...that.form}
        let supplierArr = supplierId.split(',').map(v => +v)
        that.supplierList = that.supplierList.filter(c => {
          return supplierArr.includes(+c.id)
        })
      }
    },
    async initMaterialRequired() {
      const that = this
      that.spinning = true
      const materialRequirement = await getBuyRequirement({ materialId: that.record.materialId })
        .then(res => res.data)
        .catch(err => {
          that.spinning = false
          console.log(err)
          return {}
        })

      that.spinning = false

      that.materialRequirement = materialRequirement

      // if (materialRequirement === null) {
      //   const msg = `物料名称：${that.record.materialName} 要求获取失败`
      //   that.$message.error(msg)
      // }


      if (materialRequirement) {
        const _manageBrands = materialRequirement.buyRequirementBrands.map(c => {
          const obj = { ...c }
          obj.manageBrandModels = that.$_.cloneDeep(obj.buyRequirementBrandModels)
          delete obj.buyRequirementBrandModels
          return obj
        })

        that.form = {
          ...that.form,
          // supplierId:materialRequirement.supplierId,

          invoiceType: materialRequirement.invoiceType, //物流发票类型(0为无限，1为增值税专用发票，2为普通发票)
          deliveryCycle: materialRequirement.maxDelivery, //交货期
          lowestNum: materialRequirement.maxPurchase, //采购量
          shelfLife: materialRequirement.minWarranty, //最短质保期
          nakedPrice: materialRequirement.nakedPrice, //裸价的标准(0为含运费，1为不含运费)
          packageType: materialRequirement.packMethod, //包装方式
          // packType:materialRequirement.packType,//是否固定包装(1是固定，2是不固定)
          packageCount: materialRequirement.pageNum, //包内数量
          newPrice: materialRequirement.price, //最新采购价格
          materialRate: materialRequirement.taxRate, //物料税率
          manageBrands: _manageBrands
        }

        that.extendsValidate = {
          deliveryCycle: materialRequirement.maxDelivery || undefined,
          shelfLife: materialRequirement.minWarranty || undefined
        }
      }
      else {
        // that.form = {
        //   ...that.form,
        //   lastPrice: newLastPrice
        // }
      }
    },

    async fillSupplierInfo(v) {
      const that = this
      that.spinning = true
      //根据物料id获取该物料最新采购价  目前尚未使用
      const newLastPrice = await getOrderLastPrice({ materialId: that.record.materialId })
        .then(res => {
          if (res && res.code === 200) {
            return res.data || 0
          } else {
            that.$message.info(`获取物料最新采购单价失败:${res.msg}`)
            return 0
          }
        })
        .catch(err => {
          that.$message.info(`获取物料最新采购单价失败:${err}`)
          return 0
        })
      await getSupplierOffer({ materialId: that.record.materialId, supplierId: v })
        .then(res => {
          that.supplierRequirement = res.data
          that.isvalidateMaterialRequiredAndSupplierRequired = false
          const supplierRequirement = { ...that.supplierRequirement }
          const {
            buyRequirement,
            supplierId,
            materialId,
            packageType,
            packageCount,
            lastPrice,
            // settlementMode,
            invoiceType,
            nakedPrice,
            newPrice,
            materialRate,
            freightRate,
            lowestNum,
            deliveryCycle,
            shelfLife,
            manageBrandLists : manageBrands
          } = supplierRequirement

          //先填充供应商信息，供应商未提供的  物料需求里面有的 就用 物料需求里面的
          let materialRequirement = that.materialRequirement || {}
          const _buyRequirementBrands = materialRequirement && materialRequirement.buyRequirementBrands
            ? [...materialRequirement.buyRequirementBrands] : []
          const _manageBrands = _buyRequirementBrands.map(c => {
              const obj = { ...c }
              obj.manageBrandModels = that.$_.cloneDeep(obj.buyRequirementBrandModels)
              delete obj.buyRequirementBrandModels
              return obj
            })
          let isExists = (obj) => obj !== undefined && obj !== null
          that.form = {
            ...that.form,
            //buyRequirement ,
            // supplierId: String(supplierId),
            // materialId,
            packageType: isExists(packageType) ? packageType : isExists(materialRequirement.packMethod) ? materialRequirement.packMethod : undefined,
            packageCount:isExists(packageCount) ? packageCount : isExists(materialRequirement.pageNum) ? materialRequirement.pageNum : undefined,
            // settlementMode,
            invoiceType:isExists(invoiceType) ? invoiceType : isExists(materialRequirement.invoiceType) ? materialRequirement.invoiceType : undefined,
            lastPrice: newLastPrice,
            nakedPrice:isExists(nakedPrice) ? nakedPrice : isExists(materialRequirement.nakedPrice) ? materialRequirement.nakedPrice : undefined,
            newPrice:isExists(newPrice) ? newPrice : isExists(materialRequirement.price) ? materialRequirement.price : undefined,
            materialRate:isExists(materialRate) ? materialRate : isExists(materialRequirement.taxRate) ? materialRequirement.taxRate : undefined,
            freightRate,
            lowestNum:isExists(lowestNum) ? lowestNum : isExists(materialRequirement.maxPurchase) ? materialRequirement.maxPurchase : undefined,
            deliveryCycle : isExists(deliveryCycle) ? deliveryCycle : isExists(materialRequirement.maxDelivery) ? materialRequirement.maxDelivery : undefined,
            shelfLife:isExists(shelfLife) ? shelfLife : isExists(materialRequirement.minWarranty) ? materialRequirement.minWarranty : undefined,
            manageBrands:Array.isArray(manageBrands) && manageBrands.length > 0 ? manageBrands : Array.isArray(_manageBrands) && _manageBrands.length > 0 ? _manageBrands : undefined,
          }

          that.extendsValidate = {
            deliveryCycle : isExists(deliveryCycle) ? deliveryCycle : isExists(materialRequirement.maxDelivery) ? materialRequirement.maxDelivery : undefined,
            shelfLife:isExists(shelfLife) ? shelfLife : isExists(materialRequirement.minWarranty) ? materialRequirement.minWarranty : undefined,
          }

        })
        .catch(err => {
          console.log(err)
        })
      that.spinning = false
    },

    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (
            that.needValidateMaterialRequiredAndSupplierRequired &&
            !that.validateMaterialRequiredAndSupplierRequired()
          ) {
            return
          }

          that.spinning = true
          let params = that.$_.cloneDeep(that.form)
          const { manageBrands } = params
          if(Array.isArray(manageBrands)){
            let arr = []
            manageBrands.map(c => {
              arr.push(`${c.brandName}:${c.manageBrandModels.map(c1 => c1.modelName).join(',')}`)
            })
            params.model = arr.join(';')
          }else{
            params.model = '无'
          }

          if (+params.source === 3) {
            params.lastId = that.record.id
          }

          quotationAdd(params)
            .then(res => {
              that.spinning = false
              that.$message.info(res.msg)
              if (res.code === 200) {
                that.$emit('finished')
                that.handleCancel()
              }
            })
            .catch(err => {
              that.spinning = false
              that.$message.info(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    handleCancel() {
      this.resetForm()
      this.visible = false
    },
    async hasSupplierChange(v) {
      const that = this
      that.form = { ...that.form, supplierId: undefined, supplierName: undefined }
      that.needValidateMaterialRequiredAndSupplierRequired = +v === 1
      await that.initMaterialRequired()

      await that.$refs.ruleForm.validate()
    },
    supplierChangeHandler(v) {
      const that = this

      const supplierList = [...that.supplierList]
      const target = supplierList.find(item => +item.id === +v)
      if (target) {
        that.form = { ...that.form, supplierName: target.supplierName,supplierId:v ,settlementMode:target.settlementMode}
      }else{
        that.form = { ...that.form, supplierName: undefined,supplierId:undefined ,settlementMode:undefined}
      }

      if(v){
        that.fillSupplierInfo(v)
      }

      //判断供应商是否有采购某一物料的资格，返回true为有资格
      // quotationCheckSupplier({supplierId:v,materialId:that.record.materialId}).then(res => {
      //   console.log(res)
      // })
    },

    validateMaterialRequiredAndSupplierRequired() {
      const that = this
      let isExists = (obj) => obj !== undefined && obj !== null
      const buyRequirement = that.supplierRequirement.buyRequirement
      if(!buyRequirement){
        return true
      }
      const {
        supplierId,
        materialId,
        packageType,
        packageCount,
        lastPrice,
        settlementMode,
        invoiceType,
        nakedPrice,
        newPrice,
        materialRate,
        freightRate,
        lowestNum,
        deliveryCycle,
        shelfLife,
        manageBrands
      } = that.form

      const arrCase = []
      if (
        Array.isArray(manageBrands) &&
        Array.isArray(buyRequirement.buyRequirementBrands) &&
        buyRequirement.buyRequirementBrands.length > 0
      ) {
        //比较品牌
        const _manageBrands = [...manageBrands]
        const _buyRequirementBrands = [...buyRequirement.buyRequirementBrands]

        const brandsCaseList = _buyRequirementBrands.map(c1 => {
          //物料
          const mid = c1.brandId
          const subMids = Array.isArray(c1.buyRequirementBrandModels)
            ? c1.buyRequirementBrandModels.map(_c1 => _c1.modelId).join(',')
            : ''
          //供应商
          const target = _manageBrands.find(c => c.brandId === mid)
          const _mid = target ? target.brandId : null
          const _subMids =
            target && Array.isArray(target.manageBrandModels)
              ? target.manageBrandModels.map(_c1 => _c1.modelId).join(',')
              : ''
          return mid === _mid && _subMids.includes(subMids)
        })

        arrCase.push({
          msg: '供应商提供的品牌型号和物料要求的品牌型号不匹配',
          result: brandsCaseList.every(c => c),
          fix: () => {
            const _manageBrands = _buyRequirementBrands.map(c => {
              const obj = { ...c }
              obj.manageBrandModels = that.$_.cloneDeep(obj.buyRequirementBrandModels)
              delete obj.buyRequirementBrandModels
              return obj
            })
            that.form = {
              ...that.form,
              manageBrands: _manageBrands
            }
          }
        })
      }

      if (isExists (buyRequirement.packMethod) && isExists( buyRequirement.pageNum)) {
        //比较包装类型和数量
        //是否固定包装(1是固定，2是不固定)
        if (buyRequirement.packType === 1) {
          const { packMethod, pageNum } = buyRequirement
          arrCase.push({
            msg: `包装类型和包装数量不匹配，供应商提供为【${packageCount}/${packageType}】物料要求为【${pageNum}/${packMethod}】`,
            result: packMethod === packageType && pageNum === packageCount,
            fix: () => {
              that.form = {
                ...that.form,
                packageType: buyRequirement.packMethod,
                packageCount: buyRequirement.pageNum
              }
            }
          })
        }
      }
      if (isExists(buyRequirement.nakedPrice) && +buyRequirement.nakedPrice >= 1) {
        //对比裸价标准
        const mapNakedPrice = { 1: '含税运', 2: '含税不含运' }
        arrCase.push({
          msg: `裸价标准不匹配，供应商提供为【${mapNakedPrice[nakedPrice] || '无'}】物料要求为【${mapNakedPrice[
            buyRequirement.nakedPrice
          ] || '无'}】`,
          result: nakedPrice === buyRequirement.nakedPrice,
          fix: () => {
            that.form = {
              ...that.form,
              nakedPrice: buyRequirement.nakedPrice
            }
          }
        })
      }
      if (isExists(buyRequirement.invoiceType) && +buyRequirement.invoiceType > 0) {
        //对比发票类型
        const mapInvoiceType = { 0: '不限', 1: '增值税专用发票', 2: '普通发票' }
        arrCase.push({
          msg: `发票类型不匹配，供应商提供为【${mapInvoiceType[invoiceType] || '无'}】物料要求为【${mapInvoiceType[
            buyRequirement.invoiceType
          ] || '无'}】`,
          result: invoiceType === buyRequirement.invoiceType,
          fix: () => {
            that.form = {
              ...that.form,
              invoiceType: buyRequirement.invoiceType
            }
          }
        })
      }
      if (isExists(buyRequirement.maxDelivery)) {
        //对比交货周期
        arrCase.push({
          msg: `交货周期不匹配，供应商提供为【${deliveryCycle}天】物料要求为最长【${buyRequirement.maxDelivery}天】`,
          result: deliveryCycle <= buyRequirement.maxDelivery,
          fix: () => {
            that.form = {
              ...that.form,
              deliveryCycle: buyRequirement.maxDelivery
            }
          }
        })
      }
      if (isExists(buyRequirement.minWarranty)) {
        //对比质保期
        arrCase.push({
          msg: `质保期不匹配，供应商提供质保期为【${shelfLife}】天，物料要求质保期为最短【${buyRequirement.minWarranty}】天`,
          result: shelfLife >= buyRequirement.minWarranty,
          fix: () => {
            that.form = {
              ...that.form,
              shelfLife: buyRequirement.minWarranty
            }
          }
        })
      }
      if ( isExists(buyRequirement.maxPurchase) && buyRequirement.maxPurchase > 0) {
        //对比采购量
        arrCase.push({
          msg: `采购量不匹配，供应商提供为【${lowestNum}】物料要求为【${buyRequirement.maxPurchase}】`,
          result: lowestNum <= buyRequirement.maxPurchase,
          fix: () => {
            that.form = {
              ...that.form,
              lowestNum: buyRequirement.maxPurchase
            }
          }
        })
      }
      if(isExists(buyRequirement.taxRate) && +buyRequirement.taxRate >=0 ){
        //对比物料税率
        arrCase.push({
          msg: `物料税率不匹配，供应商提供为【${materialRate}%】物料要求为【${buyRequirement.taxRate}%】`,
          result: +materialRate === +buyRequirement.taxRate,
          fix: () => {
            that.form = {
              ...that.form,
              materialRate: buyRequirement.taxRate
            }
          }
        })
      }

      //物料价格模式(1是固定价格模式，2是实时价格模式)
      //if(buyRequirement.priceModel === 1 && buyRequirement.price ){}
      if (isExists(buyRequirement.price) && buyRequirement.price > 0) {
        arrCase.push({
          msg: `最新采购价格不匹配，供应商提供为【${that.form.lastPrice || 0}元】物料要求为【${buyRequirement.price ||
            0}元】`,
          result: that.form.lastPrice === buyRequirement.price || that.form.newPrice === buyRequirement.price,
          fix: () => {
            that.form = {
              ...that.form,
              newPrice: buyRequirement.price
            }
          }
        })
      }
      const errorList = arrCase.filter(c => !c.result)
      if (errorList.length > 0) {
        that.$confirm({
          title: '提示',
          content: (
            <div class="__notice-wrapper">
              {errorList.map(c => (
                <p>{c.msg}</p>
              ))}
              <p>确定要使用物料要求覆盖供应商的要求吗？</p>
            </div>
          ),
          width: 650,
          onOk: () => {
            errorList.map(c => {
              c.fix && c.fix()
            })
          },
          onCancel() {}
        })
      }
      return errorList.length === 0
    },

    brandsAction(type){
      //添加品牌型号
      let that = this
      that.$refs.brandFrom.query(that.$_.cloneDeep((that.form.manageBrands || [])))
    },
    brandChange(data) {
      const that = this
      let manageBrands = [...data]
      that.form = {
        ...that.form,
        manageBrands,
        modelName: manageBrands.map(c => c.brandName).join(','),
        modelType: manageBrands.map(c => [...c.manageBrandModels.map(c1 => c1.modelName)]).join(',')
      }
    },
    isExists (obj) {
      return obj !== undefined && obj !== null
    }
  }
}
</script>

<style scoped>
.ask-price-form-wrapper >>> .ant-card {
  margin-bottom: 20px;
}
.ask-price-form-wrapper >>> .ant-card:last-child {
  margin-bottom: 0;
}
.ask-price-form-wrapper >>> .ant-card .ant-card-body {
  padding: 10px 0;
}
.ask-price-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
</style>
