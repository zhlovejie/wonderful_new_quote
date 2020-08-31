<template>
  <div class="content-wrap">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="danger" @click="goBackAction" icon="left">返回</a-button>
      <a-button class="fl-r" type="danger" @click="saveStep">保存当前信息</a-button>
    </div>
    <div class="content">
      <step1
        v-if="currentTab === 0"
        ref="step1"
        key="step1"
        @nextStep="nextStep"
        :queryonedata="queryonedata"
      />
      <!-- <step2
        v-if="currentTab === 1"
        ref="step2"
        key="step2"
        @nextStep="nextStep"
        @prevStep="prevStep"
        :queryonedata="queryonedata"
      />
      <step3
        v-if="currentTab === 2"
        ref="step3"
        key="step3"
        @nextStep="nextStep"
        @prevStep="prevStep"
        :queryonedata="queryonedata"
      />
      <step4
        v-if="currentTab === 3"
        ref="step4"
        key="step4"
        @nextStep="nextStep"
        @prevStep="prevStep"
        :queryonedata="queryonedata"
      />
      <step5
        v-if="currentTab === 4"
        ref="step5"
        key="step5"
        @nextStep="nextStep"
        @prevStep="prevStep"
        :queryonedata="queryonedata"
      />
      <step6
        v-if="currentTab === 5"
        ref="step6"
        key="step6"
        @nextStep="nextStep"
        @prevStep="prevStep"
        :queryonedata="queryonedata"
      />
      <step7
        v-if="currentTab === 6"
        ref="step7"
        key="step7"
        @prevStep="prevStep"
        @finish="finish"
        :queryonedata="queryonedata"
      />-->
    </div>
    <a-card :bordered="false">
      <a-steps class="steps" :current="currentTab">
        <a-step title="物流信息" />
        <a-step title="承运方" />
        <a-step title="货物信息" />
        <a-step title="驾驶员信息" />
        <a-step title="货物合同" />
        <!-- <a-step title="其他信息" />
        <a-step :class="{ active: isActive }" title="附加条款" />-->
      </a-steps>
    </a-card>
  </div>
</template>

<script>
import { getQueryOne, deleteQueryOne, delSplitProductTemp } from '@/api/contractListManagement'

