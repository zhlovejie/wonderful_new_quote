<template>
  <!--提货 -->
  <a-modal
    :title="modalTitle"
    :width="1200"
    :visible="visible"
    :destroyOnClose="true"
    :footer="footer"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >

    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
    >
      <div class="card-item">
        <div class="__hd">物料信息</div>
        <div class="__bd">
          <table class="custom-table custom-table-border">
            <tr>
              <th>收料单号</th>
              <th>采购单号</th>
              <th>需求单号</th>
              <th>供应商名称</th>
              <th>紧急程度</th>
              <th>物料名称</th>
              <th>规格型号</th>
              <th>物料代码</th>
              <th>包装方式</th>
              <th>采购数量</th>
            </tr>

            <tr>
              <td>自动生成</td>
              <td>{{detail.orderNum}}</td>
              <td>{{detail.requestApplyNum}}</td>
              <td>{{detail.supplierName}}</td>
              <td>{{ {1:'一般',2:'加急',3:'特急'}[detail.urgencyDegree] }}</td>
              <td>{{detail.materialName}}</td>
              <td style="width:200px;">{{detail.materialModelType}}</td>
              <td>物料代码</td>
              <td>{{`${detail.packageCount}/${detail.packageType}`}}</td>
              <td>{{detail.requestNum}}</td>
            </tr>

          </table>
        </div>
        <div class="__hd">提货备注</div>
        <div class="__bd">
          <table class="custom-table custom-table-border">
            <tr>
              <td style="width:150px;">提货备注</td>
              <td>
                <a-form-model-item prop="remark" >
                  <a-input v-model="form.remark" type="textarea" />
                </a-form-model-item>
              </td>
            </tr>
          </table>
        </div>
        <div class="__hd">提货人员</div>
        <div class="__bd">
          <table class="custom-table custom-table-border">
            <tr>
              <td style="width:150px;">提货人员</td>
              <td>
                <a-form-model-item prop="picker">
                  <a-select
                    style="width: 360px"
                    allowClear
                    v-model="form.picker"
                  >
                    <a-select-option
                      v-for="item in pickerList"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{item.label}}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </a-form-model>

  </a-modal>
</template>

<script>
import { orderDetail, pickUpAddApply } from '@/api/procurementModuleManagement'
export default {
  data() {
    return {
      modalTitle: '申请提货',
      visible: false,
      spinning: false,
      form: {},
      rules: {
        picker: [{ required: true, message: '请选择提货人员' }],
        remark: [{ required: true, message: '请输入备注信息' }]
      },
      record: {},
      detail: {},
      pickerList: Object.freeze([
        {
          id: 1,
          label: '物流人员1'
        },
        {
          id: 2,
          label: '物流人员2'
        },
        {
          id: 3,
          label: '物流人员3'
        }
      ])
    }
  },
  computed: {
    footer() {
      const that = this
      const h = that.$createElement
      const btn = []
      btn.push(h('a-button', { key: 'cancel', on: { click: that.handleCancel } }, '取消'))
      btn.push(
        h(
          'a-button',
          {
            key: 'submit',
            on: { click: () => that.handleSubmit() },
            props: { type: 'primary', loading: that.spinning }
          },
          '提交'
        )
      )
      return btn
    }
  },
  methods: {
    query(type, record) {
      const that = this
      that.record = { ...record }
      that.visible = true
      orderDetail({ id: that.record.id })
        .then(res => {
          that.detail = res.data
          that.form = {
            ...that.form,
            orderId: that.record.id
          }
        })
        .catch(err => {
          that.$message.error(err)
          return null
        })
    },
    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          that.spinning = true
          const param = {
            ...that.form
          }

          //仓库信息
          const pickerTarget = that.pickerList.find(item => item.id === that.form.picker)
          if (pickerTarget) {
            param.picker = pickerTarget.id
            param.pickerName = pickerTarget.label
          }

          pickUpAddApply(param)
            .then(res => {
              that.spinning = false
              that.$message.info(res.msg)
              if (res.code === 200) {
                that.$emit('finish')
                that.handleCancel()
              }
            })
            .catch(err => {
              that.spinning = false
              that.$message.info(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped>
.card-item {
  margin-bottom: 10px;
}
.card-item:last-child {
  margin-bottom: 0;
}
.__hd {
  font-weight: 700;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}

.ant-form-item {
  margin-bottom: 0;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px;
  text-align: left;
}
</style>
