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
    <!-- a-spin:loading 状态, spinning:是否为加载中状态 -->
    <a-spin :spinning="spinning">
      <!-- a-form-model:使用:model 来绑定整个表单的数据，使用:rules来绑定整个表单的校验 -->
      <a-form-model ref="ruleForm" :model="detail" :rules="rules" class="gift-form-wrapper">
        <div class="__hd">基本信息</div>
        <table rowKey="id" class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">出库单号</td>
            <td style="width:350px;">
              <a-form-model-item>
                <span v-if="detail.exWarehouseNo">{{ detail.exWarehouseNo }}</span>
                <span v-else style="color:#bfbfbf;">系统自动生成</span>
              </a-form-model-item>
            </td>
            <td style="width:150px;">委外加工单号</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.orderNo }}
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td>加工商名称</td>
            <td colspan="3">
              <a-form-model-item>
                {{ detail.facName }}
              </a-form-model-item>
            </td>
          </tr>
        </table>

        <div class="__hd">物料信息</div>
        <div class="__bd">
          <a-table
            rowKey="id"
            :columns="columns"
            :dataSource="detail.exWarehouseMaterialList"
            :pagination="false"
            size="small"
          >
            <div slot="order" slot-scope="text, record, index">
              {{ index + 1 }}
            </div>
            <div slot="materialCode" slot-scope="text, record, index">
              <a-form-model-item
                v-if="!isView"
                :prop="`exWarehouseMaterialList.${index}.materialCode`"
                :rules="{ required: true, message: '请选择物料' }"
              >
                <a-input
                  read-only="read-only"
                  :disabled="isView"
                  @click="openModel(record)"
                  placeholder="请选择物料代码"
                  :value="record.materialCode"
                />
              </a-form-model-item>
              <span v-else>{{ text }}</span>
            </div>
            <div slot="exWarehouseNum" slot-scope="text, record, index">
              <a-form-model-item
                v-if="!isView"
                :prop="`exWarehouseMaterialList.${index}.exWarehouseNum`"
                :rules="{ required: true, message: '请输入出库数量' }"
              >
                <a-input-number
                  :disabled="isView"
                  style="width:80px;text-align:center;"
                  :min="0"
                  :step="1"
                  :precision="0"
                  :value="record.exWarehouseNum"
                  @change="val => handleExWarehouseNumChange(index, record, val)"
                />
              </a-form-model-item>
              <span v-else>{{ record.exWarehouseNum }}</span>
            </div>

            <template slot="footer">
              <div class="totle"
                >合计:出库数量 &nbsp;{{
                  detail.exWarehouseMaterialList.reduce(
                    (adder, item) => adder + (parseFloat(item.exWarehouseNum) || 0),
                    0
                  )
                }}
              </div>
            </template>
          </a-table>
          <a-button v-if="!isView" style="width: 100%" type="dashed" icon="plus" @click="actionItem('add')"
            >添加</a-button
          >
        </div>
        <div class="__hd">备注</div>
        <a-form-model-item>
          <a-textarea
            v-if="!isView"
            class="remark"
            :disabled="isView"
            v-model="detail.remark"
            placeholder="请输入备注信息"
            :rows="4"
          />
          <span v-else>{{ detail.remark }}</span>
        </a-form-model-item>
        <div class="__hd">操作记录</div>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">提交人</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.createdName }}
              </a-form-model-item>
            </td>
            <td style="width:150px;">提交时间</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.createdTime }}
              </a-form-model-item>
            </td>
          </tr>
        </table>

        <div class="__footer">
          <a-button @click="handleSubmit('cancel')">取消</a-button>
          <a-button v-if="!isView" @click="handleSubmit('submit')" type="primary">提交</a-button>
        </div>
      </a-form-model>
      <!-- <MaterialSelect ref="materialSelect" @custom-change="handlerMaterialChange"/> -->
    </a-spin>
  </a-modal>
</template>

<script>
import { 
  materialOutDetail,//原料出库申请单-详情
materialOutAdd //原料出库申请单-新增/编辑 
} from '@/api/material'
// import MaterialSelect from './MaterialSelect'

const columns = [
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
    title: '出库数量',
    dataIndex: 'exWarehouseNum'
  },
  {
    title: '原料送取',
    dataIndex: 'providerText' //原料送取(1:委托方送货,2:加工商提货)
  }
]

export default {
  name: 'materia-apply-addForm',
  components: {
    // MaterialSelect
  },
  data() {
    return {
      columns,
      visible: false,
      spinning: false,
      detail: {
        exWarehouseMaterialList: [] //物料信息
      }, //详情记录
      type: 'view',
      rules: {
        // materialCode: [{ required: true, message: '请选择物料代码' }]
      }
    }
  },
  computed: {
    modalTitle() {
      const action = this.isView ? '查看' : this.type === 'edit' ? '编辑' : '新增'
      return `${action}-原料出库申请单`
    },
    isView() {
      return this.type === 'view'
    }
  },
  methods: {
    //选择物料代码
    openModel(record) {
      this.$refs.materialSelect.query(record)
    },
    //出库数量改变
    handleExWarehouseNumChange(index, record, val) {
      const that = this
      let exWarehouseMaterialList = [...that.detail.exWarehouseMaterialList]
      let target = exWarehouseMaterialList[index]
      target.exWarehouseNum = val
      if (+val > +record.__maxExWarehouseNum) {
        that.$message.warning(`出库数量已大于库存数量，库存数量为：${record.__maxExWarehouseNum}`)
      }
    },
    //物料信息-添加
    actionItem(type, record) {
      const that = this
      let exWarehouseMaterialList = [...that.detail.exWarehouseMaterialList]
      if (type === 'add') {
        exWarehouseMaterialList.push({
          key: that._uuid()
        })
      } else if (type === 'delete') {
        exWarehouseMaterialList = exWarehouseMaterialList.filter(item => item.key !== record.key)
      }
    },
    //type:view/del
    async query(type, record) {
      const that = this
      that.visible = true
      that.type = type
      that.detail = { ...record }
      if (type != 'add' && this.detail) {
        //原料出库申请单-查看详情
        materialOutDetail({ id: this.detail.id }).then(res => {
          let data = res.data
          that.detail = data
          that.detail.exWarehouseMaterialList = data.exWarehouseMaterialList.map(item => {
            ;(item.__maxExWarehouseNum = item.notExWarehouseNum),
              (item.attributeText = { 1: '原材料', 2: '模具' }[item.attribute] || '未知'),
              (item.providerText = { 1: '委托方送货', 2: '加工商提货' }[item.attribute] || '未知')
            return item
          })
        })
      }
    },

    // 原料选择
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

      let exWarehouseMaterialList = [...that.detail.exWarehouseMaterialList]
      let item = exWarehouseMaterialList.find(item => item.key === recordParam.key)
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
    },

    handleSubmit(type) {
      const that = this
      if (type === 'cancel') {
        that.handleCancel()
      } else if (type === 'submit') {
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            const params = {
              ...that.detail,
              exWarehouseMaterialList: that.detail.exWarehouseMaterialList.map(item => {
                item.notExWarehouseNum = (Number(item.exWarehouseNum) || 0) - (Number(item.alreadyExWarehouseNum) || 0)
                return { ...item }
              })
            }
            console.log(params)
            that.spinning = true
            materialOutAdd(params)
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
  margin-top: 5px;
}
.gift-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
.__hd {
  font-size: 16px;
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
.totle {
  margin-right: 20px;
  text-align: right;
  font-size: 16px;
}
.remark {
  border: 1px solid lightgrey;
  border-radius: 5px;
  margin-top: 5px;
}
</style>
