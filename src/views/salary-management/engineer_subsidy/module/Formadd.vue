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
    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td>部门</td>
            <td>
              <a-form-item>
                <a-select
                  style="width: 100%"
                  :disabled="isDisabled"
                  @change="depChangeHandler"
                  placeholder="请选择部门"
                  v-decorator="['deptId', { rules: [{ required: true, message: '请选择部门!' }] }]"
                >
                  <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">{{
                    item.departmentName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>职位</td>
            <td>
              <a-form-item>
                <a-select
                  style="width: 100%"
                  :disabled="isDisabled"
                  placeholder="请选择职位"
                  v-decorator="['stationId', { rules: [{ required: true, message: '请选择职位!' }] }]"
                >
                  <a-select-option v-for="item in postSelectDataSource" :key="item.id" :value="item.id">{{
                    item.stationName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>高级工程师补贴（元）</td>
            <td>
              <a-form-item>
                <a-input-number
                  :precision="2"
                  :disabled="isDisabled"
                  style="width: 100%"
                  placeholder="输入奖金"
                  v-decorator="['subsidy', { rules: [{ required: true, message: '请输入奖金!' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <a-form-item>
                <a-textarea
                  placeholder="备注"
                  :disabled="isDisabled"
                  :rows="2"
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
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
} from '@/api/systemSetting'
import { enginee_addAndUpdate } from '@/api/bonus_management'
import moment from 'moment'

export default {
  name: 'BecomingForm',

  data() {
    return {
      remark: '',
      visible: false,

      personSelectDataSource: [], //人员
      departmentList: [], //部门
      postSelectDataSource: [], //职位
      spinning: false,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      type: 'view',
      record: {},
    }
  },

  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改其他奖金'
      }
      let txt = this.isView ? '查看' : '新增'
      return `${txt}其他奖金`
    },
    isView() {
      //查看
      return this.type === 'view'
    },

    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
    isDisabled() {
      return this.isView || this.isEdit
    },
  },
  created() {
    departmentList().then((res) => {
      this.departmentList = res.data
    })
  },
  methods: {
    moment,
    //选择岗位
    depChangeHandler(dep_id) {
      let that = this
      that.depart = dep_id
      that.postSelectDataSource = []
      return getStationList({ id: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
      })
    },
    //接受数据
    query(type, record) {
      console.log(this.record)
      this.form.resetFields() // 清空表
      this.visible = true
      this.type = type
      this.record = record
      if (type !== 'add') {
        getStationList({ id: record.deptId }).then((res) => {
          this.postSelectDataSource = res.data
        })
        this.fillData()
      }
    },
    // 详情
    fillData() {
      let that = this
      this.$nextTick(() => {
        this.form.setFieldsValue({
          deptId: this.record.deptId,
          stationId: this.record.stationId,
          subsidy: this.record.subsidy,
          remarks: this.record.remarks,
        })
      })
    },
    //提交
    handleOk() {
      let that = this
      if (that.type === 'view') {
        this.visible = false
      } else {
        that.form.validateFields((err, values) => {
          if (!err) {
            if (that.type === 'edit-salary') {
              values.id = that.record.id
            }
            if (that.type === 'add' || that.type === 'edit-salary') {
              that.spinning = true
              enginee_addAndUpdate(values)
                .then((res) => {
                  this.programme = []
                  this.visible = false
                  that.spinning = false
                  that.form.resetFields() // 清空表
                  that.$message.info(res.msg)
                  that.$emit('finish')
                })
                .catch((err) => (that.spinning = false))
            }
          }
        })
      }
    },
    handleCancel() {
      this.programme = []
      this.remark = '' // 清空表
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