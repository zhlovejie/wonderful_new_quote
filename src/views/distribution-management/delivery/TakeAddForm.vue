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
      <a-form-model ref="ruleForm" :model="detail" class="gift-form-wrapper">
        <div class="__hd">基本信息</div>
        <table rowKey="id" class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">提货单号</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.pickUpNo }}
              </a-form-model-item>
            </td>
            <td style="width:150px;">委外加工单号</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.orderNo ? detail.orderNo : '未知' }}
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">加工商名称</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.facName ? detail.facName : '未知' }}
              </a-form-model-item>
            </td>
            <td style="width:150px;">我方负责人</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.headName ? detail.headName : '未知' }}
              </a-form-model-item>
            </td>
          </tr>
        </table>

        <div class="__hd">物料信息</div>
        <div class="__bd" v-if="detail.exWarehouseMaterialList">
          <a-table
            rowKey="id"
            :columns="columns"
            :dataSource="detail.pickUpMaterialList"
            :pagination="false"
            size="small"
          >
            <div slot="order" slot-scope="text, record, index">
              {{ index + 1 }}
            </div>
            <template slot="footer">
              <div class="totle">
                合计:提货数量 &nbsp;{{
                  detail.pickUpMaterialList.reduce((adder, item) => adder + (parseFloat(item.exWarehouseNum) || 0), 0)
                }}
              </div>
            </template>
          </a-table>
        </div>

        <div class="__hd">运输信息</div>
        <table class="custom-table custom-table-border">
          <tr>
            <td class="requiredMark">预计提货日期</td>
            <td>
              <a-form-model-item v-if="isView">{{ detail.pickUpTime }}</a-form-model-item>
              <a-form-model-item
                prop="pickUpTime"
                v-else
                :rules="{
                  required: true,
                  message: '请选择预计提货日期',
                  trigger: 'change'
                }"
              >
                <a-date-picker format="YYYY-MM-DD" v-model="detail.pickUpTime" style="width:100%;" />
              </a-form-model-item>
            </td>
            <td>加工商地址</td>
            <td>{{ detail.facAddress }}</td>
          </tr>
          <tr>
            <td class="requiredMark">运费结算方式</td>
            <td>
              <!-- 提货单-运费结算方式只显示到付 -->
              <a-form-model-item>
                {{ { 0: '代付', 1: '包邮', 2: '到付' }[detail.freightSettlementMethod] || '未知' }}
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td class="requiredMark">业务员</td>
            <td>
              <a-form-model-item>{{ detail.facSalemanName ? detail.facSalemanName : '未知' }}</a-form-model-item>
            </td>
            <td class="requiredMark">业务员电话</td>
            <td>
              <a-form-model-item>{{ detail.facSalemanTel ? detail.facSalemanTel : '未知' }}</a-form-model-item>
            </td>
          </tr>
        </table>

        <div class="__hd">备注</div>
        <a-form-model-item>
          <span v-if="isView">{{ detail.remark }}</span>
          <a-textarea v-else class="remark" v-model="detail.remark" placeholder="请输入备注信息" :rows="4" />
        </a-form-model-item>
        <div class="__footer">
          <a-button @click="handleSubmit('cancel')">取消</a-button>
          <a-button v-if="!isView" @click="handleSubmit('submit')" type="primary">提交</a-button>
        </div>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  materialOutDetail, //原料出库申请单-详情
  purchaseList, //提货单-根据id获取
  takeDetail, //提货单-详情
  takeAdd //提货单-新增/编辑
} from '@/api/material'
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
import moment from 'moment'

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
    title: '提货数量',
    dataIndex: 'pickUpNum'
  }
]

export default {
  name: 'Distribution_delivery_take-addForm',
  components: { CommonDictionarySelect },
  data() {
    return {
      columns,
      visible: false,
      spinning: false,
      detail: {},
      type: 'view',
      chargeList: [] //采购负责人
    }
  },
  computed: {
    modalTitle() {
      const action = this.isView ? '查看' : '新增'
      return `${action}-提货单`
    },
    isView() {
      return this.type === 'view'
    }
  },
  methods: {
    moment,
    //type:view/add
    async query(type, record) {
      const that = this
      that.visible = true
      that.type = type
      that.detail = { ...record }
      if (this.isView) {
        //提货单-查看详情
        takeDetail({ id: this.detail.id }).then(res => {
          that.detail = res.data
        })
      } else {
        //原料出库申请单-查看详情
        materialOutDetail({ id: this.detail.id, sendType: 1 }).then(res => {
          let data = res.data
          that.detail = data
          that.detail.headId = data.placeOrderUserId //采购下单人id(负责人)
          that.detail.headName = data.placeOrderUserName || '' //采购下单人名称(负责人)
          that.detail.addressNames = data.addressNames || ''
          that.detail.addressDetail = data.addressDetail || ''
          that.detail.pickUpMaterialList = data.pickUpMaterialList.map(item => {
            item.attributeText = { 1: '原材料', 2: '模具' }[item.attribute] || '未知'
            return item
          })
          if (data.placeOrderUserId) {
            that.getPurchaseList()
          }
        })
      }
    },
    //根据下单采购id获取采购人员列表
    getPurchaseList() {
      const that = this
      purchaseList({ userId: this.detail.headId }).then(res => {
        that.chargeList = res.data
      })
    },
    //操作-取消/提交
    handleSubmit(type) {
      const that = this
      if (type === 'cancel') {
        that.handleCancel()
      } else if (type === 'submit') {
        that.$refs['ruleForm'].validate(valid => {
          if (valid) {
            const {
              exWarehouseId,
              detailedAddressName,
              addressNames,
              addressDetail,
              facSalemanId,
              facSalemanName,
              facSalemanTel,
              headId,
              headName,
              remark,
              pickUpTime
            } = this.data.detail
            let params = {
              exWarehouseId, //原料出库单id
              detailedAddressName, //出发地
              facAddress: addressNames + addressDetail, //加工商地址
              facSalemanId, //业务员id
              facSalemanName, //业务员名称
              facSalemanTel, //业务员电话
              freightSettlementMethod: 2, //运费结算方式(0代付1包邮2到付) 提货单只显示到付
              headId, //我方负责人id
              headName, //我方负责人名称
              remark, //备注
              shippingMethod: 0, //发货方式(0送货上门)
              pickUpTime //提货时间
            }
            console.log(params)
            // that.spinning = true
            // takeAdd(params)
            //   .then(res => {
            //     that.spinning = false
            //     console.log(res)
            //     that.visible = false
            //     that.$message.info(res.msg)
            //   })
            //   .catch(err => {
            //     that.spinning = false
            //     that.$message.error(err.message)
            //   })
          } else {
            console.log('校验失败')
            return false
          }
        })
      }
    },
    //取消弹窗
    handleCancel() {
      const that = this
      that.$nextTick(() => {
        that.visible = false
      })
    },
    // 业务员选择
    salesmanChange(val) {
      console.log('业务员选择', val)
      // let [id,tel] = val.split(',')
      // this.detail.facSalemanTel = tel
    },
    // 我方负责人选择 {key: 532 ,label: "刘鑫"}
    onChargeChange(val) {
      console.log('我方负责人', val)
      this.detail.headId = val.key
      this.detail.headName = val.label
      console.log(this.detail)
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
  margin-bottom: 20px;
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
  margin-bottom: 10px;
}
</style>
