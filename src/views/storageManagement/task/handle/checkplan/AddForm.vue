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
                <td style="width:150px;">盘点计划单号</td>
                <td style="width:350px;">
                  <a-form-model-item>
                    <span v-if="form.inventoryCode">{{ form.inventoryCode }}</span>
                    <span v-else style="color:#bfbfbf;">系统自动生成</span>
                  </a-form-model-item>
                </td>
                <td style="width:150px;">盘点方式</td>
                <td style="width:350px;">
                  <a-form-model-item prop="type">
                    <a-select 
                      v-if="!isDisabled && !isPandian" 
                      v-model="form.type" 
                      placeholder="盘点方式" 
                      style="width:100%;"
                      @change="handleTypeChange"
                    >
                      <a-select-option :value="0">全盘</a-select-option>
                      <a-select-option :value="1">循环盘</a-select-option>
                    </a-select>
                    <span v-else>{{ { 0: '全盘', 1: '循环盘' }[form.type] }}</span>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>盘点部门</td>
                <td>
                  <a-form-model-item prop="exWarehouseDate">
                    <DepartmentSelect v-if="!isDisabled && !isPandian" @change="handleDepartmentSelectChange" :depId="form.deptId" />
                    <span v-else>{{ form.deptName }}</span>
                  </a-form-model-item>
                </td>
                <td>日期</td>
                <td>
                  <a-form-model-item prop="inventoryDate">
                    <a-date-picker
                      v-if="!isDisabled && !isPandian"
                      style="width:100%;"
                      v-model="form.inventoryDate"
                    />
                    <span v-else>{{ form.inventoryDate }}</span>
                  </a-form-model-item>
                </td>
              </tr>
            </table>
          </div>

          <div class="__hd">盘点计划明细</div>
          <div class="__bd">
            <a-row :gutter="20" v-if="!(isDisabled || isPandian) && +form.type === 1">
              <a-col :span="6">
                <a-form-model-item prop="warehouseId">
                  <a-select
                    style="width:100%;"
                    placeholder="选择仓库"
                    v-model="form.warehouseId"
                    @change="handleWarehouseChange"
                  >
                    <a-select-option v-for="item in warehouseList" :key="item.id" :value="item.id">{{
                      item.warehouseName
                    }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>

              <a-col :span="6">
                <a-form-model-item prop="reservoirAreaId">
                  <a-select
                    style="width:100%;"
                    placeholder="选择库区"
                    v-model="form.reservoirAreaId"
                    @change="handleReservoirAreaChange"
                  >
                    <a-select-option v-for="item in reservoiList" :key="item.id" :value="item.id">{{
                      item.reservoirName
                    }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>

              <a-col :span="6">
                <a-form-model-item prop="shelvesLocationId">
                  <a-select
                    style="width:100%;"
                    placeholder="选择货架"
                    v-model="form.shelvesLocationId"
                    @change="handleShelvesLocationChange"
                  >
                    <a-select-option
                      v-for="item in shelvesLocationList"
                      :key="item.shelvesLocationId"
                      :value="item.shelvesLocationId"
                      >{{ item.shelvesLocationName }}</a-select-option
                    >
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-table
              :columns="columns"
              :dataSource="instantPositionList"
              :pagination="false"
              size="small"
              :rowSelection="
                !(isDisabled || isPandian) ? { onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys } : null
              "
              :scroll="{ y: 450 }"
            >
              <div slot="order" slot-scope="text, record, index">
                {{ index + 1 }}
              </div>

              <!-- <div slot="inventoryAmount" slot-scope="text, record, index">
                <a-form-model-item
                  :prop="`instantPositionList.${index}.inventoryAmount`"
                  :rules="{ required: true, message: '请输入盘点数量' }"
                >
                  <a-input-number
                    style="width:80px;text-align:center;"
                    :min="0"
                    :max="record.stockAmount"
                    :step="1"
                    :precision="0"
                    v-model="record.inventoryAmount"
                  />
                </a-form-model-item>
              </div> -->

              <!-- <div slot="abnormalAmount" slot-scope="text, record, index">
                <a-form-model-item
                  :prop="`instantPositionList.${index}.abnormalAmount`"
                  :rules="{ required: true, message: '请输入异常数量' }"
                >
                  <a-input-number
                    :disabled="isDisabled"
                    style="width:80px;text-align:center;"
                    :min="0"
                    :step="1"
                    :precision="0"
                    v-model="record.abnormalAmount"
                  />
                </a-form-model-item>
              </div> -->
            </a-table>
          </div>
          <div class="__footer">
            <a-button @click="handleSubmit('cancel')">取消</a-button>
            <a-button v-if="isAdd || isEdit" @click="handleSubmit('save')" type="primary">保存</a-button>
            <a-button v-if="isAdd || isEdit" @click="handleSubmit('submit')" type="primary">提交审批</a-button>
            <template v-if="isApproval">
              <a-button type="primary" @click="passAction">通过</a-button>
              <a-button @click="noPassAction" style="margin:0 10px;">不通过</a-button>
            </template>
            <!-- <a-button v-if="isPandian" @click="handleSubmit('pandian')" type="primary">盘点</a-button> -->
          </div>
        </div>
      </a-form-model>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>

<script>
import { getList, ReservoiGetList } from '@/api/storage'

import { getShelvesByAreaId2, containerPalletList ,instantPositionList} from '@/api/storage_wzz'

import {
  artificialInventoryApproval,
  artificialInventoryAddOrUpdate,
  artificialInventoryGetDetail,
  artificialInventoryInventory
} from '@/api/storage_wzz'

import DepartmentSelect from '@/components/CustomerList/DepartmentSelect'
import moment from 'moment'
import Approval from './Approval'

const base_columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '库位码',
    dataIndex: 'positionCode'
  },
  {
    title: '仓库',
    dataIndex: 'warehouseName'
  },
  {
    title: '库区',
    dataIndex: 'reservoirAreaName'
  },
  {
    title: '状态',
    dataIndex: 'isLock'
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
    title: '辅计量单位',
    dataIndex: 'subUnit'
  },
  {
    title: '数量',
    dataIndex: 'positionQuantity'
  }
]

