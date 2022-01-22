<template>
  <a-modal
    :title="modalTitle"
    :width="1200"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">{{
          isVeiw ? '确定' : '保存'
        }}</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form-model ref="ruleForm" :model="form" class="routine-addform-wrapper-baseInnerData">
        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 150px">报价单号</td>
            <td style="width: 30%">{{ record && record.offerCode ? record.offerCode : '系统自动生成' }}</td>
            <td style="width: 150px">报价类型</td>
            <td style="width: 30%">
              <span v-if="isAdd"> 售前报价 </span
              ><span v-else>
                {{ { 1: '发货报价', 2: '售后报价' }[record.type] || '未知' }}
              </span>
            </td>
          </tr>
          <tr>
            <td>出发地</td>
            <td>江苏万德福公共卫生有限公司</td>
            <td class="requiredMark">目的地</td>
            <td>
              <a-form-model-item
                style="width: 100%; float: left"
                prop="provinceId"
                :rules="{
                  required: false,
                  message: '选择省市区',
                }"
              >
                <a-cascader
                  v-model="form.provinceId"
                  :disabled="isDisabled"
                  :options="birthplaceOptions"
                  @change="birthplaceCascaderChange"
                  :loadData="birthplaceCascaderLoadData"
                  placeholder="选择省市区"
                />
              </a-form-model-item>
              <a-form-model-item
                style="width: 100%; float: left"
                prop="addressDetail"
                :rules="{
                  required: true,
                  message: '请输入详细地址',
                }"
              >
                <a-input :disabled="isDisabled" v-model="form.addressDetail" placeholder="请输入详细地址" />
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td class="requiredMark">运费结算方式</td>
            <td>
              <a-form-model-item
                prop="settlementMethod"
                :rules="{
                  required: true,
                  message: '请选择运费结算方式',
                }"
              >
                <a-select
                  style="width: 200px"
                  :disabled="isDisabled"
                  v-model="form.settlementMethod"
                  placeholder="请选择运费结算方式"
                >
                  <a-select-option :value="1">代付</a-select-option>
                  <a-select-option :value="2">包邮</a-select-option>
                  <a-select-option :value="3">到付</a-select-option>
                  <a-select-option :value="4">回付</a-select-option>
                  <a-select-option :value="5">现付</a-select-option>
                </a-select>
              </a-form-model-item>
            </td>
            <td class="requiredMark">发货方式</td>
            <td>
              <a-form-model-item
                prop="delivery"
                :rules="{
                  required: true,
                  message: '请选择发货方式',
                }"
              >
                <a-select
                  style="width: 200px"
                  :disabled="isDisabled"
                  v-model="form.delivery"
                  placeholder="请选择发货方式"
                >
                  <a-select-option :value="1">客户货站自提</a-select-option>
                  <a-select-option :value="2">送货上门</a-select-option>
                  <a-select-option :value="3">万德福自提</a-select-option>
                </a-select>
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td class="requiredMark">销售负责人</td>
            <td>
              <a-form-model-item
                prop="saleUserId"
                :rules="{
                  required: true,
                  message: '请选择销售负责人',
                }"
              >
                <a-select
                  style="width: 200px"
                  placeholder="销售负责人"
                  :disabled="isDisabled"
                  v-model="form.saleUserId"
                  v-decorator="['saleUserId', { rules: [{ required: true, message: '请选择销售负责人' }] }]"
                >
                  <a-select-option v-for="item in personincharge" :key="item.id" :value="item.id">{{
                    item.trueName
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </td>
            <td class="requiredMark">预计发货日期</td>
            <td>
              <a-form-model-item
                prop="deliveryTime"
                :rules="{
                  required: true,
                  message: '请选择预计发货日期',
                }"
              >
                <a-date-picker
                  format="YYYY-MM-DD"
                  :disabled="isDisabled"
                  v-model="form.deliveryTime"
                  style="width: 200px"
                />
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td colspan="3">
              <a-form-model-item
                :prop="'remarks'"
                :rules="{
                  required: false,
                  message: '请输入备注',
                }"
              >
                <a-textarea :disabled="isDisabled" v-model="form.remarks" />
              </a-form-model-item>
            </td>
          </tr>
        </table>
        <div style="margin-top: 20px">
          <h3>货物信息</h3>
          <a-table
            :columns="travelColumns"
            :dataSource="form.logisticsOfferProducts"
            :pagination="false"
            bordered
            size="small"
          >
            <div slot="order" slot-scope="text, record, index">
              {{ index + 1 }}
            </div>

            <div slot="materialCode" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'logisticsOfferProducts.' + index + '.materialCode'"
                :rules="{
                  required: true,
                  message: '请选择物料代码',
                }"
              >
                <a-input
                  :disabled="isDisabled"
                  read-only="read-only"
                  @click="openModel(record)"
                  placeholder="请选择物料代码"
                  :value="record.materialCode"
                />
              </a-form-model-item>
            </div>

            <div slot="count" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'logisticsOfferProducts.' + index + '.count'"
                :rules="{
                  required: true,
                  message: '请输入数量',
                }"
              >
                <a-input-number :disabled="isDisabled" v-model="record.count" />
              </a-form-model-item>
            </div>

            <div slot="doAction" slot-scope="text, record, index">
              <a v-if="!isDisabled" href="javascript:void(0);" @click="doAction('remove', record)">删除</a>
            </div>

            <div slot="footer" slot-scope="text, record, index">
              <div style="text-align: right; font-size: 16px; color: red">
                <span>数量合计：{{ totalPrice }}</span>
              </div>
            </div>
          </a-table>
          <a-button
            v-if="!isDisabled"
            style="width: 100%"
            type="dashed"
            icon="plus"
            @click="doAction('add-travelRecord')"
          >
            添加
          </a-button>
        </div>

        <div style="margin-top: 20px" v-if="!isAdd">
          <h3>报价信息</h3>
          <a-table
            :columns="travelColumnsl"
            :dataSource="form.logisticsOfferInfos"
            :pagination="false"
            bordered
            size="small"
          >
            <div slot="order" slot-scope="text, record, index">
              {{ index + 1 }}
            </div>

            <div slot="carrierType" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'logisticsOfferInfos.' + index + '.carrierType'"
                :rules="{
                  required: true,
                  message: '请选择承运方',
                }"
              >
                <a-select v-model="record.carrierType" placeholder="带货方式">
                  <a-select-option :value="1">配货站</a-select-option>
                  <a-select-option :value="2">专车</a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
            <div slot="distributionStationName" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'logisticsOfferInfos.' + index + '.distributionStationName'"
                :rules="{
                  required: record.carrierType === 1 ? true : false,
                  message: '请输入配货站名称',
                }"
              >
                <a-input v-model="record.distributionStationName" placeholder="请输入配货站名称" />
              </a-form-model-item>
            </div>

            <div slot="logisticsTypeId" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'logisticsOfferInfos.' + index + '.logisticsTypeId'"
                :rules="{
                  required: false,
                  message: '请选择物流类别',
                }"
              >
                <a-select v-model="record.logisticsTypeId" placeholder="物流类别">
                  <a-select-option v-for="item in admission" :key="item.id" :value="item.id">{{
                    item.text
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
            <div slot="vehicleTypeId" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'logisticsOfferInfos.' + index + '.vehicleTypeId'"
                :rules="{
                  required: true,
                  message: '请选择车辆类型',
                }"
              >
                <a-select v-model="record.vehicleTypeId" placeholder="车辆类型">
                  <a-select-option v-for="item in assetTypeList" :key="item.id" :value="item.id">{{
                    item.text
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
            <div slot="price" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'logisticsOfferInfos.' + index + '.price'"
                :rules="{
                  required: true,
                  message: '请输入数量',
                }"
              >
                <a-input-number v-model="record.price" />
              </a-form-model-item>
            </div>
            <div slot="lastOfferType" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'logisticsOfferInfos.' + index + '.lastOfferType'"
                :rules="{
                  required: true,
                  message: '请选择最终报价',
                }"
              >
                <a-select v-model="record.lastOfferType" placeholder="最终报价">
                  <a-select-option :value="1">是</a-select-option>
                  <a-select-option :value="2">否</a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
            <div slot="doAction" slot-scope="text, record, index">
              <a v-if="isoffer || isEditSalary" href="javascript:void(0);" @click="doAction1('remove', record)">删除</a>
            </div>
          </a-table>
          <a-button
            v-if="isoffer || isEditSalary"
            style="width: 100%"
            type="dashed"
            icon="plus"
            @click="doAction1('add-travelRecord')"
          >
            添加
          </a-button>
        </div>
      </a-form-model>
      <product-model ref="productModel" @custom-change="productChange"></product-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { getAreaByParent } from '@/api/common'
import { logisticsSaveLogisticsOffer, logisticgetDetail, updateLogisticsOffer } from '@/api/distribution-management' //机构名称
import { listUserBySale } from '@/api/systemSetting' //销售人员
import { getDictionaryList } from '@/api/workBox'
import moment from 'moment'
import ProductModel from './productModel'
let uuid = () => Math.random().toString(32).slice(-10)
export default {
  name: 'BecomingForm',
  components: {
    ProductModel,
  },
  data() {
    return {
      birthplaceOptions: [], //籍贯 级联 省市
      admission: [], // 物料类别
      assetTypeList: [],
      personincharge: [],
      record: {},
      logisList: {},
      type: 'add',
      spinning: false,
      visible: false,
      userInfo: this.$store.getters.userInfo,
      labelName: undefined,
      form: {
        logisticsOfferProducts: [],
        logisticsOfferInfos: [],
      },
    }
  },
  computed: {
    modalTitle() {
      let txt = this.isAdd ? '新增' : this.isoffer ? '报价' : '修改'
      return `${txt}`
    },
    isAdd() {
      //查看
      return this.type === 'add'
    },
    isVeiw() {
      return this.type === 'veiw'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
    isoffer() {
      return this.type === 'offer'
    },
    isDisabled() {
      return this.isVeiw || this.isoffer || this.isEditSalary
    },
    totalPrice() {
      return this.form.logisticsOfferProducts.reduce((addr, item) => {
        addr = Number(addr) + Number(item.count)
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
          dataIndex: 'subUnit',
        },
        {
          title: '数量',
          dataIndex: 'count',
          scopedSlots: { customRender: 'count' },
        },
        {
          title: '方数',
          dataIndex: 'squareNum',
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'doAction' },
          width: 60,
        },
      ]
      return baseColumns
    },
    travelColumnsl() {
      const baseColumns = [
        {
          title: '序号',
          scopedSlots: { customRender: 'order' },
          width: 60,
        },
        {
          title: '承运方',
          dataIndex: 'carrierType',
          scopedSlots: { customRender: 'carrierType' },
          width: 130,
        },
        {
          title: '配货站名称',
          dataIndex: 'distributionStationName',
          scopedSlots: { customRender: 'distributionStationName' },
          width: 200,
        },
        {
          title: '物流类别',
          dataIndex: 'logisticsTypeId',
          scopedSlots: { customRender: 'logisticsTypeId' },
          width: 200,
        },
        {
          title: '车辆类型',
          dataIndex: 'vehicleTypeId',
          scopedSlots: { customRender: 'vehicleTypeId' },
          width: 200,
        },
        {
          title: '价格',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' },
        },
        {
          title: '最终报价',
          dataIndex: 'lastOfferType',
          scopedSlots: { customRender: 'lastOfferType' },
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
    // 报价信息
    doAction1(type, record) {
      const that = this
      if (type === 'add-travelRecord') {
        const logisticsOfferInfos = [...this.form.logisticsOfferInfos]
        logisticsOfferInfos.push({
          key: that._uuid(),
          carrierType: 1,
          distributionStationName: undefined,
          logisticsTypeId: undefined,
          vehicleTypeId: undefined,
          price: undefined,
          lastOfferType: 2,
        })
        that.form = { ...that.form, logisticsOfferInfos }
      }

      if (type === 'remove') {
        let logisticsOfferInfos = [...that.form.logisticsOfferInfos]
        logisticsOfferInfos = logisticsOfferInfos.filter((item) => item.key !== record.key)
        that.form = { ...that.form, logisticsOfferInfos }
      }
    },
    // 货物信息
    doAction(type, record) {
      const that = this
      if (type === 'add-travelRecord') {
        const logisticsOfferProducts = [...this.form.logisticsOfferProducts]
        logisticsOfferProducts.push({
          key: that._uuid(),
          materialCode: undefined,
          count: 0,
          materialName: undefined,
          specification: undefined,
          subUnit: undefined,
          squareNum: undefined,
        })
        that.form = { ...that.form, logisticsOfferProducts }
      }

      if (type === 'remove') {
        let logisticsOfferProducts = [...that.form.logisticsOfferProducts]
        logisticsOfferProducts = logisticsOfferProducts.filter((item) => item.key !== record.key)
        that.form = { ...that.form, logisticsOfferProducts }
      }
    },
    openModel(record) {
      this.$refs.productModel.query(record)
    },
    productChange(data) {
      console.log('JSON 页面传值事件 标的id的改变 弹出层:', data)
      let { selectItem, recordParam } = data
      const logisticsOfferProducts = [...this.form.logisticsOfferProducts]
      const target = logisticsOfferProducts.find((item) => item.key === recordParam.key)
      if (target) {
        target['materialCode'] = selectItem.productModel // 物料代码
        target['materialName'] = selectItem.productName // 物料名称
        target['specification'] = selectItem.productStandard // 规格型号
        target['subUnit'] = '' //单位  后期添加
        target['squareNum'] = selectItem.squareNum //方数  后期添加

        this.form.logisticsOfferProducts = logisticsOfferProducts
      }
    },
    birthplaceCascaderChange(arrSelected) {
      console.log('birthplaceCascaderChange called...')
      console.log(arguments)
      this.areaList = []
      getAreaByParent({ pId: arrSelected[1] }).then((res) => {
        this.areaList = res.data
      })
      this.labelName = arguments[1] !== undefined ? arguments[1].map((i) => i.label).toString() : ''
    },
    moment: moment,
    async query(type, record) {
      this.visible = true
      this.fileList = []
      this.fileList1 = []
      this.type = type
      this.record = record
      this.form = { logisticsOfferProducts: [], logisticsOfferInfos: [] }
      // this.handleSaveOk()
      getDictionaryList({ parentId: '924' }).then((res) => {
        this.admission = res.data
      })
      getDictionaryList({ parentId: '543' }).then((res) => {
        this.assetTypeList = res.data
      })

      await listUserBySale().then((res) => (this.personincharge = res.data))
      let _areaData = await this.loadAreaAction(100000)
      this.birthplaceOptions = _areaData
      if (type !== 'add') {
        let id = {
          id: this.record.id,
        }
        await logisticgetDetail(id).then((res) => {
          this.logisList = res.data
          res.data.deliveryTime = moment(res.data.deliveryTime)
          res.data.provinceId = []
          this.form = res.data
        })
        if (this.logisList.addressIds) {
          let _arr = this.logisList.addressIds.split(',').map(Number)
          // _arr = _arr.map((v) => parseInt(v, 10))
          let _areaCityData = await this.loadAreaAction(_arr[0])
          let ctiyTargetOption = this.birthplaceOptions.find((p) => p.value == _arr[0])
          if (ctiyTargetOption) {
            ctiyTargetOption.children = _areaCityData
            this.birthplaceOptions = [...this.birthplaceOptions]
          }
          let _areaAreaData = await this.loadAreaAction(_arr[1])
          let areaTargetOption = ctiyTargetOption.children.find((p) => p.value == _arr[1])
          if (areaTargetOption) {
            areaTargetOption.children = _areaAreaData
            this.birthplaceOptions = [...this.birthplaceOptions]
          }
          this.$nextTick(() => (this.form.provinceId = _arr))
        }
      }
    },

    problemdel(i) {
      this.opinionData.splice(i, 1)
    },
    previewCancel1() {
      this.previewVisible1 = false
    },
    async handlePreview1(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible1 = true
    },

    problemadd() {
      this.$refs.problemForm.query()
    },
    opinionChange(data) {
      this.opinionData.push(data)
    },
    handleCustomerSelected(item) {
      this.saleuserShow = item.saleUserId !== 0 && item.saleUserId !== null ? true : false
      this.form.setFieldsValue({
        customerId: item && item.id ? item.id : undefined,
        customerName: item.name,
        saleUserId:
          item && item.saleUserId && item.saleUserId !== 0 && item.saleUserId !== null ? item.saleUserId : undefined,
      })
    },

    handleOk() {
      console.log('你是要提交')
      let that = this
      if (that.isVeiw) {
        that.handleCancel()
        return
      }
      // isoffer
      if (that.type === 'add') {
        that.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            const params = that.$_.cloneDeep(that.form || {})
            params.deliveryTime = params.deliveryTime.format('YYYY-MM-DD')
            params.cityId = params.provinceId[1]
            params.areaId = params.provinceId[2]
            params.provinceId = params.provinceId[0]
            params.address = this.labelName || this.record.address
            let react = this.personincharge.find((i) => i.id === params.saleUserId)
            params.saleUserName = react.trueName

            params.type = 2

            // console.log(params)
            logisticsSaveLogisticsOffer(params)
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
      }
      if (that.isoffer || that.isEditSalary) {
        that.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            const params = that.$_.cloneDeep(that.form || {})
            params.deliveryTime = params.deliveryTime.format('YYYY-MM-DD')
            params.cityId = params.provinceId[1]
            params.areaId = params.provinceId[2]
            params.provinceId = params.provinceId[0]
            params.address = this.labelName || this.record.address
            params.type = 2
            let react = params.logisticsOfferInfos.every((i) => i.lastOfferType === 2)
            if (react) {
              return this.$message.error('报价必需要有一个为最终报价')
            }
            let react1 = params.logisticsOfferInfos.filter((i) => i.lastOfferType === 1)
            if (react1.length !== 1) {
              return this.$message.error('报价只能选择一个为最终报价')
            }
            updateLogisticsOffer(params)
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
      }
    },
    handleCancel() {
      this.visible = false
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
.requiredMark::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 10px 10px;
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
.ant-form-item {
  margin-bottom: 0;
}
</style>
