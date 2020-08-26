<template>
  <a-modal
    :title="modalTitle"
    :width="850"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <!-- <template slot="footer">
      <template v-if="isApproval">
        <a-button key="back" icon="close" @click="noPassAction" >不通过</a-button>
        <a-button key="submit" type="primary" icon="check" :loading="spinning" @click="passAction">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template> -->
    <!-- <a-row :gutter="16" v-if="isApproval">
      <a-col :span="24" style="text-align: right;">
        <a-button class="a-button" style="margin-right: 8px;" type="primary" icon="check" @click="passAction">通过</a-button>
        <a-button class="a-button" type="primary" icon="close" @click="noPassAction">不通过</a-button>
      </a-col>
    </a-row> -->
    <a-spin :spinning="spinning">
    <div class="interview-record-baseinfo">
      应聘岗位：{{stationName}} &nbsp;&nbsp;姓名：{{personName}} &nbsp;&nbsp;手机号：{{personPhoneNo}}
    </div>
    <a-form :form="form" class="interview-record-form-wrapper">
      <h3>初试信息</h3>
      <table class="custom-table custom-table-border">
        <tr>
          <td style="width:120px;">期望工资</td>
          <td >
            <a-form-item>
              <a-input :disabled="isDisabled"  v-decorator="['expectedSalary', { rules: [{ required: false, message: '期望工资' }] }]" />
            </a-form-item>
          </td>
          <td>协商后工资</td>
          <td>
            <a-form-item>
              <a-input :disabled="isDisabled"  v-decorator="['negotiatedSalary', { rules: [{ required: false, message: '协商后工资' }] }]" />
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td>面试评估</td>
          <td colspan="3" >
            <a-row :gutter="16" class="set-pass-score-wrapper">
              <a-col :span="24" >
                <a-form-item label="专业性(最高40分)">
                  <!-- <label>专业性</label>  -->
                  <a-input-number style="width:100%;" :disabled="isDisabled"   :min="0" :max="40" :step="1" v-decorator="['results.0.evaluateScore']" @change="calcScores" />
                  <a-input hidden v-decorator="['results.0.evaluateItem',{initialValue:'专业性'}]" />
                </a-form-item>
                <a-form-item></a-form-item>
              </a-col>
              <a-col :span="24" >
                <a-form-item label="稳定性(最高20分)">
                  <!-- <label>稳定性</label>  -->
                  <!-- <a-input :disabled="isDisabled"  v-decorator="['results.1.evaluateScore']" /> -->
                  <a-input-number style="width:100%;" :disabled="isDisabled"   :min="0" :max="20" :step="1" v-decorator="['results.1.evaluateScore']" @change="calcScores" />
                  <a-input hidden v-decorator="['results.1.evaluateItem',{initialValue:'稳定性'}]" />
                </a-form-item>
              </a-col>
              <a-col :span="24" >
                <a-form-item label="德行品质(最高20分)">
                  <!-- <label>德行品质</label>  -->
                  <!-- <a-input :disabled="isDisabled"  v-decorator="['results.2.evaluateScore']" /> -->
                  <a-input-number style="width:100%;" :disabled="isDisabled"   :min="0" :max="20" :step="1" v-decorator="['results.2.evaluateScore']" @change="calcScores" />
                  <a-input hidden v-decorator="['results.2.evaluateItem',{initialValue:'德行品质'}]" />
                </a-form-item>
              </a-col>
              <a-col :span="24" >
                <a-form-item label="语言表达(最高10分)">
                  <!-- <label>语言表达</label>
                  <a-input :disabled="isDisabled"  v-decorator="['results.3.evaluateScore']" /> -->
                  <a-input-number style="width:100%;" :disabled="isDisabled"   :min="0" :max="10" :step="1" v-decorator="['results.3.evaluateScore']" @change="calcScores" />
                  <a-input hidden v-decorator="['results.3.evaluateItem',{initialValue:'语言表达'}]" />
                </a-form-item>
              </a-col>
              <a-col :span="24" >
                <a-form-item label="健康情况(最高10分)">
                  <!-- <label>健康情况</label>
                  <a-input :disabled="isDisabled"  v-decorator="['results.4.evaluateScore']" /> -->
                  <a-input-number style="width:100%;" :disabled="isDisabled"   :min="0" :max="10" :step="1" v-decorator="['results.4.evaluateScore']" @change="calcScores" />
                  <a-input hidden v-decorator="['results.4.evaluateItem',{initialValue:'健康情况'}]" />
                </a-form-item>
              </a-col>
              <a-col :span="24" >
                <a-form-item label="合计">
                  <span style="float:left;">{{totalCalcScore}}</span>
                </a-form-item>
              </a-col>

            </a-row>
          </td>
        </tr>

        <tr>
          <td>综合评价</td>
          <td colspan="3">
            <a-form-item>
              <a-textarea
                :disabled="isDisabled"
                placeholder="综合评价"
                :rows="3"
                v-decorator="['firstEvaluate', { rules: [{ required: false, message: '综合评价' }] }]"
              />
            </a-form-item>
          </td>
        </tr>

        <tr>
          <td>试用期</td>
          <td colspan="3">
            <a-row>
              <a-col :span="10">
                <a-form-item>
                  <a-select :disabled="isView" @change="probationTypeChange" v-decorator="['probationType',{initialValue:1,rules: [{required: true,message: '选择试用期'}]}]" placeholder="选择试用期">
                    <a-select-option :value="0">无</a-select-option>
                    <a-select-option :value="5">7天</a-select-option>
                    <a-select-option :value="1">1个月</a-select-option>
                    <a-select-option :value="2">2个月</a-select-option>
                    <a-select-option :value="3">3个月</a-select-option>
