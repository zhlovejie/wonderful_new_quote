<template>
  <a-modal
    :title="modalTitle"
    :width="1005"
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
      <a-form :form="form" class="becoming-form-wrapper">
        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td>任务单类型</td>
            <td>产品调试任务单</td>
            <td>任务单编号</td>
            <td>{{ record.taskNum }}</td>
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
        <h3 style="margin-top: 15px">问题设备</h3>
        <table class="custom-table custom-table-border" v-for="(item, index) in opinionData" :key="item.index">
          <a-button type="primary" style="margin-bottom: 15px; margin-top: 15px" shape="round">
            主板号：{{ item.mainBoardNo }}
          </a-button>
          <a-button v-if="false" type="link" @click="problemdel(index)">删除 </a-button>
          <tr>
            <td>机构</td>
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
                  disabled
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
                    style="width: 200px"
                    disabled
                    :field-names="{ label: 'networkName', value: 'id', children: 'serviceUserVoList' }"
                    :options="options"
                    v-decorator="['networkId', { rules: [{ required: true, message: '请选择上门服务人员信息!' }] }]"
                    placeholder="请选择上门服务人员信息"
                  />
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
              <td>区域</td>
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
                  <a-input
                    style="width: 200px"
                    :disabled="isDisabled"
                    placeholder="详细地址"
                    v-decorator="['actualMaintenanceLocation', { rules: [{ required: true, message: '详细地址' }] }]"
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
                    v-decorator="[
                      'actualSiteContact',
                      { rules: [{ required: true, message: '请输入实际现场联系人!' }] },
                    ]"
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
                    v-decorator="[
                      'actualSiteContactNumber',
                      { rules: [{ required: true, message: '实际现场联系人电话!' }] },
                    ]"
                  />
                </a-form-item>
              </td>
            </tr>
          </template>
        </table>
      </a-form>
      <ProblemForm ref="problemForm" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import {
  listUserByAfterSale,
  networkManagementList,
  handleTaskDocument,
  taskDocumentDetail,
} from '@/api/after-sales-management' //机构名称
import moment from 'moment'
import CustomerSelect from './mode/CustomerSelect'
import ProblemForm from './mode/ProblemForm'
import { getAreaByParent } from '@/api/common'
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
  },
  data() {
    return {
      opinionData: [],
      birthplaceOptions: [], //籍贯 级联 省市
      labelName: undefined,
      record: {},
      mobile: '',
      options: [],
      recordDetails: {},
      visible: false,
      sceneType: false,
      serType: false,
      spinning: false,
      previewImage: '',
      previewVisible1: false,
      saleuserShow: false,
      type: 'add',
      fileUrl: false,
      userInfo: this.$store.getters.userInfo,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      AfterSale: [],
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
      return this.type === 'handle'
    },
    isDisabled() {
      return this.isVeiw
    },
  },

  created() {},
  methods: {
    serviceModeType(value) {
      this.sceneType = value === 1 ? true : false
    },
    serviceType(value) {
      this.serType = value === 1 ? true : false
    },
    SelectChange(value) {
      let arr = this.AfterSale.find((i) => i.id === value)
      this.mobile = arr.userInfo.mobile || ''
    },
    moment,
    async query(type, record) {
      this.visible = true
      this.fileList = []
      this.fileList1 = []
      this.type = type
      this.record = record
      let _areaData = await this.loadAreaAction(100000)
      this.birthplaceOptions = _areaData

      listUserByAfterSale().then((res) => (this.AfterSale = res.data))
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

      this.fillData()
      if (type !== 'handle' && record.serviceMode === 1) {
        let that = this
        if (record.province) {
          let _arr = record.province.split(',')
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

        this.serType = res.data.taskUserInfo.serviceType === 1 ? true : false

        this.mobile = res.data.taskUserInfo.maintenanceUserPhone
        this.$nextTick(() => {
          this.form.setFieldsValue({
            serviceMode: res.data.taskUserInfo.serviceMode,
            maintenanceUserId: res.data.taskUserInfo.maintenanceUserId,
            arriveTime: moment(res.data.taskUserInfo.arriveTime),
            serviceType: res.data.taskUserInfo.serviceType,
          })
        })
        if (!this.isEditSalary) {
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
      if (that.type === 'handle') {
        that.form.validateFields((err, values) => {
          if (!err) {
            console.log(values)

            let params = {
              id: this.recordDetails.taskUserInfo.id,
              taskDocumentId: this.record.id,
              serviceMode: values.serviceMode,
            }
            if (values.serviceMode === 1) {
              params.actualMaintenanceLocation = values.actualMaintenanceLocation
              params.actualSiteContact = values.actualSiteContact
              params.actualSiteContactNumber = values.actualSiteContactNumber
              params.province = values.territory.toString()
              params.provinceName = this.labelName
            }

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