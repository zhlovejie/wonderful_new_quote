<template>
  <a-spin :spinning="spinning" :tip="spinningTip">
  <div class="customer-list-wrapper">
  <table class="custom-table custom-table-border" style="margin-bottom:0;">
    <tr>
      <td style="width:150px;">资质认证</td>
      <td>
        <a-input
          read-only
          placeholder="点击选择资质认证"
          @click="showModule('enterpriseQualificationSelectModel')"
        />
      </td>
    </tr>
  </table>
  <EnterpriseQualificationSelectView ref="enterpriseQualificationSelectView" @change="selectAction" :qualificationList="selectedRows"/>

  <div style="text-align:center;margin-top:10px;">
    <a-button type="primary" :disabled="selectedRows.length === 0" icon="check" @click="doAction('download')" style="margin:0 10px;">下载</a-button>
    <a-button type="primary" :disabled="selectedRows.length === 0" icon="reload" @click="doAction('reset')" style="margin:0 10px;">重置</a-button>
  </div>

  <EnterpriseQualificationSelect ref="enterpriseQualificationSelectModel" @select="selectAction"/>
  </div>
  </a-spin>
</template>

<script>
import EnterpriseQualificationSelect from '../modules/EnterpriseQualificationSelect'
import EnterpriseQualificationSelectView from '../modules/EnterpriseQualificationSelectView'
import EnterpriseQualificationSelectDownload from '../modules/EnterpriseQualificationSelectDownload'
import { enterpriseQualificationDownload,makeDownloadUrl} from '@/api/OperationalScheme'
export default {
  name:'EnterpriseQualification',
  components:{
    EnterpriseQualificationSelect,
    EnterpriseQualificationSelectView,
    EnterpriseQualificationSelectDownload
  },
  data(){
    return {
      selectedRows:[],
      spinning:false,
      spinningTip:'正在生成word文档...'
    }
  },
  methods:{
    showModule(key){
      this.$refs[key] && this.$refs[key].query()
    },
    selectAction(selectedRows){
      this.selectedRows = [...selectedRows]
    },
    doAction(type){
      let that = this
      if(type === 'download'){
        let param = this.selectedRows.map(item =>{
          return {
            id:item.id,
            qualificationName:item.qualificationName,
            qualificationPicture:item.qualificationPicture
          }
        })
        that.spinning = true
        enterpriseQualificationDownload(param,param.length * 30 * 1000).then(res =>{
          that.spinning = false
          //console.log(res)
          //res.data
          window.location.href = makeDownloadUrl(res.data)
        }).catch((err) =>{
           //console.log(err)
           that.$message.error(err.message)
        }).finally(() => that.spinning = false)
      }
      if(type === 'reset'){
        this.selectedRows = []
      }
    }
  }
}
</script>

<style scoped>
  .customer-list-wrapper{
    width: 1000px;
    margin:0 auto;
    padding: 20px;
    background: #fff;
  }
</style>