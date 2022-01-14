<template>
  <a-spin :spinning="spinning">
    <a-form-model ref="ruleForm" :model="form" :rules="rules" class="repair-form-wrapper">
      <div class="card-item">
        <div class="__hd">基本信息</div>
        <div class="__bd">
          <table class="custom-table custom-table-border">
            <tr>
              <td style="width:150px;">入库申请单号</td>
              <td style="width:350px;">
                <a-form-model-item>
                  <span v-if="form.storageCode">{{ form.storageCode }}</span>
                  <span v-else style="color:#bfbfbf;">系统自动生成</span>
                </a-form-model-item>
              </td>
              <td style="width:150px;">销售经理</td>
              <td style="width:350px;">
                <a-form-model-item prop="salesManagerId">
                  <a-select
                    :disabled="isDisabled"
                    :allowClear="true"
                    v-model="form.salesManagerId"
                    placeholder="请选择销售经理"
                    @change="saleUserChange"
                  >
                    <a-select-option v-for="item in saleUsers" :value="item.userId" :key="item.userId">{{
                      item.salesmanName
                    }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </td>
            </tr>

            <tr>
              <td style="width:150px;">客户名称</td>
              <td style="width:350px;">
                <a-form-model-item prop="customerId">
                  <CustomerSelect
                    v-if="!isDisabled"
                    style="width:100%;"
                    ref="customerSelect"
                    :needOptions="needOptions"
                    :options="customerSelectOptions"
                    @selected="handleCustomerSelected"
                    @inputClear="handleCustomerSelected"
                  />
                  <span v-else>{{ form.customerName }}</span>
                </a-form-model-item>
              </td>
              <td>紧急程度</td>
              <td>
                <a-form-model-item prop="useStatus">
                  <a-select :disabled="isDisabled" v-model="form.urgentType" placeholder="状态" style="width:100%;">
                    <a-select-option :value="1">一般</a-select-option>
                    <a-select-option :value="2">紧急</a-select-option>
                    <a-select-option :value="3">特急</a-select-option>
                  </a-select>
                </a-form-model-item>
              </td>
            </tr>

            <tr>
              <td>日期</td>
              <td>
                <a-form-model-item prop="storageDate">
                  <a-date-picker :disabled="isDisabled" style="width:100%;" v-model="form.storageDate" />
                </a-form-model-item>
              </td>
              <td>销售合同</td>
              <td>
                <a-form-model-item prop="salesContractId">
                  <a-select
                    :disabled="isDisabled"
                    v-model="form.salesContractId"
                    placeholder="选择销售合同"
                    style="width:100%;"
                    @change="handleContractChange"
                  >
                    <a-select-option v-for="item in contractList" :key="item.id">{{
                      item.contractNum
                    }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </td>
            </tr>

            <tr>
              <td style="width:150px;">发货单</td>
              <td style="width:350px;">
                <a-form-model-item prop="invoiceId">
                  <a-select
                    :disabled="isDisabled"
                    v-model="form.invoiceId"
                    placeholder="选择发货单"
                    style="width:100%;"
                    @change="handleInvoiceChange"
                  >
                    <a-select-option v-for="item in invoiceList" :key="item.id">{{ item.invoiceNum }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </td>
              <td style="width:150px;">入库仓库</td>
              <td style="width:350px;">
                <a-form-model-item prop="warehouseId">
                  <a-select
                    :disabled="isDisabled"
                    v-model="form.warehouseId"
                    placeholder="选择入库仓库"
                    style="width:100%;"
                    @change="handleWarehouseChange"
                  >
                    <a-select-option v-for="item in warehouseList" :key="item.id">{{
                      item.warehouseName
                    }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </td>
            </tr>
          </table>
        </div>
        <div class="__hd">发货单信息</div>
        <div class="__bd">
          <a-table :columns="columns_send" :dataSource="sendTableList" :pagination="false" size="small">
            <div slot="order" slot-scope="text, record, index">
              {{ index + 1 }}
            </div>
            <div slot="company" slot-scope="text">
              {{ { 0: '套', 1: '台', 2: '个', 3: '块', 4: '条', 5: '根', 6: '张', 7: '卷' }[text] || '未知' }}
            </div>
          </a-table>
        </div>
        <div class="__hd">物料信息</div>
        <div class="__bd">
          <a-table :columns="columns" :dataSource="form.materialTableList" :pagination="false" size="small">
            <div slot="order" slot-scope="text, record, index">
              {{ index + 1 }}
            </div>

            <div slot="materialCode" slot-scope="text, record, index">
              <a-form-model-item
                :prop="`materialTableList.${index}.materialCode`"
                :rules="{ required: true, message: '请选择物料' }"
              >
                <a-select
                  :disabled="isDisabled"
                  :value="record.materialId"
                  placeholder="选择物料"
                  style="width:180px;"
                  @change="handlerMaterialChange"
                >
                  <a-select-option v-for="item in sendTableList" :key="item.id">
                    {{item.productModel}}
                  </a-select-option>
                </a-select>
                <!-- <MaterialFuzzySearch
                  :disabled="isDisabled"
                  :materialInfo="form.materialTableList[0]"
                  style="width:250px;"
                  @change="handlerMaterialChange"
                /> -->
              </a-form-model-item>
            </div>

            <div slot="materialName" slot-scope="text, record">
              <a-popover title="物料信息">
                <template slot="content">
                  <h3>物料名称</h3>
                  <p style="width:450px;">{{ record.materialName }}</p>
                  <h3>规格型号</h3>
                  <p style="width:450px;">{{ record.specification }}</p>
                  <h3>物料代码</h3>
                  <p style="width:450px;">{{ record.materialCode }}</p>
                </template>
                <span>{{ text }}</span>
              </a-popover>
            </div>
            <div slot="repairNum" slot-scope="text, record, index">
              <a-form-model-item
                :prop="`materialTableList.${index}.repairNum`"
                :rules="{ required: true, message: '请输入返修数量' }"
              >
                <a-input-number
                  :disabled="isDisabled"
                  style="width:80px;text-align:center;"
                  :max="record.__maxRepairNum"
                  :min="0"
                  :step="1"
                  :precision="0"
                  :value="record.repairNum || record.__maxRepairNum"
                  @change="(val) => handleRepairNumChange(record,val)"
                />
              </a-form-model-item>
            </div>
            <div slot="weight" slot-scope="text, record, index">
              <a-form-model-item
                :prop="`materialTableList.${index}.weight`"
                :rules="{ required: true, message: '请输产品重量' }"
              >
                <a-input-number
                  :disabled="isDisabled"
                  style="width:80px;text-align:center;"
                  :min="0"
                  :step="1"
                  :precision="0"
                  v-model="record.weight"
                />
              </a-form-model-item>
            </div>
            <div slot="remarks" slot-scope="text, record">
              <a-form-model-item>
                <a-textarea :disabled="isDisabled" v-model="record.materialRemarks" placeholder="备注" auto-size />
              </a-form-model-item>
            </div>
          </a-table>
        </div>
        <div class="__hd">返修说明</div>
        <div class="__bd">
          <a-form-model-item prop="remarks">
            <a-textarea :disabled="isDisabled" v-model="form.remarks" placeholder="返修说明" :rows="4" />
          </a-form-model-item>
        </div>

        <div class="__footer">
          <a-button @click="handleSubmit('cancel')">取消</a-button>
          <a-button v-if="isAdd || isEdit" @click="handleSubmit('submit')" type="primary">提交</a-button>
          <template v-if="isApproval">
            <a-button type="primary" @click="passAction">通过</a-button>
            <a-button @click="noPassAction" style="margin:0 10px;">不通过</a-button>
          </template>
        </div>
      </div>
    </a-form-model>
    <Approval ref="approval" @opinionChange="opinionChange" />
  </a-spin>
</template>

<script>
import { getOrderList } from '@api/order'
import { getSalesList /* 销售合同 */ } from '@/api/contractListManagement'
import { getInvoiceList /* 发货单 */ } from '@/api/invoice'
//销售人员接口
import { getListSalesman } from '@/api/contractListManagement'
//客户列表选择
import CustomerSelect from '@/components/CustomerList/CustomerSelect'
import Approval from './Approval'
import {
  storageRepairAddOrUpdate,
  storageRepairDetail,
  storageRepairApproval,
  getWarehouseList
} from '@/api/storage_wzz'
import moment from 'moment'
import MaterialFuzzySearch from '@/components/CustomerList/MaterialFuzzySearch'

const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode',
    scopedSlots: { customRender: 'materialCode' }
  },
  {
    title: '物料名称',
    dataIndex: 'materialName',
    scopedSlots: { customRender: 'materialName' }
  },
  {
    title: '辅计量单位',
    dataIndex: 'subUnit'
  },

  {
    title: '返修数量',
    dataIndex: 'repairNum',
    scopedSlots: { customRender: 'repairNum' }
  },
  {
    title: '产品重量',
    dataIndex: 'weight',
    scopedSlots: { customRender: 'weight' }
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    scopedSlots: { customRender: 'remarks' }
  }
]
const columns_send = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '物料代码',
    dataIndex: 'productModel'
  },
  {
    title: '物料名称',
    dataIndex: 'productName'
  },
  {
    title: '规格型号',
    dataIndex: 'productStandard'
  },
  {
    title: '单位',
    dataIndex: 'company',
    scopedSlots: { customRender: 'company' }
  },
  {
    title: '数量',
    dataIndex: 'invoiceCount'
  }
]