<!--                    <a-select-option :value="4">考察期</a-select-option>-->
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="10" :offset="1" v-if="!isProbationType4">
                <a-form-item label="考察期(月)">
                  <!-- <a-input :disabled="isView || isProbationType4" v-decorator="['inspectMoth',{rules: [{required: !isProbationType4,message: '输入考察期限'},{max:10,message:'最多可输入10个字符'}]}]" placeholder="输入考察期限"/> -->
                  <a-input-number :disabled="isView || isProbationType4" style="width:100%;"  :min="0" :step="1" v-decorator="['inspectMoth', { rules: [{ required: !isProbationType4, message: '输入考察期限(月)' }] }]" placeholder="输入考察期限(月)" />
                </a-form-item>
              </a-col>
            </a-row>
          </td>
        </tr>

        <tr>
          <td>初试结果</td>
          <td colspan="3">
            <a-form-item >
              <a-radio-group :disabled="isDisabled"  v-decorator="['firstResult',{initialValue: 0}]">
                <a-radio :value="1">通过</a-radio>
                <a-radio :value="0">不通过</a-radio>
              </a-radio-group>
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td>初试人员</td>
          <td>
            <!-- <a-form-item>
              <a-input :disabled="isDisabled"  v-decorator="['firstUserName', { rules: [{ required: true, message: '初试人员' }] }]" />
            </a-form-item> -->
            <a-form-item >
            {{firstUserName}}
            </a-form-item>
          </td>
          <td>初试日期</td>
          <td>
            {{firstDate}}
            <!-- <a-form-item>
              <a-date-picker
                disabled
                style="width:100%;"
                v-decorator="['firstDate',{initialValue:moment(),rules: [{required: false,message: '初试日期'}]}]"
                format="YYYY-MM-DD"
              />
            </a-form-item> -->
          </td>
        </tr>

        <tr>
          <td>发送复试通知</td>
          <td colspan="3">
            <a-row>
              <a-col :span="24">
                <a-form-item label="复试人员">
                  <a-cascader
                    :disabled="isDisabled"
                    v-decorator="['secondPersonInfo',{rules: [{required: false,message: '选择复试人员'}]}]"
                    :options="departmentOptions"
                    @change="departmentCascaderChange"
                    :loadData="departmentCascaderLoadData"
                    placeholder="选择复试人员"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="复试地点">
                  <a-input :disabled="isDisabled"  v-decorator="['secondPlace',{rules: [{required: false,message: '输入复试地点'},{max:50,message:'复试地点最大支持50个字符'}]}]" placeholder="输入复试地点"/>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="复试时间">
                  <a-date-picker
                    :disabled="isDisabled"
                    style="width:100%;"
                    v-decorator="['secondDatetime',{rules: [{required: false,message: '输入复试时间'}]}]"
                    format="YYYY-MM-DD HH:mm:ss"
                    :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </td>
        </tr>
        <!-- <tr>
          <td>是否有复试</td>
          <td colspan="3">
            <a-form-item >
            <a-radio-group :disabled="isDisabled"  v-model="hasSecondPass" @change="secondPassChange">
              <a-radio :value="1">初试</a-radio>
              <a-radio :value="2">复试</a-radio>
            </a-radio-group>
            </a-form-item >
          </td>
        </tr> -->
      </table>
      <h3 v-if="hasSecondPass === 2" style="margin-top: 10px;">复试信息</h3>
      <table v-if="hasSecondPass === 2" class="custom-table custom-table-border">
        <tr style="width:120px;">
          <td >确定工资</td>
          <td colspan="3">
            <a-form-item>
              <a-input :disabled="isDisabled"  v-decorator="['confirmSalary',{rules: [{required: false,message: '确定工资'}]}]" placeholder="确定工资"/>
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td>综合评价</td>
          <td colspan="3">
            <a-form-item>
              <a-textarea
                :disabled="isDisabled"
                placeholder="综合评价"
                :rows="3"
                v-decorator="['secondEvaluate', { rules: [{ required: false, message: '综合评价' }] }]"
              />
            </a-form-item>
          </td>
        </tr>
        <tr >
          <td>复试结果</td>
          <td colspan="3">
            <a-form-item >
              <a-radio-group :disabled="isDisabled"  v-decorator="['secondResult']">
                <a-radio :value="1">通过</a-radio>
                <a-radio :value="0">不通过</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item>
              <a-input hidden v-decorator="['hasSecondPass']" />
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td>复试人员</td>
          <td>
            <a-form-item>
              {{secondName}}
            </a-form-item>
          </td>
          <td>复试日期</td>
          <td>
            <a-form-item>
              {{secondDate}}
            </a-form-item>
          </td>
        </tr>
      </table>
    </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  departmentList,//所有部门
  getStationList, //获取部门下面的岗位
  getUserByDep, //获取人员
} from '@/api/systemSetting'
import {getDictionaryList} from '@/api/workBox'
import {
  interviewRecordAdd,
  interviewRecordUpdate,
  handleInterviewRecord
} from '@/api/personnelManagement'

