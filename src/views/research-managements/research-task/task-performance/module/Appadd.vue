<template>
  <a-modal
    title="配置"
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
            <th>配置名称</th>
            <th>占比(%)</th>
          </tr>
          <tr>
            <td>工作效率</td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width: 70%"
                  placeholder="请输入工作效率占比"
                  v-decorator="[
                    'workEfficiencyPercentage',
                    { rules: [{ required: true, message: '请输入工作效率占比' }] },
                  ]"
                />
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td>完成度</td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width: 70%"
                  placeholder="请输入完成度占比"
                  v-decorator="['finishPercentage', { rules: [{ required: true, message: '请输入完成度占比' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>难易度</td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width: 70%"
                  placeholder="请输入难易度占比"
                  v-decorator="['difficultPercentage', { rules: [{ required: true, message: '请输入难易度占比' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>考勤时间</td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width: 70%"
                  placeholder="请输入考勤总时长占比"
                  v-decorator="['attencePercentage', { rules: [{ required: true, message: '请输入考勤总时长占比' }] }]"
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
import { task_performancegetDetail, task_performancegetaddUpdate } from '@/api/researchManagement'
import moment from 'moment'
export default {
  name: 'BecomingForm',
  data() {
    return {
      visible: false,
      spinning: false,
      record: {},
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

    query() {
      this.visible = true
      this.fillData()
    },

    fillData() {
      task_performancegetDetail().then((res) => {
        if (res.code === 200) {
          this.$nextTick(() => {
            this.form.setFieldsValue({
              attencePercentage: res.data.attencePercentage,
              difficultPercentage: res.data.difficultPercentage,
              finishPercentage: res.data.finishPercentage,
              workEfficiencyPercentage: res.data.workEfficiencyPercentage,
            })
          })
        }
      })
    },

    handleOk() {
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          let arr =
            Number(values.attencePercentage) +
            Number(values.difficultPercentage) +
            Number(values.finishPercentage) +
            Number(values.workEfficiencyPercentage)
          if (arr == 100) {
            task_performancegetaddUpdate(values)
              .then((res) => {
                that.spinning = false
                that.form.resetFields() // 清空表
                that.visible = false
                that.$message.info(res.msg)
                that.$emit('finish')
              })
              .catch((err) => (that.spinning = false))
          } else {
            this.$message.error('比例数相加要等于100')
          }
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