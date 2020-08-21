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
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td>合同/协议名称</td>
            <td colspan="3">
              <a-form-item>
                <a-input
                  style="width:300px;"
                  placeholder="输入合同协议名称"
                  v-decorator="['contractName', {rules: [ {required: true,  message: '输入合同协议名称!'},
             ]}]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>版本号</td>
            <td colspan="3">
              <a-form-item>
                <a-input
                  style="width:300px;"
                  placeholder="输入版本号"
                  v-decorator="['version', {rules: [{required: true,message: '请输入版本号!',},
             ]}]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>设备文件</td>
            <td colspan="3">
              <a-form-item>
                <a-upload
                  v-decorator="['contractUrl',{ rules: [{ required: true, message: '请上传方案' }] },{valuePropName: 'fileList',getValueFromEvent: normFile,},]"
                  name="file"
                  :action="uploadUrl"
                >
                  <a-button style="width:300px;">
                    <a-icon type="upload" />
                  </a-button>
                </a-upload>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>

      <!-- <Approval ref="approval" @opinionChange="opinionChange" /> -->
    </a-spin>
  </a-modal>
</template>
<script>
import { contractAgreement_Add } from '@/api/humanResources'
import { getUploadPath2 } from '@/api/common'
import moment from 'moment'

export default {
  name: 'BecomingForm',
  components: {
    // Approval: Approval,
  },
  data() {
    return {
      visible: false,
      spinning: false,
      type: 'View',
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      uploadUrl: getUploadPath2(),
      //   上传文件
      fileList: [],
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改合同协议'
      }
      if (this.isView) {
        return '新增合同协议'
      }
      //   let txt = this.isView ? '新增' : '修改'
      //   return `${txt}合同协议`
    },
    isView() {
      //新增
      return this.type === 'add'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },

    isDisabled() {
      return this.isView || this.isEditSalary
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'human_Resources_Insurance') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    moment: moment,
    query(type, record) {
      console.log(type, record)
      this.visible = true
      this.type = type
      this.record = record
      if (type === 'edit-salary') {
        this.fillData()
      }
    },

    fillData() {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          contractName: this.record.contractName,
          version: this.record.version,
          contractUrl: this.record.contractUrl,
        })
      })
    },

    handleOk() {
      console.log('你是要提交')
      let that = this
      if (that.type === 'add' || that.type === 'edit-salary') {
        that.form.validateFields((err, values) => {
          if (!err) {
            if (that.type !== 'add') {
              values.id = this.record.id
            }
            if (that.type === 'add') {
              values.contractUrl = values.contractUrl.fileList[0].response.data
            }
            if (typeof values.contractUrl === 'string' && that.type === 'edit-salary') {
              values.contractUrl = values.contractUrl
            } else {
              values.contractUrl = values.contractUrl.fileList[0].response.data
            }

            contractAgreement_Add(values)
              .then((res) => {
                that.spinning = false
                console.log(res)
                that.form.resetFields() // 清空表
                that.visible = false
                that.$message.info(res.msg)
                that.$emit('finish')
              })
              .catch((err) => (that.spinning = false))
          }
        })
      } else if (that.isEditSalary) {
        // that.updateUserBackCardSalary()
      } else {
        that.form.resetFields() // 清空表
        that.visible = false
      }
    },
    //上传
    normFile(e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    handleCancel() {
      this.fileList = []
      this.form.resetFields() // 清空表
      this.visible = false
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