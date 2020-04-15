<template>
  <div class="content-wrap">
    <a-row>
      <a-col :span="24" class="basic-tit" justify="center" align="middle">产品信息</a-col>
    </a-row>
    <div class="form wdf-form">
      <ProductCommon ref="productCommon" :params="productCommonParams"></ProductCommon>
    </div>
    <div class="btns-grop">
      <a-button style="margin-left:8px;" @click="prevStep">上一步</a-button>
      <a-button type="primary" @click="nextStep">下一步</a-button>
    </div>
  </div>
</template>

<script>
import {
  getSoftwareContractQueryOne,
  saveSoftwareContractProduct,
  getSoftwareProductVersions 
} from '@/api/contractListManagement'
import { getDictionary} from '@/api/common'
import moment from 'moment'
import ProductCommon from './ProductCommon'

  export default {
    name: 'Step2',
    components:{ProductCommon},
    props: {
      queryonedata: {
        type: Object,
        default:function(){
          return {}
        }
      }
    },
    data() {
      return {
        productCommonParams:{
          dataSource:[],
          totalAmount:0,
          chineseTotalAmount:'零',
          isTax:false,
          __fromAction:'add'
        }
      }
  },
  computed: {

  },
  watch: {
    $route (to, from) {}
  },
  beforeCreate(){},
  mounted () {

    this.init()
  },
  methods: {
    async init () {
      let that = this
      let product = []
      if(this.queryonedata && this.queryonedata.id){
        //正常流程
          let result = await getSoftwareContractQueryOne({ id: this.queryonedata.id }).then(res =>res.data)
          //this.totalAmount = result.totalAmount
          //this.chineseTotalAmount = result.chineseTotalAmount
          /*
                  contractId:null,//合同编号 *
        productSysdicId:'-1',//产品名称数据字典idid *
        productType:'-1',//产品类别(0标准版，1定制版) *
        productId:'-1', //软件版本号（用于类别为标准型） *
        productVersion:'',//软件版本号（用于类别为定制型 *
        productVersionList:[], //软件版本号下拉框数据源
        unitPrice:0, //单价 *
          */
          product = result.products.map(p =>{
            let item = {
              contractId:p.contractId, //必须
              productSysdicId:p.productSysdicId, //必须
              productType:p.productType,//必须
              productId:p.productId,//    
              productVersion:p.productVersion,// productId | productVersion 2选1
              unitPrice:p.unitPrice,//必须
            }
            return p
          })

          this.productCommonParams = {
            dataSource:product,
            totalAmount : result.totalAmount,
            isTax : true,
            __fromAction:this.$parent.routeParams.action
          }
        //正常流程END
      }
    },
    getContractInfo(params){
      return getSoftwareContractQueryOne(params).then((res) => {
        return res.data
      }).catch(error => {
        console.error(error)
      })
    },
    // handler 表单数据验证成功后回调事件
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    // 点击下一步
    async nextStep (status) {
      const that = this
      let {error , values} = this.$refs.productCommon.validate()
      if(values.length <= 0){
        this.$message.error('请完善产品信息')
        return 
      }
      if(error) return

      let products = this.formatProduct(values)
      // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
      saveSoftwareContractProduct(products).then((res) => {
        if(res && res.code && parseInt(res.code) === 500){
          that.$info.error(res.msg)
          return 
        }
        if(status != 1){
          that.$emit('nextStep', {})
        }else {
          that.$message.success('保存成功')
        }
      }).catch(error => {
        console.error(error)
      })
    },
    formatProduct(products){
      let that = this
      // 拼接产品集合
      const res = products.map(item => {
        return Object.assign({},item,{contractId: that.queryonedata.id})
      })
      return res
    },
    // 上一步
    prevStep () {
      const id = this.id
      this.$emit('prevStep', id)
    },
    finish () {
      this.currentTab = 0
    }
  }
}
</script>
<style>
  .step-table-list .ant-form-item{
    margin-bottom: 0;
  }
</style>



<style lang="less" scoped>
.wdf-row {
  border: 1px solid #ddd;
}
.wdf-form {
  margin-top: 12px;
  padding: 12px;
}
.btns-grop {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
}
.btns-grop button:not(first-child) {
  margin-left: 12px;
}
.col-mount {
  border: 1px solid #ddd;
  border-top: none;
  padding: 6px 16px;
}
.span-mount ~ .span-mount {
  margin-left: 16px;
}
.bigword {
  font-weight: bold;
}
</style>
