<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit('submit')"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
    :footer="null"
    :forceRender="true"
  >
    <!-- a-spin:loading 状态, spinning:是否为加载中状态 -->
    <a-spin :spinning="spinning">
      <!-- a-form-model:使用:model 来绑定整个表单的数据，使用:rules来绑定整个表单的校验 -->
      <a-form-model ref="ruleForm" :model="detail" class="gift-form-wrapper">
        <div class="__hd">基本信息</div>
        <table rowKey="id" class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">出库单号</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.exWarehouseNo ? detail.exWarehouseNo : '' }}
              </a-form-model-item>
            </td>
            <td style="width:150px;">委外加工单号</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.orderNo ? detail.orderNo : '' }}
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">加工商名称</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.facName ? detail.facName : '' }}
              </a-form-model-item>
            </td>
            <td style="width:150px;">原料送取</td>
            <td style="width:350px;">
              <a-form-model-item>
                委托方送货
              </a-form-model-item>
            </td>
          </tr>
        </table>

        <div class="__hd">物料信息</div>
        <div class="__bd" v-if="detail.exWarehouseMaterialList">
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
            <template slot="footer">
              <div class="totle">
                合计:派送数量 &nbsp;{{
                  detail.exWarehouseMaterialList.reduce(
                    (adder, item) => adder + (parseFloat(item.exWarehouseNum) || 0),
                    0
                  )
                }}
              </div>
            </template>
          </a-table>
        </div>

        <div class="__hd">运输信息</div>
        <table class="custom-table custom-table-border">
          <tr>
            <td class="requiredMark">出发地</td>
            <td style="width:350px;">
              <a-form-model-item v-if="isView">
                {{ detail.detailedAddressName }}
              </a-form-model-item>
              <a-form-model-item
                v-else
                :prop="'detailedAddressName'"
                :rules="{
                  required: true,
                  message: '请选择出发地址'
                }"
              >
                <CommonDictionarySelect
                  style="width:350px;"
                  placeholder="出发地址"
                  :text="'物流配置'"
                  :dictionaryId.sync="detail.detailedAddressName"
                  @selected="handlerAddressChange"
                />
              </a-form-model-item>
            </td>
            <td>目的地</td>
            <td v-if="isView">{{ detail.facAddress ? detail.facAddress : '' }}</td>
            <td v-else>{{ (detail.addressNames + '' + detail.addressDetail).replace(new RegExp(',', 'g'), '') }}</td>
          </tr>
          <tr>
            <td class="requiredMark">运费结算方式</td>
            <td>
              <a-form-model-item v-if="isView">
                {{ { 0: '代付', 1: '包邮', 2: '到付' }[detail.freightSettlementMethod] || '未知' }}
              </a-form-model-item>
              <a-form-model-item
                v-else
                prop="freightSettlementMethod"
                :rules="{
                  required: true,
                  message: '请选择运费结算方式'
                }"
              >
                <a-select v-model="detail.freightSettlementMethod" placeholder="请选择运费结算方式">
                  <a-select-option :value="0">代付</a-select-option>
                  <a-select-option :value="1">包邮</a-select-option>
                  <a-select-option :value="2">到付</a-select-option>
                </a-select>
              </a-form-model-item>
            </td>
            <td class="requiredMark">发货方式</td>
            <td>
              <a-form-model-item>
                送货上门
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td class="requiredMark">我方负责人</td>
            <td>
              <a-form-model-item v-if="isView">{{ detail.headName }}</a-form-model-item>
              <a-form-model-item
                v-else
                :prop="'headName'"
                :rules="{
                  required: true,
                  message: '请选择采购负责人'
                }"
              >
                <a-select placeholder="请选择采购负责人" label-in-value @change="onChargeChange">
                  <a-select-option v-for="item in chargeList" :key="item.id" :value="item.id">{{
                    item.trueName
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </td>
            <td class="requiredMark">预计派送日期</td>
            <td>
              <a-form-model-item v-if="isView">
                {{ detail.deliveryTime }}
              </a-form-model-item>
              <a-form-model-item
                v-else
                prop="deliveryTime"
                :rules="{
                  required: true,
                  message: '请选择预计派送日期',
                  trigger: 'change'
                }"
              >
                <a-date-picker
                  format="YYYY-MM-DD"
                  v-model="detail.deliveryTime"
                  style="width:100%;text-align:center;"
                />
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td>业务员</td>
            <td>
              <a-form-model-item v-if="isView">
                {{ detail.facSalemanName ? detail.facSalemanName : '' }}
              </a-form-model-item>
              <a-form-model-item
                v-else
                :prop="'facSalemanName'"
                :rules="{
                  required: true,
                  message: '请选择加工商业务员'
                }"
              >
                <a-select v-model="detail.facSalemanName" @change="salesmanChange" placeholder="请选择业务员">
                  <a-select-option v-for="(item, index) in detail.facInfoSalemanList" :key="item.id" :value="index">{{
                    item.name
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </td>
            <td>业务员电话</td>
            <td>
              <a-form-model-item>
                {{ detail.facSalemanTel ? detail.facSalemanTel : '' }}
              </a-form-model-item>
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
  purchaseList, //派送单-根据id获取
  giveDetail, //派送单-详情
  giveAdd //派送单-新增/编辑
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
    title: '派送数量',
    dataIndex: 'exWarehouseNum'
  }
]

