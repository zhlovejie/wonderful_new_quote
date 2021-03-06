<template>
  <div class="myform-1-wrap" v-if="dataSource.length > 0">
    <a-form :form="form" layout="inline">
      <div class="contact-item" v-for="(item,index) in dataSource" :key="item.id">
        <a-form-item v-for="(_item,_index) in item.contact" :key="_index" :label="_item.label">
          <a-input v-decorator="[`contact.${index}.${_item.key}`,{rules: [{required: true,message: `${_item.message}`}]}]" :style="_item.style"></a-input>
        </a-form-item>
        <template v-if="index === 0">
          <a-icon type="plus-circle" class="dynamic-delete-button" @click="addContact"/>
        </template>
        <template v-else>
          <a-icon type="minus-circle" class="dynamic-delete-button" @click="minusContact(item)"/>
        </template>
      </div>
    </a-form>
  </div>
</template>

<script>
let unKey = 0
function getUnKey(){
  return ++unKey
}
//联系人模板
const __CONTACT_TEMPLATE_ = [
  {
    label:'联系人',
    key:'name',
    isRequire:true,
    message:'联系人姓名',
    style:{width:'100px'},
    value:''
  },
  {
    label:'电话',
    key:'telphone',
    isRequire:true,
    message:'联系人电话',
    style:{width:'150px'},
    value:''
  },
  {
    label:'收货地址',
    key:'address',
    isRequire:true,
    message:'收货地址',
    style:{width:'300px'},
    value:''
  }
]
export default {
  name:'MyForm1',
  props:{
    contacts:{
      type:Array,
      default:[]
    }
  },
  data(){
    return {
      dataSource:[]
    }
  },
  beforeCreate(){
    this.form = this.$form.createForm(this)
  },
  watch:{
    contacts(){
      this.refresh()
    }
  },
  mounted(){
    this.refresh()
  },
  methods:{
    refresh(){ //初始化数据
      let that = this
      if(this.contacts.length > 0){
        let fillObj = {} //用于回显数据
        let dataSource = []
        this.contacts.map((item,index) =>{
          let keys = Object.keys(item)
          let __item = __CONTACT_TEMPLATE_.map(tmp =>{
            let _tmp = Object.assign({},tmp) //避免修改模板的原始数据
            if(keys.includes(_tmp.key)){
              _tmp.value = item[_tmp.key]
            }
            fillObj[`contact.${index}.${_tmp.key}`] = item[_tmp.key]
            return _tmp
          })
          dataSource.push({id:getUnKey(),contact:__item})
        })
        this.dataSource = dataSource //先渲染表单组件
        this.$nextTick(() =>{  
          this.form.setFieldsValue(fillObj) //延迟填充回显数据
        })
      }else{
        this.dataSource = []
      }
    },
    validate(){ //验证表单数据
      let res = null
      this.form.validateFields((err, values) => {
        res = {err,values}
      })
      return res
    },
    addContact(){ //添加联系人
      if(this.dataSource.length >= 3){
        this.$message.info('最多可以添加3组联系人')
        return
      }
      this.dataSource.push({
        id:getUnKey(),
        contact:__CONTACT_TEMPLATE_.map(tmp =>{
          let _tmp = Object.assign({},tmp)
          return _tmp
        })
      })
    },
    minusContact(item){ //删除联系人
      this.dataSource = this.dataSource.filter(c =>c.id !== item.id)
    },
    resetFields(){ //重置表单数据
      this.form.resetFields()
    }
  },
  beforeDestroy(){
    this.form.resetFields()
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
</style>