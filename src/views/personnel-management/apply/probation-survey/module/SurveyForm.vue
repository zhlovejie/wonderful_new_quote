<template>
  <a-modal
    :title="modalTitle"
    :width="1005"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false" 
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
    <a-form :form="form" class="survey-form-wrapper">
      <!-- <h3>员工试用期考查表</h3> -->
      <table class="custom-table custom-table-border">
        <tr>
          <td >编号</td>
          <td >
            <a-form-item>
              <a-input disabled v-decorator="['probationCode']" />
            </a-form-item>
          </td>
          <td >姓名</td>
          <td >
            <a-form-item>
              <a-input disabled v-decorator="['userName', { rules: [{ required: false, message: '请输入姓名' }] }]"/>
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td >车间主任／部门主管</td>
          <td >
            <a-form-item>
              <a-input disabled v-decorator="['leaderName']" />
            </a-form-item>
          </td>
          <td >入职日期</td>
          <td >
            <a-form-item>
              <a-date-picker 
                disabled 
                style="width:100%;" 
                v-decorator="['entryDate',{initialValue:moment(),rules: [{required: false,message: '输入入职日期'}]}]" 
                format="YYYY-MM-DD"
              />
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td >本月出勤情况(天)</td>
          <td >
            <a-form-item>
              <!-- <a-input :disabled="isView" v-decorator="['workDays', { rules: [{ required: false, message: '请输入本月出勤情况' }] }]"/> -->

              <a-input-number
                :disabled="isView"
                style="width:100%;"
                :min="0"
                :max="10000"
                :step="1"
                v-decorator="['workDays', { rules: [{ required: false, message: '请输入本月出勤情况' }] }]"
              />

            </a-form-item>
          </td>
          <td colspan="2"></td>
        </tr>
        

        <tr>
          <td >试用期工作内容</td>
          <td colspan="3">
            <a-form-item>
              <a-textarea 
                placeholder="试用期工作内容" 
                :rows="5" 
                :disabled="isView" 
                v-decorator="['jobContent', { rules: [{ required: true, message: '请输入试用期工作内容' }] }]"
              />
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td >试用期考核</td>
          <td colspan="3" style="padding:0;">
            <table class="custom-table " style="margin:-1px;">
              <tr>
                <th colspan="2">项目及观察要点</th>
                <th>自评分数</th>
              </tr>
              <tr>
                <td>知识与技能</td>
                <td>完成岗位所必需的基本知识、专门知识和技能熟练的程序。</td>
                <td>
                  <a-form-item>
                  <a-select style="width:150px;" :disabled="isView" @change="scoreChange('s1',$event)" v-decorator="['userSkill',{rules: [{required: true,message: '选择自评分数'}]}]" placeholder="选择自评分数">
                    <a-select-option :value="30">很好&nbsp;30分</a-select-option>
                    <a-select-option :value="25">好&nbsp;25分</a-select-option>
                    <a-select-option :value="20">较好&nbsp;20分</a-select-option>
                    <a-select-option :value="15">一般&nbsp;15分</a-select-option>
                    <a-select-option :value="10">差&nbsp;10分</a-select-option>
                  </a-select>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td>与人协调能力</td>
                <td>同事间的协调、协调客户关系及其他关系的能力。</td>
                <td>
                  <a-form-item>
                  <a-select style="width:150px;" :disabled="isView" @change="scoreChange('s2',$event)" v-decorator="['userCoordinate',{rules: [{required: true,message: '选择自评分数'}]}]" placeholder="选择自评分数">
                    <a-select-option :value="15">很好&nbsp;15分</a-select-option>
                    <a-select-option :value="8">好&nbsp;8分</a-select-option>
                    <a-select-option :value="6">较好&nbsp;6分</a-select-option>
                    <a-select-option :value="4">一般&nbsp;4分</a-select-option>
                    <a-select-option :value="2">差&nbsp;2分</a-select-option>
                  </a-select>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td>工作改进绩效</td>
                <td>位达成工作目标或解决问题做思考及改进绩效程度。</td>
                <td>
                  <a-form-item>
                  <a-select style="width:150px;" :disabled="isView" @change="scoreChange('s3',$event)" v-decorator="['userImprove',{rules: [{required: true,message: '选择自评分数'}]}]" placeholder="选择自评分数">
                    <a-select-option :value="10">很好&nbsp;10分</a-select-option>
                    <a-select-option :value="8">好&nbsp;8分</a-select-option>
                    <a-select-option :value="6">较好&nbsp;6分</a-select-option>
                    <a-select-option :value="4">一般&nbsp;4分</a-select-option>
                    <a-select-option :value="2">差&nbsp;2分</a-select-option>
                  </a-select>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td>执行力</td>
                <td>完成工作责任及贯彻指示命令的努力程度。</td>
                <td>
                  <a-form-item>
                  <a-select style="width:150px;" :disabled="isView" @change="scoreChange('s4',$event)" v-decorator="['userExecution',{rules: [{required: true,message: '选择自评分数'}]}]" placeholder="选择自评分数">
                    <a-select-option :value="10">很好&nbsp;10分</a-select-option>
                    <a-select-option :value="8">好&nbsp;8分</a-select-option>
                    <a-select-option :value="6">较好&nbsp;6分</a-select-option>
                    <a-select-option :value="4">一般&nbsp;4分</a-select-option>
                    <a-select-option :value="2">差&nbsp;2分</a-select-option>
                  </a-select>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td>工作效率</td>
                <td>在一定时间内完成预定工作的量和速度。</td>
                <td>
                  <a-form-item>
                  <a-select style="width:150px;" :disabled="isView" @change="scoreChange('s5',$event)" v-decorator="['userEfficiency',{rules: [{required: true,message: '选择自评分数'}]}]" placeholder="选择自评分数">
                    <a-select-option :value="15">很好&nbsp;15分</a-select-option>
                    <a-select-option :value="8">好&nbsp;8分</a-select-option>
                    <a-select-option :value="6">较好&nbsp;6分</a-select-option>
                    <a-select-option :value="4">一般&nbsp;4分</a-select-option>
                    <a-select-option :value="2">差&nbsp;2分</a-select-option>
                  </a-select>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td>工作精确程度</td>
                <td>工作有无错误，是否细心？就工作成果正确性的程序和效果加以考核。</td>
                <td>
                  <a-form-item>
                  <a-select style="width:150px;" :disabled="isView" @change="scoreChange('s6',$event)" v-decorator="['userAccuracy',{rules: [{required: true,message: '选择自评分数'}]}]" placeholder="选择自评分数">
                    <a-select-option :value="20">很好&nbsp;20分</a-select-option>
                    <a-select-option :value="8">好&nbsp;8分</a-select-option>
                    <a-select-option :value="6">较好&nbsp;6分</a-select-option>
                    <a-select-option :value="4">一般&nbsp;4分</a-select-option>
                    <a-select-option :value="2">差&nbsp;2分</a-select-option>
                  </a-select>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td colspan="2">得分合计</td>
                <td>{{totalScore}}</td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- <tr>
          
          <td >试用期工资</td>
          <td >
            <a-form-item>
              <a-input :disabled="isView" v-decorator="['wage', { rules: [{ required: false, message: '请输入试用期工资' }] }]"/>
            </a-form-item>
          </td>
          <td colspan="2"></td>
          
        </tr> -->

        <!-- <tr>
          <td >工资分配</td>
          <td colspan="3">
            <a-form-item>
              <label style="margin-right:8px;">卡2</label><a-input style="width:200px;" v-decorator="['d19']"/>
            </a-form-item>
          </td>
        </tr> -->

      </table>
    </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import moment from 'moment' 
