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
    <!-- 设计方案联合评审 -->
    <a-card :title="Designtitle" :bordered="false" style="margin-top: 20px">
      <a-button type="link" slot="extra" v-if="status !== 2 && !essential" @click="information(2)">显示 </a-button>
      <a-button type="link" slot="extra" v-if="status !== 2 && essential" @click="information(2)">收起</a-button>
      <Essential v-if="status === 2 || essential" ref="essential" :type="type" />
    </a-card>
    <!-- 产品试制 -->
    <a-card :title="productiontitle" :bordered="false">
      <a-button type="link" slot="extra" v-if="status !== 4 && !Production" @click="information(4)">显示 </a-button>
      <a-button type="link" slot="extra" v-if="status !== 4 && Production" @click="information(4)">收起</a-button>
      <Production v-if="status === 4 || Production" ref="Production" :type="type" />
    </a-card>
    <!-- 可行性测试 -->
    <a-card :title="Feasibilitytitle" :bordered="false">
      <a-button type="link" slot="extra" v-if="status !== 5 && !Feasibilitys" @click="information(5)">显示 </a-button>
      <a-button type="link" slot="extra" v-if="status !== 5 && Feasibilitys" @click="information(5)">收起</a-button>
      <Feasibility v-if="status === 5 || Feasibilitys" ref="Feasibility" :type="type" />
    </a-card>
    <!-- 可行性测试结果评审 -->
    <a-card :title="Resultstitle" :bordered="false">
      <a-button type="link" slot="extra" v-if="status !== 6 && !Results" @click="information(6)">显示 </a-button>
      <a-button type="link" slot="extra" v-if="status !== 6 && Results" @click="information(6)">收起</a-button>
      <ResultsReview v-if="status === 6 || Results" ref="Results" :type="type" />
    </a-card>
    <!-- 稳定性测试 -->
    <a-card :title="stabilitytitle" :bordered="false">
      <a-button type="link" slot="extra" v-if="status !== 7 && !Stabilitys" @click="information(7)">显示 </a-button>
      <a-button type="link" slot="extra" v-if="status !== 7 && Stabilitys" @click="information(7)">收起</a-button>
      <Stability v-if="status === 7 || Stabilitys" ref="stability" :type="type" />
    </a-card>
    <!-- 稳定性测试结果评审 -->
    <a-card :title="ReviewOfStabilitytitle" :bordered="false">
      <a-button type="link" slot="extra" v-if="status !== 8 && !ReviewOfStabilitys" @click="information(8)"
        >显示
      </a-button>
      <a-button type="link" slot="extra" v-if="status !== 8 && ReviewOfStabilitys" @click="information(8)"
        >收起</a-button
      >
      <ReviewOfStability v-if="status === 8 || ReviewOfStabilitys" ref="reviewOfStability" :type="type" />
    </a-card>

    <!-- 配置方案研发评审 -->
    <a-card :title="Schemetitile" :bordered="false">
      <a-button type="link" slot="extra" v-if="status !== 10 && !schemes" @click="information(10)">显示 </a-button>
      <a-button type="link" slot="extra" v-if="status !== 10 && schemes" @click="information(10)">收起</a-button>
      <Scheme v-if="status === 10 || schemes" ref="scheme" :type="type" />
    </a-card>
    <!-- 工艺研发 -->
    <a-card :title="ProcessDevelopmenttitle" :bordered="false">
      <a-button type="link" slot="extra" v-if="status !== 13 && !Process" @click="information(13)">显示 </a-button>
      <a-button type="link" slot="extra" v-if="status !== 13 && Process" @click="information(13)">收起</a-button>
      <ProcessDevelopment v-if="status === 13 || Process" ref="processDevelopment" :type="type" />
    </a-card>
  </a-spin>
</template>
<script>
import { getDealChooseStageDetailWithAll, getDealEveryChooseStageDetail } from '@/api/projectManagement'
import Essential from './essential'
import Production from './production'
import Feasibility from './Feasibility'
import ResultsReview from './ResultsReview'
import Stability from './stability'
import ReviewOfStability from './ReviewOfStability'
import Scheme from './scheme'
import ProcessDevelopment from './processDevelopment'

import moment from 'moment'
let uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)

