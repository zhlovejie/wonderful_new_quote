<template>
  <a-modal
    :title="modalTitle"
    :width="900"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td>部门</td>
            <td colspan="2">
              <a-form-item>
                <a-select
                  style="width: 200px"
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
            <td>职位</td>
            <td colspan="2">
              <a-form-item>
                <a-select
                  style="width: 200px"
                  :disabled="isDisabled"
                  @change="postChangeHandler"
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
            <td>姓名</td>
            <td colspan="2">
              <a-form-item>
                <a-select
                  :disabled="isDisabled"
                  style="width: 200px"
                  placeholder="请选择人员"
                  v-decorator="['userId', { rules: [{ required: true, message: '请选择人员!' }] }]"
                >
                  <a-select-option v-for="item in personSelectDataSource" :key="item.id" :value="item.id">{{
                    item.trueName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td>提成系数</td>
            <td colspan="2">
              <a-form-item>
                <a-input-number
                  :precision="6"
                  :disabled="isDisabled"
                  style="width: 200px"
                  placeholder="输入提成系数"
                  v-decorator="['percentageRetio', { rules: [{ required: true, message: '请输入提成系数!' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>提成产品</td>
            <td colspan="4">
              <a-form-item>
                <a-select
                  mode="multiple"
                  :disabled="isDisabled"
                  style="width: 100%"
                  placeholder="请选择提成产品"
                  v-decorator="['dicIds', { rules: [{ required: true, message: '请选择提成产品!' }] }]"
                >
                  <a-select-option v-for="item in products" :key="item.id" :value="item.id">{{
                    item.typeName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td colspan="4">
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
import { bonus_getDepartmentByType } from '@/api/bonus_management'
import { typeConfigList } from '@/api/productOfferManagement'
import {
  getStationList, //获取部门下面的岗位
  getUserByStation, //获取人员
} from '@/api/systemSetting'
import { softHard_addAndUpdate } from '@/api/bonus_management'
import moment from 'moment'

export default {
  name: 'BecomingForm',
  components: {},
  data() {
    return {
      remark: '',
      visible: false,
      products: [],
      personSelectDataSource: [], //人员
      departmentList: [], //部门
      postSelectDataSource: [], //职位
      spinning: false,
      form: this.$form.createForm(this, { name: 'softHard' }),
      type: 'view',
      record: {},
    }
  },

  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改软件/硬件提成规则'
      }
      let txt = this.isView ? '查看' : this.isView5 ? '查看' : '新增'
      return `${txt}软件/硬件提成规则`
    },
    isView() {
      //查看
      return this.type === 'view'
    },
    isView5() {
      //查看
      return this.type === 'view5'
    },
    isEdit() {
      //审核
      return this.type === 'edit'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
    isDisabled() {
      return this.isView || this.isEdit || this.isView5
    },
  },
  created() {
    bonus_getDepartmentByType({ type: 4 }).then((res) => (this.departmentList = res.data))
    typeConfigList().then((res) => (this.products = res.data))
  },
  methods: {
    moment,
    //选择岗位
    depChangeHandler(dep_id) {
      let that = this
      that.depart = dep_id
      that.postSelectDataSource = []
      that.form.setFieldsValue({
        stationId: '',
        userId: '',
      })
      return getStationList({ id: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
      })
    },
    //选择人员
    postChangeHandler(stationId) {
      this.personSelectDataSource = []
      this.form.setFieldsValue({
        userId: '',
      })
      getUserByStation({ stationId: stationId, showLeaveFlag: 1 }).then(
        (res) => (this.personSelectDataSource = res.data)
      )
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
        getUserByStation({ stationId: record.stationId, showLeaveFlag: 1 }).then(
          (res) => (this.personSelectDataSource = res.data)
        )
        this.fillData()
      }
    },
    // 详情
    fillData() {
      let that = this
      that.$nextTick(() => {
        that.form.setFieldsValue({
          deptId: that.record.deptId,
          stationId: that.record.stationId,
          userId: that.record.userId,
          dicIds: that.record.dicIds.split(',').map((v) => +v),
          percentageRetio: that.record.percentageRetio,
          remarks: that.record.remarks,
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
            if (values.percentageRetio > 1 || values.percentageRetio === 1) {
              return this.$message.error('提成系数不能大于1')
            }
            let react = []
            values.dicIds.map((rs) => {
              let arr = this.products.find((item) => item.id === rs)
              react.push(arr.code)
            })
            values.productCode = react.toString()
            values.dicIds = values.dicIds.toString()
            if (that.type === 'edit-salary') {
              values.id = that.record.id
            }
            if (that.type === 'add' || that.type === 'edit-salary') {
              that.spinning = true
              console.log(values)
              softHard_addAndUpdate(values)
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
  padding: 20px 10px;
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