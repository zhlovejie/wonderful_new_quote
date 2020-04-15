<template>
  <a-modal
    title="查看"
    :width="700"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    :footer="null"
    v-model="visible">
    <div style="font-size: 14px;" v-if="record.templateType === 1">
      <h3 style="width: 100%;text-align: center;font-size: 20px;color: #000;">项目授权书</h3>
      <p>致：<span style="text-decoration:underline;">{{ tenderingUnitName }}</span></p>
      <p style="text-indent:28px;">江苏万德福公共设施科技有限公司是在中华人民共和国依法登记注册的，其注册地址在江苏省徐州市铜山区张集轻工业园。</p>
      <p style="text-indent:28px;"><span style="text-decoration:underline;">{{ saleCustomerName }}</span> 是在中华人民共和国依法登记注册的，其注册地址在 <span style="text-decoration:underline;">{{ saleCustomerAddress }}</span> 。</p>
      <p style="text-indent:28px;">兹授权 <span style="text-decoration:underline;">  {{ saleCustomerName }} </span> 为我方制造的德澜仕品牌的合法销售商，参加：<span style="text-decoration:underline;">{{ projectName }} </span> 的投标，项目编号：<span style="text-decoration:underline;"> {{ projectCode }} </span>。全权处理与该产品投标的有关事宜，并对我方具有约束力。</p>
      <p style="text-indent:28px;">作为制造商，我方承诺，为本次招标提供的货物为原厂制造，合法渠道供应的全新产品。我方保证以投标合作者来约束自己，并对该投标共同承担和分别承担招标文件中所规定的义务。</p>
      <p style="text-indent:28px;">本授权书声明：本授权书仅限于该项目相关事宜，项目终止或完成，被授权书自动失效。</p>
      <p style="text-indent:28px;">此授权书有效期限： {{ authorizationStartTime }} 至 {{ authorizationEndTime }}</p>
      <p style="text-indent:28px;">本授权书一式两份，双方各执一份。</p>
      <p style="text-indent:28px;">特此授权！</p>

      <div style="margin-top: 20px;margin-bottom: 80px;display: flex;flex-direction:row;align-content:center;flex-wrap:wrap;">
        <div style="text-indent:28px;width: 50%;">招标单位：<span style="text-decoration:underline;">{{ saleCustomerName }}</span></div>
        <div style="text-indent:28px;width: 50%;">授权单位：江苏万德福公共设施科技有限公司</div>
        <div style="text-indent:28px;width: 50%;"> </div>
        <div style="text-indent:28px;width: 50%;">授权人：  </div>
        <div style="text-indent:28px;width: 50%;"> 公章：</div>
        <div style="text-indent:28px;width: 50%;">公章：  </div>
        <div style="text-indent:28px;width: 50%;"> 日期：</div>
        <div style="text-indent:28px;width: 50%;"> 日期：  </div>
      </div>
      <div v-if="approvalStatus === 2" style="text-align: center;">
        <a-button type="primary" icon="download" @click="downloadDoc">下载</a-button>
      </div>
    </div>
    <iframe v-else :src="xdocUrl" width='100%' height='600' frameborder="0"></iframe>
  </a-modal>
</template>
<script>
import { getInvestigate } from '@/api/investigate'

export default {
  name: 'InvestigateVue',
  data () {
    return {
      visible: false,
      confirmLoading: false,
      queryBoolean: false,
      footer: '',
      saleCustomerName: '',
      saleCustomerAddress: '',
      projectName: '',
      projectCode: '',
      authorizationStartTime: '',
      authorizationEndTime: '',
      tenderingUnitName: '',
      wordUrl:'',
      approvalStatus: 0,
      record:{}
    }
  },
  computed:{
    xdocUrl(){
      let _fileType = (url) =>{
        let sf = ''
        url = String(url)
        url = url.trim()
        let _url = url.split('?')[0]
        let _index = _url.lastIndexOf('.')
        sf = _index >= 0 ? _url.slice(_url.lastIndexOf('.')) : ''
        sf = sf.toLocaleLowerCase()
        return {
          isPDF:sf === '.pdf',
          isDOC:sf === '.doc' || sf === '.docx'
        }
      }
      let res = _fileType(this.record.wordUrl)
      if(res.isPDF){
        return this.record.wordUrl
      }else if(res.isDOC){
        let baseUrl = 'http://view.officeapps.live.com/op/view.aspx?src='
        return baseUrl + encodeURIComponent(this.record.wordUrl)
      }else{

      }
    }
  },
  methods: {
    qure (record) {
      this.visible = true
      this.wordUrl = ''
      this.approvalStatus = record.approvalStatus
      this.record = Object.assign({},record)
      getInvestigate({id:this.record.id,type:1}).then((res) => {
        this.saleCustomerName = res.data.saleCustomerName
        this.saleCustomerAddress = res.data.saleCustomerAddress
        this.projectName = res.data.projectName
        this.projectCode = res.data.projectCode
        this.authorizationStartTime = res.data.authorizationStartTime
        this.authorizationEndTime = res.data.authorizationEndTime
        this.tenderingUnitName = res.data.tenderingUnitName
        this.wordUrl = res.data.wordUrl
      })
    },
    downloadDoc:function(){
      window.location.href = this.wordUrl
    }

  }
}
</script>
