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
      <a-form-model ref="ruleForm" :model="form" :rules="rules" class="gift-form-wrapper">
        <div class="card-item">
          <div class="__hd">基本信息</div>
          <div class="__bd">
            <table rowKey="id" class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">出库单号</td>
                <td style="width:350px;">
                  <a-form-model-item>
                    <span>{{ form.exWarehouseNo }}</span>
                    <!-- <span v-if="form.exWarehouseNo">{{ form.exWarehouseNo }}</span>
                    <span v-else style="color:#bfbfbf;">系统自动生成</span> -->
                  </a-form-model-item>
                </td>
                <td style="width:150px;">委外加工单号</td>
                <td style="width:350px;">
                  <a-form-model-item>
                    {{ form.orderNo }}
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>加工商名称</td>
                <td colspan="3">
                  <span>{{ form.facName }}</span>
                </td>
              </tr>
            </table>
          </div>

          <div class="__hd">物料信息</div>
          <div class="__bd">
            <a-table
              rowKey="id"
              :columns="columns"
              :dataSource="form.materialTableList"
              :pagination="false"
              size="small"
            >
              <div slot="order" slot-scope="text, record, index">
                {{ index + 1 }}
              </div>

              <div slot="materialCode" slot-scope="text, record, index">
                <a-form-model-item
                  v-if="!isDisabled"
                  :prop="`materialTableList.${index}.materialCode`"
                  :rules="{ required: true, message: '请选择物料' }"
                >
                  <!-- <a-select
                    :disabled="isDisabled"
                    placeholder="请选择物料"
                    style="width:200px;"
                    :value="record.positionId"
                    @change="id => handlerMaterialChange(id, record)"
                  >
                    <a-select-option v-for="item in instantPositionList" :key="item.id" :value="item.id">{{
                      item.materialCode
                    }}</a-select-option>
                  </a-select> -->

                  <a-input
                    read-only="read-only"
                    :disabled="isDisabled"
                    @click="openModel(record)"
                    placeholder="请选择物料代码"
                    :value="record.materialCode"
                  />
                </a-form-model-item>
                <span v-else>{{ text }}</span>
              </div>
              <div slot="exWarehouseNum" slot-scope="text, record, index">
                <a-form-model-item
                  v-if="!isDisabled"
                  :prop="`materialTableList.${index}.exWarehouseNum`"
                  :rules="{ required: true, message: '请输入出库数量' }"
                >
                  <a-input-number
                    :disabled="isDisabled"
                    style="width:80px;text-align:center;"
                    :min="0"
                    :step="1"
                    :precision="0"
                    :value="record.exWarehouseNum"
                    @change="val => handleExWarehouseNumChange(index, record, val)"
                  />
                </a-form-model-item>
                <!-- <span v-else>{{record.alreadyExWarehouseNum}}</span> -->
                <span v-else>{{ record.exWarehouseNum }}</span>
              </div>

              <template slot="footer">
                <div style="text-align:right;margin-right:10px;font-size:16px;">
                  <span>合计：</span>
                  <span style="margin:0 5px;"
                    >出库数量 &nbsp;{{
                      form.materialTableList.reduce(
                        (adder, item) => adder + (parseFloat(item.realityExWarehouseNum) || 0),
                        0
                      )
                    }}
                  </span>
                </div>
              </template>
            </a-table>
            <a-button v-if="!isDisabled" style="width: 100%" type="dashed" icon="plus" @click="actionItem('add')"
              >添加</a-button
            >
          </div>
          <div class="__hd">备注</div>
          <div class="__bd">
            <a-form-model-item>
              <a-textarea
                v-if="!isDisabled"
                :disabled="isDisabled"
                v-model="form.remark"
                placeholder="请输入备注信息"
                :rows="4"
              />
              <span v-else>{{ form.remark }}</span>
            </a-form-model-item>
          </div>
          <div class="__hd">操作记录</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">提交人</td>
                <td style="width:350px;">
                  <a-form-model-item>
                    {{ form.createdName }}
                  </a-form-model-item>
                </td>
                <td style="width:150px;">提交时间</td>
                <td style="width:350px;">
                  <a-form-model-item>
                    {{ form.createdTime }}
                  </a-form-model-item>
                </td>
              </tr>
            </table>
          </div>

          <div class="__footer">
            <a-button @click="handleSubmit('cancel')">取消</a-button>
            <a-button v-if="isAdd || isEdit" @click="handleSubmit('submit')" type="primary">提交</a-button>
          </div>
        </div>
      </a-form-model>
      <!-- <Approval ref="approval" @opinionChange="opinionChange" />
      <MaterialSelect ref="materialSelect" @custom-change="handlerMaterialChange"/> -->
    </a-spin>
  </a-modal>
</template>

<script>
import { materialOutDetail } from '@/api/material'

import moment from 'moment'
// import Approval from './Approval'
// import MaterialSelect from './MaterialSelect'
const base_columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '属性',
    dataIndex: 'attributeText' //属性（1原材料 2模具）
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode'
  },
  {
    title: '物料名称',
    dataIndex: 'materialName'
  },
  {
    title: '规格型号',
    dataIndex: 'specification'
  },
  {
    title: '使用计量单位',
    dataIndex: 'subUnit'
  },
  {
    title: '待出库数量',
    dataIndex: 'exWarehouseNum'
  },
  {
    title: '原料送取',
    dataIndex: 'providerText' //原料送取(1:委托方送货,2:加工商提货)
  },
  {
    title: '实际出库数量',
    dataIndex: 'realityExWarehouseNum'
  }
]

