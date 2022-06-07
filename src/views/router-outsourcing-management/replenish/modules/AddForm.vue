<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
    :footer="null"
    :forceRender="true"
  >
    <a-spin :spinning="spinning">
      <a-form-model ref="ruleForm" :model="detail" class="gift-form-wrapper">
        <div class="__hd">原材料物料信息</div>
        <a-table :columns="columns" :dataSource="detail.materialAppyBoList" :pagination="false">
          <div slot="feedNum" slot-scope="text, record">
            <a-form-model-item>
              <a-input-number
                v-if="isEdit"
                style="width:100px;"
                :min="1"
                :max="9999"
                :step="1"
                :precision="0"
                v-model="record.feedNum"
                placeholder="请输入数量"
              />
              <span v-else>{{ record.feedNum }}</span>
            </a-form-model-item>
          </div>
        </a-table>

        <div class="__hd" style="margin-top:20px;">补料说明</div>
        <table class="custom-table custom-table-border">
          <tr>
            <td>补料原因</td>
            <td colspan="3">
              <a-form-model-item v-if="isEdit" :prop="'reason'" :rules="{ required: true, message: '请输入补料原因' }">
                <a-input placeholder="请输入补料原因" v-model="detail.reason"></a-input>
              </a-form-model-item>
              <span v-else>{{ detail.reason }}</span>
            </td>
          </tr>
          <tr>
            <td>补料规责</td>
            <td colspan="3">
              <a-form-model-item
                v-if="isEdit"
                :prop="'dutyType'"
                :rules="{ required: true, message: '请选择补料规责' }"
              >
                <!-- dutyType 责任归属: 1、加工商责任 2 委托方责任 -->
                <a-select v-model="detail.dutyType" placeholder="请选择补料规责">
                  <a-select-option :value="1">加工商责任</a-select-option>
                  <a-select-option :value="2">委托方责任</a-select-option>
                </a-select>
              </a-form-model-item>
              <span v-else>{{ { 1: '加工商责任', 2: '委托方责任' }[detail.dutyType] || '未知' }}</span>
            </td>
          </tr>
          <tr>
            <td>补料费用</td>
            <td colspan="3">
              <a-form-model-item
                v-if="isEdit"
                :prop="'feedAmount'"
                :rules="{ required: true, message: '请输入补料费用（元）' }"
              >
                <a-input-number
                  :step="1"
                  :precision="2"
                  style="width:100%;"
                  placeholder="请输入本次补料需要支付的费用,可输入负值抵扣加工费"
                  v-model="detail.feedAmount"
                />
              </a-form-model-item>
              <span v-else>{{ detail.feedAmount }}元</span>
            </td>
          </tr>
          <tr>
            <td>补料说明</td>
            <td colspan="3">
              <a-form-model-item v-if="isEdit">
                <a-input placeholder="请输入备注信息" v-model="detail.remark"></a-input>
              </a-form-model-item>
              <span v-else>{{ detail.remark }}</span>
            </td>
          </tr>
        </table>

        <a-row v-if="isEdit">
          <a-col :span="2" style="color:red;">
            操作说明：
          </a-col>
          <a-col :span="22">
            <span style="color:red;"
              >1.补料数量为原有基础上新增出库数量,即按照输入的补料数量将对应数量的原料出库到加工商处。不输入则默认无需补料。<br />
              2.加工商责任导致补料,补料费用只可为负数。</span
            >
          </a-col>
        </a-row>

        <div class="__footer">
          <a-button @click="handleSubmit('cancel')">取消</a-button>
          <a-button v-if="isEdit" @click="handleSubmit('save')" type="primary">保存</a-button>
          <a-button v-if="isEdit" @click="handleSubmit('submit')" type="primary">提交</a-button>
          <a-button type="primary" v-if="isApprove" @click="onApprove(0)" :loading="loading" icon="check"
            >通过</a-button
          >
          <a-button type="primary" v-if="isApprove" @click="onApprove(1)" :loading="loading" icon="close"
            >不通过</a-button
          >
        </div>
      </a-form-model>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>

<script>
import { getOrderChangeInfo, replenishDetail, replenishAdd, replenishApprove, replenishEdit } from '@/api/orderChange'
import Approval from '@/views/after-sales-management/Accessories/module/Approval.vue'

const renderContent = (text, record, index) => {
  const obj = {
    children: text,
    attrs: {}
  }
  if (index === 0) {
    obj.attrs.rowSpan = record.rowSpan
  } else {
    obj.attrs.rowSpan = 0
  }
  return obj
}

const columns = [
  {
    title: '序号',
    width: '70px',
    dataIndex: 'key'
  },
  {
    title: '补料单号',
    dataIndex: 'applyCode',
    customRender: renderContent
  },
  {
    title: '委外加工单号',
    dataIndex: 'orderCode',
    customRender: renderContent
  },
  {
    title: '属性',
    width: '70px',
    dataIndex: 'typeText' //类型(1:原料,2:模具)
  },
  {
    title: '原料名称',
    dataIndex: 'materialName'
  },
  {
    title: '原料代码',
    dataIndex: 'materialCode'
  },
  {
    title: '规格型号',
    dataIndex: 'specification'
  },
  {
    title: '原料单位（辅单位）',
    dataIndex: 'subUnit'
  },
  {
    title: '原料个数',
    dataIndex: 'oldNum'
  },
  {
    title: '待补料数量',
    dataIndex: 'feedNum',
    scopedSlots: { customRender: 'feedNum' }
  }
]

