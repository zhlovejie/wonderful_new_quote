<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    v-model="visible"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" class="form">
        <a-form-item hidden>
          <a-input disabled v-decorator="[ 'id']" />
        </a-form-item>
        <a-form-item hidden>
          <a-input disabled placeholder="流程id" v-decorator="[ 'instanceId']" />
        </a-form-item>
        <a-form-item label="授权编号">
          <a-input disabled placeholder="自动生成" v-decorator="[ 'authorizationCode']" />
        </a-form-item>
        <a-form-item label="备案编号">
          <a-input
            read-only
            @click="openModule('selectedRecordCode')"
            placeholder="备案编号"
            v-decorator="[ 'recordCode', {rules: [{ required: true,message: '请输入备案编号', whitespace: true}]} ]"
          />
        </a-form-item>
        <a-form-item label="项目编号">
          <a-input
            placeholder="项目编号"
            v-decorator="[ 'projectCode', {rules: [{ required: true,message: '请输入项目编号', whitespace: true}]} ]"
          />
        </a-form-item>

          <a-form-item label="项目名称">
            <a-input
              placeholder="项目名称"
              v-decorator="[ 'projectName', {rules: [{ required: true, message: '请输入项目名称', whitespace: true}]} ]"
            />
          </a-form-item>

          <a-form-item label="招标单位名称">
            <a-input
              placeholder="招标单位名称"
              v-decorator="[ 'tenderingUnitName', {rules: [{ required: true, message: '请输入招标单位名称', whitespace: true}]} ]"
            />
          </a-form-item>

          <CustomerSelect
            ref="customerSelect"
            :options="customerSelectOptions"
            @selected="handleCustomerSelected"
          />

          <a-form-item label="被授权单位地址">
            <a-input
              disabled
              placeholder="被授权单位地址"
              v-model="address"
              v-decorator="[ 'saleCustomerAddress', {rules: [{ required: false, message: '被授权单位地址', whitespace: true}]} ]"
            />
          </a-form-item>
        <template v-if="templateType === 1">
          <a-form-item label="授权日期">
            <a-range-picker
              name="buildTime"
              style="width: 100%"
              v-decorator="[
                  'buildTime',
                  {rules: [{ required: true, message: '请选择授权日期' }]}
                ]"
            />
          </a-form-item>

          <a-form-item label="是否缴纳质保金">
            <a-radio-group :disabled="queryBoolean" v-decorator="['premium', {initialValue: 2}]">
              <a-radio :value="2">是</a-radio>
              <a-radio :value="1">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </template>
        <template v-if="templateType === 2">
          <a-form-item label="授权文件">
            <a-upload
              name="file"
              :multiple="false"
              :action="uploadPath"
              @change="handleChange"
              :fileList="fileList"
            >
              <a-button>
                <a-icon type="upload" />上传授权文件
              </a-button>
            </a-upload>
            <a-input v-decorator="[ 'wordUrl',{rules: [{ required: true,message: '请上传授权文件'}]}]" hidden />
          </a-form-item>
        </template>
      </a-form>
    </a-spin>

    <SelectedRecordCode ref="selectedRecordCode" @selected="selectedRecordCodeHandler" />
  </a-modal>
</template>

