<template>
  <a-modal
    :title="modalTitle"
    :width="1300"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button class="a-button" type="primary" icon="close" @click="noPassAction(recordDetails)">不通过</a-button>
        <a-button class="a-button" type="primary" icon="check" @click="passAction()">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form-model ref="ruleForm" :model="form" class="routine-addform-wrapper-baseInnerData">
        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 25%">调拨单编号</td>
            <td>{{ type !== 'add' ? record.allocateNum : '系统自动生成' }}</td>
            <td>日期</td>
            <td>
              <a-form-model-item
                prop="allocateDate"
                :rules="{
                  required: true,
                  message: '请选择日期',
                }"
              >
                <a-date-picker v-model="form.allocateDate" />
              </a-form-model-item>
            </td>
          </tr>
        </table>
        <div style="margin-top: 20px">
          <h3>物料信息</h3>
          <a-table
            :columns="travelColumns"
            :dataSource="form.materialList"
            :pagination="false"
            bordered
            size="small"
            :scroll="{ x: 1500 }"
          >
            <div slot="order" slot-scope="text, record, index">
              {{ index + 1 }}
            </div>

            <div slot="removeWarehouseReservoir" slot-scope="text">
              <a-tooltip v-if="String(text).length > 10">
                <template slot="title">{{ text }}</template>
                {{ String(text).slice(0, 10) }}...
              </a-tooltip>
              <span v-else>{{ text }}</span>
            </div>
            <div slot="materialCode" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'materialList.' + index + '.materialCode'"
                :rules="{
                  required: true,
                  message: '请选择物料代码',
                }"
              >
                <a-input
                  read-only="read-only"
                  v-if="!isDisabled"
                  @click="openModel(record)"
                  placeholder="请选择物料代码"
                  :value="record.materialCode"
                />
                <span v-else>
                  {{ record.materialCode }}
                </span>
              </a-form-model-item>
            </div>
            <div slot="immigrateWarehouseReservoirId" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'materialList.' + index + '.immigrateWarehouseReservoirId'"
                :rules="{
                  required: true,
                  message: '请选择移入仓库/库区',
                }"
              >
                <DepartmentUser
                  v-if="!isDisabled"
                  allowClear
                  :key="record.key"
                  :info.sync="record.immigrateWarehouseReservoirId"
                  :infoList.sync="record.immigrate"
                  :infoName.sync="record.immigratename"
                  :positionCode.sync="record.immigrateWarehouseReservoir"
                />
                <span v-else>
                  {{ record.immigrateWarehouseReservoir + ',' + record.immigratename }}
                </span>
              </a-form-model-item>
            </div>
            <div slot="planAllocateNum" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'materialList.' + index + '.planAllocateNum'"
                :rules="{
                  required: true,
                  message: '请输入数量',
                }"
              >
                <a-input-number v-if="!isDisabled" v-model="record.planAllocateNum" />
                <span v-else>
                  {{ record.planAllocateNum }}
                </span>
              </a-form-model-item>
            </div>
            <div slot="immigratePositionId" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'materialList.' + index + '.immigratePositionId'"
                :rules="{
                  required: true,
                  message: '请选择移入仓位',
                }"
              >
                <DepartmentUserCascade
                  v-if="!isDisabled"
                  allowClear
                  :key="record.key"
                  :info.sync="record.immigrateShelvesLocationId"
                  :infoList.sync="record.immigrate"
                  :PositionId.sync="record.immigratePositionId"
                  :PositionName.sync="record.immigratePosition"
                  :materialId.sync="record.materialId"
                  :types.sync="record.type"
                  :positionCode.sync="record.immigrateShelvesLocationName"
                />
                <span v-else>
                  {{ record.immigrateShelvesLocationName + ',' + record.immigratePosition }}
                </span>
              </a-form-model-item>
            </div>
            <div slot="doAction" slot-scope="text, record, index">
              <a href="javascript:void(0);" v-if="!isDisabled" @click="doAction('remove', record)">删除</a>
            </div>
          </a-table>
          <a-button
            style="width: 100%"
            type="dashed"
            icon="plus"
            v-if="!isDisabled"
            @click="doAction('add-travelRecord', null)"
          >
            添加
          </a-button>
        </div>
      </a-form-model>
      <product-model ref="productModel" @custom-change="productChange"></product-model>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import { allocateAddOrUpdate, allocateApprove, allocateGetDetailById } from '@/api/storage'
