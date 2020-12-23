<template>
  <div>
    <a-spin :spinning="spinning">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="goBackPricing" icon="backward">返回</a-button>
      <a-button v-if="auditBoolean" class="fl-r" type="primary" @click="receiptAudit('2')" icon="check-circle">通过
      </a-button>
      <a-button
        v-if="auditBoolean"
        class="fl-r"
        type="primary"
        @click="receiptAudit('3')"
        :loading="loading"
        icon="check">不通过
      </a-button>
    </div>
    <a-card class="card" :bordered="false">

      <a-form :form="form" class="form">
        <a-form-item hidden>
          <a-input v-decorator="[ 'saleContract' ]"/>
        </a-form-item>
        <a-form-item>
          <a-row>
            <a-col class="col-border" :span="3" justify="center" align="middle">开票编号</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                placeholder="请输入开票编号"
                v-decorator="[ 'paperCode']"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">合同编号</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                placeholder="请选择合同编号"
                v-decorator="[ 'contractNum' ]"/>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row>
            <a-col class="col-border" :span="3" justify="center" align="middle">客户名称</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                v-decorator="[ 'customerName']"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">开票单位名称</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <!-- <span>江苏万德福公共设施科技有限公司</span> -->
              <a-form-item>
                <a-input class="wdf-xyk" read-only="read-only" v-decorator="[ 'openUnit']"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row>
            <a-col class="col-border" :span="3" justify="center" align="middle">发票类型</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-radio-group
                class="wdf-xyk"
                read-only="read-only"
                :disabled="queryBoolean"
                v-decorator="['paperType', {}]">
                <a-radio :value="2">增票</a-radio>
                <a-radio :value="1">普票</a-radio>
              </a-radio-group>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">开票性质</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-radio-group
                class="wdf-xyk"
                read-only="read-only"
                :disabled="queryBoolean"
                v-decorator="['paperQuality', {}]">
                <a-radio :value="1">常规开票</a-radio>
                <a-radio :value="2">特殊开票</a-radio>
              </a-radio-group>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row>
            <a-col class="col-border" :span="3" justify="center" align="middle">开户行及账号</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                v-decorator="[ 'openingBank']"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">纳税人识别号</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                v-decorator="[ 'dutyParagraph' ]"/>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row>
            <a-col class="col-border" :span="3" justify="center" align="middle">客户地址</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                v-decorator="[ 'address']"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">联系电话</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                v-decorator="[ 'mobile']"/>
            </a-col>
          </a-row>
        </a-form-item>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          :loading="memberLoading"
          bordered
        >
          <div slot="company" slot-scope="text">
            <span v-if="text==0">套</span>
          </div>
        </a-table>
        <a-form-item>
          <a-row>
            <a-col class="col-border" :span="3" justify="center" align="middle">实际发货日期</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                v-decorator="[ 'deliveryTime']"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">开票金额(元)</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                v-decorator="[ 'paperMoney' ]"/>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row>
            <a-col class="col-border" :span="3" justify="center" align="middle">回款情况</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-radio-group
                class="wdf-xyk"
                read-only="read-only"
                :disabled="queryBoolean"
                v-decorator="['paperDetail', {}]">
                <a-radio :value="1">部分付款</a-radio>
                <a-radio :value="2">已付全款</a-radio>
                <a-radio :value="3">未付款</a-radio>
              </a-radio-group>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">总金额(元)</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                v-decorator="[ 'totalAmount']"/>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row>
            <a-col class="col-border" :span="3" justify="center" align="middle">已回款金额(元)</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"
                disabled
                v-decorator="[ 'refundMoney']"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">欠款金额(元)</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                v-decorator="[ 'arrearsMoney' ]"/>
            </a-col>
          </a-row>
        </a-form-item>

        <a-row type="flex" style="border-bottom: 1px solid #ddd">
            <a-col class="col-border" :span="3" justify="center" align="middle">备注</a-col>
            <a-col class="col-border" :span="21" justify="center" align="middle">
              <a-form-item>
                <a-textarea
                  placeholder="备注"
                  read-only="read-only"
                  :rows="3"
                  v-decorator="['remark', { rules: [{ required: false, message: '请输入备注' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>

        <a-form-item style="border-bottom: 1px solid #ddd">
          <a-row>
            <a-col class="col-border" :span="3" justify="center" align="middle">创建人</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                placeholder="创建人"
                v-decorator="[ 'createdName']"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">创建日期</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                placeholder="创建日期"
                v-decorator="[ 'createdTime' ]"/>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item v-if="approveVueBoolean" >
          <a-row class="wdf-row">
            <a-col class="col-border" :span="3" justify="center" align="middle">审批人</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                v-decorator="[ 'approveName' ]"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">审批日期</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                v-decorator="[ 'approveTime' ]"/>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
      <a-modal
        title="不通过"
        @ok="handleOk"
        @cancel="handleCancelTwo"
        :confirmLoading="confirmLoadingTwo"
        :maskClosable="false"
        v-model="visibleTwo">
        <span :spinning="confirmLoadingTwo">
          <a-form :form="form2" class="form">
            <a-col>
              <a-form-item
                label="驳回原因">
                <a-input
                  placeholder="驳回原因"
                  v-decorator="[ 'rejected', {rules: [{ required: true,message: '请输入驳回原因'}]} ]"/>
              </a-form-item>
            </a-col>
          </a-form>
        </span>
      </a-modal>
    </a-card>
    </a-spin>
  </div>
