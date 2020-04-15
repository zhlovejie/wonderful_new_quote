<template>
  <div class="bank-info-wrapper" >
    <a-form layout="inline">
      <div class="bank-info-item" v-for="(item,index) in dataSource" :key="index">
        <a-form-item>
          <span>卡&nbsp;{{index+1}}</span>
        </a-form-item>
        <a-form-item>
          <a-select :disabled="disabled" @change="bankChange(item,$event)"  style="width:160px;" :value="item.bankDicId" placeholder="选择银行">
            <a-select-option v-for="(item, index) in bankList" :key="index" :value="item.id">{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input :disabled="disabled" @change="accountChange(item,$event)" style="width:320px;" :value="item.cardNum"  placeholder="输入账号" />
        </a-form-item>

        <a-icon v-if="!disabled" type="minus-circle" class="dynamic-delete-button" @click="doAction('del',item)"/>
      </div>
      <a-form-item v-if="!disabled">
        <a-button type="dashed" @click="doAction('add')">
          <a-icon type="plus" />添加银行
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import {getDictionaryList} from '@/api/workBox'
let id = 0
export default {
  name:'Buttons',
  props:{
    bankInfo:{
      type:Array,
      default:function(){
        return []
      }
    },
    disabled:{
      type:Boolean,
      default:function(){
        return false
      }
    }
  },
  data(){
    return {
      dataSource:[],
      bankList:[]
    }
  },
  watch:{
    bankInfo(){
      console.log('watch bankInfo change.....')
      this.refresh()
    }
  },
  mounted(){
    console.log('mounted called.....')
    this.refresh()
  },
  methods:{
    async refresh(){
      let that = this
      if(this.bankList.length === 0){
        await getDictionaryList({parentId:493}).then(res =>{
          this.bankList = res.data  
        })
      }
      that.dataSource = that.bankInfo.map((v,index) =>{
        let bankInfo = Object.assign({},v)
        bankInfo.__id = ++id
        return bankInfo
      })
    },
    doAction(type,item){
      let that = this
      if(type === 'add'){
        if(this.dataSource.length >= 3){
          this.$message.info('最多可以添加3组银行账户')
          return
        }
        this.dataSource.push({
          __id:++id,
          bankDicId:undefined,
          cardNum:undefined
        })
      }else if(type === 'del'){
        this.dataSource = this.dataSource.filter(v =>v.__id !== item.__id)
      }
    },
    bankChange(record,e){
      let _dataSource = [...this.dataSource]
      let target = _dataSource.find(item => record.__id === item.__id)
      if(target){
        target.bankDicId = e
        this.dataSource = [..._dataSource]
      }
    },
    accountChange(record,e){  
      let _dataSource = [...this.dataSource]
      let target = _dataSource.find(item => record.__id === item.__id)
      if(target){
        target.cardNum = e.target.value
        this.dataSource = [..._dataSource]
      }
    },
    validateFields(){
      let that = this
      return new Promise(resolve =>{
        let getBankName = (id) => {
          let target = that.bankList.find(item =>parseInt(item.id,10) === parseInt(id,10))
          return target ? target.text : ''
        }

        let values = {}
        let hasError = false
        values.bank = that.dataSource.map(item =>{
          item.bankDicName = getBankName(item.bankDicId)
          return item
        })
        let reg = /^\d{15,20}$/
        for(let i=0,len=that.dataSource.length;i<len;i++){
          let _item = that.dataSource[i]
          if(!_item.bankDicId){
            that.$message.info('请选择银行')
            hasError = true
            break
          }
          if(!_item.cardNum){
            that.$message.info('请输入银行账号')
            hasError = true
            break
          }
          if(!reg.test(_item.cardNum)){
            that.$message.info('银行账号输入有误（15-20位数字）')
            hasError = true
            break
          }
        }

        console.log(values)
        resolve({
          err:hasError,
          values:values
        })
      })
    }
  }
}
</script>

<style scoped>
  .dynamic-delete-button {
    cursor: pointer;
    position: relative;
    top: 8px;
    font-size: 24px;
    color: #999;
    transition: all 0.3s;
  }

  .bank-info-wrapper >>> .ant-form-item {
    margin-bottom: 0;
  }
</style>