import Approval from './Approval'
import ProductModel from './productModel'
import DepartmentUserCascade from './DepartmentUserCascade'
import DepartmentUser from './DepartmentUser'
import moment from 'moment'

let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'BecomingForm',
  components: {
    Approval: Approval,
    ProductModel,
    DepartmentUserCascade,
    DepartmentUser,
  },
  data() {
    return {
      remark: '',
      visible: false,

      personSelectDataSource: [], //人员
      departmentList: [], //部门
      postSelectDataSource: [], //职位
      spinning: false,
      form: {
        materialList: [],
        allocateDate: moment(),
      },
      type: 'view',
      record: {},
    }
  },

  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改仓位移位申请'
      }
      let txt = this.isView ? '查看' : this.isEdit ? '审核' : this.isView5 ? '查看' : '新增'
      return `${txt}仓位移位申请`
    },
    isView() {
      //查看
      return this.type === 'view'
    },
    isView5() {
      //查看
      return this.type === 'view5'
    },
    isEdit() {
      //审核
      return this.type === 'edit'
    },
    isApproval() {
      //通过不通过
      return this.type === 'edit'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
    isDisabled() {
      return this.isView || this.isEdit || this.isView5
    },
    travelColumns() {
      const baseColumns = [
        {
          title: '序号',
          scopedSlots: { customRender: 'order' },
          width: 60,
        },
        {
          title: '物料代码',
          align: 'center',
          dataIndex: 'materialCode',
          scopedSlots: { customRender: 'materialCode' },
          width: 150,
        },
        {
          title: '物料名称',
          align: 'center',
          dataIndex: 'materialName',
          width: 100,
        },
        {
          title: '辅计量单位',
          align: 'center',
          dataIndex: 'subUnit',
          width: 100,
        },
        {
          title: '移除仓库/库区',
          align: 'center',
          dataIndex: 'removeWarehouseReservoir',
          scopedSlots: { customRender: 'removeWarehouseReservoir' },
        },
        {
          title: '移出仓位',
          align: 'center',
          dataIndex: 'removePosition',
        },
        {
          title: '移入仓库/库区',
          align: 'center',
          dataIndex: 'immigrateWarehouseReservoirId',
          scopedSlots: { customRender: 'immigrateWarehouseReservoirId' },
          width: 300,
        },
        {
          title: '移入库位/仓位',
          align: 'center',
          dataIndex: 'immigratePositionId',
          scopedSlots: { customRender: 'immigratePositionId' },
          width: 300,
        },
        {
          title: '调拨数量',
          align: 'center',
          dataIndex: 'planAllocateNum',
          scopedSlots: { customRender: 'planAllocateNum' },
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'doAction' },
          width: 60,
        },
      ]
      return baseColumns
    },
  },
  methods: {
    moment,
    openModel(record) {
      this.$refs.productModel.query(record)
    },
    productChange(data) {
      let { selectItem, recordParam } = data
      const materialList = [...this.form.materialList]
      const target = materialList.find((item) => item.key === recordParam.key)
      if (target) {
        target['materialCode'] = selectItem.materialCode // 物料代码
        target['materialName'] = selectItem.materialName // 物料名称
        target['subUnit'] = selectItem.subUnit // 辅计量单位
        target['removeWarehouseReservoir'] = selectItem.warehouseName + '/' + selectItem.warehouseName //仓库库区
        target['removePosition'] = selectItem.positionCode //移出
        target['removePositionId'] = selectItem.id //移出
        target['reservoirAreaId'] = selectItem.reservoirAreaId //库区id
        target['materialId'] = selectItem.materialId //物料id
        target['warehouseId'] = selectItem.warehouseId //仓库id

        this.form.materialList = materialList
      }
    },
    //接受数据
    query(type, record) {
      const that = this
      that.visible = true
      that.type = type
      that.record = record
      this.form.materialList = []
      if (type !== 'add') {
        allocateGetDetailById({ id: record.id }).then((res) => {
          let detail = res.data
          that.form = {
            allocateDate: moment(detail.allocateDate),
            materialList: detail.materialListVo.map((i) => {
              return {
                key: uuid(),
                immigratePositionId: i.immigratePositionId,
                immigratePosition: i.immigratePosition,
                immigrateShelvesLocationId: i.immigrateShelvesLocationId,
                immigrateShelvesLocationName: i.immigrateShelvesLocationName,
                immigrateWarehouseReservoir: i.immigrateWarehouseReservoir.split(',')[0],
                immigrateWarehouseReservoirId: Number(i.immigrateWarehouseReservoirId.split(',')[0]),
                immigratename: i.immigrateWarehouseReservoir.split(',')[1],
                immigrate: Number(i.immigrateWarehouseReservoirId.split(',')[1]),
                materialCode: i.materialCode,
                materialName: i.materialName,
                materialId: i.materialId,
                planAllocateNum: i.planAllocateNum,
                removePosition: i.removePosition,
                subUnit: i.subUnit,
                reservoirAreaId: Number(i.reservoirAreaId),
                removeWarehouseReservoir: i.removeWarehouseReservoir,
                removePositionId: i.removePositionId,
              }
            }),
          }
        })
      }
    },
    //提交
    handleOk() {
      let that = this
      if (that.type === 'view') {
        this.visible = false
      } else {
        that.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            const params = that.$_.cloneDeep(that.form || {})
            if (that.type === 'edit-salary') {
              params.id = that.record.id
            }
            params.allocateDate = params.allocateDate.format('YYYY-MM-DD')
            params.materialList = params.materialList.map((i) => {
              return {
                immigratePositionId: i.immigratePositionId,
                immigratePosition: i.immigratePosition,
                materialCode: i.materialCode,
                materialName: i.materialName,
                materialId: i.materialId,
                planAllocateNum: i.planAllocateNum,
                removePosition: i.removePosition,
                subUnit: i.subUnit,
                removeWarehouseReservoir: i.removeWarehouseReservoir,
                removePositionId: i.removePositionId,
                immigrateWarehouseReservoir: i.immigrateWarehouseReservoir + ',' + i.immigratename,
                immigrateWarehouseReservoirId: i.immigrateWarehouseReservoirId + ',' + i.immigrate,
                immigrateShelvesLocationId: i.immigrateShelvesLocationId,
                immigrateShelvesLocationName: i.immigrateShelvesLocationName,
              }
            })
            console.log(params)
            that.spinning = true
            allocateAddOrUpdate(params)
              .then((res) => {
                if (res.code === 200) {
                  that.spinning = false
                  that.visible = false
                  that.$message.info(res.msg)
                  that.$refs.ruleForm.resetFields()
                  that.$emit('filet')
                }
              })
              .catch((err) => (that.spinning = false))
          }
        })
      }
    },
    handleCancel() {
      this.$refs.ruleForm.resetFields()
      this.form = {}
      this.visible = false
    },
    doAction(type, record) {
      const that = this
      if (type === 'add-travelRecord') {
        const materialList = [...this.form.materialList]
        materialList.push({
          key: uuid(),
          materialCode: undefined,
          materialName: undefined,
          warehouseName: undefined,
          materialId: null,
          immigrateWarehouseReservoir: null,
          immigrateWarehouseReservoirId: null,
          immigratePositionId: null,
          immigratePosition: null,
          immigrate: null,
          immigratename: null,
          immigrateShelvesLocationId: null,
          immigrateShelvesLocationName: null,
          planAllocateNum: null,
          subUnit: undefined,
          removeWarehouseReservoir: undefined,
          reservoirAreaId: null,
          removePosition: undefined,
        })
        that.form = { ...that.form, materialList }
      }
      if (type === 'remove') {
        let materialList = [...that.form.materialList]
        materialList = materialList.filter((item) => item.key !== record.key)
        that.form = { ...that.form, materialList }
      }
    },
    // 审批
    submitAction(opt) {
      let that = this
      let values = {
        approveId: this.record.id,
        isAdopt: opt.isAdopt,
        opinion: opt.opinion,
      }
      that.spinning = true
      allocateApprove(values)
        .then((res) => {
          that.spinning = false
          that.handleCancel()
          that.$message.info(res.msg)
          that.$emit('filet')
        })
        .catch((err) => (that.spinning = false))
    },
    passAction() {
      this.submitAction({
        isAdopt: 0,
        // opinion: '通过',
      })
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
  },
}
</script>
<style scoped>
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 15px 10px;
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
.ant-form-item {
  margin-bottom: 0;
}

.bank-card-list-wrapper {
  display: flex;
}
.bank-card-list-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0 7px;
}
</style>
