<template>
  <a-modal
    :title="modalTitle"
    :width="1005"
    :visible="visible"
    :confirmLoading="spinning"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <div>
        <table class="table custom-table custom-table-border">
          <tr>
            <td>任务单类型</td>
            <td>产品调试任务单</td>
            <td>任务单编号</td>
            <td>{{ reacd.taskNum }}</td>
          </tr>
          <tr>
            <td>来源</td>
            <td>
              {{ { 1: '400售后电话', 2: '客户反馈', 3: '第三方反馈', 4: '销售部' }[reacd.source] || '未知' }}
            </td>
            <td>机构名称</td>
            <td>{{ reacd.orgName }}</td>
          </tr>
          <tr>
            <td>客户名称</td>
            <td>{{ reacd.customerName }}</td>
            <td>销售联系人</td>
            <td>{{ reacd.saleUserName }}</td>
          </tr>
          <tr>
            <td>售后类型</td>
            <td>{{ details.aftersaleType === 1 ? '首次调试' : '远程调试' }}</td>
            <td>时间要求</td>
            <td>{{ details.sceneTime }}</td>
          </tr>
          <tr>
            <td>是否使用我方平台</td>
            <td colspan="3">{{ details.usingPlatform === 0 ? '是' : '否' }}</td>
          </tr>
          <tr>
            <td>平台账号</td>
            <td>{{ details.platformAccount }}</td>
            <td>平台密码</td>
            <td>{{ details.platformPassword }}</td>
          </tr>
        </table>
        <div v-for="item in recordDetails.invoiceForSaleAfterVoList" :key="item.index">
          <a-button type="primary" style="margin-bottom: 15px; margin-top: 15px" shape="round">
            发货单：{{ item.invoiceNum }}
          </a-button>
          <a-button
            type="danger"
            size="small"
            style="margin-bottom: 15px; margin-top: 15px; margin-left: 15px"
            shape="round"
          >
            质保中
          </a-button>
          <table class="table custom-table custom-table-border">
            <tr>
              <td>项目地址</td>
              <td>{{ item.address }}</td>
              <td>发货时间</td>
              <td>{{ item.deliveryTime }}</td>
            </tr>
            <tr>
              <td>联系人</td>
              <td>{{ item.consignee }}</td>
              <td>联系信息</td>
              <td>{{ item.contactInformation }}</td>
            </tr>
            <tr>
              <td>备注</td>
              <td colspan="3">{{ item.remarks }}</td>
            </tr>
          </table>
          <h3>发货单明细</h3>
          <table class="table custom-table custom-table-border">
            <tr>
              <th>产品代码</th>
              <th>产品名称</th>
              <th>规格型号</th>
              <th>发货数量</th>
            </tr>
            <tr v-for="items in item.products" :key="items.index">
              <td>{{ items.productModel }}</td>
              <td>{{ items.productName }}</td>
              <td>{{ items.productStandard }}</td>
              <td>{{ items.productStandard }}</td>
            </tr>
          </table>
        </div>
        <a-form :form="form" class="becoming-form-wrapper">
          <h3>维修人员信息</h3>
          <table class="custom-table custom-table-border">
            <tr>
              <td>维修人员</td>
              <td>
                <a-form-item>
                  <a-select
                    placeholder="请选择售后人员"
                    disabled
                    showSearch
                    :filterOption="filterOption"
                    v-decorator="['maintenanceUserId', { rules: [{ required: true, message: '请选择售后人员' }] }]"
                    :allowClear="true"
                    @change="SelectChange"
                    style="width: 200px"
                  >
                    <a-select-option v-for="item in AfterSale" :key="item.id" :value="item.id">{{
                      item.trueName
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </td>
              <td>维修人电话</td>
              <td>{{ mobile || '自动带入' }}</td>
            </tr>
            <tr>
              <td>上门服务人员</td>
              <td>
                <a-form-item>
                  <a-select
                    v-decorator="['serviceType', { rules: [{ required: true, message: '请选择上门服务人员！' }] }]"
                    allowClear
                    disabled
                    @change="serviceType"
                    style="width: 200px"
                    placeholder="上门服务人员"
                  >
                    <a-select-option :value="0">售后人员</a-select-option>
                    <a-select-option :value="1"> 网点</a-select-option>
                  </a-select>
                </a-form-item>
              </td>
              <td>到达时间</td>
              <td>
                <a-form-item>
                  <a-date-picker
                    show-time
                    :disabled="isVeiw"
                    v-decorator="[
                      'arriveTime',
                      {
                        rules: [{ required: true, message: '请选择到达时间' }],
                      },
                    ]"
                    style="width: 200px"
                  />
                </a-form-item>
              </td>
            </tr>
            <template v-if="serType">
              <tr>
                <td>上门服务人员信息</td>
                <td>
                  <a-form-item>
                    <a-cascader
                      style="width: 250px"
                      disabled
                      :field-names="{ label: 'networkName', value: 'id', children: 'serviceUserVoList' }"
                      :options="options"
                      v-decorator="['networkId', { rules: [{ required: true, message: '请选择上门服务人员信息!' }] }]"
                      placeholder="请选择上门服务人员信息"
                    />
                    <!-- <a @click="handleAdd('add', null)" style="padding-left: 10px">新增个人网点</a> -->
                  </a-form-item>
                </td>
                <td>首次故障排查费（元/次）</td>
                <td>
                  <a-form-item>
                    <a-input
                      style="width: 200px"
                      disabled
                      placeholder="输入首次故障排查费（元/次）"
                      v-decorator="[
                        'screeningCost',
                        { rules: [{ required: true, message: '输入首次故障排查费（元/次）!' }] },
                      ]"
                    />
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td>故障处理费</td>
                <td colspan="3">
                  <a-form-item>
                    <a-input
                      style="width: 200px"
                      disabled
                      placeholder="输入故障处理费"
                      v-decorator="['troubleshootingCost', { rules: [{ required: true, message: '输入故障处理费!' }] }]"
                    />
                  </a-form-item>
                </td>
              </tr>
            </template>
            <tr>
              <td>服务方式</td>
              <td colspan="3">
                <a-form-item>
                  <a-select
                    v-decorator="['serviceMode', { rules: [{ required: true, message: '请选择服务方式！' }] }]"
                    allowClear
                    @change="serviceModeType"
                    :disabled="isVeiw"
                    style="width: 200px"
                    placeholder="服务方式"
                  >
                    <a-select-option :value="0">远程指导</a-select-option>
                    <a-select-option :value="1"> 现场服务</a-select-option>
                  </a-select>
                </a-form-item>
              </td>
            </tr>
            <template v-if="sceneType">
              <tr>
                <td>实际维修地点</td>
                <td colspan="3">
                  <a-form-item>
                    <a-cascader
                      :disabled="isDisabled"
                      style="width: 200px"
                      v-decorator="['territory', { rules: [{ required: true, message: '选择省市区' }] }]"
                      :options="birthplaceOptions"
                      @change="birthplaceCascaderChange"
                      :loadData="birthplaceCascaderLoadData"
                      placeholder="选择省市区"
                    />
                  </a-form-item>
                  <a-form-item>
                    <a-input
                      style="width: 300px"
                      :disabled="isDisabled"
                      placeholder="详细地址"
                      v-decorator="[
                        'actualMaintenanceLocation',
                        { rules: [{ required: true, message: '请输入详细地址' }] },
                      ]"
                    />
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td>实际现场联系人</td>
                <td>
                  <a-form-item>
                    <a-input
                      style="width: 200px"
                      :disabled="isDisabled"
                      placeholder="实际现场联系人"
                      v-decorator="['actualSiteContact']"
                    />
                  </a-form-item>
                </td>
                <td>实际现场联系人</td>
                <td>
                  <a-form-item>
                    <a-input
                      style="width: 200px"
                      :disabled="isDisabled"
                      placeholder="实际现场联系人电话"
                      v-decorator="['actualSiteContactNumber']"
                    />
                  </a-form-item>
                </td>
              </tr>
            </template>
          </table>
        </a-form>
        <!-- <modal ref="modal" @ok="handleSaveOk" /> -->
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  listUserByAfterSale,
  handleTaskDocument,
  taskDocumentDetail,
  networkManagementList,
  updateTaskDocument,
} from '@/api/after-sales-management' //机构名称
import { getAreaByParent } from '@/api/common'
// import Modal from './addForm'
import moment from 'moment'
export default {
  name: 'AfterVueOfAudit',
  components: {
    // Modal,
  },
  data() {
    return {
      visible: false,
      birthplaceOptions: [], //籍贯 级联 省市
      labelName: undefined,
      reacd: {},
      mobile: '',
      sceneType: false,
      serType: false,
      spinning: true,
      recordDetails: {},
      details: {},
      AfterSale: [],
      afterType: undefined,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
    }
  },

  mounted() {
    // this.init()
  },
  computed: {
    modalTitle() {
      let txt = this.isVeiw ? '查看' : this.Dispatch ? '派工' : '新增'
      return `${txt}产品调试任务单`
    },
    isVeiw() {
      return this.afterType === 'veiw'
    },
    Dispatch() {
      return this.afterType === 'handle'
    },
    //修改
    ismodify() {
      return this.type === 'modify'
    },
    isDisabled() {
      return this.isVeiw
    },
  },
  methods: {
    moment,
    serviceModeType(value) {
      this.sceneType = value === 1 ? true : false
    },
    handleAdd(type, e) {
      this.$refs.modal.query(type, e)
    },
    serviceType(value) {
      this.serType = value === 1 ? true : false
    },
    SelectChange(value) {
      let arr = this.AfterSale.find((i) => i.id === value)
      this.mobile = (arr.userInfo && arr.userInfo.mobile) || ''
    },
    handleOk() {
      if (this.isVeiw) {
        return (this.visible = false)
      }
      let that = this
      if (that.afterType === 'handle') {
        that.form.validateFields((err, values) => {
          if (!err) {
            console.log(values)

            let params = {
              id: this.recordDetails.taskUserInfo.id,
              taskDocumentId: this.reacd.id,
              serviceMode: values.serviceMode,
              arriveTime: values.arriveTime.format('YYYY-MM-DD HH:mm'),
            }
            if (values.serviceMode === 1) {
              params.actualMaintenanceLocation = values.actualMaintenanceLocation
              params.actualSiteContact = values.actualSiteContact
              params.actualSiteContactNumber = values.actualSiteContactNumber
              params.province = values.territory.toString()
              params.provinceName = this.labelName
            }

            if (this.ismodify) {
              that.spinning = true
              updateTaskDocument(params)
                .then((res) => {
                  that.spinning = false
                  console.log(res)
                  that.form.resetFields() // 清空表
                  that.visible = false
                  that.$message.info(res.msg)
                  that.$emit('filet')
                })
                .catch((err) => (that.spinning = false))
            } else {
              that.spinning = true
              handleTaskDocument(params)
                .then((res) => {
                  that.spinning = false
                  console.log(res)
                  that.form.resetFields() // 清空表
                  that.visible = false
                  that.$message.info(res.msg)
                  that.$emit('filet')
                })
                .catch((err) => (that.spinning = false))
            }
          }
        })
      }
    },
    handleCancel() {
      this.form.resetFields() // 清空表
      this.visible = false
    },
    handleSaveOk() {
      networkManagementList().then(
        (res) =>
          (this.options = res.data.map((i) => {
            return {
              networkName: i.networkName,
              id: i.id,
              serviceUserVoList: i.serviceUserVoList.map((u) => {
                return {
                  networkName: `${u.serviceUserName}(${u.contactInformation})`,
                  id: `${u.serviceUserName}(${u.contactInformation})`,
                }
              }),
            }
          }))
      )
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    async init(type, reacd) {
      this.visible = true
      this.spinning = false
      this.reacd = reacd
      this.afterType = type
      this.handleSaveOk()
      let _areaData = await this.loadAreaAction(100000)
      this.birthplaceOptions = _areaData

      listUserByAfterSale().then((res) => (this.AfterSale = res.data))
      if (type === 'veiw') {
        let that = this
        if (this.reacd.province) {
          let _arr = this.reacd.province.split(',')
          _arr = _arr.map((v) => parseInt(v, 10))
          let _areaCityData = await that.loadAreaAction(_arr[0])
          let ctiyTargetOption = that.birthplaceOptions.find((p) => p.value == _arr[0])
          if (ctiyTargetOption) {
            ctiyTargetOption.children = _areaCityData
            that.birthplaceOptions = [...that.birthplaceOptions]
          }

          let _areaAreaData = await that.loadAreaAction(_arr[1])
          let areaTargetOption = ctiyTargetOption.children.find((p) => p.value == _arr[1])
          if (areaTargetOption) {
            areaTargetOption.children = _areaAreaData
            that.birthplaceOptions = [...that.birthplaceOptions]
          }
          that.$nextTick(() => that.form.setFieldsValue({ territory: _arr }))
        }
      }
      taskDocumentDetail({ id: reacd.id }).then((res) => {
        this.recordDetails = res.data
        this.details = res.data.saleAfterVo
        this.serType = res.data.taskUserInfo.serviceType === 1 ? true : false
        this.mobile = res.data.taskUserInfo.maintenanceUserPhone
        this.form.setFieldsValue({
          maintenanceUserId: res.data.taskUserInfo.maintenanceUserId,
          arriveTime: moment(res.data.taskUserInfo.arriveTime),
          serviceType: res.data.taskUserInfo.serviceType,
          serviceMode: res.data.taskUserInfo.serviceMode,
        })
        if (!this.Dispatch) {
          this.sceneType = res.data.taskUserInfo.serviceMode === 1 ? true : false
          if (this.sceneType) {
            this.$nextTick(() => {
              this.form.setFieldsValue({
                actualMaintenanceLocation: res.data.taskUserInfo.actualMaintenanceLocation,
                actualSiteContact: res.data.taskUserInfo.actualSiteContact,
                actualSiteContactNumber: res.data.taskUserInfo.actualSiteContactNumber,
              })
            })
          }
        }
        if (this.serType) {
          this.$nextTick(() => {
            this.form.setFieldsValue({
              screeningCost: res.data.taskUserInfo.screeningCost,
              troubleshootingCost: res.data.taskUserInfo.troubleshootingCost,
              networkId: [res.data.taskUserInfo.networkId, res.data.taskUserInfo.serviceUserName],
            })
          })
        }
      })
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

