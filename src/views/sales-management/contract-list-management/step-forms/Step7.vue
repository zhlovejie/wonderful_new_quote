<template>
  <a-spin :spinning="spinning">
  <div class="content-wrap">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="lastSubmit(1)" icon="backward">预览</a-button>
      <a-button class="fl-r" type="primary" @click="lastSubmit(0)" icon="check">保存</a-button>
    </div>
    <div>
      <a-row>
        <a-col :span="24" class="basic-tit" justify="center" align="middle">附加条款</a-col>
      </a-row>
      <a-form
        :form="form"
        @submit="handleSubmit"
        class="form wdf-form"
      >
        <a-form-item
        >
          <a-row class="wdf-row">
            <a-col class="col-border" :span="4" justify="center" align="middle">附加条款</a-col>
            <a-col class="col-border" :span="20" justify="center" align="middle">
              <a-textarea
                style="height: 250px"
                type="text"
                v-decorator="['additionalTreaty',
                              {rules: [{ required: false, message: '附加条款' }]}]" />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item class="btns-grop" style="border-left: none">
          <a-button style="margin-left: 8px;" @click="prevStep">上一步</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
  </a-spin>
</template>

<script>
import { getQueryOne, saveAdditionalClause, buildCreateWork, deleteQueryOne } from '@/api/contractListManagement'
export default {
  name: 'Step7',
  components: {},
  props: {
    queryonedata: {
      type: Object
    }
  },
  data () {
    return {
      // form
      form: this.$form.createForm(this),
      loading: false,
      timer: 0,
      id: 0,
      spinning:false
    }
  },
  computed: {},
  watch: {
    $route (to, from) {
      if (to.fullPath === '/sales-management/contract-list-management/distributionContractList') {
        this.currentTab = 0
      }
    }
  },
  created () {},
  mounted () {
    this.spinning = false
    this.init()
  },
  methods: {
    init () {
      const that = this
      that.id = that.queryonedata.id
      const params = { id: that.queryonedata.id }
      if(that.id > 0){
        getQueryOne(params).then(res => {
          that.queryOneData = res.data
          that.form.setFieldsValue({
            id: this.queryOneData.id || 0,
            additionalTreaty: this.queryOneData.otherInfo.additionalTreaty || ''
          })
          that.contractId = this.queryOneData.id
          that.id = this.queryOneData.id
          that.contractId = res.data.id
          that.additionalTreaty = res.data.otherInfo.additionalTreaty
        }).catch(error => {
          console.error(error)
        })
      }else{
        try{
          that.form.setFieldsValue({
            id: this.queryonedata.id || 0,
            additionalTreaty: this.queryonedata.otherInfo.additionalTreaty || ''
          })
        }catch(err){}
      }

    },
    // handler 表单数据验证成功后回调事件
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('收到 values of form: ', values)
        }
      })
    },
    // 点击提交
    lastSubmit (__actionMode = 0,status) {

      const that = this
      that.spinning = true
      const { form: { validateFields } } = this
      console.log('{ form: { validateFields } } = this', this)
      // 先校验，通过表单校验后，才进入下一步

      validateFields((err, values) => {
        console.log('先校验，通过表单校验后，才进入下一步', values)
        if (!err) {
          const params = {
            contractId: that.queryonedata.id,
            additionalTreaty: values.additionalTreaty
          }
          if(that.$parent.routeParams.action === 'add'){
            console.log('新增模式 添加参数 contractModifyFlag：0')
            params.contractModifyFlag = 0
          }else if(that.$parent.routeParams.action === 'edit'){
            console.log('修改模式 添加参数 contractModifyFlag：1')
            params.contractModifyFlag = 1
          }else if(that.$parent.routeParams.action === 'split'){
            console.log('拆分模式 添加参数 contractModifyFlag：3')
            params.contractModifyFlag = 3
          }
          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          saveAdditionalClause(params).then((res) => {
            if(status == 1){
              that.spinning = false
              that.$message.success('保存成功')
              return;
            }
            console.log('校验成功，保存填写的信息，请求后端接口结果', res)
            that.id = res.data.id
            that.loading = false

            //完结提交标志
            that.$parent.__isFinished = true

            // 保存信息成功之后，调取生成合同PDF的接口，留作列表页导出使用
            const paramsc = {
              id: that.queryonedata.id
            }
            buildCreateWork(paramsc).then((res) => {

              that.spinning = false
              console.log('调取生成合同PDF的接口，留作列表页导出使用', res)
              if(__actionMode === 0){ //提交 跳转
                that.$router.push({ name: that.$parent.routeParams.from ,params:{ ...that.$parent.routeParams} })
              }else{ //预览跳转
                let id = that.queryonedata.id
                if (that.queryonedata.contractAttribute === 1) { // 选择三方合同
                  that.$router.push({ name: 'previewTripartiteContract', params: { queryOneData: that.queryonedata , action: 'edit' } })
                } else {
                  if (that.queryonedata.isTax === 1) { // 含税--选择销售合同
                    that.$router.push({ name: 'previewSalesContract', params: { queryOneData: that.queryonedata , action: 'edit' } })
                  } else {
                    that.$router.push({ name: 'previewProductOrderForm', params: { queryOneData: that.queryonedata , action: 'edit' } })
                  }
                }
              }
            }).catch(error => {
              console.error(error)
            })


            //that.$router.push({ name: 'distributionContractList' }) // 提交之后跳转到销售合同列表页

          }).catch(error => {
            console.error(error)
            that.spinning = false
          })
        }else{
          that.spinning = false
        }
      })
    },
    // 上一步
    prevStep () {
      const id = this.id
      this.$emit('prevStep', id)
    },
    // 预览
    prevView () {
      const that = this
      const { form: { validateFields } } = this
      console.log('{ form: { validateFields } } = this', this)
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        console.log('先校验，通过表单校验后，才进入下一步', values)
        if (!err) {
          const params = {
            contractId: that.queryonedata.id,
            additionalTreaty: values.additionalTreaty
          }

          if(that.$parent.routeParams.action === 'add'){
            console.log('新增模式 添加参数 contractModifyFlag：0')
            params.contractModifyFlag = 1
          }else if(that.$parent.routeParams.action === 'edit'){
            console.log('修改模式 添加参数 contractModifyFlag：1')
            params.contractModifyFlag = 1
          }else if(that.$parent.routeParams.action === 'split'){
            console.log('拆分模式 添加参数 contractModifyFlag：3')
            params.contractModifyFlag = 3
          }

          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          saveOtherInfo(params).then((res) => {
            console.log('校验成功，保存填写的信息，请求后端接口结果', res)
            that.id = res.data.id
            that.loading = false
            const id = that.queryonedata.id
            // 保存信息成功之后，调取生成合同PDF的接口，留作列表页导出使用
            const paramsc = {
              id: that.queryonedata.id
            }
            buildCreateWork(paramsc).then((res) => {
              console.log('调取生成合同PDF的接口，留作列表页导出使用', res)
            }).catch(error => {
              console.error(error)
            })

            if (that.contractAttribute === 1) { // 选择三方合同
              that.$router.push({ name: 'previewTripartiteContract', params: { id: id } })
            } else {
              if (that.isTax === 0) { // 含税--选择销售合同
                that.$router.push({ name: 'previewSalesContract', params: { queryOneData: this.queryonedata } })
              } else {
                that.$router.push({ name: 'previewProductOrderForm', params: { id: id } })
              }
            }
          }).catch(error => {
            console.error(error)
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .wdf-row{
    border: 1px solid #ddd;
  }
  .col-border{
    border: 1px solid #ddd;
    padding: 10px;
    border-bottom: none;
    min-height: 60px;
    box-sizing: border-box;
  }
  .wdf-form{
    margin-top: 12px;
    padding: 12px;
  }
  .btns-grop {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 24px;
  }
  .btns-grop button:not(first-child) {
    margin-left: 12px;
  }
  .ant-row.ant-form-item{
    margin-bottom: 0;
  }
</style>
