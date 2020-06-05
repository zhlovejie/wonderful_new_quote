<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id']" />
        </a-form-item>
        <h3>现产品信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td class="wdf-column">产品名称</td>
            <td>
              <a-form-item>
                <a-input
                  v-decorator="['newName', { rules: [{ required: true, message: '输入产品名称' }] }]"
                />
              </a-form-item>
            </td>
            <td class="wdf-column">品牌</td>
            <td>
              <a-form-item>
                <a-input
                  v-decorator="['newBrand', { rules: [{ required: true, message: '输入品牌' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">价格(元)</td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width:100%;"
                  :min="0"
                  :step="1"
                  :precision="2"
                  v-decorator="['newPrice', { rules: [{ required: true, message: '输入价格' }]}]"
                />
              </a-form-item>
            </td>
            <td rowspan="2">图片</td>
            <td rowspan="2">
              <UploadFile key="newPic" ref="newPic" />
            </td>
          </tr>
          <tr>
            <td class="wdf-column">采购渠道</td>
            <td>
              <a-form-item>
                <a-input
                  v-decorator="['newChannel', { rules: [{ required: false, message: '输入采购渠道' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">备注</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  placeholder
                  :rows="2"
                  v-decorator="['newRemark', {initialValue:'', rules: [{ required: false, message: '输入备注' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">现物料代码</td>
            <td colspan="3">
              <a-form-item>
                <a-input
                  v-decorator="['newCode', { rules: [{ required: true, message: '输入现物料代码' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { depreciateApplyUse, depreciateApplyDetailUse } from '@/api/production/cutCost'
import UploadFile from './UploadFile'

import moment from 'moment'
function makeUUID() {
  return Math.random()
    .toString(32)
    .slice(-10)
}
export default {
  name: 'AddForm',
  components: {
    UploadFile
  },
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      record: {},
      detail: {}
    }
  },
  computed: {
    modalTitle() {
      return '应用'
    }
  },
  methods: {
    moment: moment,
    init() {
      let that = this
    },
    async handleOk() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          //提交
          try {
            let newFiles = that.$refs.newPic.getFiles()
            if (Array.isArray(newFiles) && newFiles.length > 0) {
              values.newPicture = newFiles[0].url
            }
          } catch (err) {
            console.log(err)
          }

          console.log(values)
          that.spinning = true
          depreciateApplyUse(values)
            .then(res => {
              that.spinning = false
              console.log(res)
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish')
            })
            .catch(err => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.visible = true
      that.actionType = type
      that.record = record || {}
      that.oaMeetingJoinList = []
      await that.form.resetFields()
      await that.init()

      try{
        if(that.$refs.newPicture){
          that.$refs.newPicture.setFiles([])
        }
      }catch(err){

      }

      //填充数据
      let result = await depreciateApplyDetailUse({ id: that.record.id })
        .then(res => res.data)
        .catch(err => null)
      if (result) {
        that.detail = { ...result }
        if (result.newPicture) {
          that.$refs.newPicture.setFiles([{ url: result.newPicture }])
        }
        that.$nextTick(() => that.form.setFieldsValue({ ...result }))
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

.add-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
.wdf-column {
  width: 120px;
}
</style>
