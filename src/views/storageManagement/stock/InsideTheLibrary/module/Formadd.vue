<template>
  <a-modal
    :title="modalTitle"
    :width="1200"
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
            <td style="width: 25%">移动单编号</td>
            <td>{{ type !== 'add' ? record.translocateNum : '系统自动生成' }}</td>
            <td>日期</td>
            <td>
              <a-form-model-item
                prop="translocateDate"
                :rules="{
                  required: true,
                  message: '请选择日期',
                }"
              >
                <a-date-picker :disabled="isDisabled" v-model="form.translocateDate" />
              </a-form-model-item>
            </td>
          </tr>
        </table>
        <div style="margin-top: 20px">
          <h3>物料信息</h3>
          <a-table :columns="travelColumns" :dataSource="form.materialList" :pagination="false" bordered size="small">
            <div slot="order" slot-scope="text, record, index">
              {{ index + 1 }}
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

            <div slot="planImmigrateNum" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'materialList.' + index + '.planImmigrateNum'"
                :rules="{
                  required: true,
                  message: '请输入数量',
                }"
              >
                <a-input-number v-if="!isDisabled" v-model="record.planImmigrateNum" />
                <span v-else>
                  {{ record.planImmigrateNum }}
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
                  :info.sync="record.immigratePositionId"
                  :infoList.sync="record.shelvesLocationId"
                  :materialId.sync="record.materialId"
                  :types.sync="record.type"
                  :positionCode.sync="record.immigratePosition"
                />
                <span v-else>
                  {{ record.immigratePosition }}
                </span>
                <!-- <a-select v-model="record.immigratePositionId" placeholder="带货方式">
                  <a-select-option v-for="item in record.warehouseList" :key="item.id" :value="item.id">{{
                    item.warehouseName
                  }}</a-select-option>
                  <a-select-option :value="0">自带</a-select-option>
                  <a-select-option :value="1">邮寄</a-select-option>
                </a-select> -->
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
import { translocateAddOrUpdate, translocateApprove, translocateGetDetailById } from '@/api/storage'
import Approval from './Approval'
import ProductModel from './productModel'
import DepartmentUserCascade from './DepartmentUserCascade'
import moment from 'moment'

let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'BecomingForm',
  components: {
    Approval: Approval,
    ProductModel,
    DepartmentUserCascade,
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
        translocateDate: moment(),
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
          dataIndex: 'subUnit',
          width: 100,
        },
        {
          title: '仓库/库区',
          dataIndex: 'warehouseReservoir',
        },
        {
          title: '移出仓位',
          dataIndex: 'removePosition',
        },
        {
          title: '移入仓位',
          dataIndex: 'immigratePositionId',
          scopedSlots: { customRender: 'immigratePositionId' },
          width: 150,
        },
        {
          title: '计划转移数量',
          dataIndex: 'planImmigrateNum',
          scopedSlots: { customRender: 'planImmigrateNum' },
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'doAction' },
          width: 60,
        },
      ]
      const baseColumns1 = [
        {
          title: '序号',
          scopedSlots: { customRender: 'order' },
          width: 60,
        },
        {
          title: '物料代码',
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
          dataIndex: 'subUnit',
          width: 100,
        },
        {
          title: '仓库/库区',
          dataIndex: 'warehouseReservoir',
        },
        {
          title: '移出仓位',
          dataIndex: 'removePosition',
        },
        {
          title: '移入仓位',
          dataIndex: 'immigratePositionId',
          scopedSlots: { customRender: 'immigratePositionId' },
          width: 150,
        },
        {
          title: '计划转移数量',
          dataIndex: 'planImmigrateNum',
          scopedSlots: { customRender: 'planImmigrateNum' },
        },
      ]
      return this.isView !== true ? baseColumns : baseColumns1
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
        target['warehouseReservoir'] = selectItem.warehouseName + '/' + selectItem.warehouseName //仓库库区
        target['removePosition'] = selectItem.positionCode //移出
        target['removePositionId'] = selectItem.id //移出
        target['shelvesLocationId'] = selectItem.shelvesLocationId //库区id
        target['materialId'] = selectItem.materialId //库区id
        target['type'] = selectItem.type //类型

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
        translocateGetDetailById({ id: record.id }).then((res) => {
          let detail = res.data
          that.form = {
            translocateDate: moment(detail.translocateDate),
            materialList: detail.materialListVo.map((i) => {
              return {
                key: uuid(),
                immigratePositionId: i.immigratePositionId,
                immigratePosition: i.immigratePosition,
                materialCode: i.materialCode,
                materialName: i.materialName,
                materialId: i.materialId,
                planImmigrateNum: i.planImmigrateNum,
                removePosition: i.removePosition,
                subUnit: i.subUnit,
                shelvesLocationId: Number(i.shelvesLocationId),
                warehouseReservoir: i.warehouseReservoir,
                removePositionId: i.removePositionId,
                type: i.type,
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
            params.translocateDate = params.translocateDate.format('YYYY-MM-DD')
            params.materialList = params.materialList.map((i) => {
              return {
                immigratePositionId: i.immigratePositionId,
                immigratePosition: i.immigratePosition,
                materialCode: i.materialCode,
                materialName: i.materialName,
                materialId: i.materialId,
                planImmigrateNum: i.planImmigrateNum,
                removePosition: i.removePosition,
                subUnit: i.subUnit,
                warehouseReservoir: i.warehouseReservoir,
                removePositionId: i.removePositionId,
              }
            })
            console.log(params)
            translocateAddOrUpdate(params)
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
        // that.form.validateFields((err, values) => {
        //   if (!err) {
        //     if (that.type === 'edit-salary') {
        //       values.id = that.record.id
        //     }
        //     if (that.type === 'add' || that.type === 'edit-salary') {
        //       that.spinning = true
        //       other_addAndUpdate(values)
        //         .then((res) => {
        //           this.programme = []
        //           this.visible = false
        //           that.spinning = false
        //           that.form.resetFields() // 清空表
        //           that.$message.info(res.msg)
        //           that.$emit('finish')
        //         })
        //         .catch((err) => (that.spinning = false))
        //     }
        //   }
        // })
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
          removePosition: undefined,
          warehouseName: undefined,
          immigratePositionId: null,
          immigratePosition: null,
          planImmigrateNum: null,
          subUnit: undefined,
          warehouseReservoir: undefined,
          shelvesLocationId: null,
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
      translocateApprove(values)
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
