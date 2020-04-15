<template>
<div class="software-contract-step1-wrapper">
    
    <table class="custom-table custom-table-border">
      <caption>产品详情</caption>
      
      <tbody>
        <tr>
          <td style="width:30%">产品名称</td>
          <td style="width:70%">功能点</td>
        </tr>
        <template v-if="queryOneData && queryOneData.products && Array.isArray(queryOneData.products)">
          <tr v-for="(product ) in queryOneData.products" :key="product.id" >
            <td style="width:30%">{{product.productName}}-{{parseInt(product.productType) === 0 ? '标准版' : '定制版'}}</td>
            <td style="width:70%">
              <a-row>
                <template v-if="parseInt(product.productType) === 0">
                  <a-checkbox-group :options="product.plainOptions || []" :value="product.checkedList || []" @change="onPointChange(product.id,$event)" />
                </template>
                <template v-if="parseInt(product.productType) === 1">
                  <a-textarea placeholder="请输入定制需求" :rows="4" :value="product.productFunPoint" @change="onProductFunPointChange(product.id,$event)" />
                </template>
              </a-row>
            </td>
          </tr>
        </template>
      </tbody>
    </table>


    <a-row type="flex">
      <a-col :span="24" justify="center" align="middle">
        <a-button style="margin-right:8px;" @click="prevStep">上一步</a-button>
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getSoftwareContractQueryOne, saveProductPoints } from '@/api/contractListManagement'
import moment from 'moment'

export default {
  name: 'Step3',
  components: {},
  props: {
    queryonedata: {
      type: Object
    }
  },
  data () {
    const queryOneData = { ...this.queryonedata }
    return {
      queryOneData: queryOneData,
      id:null
    }
  },
  watch: {
    $route (to, from) {
      
    },
    queryOneData: function (newVal, oldVal) {
      //this.init()
    }
  },
  beforeMount () {
    // debugger
  },
  mounted () {
    this.init()
  },
  computed: {
    
  },
  methods: {
    init () {
      const that = this
      that.id = that.queryonedata.id
      const params = { id: that.queryonedata.id}


      if(that.id > 0){
        getSoftwareContractQueryOne(params).then(res => {
          that.queryOneData = res.data

          let products = that.queryOneData.products
          products = products.map(product =>{
            if(!product.plainOptions){
              product.plainOptions = []
            }
            if(!product.checkedList){
              product.checkedList = []
            }
            if(product.productType === 0){
              let pointList = product.pointList ? product.pointList : []
              product.plainOptions = pointList.map(point =>{
                return {label:point.funName,value:point.funName}
              })
              product.checkedList = pointList.filter(point =>point.selected === 1).map(point =>point.funName)
            }
          })
        }).catch(error => {
          console.error(error)
        })
      }
    },
    onPointChange(productid,checkedValues){
      let dataSource = Object.assign({},this.queryOneData)
      let products = dataSource.products
      let target = products.find(p =>  p.id === productid)
      if(target){
        target.checkedList = checkedValues
        this.queryOneData = dataSource
      }
    },
    onProductFunPointChange(productid,e){
      let dataSource = Object.assign({},this.queryOneData)
      let products = dataSource.products
      let target = products.find(p =>  p.id === productid)
      if(target){
        target.productFunPoint = e.target.value
        this.queryOneData = dataSource
      }
    },
    formatData(){
      let products = this.queryOneData.products
      return products.map(p =>{
        return {
          id:p.id,
          productFunPoint:p.productType === 0 ? p.checkedList.join(',') : p.productFunPoint
        }
      })
    },
    // 上一步
    prevStep () {
      // this.$emit('prevStep', {...this.id})
      const id = this.id
      this.$emit('prevStep', id)
    },
    // 点击下一步
    nextStep (status) {
      const that = this
      let params = this.formatData()
      console.log(params)

      if(that.$parent.routeParams.action === 'add'){
        console.log('新增模式 添加参数 contractModifyFlag：0')
        params.contractModifyFlag = 0
      }else if(that.$parent.routeParams.action === 'edit'){
        console.log('修改模式 添加参数 contractModifyFlag：1')
        params.contractModifyFlag = 1
      }
      // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
      saveProductPoints(params).then(res => {
        console.log('校验成功，保存填写的信息，请求后端接口结果', res)
        that.id = res.data.id
        if(status != 1){
          that.$emit('nextStep', { ...res.data })
        }else {
          that.$message.success('保存成功')
        }
      }).catch(error => {
        console.error(error)
      })
    }
  }
}
</script>

<style scoped>

</style>