</template>

<script>

import { openPaperAudit, openPaperDetail } from '@/api/openpaper'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import ARow from 'ant-design-vue/es/grid/Row'

const data = []
export default {
  name: 'SoftwareOpenPaperView',
  components: {
    ARow,
    AFormItem
  },
  data () {
    return {
      form: this.$form.createForm(this),
      form2: this.$form.createForm(this),
      memberLoading: false,
      loading: false,
      queryBoolean: true,
      paperDetail: 0,
      paperQuality: 0,
      confirmLoadingTwo: false,
      auditBoolean: false,
      paperType: 0,
      visibleTwo: false,
      approveVueBoolean: false,
      id: 0,
      columns: [
        {
          title: '产品名称',
          dataIndex: 'productName'
        },
        {
          title: '单位',
          dataIndex: 'company',
          scopedSlots: { customRender: 'company' }
        }, 
        {
          title: '数量',
          dataIndex: 'count'
        }, 
        {
          title: '含税单价',
          dataIndex: 'unitPrice'
        }, 
        {
          title: '含税金额(元)',
          dataIndex: 'receivable'
        }
      ],
      dataSource: [],
      spinning:false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const params = { 'id': this.$route.params.id }
      this.auditBoolean = this.$route.params.auditBoolean
      this.id = this.$route.params.id
      const cType = 0
      this.spinning = true
      openPaperDetail(params).then((res) => {
        this.spinning = false
        if (res.code === 200) {
          const record = {
            'paperCode': res.data.paperCode,
            'contractNum': res.data.softwareContract.contractNum,
            'customerName': res.data.softwareContract.customerName,
            'contractId': res.data.softwareContract.id,
            'totalAmount': res.data.softwareContract.totalAmount,
            'dutyParagraph': res.data.taxPayerNo,
            'openingBank': res.data.bankNoAccount,
            'mobile': res.data.customerTel,
            'address': res.data.customerAddress,
            'refundMoney': res.data.softwareContract.returnedMoney,
            'paperMoney': res.data.paperMoney,
            'arrearsMoney': res.data.arrearsMoney,
            'deliveryTime': res.data.deliveryTime.substring(0, 10),
            'paperDetail': res.data.paperDetail,
            'paperQuality': res.data.paperQuality,
            'paperType': res.data.paperType,
            'approveName': res.data.approveName,
            'createdTime': res.data.createdTime,
            'createdName': res.data.createdName,
            'approveTime': res.data.approveTime,
            openUnit:res.data.openUnit || '',
            remark:res.data.remark || ''
          }
          if (res.data.approveName != undefined && res.data.approveTime != undefined) {
            this.approveVueBoolean = true
          }
          this.$nextTick(() => {
            this.form.setFieldsValue({ ...record })
          }) 
          const listProduct = []
          for (const productKey in res.data.softwareContract.products) {
            const product = res.data.softwareContract.products[productKey]
            listProduct.push({
              'id': product.id,
              'productName':product.productName,
              'receivable': (product.count * product.unitPrice).toFixed(2),
              'company': 0,
              'count': product.count,
              'unitPrice': product.unitPrice
            })
          }
          console.log('listProduct :', listProduct)
          this.dataSource = listProduct
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => this.spinning = false)
    },
    // 返回
    goBackPricing () {
      // 点击返回，返回列表页
      this.$router.push({ name: 'openPaperList' })
      this.$destroy('softwareOpenPaperView')
    },
    receiptAudit (type) {
      if (type == 3) {
        this.visibleTwo = true
        return
      }
      const paramer = {
        'id': this.id,
        'paperStatue': type
      }
      openPaperAudit(paramer).then((res) => {
        if (res.code == 200) {
          this.goBackPricing()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleCancelTwo (e) {
      this.form2.resetFields() // 清空表
    },
    handleOk () { // 提交驳回原因
      this.form2.validateFields((err, values) => {
        if (!err) {
          console.log('noerr====')
          const paramer = {
            'id': this.id,
            'paperStatue': 3,
            'rejected': values.rejected
          }
          openPaperAudit(paramer).then((res) => {
            if (res.code == 200) {
              this.goBackPricing()
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .top-right {
    margin-bottom: 12px;
    margin-right: 6px;
  }

  .clearfix:after {
    display: block;
    content: '';
    width: 100%;
    height: 0;
    clear: both;
  }

  .clearfix {
    zoom: 1;
  }

  .fl-r {
    float: right;
    margin-left: 8px;
  }

  .wdf-row {
    border: 1px solid #ddd;
  }

  .col-border {
    border: 1px solid #ddd;
    padding: 10px 0;
    border-bottom: none;
  }

  .col-border ~ .col-border {
    border-left: none;
  }

  .wdf-form {
    margin-top: 12px;
    padding: 12px;
  }

  .ant-row.ant-form-item {
    margin-bottom: 0;
  }

  .wdf-xyk {
    width: 50%;
  }

</style>
