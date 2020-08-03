<template>
<a-modal
    title="财务状态"
    :width="600"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-form class="wdf-custom-add-form-wrapper">
      <table class="custom-table custom-table-border">
        <tr>
          <td>出差人员</td>
          <td>财务状态</td>
        </tr>
        <tr v-for="u in userFinanceStatus" :key="u.key">
          <td>{{u.userName}}</td>
          <td >
            <a-form-item style="display:inline-block;">
              <a-radio-group 
                v-if="+record.financeStatus === 0"
                :options="plainOptions" 
                :value="String(u.financeStatus)"
                @change="(val) => radioChange(u.key,val)"
              />
              <span v-else>已完结</span>
            </a-form-item>
          </td>
        </tr>
      </table>
    </a-form>
  </a-modal>
</template>

<script>
import {
  attenceTravelApplyFinanceFinish, //财务完结
  attenceTravelUserGetUsersForTravel, //根据出差单获取该出差单里的所有出差人员
} from '@/api/attendanceManagement'

let uuid = () =>Math.random().toString(32).slice(-10)
export default {
  name:'FinanceForm',
  data(){
    return {
      visible:false,
      record:{},
      plainOptions:[
        { label:'未完结',value:'0' },
        { label:'已完结',value:'1' }
      ],
      userFinanceStatus:[]
    }
  },
  methods:{
    query(record){
      let that = this
      that.visible = true
      that.record = that.$_.cloneDeep(record || {})
      that.userFinanceStatus = []
      attenceTravelUserGetUsersForTravel({travelId:that.record.id}).then(res =>{
        that.userFinanceStatus = res.data.map(u =>{
          let item = Object.assign({},u,{key:uuid()})
          if(+item.financeStatus === 0){
            item.canUpdate = true
          }
          return item
        })
      })
    },
    handleOk(){
      let that = this
      let queue = []
      that.userFinanceStatus.map(u =>{
        if(u.canUpdate &&  +u.financeStatus === 1){
          //let values = {id:that.record.id,userId:u.userId}
          let values = `id=${that.record.id}&userId=${u.userId}`
          queue.push(
            attenceTravelApplyFinanceFinish(values).then(res =>{
              console.log({id:that.record.id,userId:u.userId},'==>',res)
              return {
                input:Object.assign({},u),
                out:res
              }
            })
          )
        }
      })
      if(queue.length > 0){
        Promise.all(queue).then((res) =>{
          if(res.every(item => item.out.code === 200)){
            that.$message.info('操作成功')
            that.handleCancel()
            that.$emit('finish')
            return
          }else{
            const h = that.$createElement
            let msgNodes = []
            res.filter(item => item.out.code !== 200).map(item =>{
              msgNodes.push(h('p',`[${item.input.userName}]执行财务完结操作失败`))
            })
            that.$info({
              title: '提示信息',
              content: h('div', {}, msgNodes),
              onOk() {},
            })
          }
        }).catch(err =>{
          console.log(err)
        })
        return
      }
      that.handleCancel()
    },
    handleCancel(){
      let that = this
      that.visible = false
    },
    radioChange(key,event){
      let _userFinanceStatus = [...this.userFinanceStatus]
      let target = _userFinanceStatus.find(u => u.key === key)
      if(target){
        target.financeStatus = event.target.value
        this.userFinanceStatus = _userFinanceStatus
      }
    }
  }
}
</script>

<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item{
  display:flex;
  margin: 0;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}
</style>