<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="wdf-custom-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id',{initialValue:detail.id}]" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:120px;">名称</td>
            <td>
              <a-form-item>
                <a-input
                  v-if="!isView"
                  placeholder="药品名称"
                  v-decorator="['medicineName',{initialValue:detail.medicineName,rules: [{required: true,message: '请输入药品名称'}]}]"
                  :allowClear="true"
                  style="width:100%;"
                />
                <span v-if="isView">{{detail.medicineName}}</span>
              </a-form-item>
            </td>
            <td style="width:120px;">生产日期</td>
            <td>
              <a-form-item>
                <a-date-picker 
                  v-if="!isView"
                  placeholder="生产日期"
                  v-decorator="['productionDate',{initialValue:detail.productionDate ? moment(detail.beginTime) :undefined,rules: [{required: true,message: '选择生产日期'}]}]"
                  style="width:100%;"
                  @change="datePickerChange"
                />
                <span v-if="isView">{{detail.productionDate}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>质保期(月)</td>
            <td >
              <a-form-item>
                <a-input-number 
                  v-if="!isView"
                  placeholder="质保期"
                  style="width:100%;"
                  :min="0"
                  :max="99999"
                  :step="1"
                  :precision="0" 
                  v-decorator="['shelfLife',{initialValue:+detail.shelfLife || undefined ,rules: [{required: true,message: '输入质保期'}]}]"
                  @change="datePickerChange"
                />
                <span v-if="isView">{{detail.shelfLife}}</span>
              </a-form-item>
            </td>
            <td>到期日期</td>
            <td >
              <a-form-item>
                <a-date-picker
                  disabled
                  v-if="!isView"
                  placeholder="到期日期"
                  v-decorator="['expirationDate',{initialValue:detail.expirationDate ? moment(detail.expirationDate) :undefined,rules: [{required: false,message: '选择到期日期'}]}]"
                  style="width:100%;"
                />
                <span v-if="isView">{{detail.expirationDate}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>保管人</td>
            <td colspan="3">
              <a-form-item>
                <a-input 
                  v-if="!isView"
                  style="width:100%;cursor: pointer;"
                  read-only
                  placeholder="选择保管人"
                  @click="openSystemUsers('preserver')"
                  v-decorator="['preserver',{initialValue:detail.preserver,rules: [{ required: true, message: '选择保管人'}]}]"
                />
                <span v-if="isView">{{detail.preserver}}</span>
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['preserverId',{initialValue:detail.preserverId}]" />
              </a-form-item>
            </td>
            <!-- <td>保管人手机号</td>
            <td >
              <a-form-item>
                <a-input 
                  v-if="!isView"
                  v-decorator="['preserverMobile',{initialValue:detail.preserverMobile,rules: [{required: true,message: '输入手机号'},{pattern: /^1\d{10}$/,message:'请输入正确的手机号码'}]}]"
                  placeholder="输入手机号"
                />
                <span v-if="isView">{{detail.preserverMobile}}</span>
              </a-form-item>
            </td> -->
          </tr>
          <tr>
            <td>图片</td>
            <td colspan="3" style="text-align:center;">
              <a-form-item v-if="!isView">
                <UploadFile ref="uploadFile" maxFileCount="1" />
                <a-input
                  hidden
                  v-decorator="['pictureUrl',{initialValue:detail.pictureUrl,rules:[{ required: true, message: '请上传图片' }]}]"
                />
              </a-form-item>
              <span v-if="isView">
                <img :src="detail.pictureUrl" @click="showImg(detail.pictureUrl)" style="width:128px;height:auto;overflow:hidden;" alt="图片">
              </span>
            </td>
          </tr>
          <tr>
            <td>功效</td>
            <td colspan="3" style="text-align:left;">
              <a-form-item>
                <a-textarea 
                  v-if="!isView"
                  style="width:100%;"
                  placeholder="功效"
                  :rows="3"
                  v-decorator="['efficacy', { initialValue:detail.efficacy,rules: [{ required: false, message: '请输入功效' }] }]"
                />
                <span v-if="isView" v-html="formatHTML(detail.efficacy)" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td colspan="3" style="text-align:left;">
              <a-form-item>
                <a-textarea 
                  v-if="!isView"
                  style="width:100%;"
                  placeholder="备注"
                  :rows="3"
                  v-decorator="['remark', { initialValue:detail.remark,rules: [{ required: false, message: '请输入备注' }] }]"
                />
                <span v-if="isView" v-html="formatHTML(detail.remark)" />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
      <!-- <CustomerList ref="customerList" @selected="handlerCustomerSelected" /> -->
      <SystemUserSelect ref="systemUserSelect" @selectSystemUsers="selectSystemUsers" />
      <ImgView ref="imgView" />
    </a-spin>
  </a-modal>
</template>
<script>
import SystemUserSelect from '@/components/CustomerList/SystemUserSelect'
import UploadFile from '@/components/CustomerList/UploadFile' 
import ImgView from '@/components/CustomerList/ImgView'
import {
  emergencyMedicineAddOrUpdate,
  emergencyMedicineDetail,
  emergencyMedicineReplenishmentList,
} from '@/api/contingencyManagement'
import moment from 'moment'

function makeKey() {
  return Math.random().toString(32).slice(-10)
}

export default {
  name: 'AddForm',
  components: {
    UploadFile,
    SystemUserSelect,
    ImgView
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'add_form' }),
      visible: false,
      spinning: false,
      type: 'view',
      record: {},
      detail: {}
    }
  },
  watch: {},
  computed: {
    isView() {
      return this.type === 'view'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    modalTitle() {
      return this.type === 'add' ? '新增' : this.type === 'view' ? '查看' : '编辑'
    },
  },
  methods: {
    moment,
    async query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      that.record = Object.assign({}, record)
      that.detail = {}
      that.form.resetFields()
      await that.initData()
      if (type === 'view' || type === 'edit') {
        that.spinning = true
        let _detail = null
        try {
          _detail = await emergencyMedicineDetail({ id: record.id }).then((res) => res.data)
          that.spinning = false
          if(_detail.productionDate){
            _detail.productionDate = _detail.productionDate.slice(0,10)
          }
          if(_detail.expirationDate){
            _detail.expirationDate = _detail.expirationDate.slice(0,10)
          }

          that.detail = { ..._detail }

          //pictureUrl
          that.$refs.uploadFile.setFiles([
            {
              url:_detail.pictureUrl
            }
          ])
          
        } catch (err) {
          console.log(err)
          that.spinning = false
        }
      }
    },
    initData() {
      let that = this
      let queue = []
      return Promise.all(queue)
    },

    handleSubmit() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }

      let files = that.$refs.uploadFile.getFiles() || []
      if (files.length > 0) {
        that.form.setFieldsValue({
          pictureUrl: files[0].url,
        })
      }else{
        that.form.setFieldsValue({
          pictureUrl: undefined,
        })
      }

      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          that.spinning = true

          values.productionDate = values.productionDate.format('YYYY-MM-DD')
          values.expirationDate = values.expirationDate.format('YYYY-MM-DD')

          emergencyMedicineAddOrUpdate(values)
            .then((res) => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch((err) => {
              that.spinning = false
              that.$message.error('操作失败')
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    formatHTML(htmlStr) {
      if (typeof htmlStr !== 'string') {
        return ''
      }
      htmlStr = htmlStr.replace(/[\n\r]/g, '<br/>')
      htmlStr = htmlStr.replace(/\s+/g, '&nbsp;')
      return htmlStr
    },
    openSystemUsers(decoratorKey) {
      this.$refs.systemUserSelect.query(decoratorKey)
    },
    selectSystemUsers({ decoratorKey, record }) {
      console.log(decoratorKey, record)
      this.form.setFieldsValue({
        preserver: record.trueName,
        preserverId: record.id,
      })
    },
    datePickerChange() {
      let that = this
      that.$nextTick(() => {
        let { productionDate, shelfLife, expirationDate } = that.form.getFieldsValue()
        if (productionDate && productionDate instanceof moment && shelfLife && shelfLife > 0) {
          that.form.setFieldsValue({
            expirationDate: productionDate.clone().add(shelfLife, 'months'),
          })
        } else {
          that.form.setFieldsValue({
            expirationDate: undefined,
          })
        }
      })
    },
    showImg(url){
      this.$refs.imgView.show(url)
    }
  },
}
</script>
<style scoped>
.wdf-custom-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
.wdf-custom-form-wrapper >>> .custom-table td {
  padding: 5px 10px;
  text-align: center;
}

.wdf-custom-form-wrapper >>> .ant-upload-list-picture-card .ant-upload-list-item-info::before{
  left: 0;
}
</style>
