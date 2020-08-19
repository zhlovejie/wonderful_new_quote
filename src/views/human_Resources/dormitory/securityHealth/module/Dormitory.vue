<template>
  <a-modal
    :title="modalTitle"
    :width="1050"
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
    <h1 style=" text-align: center;">员工宿舍检查表</h1>
    <span style="  margin-right: 100px;">
      <strong>检查人:</strong>
      {{this.securityHealthDetail.inspectName}}
    </span>
    <span>
      <strong>检查时间 :</strong>
      {{this.securityHealthDetail.inspectTime}}
    </span>
    <a-spin :spinning="spinning" style="margin-top: 10px;">
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <th style="width:50px">序号</th>
            <th>项目</th>
            <th>检查内容</th>
            <th>
              {{this.securityHealthDetail.roomCode}}
              <br />检查情况
            </th>
          </tr>
          <tr>
            <td>1</td>
            <td rowspan="4">用电/电器设备使用</td>
            <td>
              用电设备的安全防护装置是否完好,用电线路是否有破损,裸露,
              <br />接触不良,老化,照明是否充足
            </td>
            <td>
              <a-form-item>
                <a-radio-group
                  v-decorator="['electricProtectDevice', { rules: [{ required: true, message: '请选择你的评价' }] }]"
                  :disabled="isDisabled"
                >
                  <a-radio value="1">优秀</a-radio>
                  <a-radio value="2">良好</a-radio>
                  <a-radio value="3">差</a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>
              宿舍内部有无明线,是否有私拉乱接电线，不准存放易燃易爆物品，
              <br />不准在宿舍内吸烟，烧水，做饭以及燃放烟花爆竹等一切违规操作
            </td>
            <td>
              <a-form-item>
                <a-radio-group
                  v-decorator="['electricPrivateConnection', { rules: [{ required: true, message: '请选择你的评价' }] }]"
                  :disabled="isDisabled"
                >
                  <a-radio value="1">优秀</a-radio>
                  <a-radio value="2">良好</a-radio>
                  <a-radio value="3">差</a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td>室内是否有公司禁用的大功率电器;是否留宿他人</td>
            <td>
              <a-form-item>
                <a-radio-group
                  v-decorator="['electricHighPower', { rules: [{ required: true, message: '请选择你的评价' }] }]"
                  :disabled="isDisabled"
                >
                  <a-radio value="1">优秀</a-radio>
                  <a-radio value="2">良好</a-radio>
                  <a-radio value="3">差</a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>4</td>
            <td>各种用电设备使用完毕是否及时关闭电源，节约用水用电</td>
            <td>
              <a-form-item>
                <a-radio-group
                  v-decorator="['electricTimeClose', { rules: [{ required: true, message: '请选择你的评价' }] }]"
                  :disabled="isDisabled"
                >
                  <a-radio value="1">优秀</a-radio>
                  <a-radio value="2">良好</a-radio>
                  <a-radio value="3">差</a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>5</td>
            <td rowspan="3">公德/卫生情况</td>
            <td>
              室内所有物品都要摆放整齐，垃圾必须用袋装好，并一天一倒，
              <br />不准将垃圾随便扫至走廊等公共区域．
            </td>
            <td>
              <a-form-item>
                <a-radio-group
                  v-decorator="['meritsPutNeat', { rules: [{ required: true, message: '请选择你的评价' }] }]"
                  :disabled="isDisabled"
                >
                  <a-radio value="1">优秀</a-radio>
                  <a-radio value="2">良好</a-radio>
                  <a-radio value="3">差</a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>6</td>
            <td>
              宿舍内不准大声播放音乐，不准大声喧哗，不准剧烈活动及使用器具，
              <br />制造杂间等扰乱他人及附近安宁的行为．
            </td>
            <td>
              <a-form-item>
                <a-radio-group
                  v-decorator="['meritsNoise', { rules: [{ required: true, message: '请选择你的评价' }] }]"
                  :disabled="isDisabled"
                >
                  <a-radio value="1">优秀</a-radio>
                  <a-radio value="2">良好</a-radio>
                  <a-radio value="3">差</a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>7</td>
            <td>严禁以任何形式在宿舍赌博，吸毒，打驾斗殴以及封建迷信活动</td>
            <td>
              <a-form-item>
                <a-radio-group
                  v-decorator="['meritsStrictlyProhibit', { rules: [{ required: true, message: '请选择你的评价' }] }]"
                  :disabled="isDisabled"
                >
                  <a-radio value="1">优秀</a-radio>
                  <a-radio value="2">良好</a-radio>
                  <a-radio value="3">差</a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">备注信息</td>
            <td colspan="2">
              <a-form-item>
                <a-textarea
                  placeholder="请输入备注"
                  :rows="3"
                  v-decorator="['remarks', { rules: [{ required: false, message: '请输入备注' }] }]"
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
import { securityHealth_Detail, securityHealth_List_update } from '@/api/humanResources'
import moment from 'moment'

export default {
  name: 'BecomingForm',
  components: {},
  data() {
    return {
      visible: false,
      spinning: false,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      type: 'add',
      record: {},
      securityHealthDetail: {},
    }
  },
  computed: {
    modalTitle() {
      //   if (this.isEditSalary) {
      //     return '修改员工宿舍检查表'
      //   }
      let txt = this.isView ? '查看' : this.handles ? '处理' : '修改'
      return `${txt}安全卫生考核`
    },
    handles() {
      return this.type === 'handle'
    },
    isView() {
      //查看
      return this.type === 'see'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
    isDisabled() {
      return this.isView
    },
  },

  methods: {
    moment: moment,
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record
      this.$nextTick(() => {
        this.fillData()
      })
    },

    fillData() {
      securityHealth_Detail({ id: this.record.id }).then((res) => {
        console.log(res.data)
        this.securityHealthDetail = res.data.data
        if (this.type === 'see' || this.type === 'edit-salary') {
          this.form.setFieldsValue({
            electricHighPower: res.data.data.electricHighPower.toString(),
            electricPrivateConnection: res.data.data.electricPrivateConnection.toString(),
            electricProtectDevice: res.data.data.electricProtectDevice.toString(),
            electricTimeClose: res.data.data.electricTimeClose.toString(),
            meritsNoise: res.data.data.meritsNoise.toString(),
            meritsPutNeat: res.data.data.meritsPutNeat.toString(),
            meritsStrictlyProhibit: res.data.data.meritsStrictlyProhibit.toString(),
            remarks: res.data.data.remarks,
          })
        }
      })
    },

    handleOk() {
      console.log('你这是要提交')
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          values.id = this.record.id
          securityHealth_List_update(values).then((res) => {
            that.spinning = false
            console.log(res)
            that.form.resetFields() // 清空表
            this.haveProcess = []
            that.visible = false
            that.$message.info(res.msg)
            that.$emit('finish')
          })
        }
      })
    },

    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      return queryList({ departmentId: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
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