export default {
  name: 'stock_management_task_handle_check_plan_addForm',
  components: {
    Approval,
    DepartmentSelect
  },
  data() {
    return {
      
      visible: false,
      spinning: false,
      record: {},
      type: 'view',
      form: {
        exWarehouseType: 1,
        inventoryDate: moment()
      },
      rules: {
        // routeName: [{ required: true, message: '请输入工艺路线名称' }],
        // defaultStatus: [{ required: true, message: '请选择缺省状态' }],
        // materialCode: [{ required: true, message: '请选择物料代码' }]
      },
      detail: {},

      warehouseList: [],
      reservoiList: [],
      shelvesLocationList: [],
      instantPositionList: [],
      containerPalletList: [],

      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    modalTitle() {
      const m = {
        'view':'查看',
        'add':'新增',
        'edit':'编辑',
        'approval':'审批',
        'pandian':'盘点',
      }
      return `${m[this.type]}`
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
    isPandian() {
      return this.type === 'pandian'
    },
    isDisabled() {
      return this.isView || this.isApproval
    },
    columns(){
      let columns = [...base_columns]
      if(this.isPandian){
        columns = columns.filter(item => item.dataIndex !== 'positionQuantity')
        columns.push({
          title: '库存数量',
          dataIndex: 'stockAmount',
        })
        columns.push({
          title: '盘点数量',
          dataIndex: 'inventoryAmount',
          scopedSlots: { customRender: 'inventoryAmount' }
        })
        columns.push({
          title: '异常数量',
          dataIndex: 'abnormalAmount',
          scopedSlots: { customRender: 'abnormalAmount' }
        })
      }
      return columns
    }
  },
  methods: {
    moment,
    async query(type, record) {
      const that = this
      that.visible = true
      that.record = { ...record }
      that.type = type

      that.form = {
        exWarehouseType: 1,
        inventoryDate: moment()
      }

      that.spinning = true
      
      await getList().then(res => {
        //人工盘点只显示平面库信息   warehouseType 2平面库 1智能库
        that.warehouseList = res.data.filter(item => +item.warehouseType === 2)
      })

      try {
        if (that.isAdd) {
        } else {
          if (this.record) {
            await artificialInventoryGetDetail({ id: this.record.id }).then(res => {
              const data = res.data
              that.form = {
                ...data,
                inventoryDate: that.isDisabled ? data.inventoryDate : moment(data.inventoryDate)
              }
              if(!that.isEdit){
                that.instantPositionList = data.artificialInventoryInfos || []
              }
            })

            if(that.isEdit){
              const artificialInventoryInfos = that.form.artificialInventoryInfos || []
  
              if (artificialInventoryInfos.length > 0) {
                const { warehouseId, reservoirAreaId, shelvesLocationId } = artificialInventoryInfos[0]
                await that.handleWarehouseChange(warehouseId)
                await that.handleReservoirAreaChange(reservoirAreaId)
                await that.handleShelvesLocationChange(shelvesLocationId)
  
                that.selectedRowKeys = artificialInventoryInfos.map(item => String(item.positionId))
                that.selectedRows = that.instantPositionList.filter(item => {
                  return that.selectedRowKeys.includes(String(item.positionId))
                })
              }
            }else{

            }
          }
        }
      } catch (err) {
        console.log(err)
      }
      that.spinning = false
    },
    rowSelectionChangeHnadler(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },

    handleSubmit(type) {
      const that = this
      if (type === 'cancel') {
        that.handleCancel()
        return
      } else {

        if ((that.isAdd || that.isEdit) && that.selectedRows.length === 0) {
          that.$message.info('请至少选择一条盘点计划明细')
          return
        }

        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            const params = {
              ...that.form,
              inventoryDate: moment(that.form.inventoryDate).format('YYYY-MM-DD HH:mm:ss'),
              status: type === 'save' ? 0 : 1
            }

            params.artificialInventoryInfos = that.selectedRows.map(item => {
              item.id = that.form.id
              return item
            })

            console.log(params)
            const _API_ = that.isPandian ? artificialInventoryInventory : artificialInventoryAddOrUpdate
            that.spinning = true
            _API_(params)
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
        that.form = {
          exWarehouseType: 1,
          inventoryDate: moment()
        }

        that.detail = {}

        that.warehouseList = []
        that.reservoiList = []
        that.shelvesLocationList = []
        that.instantPositionList = []
        that.containerPalletList = []

        that.selectedRowKeys = []
        that.selectedRows = []

        that.visible = false
      })
    },

    handleDepartmentSelectChange(item) {
      this.form = {
        ...this.form,
        deptId: item.id,
        deptName: item.departmentName
      }
    },
    handleWarehouseChange(id) {
      const that = this
      let target = that.warehouseList.find(item => item.id === id)
      that.form = {
        ...that.form,
        warehouseId: id,
        warehouseName: target.warehouseName
      }

      return ReservoiGetList({ warehouseId: id }).then(res => {
        that.reservoiList = res.data
      })
    },

    handleReservoirAreaChange(id) {
      const that = this
      let target = that.reservoiList.find(item => item.id === id)
      that.form = {
        ...that.form,
        reservoirAreaId: id,
        reservoirCode: target.reservoirCode,
        reservoirAreaName: target.reservoirName
      }

      const { reservoirAreaId } = that.form
      return getShelvesByAreaId2({
        areaId: reservoirAreaId
      }).then(res => {
        that.shelvesLocationList = res.data.map(item => {
          item.key = that._uuid()
          return item
        })
      })
    },

    handleShelvesLocationChange(shelvesLocationId) {
      const that = this
      let target = that.shelvesLocationList.find(item => item.shelvesLocationId === shelvesLocationId)
      if (target) {
        const { warehouseId, warehouseName, reservoirAreaId, reservoirAreaName } = that.form
        that.instantPositionList = (target.positionModelVoList || []).map(item => {
          item.key = String(item.id)
          item.isLock = +target.type === 1 ? (+target.isLock === 1 ? '是' : '否') : '-'
          item.type = target.type
          item.warehouseId = warehouseId
          item.warehouseName = warehouseName
          item.reservoirAreaId = reservoirAreaId
          item.reservoirAreaName = reservoirAreaName
          item.shelvesLocationId = target.shelvesLocationId
          item.shelvesLocationName = target.shelvesLocationName
          item.positionId = item.id
          item.stockAmount = item.positionQuantity
          return item
        })

        that.form = {
          ...that.form,
          shelvesLocationId: target.shelvesLocationId,
          shelvesLocationName: target.shelvesLocationName,
          shelvesLocationType: target.type
        }
      }
    },

    handleTypeChange(val){
      const that = this

      that.instantPositionList = []

      if(+val === 0){
        instantPositionList({
          materialType:1, // 是否查询只含有物料的信息（0否，1是）
          type:0 // 用于盘点计划1是查立体库，0是查非立体库
        }).then(res => {
          that.instantPositionList = res.data
        })
      }
    },

    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.form.id })
      that.spinning = true
      artificialInventoryApproval(values)
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
