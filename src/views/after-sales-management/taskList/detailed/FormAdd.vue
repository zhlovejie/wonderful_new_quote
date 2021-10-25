<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">{{ isVeiw ? '确定' : '保存' }}</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline" class="becoming-form-wrapper">
        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 200px">任务单类型</td>
            <td style="width: 30%">维修任务单</td>
            <td style="width: 200px">任务单编号</td>
            <td style="width: 30%">{{ record && record.taskNum ? record.taskNum : '系统自动生成' }}</td>
          </tr>
          <tr>
            <td>来源</td>
            <td>
              {{ { 1: '400售后电话', 2: '客户反馈', 3: '第三方反馈', 4: '销售部' }[record.source] || '未知' }}
            </td>
            <td>机构名称</td>
            <td>{{ record.orgName }}</td>
          </tr>
          <tr>
            <td>客户名称</td>
            <td>{{ record.customerName }}</td>
            <td>销售联系人</td>
            <td>{{ record.saleUserName }}</td>
          </tr>
          <tr>
            <td>联系人</td>
            <td>{{ record.linkman }}</td>
            <td>联系人电话</td>
            <td>{{ record.contactNumber }}</td>
          </tr>
        </table>

        <h3 style="margin-top: 15px">
          问题设备
          <a-button v-if="false" type="link" style="margin-bottom: 15px; float: right" @click="problemadd"
            >新增
          </a-button>
        </h3>
        <div v-for="(item, index) in opinionData" :key="item.index">
          <a-button type="primary" style="margin-bottom: 15px; margin-top: 15px" shape="round">
            主板号：{{ item.mainBoardNo }}
          </a-button>
          <a-button
            v-if="item.isWarranty !== undefined && item.isWarranty !== -1"
            type="danger"
            size="small"
            style="margin-bottom: 15px; margin-top: 15px; margin-left: 15px"
            shape="round"
            >{{ item.isWarranty === 0 ? '质保中' : '过保' }}
          </a-button>
          <table class="custom-table custom-table-border">
            <tr>
              <td style="width: 200px">机构</td>
              <td>{{ item.orgName }}</td>
            </tr>
            <tr>
              <td>设备位置</td>
              <td>{{ item.deviceLocation }}</td>
            </tr>
            <tr>
              <td>产品名称</td>
              <td>{{ item.productName }}</td>
            </tr>
            <tr>
              <td>问题描述</td>
              <td>{{ item.problemDescription }}</td>
            </tr>
            <tr>
              <td>照片</td>
              <td>
                <a-upload disabled list-type="picture-card" :file-list="item.picture" @preview="handlePreview1">
                </a-upload>
                <a-modal title="查看" :visible="previewVisible1" :footer="null" @cancel="previewCancel1">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </td>
            </tr>
            <tr>
              <td>视频</td>
              <td>
                <span v-if="item.video"><a target="_blank" :href="item.video">预览</a></span>
              </td>
            </tr>
            <tr>
              <td>备注</td>
              <td>{{ item.remark }}</td>
            </tr>
          </table>
        </div>

        <h3>维修人员信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 200px" class="requiredMark">维修人员</td>
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
            <td class="requiredMark">维修人电话</td>
            <td>{{ mobile || '自动带入' }}</td>
          </tr>
          <tr>
            <td class="requiredMark">上门服务人员</td>
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
            <td class="requiredMark">到达时间</td>
            <td>
              <a-form-item>
                <a-date-picker
                  show-time
                  format="YYYY-MM-DD HH:mm"
                  :disabled="isVeiw"
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
              <td class="requiredMark">上门服务人员信息</td>
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
              <td class="requiredMark">首次故障排查费（元/次）</td>
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
              <td class="requiredMark">故障处理费</td>
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
      <ProblemForm ref="problemForm" @opinionChange="opinionChange" />
      <modal ref="modal" @ok="handleSaveOk" />
    </a-spin>
  </a-modal>
