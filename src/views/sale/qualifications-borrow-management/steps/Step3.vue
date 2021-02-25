<template>
  <div style="margin-top: 20px">
      <h3>基本信息</h3>
      <table class="custom-table custom-table-border">
        <tr>
          <td>销售人员</td>
          <td>
            <span>{{ record.salesmanName }}</span>
          </td>
          <td>客户名称</td>
          <td>
            <span>{{ record.customerName }}</span>
          </td>
        </tr>
        <tr>
          <td>微信号</td>
          <td>
            <span>{{ record.wxNum }}</span>
          </td>
          <td>邮箱</td>
          <td>
            <span>{{ record.email }}</span>
          </td>
        </tr>
      </table>
    <template v-if="isView">
      <h3 style="margin-top: 10px">合同信息</h3>
      <table class="custom-table custom-table-border">
        <tr>
          <td>
            <a href="javascript:void(0);"  @click="doAction">预览合同</a>
          </td>
        </tr>
      </table>
    </template>
    <template v-if="isAdd">
      <div style="margin-top:10px;">
        <a-button type="primary" @click="doAction">新增代签购货合同</a-button>
      </div>
    </template>
    <a-modal
      title="预览合同"
      :width="1200"
      :visible="visible"
      :footer="null"
      @cancel="handleCancel"
    >
      <PreviewContractBehalf :contractId="purchaseContractDetailVo.id"/>
    </a-modal>
  </div>
</template>

<script>
//3 代签购物合同的详情 purchaseContractId
import { getPurchaseContractDetailByBorrowId } from '@/api/contractListManagement'
import PreviewContractBehalf from '../contractView/previewContractBehalf'
export default {
  name: 'step3',
  props: {
    actionType: String,
    record: Object,
  },
  components:{
    PreviewContractBehalf
  },
  data() {
    return {
      purchaseContractDetailVo:{},
      purchaseContractProductDetailVoList:{},
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
    }
  },
  methods: {
    async init() {
      const that = this
      if (that.isView) {
        let res = await getPurchaseContractDetailByBorrowId({ id: that.record.id }).then((res) => res.data)
        that.purchaseContractDetailVo = res.purchaseContractDetailVo
        that.purchaseContractProductDetailVoList = res.purchaseContractProductDetailVoList
      }else{
        that.purchaseContractDetailVo = {}
        that.purchaseContractProductDetailVoList = {}
      }
    },
    async doAction() {
      const that = this
      let _actionType = that.actionType === 'view' ? 'see' : 'add'
      let contactId = null,res = null
      if (_actionType === 'see') {
        try {
          res = await getPurchaseContractDetailByBorrowId({ id: that.record.id }).then((res) => res)
          contactId = res.data.id
        } catch (err) {
          contactId = null
        }
        if (!contactId) {
          that.$message.info(
            `获取合同编号失败，请联系管理员! 错误信息：getPurchaseContractDetailByBorrowId({id:${that.record.id}}) 返回：${res}`
          )
          return
        }
        that.visible = true
        // that.$router.push({
        //   name: 'previewTripartiteContracts',
        //   params: { 
        //     queryOneData: { id: contactId }, 
        //     action: 'edit', 
        //     from: 'qualifications-borrow-management-list' ,
        //     _viewPos:{
        //       step:2,
        //       type:'view',
        //       record:{...that.record}
        //     }
        //   }
        // })
      } else {
        that.$router.push({
          name: 'basicInformation2',
          params: {
            id: contactId,
            borrowId: that.record.id,
            action: _actionType,
            from: 'qualifications-borrow-management-list',
            fillData: {
              salesmanName: that.record.salesmanName,
              userId: that.record.userId,
              customerName: that.record.customerName,
              customerId: that.record.customerId,
              wxNum: that.record.wxNum,
              email: that.record.email,
            },
          },
        })
      }
    },
    finish() {
      console.log('over...')
    },
    handleCancel(){
      this.visible = false
    }
  }
}
</script>