export default {
  name: 'BecomingForm',
  components: {
    Essential,
    Production,
    Feasibility,
    ResultsReview,
    Stability,
    ReviewOfStability,
    Scheme,
    ProcessDevelopment,
  },
  provide() {
    return {
      normalAddForm: this,
    }
  },
  computed: {
    Designtitle() {
      return `设计方案联合评审（预计完成时间：${this.finishTime}）`
    },
    productiontitle() {
      return `产品试制（预计完成时间：${this.finishTime}）`
    },
    Feasibilitytitle() {
      return `可行性测试（预计完成时间：${this.finishTime}）`
    },
    Resultstitle() {
      return `可行性测试结果评审（预计完成时间：${this.finishTime}）`
    },
    stabilitytitle() {
      return `稳定性测试（预计完成时间：${this.finishTime}）`
    },
    ReviewOfStabilitytitle() {
      return `稳定性测试结果评审（预计完成时间：${this.finishTime}）`
    },
    Schemetitile() {
      return `配置方案研发评审（预计完成时间：${this.finishTime}）`
    },
    ProcessDevelopmenttitle() {
      return `工艺研发（预计完成时间：${this.finishTime}）`
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
  },
  data() {
    return {
      essential: false,
      Production: false,
      Feasibilitys: false,
      Stabilitys: false,
      ReviewOfStabilitys: false,
      schemes: false,
      Process: false,
      Results: false,
      finishTime: undefined,
      spinning: false,
      status: undefined,
      type: undefined,
      record: {},
      allInfo: {},

      developmentProjectDesignReview: {}, //设计方案联合评审
      ProductTrial: {}, //产品试制
      FeasibilityData: {}, //可行性测试
      ResultsData: {}, //可行性测试结果评审
      StabilityData: {}, //稳定性测试
      ReviewOfStabilityData: {}, //稳定性测试结果评审
      schemeData: {}, //配置方案研发评审
      ProcessData: {}, //工艺研发
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'project-management-My-handle' && this.$route.params.id !== undefined) {
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
      //   debugger
      let that = this

      if (that.type === 'handle' || that.type === 'view') {
        getDealChooseStageDetailWithAll({ projectId: that.$route.params.id, stageNum: that.status }).then((res) => {
          if (res.code === 200) {
            this.allInfo = res.data.allInfo
            if (that.status === 2 && res.data.detailInfo !== null) {
              this.developmentProjectDesignReview = res.data.detailInfo
            }
            if (that.status === 4 && res.data.detailInfo !== null) {
              this.ProductTrial = res.data.detailInfo
            }
            if (that.status === 5 && res.data.detailInfo !== null) {
              this.FeasibilityData = res.data.detailInfo
            }
            if (that.status === 6 && res.data.detailInfo !== null) {
              this.ResultsData = res.data.detailInfo
            }
            if (that.status === 7 && res.data.detailInfo !== null) {
              this.StabilityData = res.data.detailInfo
            }
            if (that.status === 8 && res.data.detailInfo !== null) {
              this.ReviewOfStabilityData = res.data.detailInfo
            }
            if (that.status === 10 && res.data.detailInfo !== null) {
              this.schemeData = res.data.detailInfo
            }
            if (that.status === 13 && res.data.detailInfo !== null) {
              this.ProcessData = res.data.detailInfo
            }

            this.finishTime = res.data.finishTime
          }
        })
      }
    },
    information(type) {
      if (type === 2) {
        this.essential = !this.essential
      }
      if (type === 4) {
        this.Production = !this.Production
      }
      if (type === 5) {
        this.Feasibilitys = !this.Feasibilitys
      }
      if (type === 6) {
        this.Results = !this.Results
      }
      if (type === 7) {
        this.Stabilitys = !this.Stabilitys
      }
      if (type === 8) {
        this.ReviewOfStabilitys = !this.ReviewOfStabilitys
      }
      if (type === 10) {
        this.schemes = !this.schemes
      }
      if (type === 13) {
        this.Process = !this.Process
      }

      getDealEveryChooseStageDetail({ projectId: this.$route.params.id, stageNum: type }).then((res) => {
        if (res.code === 200) {
          if (type == 2 && res.data !== null) {
            this.developmentProjectDesignReview = res.data
          }
          if (type == 4 && res.data !== null) {
            this.ProductTrial = res.data
          }
          if (type == 5 && res.data !== null) {
            this.FeasibilityData = res.data
          }
          if (type == 6 && res.data !== null) {
            this.ResultsData = res.data
          }
          if (type == 7 && res.data !== null) {
            this.StabilityData = res.data
          }
          if (type == 8 && res.data !== null) {
            this.ReviewOfStabilityData = res.data
          }
          if (type == 10 && res.data !== null) {
            this.schemeData = res.data
          }
          if (type == 13 && res.data !== null) {
            this.ProcessData = res.data
          }
        }
      })
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