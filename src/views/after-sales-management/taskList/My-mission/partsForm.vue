<template>
  <a-modal
    :title="modalTitle"
    :width="1300"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">保存</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form-model ref="ruleForm" :model="form" class="routine-addform-wrapper-baseInnerData">
        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td>任务单编号</td>
            <td>{{ record.taskNum }}</td>
            <td>客户名称</td>
            <td>{{ record.customerName }}</td>
          </tr>
          <tr>
            <td>产品名称</td>
            <td>
              <a-form-model-item
                prop="deviceInfoId"
                :rules="{
                  required: true,
                  message: '请选择产品名称',
                }"
              >
                <a-select v-model="form.deviceInfoId" placeholder="产品名称" @change="Productchange">
                  <a-select-option v-for="item in record.deviceInfoVoList" :value="item.id" :key="item.id">{{
                    item.productName
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </td>
            <td>主板号</td>
            <td>{{ form.mainBoardNo }}</td>
          </tr>
        </table>
        <div style="margin-top: 20px">
          <h3>
            配件清单
            <a-switch
              style="margin-left: 20px"
              checked-children="含税"
              un-checked-children="不含税"
              default-checked
              @change="onChange"
            />
          </h3>
          <a-table
            :columns="travelColumns"
            :dataSource="form.productInfoList"
            :pagination="false"
            bordered
            size="small"
          >
            <div slot="order" slot-scope="text, record, index">
              {{ index + 1 }}
            </div>

            <div slot="materialCode" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'productInfoList.' + index + '.materialCode'"
                :rules="{
                  required: true,
                  message: '请选择物料代码',
                }"
              >
                <a-input
                  read-only="read-only"
                  @click="openModel(record)"
                  placeholder="请选择物料代码"
                  :value="record.materialCode"
                />
              </a-form-model-item>
            </div>

            <div slot="quantity" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'productInfoList.' + index + '.quantity'"
                :rules="{
                  required: true,
                  message: '请选择数量',
                }"
              >
                <a-input-number
                  v-if="!isDisabled"
                  v-model="record.quantity"
                  @change="(value) => handleTravelRecordListChange(value, record)"
                />
              </a-form-model-item>
            </div>

            <div slot="money" slot-scope="text, record, index">
              {{ record.isWarranty === 0 ? '0' : record.quantity * record.unitPrice }}
            </div>

            <div slot="deliveryMode" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'productInfoList.' + index + '.deliveryMode'"
                :rules="{
                  required: true,
                  message: '请选择带货方式',
                }"
              >
                <a-select v-model="record.deliveryMode" placeholder="带货方式">
                  <a-select-option :value="0">自带</a-select-option>
                  <a-select-option :value="1">邮寄</a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
            <div slot="isWarranty" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'productInfoList.' + index + '.isWarranty'"
                :rules="{
                  required: true,
                  message: '请选择是否过保',
                }"
              >
                <a-select
                  v-model="record.isWarranty"
                  @change="(value) => handleChange(value, record)"
                  placeholder="是否过保"
                >
                  <a-select-option :value="0">否</a-select-option>
                  <a-select-option :value="1">是</a-select-option>
                </a-select>
              </a-form-model-item>
            </div>

            <div slot="doAction" slot-scope="text, record, index">
              <a href="javascript:void(0);" @click="doAction('remove', record)">删除</a>
            </div>

            <div slot="footer" slot-scope="text, record, index">
              <div style="text-align: right; font-size: 16px; color: red">
                <span>数量合计：{{ totalPrice }}</span>
                <span style="margin: 0 10px">单价合计：{{ totalPhase | moneyFormatNumber }}</span>
                <span>金额合计：{{ totalPhase1 | moneyFormatNumber }}</span>
              </div>
            </div>
          </a-table>
          <a-button style="width: 100%" type="dashed" icon="plus" @click="doAction('add-travelRecord')">
            添加
          </a-button>
        </div>
        <div v-if="addressee" style="margin-top: 20px">
          <h3>收件人信息</h3>
          <a-form-model-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="收件人姓名"
            :prop="'mailRecord.recipientName'"
            :rules="{
              required: true,
              message: '请输入收件人姓名',
            }"
          >
            <a-input v-if="!isDisabled" v-model="form.mailRecord.recipientName" />
          </a-form-model-item>
          <a-form-model-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="联系电话"
            :prop="'mailRecord.contactNumber'"
            :rules="{
              required: true,
              message: '请输入联系电话',
            }"
          >
            <a-input v-if="!isDisabled" v-model="form.mailRecord.contactNumber" />
          </a-form-model-item>
          <a-form-model-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="单位名称"
            :prop="'mailRecord.unitName'"
            :rules="{
              required: false,
              message: '请输入单位名称',
            }"
          >
            <a-input v-if="!isDisabled" v-model="form.mailRecord.unitName" />
          </a-form-model-item>
          <a-form-model-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="收件省市区"
            :prop="'mailRecord.province'"
            :rules="{
              required: true,
              message: '请选择省市区',
            }"
          >
            <a-cascader
              :disabled="isDisabled"
              style="width: 200px"
              v-model="form.mailRecord.province"
              :options="birthplaceOptions"
              @change="birthplaceCascaderChange"
              :loadData="birthplaceCascaderLoadData"
              placeholder="选择省市区"
            />
          </a-form-model-item>
          <a-form-model-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="详细地址"
            :prop="'mailRecord.address'"
            :rules="{
              required: true,
              message: '请输入详细地址',
            }"
          >
            <a-input v-if="!isDisabled" v-model="form.mailRecord.address" />
          </a-form-model-item>

          <a-form-model-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="付款方式"
            :prop="'mailRecord.paymentMailType'"
            :rules="{
              required: false,
              message: '请选择付款方式',
            }"
          >
            <a-select v-model="form.mailRecord.paymentMailType" placeholder="付款方式">
              <a-select-option :value="0">包邮</a-select-option>
              <a-select-option :value="1">到付</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="物流名称"
            :prop="'mailRecord.logisticsName'"
            :rules="{
              required: false,
              message: '请输入物流名称',
            }"
          >
            <a-input v-if="!isDisabled" v-model="form.mailRecord.logisticsName" />
          </a-form-model-item>
        </div>
        <h3 style="margin-top: 20px">付款方式</h3>
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="付款方式"
          :prop="'paymentType'"
          :rules="{
            required: true,
            message: '请选择付款方式',
          }"
        >
          <a-select v-model="form.paymentType" placeholder="付款方式">
            <a-select-option :value="0">完结付款</a-select-option>
            <a-select-option :value="1">先付款</a-select-option>
            <a-select-option :value="2">免付款</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          v-if="form.paymentType === 0 || form.paymentType === 2"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="处理人"
          :prop="'handlerUser'"
          :rules="{
            required: false,
            message: '请选择处理人',
          }"
        >
          <a-select v-model="form.handlerUser" placeholder="销售经理">
            <a-select-option v-for="item in personincharge" :key="item.id" :value="item.id">{{
              item.trueName
            }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="备注"
          :prop="'remark'"
          :rules="{
            required: false,
            message: '请输入备注',
          }"
        >
          <a-textarea v-if="!isDisabled" v-model="form.remark" />
        </a-form-model-item>
      </a-form-model>

      <product-model ref="productModel" @custom-change="productChange"></product-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { addAndUpdateAccessoriesManagement } from '@/api/after-sales-management' //机构名称
