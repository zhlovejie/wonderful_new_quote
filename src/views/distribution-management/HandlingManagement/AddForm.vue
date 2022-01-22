<template>
  <a-modal title="工价设置" :width="750" :visible="visible" @ok="handleOk" @cancel="handleCancel" :maskClosable="false">
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id', { initialValue: detail.id }]" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td>方数</td>
            <td>
              <a-form-item>
                <a-input
                  placeholder="方数"
                  :allowClear="true"
                  v-decorator="[
                    `squareNum`,
                    {
                      initialValue: detail.squareNum,
                      rules: [{ required: true, message: '请输入方数' }],
                    },
                  ]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>工价（元）</td>
            <td>
              <a-form-item>
                <a-input-number
                  :min="0"
                  :precision="2"
                  style="width: 100%"
                  v-decorator="[
                    `wages`,
                    {
                      initialValue: detail.wages,
                      rules: [{ required: true, message: '请输入工价（元）' }],
                    },
                  ]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <a-form-item>
                <a-textarea
                  style="width: 100%"
                  placeholder="备注"
                  :rows="2"
                  v-decorator="[
                    'remarks',
                    { initialValue: detail.remarks, rules: [{ required: false, message: '请输入备注' }] },
                  ]"
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
import { adminsaveAndUpdate, adminList } from '@/api/distribution-management'

export default {
  name: 'AddForm',
  components: {},
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      detail: {},
    }
  },
  computed: {},
  methods: {
    async handleOk() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          that.spinning = true
          adminsaveAndUpdate(values)
            .then((res) => {
              that.spinning = false
              let { code, msg } = res
              if (+code === 500) {
                that.$message.error(msg)
                return
              }
              that.$message.info(res.msg)
              that.handleCancel()
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query() {
      let that = this
      that.visible = true
      that.detail = {}
      await that.form.resetFields()
      adminList().then((res) => {
        console.log(res)
        if (res.data.length !== 0) {
          let resat = res.data[0]
          that.detail = { ...(resat || {}) }
        }
      })
    },
  },
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
}

.add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
}

.add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
</style>