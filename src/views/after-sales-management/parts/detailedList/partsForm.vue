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
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <!-- <template v-if="!isVeiw"> -->
        <a-button v-if="details.formKey === '3'" key="submit1" type="primary" @click="handleOk()">完结</a-button>
        <a-button v-if="details.formKey === '1'" key="submit1" type="primary" @click="handleOk()">确定</a-button>
        <!-- <a-popconfirm v-else-if="details.formKey === '1'" title="确认是否愿意担保吗?" @confirm="() => handleOk()">
            <a-button key="submit" type="primary">确定</a-button>
          </a-popconfirm> -->
        <!-- </template> -->
        <a-button v-else key="submit1" type="primary" @click="handleOk()">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form-model ref="ruleForm" :model="form" class="routine-addform-wrapper-baseInnerData">
        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td>任务单编号</td>
            <td>{{ record.taskDocumentNum }}</td>
            <td>客户名称</td>
            <td>{{ record.customerName }}</td>
          </tr>
          <tr>
            <td>产品名称</td>
            <td>
              {{ form.deviceInfoName }}
            </td>
            <td>主板号</td>
            <td>{{ form.mainBoardNo }}</td>
          </tr>
        </table>
        <div style="margin-top: 20px">
          <h3>
            配件清单
            <a-switch
              style="margin-left: 20px"
              disabled
              checked-children="开票"
              un-checked-children="不开票"
              default-checked
              v-model="isTax"
              @change="onChange"
            />
          </h3>
          <a-table
            :columns="travelColumns"
            :dataSource="form.productInfoList"
            :pagination="false"
            bordered
            size="small"
          >
            <div slot="order" slot-scope="text, record, index">
              {{ index + 1 }}
            </div>

            <div slot="money" slot-scope="text, record, index">
              {{ record.isWarranty === 0 ? '0' : record.quantity * record.unitPrice }}
            </div>

            <div slot="deliveryMode" slot-scope="text, record, index">
              {{ { 0: '自带', 1: '邮寄' }[record.deliveryMode] || '未知' }}
            </div>
            <div slot="isWarranty" slot-scope="text, record, index">
              <span v-if="record.isWarranty === 0">否</span>
              <span v-if="record.isWarranty === 1" style="color: red">是</span>
            </div>
            <div slot="footer" slot-scope="text, record, index">
              <div style="text-align: right; font-size: 16px; color: red">
                <span>数量合计：{{ totalPrice }}</span>
                <span style="margin: 0 10px">单价合计：{{ totalPhase | moneyFormatNumber }}</span>
                <span>金额合计：{{ details.totalAmount | moneyFormatNumber }}</span>
              </div>
            </div>
          </a-table>
          <!-- <a-button style="width: 100%" type="dashed" icon="plus" @click="doAction('add-travelRecord')">
            添加
          </a-button> -->
        </div>
        <div v-if="addressee" style="margin-top: 20px">
          <h3>收件人信息</h3>
          <table class="custom-table custom-table-border">
            <tr>
              <td>收件人姓名</td>
              <td>{{ form.mailRecord.recipientName }}</td>
              <td>联系电话</td>
              <td>{{ form.mailRecord.contactNumber }}</td>
            </tr>
            <tr>
              <td>单位名称</td>
              <td>
                {{ form.mailRecord.unitName }}
              </td>
              <td>收件省市区</td>
              <td>{{ form.mailRecord.provinceName }}</td>
            </tr>
            <tr>
              <td>详细地址</td>
              <td>
                {{ form.mailRecord.address }}
              </td>
              <td>付款方式</td>
              <td>{{ form.mailRecord.paymentMailType === 0 ? '包邮' : '到付' }}</td>
            </tr>
            <tr>
              <td>物流名称</td>
              <td colspan="3">{{ form.mailRecord.logisticsName }}</td>
            </tr>
          </table>
        </div>
        <h3>付款方式</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td>付款方式</td>
            <td v-if="details.formKey === '4'">先付款</td>
            <td v-else>
              {{
                form.paymentType === 0
                  ? '完结付款'
                  : form.paymentType === 1
                  ? '先付款'
                  : form.paymentType === 2
                  ? '免付款'
                  : '赠送'
              }}
            </td>
          </tr>
          <tr v-if="form.paymentType === 0 || form.paymentType === 1">
            <td>付款形式</td>
            <td>
              {{ form.paymentForm === 0 ? '付款码' : '公户打款' }}
            </td>
          </tr>

          <tr v-if="form.paymentType === 0 || form.paymentType === 3">
            <td>处理人</td>
            <td>{{ form.handlerUser.split(',')[1] }}</td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              {{ form.remark }}
            </td>
          </tr>
          <tr
            v-if="
              (form.paymentType === 3 || form.paymentType === 0) &&
              (details.formKey === '1' || details.handlerResult === 0 || details.handlerResult === 1)
            "
          >
            <td>是否愿意担保</td>
            <td>
              <a-switch
                style="margin-left: 20px"
                checked-children="同意"
                un-checked-children="不同意"
                :disabled="isDisabled || details.formKey !== '1'"
                default-checked
                v-model="isAdopt"
                @change="onChangeagree"
              />
            </td>
          </tr>
        </table>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { approvalAccessoriesManagement, accessoriesManagementDetail } from '@/api/after-sales-management' //机构名称
