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
            <td>名称</td>
            <td colspan="2">
              <a-form-item>
                <a-input
                  style="width: 400px"
                  placeholder="输入名称"
                  v-decorator="['name', { rules: [{ required: true, message: '请输入名称' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>适用人员</td>
            <td colspan="2">
              <a-form-item>
                <a-select
                  mode="multiple"
                  :allowClear="true"
                  :maxTagCount="4"
                  showSearch
                  placeholder="请选择人员"
                  optionFilterProp="children"
                  v-decorator="['stationIds', { rules: [{ required: true, message: '请选择适用人员' }] }]"
                  style="width: 400px"
                >
                  <a-select-option v-for="i in getUserByType" :key="i.stationId" :value="i.stationId">
                    {{ i.stationName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>奖金名称</td>
            <td colspan="2">
              <a-form-item>
                <a-select
                  mode="multiple"
                  :allowClear="true"
                  showSearch
                  :maxTagCount="4"
                  style="width: 400px"
                  placeholder="选择奖金名称"
                  v-decorator="['bounsDicIds', { rules: [{ required: true, message: '请选择奖金名称' }] }]"
                >
                  <a-select-option v-for="item in assetTypeList" :key="item.id" :value="item.id">{{
                    item.text
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td colspan="2">
              <a-form-item>
                <a-textarea
                  style="width: 400px"
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
import { getSaleStation, salary_Sale_SaveOrUpdateSalaryBaseSaler } from '@/api/bonus_management'
import { getDictionaryList } from '@/api/workBox'
import vueLs from 'vue-ls'

export default {
  name: 'BecomingForm',
  components: {},
  data() {
    return {
      visible: false,
      spinning: false,
      record: undefined,
      assetTypeList: [],
      getUserByType: [], //销售岗位
      type: 'View',
      form: this.$form.createForm(this),
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改销售基本工资规则'
      }
      if (this.isView) {
        return '新增销售基本工资规则'
      }
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
  watch: {},
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`)
    },
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record
      getSaleStation({ type: 1 }).then((res) => (this.getUserByType = res.data))

      getDictionaryList({ parentId: 616 }).then((res) => (this.assetTypeList = res.data))
      if (type === 'edit-salary') {
        this.fillData()
      }
    },

    fillData() {
      this.$nextTick(() => {
        this.record.bounsDicIds = this.record.bounsDicIds.split(',')
        this.record.stationIds = this.record.stationIds.split(',')
        this.record.bounsDicIds.forEach((item, index) => {
          this.record.bounsDicIds[index] = parseInt(this.record.bounsDicIds[index])
        })
        this.record.stationIds.forEach((item, index) => {
          this.record.stationIds[index] = parseInt(this.record.stationIds[index])
        })

        this.form.setFieldsValue({
          name: this.record.name,
          bounsDicIds: this.record.bounsDicIds,
          stationIds: this.record.stationIds,
          remark: this.record.remark,
        })
      })
    },

    handleOk() {
      console.log('你是要提交')
      let that = this
      if (that.type === 'add' || that.type === 'edit-salary') {
        that.form.validateFields((err, values) => {
          if (!err) {
            values.stationIds = values.stationIds.toString()
            values.bounsDicIds = values.bounsDicIds.toString()
            if (that.type !== 'add') {
              values.id = this.record.id
            }
            that.spinning = true
            salary_Sale_SaveOrUpdateSalaryBaseSaler(values)
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
      } else {
        that.form.resetFields() // 清空表
        that.visible = false
      }
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