export default {
  name: 'Distribution_delivery_give_addForm',
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
      return `${action}-派送单`
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
        //派送单-查看详情
        giveDetail({ id: this.detail.id }).then(res => {
          if (res.code === 200) {
            that.detail = res.data
          } else {
            that.$message.error(res.msg)
          }
        })
      } else {
        //原料出库申请单-查看详情 派送仅展示委托方送货的 sendType参数吧 传1委托方送货 2加工商提货
        materialOutDetail({ id: this.detail.id, sendType: 1 }).then(res => {
          if (res.code === 200) {
            const data = res.data
            that.detail = data
            that.detail.headId = data.placeOrderUserId //采购下单人id(负责人)
            that.detail.headName = data.placeOrderUserName || '' //采购下单人名称(负责人)
            that.detail.addressNames = data.addressNames || ''
            that.detail.addressDetail = data.addressDetail || ''
            // that.detail.deliveryTime = moment().format("YYYY-MM-DD")//年月日 默认当天日期
            that.detail.exWarehouseMaterialList = data.exWarehouseMaterialList.map(item => {
              item.attributeText = { 1: '原材料', 2: '模具' }[item.attribute] || '未知'
              return item
            })
            if (data.placeOrderUserId) {
              that.getPurchaseList()
            }
          } else {
            that.$message.error(res.msg)
          }
        })
      }
    },
    //根据下单采购id获取采购人员列表
    getPurchaseList() {
      const that = this
      purchaseList({ userId: this.detail.headId }).then(res => {
        if (res.code === 200) {
          that.chargeList = res.data
        } else {
          that.$message.error(res.msg)
        }
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
            console.log('校验成功')
            const {
              id,
              exWarehouseNo,
              facId,
              orderNo,
              orderId,
              detailedAddressName,
              addressNames,
              addressDetail,
              facSalemanId,
              facSalemanName,
              facSalemanTel,
              headId,
              headName,
              remark,
              freightSettlementMethod,
              deliveryTime
            } = that.detail
            const params = {
              exWarehouseId: id, //原料出库单id
              exWarehouseNo,
              facId,
              orderNo,
              orderId,
              detailedAddressName, //出发地
              facAddress: (addressNames + addressDetail).replace(new RegExp(',', 'g'), ''), //加工商地址
              facSalemanId, //业务员id
              facSalemanName, //业务员名称
              facSalemanTel, //业务员电话
              freightSettlementMethod, //运费结算方式(0代付1包邮2到付)
              headId, //我方负责人id
              headName, //我方负责人名称
              remark, //备注
              shippingMethod: 0, //发货方式(0送货上门)
              deliveryTime: moment(deliveryTime).format('YYYY-MM-DD') //发货时间
            }
            console.log(params)
            that.spinning = true
            giveAdd(params)
              .then(res => {
                that.spinning = false
                that.$message.error(res.msg)
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
      const salemanList = this.detail.facInfoSalemanList || []
      if (val < salemanList.length) {
        const selItem = salemanList[val]
        this.detail.facSalemanName = selItem.name
        this.detail.facSalemanId = selItem.id
        this.detail.facSalemanTel = selItem.tel
      }
    },
    // 我方负责人选择 {key: 532 ,label: "刘鑫"}
    onChargeChange(val) {
      console.log('我方负责人', val)
      this.detail.headId = val.key
      this.detail.headName = val.label
      console.log(this.detail)
    },
    //出发地选择变更
    handlerAddressChange(record) {
      this.detail = {
        ...this.detail,
        detailedAddressName: record.text
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