</template>
<script>
import {
  getOrgNamePage,
  listUserByAfterSale,
  networkManagementList,
  dispatchTaskDocument,
  taskDocumentDetail,
} from '@/api/after-sales-management' //机构名称
import { listUserBySale } from '@/api/systemSetting' //销售人员
import moment from 'moment'
import Modal from '../../Network/networkManagement/modules/addForm'
import CustomerSelect from './mode/CustomerSelect'
import ProblemForm from './mode/ProblemForm'
let uuid = () => Math.random().toString(32).slice(-10)
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
export default {
  name: 'BecomingForm',
  components: {
    ProblemForm,
    CustomerSelect,
    Modal,
  },
  data() {
    return {
      opinionData: [],
      record: {},
      mobile: '',
      options: [],
      recordDetails: {},
      visible: false,
      serType: false,
      spinning: false,
      previewImage: '',
      previewVisible1: false,
      saleuserShow: false,
      type: 'add',
      fileUrl: false,
      userInfo: this.$store.getters.userInfo,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      personincharge: [],
      AfterSale: [],
      NamePage: [],
      customerSelectOptions: {
        inputLabel: '',
        wrapperStyle: { flex: '1' },
        formLayout: 'inline',
        formItemLayout: {
          labelCol: { span: '' },
          wrapperCol: { span: '' },
        },
        inputRequired: true,
        inputAllowClear: true,
        inputDisable: false,
      },
      needOptions: {
        userId: undefined,
      },
    }
  },
  computed: {
    modalTitle() {
      let txt = this.isAdd ? '新增' : this.isVeiw ? '详情' : '修改'
      return `${txt}维修任务单`
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
    isDisabled() {
      return this.isVeiw
    },
  },

  created() {},
  methods: {
    handleAdd(type, e) {
      this.$refs.modal.query(type, e)
    },
    // onChange(value) {
    //   console.log(value)
    // },
    serviceType(value) {
      this.serType = value === 1 ? true : false
    },
    SelectChange(value) {
      let arr = this.AfterSale.find((i) => i.id === value)
      this.mobile = arr.userInfo.mobile || ''
    },
    moment: moment,
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
    query(type, record) {
      this.visible = true
      this.fileList = []
      this.fileList1 = []
      this.type = type
      this.record = record
      this.handleSaveOk()
      listUserBySale().then((res) => (this.personincharge = res.data))
      listUserByAfterSale().then((res) => (this.AfterSale = res.data))

      getOrgNamePage({ size: 50, current: 1 }).then((res) => (this.NamePage = res.data.records))
      if (type !== 'add') {
        this.fillData()
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
    // handleSearch(value) {
    //   fetch(value)
    // },
    // handleChange(value) {
    //   fetch(value)
    // },
    // fetch(value) {
    //   getOrgNamePage({ orgName: value, size: 50, current: 1 }).then(() => {
    //     this.NamePage = res.data.records
    //   })
    // },
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
    fillData() {
      let that = this
      let id = {
        id: this.record.id,
      }
      taskDocumentDetail(id).then((res) => {
        that.recordDetails = res.data

        this.opinionData = res.data.deviceInfoVoList.map((item) => {
          return {
            picture: item.photo.split(',').map((i) => {
              return {
                uid: uuid(),
                name: i.substr(0, 300),
                status: 'done',
                url: i,
              }
            }),
            createdName: item.createdName,
            deviceLocation: item.deviceLocation,
            isWarranty: item.isWarranty,
            mainBoardNo: item.mainBoardNo,
            orgId: item.orgId,
            orgName: item.orgName,
            photo: item.photo,
            problemDescription: item.problemDescription,
            productName: item.productName,
            quantity: item.quantity,
            remark: item.remark,
            video: item.video,
            villageId: item.villageId,
            villageName: item.villageName,
          }
        })
        this.form.setFieldsValue({
          source: res.data.source,
          orgId: res.data.orgId,
          customerId: res.data.customerId,
          customerName: res.data.customerName,
          saleUserId: res.data.saleUserId,
          linkman: res.data.linkman,
          contactNumber: res.data.contactNumber,
          orgName: res.data.orgName,
          taskType: res.data.taskType,
        })
        if (this.type !== 'Dispatch') {
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

        that.$refs.customerSelect &&
          that.$refs.customerSelect.fill({
            id: res.data.customerId || undefined,
            name: res.data.customerName,
          })
      })
    },
    handleOk() {
      console.log('你是要提交')
      let that = this
      if(that.isVeiw){
        that.handleCancel()
        return
      }
      if (that.type === 'Dispatch' || that.type === 'edit-salary') {
        that.form.validateFields((err, values) => {
          if (!err) {
            console.log(values)

            let params = {
              taskDocumentId: this.record.id,
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
      this.opinionData = []
      this.form.resetFields() // 清空表
      this.visible = false
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
  padding: 5px 10px;
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
