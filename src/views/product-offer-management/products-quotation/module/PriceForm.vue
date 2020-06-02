<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper" id="add-form-wrapper">
        <a-row type="flex" justify="space-around" align="middle">
          <a-col :span="18">
            <a-row type="flex" justify="space-around" align="middle">
              <a-col :span="2">
                <img src="@/assets/icon_contract.jpg" style="width:48px;height:56px;" alt="合同图标" />
              </a-col>
              <a-col :span="22">
                <div>江苏万德福公共设施科技有限公司</div>
                <div>JiangSu Wonderful Infrastructure Manufacturing co.,Ltd</div>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="6">
            <h2 style="padding-left:20px;border-left:3px solid rgba(0, 0, 0, 0.85);">公司产品报价单</h2>
          </a-col>
        </a-row>

        <div class="add-form__bd-item" style="border:none;">
          <a-row type="flex" justify="space-around" align="middle">
            <a-col :span="6">
              <a-form-item label="报单编号">{{quoteCode}}</a-form-item>
            </a-col>
            <a-col :span="6" :offset="11">
              <a-form-item label="报价时间">
                <a-date-picker
                  style="width:100%;"
                  v-decorator="['quoteTime',{initialValue:moment(),rules: [{required: true,message: '输入报价时间'}]}]"
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <div class="add-form__bd-item">
          <a-row>
            <a-col :span="9" :offset="1">
              <a-form-item label="报价方">江苏万德福公共设施科技有限公司</a-form-item>
              <a-form-item label="联系人">
                <a-select
                  :allowClear="true"
                  v-decorator="['saleUserId',{rules: [{ required: true, message: '请选销售经理'}]} ]"
                  placeholder="请选销售经理"
                  style="width: 100%;"
                >
                  <a-select-option
                    v-for="item in saleUserList"
                    :value="item.userId"
                    :key="item.userId"
                  >{{ item.salesmanName }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="电话">
                <a-input v-decorator="['saleUserPhone']" placeholder="电话" :allowClear="true" />
              </a-form-item>
            </a-col>
            <a-col :span="9" :offset="4">
              <CustomerSelect
                ref="customerSelect"
                :options="customerSelectOptions"
                @selected="handleCustomerSelected"
              />
              <a-form-item hidden>
                <a-input v-decorator="['customerId']" />
              </a-form-item>
              <a-form-item label="联系人">
                <a-input
                  v-decorator="['customerContacts',{rules: [{ required: true, message: '输入询价方联系人' }]}]"
                  placeholder="询价方联系人"
                  :allowClear="true"
                />
              </a-form-item>
              <a-form-item label="电话">
                <a-input
                  v-decorator="['customerMobile',{rules: [{ required: true, message: '输入询价方电话' }]}]"
                  placeholder="询价方电话"
                  :allowClear="true"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <div class="add-form__bd-item">
          <p>以下为贵公司询价产品明细，请详阅：如有疑问，请及时与我司联系，谢谢！</p>
          <table class="custom-table custom-table-border">
            <tr>
              <td>产品名称</td>
              <td>图片</td>
              <td>数量</td>
              <td>单价</td>
              <td>总价</td>
              <td>备注</td>
            </tr>
            <tr>
              <td>
                <a-form-item>
                  <template v-if="!isView">
                  <a-input
                    v-decorator="['productName',{rules: [{ required: true, message: '产品名称' }]}]"
                    placeholder="产品名称"
                    :allowClear="true"
                  />
                  </template>
                  <template v-else>
                    {{productName}}
                  </template>
                </a-form-item>
              </td>
              <td style="width:96px;">
                <a-form-item>
                  <template v-if="!isView">
                  <img
                    @click="uploadFileModel(productPic)"
                    style="width:100%;height:auto;overflow:hidden;cursor: pointer;"
                    :src="productPic"
                  />
                  </template>
                  <template v-else>
                    <img style="width:100%;height:auto;overflow:hidden;cursor: pointer;" :src="productPic" />
                  </template>
                </a-form-item>
              </td>
              <td style="width:120px;">
                <a-form-item>
                  <template v-if="!isView">
                  <a-input-number
                    style="width:100%;"
                    :min="1"
                    :step="1"
                    v-decorator="['productNum', { initialValue:1,rules: [{ required: true, message: '请输入数量' }]}]"
                    @change="qtyChange"
                  />
                  </template>
                  <template v-else>
                    {{qty}}
                  </template>
                </a-form-item>
              </td>
              <td style="width:240px;">
                <a-form-item>
                  <a-row>
                    <template v-if="!isView">
                    <a-col :span="10">
                      <a-select 
                        style="width:80px;"
                        placeholder="价格"
                        @change="unitPriceSelectChange"
                      >
                        <a-select-option value="aprice">A价</a-select-option>
                        <a-select-option value="bprice">B价</a-select-option>
                        <a-select-option value="cprice">C价</a-select-option>
                        <a-select-option value="retailPrice">市场价</a-select-option>
                        <a-select-option value="otherPrice">其他</a-select-option>
                      </a-select>
                    </a-col>
                    <a-col :span="14">
                      <a-input-number
                        :disabled="!unitPriceEdit"
                        style="width:120px;"
                        :min="0"
                        :step="1"
                        :precision="2"
                        v-decorator="['unitPrice', {rules: [{ required: true, message: '请输入单价' }]}]"
                        @change="unitPriceChange"
                      />
                    </a-col>
                    </template>
                    <template v-else>
                      <a-col :span="24">
                        {{unitPrice | moneyFormatNumber}}
                      </a-col>
                    </template>
                  </a-row>
                </a-form-item>
              </td>
              <td>
                <a-form-item>{{clacPrice | moneyFormatNumber}}</a-form-item>
              </td>
              <td style="width:100px;">
                <a-form-item>
                  <template v-if="!isView">
                  <a-switch 
                    checked-children="含税" 
                    un-checked-children="不含税" 
                    default-checked 
                    :checked="hasTax" 
                    @change="taxChange"
                  />
                  </template>
                  <template v-else>
                    {{hasTax ? '含税' : '不含税'}}
                  </template>
                  <!-- <a-radio-group v-decorator="['remark',{initialValue: 1}]">
                  <a-radio :value="1">含税</a-radio>
                  <a-radio :value="0">不含税</a-radio>
                  </a-radio-group>-->
                </a-form-item>
              </td>
            </tr>
          </table>
        </div>

        <div class="add-form__bd-item">
          <p>产品功能清单：</p>
          <SelectProductViewHTML key="v2" :productInfo="viewDataSourceHTMLWithoutTitle" />
        </div>

        <div class="add-form__bd-item">
          <p>报价说明：</p>
          <a-form-item>
            <a-textarea
              placeholder="报价说明"
              :rows="5"
              v-decorator="['quoteExplain', { rules: [{ required: false, message: '报价说明' }] }]"
            />
          </a-form-item>
        </div>
      </a-form>
      <UploadFile ref="uploadFile" @change="uploadFileChange" />
    </a-spin>
  </a-modal>
</template>

<script>
import { getListSaleContractUser } from '@/api/contractListManagement'
import { priceAdjustProductQuoteAddOrUpdate ,priceAdjustProductQuoteDetail} from '@/api/productOfferManagement'
import moment from 'moment'
import CustomerSelect from '@/components/CustomerList/CustomerSelect'
import SelectProductViewHTML from './SelectProductViewHTML'
import UploadFile from './UploadFile'
import util from '@/components/_util/util'
export default {
  name: 'AddForm',
  components: {
    CustomerSelect,
    UploadFile,
    SelectProductViewHTML
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'addForm' }),
      visible: false,
      actionType: 'add',
      spinning: false,
      saleUserList: [],
      customerSelectOptions: {
        inputLabel: '询价方',
        wrapperStyle: {},
        formLayout: 'inline',
        formItemLayout: {
          labelCol: { span: '' },
          wrapperCol: { span: '' }
        },
        inputRequired: true,
        inputAllowClear: true
      },
      productName:'',
      quoteCode:'',
      productPic: '',
      unitPrice: 0,
      qty: 0,
      unitPriceEdit: false, //单价为其他时候可以编辑
      hasTax:true,
      record: {},
      viewDataSourceHTMLWithoutTitle:{}
    }
  },
  computed: {
    modalTitle() {
      let m = {
        view: '查看',
        add: '新增',
        edit: '修改',
        approval: '审批'
      }
      return `${m[this.actionType]}报价单`
    },
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      return this.isView || this.isApproval
    },
    clacPrice() {
      let qty = parseInt(this.qty) || 1
      let price = parseFloat(this.unitPrice) || 0
      return (qty * price).toFixed(2)
    }
  },
  methods: {
    moment,
    init() {
      let that = this
      let queue = []
      let task1 = getListSaleContractUser().then(res => (that.saleUserList = res.data))
      queue.push(task1)
      return Promise.all(queue)
    },
    async handleOk() {
      let that = this
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }

      let customerSelectResult = await this.$refs.customerSelect.validate().then(res => res)
      console.log(customerSelectResult)
      if (customerSelectResult.err) {
        return
      }
      //values.saleCustomerId = customerSelectResult.values.customerId
      //values.customerName = customerSelectResult.values.customerName
      this.form.validateFields((err, values) => {
        if (!err) {
          if (that.isEdit) {
            values.id = that.record.id
          }

          values.productNum = that.qty
          values.unitPrice = that.unitPrice
          values.productPic = that.productPic
          values.quoteTime = values.quoteTime.format('YYYY-MM-DD')
          values.productQuoteChooses = [
            ...that.record._viewDataSource.optStand.map(p => {
              return { itemName: p.itemName, type: 1 }
            }),
            ...that.record._viewDataSource.optSelect.map(p => {
              return { itemName: p.itemName, type: 2 }
            })
          ]
          console.log('Received values of form: ', values)
          that.spinning = true
          priceAdjustProductQuoteAddOrUpdate(values)
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
              console.log(err)
              that.$message.error('操作失败')
              that.spinning = false
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.actionType = type
      that.record = record || {}
      that.form.resetFields()

      await that.init()
      that.visible = true


      that.$nextTick(() => {
        if(that.isAdd){
          that.addAction()
        }else{
          that.editAction()
        }
      })
    },
    addAction(){
      let that = this
      that.productPic = that.record.productPic
      that.viewDataSourceHTMLWithoutTitle = that.record._viewDataSource
      that.form.setFieldsValue({ productName: that.record.name })
    },
    editAction(){
      let that = this
      priceAdjustProductQuoteDetail({id:this.record.id}).then(res =>{
        that.form.setFieldsValue({...res.data})

        if(res.data.quoteTime){
          that.form.setFieldsValue({quoteTime:that.moment(res.data.quoteTime)})
        }

        that.hasTax = !!res.data.remark
        //quoteTime
        that.$refs.customerSelect.fill({
          name:res.data.customerName,
          id:res.data.customerId
        })
        that.productName = res.data.productName
        that.quoteCode = res.data.quoteCode
        that.productPic = res.data.productPic
        that.unitPrice = +res.data.unitPrice
        that.qty = +res.data.productNum
        that.unitPriceEdit = false 
        that.viewDataSourceHTMLWithoutTitle = {
          __config: {
            showTitle: false
          },
          optStand:[...res.data.productQuoteChooses.filter(p => +p.type === 1)],
          optSelect:[...res.data.productQuoteChooses.filter(p => +p.type === 2)],
        }
          
        console.log(res)
      })
    },
    handleCustomerSelected(item) {
      //this.queryParam.customerId = item.id
      this.form.setFieldsValue({ customerId: item && item.id ? item.id : undefined })
    },
    handleCustomerClear() {
      //'customerId' in this.queryParam && delete this.queryParam.customerId
      this.form.setFieldsValue({ customerId: undefined })
    },
    unitPriceSelectChange(val) {
      this.unitPriceEdit = val === 'otherPrice'
      try {
        this.unitPrice = parseFloat(this.record._costPrice[val]) || 0
        this.form.setFieldsValue({ unitPrice: this.unitPrice })
      } catch (err) {
        this.unitPrice = 0
        console.log('获取单价失败：', val)
        console.log(err)
      }
    },
    unitPriceChange(val) {
      this.unitPrice = +val
      this.form.setFieldsValue({ unitPrice: this.unitPrice })
    },
    qtyChange(val) {
      this.qty = +val
      this.form.setFieldsValue({ productNum: this.qty })
    },
    uploadFileModel(url) {
      if (this.$refs.uploadFile) {
        this.$refs.uploadFile.query()
        this.$nextTick(() => this.$refs.uploadFile.setFiles([{ url: url }]))
      }
    },
    uploadFileChange(fileList) {
      let target = fileList.find(f => !!f.url)
      if (target) {
        this.productPic = target.url
      }
    },
    taxChange(checked){
      this.hasTax = checked
    }
  }
}
</script>

<style scoped>
.add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}
.add-form-wrapper >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.add-form-wrapper >>> .ant-form-item .ant-form-item-label {
  width: 100px;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.add-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}

.add-form__bd-item {
  padding: 20px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.85);
}
</style>