import moment from 'moment'
import Step1 from './Step1'
// import Step2 from './Step2'
// import Step3 from './Step3'
// import Step4 from './Step4'
// import Step5 from './Step5'
// import Step6 from './Step6'
// import Step7 from './Step7'
export default {
  name: 'BasicInform',
  components: {
    Step1,
    // Step2,
    // Step3,
    // Step4,
    // Step5,
    // Step6,
    // Step7,
  },
  props: {},
  data() {
    return {
      form: this.$form.createForm(this),
      signDate: {
        rules: [{ type: 'object', required: true, message: '请选择日期!' }],
      },
      currentTab: 0, // tab切换，当前tab
      contractNum: '', // 合同编号
      saleCustomers: {}, // 客户名称数组
      customerId: 0, // 客户id
      saleUser: {}, // 销售经理名称列表
      saleUserId: 0, // 选中的销售经理id
      signDate: moment(), // 签订日期, 默认今天
      disabled: false, // 是否含税启用/禁用
      id: 0, // 这个是主键id,名称是唯一的，要在7个组件中都能使用，别的地方不要定义成id
      queryonedata: {}, // 这是获取到的单个节点所有返回数据，要通过父组件传给子组件
      isActive: true, // 第七步是否隐藏
      contractAttribute: 0,
      routeParams: {
        //路由参数
        id: null, //合同编号
        action: 'add', //来源 新增 add  修改 edit 拆分 split
        from: 'distributionContractList', //处理完跳转的路由名称
      },
      __isFinished: false, //完结提交标志
      show: false,
    }
  },
  watch: {
    $route(to, from) {
      console.log('from.fullPath--------', from.fullPath)
      //   if (from.fullPath === '/sales-management/contract-list-management/distributionContractList') {
      //     this.currentTab = 0
      //   }
      //   if (to.name === 'basicInformation1') {
      //     this.currentTab = 0
      //     this.__isFinished = false
      //     this.routeParams = Object.assign({}, this.routeParams, this.$route.params)
      //     if (this.routeParams.show) {
      //       this.show = this.routeParams.show
      //     }
      //     if (this.routeParams.id) {
      //       this.id = this.routeParams.id
      //       this.resetQueryonedata(this.routeParams.id)
      //     }
      //   }
    },
  },
  beforeRouteLeave(to, from, next) {
    //用户未点击删除按钮，离开此页面 自动触发删除订单操作
    try {
      if (from.name === 'basicInform' && !this.__isFinished) {
        // this.goBackActionSilent()
      }
    } catch (err) {
      console.log(err)
    }
    next()
  },
  mounted() {
    this.currentTab = 0
    this.routeParams = Object.assign({}, this.routeParams, this.$route.params)
    this.__isFinished = false
    if (this.routeParams.show) {
      this.show = this.routeParams.show
    }
    if (this.routeParams.id) {
      this.id = this.routeParams.id
      this.resetQueryonedata(this.routeParams.id)
    }
  },
  methods: {
    // 返回
    // goBack(){
    //   this.$router.push({name:'distributionContractList'})
    //   this.currentTab===0
    // },
    // 点击下一步
    nextStep(data) {
      this.id = data.id
      this.queryonedata = { ...this.queryonedata, ...data }
      if (this.currentTab < 7) {
        this.currentTab = this.currentTab + 1
      }
      if (this.queryonedata.contractAttribute === 0) {
        this.isActive = true
      } else {
        this.isActive = false
      }
      console.log('isActive', this.isActive)
    },
    //当点击保存按钮时，保存当前页输入信息，不跳入下一步
    saveStep() {
      switch (this.currentTab) {
        case 0:
          this.$refs.step1.nextStep(1)
          break
        case 1:
          this.$refs.step2.nextStep(1)
          break
        case 2:
          this.$refs.step3.nextStep(1)
          break
        case 3:
          this.$refs.step4.nextStep(1)
          break
        case 4:
          this.$refs.step5.nextStep(1)
          break
        case 5:
          this.$refs.step6.nextStep(1)
          break
        case 6:
          this.$refs.step7.lastSubmit(0, 1)
          break
      }
    },
    // handler
    prevStep(e) {
      console.log('点击上一步，相当于修改操作,带过来的参数', e)
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
      // 点击上一步，相当于修改操作
      // const params={id:e}
      const params = { id: this.queryonedata.id }
      console.log('点击上一步传入的参数', params)
      getQueryOne(params)
        .then((res) => {
          console.log('点击上一步,请求的结果', res)
          this.queryonedata = res.data
          console.log('这个是父页面的打印，要传入到子页面的数据对象', this.queryonedata)
        })
        .catch((error) => {
          console.error(error)
        })
    },

    resetQueryonedata(id) {
      console.log('resetQueryonedata called...')
      getQueryOne({ id: id })
        .then((res) => {
          this.queryonedata = res.data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    finish() {
      this.currentTab = 0
    },
    goBackAction() {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `确定放弃新增物流信息登记?`,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          // 在这里调用删除接口
          //   if (_this.queryonedata && _this.queryonedata.id) {
          //     const params = { id: _this.queryonedata.id }
          // if (_this.routeParams.action === 'add') {
          //   //新增
          //   params.contractModifyFlag = 0
          // } else if (_this.routeParams.action === 'edit') {
          //   //驳回修改
          //   params.contractModifyFlag = 1
          // } else if (_this.routeParams.action === 'split') {
          //   //拆分修改
          //   params.contractModifyFlag = 1
          // }
          //     deleteQueryOne(params)
          //       .then((res) => {
          //         if (res.code == 200) {
          //           if (_this.routeParams.action === 'add') {
          //             _this.$message.info('删除合同编辑成功')
          //           }
          //           console.log('contractId====', _this.id)
          //           console.log('show====', _this.show)
          //           //_this.$router.push({ name: _this.routeParams.from, params: { contractId: _this.id, show: _this.show } }) //新增修改走此路由
          //           _this.$router.push({ name: _this.routeParams.from, params: { ..._this.routeParams } })
          //         } else {
          //           _this.$message.error(res.msg)
          //         }
          //       })
          //       .catch((err) => {
          //         console.log(err)
          //         _this.$router.push({ name: _this.routeParams.from, params: { ..._this.routeParams } })
          //       })
          //     // const splitParams = {contractId:_this.queryonedata.id}
          //     // if(_this.routeParams.action === 'split'){
          //     //   Promise.all([
          //     //     delSplitProductTemp(splitParams),
          //     //     deleteQueryOne(params)
          //     //   ]).then(() =>{
          //     //     if (res.code == 200) {
          //     //       _this.$message.info('删除合同编辑成功')
          //     //       _this.$router.push({ name: _this.routeParams.from }) //新增修改走此路由
          //     //     } else {
          //     //       _this.$message.error(res.msg)
          //     //     }
          //     //   })
          //     // }else{
          //     //   deleteQueryOne(params).then((res) => {
          //     //     if (res.code == 200) {
          //     //       _this.$message.info('删除合同编辑成功')
          //     //       _this.$router.push({ name: _this.routeParams.from }) //新增修改走此路由
          //     //     } else {
          //     //       _this.$message.error(res.msg)
          //     //     }
          //     //   })
          //     // }
          //   } else {
          //     _this.$message.info('删除合同编辑成功')
          _this.$router.push({ name: 'distribution_logistics' })
          //   }
          //   console.log('OK')
          // },
          // onCancel() {
          //   console.log('Cancel')
        },
      })
    },
    goBackActionSilent() {
      const _this = this
      if (_this.queryonedata && _this.queryonedata.id) {
        const params = { id: _this.queryonedata.id }
        if (_this.routeParams.action === 'add') {
          //新增
          params.contractModifyFlag = 0
        } else if (_this.routeParams.action === 'edit') {
          //驳回修改
          params.contractModifyFlag = 1
        } else if (_this.routeParams.action === 'split') {
          //拆分修改
          params.contractModifyFlag = 1
        }
        deleteQueryOne(params)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.wdf-row {
  border: 1px solid #ddd;
}
.col-border {
  border: 1px solid #ddd;
  padding: 10px 0;
  border-bottom: none;
  min-height: 60px;
  box-sizing: border-box;
}
.col-border ~ .col-border {
  border-left: none;
}
.wdf-form {
  margin-top: 12px;
  padding: 12px;
}
.ant-row.ant-form-item {
  margin-bottom: 0;
}
.active {
  display: none;
}
</style>
