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
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">出库单号</td>
                <td style="width:350px;">
                  <a-form-model-item>
                    <span v-if="form.exWarehouseApplyCode">{{ form.exWarehouseApplyCode }}</span>
                    <span v-else style="color:#bfbfbf;">系统自动生成</span>
                  </a-form-model-item>
                </td>
                <td style="width:150px;">出库类型</td>
                <td style="width:350px;">
                  <a-form-model-item prop="exWarehouseType">
                    <a-select
                      v-if="!isDisabled"
                      v-model="form.exWarehouseType"
                      placeholder="出库类型"
                      style="width:100%;"
                    >
                      <a-select-option :value="1">基建出库</a-select-option>
                      <a-select-option :value="2">研发出库</a-select-option>
                    </a-select>
                    <span v-else>{{ {1:'基建出库',2:'研发出库'}[form.exWarehouseType] }}</span>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>日期</td>
                <td colspan="3">
                  <a-form-model-item prop="exWarehouseDate">
                    <a-date-picker v-if="!isDisabled" :disabled="isDisabled" style="width:100%;" v-model="form.exWarehouseDate" />
                    <span v-else>{{ form.exWarehouseDate }}</span>
                  </a-form-model-item>
                </td>
              </tr>
            </table>
          </div>

          <div class="__hd">物料信息</div>
          <div class="__bd">
            <a-table :columns="columns" :dataSource="form.materialTableList" :pagination="false" size="small">
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
                <span v-else>{{text}}</span>
              </div>

              <div slot="materialName" slot-scope="text, record">
                <a-popover title="物料信息">
                  <template slot="content">
                    <h3>物料名称</h3>
                    <p style="width:450px;">{{ record.materialName }}</p>
                    <h3>规格型号</h3>
                    <p style="width:450px;">{{ record.specification }}</p>
                    <h3>物料代码</h3>
                    <p style="width:450px;">{{ record.materialCode }}</p>
                  </template>
                  <span>{{ text }}</span>
                </a-popover>
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
                    :max="record.__maxExWarehouseNum"
                    :step="1"
                    :precision="0"
                    :value="record.exWarehouseNum"
                    @change="(val) => handleExWarehouseNumChange(index,record,val)"
                  />
                </a-form-model-item>
                <!-- <span v-else>{{record.alreadyExWarehouseNum}}</span> -->
                <span v-else>{{record.exWarehouseNum}}</span>
              </div>


              <!-- <div slot="action" slot-scope="text, record">
                <a-button type="link" @click="actionItem('delete', record)">删除</a-button>
              </div> -->

              <template slot="footer" >
                <div style="text-align:right;margin-right:10px;font-size:16px;">
                  <span>合计：</span>
                  <span style="margin:0 5px;">出库数量 &nbsp;{{ form.materialTableList.reduce((adder,item) => adder + (parseFloat(item.exWarehouseNum) || 0),0)  }} </span>
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
              <a-textarea v-if="!isDisabled" :disabled="isDisabled" v-model="form.remarks" placeholder="备注" :rows="4" />
              <span v-else>{{ form.remarks }}</span>
            </a-form-model-item>
          </div>

          <div class="__footer">
            <a-button @click="handleSubmit('cancel')">取消</a-button>
            <a-button v-if="isAdd || isEdit" @click="handleSubmit('submit')" type="primary">提交</a-button>
            <template v-if="isApproval">
              <a-button type="primary" @click="passAction">通过</a-button>
              <a-button @click="noPassAction" style="margin:0 10px;">不通过</a-button>
            </template>
          </div>
        </div>
      </a-form-model>
      <Approval ref="approval" @opinionChange="opinionChange" />
      <MaterialSelect ref="materialSelect" @custom-change="handlerMaterialChange"/>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  exWarehouseApplyAddOrUpdate,
  exWarehouseApplyApproval,
  exWarehouseApplyDetail,
  instantPositionList
} from '@/api/storage_wzz'

import moment from 'moment'
import Approval from './Approval'
import MaterialSelect from './MaterialSelect'
const base_columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode',
    scopedSlots: { customRender: 'materialCode' }
  },
  {
    title: '仓位代码',
    dataIndex: 'positionCode'
  },
  {
    title: '物料名称',
    dataIndex: 'materialName',
    scopedSlots: { customRender: 'materialName' }
  },
  {
    title: '规格型号',
    dataIndex: 'specification',
    width:200
  },
  {
    title: '辅计量单位',
    dataIndex: 'subUnit'
  },
  {
    title: '出库数量',
    dataIndex: 'exWarehouseNum',
    scopedSlots: { customRender: 'exWarehouseNum' }
  },
  // {
  //   title: '操作',
  //   scopedSlots: { customRender: 'action' }
  // }
]

export default {
  name: 'storage-export-apply-addForm',
  components: {
    Approval,
    MaterialSelect
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

      const action = this.isView ? '查看' : this.isEdit ? '编辑' : this.isApproval ? '审批' : '新增'

      return `${action}-出库申请单`
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
    isApproval() {
      return this.type === 'approval'
    },
    isDisabled() {
      return this.isView || this.isApproval
    },
    columns(){
      let columns = [...base_columns]
      // return this.isDisabled ? columns.slice(0,-1) : columns
      return columns
    }
  },
  methods: {
    moment,
    openModel(record) {
      this.$refs.materialSelect.query(record)
    },
    handleExWarehouseNumChange(index,record,val){
      const that = this
      let materialTableList = [...that.form.materialTableList]
      let target = materialTableList[index]
      target.exWarehouseNum = val

      that.form = {
        ...that.form,
        materialTableList
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

      instantPositionList({ materialType: 1 }).then(res => {
        that.instantPositionList = res.data
      })

      if (that.isAdd) {
      } else {
        if (this.record) {
          exWarehouseApplyDetail({ id: this.record.id }).then(res => {
            const data = res.data
            that.form = {
              id: data.id,
              exWarehouseApplyCode: data.exWarehouseApplyCode,
              exWarehouseType: data.exWarehouseType,
              exWarehouseDate: that.isDisabled ? data.exWarehouseDate : moment(data.exWarehouseDate),
              remarks: data.remarks,
              materialTableList: data.exWarehouseApplyMaterials.map(item => {
                item.__maxExWarehouseNum = item.notExWarehouseNum
                return item
              })
            }
          })
        }
      }
    },

    handlerMaterialChange({selectItem, recordParam}) {
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
              exWarehouseApplyMaterials:that.form.materialTableList.map(item => {
                // item.notExWarehouseNum = item.alreadyExWarehouseNum - item.exWarehouseNum
                item.notExWarehouseNum = (Number(item.exWarehouseNum) || 0) - (Number(item.alreadyExWarehouseNum) || 0)
                return {...item}
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