export default {
  name: 'materia-apply-addForm',
  components: {
    // Approval,
    // MaterialSelect
  },
  data() {
    return {
      visible: false,
      spinning: false,
      record: {},
      type: 'view',
      form: {
        exWarehouseType: 1,
        exWarehouseDate: moment(),
        materialTableList: [] //物料信息
      },
      rules: {
        // routeName: [{ required: true, message: '请输入工艺路线名称' }],
        // defaultStatus: [{ required: true, message: '请选择缺省状态' }],
        // materialCode: [{ required: true, message: '请选择物料代码' }]
      },
      instantPositionList: [],
      detail: {}
    }
  },
  computed: {
    modalTitle() {
      const type = this.record.storageType

      const action = this.isView ? '查看' : this.isEdit ? '编辑' : '新增'

      return `${action}-原料出库申请单`
    },
    isView() {
      return this.type === 'view'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isDisabled() {
      return this.isView
    },
    columns() {
      let columns = [...base_columns]
      return columns
    }
  },
  methods: {
    moment,
    openModel(record) {
      this.$refs.materialSelect.query(record)
    },
    handleExWarehouseNumChange(index, record, val) {
      const that = this
      let materialTableList = [...that.form.materialTableList]
      let target = materialTableList[index]
      target.exWarehouseNum = val

      that.form = {
        ...that.form,
        materialTableList
      }
      if (+val > +record.__maxExWarehouseNum) {
        that.$message.warning(`出库数量已大于库存数量，库存数量为：${record.__maxExWarehouseNum}`)
      }
    },
    actionItem(type, record) {
      const that = this
      let materialTableList = [...that.form.materialTableList]
      if (type === 'add') {
        materialTableList.push({
          key: that._uuid()
        })
      } else if (type === 'delete') {
        materialTableList = materialTableList.filter(item => item.key !== record.key)
      }
      that.form = {
        ...that.form,
        materialTableList
      }
    },
    async query(type, record) {
      const that = this
      that.visible = true
      that.record = { ...record }
      that.type = type

      that.form = {
        exWarehouseType: 1,
        exWarehouseDate: moment(),
        materialTableList: [] //物料信息
      }

      //   instantPositionList({ materialType: 1 }).then(res => {
      //     that.instantPositionList = res.data
      //   })

      if (that.isAdd) {
      } else {
        if (this.record) {
          materialOutDetail({ id: this.record.id }).then(res => {
            const data = res.data
            console.log('详情：', data)
            that.form = {
              id: data.id,
              exWarehouseNo: data.exWarehouseNo,
              orderNo: data.orderNo,
              facName: data.facName,
              remark: data.remark,
              createdName: data.createdName,
              createdTime: data.createdTime,
              materialTableList: data.exWarehouseMaterialList.map(item => {
                ;(item.__maxExWarehouseNum = item.notExWarehouseNum),
                  (item.attributeText = { 1: '原材料', 2: '模具' }[item.attribute] || '未知'),
                  (item.providerText = { 1: '委托方送货', 2: '加工商提货' }[item.attribute] || '未知')
                return item
              })
            }
          })
        }
      }
    },

    handlerMaterialChange({ selectItem, recordParam }) {
      const that = this
      const {
        id,
        positionCode,
        materialId,
        materialName,
        materialCode,
        specification,
        subUnit,
        positionQuantity,
        k3Code
      } = selectItem

      let materialTableList = [...that.form.materialTableList]
      let item = materialTableList.find(item => item.key === recordParam.key)
      item.positionId = id
      item.positionCode = positionCode
      item.materialId = materialId
      item.materialName = materialName
      item.materialCode = materialCode
      item.specification = specification
      item.subUnit = subUnit
      item.exWarehouseNum = positionQuantity
      item.notExWarehouseNum = 0
      item.alreadyExWarehouseNum = 0
      item.__maxExWarehouseNum = positionQuantity
      item.k3Code = k3Code

      that.form = {
        ...that.form,
        materialTableList
      }
    },

    handleSubmit(type) {
      const that = this
      if (type === 'cancel') {
        that.handleCancel()
        return
      } else if (type === 'submit') {
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            const params = {
              ...that.form,
              exWarehouseApplyMaterials: that.form.materialTableList.map(item => {
                // item.notExWarehouseNum = item.alreadyExWarehouseNum - item.exWarehouseNum
                item.notExWarehouseNum = (Number(item.exWarehouseNum) || 0) - (Number(item.alreadyExWarehouseNum) || 0)
                return { ...item }
              }),
              exWarehouseDate: moment(that.form.exWarehouseDate).format('YYYY-MM-DD HH:mm:ss')
            }

            delete params.materialTableList
            console.log(params)
            that.spinning = true
            exWarehouseApplyAddOrUpdate(params)
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
                console.log(err)
                that.$message.error(err.message)
              })
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

    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.form.id })
      that.spinning = true
      exWarehouseApplyApproval(values)
        .then(res => {
          that.spinning = false
          that.$message.info(res.msg)
          if (res.code === 200) {
            that.$emit('ok')
            that.handleCancel()
          }
        })
        .catch(err => (that.spinning = false))
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion
      })
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
  margin-bottom: 0;
}
.custom-table-border caption {
  text-align: left;
}
.gift-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
.__hd {
  font-size: 16px;
}
.__bd {
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