import moment from 'moment'

export default {
  name:'AddForm',
  components:{

  },
  data(){
    return {
      form: this.$form.createForm(this, { name: 'addForm' }),
      visible:false,
      actionType:'add',
      stationName:'',
      personName:'',
      personPhoneNo:'',
      departmentOptions:[],
      interviewResult:[],
      firstUserName:'',
      firstDate:'',
      hasSecondPass:null,
      secondResult:null, //复试结果  为null不显示
      secondName:'', //复试人员 仅显示用
      secondDate:'',  //复试时间 仅显示用
      totalCalcScore:0,
      spinning:false,
      isProbationType4:true,
    }
  },
  computed:{
    modalTitle(){
      let m = {
        'view':'查看',
        'add':'新增',
        'edit' : '修改',
        'approval':'审批'
      }
      return `${m[this.actionType]}面试记录`
    },
    isView(){
      return this.actionType === 'view'
    },
    isAdd(){
      return this.actionType === 'add'
    },
    isEdit(){
      return this.actionType === 'edit'
    },
    isApproval(){
      return this.actionType === 'approval'
    },
    isDisabled(){
      return this.isView || this.isApproval
    }
  },
  methods:{
    moment:moment,
    init(){
      let that = this
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
    async handleOk(){
      let that = this
      if(that.isView || that.isApproval){
        that.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          //debugger
          if(that.isEdit){
            values.id = that.record.id
          }
          if(values.secondPersonInfo && values.secondPersonInfo.length === 2){
            //values.stationId = values.secondPersonInfo[0]
            values.secondId = values.secondPersonInfo[1]
          }
          if(values.secondDatetime){
            values.secondDatetime = values.secondDatetime.format('YYYY-MM-DD HH:mm:ss')
          }
          if(values.secondDate){
            values.secondDate = values.secondDate.format('YYYY-MM-DD')
          }

          let _values = {
            interviewRecord:values,
            results:values.results,
            //type:values.hasSecondPass
            type:that.hasSecondPass
          }

          console.log('Received values of form: ', _values)
          that.spinning = true
          interviewRecordUpdate(_values).then(res =>{
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
            console.log(err)
            that.$message.error('操作失败')
            that.spinning = false
          })
        }
      });
    },
    handleCancel(){
      this.form.resetFields()
      this.$nextTick(() =>this.visible = false)
    },
    async query(type,record){
      let that = this
      that.actionType = type
      that.record = record || {}
      that.form.resetFields()

      await that.init()
      that.visible = true
      handleInterviewRecord({id:that.record.id}).then(res =>{
        console.log(res)
        let data = res.data
        that.secondResult = data.secondResult
        that.hasSecondPass = data.type
        //that.form.setFieldsValue({'hasSecondPass':that.hasSecondPass})
        //that.interviewResult = res.data.interviewResult
        if(Array.isArray(data.interviewResult) && data.interviewResult.length > 0){
          let interviewResult = {}
          data.interviewResult.map((item,index) =>{
            interviewResult[`results.${index}.evaluateScore`] = item.evaluateScore
            interviewResult[`results.${index}.evaluateItem`] = item.evaluateItem
          })
          console.log(interviewResult)
          //填充面试评估
          that.$nextTick(() => that.form.setFieldsValue(interviewResult))
        }
        //data.firstDate = that.moment(data.firstDate)
        try{
          that.secondName = data.secondName || ''
          if(data.secondDate){
            that.secondDate = data.secondDate
          }
          if(data.secondDate){
            data.secondDate = that.moment(data.secondDate)
          }
          if(data.secondDatetime){
            data.secondDatetime = that.moment(data.secondDatetime)
          }
          that.stationName = data.stationName || ''
          that.personName = data.name || ''
          that.personPhoneNo = data.phone || ''
          that.firstUserName = data.firstUserName || ''
          that.firstDate = data.firstDate || ''

        }catch(err){
          console.log(err)
        }
        //填充试用期
        that.isProbationType4 = +data.probationType === 4 ? false : true
        that.$nextTick(() =>{
          //填充其余数据
          delete data.interviewResult
          data.confirmSalary = data.confirmSalary === -1 ? '***' : data.confirmSalary
          that.form.setFieldsValue(data)
          that.calcScores()
        })

        if(data.secondDepartmentId && data.secondId){
          //填充复试人员
          getUserByDep({ departmentId: data.secondDepartmentId}).then(res => { //岗位
            //debugger
            let targetOption = that.departmentOptions.find(item => item.value === data.secondDepartmentId )
            targetOption.children = res.data.map(item =>{
              return {
                label:item.trueName,
                value:item.id,
                isLeaf:true
              }
            })
            that.departmentOptions = [...that.departmentOptions]
            that.$nextTick(() =>{
              that.form.setFieldsValue({secondPersonInfo:[data.secondDepartmentId,data.secondId]})
            })
          }).catch(function (err) {
            console.log(err)
          })
        }



      })
    },
    secondPassChange(key){
      this.hasSecondPass = parseInt(key,10)
    },
    calcScores(e){
      let that = this
      that.$nextTick(() =>{
        let res = that.form.getFieldsValue()
        let results = res.results || []
        that.totalCalcScore = results.reduce((calc,item) =>{
          return calc + (item.evaluateScore || 0)
        },0)
      })
    },
    probationTypeChange(e){
      //考察期需要手动输入
      this.isProbationType4 = parseInt(e,10) === 4 ? false : true
      this.form.setFieldsValue({
        inspectMoth:''
      })
    },
  }
}
</script>

<style scoped>
.interview-record-form-wrapper >>> .ant-form-item{
  display: flex;
}
.interview-record-form-wrapper >>> .ant-form-item-control-wrapper{
  flex: 1;
}

.custom-table-border th,.custom-table-border td{
  padding: 5px 10px;
}

.interview-record-form-wrapper >>> .ant-form-item{
  margin-bottom: 0;
}

.interview-record-form-wrapper >>> .custom-table{
  margin-bottom: 0;
}
.custom-table >>> .custom-table{
  margin: -1px;
}

.interview-record-baseinfo{
  font-size: 20px;
  margin: -10px 0 10px 0
}

.set-pass-score-wrapper >>> .ant-form-item-label{
  width: 140px;
  overflow: hidden;
}
</style>
