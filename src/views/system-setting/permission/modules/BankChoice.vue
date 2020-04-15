<template>
  <div class="bank-info-wrapper" >
    <a-form :form="form" layout="inline">
      <div class="bank-info-item" v-for="(item,index) in dataSource" :key="item.id">
        <a-form-item>
          <span>卡&nbsp;{{index+1}}</span>
        </a-form-item>
        <a-form-item>
          <a-select :disabled="disabled"  style="width:160px;" v-decorator="[`bank.${index}.bankType`,{rules: [{required: true,message: '选择银行'}]}]" placeholder="选择银行">
            <a-select-option :value="1">农业银行</a-select-option>
            <a-select-option :value="2">建设银行</a-select-option>
            <a-select-option :value="3">南京银行</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input :disabled="disabled" style="width:320px;" v-decorator="[`bank.${index}.cardNum`,{rules: [{required: true,message: '输入账号'},{pattern: /^\d{15,20}$/, message: '请输入正确银行账号' }]}]" placeholder="输入账号" />
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
      form:this.$form.createForm(this),
      dataSource:[]
    }
  },
  watch:{
    bankInfo(){
      this.refresh()
    }
  },
  mounted(){
    this.refresh()
  },
  methods:{
    refresh(){
      let obj = {}
      this.dataSource = this.bankInfo.map((v,index) =>{
        let bankInfo = Object.assign({},v)
        bankInfo.id = index
        obj[`bank.${index}.bankType`] = bankInfo.bankType
        obj[`bank.${index}.cardNum`] = bankInfo.cardNum
        return bankInfo
      })
      console.log(obj)
      
      this.$forceUpdate()
      this.$nextTick(() => this.form.setFieldsValue(obj))
    },
    doAction(type,item){
      if(type === 'add'){
        if(this.dataSource.length >= 3){
          this.$message.info('最多可以添加3组银行账户')
          return
        }
        this.dataSource.push({
          id:++id,
          bankType:0,
          cardNum:''
        })
      }
      if(type === 'del'){
        this.dataSource = this.dataSource.filter(v =>v.id !== item.id)
      }
    },
    validateFields(){
      let that = this
      return new Promise(resolve =>{
        that.form.validateFields((err, values) => {
          resolve({
            err:err,
            values:values
          })
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