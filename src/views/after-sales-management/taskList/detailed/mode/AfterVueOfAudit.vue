<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
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
            <td style="width: 200px">任务单类型</td>
            <td style="width: 300px">产品调试任务单</td>
            <td style="width: 200px">任务单编号</td>
            <td style="width: 300px">{{ reacd.taskNum }}</td>
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
              <td style="width: 200px">项目地址</td>
              <td style="width: 300px">{{ item.address }}</td>
              <td style="width: 200px">发货时间</td>
              <td style="width: 300px">{{ item.deliveryTime.substr(0, 10) }}</td>
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
              <th style="width: 200px">产品代码</th>
              <th style="width: 300px">产品名称</th>
              <th style="width: 200px">规格型号</th>
              <th style="width: 300px">发货数量</th>
            </tr>
            <tr v-for="items in item.products" :key="items.index">
              <td>{{ items.productModel }}</td>
              <td>{{ items.productName }}</td>
              <td>{{ items.productStandard }}</td>
              <td>{{ items.company }}</td>
            </tr>
          </table>
        </div>
        <a-form :form="form" layout="inline" class="becoming-form-wrapper">
          <h3>维修人员信息</h3>
          <table class="custom-table custom-table-border">
            <tr>
              <td style="width: 200px">维修人员</td>
              <td>
                <a-form-item>
                  <a-select
                    placeholder="请选择售后人员"
                    :disabled="isVeiw"
                    showSearch
                    :filterOption="filterOption"
                    v-decorator="['maintenanceUserId', { rules: [{ required: true, message: '请选择售后人员' }] }]"
                    :allowClear="true"
                    @change="SelectChange"
                    style="width: 400px"
                  >
                    <a-select-option v-for="item in AfterSale" :key="item.id" :value="item.id">{{
                      item.trueName
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </td>
            </tr>
            <tr>
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
                    :disabled="isVeiw"
                    @change="serviceType"
                    style="width: 400px"
                    placeholder="上门服务人员"
                  >
                    <a-select-option :value="0">售后人员</a-select-option>
                    <a-select-option :value="1"> 网点</a-select-option>
                  </a-select>
                </a-form-item>
              </td>
            </tr>
            <tr>
              <td>到达时间</td>
              <td>
                <a-form-item>
                  <a-date-picker
                    show-time
                    :disabled="isVeiw"
                    format="YYYY-MM-DD HH:mm"
                    v-decorator="[
                      'arriveTime',
                      {
                        rules: [{ required: true, message: '请选择到达时间' }],
                      },
                    ]"
                    style="width: 400px"
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
                      style="width: 400px; margin-left: 93px"
                      :disabled="isVeiw"
                      :field-names="{ label: 'networkName', value: 'id', children: 'serviceUserVoList' }"
                      :options="options"
                      v-decorator="['networkId', { rules: [{ required: true, message: '请选择上门服务人员信息!' }] }]"
                      placeholder="请选择上门服务人员信息"
                    />
                  </a-form-item>
                  <a
                    v-if="!isVeiw"
                    @click="handleAdd('add', null)"
                    style="padding-left: 10px; padding-top: 10px; float: right"
                    >新增个人网点</a
                  >
                  <a v-else style="width: 93px; float: right"> &nbsp;</a>
                </td>
              </tr>
              <tr>
                <td>首次故障排查费（元/次）</td>
                <td>
                  <a-form-item>
                    <a-input
                      style="width: 400px"
                      :disabled="isVeiw"
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
                <td>
                  <a-form-item>
                    <a-input
                      style="width: 400px"
                      :disabled="isVeiw"
                      placeholder="输入故障处理费"
                      v-decorator="['troubleshootingCost', { rules: [{ required: true, message: '输入故障处理费!' }] }]"
                    />
                  </a-form-item>
                </td>
              </tr>
            </template>
          </table>
        </a-form>
        <modal ref="modal" @ok="handleSaveOk" />
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  listUserByAfterSale,
  dispatchTaskDocument,
  taskDocumentDetail,
  networkManagementList,
} from '@/api/after-sales-management' //机构名称
import { listUserBySale } from '@/api/systemSetting' //销售人员
import Modal from '../../../Network/networkManagement/modules/addForm'
import moment from 'moment'
export default {
  name: 'AfterVueOfAudit',
  components: {
    Modal,
  },
  data() {
    return {
      visible: false,
      reacd: {},
      mobile: '',
      serType: false,
      spinning: true,
      recordDetails: {},
      details: {},
      AfterSale: [],
      personincharge: [],
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
      return this.afterType === 'Dispatch'
    },
    isDisabled() {
      return this.isVeiw
    },
  },
  methods: {
    moment,
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
      if (that.afterType === 'Dispatch') {
        that.form.validateFields((err, values) => {
          if (!err) {
            let params = {
              taskDocumentId: this.reacd.id,
              maintenanceUserId: values.maintenanceUserId,
              maintenanceUserPhone: this.mobile,
              serviceType: values.serviceType,
            }

            let react = this.AfterSale.find((i) => i.id === values.maintenanceUserId)
            params.maintenanceUserName = react.trueName
            params.arriveTime = values.arriveTime.format('YYYY-MM-DD hh:mm:ss')

            if (values.serviceType === 1) {
              params.networkId = values.networkId[0]
              params.screeningCost = values.screeningCost
              params.troubleshootingCost = values.troubleshootingCost
              params.serviceUserName = values.networkId[1]
            }
            that.spinning = true
            dispatchTaskDocument(params)
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
        })
      }
    },
    handleCancel() {
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
    init(type, reacd) {
      this.visible = true
      this.spinning = false
      this.reacd = reacd
      this.afterType = type
      this.handleSaveOk()
      listUserBySale().then((res) => (this.personincharge = res.data))
      listUserByAfterSale().then((res) => (this.AfterSale = res.data))
      taskDocumentDetail({ id: reacd.id }).then((res) => {
        this.recordDetails = res.data
        this.details = res.data.saleAfterVo
        if (this.afterType !== 'Dispatch') {
          this.serType = res.data.taskUserInfo.serviceType === 1 ? true : false
          this.mobile = res.data.taskUserInfo.maintenanceUserPhone
          this.form.setFieldsValue({
            maintenanceUserId: res.data.taskUserInfo.maintenanceUserId,
            arriveTime: moment(res.data.taskUserInfo.arriveTime),
            serviceType: res.data.taskUserInfo.serviceType,
          })
          if (this.serType) {
            this.$nextTick(() => {
              this.form.setFieldsValue({
                screeningCost: res.data.taskUserInfo.screeningCost,
                troubleshootingCost: res.data.taskUserInfo.troubleshootingCost,
                networkId: [res.data.taskUserInfo.networkId, res.data.taskUserInfo.serviceUserName],
              })
            })
          }
        }
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

