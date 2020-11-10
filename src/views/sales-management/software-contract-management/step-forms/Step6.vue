<template>
  <a-spin :spinning="spinning">
    <div class="software-contract-step5-wrapper">
      <div class="content-wrap">
        <div class="top-right clearfix">
          <template v-if="!isView">
            <a-button class="fl-r" type="primary" @click="lastSubmit(1)" icon="backward">预览</a-button>
            <a-button class="fl-r" type="primary" @click="lastSubmit(0)" icon="check">保存</a-button>
          </template>
          <!-- <a-button class="fl-r" type="primary" @click="lastSubmit(1)" icon="backward">预览</a-button>
          <a-button class="fl-r" type="primary" @click="lastSubmit(0)" icon="check">提交</a-button> -->
        </div>
      </div>

      <table class="custom-table custom-table-border">
        <caption>
          补充内容
        </caption>
        <tbody>
          <tr>
            <td style="width: 300px">鲜章</td>
            <td>
              <a-radio-group
                style="width: 100%"
                :disabled="this.$parent.routeParams.action === 'see'"
                @change="freshChaperSelected"
                v-model="isNeedFreshChaper"
              >
                <a-radio :value="0">不要</a-radio>
                <a-radio :value="1">要</a-radio>
              </a-radio-group>
            </td>
          </tr>
          <tr>
            <td style="width: 300px">补充协议</td>
            <td>
              <a-textarea
                :disabled="this.$parent.routeParams.action === 'see'"
                placeholder="请输入补充协议"
                :rows="20"
                :value="supAggrement"
                @change="supAggrementChange($event)"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <a-row type="flex">
        <a-col :span="24" justify="center" align="middle">
          <a-button @click="prevStep">上一步</a-button>
        </a-col>
      </a-row>
    </div>
  </a-spin>
</template>

<script>
import {
  getSoftwareContractQueryOne,
  updateSoftwareContract,
  buildSoftwareContractCreateWork,
} from '@/api/contractListManagement'
export default {
  name: 'Step7',
  components: {},
  props: {
    queryonedata: {
      type: Object,
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      id: 0,
      spinning: false,
      supAggrement: '', //补充协议
      isNeedFreshChaper: 0,
    }
  },
  computed: {
    isView() {
      //查看
      return this.$parent.routeParams.action === 'see'
    },
  },
  watch: {
    $route(to, from) {},
  },
  created() {},
  mounted() {
    this.spinning = false
    this.init()
  },
  methods: {
    init() {
      const that = this
      that.id = that.queryonedata.id
      const params = { id: that.queryonedata.id }
      if (that.id > 0) {
        getSoftwareContractQueryOne(params)
          .then((res) => {
            that.queryOneData = res.data
            that.id = res.data.id
            that.supAggrement = res.data.supAggrement || ''
            that.isNeedFreshChaper = res.data.isNeedFreshChaper || 0
          })
          .catch((error) => {
            console.error(error)
          })
      }
    },
    // 点击提交
    lastSubmit(__actionMode = 0, status) {
      const that = this
      console.log('isNeedFreshChaper:', that.isNeedFreshChaper)
      that.spinning = true
      const params = {
        id: that.queryonedata.id,
        supAggrement: that.supAggrement || '',
        isNeedFreshChaper: that.isNeedFreshChaper,
      }
      if (that.$parent.routeParams.action === 'add') {
        params.contractModifyFlag = 0
      } else if (that.$parent.routeParams.action === 'edit') {
        params.contractModifyFlag = 1
      }
      params.operationFlag = 1
      // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
      updateSoftwareContract(params)
        .then((res) => {
          if (status == 1) {
            that.spinning = false
            that.$message.success('保存成功')
            return
          }
          that.id = res.data.id
          that.loading = false
          //完结提交标志
          that.$parent.__isFinished = true
          // 保存信息成功之后，调取生成合同PDF的接口，留作列表页导出使用
          const paramsc = { id: that.queryonedata.id }
          buildSoftwareContractCreateWork(paramsc)
            .then((res) => {
              that.spinning = false
              console.log('调取生成合同PDF的接口，留作列表页导出使用', res)
              if (__actionMode === 0) {
                //提交 跳转
                that.$router.push({ name: that.$parent.routeParams.from })
              } else {
                //预览跳转
                that.$router.push({
                  name: 'previewSoftwareContract',
                  params: { id: that.queryonedata.id, action: 'edit', from: 'softwareContractList' },
                })
              }
            })
            .catch((error) => {
              console.error(error)
              that.spinning = false
            })
        })
        .catch((error) => {
          console.error(error)
          that.spinning = false
        })
    },
    //切换是否要鲜章选择
    freshChaperSelected(e) {
      this.isNeedFreshChaper = e.target.value
    },
    // 上一步
    prevStep() {
      const id = this.id
      this.$emit('prevStep', id)
    },
    supAggrementChange(e) {
      this.supAggrement = e.target.value
    },
  },
}
</script>

<style scoped>
</style>