import {
  handleProbationSurvey, //详情
  saveHandleProbationSurvey, //提交
  getAttenceMonthStatiticsCollect //获取出勤天数
} from '@/api/personnelManagement'
export default {
  name:'SurveyForm',
  data(){
    return {
      visible:false,
      form: this.$form.createForm(this, { name: 'do_survey' }),
      type:'view',
      birthplaceOptions:[], //籍贯 级联 省市
      education:[],
      departmentDataSource:[], //岗位
      stationDataSource:[], //部门
      record:{},
      s1:0,
      s2:0,
      s3:0,
      s4:0,
      s5:0,
      s6:0,
      spinning:false
    }
  },
  computed:{
    modalTitle(){
      let txt = this.isView ? '查看' : (this.isEdit ? '处理' : '未知')
      return `${txt}试用期调查表`
    },
    isView(){
      return this.type === 'view'
    },
    isEdit(){
      return this.type === 'edit'
    },
    totalScore(){
      let c = 0
      c += parseInt(this.s1,10)
      c += parseInt(this.s2,10)
      c += parseInt(this.s3,10)
      c += parseInt(this.s4,10)
      c += parseInt(this.s5,10)
      c += parseInt(this.s6,10)
      return isNaN(c) ? 0 : c 
    }
  },
  methods:{
    scoreChange(type,event){
      this[type] = parseInt(event,10)
    },
    moment:moment,
    query(type,record){
      this.visible = true
      this.type = type 
      this.record = record
      this.fillData()
    },
    fillData(){
      let that = this
      that.spinning = true
      handleProbationSurvey({id:this.record.id}).then(res =>{
        that.spinning = false
        this.form.resetFields()
        let obj = Object.assign({},res.data)
        obj.entryDate = this.moment(obj.entryDate)
        let fillObj = {}
        for(let key in obj){
          if(obj.hasOwnProperty(key)){
            if(obj[key]){
              fillObj[key] = obj[key]
            }
          }
        }
        this.$nextTick(() =>this.form.setFieldsValue(fillObj))

        this.s1 = obj.userSkill
        this.s2 = obj.userCoordinate
        this.s3 = obj.userImprove
        this.s4 = obj.userExecution
        this.s5 = obj.userEfficiency
        this.s6 = obj.userAccuracy

        //待提交 自动填充 出勤天数
        this.record.state === 0 && this.fillWorkDays()
      }).catch(err =>{
        console.log(err)
        that.spinning = false
      })
    },
    fillWorkDays(){
      let that = this
      getAttenceMonthStatiticsCollect({
        statiticsMonthDate:this.moment().format("YYYY-MM"),
        userId:that.record.userId,
      }).then(res =>{
        that.form.setFieldsValue({
          workDays: res.data || undefined
        })
      })
    },
    handleOk(){
      let that = this
      if(that.isView){
        that.form.resetFields() // 清空表
        that.visible = false
        return 
      }else if(that.isEdit){
        that.form.validateFields((err, values) => {
          if (!err) {
            
            values.id = that.record.id
            delete values.entryDate
            //values.entryDate = values.entryDate.format('YYYY-MM-DD')
            console.log('Received values of form: ', values)

            //提交状态 0 首次提交  1 驳回提交
            values.submitState = that.record.state === 0 ? 0 : 1
            that.spinning = true
            saveHandleProbationSurvey(values).then(res =>{
              that.spinning = false
              console.log(res)
              //that.form.resetFields() // 清空表
              that.visible = false 
              that.$message.info(res.msg)
              that.$emit('finish')
            }).catch(err => that.spinning = false)
          }
        })
      }else{
        that.form.resetFields() // 清空表
        that.visible = false
      }
      
    },
    handleCancel(){
      this.form.resetFields() // 清空表
      this.visible = false
    }
  }
}
</script>
<style scoped>
  /*自定义table样式*/
  .custom-table{
    margin-bottom:0;
  }

  .custom-table-border th,.custom-table-border td{
    padding: 5px 10px;
  }

  .custom-table >>> .custom-table{
    position: relative;
    top: 0;
    left: 0;
    width: calc(100% + 2px);
    margin-bottom: -2px;
  }
  .custom-table >>> .custom-table td{
    text-align:left;
  }
  .survey-form-wrapper >>> .ant-form-item{
    margin-bottom: 0;
  }
</style>