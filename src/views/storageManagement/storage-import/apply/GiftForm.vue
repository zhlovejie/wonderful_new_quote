<template>
  <a-spin :spinning="spinning">
    <a-form-model ref="ruleForm" :model="form" :rules="rules" class="gift-form-wrapper">
      <div class="card-item">
        <div class="__hd">基本信息</div>
        <div class="__bd">
          <table class="custom-table custom-table-border">
            <tr>
              <td style="width:150px;">入库申请单号</td>
              <td style="width:350px;">
                <a-form-model-item>
                  <span v-if="form.storageCode">{{ form.storageCode }}</span>
                  <span v-else style="color:#bfbfbf;">系统自动生成</span>
                </a-form-model-item>
              </td>
              <td style="width:150px;">入库仓库</td>
              <td style="width:350px;">
                <a-form-model-item prop="warehouseId">
                  <a-select
                    :disabled="isDisabled"
                    v-model="form.warehouseId"
                    placeholder="选择入库仓库"
                    style="width:100%;"
                    @change="handleWarehouseChange"
                  >
                    <a-select-option v-for="item in warehouseList" :key="item.id" :value="item.id">{{
                      item.warehouseName
                    }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </td>
            </tr>
            <tr>
              <td>紧急程度</td>
              <td>
                <a-form-model-item prop="useStatus">
                  <a-select :disabled="isDisabled" v-model="form.urgentType" placeholder="状态" style="width:100%;">
                    <a-select-option :value="1">一般</a-select-option>
                    <a-select-option :value="2">紧急</a-select-option>
                    <a-select-option :value="3">特急</a-select-option>
                  </a-select>
                </a-form-model-item>
              </td>
              <td>日期</td>
              <td>
                <a-form-model-item prop="storageDate">
                  <a-date-picker :disabled="isDisabled" style="width:100%;" v-model="form.storageDate" />
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
                :prop="`materialTableList.${index}.materialCode`"
                :rules="{ required: true, message: '请选择物料' }"
              >
                <MaterialFuzzySearch
                  :disabled="isDisabled"
                  style="width:250px;"
                  :materialInfo="form.materialTableList[0]"
                  @change="handlerMaterialChange"
                />
              </a-form-model-item>
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
            <div slot="storageNum" slot-scope="text, record, index">
              <a-form-model-item
                :prop="`materialTableList.${index}.storageNum`"
                :rules="{ required: true, message: '请输入入库数量' }"
              >
                <a-input-number
                  :disabled="isDisabled"
                  style="width:80px;text-align:center;"
                  :min="0"
                  :step="1"
                  :precision="0"
                  v-model="record.storageNum"
                />
              </a-form-model-item>
            </div>
            <div slot="remarks" slot-scope="text, record">
              <a-form-model-item>
                <a-textarea :disabled="isDisabled" v-model="record.remarks" placeholder="备注" auto-size />
              </a-form-model-item>
            </div>
          </a-table>
        </div>
        <div class="__hd">备注</div>
        <div class="__bd">
          <a-form-model-item>
            <a-textarea :disabled="isDisabled" v-model="form.remarks" placeholder="备注" :rows="4" />
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
  </a-spin>
</template>

<script>
import { giftSaveAndUpdate, giftApproval, getWarehouseList, giftDetail } from '@/api/storage_wzz'
import moment from 'moment'
import Approval from './Approval'
import MaterialFuzzySearch from '@/components/CustomerList/MaterialFuzzySearch'

const columns = [
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
    title: '物料名称',
    dataIndex: 'materialName',
    scopedSlots: { customRender: 'materialName' }
  },
  {
    title: '辅计量单位',
    dataIndex: 'subUnit'
  },
  {
    title: '产品重量',
    dataIndex: 'weight'
  },
  {
    title: '入库数量',
    dataIndex: 'storageNum',
    scopedSlots: { customRender: 'storageNum' }
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    scopedSlots: { customRender: 'remarks' }
  }
]

export default {
  name: 'GiftForm',
  components: {
    MaterialFuzzySearch,
    Approval
  },
  inject: ['addForm'],
  data() {
    return {
      columns,
      form: {
        urgentType: 1,
        storageDate: moment(),
        materialTableList: [{}] //物料信息
      },
      rules: {
        // routeName: [{ required: true, message: '请输入工艺路线名称' }],
        // defaultStatus: [{ required: true, message: '请选择缺省状态' }],
        // materialCode: [{ required: true, message: '请选择物料代码' }]
      },
      warehouseList: [],
      spinning: false,
      detail: {}
    }
  },
  computed: {
    record() {
      return this.addForm.record || null
    },
    isAdd() {
      return this.addForm.isAdd
    },
    isEdit() {
      return this.addForm.isEdit
    },
    isDisabled() {
      return this.addForm.isDisabled
    },
    isApproval() {
      return this.addForm.isApproval
    }
  },
  created() {
    const that = this
    that.fetchgetWarehouseList()
    if (that.addForm.isAdd) {
    } else {
      if (this.record) {
        giftDetail({ id: this.record.storageApplyId }).then(res => {
          const data = res.data
          that.form = {
            id: data.id,
            storageCode: data.storageCode,
            urgentType: data.urgentType,
            storageDate: moment(data.storageDate),
            warehouseId: data.warehouseId,
            warehouseName: data.warehouseName,
            remarks: data.remarks,
            materialTableList: [
              {
                key: that._uuid(),
                materialId: data.materialId,
                materialName: data.materialName,
                materialCode: data.materialCode,
                specification: data.specification,
                subUnit: data.subUnit,
                storageNum: data.storageNum,
                weight: data.weight,
                materialRemarks: data.materialRemarks
              }
            ]
          }
        })
      }
    }
  },
  methods: {
    moment,
    fetchgetWarehouseList() {
      getWarehouseList().then(res => (this.warehouseList = res.data))
    },
    handlerMaterialChange(item) {
      // debugger
      const that = this
      let materialTableList = [...that.form.materialTableList]
      let target = materialTableList[0]
      target.materialId = item.materialId
      target.materialCode = item.materialCode
      target.materialName = item.materialName
      target.subUnit = item.materialUnit
      target.weight = item.weight || 0
      target.specification = item.modelType
      target.k3Code = item.k3Code
      that.form = {
        ...that.form,
        materialTableList
      }
    },
    handleWarehouseChange(warehouseId) {
      let target = this.warehouseList.find(item => item.id === warehouseId)
      this.form = {
        ...this.form,
        warehouseId: warehouseId,
        warehouseName: target.warehouseName
      }
    },
    handleSubmit(type) {
      const that = this
      if (type === 'cancel') {
        that.$emit('change', type)
        return
      } else if (type === 'submit') {
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            const params = {
              ...that.form,
              ...that.form.materialTableList[0],
              storageDate: moment(that.form.storageDate).format('YYYY-MM-DD HH:mm:ss')
            }

            delete params.materialTableList
            console.log(params)
            that.spinning = true
            giftSaveAndUpdate(params)
              .then(res => {
                that.spinning = false
                that.$message.info(res.msg)
                if (res.code === 200) {
                  that.$emit('change', 'approval')
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

    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.storageApplyId })
      that.spinning = true
      giftApproval(values)
        .then(res => {
          that.spinning = false
          that.$message.info(res.msg)
          if (res.code === 200) {
            that.$emit('change', 'approval')
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
