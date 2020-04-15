<template>
  <a-modal
    :title="modalTitle"
    :width="660"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
    <a-form :form="form"  class="reserve-add-form-wrapper">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="姓名">
            <a-input :disabled="isView" v-decorator="['name',{rules: [{required: true,message: '输入姓名'},{max:10,message:'姓名最大支持10个字符'}]}]" placeholder="输入姓名"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="性别">
            <a-select :disabled="isView" v-decorator="['sex',{initialValue:0,rules: [{required: false,message: '选择性别'}]}]" placeholder="选择性别">
              <a-select-option :value="1">男</a-select-option>
              <a-select-option :value="0">女</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="籍贯">
            <a-cascader 
              :disabled="isView" 
              v-decorator="['birthplace',{rules: [{required: false,message: '输入籍贯'}]}]"
              :options="birthplaceOptions" 
              @change="birthplaceCascaderChange" 
              :loadData="birthplaceCascaderLoadData" 
              placeholder="输入籍贯" 
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="应试岗位">
            <a-cascader 
              :disabled="isView" 
              v-decorator="['stationId',{rules: [{required: true,message: '选择应试岗位'}]}]"
              :options="departmentOptions" 
              @change="departmentCascaderChange" 
              :loadData="departmentCascaderLoadData" 
              placeholder="选择应试岗位" 
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="文化程度">
            <a-select :disabled="isView" v-decorator="['educationId',{rules: [{required: false,message: '选择文化程度'}]}]" placeholder="选择文化程度">
              <a-select-option v-for="(item, index) in education" :key="index" :value="item.id">{{item.text}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="毕业院校">
            <a-input :disabled="isView" v-decorator="['school',{rules: [{required: false,message: '输入毕业院校'},{max:20,message:'毕业院校最大支持20个字符'}]}]" placeholder="输入毕业院校"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="专业">
            <a-input :disabled="isView" v-decorator="['major',{rules: [{required: false,message: '输入专业'},{max:20,message:'专业最大支持20个字符'}]}]" placeholder="输入专业"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="工作年限">
            <a-input :disabled="isView" v-decorator="['workingLife',{rules: [{required: false,message: '输入工作年限'},{pattern: /^\d{1,2}$/,message:'请输入正确的工作年限'}]}]" placeholder="输入工作年限"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="手机号">
            <a-input :disabled="isView" v-decorator="['phone',{rules: [{required: true,message: '输入手机号'},{pattern: /^\d{11}$/,message:'请输入正确的手机号码'}]}]" placeholder="输入手机号"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="邮箱">
            <a-input :disabled="isView" v-decorator="['email',{rules: [{required: false,message: '输入邮箱'},{max:50,message:'邮箱最大支持50个字符'}]}]" placeholder="输入邮箱"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="员工状态">
            <a-select :disabled="isView" placeholder="员工状态" v-decorator="['status',{initialValue:0,rules: [{required: false,message: '输入员工状态'}]}]">
              <a-select-option :value="0">浏览</a-select-option>
              <!-- <a-select-option :value="1">试用期</a-select-option>
              <a-select-option :value="2">试用期不通过</a-select-option>
              <a-select-option :value="3">在职</a-select-option>
              <a-select-option :value="4">离职</a-select-option> -->
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    </a-spin>
  </a-modal>
  
</template>
<script>
import {getDictionaryList} from '@/api/workBox'
import {
  departmentList,//所有部门
  getStationList, //获取所有岗位
} from '@/api/systemSetting'
import {
  getEntityBeforeDetail, 
  reserveAddOrUpdate 
} from '@/api/reserveApi' 
import { getAreaByParent } from '@/api/common'
export default {
  name:'reserveAddForm',
  data(){
    return {
      form: this.$form.createForm(this, { name: 'reserve_add' }),
      visible:false,
      spinning:false,
      education:[],
      departmentOptions:[], //岗位 级联 部门岗位
      birthplaceOptions:[], //籍贯 级联 省市
      type:'view'
    }
  },
  computed:{
    isView(){
      return this.type === 'view' ? true : false
    },
    modalTitle(){
      return this.type === 'add' ? '新增人员' : (this.type === 'view' ? '查看人员信息' : '编辑人员信息') 
    }
  },
  methods:{
    async query(type,record){
      
      let that = this
      that.visible = true 
      that.type = type
      console.log(that)
      that.record = Object.assign({},record)
      that.form.resetFields()
      await that.initData()
      if(type === 'view' || type === 'edit'){
        getEntityBeforeDetail({reserveId:record.id}).then(res =>{
          console.log(res)
          that.fillData(res.data)
        })
      }
    },
    initData(){
      let that = this
      let task1 = function(){ //学历
        return new Promise((resolve,reject) =>{
          getDictionaryList({parentId:1}).then(res =>{
            that.education = res.data
            resolve('done')
          })
        })
      }
      let task2 = function(){//部门
        return new Promise((resolve,reject) =>{
          departmentList().then(res =>{
            that.departmentOptions = res.data.map(item =>{
              return {
                label:item.departmentName,
                value:item.id,
                isLeaf:false
              }
            })
            resolve('done')
          })
        })
      }
      let task3 = function(){//省、市级联
        return new Promise((resolve,reject) =>{
          getAreaByParent({ pId: 100000 }).then(res => { 
            that.birthplaceOptions = res.data.map(item =>{
              return {
                label:item.area,
                value:item.id,
                isLeaf:false
              }
            })
            resolve('done')
          })
        })
      }
      return Promise.all([task1(),task2(),task3()])
    },
    fillData(resultData){
      let that = this
      let values = {...resultData}
      let departmentId = values.departmentId 
      let stationId = values.stationId
      delete values.stationId
      //填充其他
      that.form.setFieldsValue(Object.assign({},values))
      //填充岗位
      if(departmentId){
        getStationList({ id: departmentId }).then(res => { //岗位
          let targetOption = that.departmentOptions.find(p =>p.value == departmentId)
          targetOption.loading = false
          targetOption.children = res.data.map(item =>{
            return {label:item.stationName,value:item.id,isLeaf:true}
          })
          that.departmentOptions = [...that.departmentOptions]
          that.$nextTick(() =>that.form.setFieldsValue({stationId:[departmentId,stationId]}))
        })
      }
      
      //填充籍贯
      let areaIds = values.areaIds
      if(areaIds){
        let arrAreaIds = areaIds.split(',') //[省编号，市编号]
        delete values.birthplace
        getAreaByParent({ pId: arrAreaIds[0] }).then(res => { //城市
          let targetOption = that.birthplaceOptions.find(p =>p.value == arrAreaIds[0])
          targetOption.loading = false
          targetOption.children = res.data.map(item =>{
            return {label:item.area,value:item.id,isLeaf:true}
          })
          that.birthplaceOptions = [...that.birthplaceOptions]
          that.$nextTick(() =>that.form.setFieldsValue({birthplace:arrAreaIds.map(n =>parseInt(n,10))}))
        })
      }
    },
    handleSubmit(){
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          if(values.birthplace){
            values.birthplace = values.birthplace[values.birthplace.length - 1] //籍贯编号
          }
          if(values.stationId){
            values.stationId = values.stationId[values.stationId.length - 1] //岗位编号
          }
          values.isInterviewed = 0 //新增保存后，是否邀面试默认为否
          let isEdit = that.type === 'edit' ? true : false
          if(isEdit){
            values.reserveId = values.id = that.record.id
          }
          that.spinning = true
          reserveAddOrUpdate(values).then(res =>{
            that.spinning = false
            if(res.code === 200){
              that.visible = false 
              that.$message.success('操作成功')
              that.$emit('finish')
            }else{
              that.$message.warning(res.msg)
            }
          })
          .catch(err => {
            that.spinning = false  
            that.$message.error('操作失败')
          })
        }
      })
    },
    handleCancel(){
      this.form.resetFields()
      this.$nextTick(() =>this.visible = false)
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    birthplaceCascaderChange(arrSelected){
      console.log('birthplaceCascaderChange called...')
      console.log(arguments)
    },
    birthplaceCascaderLoadData(selectedOptions){
      let that = this
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true
      getAreaByParent({ pId: targetOption.value }).then(res => { //城市
        targetOption.loading = false
        targetOption.children = res.data.map(item =>{
          return {
            label:item.area,
            value:item.id,
            isLeaf:true
          }
        })
        that.birthplaceOptions = [...that.birthplaceOptions]
      }).catch(function (err) {
        console.log(err)
      })
    },
    departmentCascaderChange(arrSelected){
      console.log('departmentCascaderLoadData called...')
      console.log(arguments)
    },
    departmentCascaderLoadData(selectedOptions){
      let that = this
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true
      getStationList({ id: targetOption.value }).then(res => { //岗位
        targetOption.loading = false
        targetOption.children = res.data.map(item =>{
          return {
            label:item.stationName,
            value:item.id,
            isLeaf:true
          }
        })
        that.departmentOptions = [...that.departmentOptions]
      }).catch(function (err) {
        console.log(err)
      })
    }
  }
}
</script>
<style scoped>
  .reserve-add-form-wrapper >>> .ant-form-item{
    display:flex;
  }

  .ant-form-item >>> .ant-form-item-label{
    width:80px;
  }
  .ant-form-item >>> .ant-form-item-control-wrapper{
    flex:1;
  }
</style>