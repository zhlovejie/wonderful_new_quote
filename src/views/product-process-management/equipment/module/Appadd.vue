<template>
  <a-modal
    :title="modalTitle"
    :width="1200"
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
        <h3 style="margin: 20px 0">基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td>设备编号</td>
            <td>{{ record.devNum }}</td>
            <td>设备名称</td>
            <td>{{ record.devName }}</td>
          </tr>
        </table>

        <h3 style="margin: 20px 0">保养日志</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <th style="width: 80px">序号</th>
            <th style="width: 300px">保养内容</th>
            <th>保养结果</th>
            <th>备注</th>
            <th v-if="isAcceptance || isView">验收结果</th>
            <th v-if="isAcceptance || isView">备注</th>
          </tr>
          <tr v-for="(item, index) in carCodeDetail" :key="item.index">
            <td>{{ index + 1 }}</td>
            <td>
              {{ item.careContent }}
              <a-form-item>
                <a-input hidden v-decorator="[`carCodeDetail.${index}.id`, { initialValue: item.id }]" />
              </a-form-item>
            </td>

            <td v-if="isHandle">
              <a-form-item>
                <a-radio-group
                  placeholder="选择保养结果"
                  @change="inputChange($event, item.id, 'careResult')"
                  v-decorator="[
                    `carCodeDetail.${index}.careResult`,
                    { initialValue: item.careResult, rules: [{ required: true, message: '选择保养结果' }] },
                  ]"
                >
                  <a-radio :value="1">良好</a-radio>
                  <a-radio :value="2">异常</a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
            <td v-else>{{ item.careResult === 1 ? '良好' : item.careResult === 2 ? '异常' : '' }}</td>
            <td v-if="isHandle">
              <a-form-item>
                <a-input
                  placeholder="保养备注"
                  style="width: 180px"
                  @change="inputChange($event, item.id, 'careRemark')"
                  v-decorator="[
                    `carCodeDetail.${index}.careRemark`,
                    { initialValue: item.careRemark, rules: [{ required: true, message: '请输入保养备注' }] },
                  ]"
                />
              </a-form-item>
            </td>
            <td v-else>{{ item.careRemark }}</td>

            <td v-if="isAcceptance">
              <a-form-item>
                <a-radio-group
                  placeholder="选择验收结果"
                  @change="inputChange($event, item.id, 'checkResult')"
                  v-decorator="[
                    `carCodeDetail.${index}.checkResult`,
                    { initialValue: item.checkResult, rules: [{ required: true, message: '选择验收结果' }] },
                  ]"
                >
                  <a-radio :value="1">良好</a-radio>
                  <a-radio :value="2">异常</a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
            <td v-else-if="isView">{{ item.checkResult === 1 ? '良好' : item.checkResult === 2 ? '异常' : '' }}</td>
            <td v-if="isAcceptance">
              <a-form-item>
                <a-input
                  placeholder="保养备注"
                  style="width: 180px"
                  @change="inputChange($event, item.id, 'checkRemark')"
                  v-decorator="[
                    `carCodeDetail.${index}.checkRemark`,
                    { initialValue: item.checkRemark, rules: [{ required: true, message: '请输入保养备注' }] },
                  ]"
                />
              </a-form-item>
            </td>
            <td v-else-if="isView">{{ item.checkRemark }}</td>
          </tr>
        </table>

        <h3 style="margin: 20px 0">时间日志</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 20%">保养人</td>
            <td style="width: 30%">{{ Maintainer.careUserName }}</td>
            <td style="width: 20%">保养时间</td>
            <td style="width: 30%">{{ Maintainer.careTime }}</td>
          </tr>
          <tr>
            <td>验收负责人</td>
            <td>{{ Maintainer.checkUserName }}</td>
            <td>验收时间</td>
            <td>{{ Maintainer.checkTime }}</td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { task_listStopHis, task_listWaiveHis } from '@/api/researchManagement'
