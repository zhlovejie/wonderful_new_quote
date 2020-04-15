<template>
  <div class="content-wrap">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="goBack" icon="backward">返回</a-button>
      <a-button class="fl-r" type="primary" @click="prevView" icon="backward">预览</a-button>
      <a-button class="fl-r" type="primary" @click="lastSubmit" icon="check">提交</a-button>
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
      id: 0
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
    this.init()
  },
  methods: {
    init () {
      const that = this
      that.id = that.queryonedata.id
      const params = { id: that.queryonedata.id }
      getQueryOne(params).then(res => {
        that.queryOneData = res.data
        that.form.setFieldsValue({
          id: this.queryonedata.id || 0,
          additionalTreaty: this.queryonedata.additionalTreaty || ''
        })
        that.contractId = this.queryonedata.id
        that.id = this.queryonedata.id
        that.contractId = res.data.id
        that.additionalTreaty = res.data.additionalTreaty
      }).catch(error => {
        console.error(error)
      })
      that.form.setFieldsValue({
        id: this.queryonedata.id || 0,
        additionalTreaty: this.queryonedata.additionalTreaty || ''
      })
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
    lastSubmit () {
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
          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          saveAdditionalClause(params).then((res) => {
            console.log('校验成功，保存填写的信息，请求后端接口结果', res)
            that.id = res.data.id
            that.loading = false
            // 保存信息成功之后，调取生成合同PDF的接口，留作列表页导出使用
            const paramsc = {
              id: that.queryonedata.id
            }
            buildCreateWork(paramsc).then((res) => {
              console.log('调取生成合同PDF的接口，留作列表页导出使用', res)
            }).catch(error => {
              console.error(error)
            })
            that.$router.push({ name: 'distributionContractList' }) // 提交之后跳转到销售合同列表页
          }).catch(error => {
            console.error(error)
          })
        }
      })
    },
    // 上一步
    prevStep () {
      const id = this.id
      this.$emit('prevStep', id)
    },
    // 返回
    goBack () {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `确定要放弃本条合同的创建吗?`,
        okText: '确定',
        cancelText: '取消',
        onOk () {
          // 在这里调用删除接口
          const params = { id: _this.queryonedata.id }
          deleteQueryOne(params).then((res) => {
            if (res.code == 200) {
              _this.$message.info('删除合同编辑成功')
              _this.$router.push({ name: 'distributionContractList' })
            } else {
              _this.$message.error(res.msg)
            }
          })
          console.log('OK')
        },
        onCancel () {
          console.log('Cancel')
        }
      })
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
