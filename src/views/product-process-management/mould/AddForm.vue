<template>
  <a-modal
    :title="modalTitle"
    :width="850"
    :visible="visible"
    :footer="footer"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="spinning">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        class="product-process-management_mould-management-wrapper"
      >
      <table class="custom-table custom-table-border">
        <tr>
          <td>模具名称</td>
          <td>
            <a-form-model-item prop="code">
              <a-input style="width:100%;" :disabled="isDisabled" placeholder="车间代码" v-model="form.a" />
            </a-form-model-item>
          </td>
          <td>模具型号</td>
          <td>
            <a-form-model-item prop="code">
              <a-input style="width:100%;" :disabled="isDisabled" placeholder="车间代码" v-model="form.b" />
            </a-form-model-item>
          </td>
        </tr>
        <tr>
          <td>个数</td>
          <td>
            <a-form-model-item prop="code">
              <a-input style="width:100%;" :disabled="isDisabled" placeholder="车间代码" v-model="form.c" />
            </a-form-model-item>
          </td>
          <td>保管责任人</td>
          <td>
            <DepartmentPostCascade style="width:100%;" :value.sync="form.d" :disabled="isDisabled" />
          </td>
        </tr>
        <tr>
          <td>存放位置</td>
          <td></td>
          <td>仓位说明</td>
          <td>
            <a-form-model-item  prop="remark">
              <a-input style="width:100%;" :disabled="isDisabled" placeholder="车间代码" v-model="form.remark" />
            </a-form-model-item>
          </td>
        </tr>
        <tr>
          <td>图片</td>
          <td>
            <UploadFile
              ref="checkingCode"
              :config="uploadConfig"
              @change="(files) => fileChange('checkingCode',files)"
            />
          </td>
          <td>二维码</td>
          <td>
            <a-form-model-item  prop="qrcodeUrl">
              <img v-if="form.qrcodeUrl" :src="form.qrcodeUrl" alt="" srcset="" >
              <span v-else>系统自动生成</span>
            </a-form-model-item>
          </td>
        </tr>
        <tr>
          <td>换模价格(元)</td>
          <td colspan="3">
            <a-form-model-item prop="changeMoudlPrice">
              <a-input-number
                :min="0"
                :precision="2"
                step="1"
                style="width: 100%"
                v-model="form.changeMoudlPrice"
              />
            </a-form-model-item>
          </td>
        </tr>
      </table>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  addAndUpdateMeetingLeave,
  approvalMeetingLeave,
  getMeetingLeaveDetail
} from '@/api/meetingManagement'
import moment from 'moment'
import UploadFile from './UploadFile'
import DepartmentPostCascade from '@/components/CustomerList/DepartmentPostCascade'

export default {
  name: 'product-process-management_mould-management-addForm',
  components: {
    DepartmentPostCascade,
    UploadFile
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      visible: false,
      actionType: 'view',
      spinning: false,
      detail: {},
      form:{
        name:undefined,
        code:undefined
      },
      rules:{
        name: [{ required: true, message: '请选择车间名称', trigger: 'change' }],
        code: [
          { required: true, message: '请输入车间代码', trigger: 'blur' }
        ],

      },
      DepartmentPostValue:null,
      uploadConfig: {
        maxFileCount: 1,
        fileType: 'img',
        enablePreview: true
      },
    }
  },
  computed: {
    modalTitle() {
      return this.isView ? '查看' : this.isAdd ? '新增' : '编辑'
    },
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
    isApproval(){
      return this.actionType === 'approval'
    },
    isDisabled(){
      return this.isView || this.isApproval
    },
    footer() {
      let that = this
      const h = that.$createElement
      let btn = []
      if (that.isView) {
        return null
      } else if (that.isAdd || that.isEdit) {
        btn.push(h('a-button', { key: 'cancel', on: { click: that.handleCancel } }, '取消'))
        btn.push(
          h(
            'a-button',
            {
              key: 'submit',
              on: { click: () => that.handleOk() },
              props: { type: 'primary', loading: that.spinning },
            },
            '提交'
          )
        )
      } else if (that.isApproval) {
        btn.push(h('a-button', { key: 'no-pass', on: { click: that.noPassAction } ,props:{loading: that.spinning}}, '不通过'))
        btn.push(
          h(
            'a-button',
            { key: 'pass', on: { click: that.passAction }, props: { type: 'primary', loading: that.spinning } },
            '通过'
          )
        )
      }
      return btn
    },
  },
  methods: {
    moment,
    async handleOk() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          values.beginTime = values.beginTime.format('YYYY-MM-DD HH:mm:ss')
          values.endTime = values.endTime.format('YYYY-MM-DD HH:mm:ss')
          that.spinning = true
          addAndUpdateMeetingLeave(values)
            .then((res) => {
              that.spinning = false
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish')
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record = {}) {
      let that = this
      that.visible = true
      that.actionType = type
      that.leaveTime = ''
      that.detail = {}
      return
      if(that.isAdd){
        let {id:meetingId,setTimeStr} = record
        let f = (str) => {
          let [ymd,sub] = str.split(' ')
          let [s,e] = sub.split('-')
          return {beginTime:`${ymd} ${s}:00`,endTime:`${ymd} ${e}:00`}
        }
        let {beginTime,endTime} = f(setTimeStr)
        that.detail = {
          meetingId,
          beginTime,
          endTime
        }
        that.leaveTime = that.calcTimes(that.moment(beginTime),that.moment(endTime))
      }else{
        await getMeetingLeaveDetail({id:record.id}).then(res =>{
          that.detail = res.data
          let {beginTime,endTime} = that.detail
          that.leaveTime = that.calcTimes(that.moment(beginTime),that.moment(endTime))
        })
      }
    }
  }
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.product-process-management_mould-management-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.product-process-management_mould-management-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
  width: calc(100% + 2px);
}

</style>
