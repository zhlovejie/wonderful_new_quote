<template>
  <!--收料 -->
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
              <th>采购数量</th>
              <th>到货数量</th>
            </tr>

            <tr>
              <td>自动生成</td>
              <td>{{detail.orderNum}}</td>
              <td>{{detail.requestApplyNum}}</td>
              <td>{{detail.supplierName}}</td>
              <td>{{ {1:'一般',2:'加急',3:'特急'}[detail.urgencyDegree] }}</td>
              <td>
                <a-popover title="物料信息" trigger="hover">
                  <template slot="content">
                    <p>物料名称：{{ detail.materialName }}</p>
                    <p>物料代码：{{ detail.materialCode }}</p>
                    <p>规格型号：{{ detail.materialModelType }}</p>
                    <p>包装：{{`${detail.packageCount}/${detail.packageType}`}}</p>
                  </template>
                  <a href="javascript:void(0);">
                    物料信息
                  </a>
                </a-popover>
              </td>
              <td>{{detail.requestNum}}</td>
              <td>
                <a-form-model-item prop="arrivalCount">
                  <a-input-number
                    placeholder="到货数量"
                    v-model="form.arrivalCount"
                    style="width:100%;"
                    :min="1"
                    :max="detail.requestNum"
                    :step="1"
                    :precision="0"
                  />
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
import { orderDetail, receiveAddApply,receiveAddApplyNew } from '@/api/procurementModuleManagement'
export default {
  data() {
    return {
      modalTitle: '申请收料',
      visible: false,
      spinning: false,
      form: {},
      rules: {
        warehouseId: [{ required: true, message: '请选择仓库' }],
        arrivalCount: [{ required: true, message: '请输入到货数量' }]
      },
      record: {},
      detail: {},

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
            ...that.form,
            receiveType:1
          }

          receiveAddApplyNew(param)
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