export default {
  name: 'RepairForm',
  components: {
    MaterialFuzzySearch,
    CustomerSelect,
    Approval
  },
  inject: ['addForm'],
  data() {
    return {
      columns,
      columns_send,
      form: {
        urgentType: 1,
        storageDate: moment(),
        materialTableList: [{}] //物料信息
      },
      rules: {
        salesManagerId: [{ required: true, message: '请选择销售经理', trigger: 'change' }],
        customerId: [{ required: true, message: '请选择客户名称', trigger: 'change' }],
        salesContractId: [{ required: true, message: '请选择销售合同', trigger: 'change' }],
        invoiceId: [{ required: true, message: '请选择发货单', trigger: 'change' }],
        warehouseId: [{ required: true, message: '请选择入库仓库', trigger: 'change' }],
        remarks: [{ required: true, message: '请输入返修说明', trigger: 'blur' }]
      },
      warehouseList: [],
      sendTableList: [],
      saleUsers: [],
      customerSelectOptions: {
        inputLabel: '',
        wrapperStyle: {
          width: '100%'
        },
        // formLayout: 'inline',
        formItemLayout: {
          labelCol: { span: '' },
          wrapperCol: { span: '' }
        },
        inputRequired: true,
        inputAllowClear: true,
        inputDisable: false
      },
      needOptions: {
        userId: undefined
      },
      contractList: [],
      invoiceList: [],
      spinning: false
    }
  },
  computed: {
    record() {
      return this.addForm.record || null
    },
    isAdd() {
      return this.addForm.isAdd
    },
    isEdit() {
      return this.addForm.isEdit
    },
    isDisabled() {
      return this.addForm.isDisabled
    },
    isApproval() {
      return this.addForm.isApproval
    }
  },
  created() {
    this.init()
  },
  methods: {
    moment,
    async init() {
      const that = this

      that.spinning = true
      try{
        await getWarehouseList().then(res => (that.warehouseList = res.data))
        await getListSalesman().then(res => (that.saleUsers = res.data))
      }catch(err){
        that.spinning = false
      }

      if (that.addForm.isAdd) {
        that.spinning = false
      } else {
        if (that.record) {
          that.spinning = true
          await storageRepairDetail({ id: that.record.storageApplyId }).then(async res => {
            let data = res.data
            try{
              await that.saleUserChange(data.salesManagerId)
              that.$refs.customerSelect &&
                that.$refs.customerSelect.fill({
                  id: data.customerId,
                  name: data.customerName
                })
              await that.handleCustomerSelected({
                  id: data.customerId,
                  name: data.customerName
                })
              await that.handleContractChange(data.salesContractId)
            }catch(err){
              that.$message.error(err.message)
            }finally{
              that.spinning = false
            }
            that.form = {
              id: data.id,
              salesManagerId: data.salesManagerId,
              salesManagerName: data.salesManagerName,
              customerId: data.customerId,
              customerName: data.customerName,
              salesContractId: data.salesContractId,
              salesContractNum: data.salesContractNum,
              invoiceId: data.invoiceId,
              invoiceNum: data.invoiceNum,
              storageCode: data.storageCode,
              urgentType: data.urgentType,
              storageDate: moment(data.storageDate),
              warehouseId: data.warehouseId,
              warehouseName: data.warehouseName,
              remarks: data.remarks,
              materialTableList: [
                {
                  key: that._uuid(),
                  materialId: data.materialId,
                  materialName: data.materialName,
                  materialCode: data.materialCode,
                  specification: data.specification,
                  subUnit: data.subUnit,
                  storageNum: data.storageNum,
                  repairNum: data.repairNum,
                  weight: data.weight,
                  materialRemarks: data.materialRemarks
                }
              ]
            }

            that.handleInvoiceChange(data.invoiceId)

            that.handlerMaterialChange(data.materialId)

            // that.$nextTick(() => {
            //   that.$refs.ruleForm.validateField(['customerId'])
            // })
          }).catch(err => {
            that.spinning = false
            that.$message.error(err.message)
          })
        }
      }
    },
    handleRepairNumChange(record,val){
      const that = this
      let materialTableList = [...that.form.materialTableList]
      let target = materialTableList[0]
      target.repairNum = val
      that.form = {
        ...that.form,
        materialTableList
      }

      if(+val > target.__maxRepairNum){
        that.$message.info(`返修数量不可超过最大数量: ${target.__maxRepairNum}`)
      }
    },
    handlerMaterialChange(id) {
      // debugger
      const that = this
      const item = that.sendTableList.find(item => item.id === id)
      if(!item){
        console.error(`handlerMaterialChange called error: can't found id:${id}`)
        return 
      }
      let materialTableList = [...that.form.materialTableList]
      let target = materialTableList[0]
      target.materialId = item.id
      target.materialCode = item.productModel
      target.materialName = item.productName
      target.subUnit = {0:'套',1:'台',2:'个',3:'块',4:'条',5:'根',6:'张',7:'卷'}[item.company] || '未知'
      // target.weight = item.weight || 0
      target.specification = item.productStandard
      target.k3Code = item.k3Code || ''
      target.__maxRepairNum = item.invoiceCount

      that.form = {
        ...that.form,
        materialTableList
      }
    },
    handleSubmit(type) {
      const that = this
      if (type === 'cancel') {
        that.$emit('change', type)
        return
      } else if (type === 'submit') {
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            const params = {
              ...that.form,
              ...that.form.materialTableList[0],
              storageDate: moment(that.form.storageDate).format('YYYY-MM-DD')
            }
            delete params.materialTableList
            params.storageType = 2
            console.log(params)
            that.spinning = true
            storageRepairAddOrUpdate(params)
              .then(res => {
                that.spinning = false
                if (res.code === 200) {
                  that.$emit('change', type)
                }
                that.$message.success(res.msg)
              })
              .catch(err => {
                that.spinning = false
                console.log(err)
                that.$message.error(err.message)
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    saleUserChange(saleUserId) {
      const that = this
      if(!saleUserId){
        that.form = {
          ...that.form,
          salesManagerId: undefined,
          salesManagerName: undefined,
          customerId: undefined,
          customerName: undefined,
          salesContractId:undefined,
          salesContractNum: undefined,
          invoiceId:undefined
        }
        that.contractList = []
        that.sendTableList = []
        that.$refs.customerSelect && that.$refs.customerSelect.handleClear()
        return
      }

      let target = that.saleUsers.find(u => u.userId === saleUserId)
      that.needOptions = { userId: saleUserId }
      that.$refs.customerSelect && that.$refs.customerSelect.handleClear()
      that.form = {
        ...that.form,
        salesManagerId: saleUserId,
        salesManagerName: target.salesmanName,
        customerId: undefined,
        customerName: undefined
      }
    },
    handleCustomerSelected(item) {
      const that = this
      that.form = {
        ...that.form,
        customerId: item && item.id ? item.id : undefined,
        customerName: item && item.name ? item.name : undefined
      }
      if(!item){
        that.form = {
          ...that.form,
          salesContractId:undefined,
          salesContractNum: undefined,
          invoiceId:undefined
        }
        that.contractList = []
        that.sendTableList = []
      }
      that.$nextTick(() => {
        that.$refs.ruleForm.validateField(['customerId'])
      })

      return getOrderList({
        customerId: item.id,
        contractStatus: 1,
        approveStatus: 2,
        current: 1,
        size: 1000
      })
        .then(res => {
          that.contractList = res.data.records || []
          if (that.contractList.length === 0) {
            that.$message.info(`未找到客户【${item.name}】对应的合同`)
          }
        })
        .catch(err => {
          that.$message.error(err.message)
          that.contractList = []
        })
    },
    handleContractChange(salesContractId) {
      const that = this
      let target = that.contractList.find(c => c.id === salesContractId)
      that.form = {
        ...that.form,
        salesContractId,
        salesContractNum: target.contractNum,
        invoiceId:undefined
      }
      that.sendTableList = []

      return getInvoiceList({ contractId: salesContractId, current: 1, size: 1000 })
        .then(res => {
          that.invoiceList = res.data.records || []
          if (that.invoiceList.length === 0) {
            that.$message.info(`未找到合同编号【${salesContractId}】对应的发货单`)
          }
        })
        .catch(err => {
          that.$message.error(err.message)
          that.invoiceList = []
        })
    },
    handleInvoiceChange(invoiceId) {
      let target = this.invoiceList.find(item => item.id === invoiceId)
      if (target) {
        this.sendTableList = target.products
      } else {
        this.sendTableList = []
      }
    },

    handleWarehouseChange(warehouseId) {
      let target = this.warehouseList.find(item => item.id === warehouseId)
      this.form = {
        ...this.form,
        warehouseId: warehouseId,
        warehouseName: target.warehouseName
      }
    },

    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.storageApplyId })
      that.spinning = true
      storageRepairApproval(values)
        .then(res => {
          that.spinning = false
          that.$message.info(res.msg)
          if (res.code === 200) {
            that.$emit('change', 'approval')
          }
        })
        .catch(err => (that.spinning = false))
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion
      })
    }
  }
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px;
}
.custom-table-border {
  margin-bottom: 0;
}
.custom-table-border caption {
  text-align: left;
}
.repair-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
.__hd {
  font-size: 16px;
}
.__bd {
  margin-bottom: 10px;
}
.__footer {
  text-align: center;
  margin-top: 20px;
}
.__footer * {
  margin: 0 5px;
}
</style>
