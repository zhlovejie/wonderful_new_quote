<template>
  <a-spin :spinning="spinning">
    <a-card title="项目信息" :bordered="false">
      <a slot="extra" href="#" @click="handleGo()">返回</a>
      <a-row :gutter="[32, 32]">
        <a-col :span="8"
          >项目开发模式：
          {{
            { 1: '自主研发新产品 ', 2: '客户定制新产品', 3: '产品研发改进', 4: '非常规产品开发' }[allInfo.modelType] ||
            '未知'
          }}</a-col
        >
        <a-col :span="8"> 项目类别（产品型号）：{{ allInfo.materialCode }}</a-col>
        <a-col :span="8"> 项目编号：{{ allInfo.projectCode }} </a-col>
        <a-col :span="8"> 项目名称 ：{{ allInfo.projectName }} </a-col>
        <a-col :span="8"> 项目总负责人：{{ allInfo.chargeUserName }} </a-col>
        <a-col :span="8"> 研发总监：{{ allInfo.inspectorUserName }} </a-col>
      </a-row>
    </a-card>

    <a-card :title="Designtitle" v-if="status === 2" :bordered="false" style="margin-top: 20px">
      <Essential ref="essential" :type="type" />
    </a-card>
    <a-card :title="Feasibilitytitle" v-if="status === 5" :bordered="false" style="margin-top: 20px">
      <Feasibility ref="feasibility" :type="type" />
    </a-card>
    <a-card :title="stabilitytitle" v-if="status === 7" :bordered="false" style="margin-top: 20px">
      <Stability ref="stability" :type="type" />
    </a-card>
    <a-card :title="developmenttitle" v-if="status === 9" :bordered="false" style="margin-top: 20px">
      <Process9 ref="stability" :type="type" />
    </a-card>
    <a-card :title="DesignModuleTitle" v-if="status === 12" :bordered="false" style="margin-top: 20px">
      <DesignModule ref="stability" :type="type" />
    </a-card>
    <a-card :title="Trialtitle" v-if="status === 15" :bordered="false" style="margin-top: 20px">
      <Trialproduction ref="stability" :type="type" />
    </a-card>
    <a-card :title="Sampletitle" v-if="status === 17" :bordered="false" style="margin-top: 20px">
      <Samples ref="stability" :type="type" />
    </a-card>
    <a-card :title="volumetitle" v-if="status === 18" :bordered="false" style="margin-top: 20px">
      <Volume ref="stability" :type="type" />
    </a-card>
  </a-spin>
</template>
<script>
import { getApproveChooseStageDetail } from '@/api/projectManagement'
import Essential from '../../My-project/module/essential'
import Feasibility from '../../My-project/module/Feasibility'
import Stability from '../../My-project/module/stability'
import Trialproduction from '../../My-project/module/Trialproduction'
import Samples from '../../My-project/module/samples'
import Volume from '../../My-project/module/volume'
import DesignModule from '../../My-project/module/DesignModule'
import Process9 from '../../My-project/module/Process9'

import moment from 'moment'
let uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)

export default {
  name: 'BecomingForm',
  components: {
    Essential,
    Feasibility,
    Stability,
    Trialproduction,
    Samples,
    Volume,
    DesignModule,
    Process9,
  },
  provide() {
    return {
      normalAddForm: this,
    }
  },
  computed: {
    DesignModuleTitle() {
      return `设计模块（预计完成时间：${this.finishTime}）`
    },
    Designtitle() {
      return `设计方案联合评审（预计完成时间：${this.finishTime}）`
    },
    Feasibilitytitle() {
      return `可行性测试（预计完成时间：${this.finishTime}）`
    },
    stabilitytitle() {
      return `稳定性测试（预计完成时间：${this.finishTime}）`
    },
    Trialtitle() {
      return `小批量试生产（预计完成时间：${this.finishTime}）`
    },
    Sampletitle() {
      return `样品展示 （预计完成时间：${this.finishTime}）`
    },
    volumetitle() {
      return `批量生产&完结 （预计完成时间：${this.finishTime}）`
    },
    developmenttitle() {
      return `配置方案研发（预计完成时间：${this.finishTime}）`
    },
    isView() {
      return this.type === 'view'
    },
    isHandle() {
      return this.type === 'handle'
    },
    isApproval() {
      return this.type === 'Approval'
    },
    // isDisabled() {
    //   //此状态下表单元素被禁用
    //   return this.isView || this.isApproval
    // },
    // isFeasibility() {
    //   //可行性测试
    //   return this.isView || this.isApproval
    // },
  },
  data() {
    return {
      essential: false,
      finishTime: undefined,
      spinning: false,
      status: undefined,
      type: undefined,
      record: {},
      allInfo: {},

      developmentProjectDesignReview: {}, //设计方案联合评审
      FeasibilityData: {}, //可行性测试
      StabilityData: {}, //稳定性测试
      TrialData: {}, //小批量生产
      schemesData: {}, //样品展示
      volumeData: {}, //批量生产完结
      DesignData: {}, //设计模块处理
      developmentData: {}, //配置方案研发
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'project-management-Project-audit-handle' && this.$route.params.id !== undefined) {
          let that = this
          that.status = that.$route.params.status
          that.type = that.$route.params.type
          that.record = that.$route.params.record
          that.init()
        } else {
          this.$router.go(-1)
        }
      },
      immediate: true,
    },
  },

  methods: {
    moment,
    init() {
      let that = this
      if (that.type === 'Approval' || that.type === 'view') {
        getApproveChooseStageDetail({
          projectId: that.$route.params.id,
          stageNum: that.status,
          serviceId: that.record.serviceId || undefined,
        }).then((res) => {
          if (res.code === 200) {
            this.allInfo = res.data.allInfo
            if (that.status == 2 && res.data !== null) {
              this.developmentProjectDesignReview = res.data.detailInfo
            }
            if (that.status == 5 && res.data.detailInfo !== null) {
              this.FeasibilityData = res.data.detailInfo
            }
            if (that.status == 7 && res.data.detailInfo !== null) {
              this.StabilityData = res.data.detailInfo
            }
            if (that.status == 15 && res.data.detailInfo !== null) {
              this.TrialData = res.data.detailInfo
            }
            if (that.status == 17 && res.data.detailInfo !== null) {
              this.schemesData = res.data.detailInfo
            }
            if (that.status == 18 && res.data.detailInfo !== null) {
              this.volumeData = res.data.detailInfo
            }
            if (that.status == 12 && res.data.detailInfo !== null) {
              this.DesignData = res.data.detailInfo
            }
            if (that.status == 9 && res.data.detailInfo !== null) {
              this.developmentData = res.data.detailInfo
            }

            this.finishTime = res.data.finishTime
          }
        })
      }
    },
    information() {
      this.essential = !this.essential
    },
    handleGo() {
      this.$router.go(-1)
    },
  },
}
</script>
<style scoped>
.dis_play {
  float: right;
}
/*自定义table样式*/
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  line-height: 40px;
}

.bom-management-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.bom-management-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
  width: calc(100% + 2px);
}

.route-view-wrapper {
  background-color: #f5f5f5;
  padding: 20px;
}
.card-item {
  /* margin-bottom: 20px; */
  padding: 20px;
  background-color: #fff;
  border-radius: 3px;
}
.__hd {
  font-size: 100%;
  font-weight: bold;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  /* margin-bottom: 10px; */
  margin-top: 30px;
}

.ghost {
  background-color: rgba(250, 235, 215, 0.5);
}
</style>