import { listUserBySale } from '@/api/systemSetting' //销售人员
import { getAreaByParent } from '@/api/common'
import ProductModel from './mode/productModel'
export default {
  name: 'BecomingForm',
  components: {
    ProductModel,
  },
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 },
      opinionData: [],
      birthplaceOptions: [], //籍贯 级联 省市
      personincharge: [], //销售负责人
      labelName: undefined,

      form: {
        productInfoList: [],
        deviceInfoId: undefined,
        mainBoardNo: undefined,
        paymentType: undefined,
        handlerUser: undefined,
        isTax: 0,
        remark: undefined,
        mailRecord: {
          recipientName: undefined,
          contactNumber: undefined,
          unitName: undefined,
          address: undefined,
          logisticsName: undefined,
          province: undefined,
        },
      },
      isWarranty: undefined,
      record: {},
      mobile: '',
      options: [],
      recordDetails: {},
      visible: false,
      spinning: false,
      type: 'add',
      userInfo: this.$store.getters.userInfo,
    }
  },
  computed: {
    modalTitle() {
      let txt = this.isAdd ? '新增' : this.isVeiw ? '详情' : '修改'
      return `${txt}`
    },
    isAdd() {
      return this.type === 'add'
    },
    isVeiw() {
      return this.type === 'veiw'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit'
    },
    isDisabled() {
      return this.isVeiw
    },
    addressee() {
      return this.form.productInfoList.some((i) => i.deliveryMode === 1)
    },
    totalPrice() {
      return this.form.productInfoList.reduce((addr, item) => {
        addr = Number(addr) + Number(item.quantity)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },
    totalPhase() {
      return this.form.productInfoList.reduce((addr, item) => {
        addr = Number(addr) + Number(item.unitPrice || 0)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },
    totalPhase1() {
      return this.form.productInfoList.reduce((addr, item) => {
        addr = Number(addr) + Number(item.money || 0)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },
    travelColumns() {
      const baseColumns = [
        {
          title: '序号',
          scopedSlots: { customRender: 'order' },
          width: 60,
        },
        {
          title: '物料代码',
          dataIndex: 'materialCode',
          scopedSlots: { customRender: 'materialCode' },
          width: 150,
        },
        {
          title: '物料名称',
          dataIndex: 'materialName',
          width: 100,
        },
        {
          title: '规格型号',
          dataIndex: 'specification',
          width: 100,
        },
        {
          title: '单位',
          dataIndex: 'company',
        },
        {
          title: '数量',
          dataIndex: 'quantity',
          scopedSlots: { customRender: 'quantity' },
        },
        {
          title: '单价（元）',
          dataIndex: 'unitPrice',
          width: 150,
        },
        {
          title: '金额（元）',
          dataIndex: 'money',
          scopedSlots: { customRender: 'money' },
        },
        {
          title: '是否过保',
          scopedSlots: { customRender: 'isWarranty' },
          width: 150,
        },
        {
          title: '带货方式',
          scopedSlots: { customRender: 'deliveryMode' },
          width: 150,
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'doAction' },
          width: 60,
        },
      ]
      return baseColumns
    },
  },

  created() {},
  methods: {
    onChange(checked) {
      this.form.isTax = checked ? 0 : 1
    },
    Productchange(value) {
      console.log(value)
      let react = this.record.deviceInfoVoList.find((i) => i.id === value)
      this.form.mainBoardNo = react.mainBoardNo ? react.mainBoardNo : ''
      this.isWarranty = react.isWarranty
    },
    handleChange(e, record) {
      const productInfoList = [...this.form.productInfoList]
      const target = productInfoList.find((item) => item.key === record.key)
      if (target) {
        target['money'] = e === 0 ? 0 : record.quantity * record.unitPrice // 金额
        this.form.productInfoList = productInfoList
      }
    },
    handleTravelRecordListChange(e, record) {
      console.log(e, record)
      const productInfoList = [...this.form.productInfoList]
      const target = productInfoList.find((item) => item.key === record.key)
      if (target) {
        target['money'] = target.isWarranty === 0 ? 0 : e * record.unitPrice // 金额
        this.form.productInfoList = productInfoList
      }
    },
    openModel(record) {
      this.$refs.productModel.query(record)
    },
    productChange(data) {
      console.log('JSON 页面传值事件 标的id的改变 弹出层:', data)
      let { selectItem, recordParam } = data
      const productInfoList = [...this.form.productInfoList]
      const target = productInfoList.find((item) => item.key === recordParam.key)
      if (target) {
        target['materialCode'] = selectItem.productModel // 物料代码
        target['materialName'] = selectItem.productName // 物料名称
        target['specification'] = selectItem.productStandard // 规格型号
        target['company'] = '' //单位  后期添加
        target['unitPrice'] = selectItem.unitPrice //单价

        this.form.productInfoList = productInfoList
      }
    },
    doAction(type, record) {
      const that = this

      if (type === 'add-travelRecord' && this.form.deviceInfoId !== undefined) {
        const productInfoList = [...this.form.productInfoList]
        productInfoList.push({
          key: that._uuid(),
          materialCode: undefined,
          quantity: 0,
          materialName: undefined,
          specification: undefined,
          company: undefined,
          unitPrice: 0,
          isWarranty: this.isWarranty,
        })
        that.form = { ...that.form, productInfoList }
      } else {
        this.$message.error('请先选择产品名称')
      }

      if (type === 'remove') {
        let productInfoList = [...that.form.productInfoList]
        productInfoList = productInfoList.filter((item) => item.key !== record.key)
        that.form = { ...that.form, productInfoList }
      }
    },
    handleAreaChange({ area, text }, field, record) {
      const that = this
      const productInfoList = [...that.form.productInfoList]
      const target = productInfoList.find((item) => item.key === record.key)
      target[`${field}Name`] = text
      that.form = { ...that.form, productInfoList }
      console.log(arguments)
    },
    async query(type, record) {
      this.visible = true
      this.form = {
        productInfoList: [],
        deviceInfoId: undefined,
        mainBoardNo: undefined,
        paymentType: undefined,
        handlerUser: undefined,
        isTax: 0,
        remark: undefined,
        mailRecord: {
          recipientName: undefined,
          contactNumber: undefined,
          unitName: undefined,
          address: undefined,
          logisticsName: undefined,
          province: undefined,
        },
      }
      this.type = type
      this.record = record
      this.form.handlerUser = record.saleUserId
      listUserBySale().then((res) => (this.personincharge = res.data))
      let _areaData = await this.loadAreaAction(100000)
      this.birthplaceOptions = _areaData
    },
    handleOk() {
      console.log('你是要提交')
      let that = this
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const params = that.$_.cloneDeep(that.form || {})
          let ret = that.record.deviceInfoVoList.find((i) => i.id === params.deviceInfoId)
          params.deviceInfoName = ret.productName
          params.totalAmount = this.totalPhase1
          let react = this.personincharge.find((i) => i.id === params.handlerUser)
          params.handlerUser = react.id + ',' + react.trueName
          params.taskDocumentId = this.record.id
          if (that.addressee) {
            params.isMail = 1
            params.mailRecord.province = params.mailRecord.province.toString()
            params.mailRecord.provinceName = this.labelName
          }
          console.log(params)
          addAndUpdateAccessoriesManagement(params)
            .then((res) => {
              if (res.code === 200) {
                that.spinning = false
                that.visible = false
                that.$message.info(res.msg)
                that.$emit('filet')
              }
            })
            .catch((err) => (that.spinning = false))
        }
      })

      // if (that.type === 'handle') {
      //   that.form.validateFields((err, values) => {
      //     if (!err) {
      //       console.log(values)

      //       let params = {
      //         id: this.recordDetails.taskUserInfo.id,
      //         taskDocumentId: this.record.id,
      //         serviceMode: values.serviceMode,
      //       }
      //       if (values.serviceMode === 1) {
      //         params.actualMaintenanceLocation = values.actualMaintenanceLocation
      //         params.actualSiteContact = values.actualSiteContact
      //         params.actualSiteContactNumber = values.actualSiteContactNumber
      //         params.province = values.territory.toString()
      //         params.provinceName = this.labelName
      //       }

      //       that.spinning = true
      //       handleTaskDocument(params)
      //         .then((res) => {
      //           that.spinning = false
      //           console.log(res)
      //           that.form.resetFields() // 清空表
      //           that.visible = false
      //           that.$message.info(res.msg)
      //           that.$emit('filet')
      //         })
      //         .catch((err) => (that.spinning = false))
      //     }
      //   })
      // }
    },
    handleCancel() {
      this.visible = false
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    birthplaceCascaderChange(arrSelected) {
      console.log('birthplaceCascaderChange called...')
      console.log(arguments)
      this.labelName = arguments[1] !== undefined ? arguments[1].map((i) => i.label).toString() : ''
    },
    birthplaceCascaderLoadData(selectedOptions) {
      let that = this
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      getAreaByParent({ pId: targetOption.value })
        .then((res) => {
          //城市
          targetOption.loading = false
          targetOption.children = res.data.map((item) => {
            return {
              label: item.area,
              value: item.id,
              isLeaf: item.level === 3 ? true : false,
            }
          })
          that.birthplaceOptions = [...that.birthplaceOptions]
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    loadAreaAction(pId) {
      const that = this
      return getAreaByParent({ pId: pId })
        .then((res) => {
          //城市
          return res.data.map((item) => {
            return {
              label: item.area,
              value: item.id,
              isLeaf: item.level === 3 ? true : false,
            }
          })
        })
        .catch(function (err) {
          console.log(err)
          return []
        })
    },
  },
}
</script>
<style scoped>
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 15px 10px;
}

.custom-table >>> .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table >>> .custom-table td {
  text-align: left;
}
.becoming-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.bank-card-list-wrapper {
  display: flex;
}
.bank-card-list-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0 7px;
}
</style>