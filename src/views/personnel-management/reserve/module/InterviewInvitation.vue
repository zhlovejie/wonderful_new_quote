<template>
  <!-- 面试邀请 -->
  <a-modal
    title="面试邀请"
    :width="400"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" :layout="formLayout" class="interview-invitation-form-wrapper">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="面试人员">
              <a-cascader
                v-decorator="['firstUser',{rules: [{required: true,message: '选择面试人员'}]}]"
                :options="departmentOptions"
                @change="departmentCascaderChange"
                :loadData="departmentCascaderLoadData"
                placeholder="选择面试人员"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
          <a-form-item label="面试地点">
              <a-input v-decorator="['firstPlace',{rules: [{required: true,message: '输入面试地点'},{max:50,message:'面试地点最大支持50个字符'}]}]" placeholder="输入面试地点"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="面试时间">
              <a-date-picker
                style="width:100%;"
                v-decorator="['firstDatetime',{rules: [{required: true,message: '输入面试时间'}]}]"
                format="YYYY-MM-DD HH:mm:ss"
                :disabledDate="disabledDate"
                :disabledTime="disabledDateTime"
                :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import {interviewRecordAdd} from '@/api/personnelManagement'
import {
  departmentList,//所有部门
  getStationList, //获取所有岗位
  getUserByDep, //获取人员
} from '@/api/systemSetting'
export default {
  name:'InterviewInvitation',
  data(){
    return {
      visible:false,
      spinning:false,
      form: this.$form.createForm(this, { name: 'interview_invitation' }),
      departmentOptions:[], //岗位 级联 部门岗位
      formLayout:"inline",
      person:{}
    }
  },
  methods:{
    moment,
    query(record){
      this.visible = true
      this.person = record;
      this.form.resetFields()
      //部门
      departmentList().then(res =>{
        this.departmentOptions = res.data.map(item =>{
          return {
            label:item.departmentName,
            value:item.id,
            isLeaf:false
          }
        })
      })
    },
    range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().subtract(1, 'days').endOf('day');
    },
    disabledDateTime() {
      return {
        // disabledHours: () => this.range(0, 24).splice(4, 20),
        // disabledMinutes: () => this.range(30, 60),
        // disabledSeconds: () => [55, 56],
      };
    },
    departmentCascaderChange(arrSelected){
      console.log('departmentCascaderLoadData called...')
      console.log(arguments)
    },
    departmentCascaderLoadData(selectedOptions){
      let that = this
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true
      //http://192.168.99.101:8999/oa/user/query?current=1&size=10&departmentId=5
      getUserByDep({ departmentId: targetOption.value}).then(res => { //岗位
        targetOption.loading = false
        targetOption.children = res.data.map(item =>{
          return {
            label:item.trueName,
            value:item.id,
            isLeaf:true
          }
        })
        that.departmentOptions = [...that.departmentOptions]
      }).catch(function (err) {
        console.log(err)
      })
    },
    handleCancel(){
      this.form.resetFields()
      this.$nextTick(() =>this.visible = false)
    },
    handleSubmit(){
      let that = this
      console.log("reserveId:" + that.person.id);

      that.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          that.spinning = true
          
          //记录编号
          values.reserveId = that.person.id
          //人员应聘岗位ID
          values.stationId = that.person.stationId 
          //面试人员是个数组 [部门ID,人员ID] ， 这里传人员ID即可
          values.firstUser = values.firstUser[values.firstUser.length - 1]
          values.firstDatetime = values.firstDatetime.format("YYYY-MM-DD HH:mm:ss")
          interviewRecordAdd(values).then(res =>{
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
          /*setTimeout(function(){
            that.spinning = false
            that.$message.info('模拟操作')
            that.$emit('finish')
          },2000)*/
        }
      })
    }
  }
}
</script>

<style scoped>
  .interview-invitation-form-wrapper >>> .ant-form-item{
    display: flex;
  }
  .interview-invitation-form-wrapper >>> .ant-form-item-control-wrapper{
    flex: 1;
  }
</style>