<script>
import ACol from 'ant-design-vue/es/grid/Col'
import { investigateSave, customerList, investigateUpdate } from '@/api/investigate'
import moment from 'moment'
import CustomerSelect from '@/components/CustomerList/CustomerSelect'
import SelectedRecordCode from './SelectedRecordCode'
import { getUploadPath2 } from '@/api/common'
export default {
  name: 'InvestigateForm',
  components: { ACol, CustomerSelect, SelectedRecordCode },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      //queryBoolean: false,
      saleCustomers: [],
      customerId: '',
      address: '无',
      form: this.$form.createForm(this),
      actionType: 'add',
      templateType: 1, //1 公司模板  2指定模板
      projectRecord: {},
      customerSelectOptions: {
        showInputLabel: true,
        wrapperStyle: {},
        formLayout: 'horizontal',
        formItemLayout: {
          labelCol: { span: '' },
          wrapperCol: { span: '' }
        },
        inputRequired: true,
        inputAllowClear: false,
        inputLabel: '被授权单位名称',
        inputPlaceholder: '被授权单位名称'
      },
      uploadPath: getUploadPath2,
      fileList: []
    }
  },
  computed: {
    queryBoolean: function() {
      return false
    },
    modalTitle: function() {
      let _ac = this.actionType === 'add' ? '新增' : '修改'
      let _tmp = this.templateType === 1 ? '公司' : '指定'
      return `${_ac}${_tmp}模板`
    }
  },
  methods: {
    add(projectCode) {
      this.fileList = []
      this.edit(projectCode)
      this.addOredit = 'save'
    },
    edit(record) {
      console.log(record)
      this.defaultFileList = []
      this.fileList = []
      this.visible = true
      //this.saleCustomers = record.saleCustomers
      let projectCodeObj = {
        authorizationCode: record.authorizationCode
      }
      this.$nextTick(() => {
        if (this.actionType === 'add') {
          this.form.setFieldsValue({ ...projectCodeObj })
        } else {
          console.log(record)
          console.log(this.projectRecord)

          if (this.templateType === 2 && this.projectRecord.wordUrl) {
            debugger
            //填充指定上传文件
            this.form.setFieldsValue({ wordUrl: this.projectRecord.wordUrl })
            let _arr = this.projectRecord.wordUrl.split('/')
            if (_arr.length > 0) {
              let _n = _arr[_arr.length - 1]
              this.fileList = [
                {
                  uid: '1',
                  name: _n,
                  status: 'done',
                  url: this.projectRecord.wordUrl
                }
              ]
            }
          }

          this.form.setFieldsValue({ ...projectCodeObj, ...this.projectRecord })
          this.form.setFieldsValue({
            buildTime: [
              moment(this.projectRecord.authorizationStartTime, 'YYYY-MM-DD'),
              moment(this.projectRecord.authorizationEndTime, 'YYYY-MM-DD')
            ]
          })
          // if(this.projectRecord && this.projectRecord.saleCustomerAddress === null){
          //   let t = this.saleCustomers.find(o => o.id === this.projectRecord.saleCustomerId)
          //   if(t){
          //     this.form.setFieldsValue({'saleCustomerAddress': t.address})
          //   }
          // }

          this.$refs.customerSelect && this.$refs.customerSelect.fill({
            id: this.projectRecord.saleCustomerId,
            name: this.projectRecord.saleCustomerName
          })
          this.form.setFieldsValue({ saleCustomerAddress: this.projectRecord.saleCustomerAddress })
        }
      })
    },
    async handleOk() {
      const _this = this
      let result = await this.$refs.customerSelect.validate().then(res => res)
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (result !== null && result && result.err) {
          return
        }
        // 验证表单没错误
        if (!err) {
          if (_this.templateType === 1) {
            _this.$set(values, 'token', _this.$store.getters.token)
            _this.$set(values, 'authorizationStartTime', values.buildTime[0])
            _this.$set(values, 'authorizationEndTime', values.buildTime[1])
          }
          values.saleCustomerId = result.values.customerId
          values.saleCustomerName = result.values.customerName
          values.templateType = _this.templateType

          console.log('form values', values)
          _this.confirmLoading = true
          if (_this.actionType === 'add') {
            console.log('this.addOredit :' + _this.addOredit)
            investigateSave(values)
              .then(data => {
                if (data.code == 200) {
                  // Do something
                  console.log(data)
                  _this.$message.success('保存成功')
                  _this.$emit('ok')
                } else {
                  _this.$message.error(data.msg)
                }
              })
              .catch(() => {
                // Do something
              })
              .finally(() => {
                _this.confirmLoading = false
                _this.form.resetFields()
                _this.$refs.customerSelect && _this.$refs.customerSelect.reset()
                _this.close()
              })
          } else {
            values.id = _this.projectRecord.id
            //investigateUpdate(values)
            investigateSave(values)
              .then(data => {
                if (data.code == 200) {
                  // Do something
                  console.log(data)
                  _this.$message.success('数据已更新成功')
                  _this.$emit('ok')
                } else {
                  _this.$message.error(data.msg)
                }
              })
              .catch(() => {
                // Do something
              })
              .finally(() => {
                _this.confirmLoading = false
                _this.form.resetFields()
                _this.$refs.customerSelect && _this.$refs.customerSelect.reset()
                _this.close()
              })
          }
          // eslint-disable-next-line eqeqeq
        }
      })
    },
    handleCancel() {
      this.close()
      this.form.resetFields()
      this.$refs.customerSelect.reset()
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    writeAddress(item) {
      console.log('writeAddress' + JSON.stringify(item))
      this.address = item.address
      const data = { saleCustomerAddress: item.address }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...data })
      })
    },
    filterCustomerOption(input, option) {
      // 是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。
      console.log('下拉框带搜索input', input)
      console.log('下拉框带搜索option', option)
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      // option.componentOptions.children[0].text   结果是"郑州依依不舍"
    },
    handleCustomerSelected(item) {
      console.log(item)
      this.saleCustomer = item.id
      this.form.setFieldsValue({ saleCustomerAddress: item.address })
    },
    handleCustomerClear() {
      this.saleCustomer = 0
    },
    openModule(key) {
      this.$refs[key].query()
    },
    selectedRecordCodeHandler(record) {
      console.log(record)
      this.form.setFieldsValue({ recordCode: record.recordCode })
    },
    handleChange({file,fileList}) {
      console.log(arguments)
      fileList = fileList.slice(-1)
      this.fileList = fileList.map(file => {
        if (file.response) {
          file.url = file.response.data
        }
        return file
      })
      if (file.status === 'done') {
        //debugger
        this.form.setFieldsValue({ wordUrl: file.response.data })
        //this.$nextTick(() => console.log(this.form.getFieldsValue()))
      }
    }
  }
}
</script>
<style scoped>
.form >>> .ant-form-item {
  display: flex;
}
.form >>> .ant-form-item .ant-form-item-label {
  width: 120px;
}
.form >>> .ant-form-item .ant-form-item-control-wrapper {
  flex: 1;
  max-width: 400px;
}
</style>
