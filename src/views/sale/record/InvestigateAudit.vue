<template>
  <a-modal
    title="审批"
    :width="600"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    v-model="visible">
    <template slot="footer">
      <a-button @click="handleCancel" :loading="confirmLoading">不通过</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleOk">
        通过
      </a-button>
    </template>
    <a-spin :spinning="confirmLoading">
    <!--    <span>-->
    <!--      项目授权书-->
    <!--      致：  {{ tenderingUnitName }}-->
    <!--      江苏万德福公共设施科技有限公司是在中华人民共和国依法登记注册的，其注册地址在江苏省徐州市铜山区张集轻工业园。-->
    <!--      {{ saleCustomerName }}  是在中华人民共和国依法登记注册的，其注册地址在   {{ saleCustomerAddress }}     。-->
    <!--      兹授权   {{ saleCustomerName }}  为我方制造的德澜仕品牌的合法销售商，参加： {{ projectName }}     的投标，项目编号：    {{ projectCode }}     。全权处理与该产品投标的有关事宜，并对我方具有约束力。-->
    <!--      作为制造商，我方承诺，为本次招标提供的货物为原厂制造，合法渠道供应的全新产品。我方保证以投标合作者来约束自己，并对该投标共同承担和分别承担招标文件中所规定的义务。-->
    <!--      本授权书声明：本授权书仅限于该项目相关事宜，项目终止或完成，被授权书自动失效。-->
    <!--      此授权书有效期限：   {{ authorizationStartTime }}——{{ authorizationEndTime }}-->
    <!--      本授权书一式两份，双方各执一份。-->
    <!--      特此授权！-->

    <!--      投标单位：{{ saleCustomerName }}   授权单位：江苏万德福公共设施科                       投标单位名称                 技有限公司-->
    <!--      公章：                       公章：-->
    <!--      日期：                       日期：-->
    <!--    </span>-->

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
        <div style="text-indent:28px;width: 50%;"> 招标单位：<span style="text-decoration:underline;">{{ saleCustomerName }}</span></div>
        <div style="text-indent:28px;width: 50%;">授权单位：江苏万德福公共设施科技有限公司</div>
        <div style="text-indent:28px;width: 50%;"> 公章：</div>
        <div style="text-indent:28px;width: 50%;">公章：  </div>
        <div style="text-indent:28px;width: 50%;"> 日期：</div>
        <div style="text-indent:28px;width: 50%;"> 日期：  </div>
      </div>
    </div>
    <iframe v-else :src="xdocUrl" width='100%' height='600' frameborder="0"></iframe>
    </a-spin>
    <a-modal
      title="不通过"
      @ok="handleOk"
      @cancel="handleCancelTwo"
      :confirmLoading="confirmLoadingTwo"
      :maskClosable="false"
      v-model="visibleTwo">
      <a-spin :spinning="confirmLoadingTwo">
        <a-form :form="form" class="form">
          <a-col>
            <a-form-item
              label="驳回原因">
              <a-input
                placeholder="驳回原因"
                v-decorator="[ 'rejected', {rules: [{ message: '请输入驳回原因', whitespace: true}]} ]"/>
              <a-alert v-if="hidden" type="error" message="请输入驳回原因" banner/>
            </a-form-item>
          </a-col>
        </a-form>
      </a-spin>
    </a-modal>
  </a-modal>

</template>
<script>
import { getInvestigate, auditInvestigate } from '@/api/investigate'
import ACol from 'ant-design-vue/es/grid/Col'

export default {
  name: 'InvestigateAudit',
  components: { ACol },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      confirmLoadingTwo: false,
      queryBoolean: false,
      rejected: '',
      beforeValueBoolean: false,
      hidden: false,
      loading: false,
      visibleTwo: false,
      footer: '',
      saleCustomerName: '',
      saleCustomerAddress: '',
      projectName: '',
      projectCode: '',
      authorizationStartTime: '',
      authorizationEndTime: '',
      tenderingUnitName: '',
      data: {},
      form: this.$form.createForm(this),
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
    qure (e) {
      console.log('InvestigateVue JSON: ' + JSON.stringify(e))
      this.$set(e, 'type', 2)
      this.record = Object.assign({},e) || {}
      getInvestigate(e).then((res) => {
        if (res.code == 200) {
          this.visible = true
          console.log('getInvestigate json' + JSON.stringify(res))
          this.data = res.data
          this.saleCustomerName = res.data.saleCustomerName
          this.saleCustomerAddress = res.data.saleCustomerAddress
          this.projectName = res.data.projectName
          this.projectCode = res.data.projectCode
          this.authorizationStartTime = res.data.authorizationStartTime
          this.authorizationEndTime = res.data.authorizationEndTime
          this.tenderingUnitName = res.data.tenderingUnitName
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleOk (e) {
      let that = this
      this.form.validateFields((err, values) => {

        // debugger
        // console.log(values)
        //
        if (that.beforeValueBoolean) {
          if (values.rejected == undefined || values.rejected == null || values.rejected == '') {
            that.hidden = true
            return
          }
          that.data.approvalStatus = 3
          that.$set(that.data, 'rejected', values.rejected)
        } else {
          that.data.approvalStatus = 2
        }
        console.log(JSON.stringify(that.data))

        if(that.beforeValueBoolean){
          that.confirmLoadingTwo = true
        }else{
          that.confirmLoading = true
        }

        auditInvestigate(that.data).then((res) => {
          if(that.beforeValueBoolean){
            that.confirmLoadingTwo = false
          }else{
            that.confirmLoading = false
          }

          if (res.code == 200) {
            that.form.resetFields()
            that.$emit('close')
            that.visible = false
            that.visibleTwo = false
          } else {
            that.$message.error(res.msg)
          }
        }).catch(err =>{
          if(that.beforeValueBoolean){
            that.confirmLoadingTwo = false
          }else{
            that.confirmLoading = false
          }
        })
      })
    },
    handleCancel (e) {
      console.log('handleCancel e' + JSON.stringify(e))
      console.log('handleCancel :' + JSON.stringify(this.data))
      this.hidden = false
      this.visibleTwo = true
      this.beforeValueBoolean = true
    },
    handleCancelTwo (e) {
      this.form.resetFields()
    }
  }
}
</script>
