<template>
  <a-modal
    :title="modalTitle"
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
            <td>部门</td>
            <td colspan="3">
              <a-form-item>
                <a-select
                  style="width: 300px; margin-right: 10px"
                  v-decorator="['deptId', { rules: [{ required: true, message: '请选择部门' }] }]"
                  @change="depChangeHandler"
                  placeholder="请选择部门"
                >
                  <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">{{
                    item.departmentName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>人员</td>
            <td colspan="3">
              <a-form-item>
                <a-select
                  placeholder="请选择人员"
                  v-decorator="['userId', { rules: [{ required: true, message: '请选择人员' }] }]"
                  :allowClear="true"
                  style="width: 300px"
                >
                  <a-select-option v-for="item in postSelectDataSource" :key="item.id" :value="item.id">{{
                    item.trueName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>房间号</td>
            <td colspan="3">
              <a-form-item>
                <a-select
                  placeholder="请选择房间号"
                  v-decorator="['roomId', { rules: [{ required: true, message: '请选择房间号' }] }]"
                  :allowClear="true"
                  style="width: 300px"
                >
                  <a-select-option v-for="item in RoomNumber" :key="item.id" :value="item.id">{{
                    item.roomCode
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>入住时间</td>
            <td colspan="3">
              <a-form-item>
                <a-date-picker
                  show-time
                  style="width: 300px"
                  v-decorator="['checkInTime', { rules: [{ required: true, message: '请选择日期！' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  style="width: 300px"
                  placeholder="请输入备注"
                  :rows="3"
                  v-decorator="['remark', { rules: [{ required: false, message: '请输入备注' }] }]"
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
import { getDevisionList } from '@/api/systemSetting'
import { listRoom, queryList, personnel_Add } from '@/api/humanResources'
import moment from 'moment'

export default {
  name: 'BecomingForm',

  data() {
    return {
      visible: false,
      spinning: false,
      isDisabled: true,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      departmentList: [],
      type: 'add',
      record: {},
      postSelectDataSource: [],
      RoomNumber: [],
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '人员住宿'
      }
      let txt = this.isView ? '新增' : '修改'
      return `${txt}人员住宿`
    },
    isView() {
      //查看
      return this.type === 'add'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
  },

  methods: {
    moment: moment,
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record

      getDevisionList().then((res) => {
        this.departmentList = res.data
      })
      listRoom({ status: 1 }).then((res) => {
        this.RoomNumber = res.data
      })
      if (type === 'edit-salary') {
        this.fillData()
      }
    },

    fillData() {
      queryList({ departmentId: this.record.deptId }).then((res) => {
        this.postSelectDataSource = res.data
      })
      this.$nextTick(() => {
        this.form.setFieldsValue({
          deptId: this.record.deptId,
          userId: this.record.userId,
          roomId: this.record.roomId,
          checkInTime: moment(this.record.checkInTime),
          remark: this.record.remark,
        })
      })
    },

    handleOk() {
      let that = this
      if (that.type === 'add' || that.type === 'edit-salary') {
        that.form.validateFields((err, values) => {
          if (!err) {
            values.checkInTime = moment(values.checkInTime).format('YYYY-MM-DD HH:mm:ss')
            if (that.type !== 'add') {
              values.id = this.record.id
            }
            that.spinning = true
            personnel_Add(values)
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
      }
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