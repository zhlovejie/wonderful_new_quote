<template>
  <a-modal 
  title="排班" 
  v-model="visible" 
  :width="1300"  
  :maskClosable="false"
  @ok="handleOk"
  @cancel="handleCancel"
  >
  <a-spin :spinning="spinning">
    <div class="paiban-wrapper">
      <a-row>
        <a-col :span="8">
          <a-month-picker 
            style="width:100%;" 
            placeholder="开始时间"
            v-model="arrangeMonth" 
            @change="arrangeMonthChange"
          />
        </a-col>
      </a-row>

      <div class="paiban-main" style="margin-top:20px;">
        <table class="custom-table custom-table-border">
          <tr style="background-color:#f0f0f0;">
            <td style="width:65px;">姓名</td>
            <td style="width:36px;" v-for="col in columns" :key="col._key" >
              <a-popover title="设置班次" trigger="click">
                <a slot="content" >
                  <a-radio-group :options="plainOptions" @change="settingPaiBan(col.key,null,$event)" />
                </a>
                <span v-html="col.title"></span>
              </a-popover>
            </td>
          </tr>
          <tr v-for="(item,index) in usersView" :key="item.key">
            <td style="width:65px;">{{item.userName}}</td>
            <td 
              style="width:36px;" 
              :class="{'setting-default':+item[col.key]['type'] === 1,'setting-xiu':+item[col.key]['type'] === 2,'setting-empty':+item[col.key]['type'] === 0}" 
              v-for="col in columns" 
              :key="`${item.key} + ${col._key}`"
            >
              <a-popover title="设置班次" trigger="click">
                <a slot="content" >
                  <a-radio-group :options="plainOptions" @change="settingPaiBan(col.key,index,$event)" />
                </a>
                {{ {1:'默认班次',2:'休',0:'空'}[item[col.key]['type']]}}  
              </a-popover>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </a-spin>
  </a-modal>
</template>
<script>

import {attenceArrangeDoArrange ,attenceArrangeUserList} from '@/api/attendanceManagement'
import moment from 'moment'

let uuid = () => Math.random().toString(32).slice(-10)
export default {
  name:'over-time-rule-paiban',
  components:{},
  data(){
    return {
      visible:false,
      arrangeMonth:moment(),
      users:[],
      usersView:[],
      columns:[],
      plainOptions:[
        {label:'默认班次',value:1},
        {label:'休息',value:2},
        {label:'清空',value:0},
      ],
      record:{},
      spinning:false
    }
  },
  methods:{
    async query(type,record){
      let that = this
      this.visible = true
      this.record = Object.assign({},record)
      

      await that.fetchUsers()

      that.renderPaiBan()
    },
    handleOk(){
      let that = this
      let values = {}
      values.id = that.record.id
      values.attanceId = that.record.id
      values.arrangeMonth = that.arrangeMonth.format('YYYY-MM')
      values.arrangeUsers = that.usersView.map(usr =>{
        let restDays = []
        Object.keys(usr).map(k =>{
          if(usr[k] && +usr[k].type === 2){
            restDays.push(`${values.arrangeMonth}-${String('0'+usr[k].date).slice(-2)}`)
          }
        })
        return {
          userId:usr.userId,
          restDays:restDays.join(',')
        }
      })
      console.log(values)
      //return
      that.spinning = true
      attenceArrangeDoArrange(values)
        .then(res => {
          that.spinning = false
          console.log(res)
          that.visible = false
          that.$message.info(res.msg)
          if(res.code === 200){
            that.$emit('finish')
          }
        })
        .catch(err => (that.spinning = false))
    },
    handleCancel(){
      this.visible = false
    },
    async arrangeMonthChange(m){
      let that = this
      that.arrangeMonth = m
      await that.fetchUsers()
      that.renderPaiBan()
    },
    fetchUsers(){
      let that = this
      let _arrangeMonth = that.arrangeMonth ? that.arrangeMonth.format('YYYY-MM') : undefined
      if(!_arrangeMonth){
        return
      }
      let param = {arrangeMonth:_arrangeMonth,attanceId:that.record.id}
      return attenceArrangeUserList(param).then(res =>{
        that.users = res.data || []
        //debugger
        //修改 回显填充日期
        if(Array.isArray(res.data) && res.data.length > 0 && res.data[0].arrangeMonth !== null){
          that.arrangeMonth = moment(res.data[0].arrangeMonth+'-01')
        }
      })
    },
    renderPaiBan(){
      //debugger
      let that = this
      let result = []
      if(that.arrangeMonth){
        let pb = that.initDate(that.arrangeMonth.clone())
        that.columns = pb.columns
        that.users.map((u,idx) =>{
          let _pbObj = JSON.parse(JSON.stringify(pb.obj))

          //修改回显
          let restDays = (u.restDays || '').split(',') //休息日列表
          .map(str => {
            let m = moment(str)
            return m.isValid() ? m.date() : null
          })
          .filter(m => m !== null)

          if(restDays.length > 0){
            Object.keys(_pbObj).map(k =>_pbObj[k]['type'] = 1) //先都设置为工作日
            restDays.map(m => _pbObj[m]['type'] = 2) //符合的设置为休息日
          }
          //修改回显 END
          
          result.push(Object.assign(
            {},
            _pbObj,
            u,
            {key:uuid()}
          ))
        })
      }else{
        that.columns = []
      }
      this.usersView = result
    },
    initDate(m){ //初始化数据结构 和 列头
      let obj ={}
      let columns = []
      let daysInMonth = m.daysInMonth()
      m.startOf('months').add(-1,'days')
      let weekMap = ["", "一", "二", "三", "四", "五", "六","日"]
      for(let i=0,len = daysInMonth;i<len;i++){
        m.add(1,'days')
        let _date = m.date()
        let _week = weekMap[m.isoWeekday()]
        obj[_date] = {
          date:_date,
          week:_week,
          type:['六','日'].includes(_week) ? 2 : 1
        }
        columns.push({
          _key:uuid(),
          key:_date,
          title:`<span>${_date}<br/>${_week}</span>`
        })
      }
      return {obj,columns}
    },
    settingPaiBan(colIndex,rowIndex,event){
      let _usersView = JSON.parse(JSON.stringify(this.usersView))
      if(rowIndex === null ){ //设置一列
        _usersView.map(user =>{
          user[colIndex].type = event.target.value
        })
        this.usersView = [..._usersView]
      }else{ //设置单列
        let record = _usersView[rowIndex]
        record[colIndex].type = event.target.value
        this.usersView = [..._usersView]
      }
    }
  }
}
</script>
<style scoped>
.custom-table-border th,.custom-table-border td{
  padding: 5px;
  font-size: 10px;
  cursor: pointer;
}
.setting-default{
  background: #1890ff;
  color: #fff;
}
.setting-xiu{
  /* background: #fb0; */
  color: #fb0;
}
.setting-empty{
  /* background: #; */
  color: #f43;
}
</style>