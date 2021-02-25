<template>
  <div style="margin-top: 20px">
    <h3>基本信息</h3>
    <table class="custom-table custom-table-border">
      <tr>
        <td style="width: 15%">销售人员</td>
        <td style="width: 35%">{{ record.salesmanName }}</td>
        <td style="width: 15%">客户名称</td>
        <td style="width: 35%">{{ record.customerName }}</td>
      </tr>
      <tr>
        <td>微信号</td>
        <td>{{ record.wxNum }}</td>
        <td>邮箱</td>
        <td>{{ record.email }}</td>
      </tr>
    </table>
    <h3 style="margin-top: 10px">合同信息</h3>
    <template v-if="isAdd">
      <table class="custom-table custom-table-border">
        <tr>
          <td style="width: 15%">选择绑定合同</td>
          <td colspan="3">
            <!-- <a-input
              style="width:80%;"
              readonly="readonly"
              v-model="contractText"
              placeholder="请选择合同"
              @click="openModel"
            /> -->
            <a-button v-if="!contractId" style="width: 80%" @click="openModel">选择合同</a-button>
            <div v-if="contractText">
              <span>{{ contractText }}</span>
              <div style="margin-top: 10px">
                <a-button size="small" style="margin: 0 10px" @click="contractDel">清除</a-button>
                <a-button size="small" @click="contractView">预览</a-button>
              </div>
            </div>
          </td>
        </tr>
      </table>
      <p style="text-align: center">
        <!-- <a-button @click="doAction('cancel')">取消</a-button> -->
        <a-button type="primary" @click="doAction('save')">绑定销售合同</a-button>
      </p>
      <ContractSelect ref="contractSelect" @change="contractChange" />
    </template>
    <template v-else>
      <table class="custom-table custom-table-border">
        <tr>
          <td>
            <a href="javascript:void(0);" @click="contractView">预览合同</a>
          </td>
        </tr>
      </table>
    </template>

    <a-modal
      title="预览合同"
      :width="1200"
      :visible="visible"
      :footer="null"
      @cancel="handleCancel"
    >
      <component 
        :is="currentComponent" 
        ref="currentComponent" 
        :contractId="contractId"
      />
    </a-modal>

    

  </div>
</template>

<script>
import ContractSelect from './ContractSelect'
import { getQueryOne ,saleContractDetailForBorrow} from '@/api/contractListManagement'
import { borrowBindingSaleContract } from '@/api/qualificationsBorrowManagement'

import PreviewProductOrderForm from '../contractView/previewProductOrderForm'
import PreviewSalesContract from '../contractView/previewSalesContract'
import PreviewTripartiteContract from '../contractView/previewTripartiteContract'

const _COMPOENTS_ = {
  previewProductOrderForm:PreviewProductOrderForm,
  previewSalesContract:PreviewSalesContract,
  previewTripartiteContract:PreviewTripartiteContract
}
export default {
  name: 'step4',
  props: {
    actionType: String,
    record: Object,
  },
  components: {
    ContractSelect
  },
  data() {
    return {
      contractId: undefined,
      contractText: undefined,
      currentComponent:null,
      visible:false
    }
  },
  computed: {
    isView() {
      return this.actionType === 'view' || this.actionType === 'see'
    },
    isAdd() {
      return this.actionType === 'add' || this.actionType === 'do'
    },
  },
  created() {
    this.init()
  },
  watch: {
    actionType() {
      this.init()
    },
  },
  methods: {
    async init() {
      const that = this
      if(that.isView){
        await saleContractDetailForBorrow({borrowId:that.record.id}).then(res =>{
          console.log(res)
          that.contractId = res.data.id
        })
      }
    },
    openModel() {
      let {userId,customerName,customerId} = this.record
      this.$refs.contractSelect.query({
        //customerName:customerName,
        saleUserId:userId,
        customerId,
        status:0,
        approveStatus:2,
        contractStatus:1
      })
    },
    contractChange(record) {
      //debugger
      this.contractId = record.id
      this.contractText = `编号：【${record.contractNum}】  销售经理：【${record.saleUser.trueName}】  客户名称：【${record.customerName}】`
    },
    finish() {
      console.log('over...')
    },
    doAction(type) {
      const that = this
      if (type === 'save') {
        if (!that.contractId) {
          that.$message.info('您还没有选择合同')
          return
        }
        /**
         * {
          contractId: that.contractId,
          borrowId:that.record.id
        }
         */
        borrowBindingSaleContract(`contractId=${that.contractId}&borrowId=${that.record.id}`).then((res) => {
          console.log(res)
          that.$message.info(res.msg)
          if (+res.code === 200) {
            that.$emit('end', 4)
          }
        })
        return
      } else if (type === 'cancel') {
        return
      }
    },
    async contractView() {
      const that = this
      let res = await getQueryOne({ id: that.contractId }).then((res) => res.data)
      //console.log(res)
      let routerName =
        res.contractAttribute === 1
          ? 'previewTripartiteContract'
          : (res.isTax === 1 ? 'previewSalesContract' : 'previewProductOrderForm')
      console.log(routerName)
      that.currentComponent = _COMPOENTS_[routerName]
      that.visible = true
      // that.$router.push({
      //   name: routerName,
      //   params: { 
      //     queryOneData: { ...res }, 
      //     action: 'edit', 
      //     from: 'qualifications-borrow-management-list',
      //     _viewPos:{
      //       step:3,
      //       type:'view',
      //       record:{...that.record},
      //       others:{
      //         contractId: that.contractId,
      //         contractText: that.contractText
      //       }
      //     }
      //   }
      // })
    },
    contractDel() {
      this.contractId = undefined
      this.contractText = undefined
    },
    handleCancel(){
      this.visible = false
    }
  }
}
</script>