import { getDetailDevelopmentCraftDevCareLog, updateDevelopmentCraftDevCareLog } from '@/api/ProcessManagement'
import moment from 'moment'
export default {
  name: 'BecomingForm',

  data() {
    return {
      departmentList: [], //所有部门
      degree: [],
      carCodeDetail: [],
      Maintainer: {},
      postSelectDataSource: [],
      visible: false,
      spinning: false,
      record: {},
      react: {},
      carCodeList: [],
      type: 'View',
      form: this.$form.createForm(this),
    }
  },
  computed: {
    modalTitle() {
      let tit = this.isHandle ? '处理' : this.isAcceptance ? '验收' : '查看'
      return `${tit}`
    },
    isViews() {
      return this.type === 'views'
    },
    isView() {
      return this.type === 'view'
    },
    isHandle() {
      return this.type === 'handle'
    },
    isAcceptance() {
      return this.type === 'acceptance'
    },
    isGiveUp() {
      return this.type === 'giveUp'
    },

    isDisabled() {
      return this.isView || this.isEditSalary
    },
  },
  watch: {},
  created() {},
  methods: {
    moment,
    query(type, record) {
      console.log(record)
      this.record = record
      this.type = type
      this.visible = true
      this.fillData(record)
    },

    inputChange(event, key, field) {
      let carCodeDetail = [...this.carCodeDetail]
      let target = carCodeDetail.find((item) => item.id === key)
      if (target) {
        target[field] = event instanceof Event ? event.target.value : event
        this.carCodeDetail = carCodeDetail
      }
    },
    fillData(record) {
      getDetailDevelopmentCraftDevCareLog({
        careCreatedTime: record.careCreatedTime,
        careType: record.careType,
        careUserId: record.careUserId,
        checkUserId: record.checkUserId,
        devId: record.devId,
      }).then((res) => {
        console.log(res)
        this.Maintainer = res.data[0]
        this.carCodeDetail = res.data
      })
    },
    handleOk() {
      let that = this
      if (that.isView) {
        return (that.visible = false)
      }
      that.form.validateFields((err, values) => {
        if (!err) {
          let react = {
            developmentCraftDevCareLogs: values.carCodeDetail,
          }
          if (that.isHandle) {
            react.checkFlag = 1
          }
          if (that.isAcceptance) {
            react.checkFlag = 2
          }

          updateDevelopmentCraftDevCareLog(react)
            .then((res) => {
              that.spinning = false
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish')
            })
            .catch((err) => (that.spinning = false))
          // }
          // if (that.isGiveUp) {
          //   let react = {
          //     taskId: this.record.id,
          //     reason: values.reason,
          //     giveUpType: values.giveUpType,
          //     operationType: 5,
          //   }
          //   values.developmentTaskExcuteHis = react
          //   delete values.reason
          //   delete values.giveUpType

          //   task_listWaiveHis(values)
          //     .then((res) => {
          //       that.spinning = false
          //       that.form.resetFields() // 清空表
          //       that.visible = false
          //       that.$message.info(res.msg)
          //       that.$emit('finish')
          //     })
          //     .catch((err) => (that.spinning = false))
          // }

          // let react = {
          //   taskId: this.record.id,
          // }
          // values.developmentTaskExcuteHis = react

          //   task_appointHis(values)
          //     .then((res) => {
          //       that.spinning = false
          //       that.form.resetFields() // 清空表
          //       that.visible = false
          //       that.$message.info(res.msg)
          //       that.$emit('finish')
          //     })
          //     .catch((err) => (that.spinning = false))
        }
      })
    },

    handleCancel() {
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
  padding: 10px 10px;
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
.process_tips {
  background-color: antiquewhite;
}
.process_header_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: antiquewhite;
  font-weight: 700;
  border: 1px solid #ddd;
}
.process_header_wrapper .draggable-columns-2 {
  flex: 1;
}
.process_main_wrapper {
  border: 1px solid #ddd;
}
.process_main_wrapper .draggable-columns-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #ddd;
}
.process_main_wrapper .draggable-columns-item:last-child {
  border-bottom: none;
}
.process_main_wrapper .draggable-columns-2 {
  flex: 1;
}
.draggable-columns {
  text-align: center;
  line-height: 35px;
  cursor: move;
}
.draggable-columns-1,
.draggable-columns-3 {
  width: 50%;
}
.draggable-columns-3 {
  cursor: pointer;
}
.ghost {
  background-color: rgba(250, 235, 215, 0.5);
}
</style>