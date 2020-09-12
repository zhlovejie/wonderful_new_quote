<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="wdf-custom-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id',{initialValue:detail.id}]" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:120px;">车辆名称</td>
            <td style="width:300px;">
              <a-form-item>
                <a-input
                  v-if="!isView"
                  placeholder="车辆名称"
                  v-decorator="['carName',{initialValue:detail.carName,rules: [{required: true,message: '请输入车辆名称'}]}]"
                  :allowClear="true"
                  style="width:100%;"
                />
                <span v-if="isView">{{detail.carName}}</span>
              </a-form-item>
            </td>
            <td style="width:120px;">车牌号</td>
            <td>
              <a-form-item>
                <a-input 
                  v-if="!isView"
                  placeholder="车牌号"
                  v-decorator="['carCode',{initialValue:detail.carCode,rules: [{required: true,message: '选择车牌号'}]}]"
                  style="width:100%;"
                />
                <span v-if="isView">{{detail.carCode}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>座位数</td>
            <td >
              <a-form-item>
                <a-input-number 
                  v-if="!isView"
                  placeholder="座位数"
                  style="width:100%;"
                  :min="0"
                  :max="99"
                  :step="1"
                  v-decorator="['seatNum',{initialValue:detail.seatNum ,rules: [{required: true,message: '输入座位数'}]}]"
                />
                <span v-if="isView">{{detail.seatNum}}</span>
              </a-form-item>
            </td>

            <td>燃油类型</td>
            <td >
              <a-form-item>
                <a-select
                  v-if="!isView"
                  placeholder="燃油类型"
                  v-decorator="['fuelOilType',{initialValue:detail.fuelOilType || 1,rules: [{required: true,message: '选择燃油类型'}]}]"
                  style="width:100%;"
                >
                  <a-select-option :value="1">汽油</a-select-option>
                  <a-select-option :value="2">柴油</a-select-option>
                  <a-select-option :value="3">电</a-select-option>
                </a-select>
                <span v-if="isView">
                  {{ {'1':'汽油','2':'柴油','3':'电'}[detail.fuelOilType] }}
                </span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>发动机号</td>
            <td >
              <a-form-item>
                <a-input 
                  v-if="!isView"
                  style="width:100%;"
                  placeholder="发动机号"
                  v-decorator="['engineCode',{initialValue:detail.engineCode,rules: [{ required: true, message: '输入发动机号'}]}]"
                />
                <span v-if="isView">{{detail.engineCode}}</span>
              </a-form-item>
            </td>
            <td>购买时间</td>
            <td >
              <a-form-item>
                <a-date-picker
                  v-if="!isView"
                  placeholder="购买时间"
                  v-decorator="['buyTime',{initialValue:detail.buyTime ? moment(detail.buyTime) :undefined,rules: [{required: true,message: '选择购买时间'}]}]"
                  style="width:100%;"
                />
                <span v-if="isView">{{detail.buyTime}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>保管人</td>
            <td >
              <template v-if="!isView">
              <DepUserSelect @change="depUserChange" :depId="detail.careDepartmentId" :userId="detail.careUserId" />
              <a-form-item hidden>
                <a-input v-decorator="['careDepartmentId',{initialValue:detail.careDepartmentId}]" />
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['careUserId',{initialValue:detail.careUserId,rules: [{required: true,message: '选择保管人'}]}]" />
              </a-form-item>
              </template>
              <span v-else>{{detail.careDepartmentName}}&nbsp;&nbsp;{{detail.careUserName}}</span>
            </td>
            <td>
              车辆状态
            </td>
            <td >
              <a-form-item>
                <a-select
                  v-if="!isView"
                  placeholder="车辆状态"
                  v-decorator="['status',{initialValue:detail.status || 0,rules: [{required: false,message: '选择车辆状态'}]}]"
                  style="width:100%;"
                >
                  <a-select-option :value="0">未使用</a-select-option>
                  <a-select-option :value="1">使用中</a-select-option>
                </a-select>
                <span v-if="isView">
                  {{ {'0':'未使用','1':'使用中'}[detail.status] }}
                </span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>里程数(km)</td>
            <td >
              <a-form-item>
                <a-input-number 
                  v-if="!isView"
                  placeholder="里程数"
                  style="width:100%;"
                  :min="0"
                  :max="9999999"
                  :step="1"
                  v-decorator="['mileageNum',{initialValue:detail.mileageNum ,rules: [{required: true,message: '输入里程数'}]}]"
                />
                <span v-if="isView">{{detail.mileageNum}}</span>
              </a-form-item>
            </td>
            <td>保养周期</td>
            <td >
              <a-form-item>
                <a-select
                  v-if="!isView"
                  placeholder="保养周期"
                  v-decorator="['careMile',{initialValue:detail.careMile || 3000,rules: [{required: true,message: '选择保养周期'}]}]"
                  style="width:100%;"
                >
                  <a-select-option v-for="val in [3000,4000,5000,6000,7000,8000,9000,10000]" :value="val" :key="val">{{val}}</a-select-option>
                </a-select>
                <span v-if="isView">
                  {{ detail.careMile }}
                </span>
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
  carInfoAddOrUpdate,
  carUserList
} from '@/api/vehicleManagement'
import DepUserSelect from '@/components/CustomerList/DepUserSelect'
import moment from 'moment'

function makeKey() {
  return Math.random().toString(32).slice(-10)
}

export default {
  name: 'AddForm',
  components: {
    DepUserSelect
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'add_form' }),
      visible: false,
      spinning: false,
      type: 'view',
      record: {},
      detail: {}
    }
  },
  watch: {},
  computed: {
    isView() {
      return this.type === 'view'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    modalTitle() {
      return this.type === 'add' ? '新增' : this.type === 'view' ? '查看' : '编辑'
    },
  },
  methods: {
    moment,
    async query(type, record) {
      carUserList()
      let that = this
      that.visible = true
      that.type = type
      that.record = Object.assign({}, record)
      that.detail = {}
      that.form.resetFields()
      await that.initData()
      if (type === 'view' || type === 'edit') {
        that.spinning = true
        let _detail = null
        try {
          //_detail = await emergencyMedicineDetail({ id: record.id }).then((res) => res.data)
          _detail = Object.assign({},record)
          that.spinning = false
          that.detail = { ..._detail }
        } catch (err) {
          console.log(err)
          that.spinning = false
        }
      }
    },
    initData() {
      let that = this
      let queue = []
      return Promise.all(queue)
    },

    handleSubmit() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }

      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          that.spinning = true

          values.buyTime = values.buyTime.format('YYYY-MM-DD')

          carInfoAddOrUpdate(values)
            .then((res) => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch((err) => {
              that.spinning = false
              that.$message.error('操作失败')
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    depUserChange(depId,userId){
      this.form.setFieldsValue({
        'careDepartmentId':depId,
        'careUserId':userId
      })
    }
  }
}
</script>
<style scoped>
.wdf-custom-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
.wdf-custom-form-wrapper >>> .custom-table td {
  padding: 5px 10px;
  text-align: center;
}

.wdf-custom-form-wrapper >>> .ant-upload-list-picture-card .ant-upload-list-item-info::before{
  left: 0;
}
</style>
