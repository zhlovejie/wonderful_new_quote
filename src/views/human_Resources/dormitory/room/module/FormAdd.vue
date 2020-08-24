<template>
  <a-modal
    title="新增房间用电"
    :width="700"
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
            <td>日期</td>
            <td colspan="3">
              <a-form-item>
                <a-month-picker
                  show-time
                  placeholder="日期"
                  format="YYYY-MM"
                  style="width: 300px;"
                  v-decorator="['surfaceDate', {initialValue:moment(),rules: [{required: true,message: '输入本月度数!',},
             ]}]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>房间号</td>
            <td colspan="3">
              <a-form-item>
                <a-select
                  placeholder="房间号"
                  :allowClear="true"
                  style="width:300px;"
                  v-decorator="['roomId', {rules: [{required: true,message: '输入本月度数!',},
             ]}]"
                >
                  <a-select-option
                    v-for="item in postSelectDataSource"
                    :key="item.id"
                    :value="item.id"
                  >{{item.roomCode}}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>本月读数</td>
            <td colspan="3">
              <a-form-item>
                <a-input
                  style="width:300px;"
                  placeholder="输入本月度数"
                  v-decorator="['thisMonthDegree', {rules: [{required: true,message: '输入本月度数!',},
             ]}]"
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
import { listRoom, room_Add } from '@/api/humanResources'
import moment from 'moment'
export default {
  name: 'BecomingForm',
  components: {},
  data() {
    return {
      visible: false,
      spinning: false,
      record: {},
      postSelectDataSource: [],
      form: this.$form.createForm(this, { name: 'do_becoming' }),
    }
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
  methods: {
    moment: moment,
    query(type, record) {
      console.log(type, record)
      this.visible = true
      this.type = type
      this.record = record
      listRoom().then((res) => {
        this.postSelectDataSource = res.data
      })
    },

    handleOk() {
      console.log('你是要提交')
      let that = this

      that.form.validateFields((err, values) => {
        if (!err) {
          values.surfaceDate = moment(values.surfaceDate).format('YYYY-MM')
          room_Add(values)
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