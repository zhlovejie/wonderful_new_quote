<template>
  <a-spin :spinning="spinning">
    <a-card title="项目进程" :bordered="false">
      <a slot="extra" href="#" @click="handleGo()">返回</a>
      <a-collapse v-model="activeKey" expand-icon-position="right">
        <a-collapse-panel key="1">
          <div slot="header">
            申请立项<span style="color: red; padding-left: 30px"
              >{{ this.details.startTime ? '已立项' : '未立项' }} {{ this.details.startTime || '' }}</span
            >
          </div>
          <a-table :columns="columns" :dataSource="approval" :pagination="false" size="small">
            <div slot="projectId" slot-scope="text, record, index">
              <span style="color: red">{{ record.startTime ? '已立项' : '未立项' }}</span>
            </div>
          </a-table>
        </a-collapse-panel>
        <a-collapse-panel
          :key="item.projectPeriod.toString()"
          v-for="item in stageDetailVoList"
          :disabled="details.status < item.projectPeriod"
        >
          <div slot="header">
            {{
              {
                1: '立项阶段',
                2: '设计方案评审',
                3: '试制资料输出',
                4: '产品试制',
                5: '可行性测试',
                6: '可行性测试结果联合评审',
                7: '稳定性测试',
                8: '稳定性测试结果评审',
                9: '配置方案研发',
                10: '配置方案研发评审',
                11: '配置方案技术资料归档',
                12: '设计模块',
                13: '工艺研发',
                14: '工艺下达',
                15: '小批量生产',
                16: '小批量生产评审',
                17: '样品展示',
                18: '批量生产&完结',
              }[item.projectPeriod] || '未知'
            }}<span style="color: red; padding-left: 30px">
              {{
                item.projectPeriod > details.status
                  ? '未开始'
                  : item.stageStatus === 1
                  ? '进行中'
                  : item.stageStatus === 2
                  ? '已结束'
                  : '逾期'
              }}

              {{ item.finishTime || '' }}</span
            >
          </div>
          <a-table :columns="columns1" :dataSource="item.getList" :pagination="false" size="small">
            <div slot="stageStatus" slot-scope="text, record, index">
              <span style="color: red">{{
                record.stageStatus === 1 ? '进行中 ' : record.stageStatus === 2 ? '已结束 ' : '逾期'
              }}</span>
            </div>
          </a-table>
          <!-- <p>{{ text }}</p> -->
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </a-spin>
</template>
<script>
import { getProjectStageProcessDetail } from '@/api/projectManagement'
export default {
  name: 'BecomingSorm',
  components: {},

  computed: {},
  data() {
    return {
      columns: [
        {
          align: 'center',
          title: '项目编号',
          dataIndex: 'projectCode',
        },
        {
          align: 'center',
          title: '项目名称',
          dataIndex: 'projectName',
        },
        {
          align: 'center',
          title: '状态',
          dataIndex: 'projectId',
          scopedSlots: { customRender: 'projectId' },
        },
        {
          align: 'center',
          title: '负责人',
          dataIndex: 'chargeUserName',
        },
        {
          align: 'center',
          title: '研发总监',
          dataIndex: 'inspectorUserName',
        },
        {
          align: 'center',
          title: '申请/立项时间',
          dataIndex: 'startTime',
        },
      ],
      columns1: [
        {
          align: 'center',
          title: '参与人员',
          width: 400,
          dataIndex: 'joinPersonStr',
        },
        {
          align: 'center',
          title: '预计完成时间',
          dataIndex: 'finishTime',
        },
        {
          align: 'center',
          title: '实际完成时间',
          dataIndex: 'realityFinishTime',
        },
        {
          align: 'center',
          title: '状态',
          dataIndex: 'stageStatus',
          scopedSlots: { customRender: 'stageStatus' },
        },
      ],
      spinning: false,
      record: {},
      text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`,
      activeKey: ['1'],
      approval: [],
      details: {},
      stageDetailVoList: [],
    }
  },
  watch: {
    activeKey(key) {
      console.log(key)
    },
    $route: {
      handler: function (to, from) {
        if (to.name === 'project-management-My-projectProgress' && this.$route.params.record.id !== undefined) {
          let that = this
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
    async init() {
      let that = this

      await getProjectStageProcessDetail({ projectId: that.$route.params.record.id }).then((res) => {
        if (res.code === 200) {
          that.details = res.data
          that.details.startTime = res.data.startTime.substring(0, 10)
          let react = res.data.stageDetailVoList.filter((item) => item.projectPeriod !== 1)
          that.stageDetailVoList = react.map((i) => {
            return {
              stageStatus: i.stageStatus,
              finishTime: i.finishTime.substring(0, 10),
              projectPeriod: i.projectPeriod,
              getList: [
                {
                  finishTime: i.finishTime,
                  joinPersonStr: i.joinPersonStr,
                  realityFinishTime: i.realityFinishTime,
                  stageStatus: i.stageStatus,
                },
              ],
            }
          })
          that.approval.push({
            projectName: res.data.projectName,
            chargeUserName: res.data.chargeUserName,
            startTime: res.data.startTime,
            inspectorUserName: res.data.inspectorUserName,
            projectId: res.data.projectId,
            projectCode: res.data.projectCode,
          })
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

.ant-collapse-content > .ant-collapse-content-box {
  padding: 0;
}
.ant-table-small {
  border: none;
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