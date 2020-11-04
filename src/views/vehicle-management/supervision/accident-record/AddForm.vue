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
            <td style="width:120px;">车牌号</td>
            <td style="width:300px;">
              <a-form-item>
                <a-select 
                  v-if="!isView"
                  placeholder="车牌号"
                  v-decorator="['carId',{initialValue:detail.carId,rules: [{required: true,message: '选择车牌号'}]}]"
                  style="width:100%;"
                  @change="carCodeChange"
                >
                  <a-select-option v-for="item in carCodeList" :key="item.id" :value="item.id">{{item.carName}}-{{item.carCode}}</a-select-option>
                </a-select>
                <span v-if="isView">{{detail.carName}}-{{detail.carCode}}</span>
              </a-form-item>
            </td>
            <td style="width:120px;">车辆名称</td>
            <td style="width:300px;">
              <a-form-item>
                <a-input
                  v-if="!isView"
                  placeholder="车辆名称"
                  v-decorator="['carName',{initialValue:detail.carName,rules: [{required: true,message: '请输入车辆名称'}]}]"
                  :allowClear="true"
                  style="width:100%;"
                />
                <span v-if="isView">{{detail.carName}}</span>
              </a-form-item>
            </td>
            
          </tr>
          <tr>
            <td>违法时间</td>
            <td >
              <a-form-item>
                <a-date-picker
                  v-if="!isView"
                  show-time 
                  placeholder="违法时间"
                  v-decorator="['happenTime',{initialValue:detail.happenTime ? moment(detail.happenTime) :undefined,rules: [{required: true,message: '选择违法时间'}]}]"
                  style="width:100%;"
                />
                <span v-if="isView">{{detail.happenTime}}</span>
              </a-form-item>
            </td>
            <td>违章行为</td>
            <td >
              <a-form-item>
                <a-textarea 
                  v-if="!isView"
                  placeholder="违章行为" 
                  :rows="2" 
                  v-decorator="['action', { rules: [{ required: true, message: '请输入审批意见' }] }]"
                />
                <div v-if="isView">{{detail.action}}</div>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>金额</td>
            <td >
              <a-form-item>
                <a-input-number 
                  v-if="!isView"
                  placeholder="金额"
                  style="width:100%;"
                  :min="0"
                  :max="9999999"
                  :step="1"
                  :precision="2" 
                  v-decorator="['amount',{initialValue:detail.amount ,rules: [{required: true,message: '输入金额'}]}]"
                />
                <span v-if="isView">{{detail.amount}}</span>
              </a-form-item>
            </td>
            <td>分数</td>
            <td >
              <a-form-item>
                <a-input-number 
                  v-if="!isView"
                  placeholder="分数"
                  style="width:100%;"
                  :min="1"
                  :max="12"
                  :step="1"
                  v-decorator="['score',{initialValue:detail.score ,rules: [{required: true,message: '输入分数'}]}]"
                />
                <span v-if="isView">{{detail.score}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>违章照片</td>
            <td colspan="3">
              <a-form-item>
              <UploadFile ref="uploadFile" :opt="uploadFileOpt"/>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>

import {
  carIllegalAddOrUpdate,
  carInfoListWithoutPage,
  carIllegalDetail,
  carIllegalUpload
} from '@/api/vehicleManagement'
import DepUserSelect from '@/components/CustomerList/DepUserSelect'
import moment from 'moment'
import UploadFile from './UploadFile'

export default {
  name: 'AddForm',
  components: {
    DepUserSelect,
    UploadFile
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'add_form' }),
      visible: false,
      spinning: false,
      type: 'view',
      record: {},
      detail: {},
      carCodeList:[],
      uploadFileOpt:{
        accept:'image',
        listType:'picture-card',
        maxUploadCount:5,
        enabledPreview:true,
        enabledCompress:true
      }
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
          _detail = await carIllegalDetail({ id: record.id }).then((res) => res.data)
          that.spinning = false
          that.detail = { ..._detail }
        } catch (err) {
          console.log(err)
          that.spinning = false
        }
      }
    },
    initData() {
      let that = this
      let queue = []
      let task1 = carInfoListWithoutPage().then(res => that.carCodeList = res.data)
      queue.push(task1)
      return Promise.all(queue)
    },

    handleSubmit() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }

      this.form.validateFields((err, values) => {
        if (!err) {
          
          that.spinning = true
          values.evidenceList =  that.$refs.uploadFile.getFiles().map(f =>{
            return {
              illegalId:that.record.id,
              url:f.url
            }
          })
          values.happenTime = values.happenTime.format('YYYY-MM-DD HH:mm:ss')
          console.log('Received values of form: ', values)
          carIllegalAddOrUpdate(values)
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
    depUserChange(depId,userId){
      this.form.setFieldsValue({
        'careDepartmentId':depId,
        'careUserId':userId
      })
    },
    carCodeChange(carId){
      let target = this.carCodeList.find(item => item.id === carId)
      this.form.setFieldsValue({carName:target ? target.carName : undefined})
    }
  }
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
