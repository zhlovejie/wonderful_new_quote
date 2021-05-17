<template>
  <a-modal
    :title="modalTitle"
    :width="800"
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
            <td>任务编号</td>
            <td>{{ record.taskNum }}</td>
          </tr>
          <tr>
            <td>来源</td>
            <td>{{ record.taskSource === 1 ? '销售订单' : '核价单' }}</td>
          </tr>
          <tr>
            <td>单据编号</td>
            <td>{{ record.sourceNum }}</td>
          </tr>
          <tr>
            <td>销售负责人</td>
            <td>{{ record.salerName }}</td>
          </tr>
          <tr>
            <td>产品名称</td>
            <td>{{ record.productName }}</td>
          </tr>
          <tr>
            <td>产品代码</td>
            <td>{{ record.productCode }}</td>
          </tr>
          <tr>
            <td>项目描述</td>
            <td>{{ record.productDesc }}</td>
          </tr>
          <tr>
            <td>项目负责人</td>
            <td>
              <template v-if="isEdit">
                <a-form-item>
                  <a-select
                    @change="depChangeHandler"
                    v-decorator="['chargeDepartmentId', { rules: [{ required: true, message: '请选择部门!' }] }]"
                    style="width: 48%"
                    placeholder="请选择部门"
                  >
                    <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">{{
                      item.departmentName
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item>
                  <a-select
                    style="width: 48%"
                    placeholder="请选择人员"
                    v-decorator="['chargeId', { rules: [{ required: true, message: '请选择人员!' }] }]"
                  >
                    <a-select-option v-for="item in postSelectDataSource" :key="item.id" :value="item.id">{{
                      item.trueName
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </template>
              <span v-else>{{ carCodeDetail.chargeName }}</span>
            </td>
          </tr>
          <tr>
            <td>难易系数</td>
            <td>
              <a-form-item v-if="isEdit">
                <a-select
                  placeholder="选择难易系数"
                  v-decorator="['difficultDicId', { rules: [{ required: true, message: '请选择难易系数!' }] }]"
                  :allowClear="true"
                  style="width: 70%"
                >
                  <a-select-option v-for="item in degree" :key="item.id" :value="item.id">{{
                    item.text
                  }}</a-select-option>
                </a-select>
              </a-form-item>
              <span v-else>{{ carCodeDetail.difficult }}</span>
            </td>
          </tr>
          <tr>
            <td>计划完成时间</td>
            <td>
              <a-form-item v-if="isEdit">
                <a-date-picker
                  show-time
                  v-decorator="[
                    'explainFinishTime',
                    {
                      rules: [{ required: true, message: '请选择计划完成时间' }],
                    },
                  ]"
                  style="width: 100%"
                />
              </a-form-item>
              <span v-else>{{ carCodeDetail.explainFinishTime }}</span>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { task_appointHis, task_getDevelopmentTaskInfo } from '@/api/researchManagement'
import { queryCode } from '@/api/workBox'
import {
  departmentList, //所有部门
  getUserByDep,
} from '@/api/systemSetting'
import moment from 'moment'
export default {
  name: 'BecomingForm',
  data() {
    return {
      departmentList: [], //所有部门
      degree: [],
      carCodeDetail: {},
      postSelectDataSource: [],
      visible: false,
      spinning: false,
      record: {},
      carCodeList: [],
      type: 'View',
      form: this.$form.createForm(this),
    }
  },
  computed: {
    modalTitle() {
      let tit = this.isEdit ? '派工' : '查看'
      return `${tit}`
    },
    isView() {
      return this.type === 'view'
    },
    isEdit() {
      return this.actionType === 'Dispatch '
    },
    isDisabled() {
      return this.isView || this.isEditSalary
    },
  },
  watch: {},
  created() {
    departmentList().then((res) => {
      this.departmentList = res.data
    })
    queryCode({ code: 'degreeDifficulty' }).then((res) => {
      this.degree = res.data
    })
  },
  methods: {
    moment,
    //选择人员
    depChangeHandler(dep_id) {
      let that = this
      that.depart = dep_id
      that.postSelectDataSource = []
      return getUserByDep({ departmentId: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
      })
    },
    query(type, record) {
      console.log(record)
      this.record = record
      this.type = type
      this.visible = true
      if (type === 'view') {
        this.fillData(record)
      }
    },

    fillData(record) {
      task_getDevelopmentTaskInfo({ id: record.id }).then((res) => {
        console.log(res)
        this.carCodeDetail = res.data
      })
    },
    handleOk() {
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          let react = {
            taskId: this.record.id,
          }
          values.developmentTaskExcuteHis = react
          values.explainFinishTime = moment(values.explainFinishTime).format('YYYY-MM-DD HH:mm:ss')
          task_appointHis(values)
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