export default {
  name: 'outsourcing-order-change-replenish-add',
  components: {
    Approval
  },
  data() {
    return {
      columns,
      visible: false,
      spinning: false,
      detail: {
        materialAppyBoList: []
      },
      type: 'view',
      loading: false
    }
  },
  computed: {
    modalTitle() {
      const action = this.isView ? '查看' : this.isEdit ? (this.isAdd ? '新增' : '编辑') : '审批'
      return `${action}-补料单`
    },
    isView() {
      return this.type === 'view'
    },
    isApprove() {
      return this.type === 'approve'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'add' || this.type === 'edit'
    }
  },
  methods: {
    //type:view/add/edit
    async query(type, record) {
      const that = this
      that.visible = true
      that.type = type
      that.detail = { ...record }
      if (type !== 'add' && this.detail) {
        //补料单-查看详情
        replenishDetail({ id: this.detail.id }).then(res => {
          if (res.code === 200) {
            const { applyCode, orderNum } = res.data
            var detail = { ...that.detail, ...res.data }
            detail.materialAppyBoList = res.data.materialAppyVoList.map((item, index) => {
              item.key = index + 1
              item.applyCode = applyCode
              item.orderCode = orderNum
              item.typeText = { 1: '原料', 2: '模具' }[item.type] || '未知' //类型(1:原料,2:模具)
              return item
            })

            const len = detail.materialAppyBoList.length
            if (len > 0) {
              detail.materialAppyBoList[0].rowSpan = len //表格行合并
            }
            delete detail.materialAppyVoList
            that.detail = detail
          } else {
            that.$message.error(res.msg)
          }
        })
      } else {
        getOrderChangeInfo({ oderId: this.detail.orderId }).then(res => {
          if (res.code === 200) {
            const materialAppyBoList = res.data.partMaterialList.map((item, index) => {
              item.key = index + 1
              item.applyCode = '*'
              item.orderCode = res.data.orderCode
              item.oldNum = item.needCount
              item.typeText = { 1: '原料', 2: '模具' }[item.type] || '未知' //类型(1:原料,2:模具)
              return item
            })
            const len = materialAppyBoList.length
            if (len > 0) {
              materialAppyBoList[0].rowSpan = len //表格行合并
            }
            const { id, orderId } = res.data.finishMaterial
            that.detail = {
              ...that.detail,
              remark: '',
              changeFinishId: id, //成品记录表id
              facInfoCode: 'JGD000111', //测试数据 由加工单带入
              facInfoId: '12', //测试数据 由加工单带入
              orderCode: res.data.orderCode, //加工单编号
              orderId: orderId,
              materialAppyBoList: materialAppyBoList
            }
          } else {
            that.$message.error(res.msg)
          }
        })
      }
    },

    handleSubmit(type) {
      const that = this
      if (type === 'cancel') {
        that.handleCancel()
      } else if (type === 'submit' || type === 'save') {
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            if (that.detail.dutyType === 1 && that.detail.feedAmount >= 0) {
              that.$message.warning('加工商责任，补料费用只可为负数')
              return false
            }
            if (that.isAdd) {
              //新增
              const params = {
                ...that.detail,
                materialAppyBoList: that.detail.materialAppyBoList.filter(item => item.feedNum && item.feedNum > 0),
                operationFlag: type === 'submit' ? 2 : 1 //操作类型: 1 保存 2 提交审核
              }
              console.log('新增参数：', params)
              that.spinning = true
              replenishAdd(params)
                .then(res => {
                  that.spinning = false
                  that.$message.info(res.msg)
                  if (res.code === 200) {
                    that.$emit('ok')
                    that.handleCancel()
                  }
                })
                .catch(err => {
                  that.spinning = false
                  that.$message.error(err.message)
                })
            } else {
              //编辑
              const params = {
                ...that.detail,
                feedChangeMaterialApplyBo:
                  that.detail.materialAppyBoList.length > 0 ? that.detail.materialAppyBoList[0] : {},
                operationFlag: type === 'submit' ? 2 : 1 //操作类型: 1 保存 2 提交审核
              }
              delete params.materialAppyBoList
              console.log('编辑参数：', params)
              that.spinning = true
              replenishEdit(params)
                .then(res => {
                  that.spinning = false
                  that.$message.info(res.msg)
                  if (res.code === 200) {
                    that.$emit('ok')
                    that.handleCancel()
                  }
                })
                .catch(err => {
                  that.spinning = false
                  that.$message.error(err.message)
                })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    handleCancel() {
      const that = this
      that.$nextTick(() => {
        that.visible = false
      })
    },
    opinionChange(opinion) {
      this.submitApprove(1, opinion)
    },
    submitApprove(isAdopt, opinion) {
      var that = this
      this.loading = true
      replenishApprove({ isAdopt, approveId: this.detail.id, opinion })
        .then(res => {
          that.loading = false
          if (res.code === 200) {
            that.$message.success(res.msg)
            that.$emit('ok')
            that.handleCancel()
          } else {
            that.$message.error(res.msg)
          }
        })
        .catch(() => (that.loading = false))
    },
    //审批通过 isAdopt:审批结果：0通过 1不通过;approveId:业务id;opinion:审批意见
    onApprove(isAdopt) {
      if (isAdopt === 0) {
        this.submitApprove(isAdopt, '')
      } else {
        //审批不通过-需填写审批意见
        this.$refs.approval.query()
      }
    }
  }
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px;
}
.custom-table-border {
  margin-top: 16px;
}
.gift-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
.__hd {
  font-size: 16px;
  margin-bottom: 10px;
}
.__bd {
  margin-top: 5px;
  margin-bottom: 10px;
}
.__footer {
  text-align: center;
  margin-top: 20px;
}
.__footer * {
  margin: 0 5px;
}
</style>