import { listUserBySale } from '@/api/systemSetting' //销售人员
import { getAreaByParent } from '@/api/common'
export default {
  name: 'BecomingForm',
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 },
      opinionData: [],
      details: {},
      birthplaceOptions: [], //籍贯 级联 省市
      personincharge: [], //销售负责人
      labelName: undefined,
      isAdopt: false,
      isTax: true,
      form: {
        productInfoList: [],
        deviceInfoId: undefined,
        mainBoardNo: undefined,
        paymentType: undefined,
        handlerUser: undefined,
        isTax: 0,
        remark: undefined,
        mailRecord: {
          recipientName: undefined,
          contactNumber: undefined,
          unitName: undefined,
          address: undefined,
          logisticsName: undefined,
          province: undefined,
        },
      },
      isWarranty: undefined,
      record: {},
      mobile: '',
      options: [],
      recordDetails: {},
      visible: false,
      spinning: false,
      type: 'add',
      userInfo: this.$store.getters.userInfo,
    }
  },
  computed: {
    modalTitle() {
      let txt = this.isAdd ? '新增' : this.isVeiw ? '详情' : '修改'
      return `${txt}`
    },
    isAdd() {
      return this.type === 'add'
    },
    isVeiw() {
      return this.type === 'veiw'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit'
    },
    isDisabled() {
      return this.isVeiw
    },
    addressee() {
      return this.form.productInfoList.some((i) => i.deliveryMode === 1)
    },
    totalPrice() {
      return this.form.productInfoList.reduce((addr, item) => {
        addr = Number(addr) + Number(item.quantity)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },
    totalPhase() {
      return this.form.productInfoList.reduce((addr, item) => {
        addr = Number(addr) + Number(item.unitPrice || 0)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },
    // totalPhase1() {
    //   return this.form.productInfoList.reduce((addr, item) => {
    //     addr = Number(addr) + Number(item.money || 0)
    //     return parseFloat(addr).toFixed(2)
    //   }, 0)
    // },
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
          width: 150,
        },
        {
          title: '物料名称',
          dataIndex: 'materialName',
          width: 100,
        },
        {
          title: '规格型号',
          dataIndex: 'specification',
          width: 100,
        },
        {
          title: '单位',
          dataIndex: 'company',
        },
        {
          title: '数量',
          dataIndex: 'quantity',
        },
        {
          title: '单价（元）',
          dataIndex: 'unitPrice',
          width: 150,
        },
        {
          title: '金额（元）',
          dataIndex: 'money',
          scopedSlots: { customRender: 'money' },
        },
        {
          title: '是否过保',
          scopedSlots: { customRender: 'isWarranty' },
          width: 150,
        },
        {
          title: '带货方式',
          scopedSlots: { customRender: 'deliveryMode' },
          width: 150,
        },
      ]
      return baseColumns
    },
  },

  created() {},
  methods: {
    onChangeagree(checked) {
      this.form.isAdopt = checked ? 0 : 1
    },
    onChange(checked) {
      this.form.isTax = checked ? 0 : 1
    },
    query(type, record) {
      this.visible = true
      this.form = {
        productInfoList: [],
        deviceInfoId: undefined,
        mainBoardNo: undefined,
        paymentType: undefined,
        handlerUser: undefined,
        isTax: 0,
        remark: undefined,
        mailRecord: {
          recipientName: undefined,
          contactNumber: undefined,
          unitName: undefined,
          address: undefined,
          logisticsName: undefined,
          province: undefined,
        },
      }
      this.type = type
      this.record = record
      this.form.handlerUser = record.saleUserId
      if (type !== 'add') {
        accessoriesManagementDetail({ id: record.id }).then((res) => {
          this.details = res.data
          this.form = { ...this.form, ...res.data }
          this.isTax = res.data.isTax === 0 ? true : false
          this.isAdopt = res.data.handlerResult === 1 || res.data.handlerResult === null ? false : true
          // this.form.mailRecord = res.data.mailRecord
        })
      }
    },
    handleOk() {
      console.log('你是要提交')
      let that = this
      if (this.isVeiw) {
        return (that.visible = false)
      }
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let ret = {}
          const params = that.$_.cloneDeep(that.form || {})
          if (params.paymentType === 0 || params.paymentType === 3) {
            ret.isAdopt = this.isAdopt === true ? 0 : 1
          } else {
            ret.isAdopt = 0
          }
          if (this.details.formKey === '4') {
            ret.attachId = 1
          }

          ret.approveId = this.record.id
          approvalAccessoriesManagement(ret)
            .then((res) => {
              if (res.code === 200) {
                that.spinning = false
                that.visible = false
                that.$message.info(res.msg)
                that.$emit('filet')
              }
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
}
</script>
<style scoped>
/*自定义table样式*/
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
.becoming-form-wrapper >>> .ant-form-item {
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