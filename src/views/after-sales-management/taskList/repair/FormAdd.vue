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
            <td>设备维修</td>
            <td>任务单编号</td>
            <td>{{ record && record.taskNum ? record.taskNum : '系统自动生成' }}</td>
          </tr>
          <tr>
            <td>来源</td>
            <td>
              <a-form-item>
                <a-select
                  v-decorator="['source', { rules: [{ required: true, message: '请选择来源！' }] }]"
                  :disabled="isDisabled"
                  allowClear
                  style="width: 200px"
                  placeholder="来源"
                >
                  <a-select-option :value="1">400售后电话</a-select-option>
                  <a-select-option :value="2"> 客户反馈</a-select-option>
                  <a-select-option :value="3"> 第三方反馈</a-select-option>
                  <a-select-option :value="4"> 销售部</a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td>机构名称</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="机构名称"
                  showSearch
                  :disabled="isDisabled"
                  :filterOption="filterOption"
                  v-decorator="['orgId', { rules: [{ required: true, message: '请选择机构名称' }] }]"
                  :allowClear="true"
                  style="width: 200px"
                >
                  <a-select-option v-for="item in NamePage" :key="item.orgId" :value="item.orgId">{{
                    item.orgName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>客户名称</td>
            <td>
              <CustomerSelect
                ref="customerSelect"
                v-if="!isDisabled"
                :needOptions="needOptions"
                :options="customerSelectOptions"
                @selected="handleCustomerSelected"
              />
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  hidden
                  v-decorator="['customerId', { rules: [{ required: true, message: '请选择客户名称' }] }]"
                />
                <span v-else>{{ recordDetails.customerName }}</span>
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['customerName']" />
              </a-form-item>
            </td>
            <td>销售负责人</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="销售负责人"
                  showSearch
                  :disabled="saleuserShow || isDisabled"
                  :filterOption="filterOption"
                  v-decorator="['saleUserId', { rules: [{ required: true, message: '请选择客户名称' }] }]"
                  :allowClear="true"
                  style="width: 200px"
                >
                  <a-select-option v-for="item in personincharge" :key="item.id" :value="item.id">{{
                    item.trueName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td>联系人</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  style="width: 200px"
                  placeholder="输入联系人"
                  v-decorator="['linkman', { rules: [{ required: true, message: '请输入联系人!' }] }]"
                />
              </a-form-item>
            </td>
            <td>联系人电话</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  style="width: 200px"
                  placeholder="输入联系人电话"
                  v-decorator="['contactNumber', { rules: [{ required: true, message: '输入联系人电话!' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
        <h3 style="margin-top: 15px">
          问题设备
          <a-button v-if="!isDisabled" type="link" style="margin-bottom: 15px; float: right" @click="problemadd"
            >新增
          </a-button>
        </h3>
        <table class="custom-table custom-table-border" v-for="(item, index) in opinionData" :key="item.index">
          <a-button type="primary" style="margin-bottom: 15px; margin-top: 15px" shape="round">
            主板号：{{ item.mainBoardNo }}
          </a-button>
          <a-button v-if="!isDisabled" type="link" @click="problemdel(index)">删除 </a-button>
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
      </a-form>
      <ProblemForm ref="problemForm" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import { getOrgNamePage, addAndUpdateTaskDocument, taskDocumentDetail } from '@/api/after-sales-management' //机构名称
import { listUserBySale } from '@/api/systemSetting' //销售人员
import moment from 'moment'
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
  },
  data() {
    return {
      opinionData: [],
      record: {},
      recordDetails: {},
      visible: false,
      spinning: false,
      previewImage: '',
      previewVisible1: false,
      saleuserShow: false,
      type: 'add',
      fileUrl: false,
      userInfo: this.$store.getters.userInfo,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      personincharge: [],
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
    moment: moment,
    query(type, record) {
      this.visible = true
      this.fileList = []
      this.fileList1 = []
      this.type = type
      this.record = record
      listUserBySale().then((res) => (this.personincharge = res.data))
      getOrgNamePage().then((res) => (this.NamePage = res.data))
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
        that.$refs.customerSelect &&
          that.$refs.customerSelect.fill({
            id: res.data.customerId || undefined,
            name: res.data.customerName,
          })
      })
    },
    handleOk() {
      let that = this
      if (that.isVeiw) {
        return (that.visible = false)
      }
      if (that.type === 'add' || that.type === 'edit-salary') {
        that.form.validateFields((err, values) => {
          if (!err) {
            values.deviceInfoSaveBoList =
              this.opinionData.map((i) => {
                return {
                  deviceLocation: i.deviceLocation,
                  mainBoardNo: i.mainBoardNo,
                  orgName: i.orgName,
                  photo: i.photo,
                  problemDescription: i.problemDescription,
                  productName: i.productName,
                  remark: i.remark,
                  villageName: i.villageName,
                  video: i.video,
                  orgId: i.orgId,
                  villageId: i.villageId,
                }
              }) || []
            let react = this.NamePage.find((i) => i.orgId === values.orgId)
            let react1 = this.personincharge.find((i) => i.id === values.saleUserId)
            values.saleUserName = react1.trueName
            values.orgName = react.orgName
            values.taskType = 1
            that.spinning = true
            addAndUpdateTaskDocument(values)
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