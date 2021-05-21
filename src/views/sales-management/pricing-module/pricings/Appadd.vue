<template>
  <a-modal
    title="任务单新增"
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
            <td></td>
          </tr>
          <tr>
            <td>来源</td>
            <td>核价单</td>
          </tr>
          <tr>
            <td>单据编号</td>
            <td>{{ record.valencyCode }}</td>
          </tr>
          <tr>
            <td>销售负责人</td>
            <td>{{ record.applyUserName }}</td>
          </tr>
          <tr>
            <td>产品名称</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="产品名称"
                  v-decorator="['productName', { rules: [{ required: true, message: '选择产品名称' }] }]"
                  style="width: 70%"
                  @change="carCodeChange"
                >
                  <a-select-option v-for="item in carCodeList" :key="item.productName" :value="item.productName">{{
                    item.productName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td>产品代码</td>
            <td>
              <a-form-item>
                <a-input disabled style="width: 70%" placeholder="请输入产品代码" v-decorator="['productCode']" />
              </a-form-item>
            </td>
          </tr>
          <tr v-show="false">
            <td>
              <a-form-item>
                <a-input disabled style="width: 70%" v-decorator="['salerId']" />
              </a-form-item>
            </td>
          </tr>
          <tr v-show="false">
            <td>
              <a-form-item>
                <a-input disabled style="width: 70%" v-decorator="['sourceId']" />
              </a-form-item>
            </td>
          </tr>
          <tr v-show="false">
            <td>
              <a-form-item>
                <a-input disabled style="width: 70%" v-decorator="['sourceProductId']" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>项目描述</td>
            <td>
              <a-form-item>
                <a-textarea
                  style="width: 70%"
                  placeholder="请输入项目描述"
                  v-decorator="['productDesc', { rules: [{ required: true, message: '请输入项目描述' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <a-form-item>
                <a-textarea style="width: 70%" placeholder="请输入备注" v-decorator="['remark']" />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { listValencyDevelopment, taskaddAndUpdateDevelopment } from '@/api/pricingModule'
import moment from 'moment'
export default {
  name: 'BecomingForm',
  data() {
    return {
      visible: false,
      spinning: false,
      record: {},
      carCodeList: [],
      type: 'View',
      form: this.$form.createForm(this),
    }
  },
  computed: {
    isDisabled() {
      return this.isView || this.isEditSalary
    },
  },
  watch: {},
  created() {},
  methods: {
    moment,

    query(record) {
      console.log(record)
      this.record = record
      this.visible = true
      this.fillData(record)
    },

    fillData(record) {
      listValencyDevelopment({ id: record.id }).then((res) => {
        console.log(res)
        this.carCodeList = res.data
      })
    },
    carCodeChange(carId) {
      let target = this.carCodeList.find((item) => item.productName === carId)
      this.form.setFieldsValue({
        productCode: target ? target.productCode : undefined,
        productDesc: target ? target.productDesc : undefined,
        salerId: target ? target.salerId : undefined,
        sourceId: target ? target.sourceId : undefined,
        sourceProductId: target ? target.sourceProductId : undefined,
      })
    },
    handleOk() {
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          values.taskSource = 1
          values.sourceNum = this.record.valencyCode
          values.applyUserId = this.record.applyUserId
          taskaddAndUpdateDevelopment(values)
            .then((res) => {
              that.spinning = false
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              // that.$emit('finish')
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