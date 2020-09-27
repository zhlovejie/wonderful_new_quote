<template>
  <div class="content-wrap">
    <a-row type="flex" style="margin-bottom:30px">
      <a-col :span="24" class="basic-tit" justify="center" align="middle">培训文件</a-col>
    </a-row>
    <div>
      <a-form class="form wdf-form">
        <template v-if="!isSee">
          <a-button style="float:right;" type="primary" icon="plus" @click="applyFor('add',null)">新增</a-button>
        </template>
        <table class="custom-table custom-table-border" style="margin-top:20px">
          <tr>
            <th>
              <b>文件名称</b>
            </th>
            <th>
              <b>操作</b>
            </th>
          </tr>
          <tr v-for="(item,index) in goodsList " :key="index">
            <td>{{item.fileName}}</td>
            <td>
              <a class="ant-dropdown-link" @click="delete_list(item.trainUrl)">查看</a>
              <a-divider type="vertical" />
              <a class="ant-dropdown-link" :href="item.trainUrl" target="_blank">下载</a>
              <template v-if="!isSee">
                <a-divider type="vertical" />
                <a class="ant-dropdown-link" @click="deletes(index)">删除</a>
              </template>
            </td>
          </tr>
        </table>
        <Approval ref="approval" @opinionChange="opinionChange" />
        <Appform ref="normalUpload" @msgId="specialList" />
        <XdocView ref="xdocView" />
        <div class="btns-grop">
          <template v-if="isApproval">
            <a-button style="margin-left:8px;" @click="prevStep">上一步</a-button>
            <a-button class="a-button" type="primary" icon="close" @click="noPassAction()">不通过</a-button>
            <a-button class="a-button" type="primary" icon="check" @click="passAction">通过</a-button>
          </template>
          <template v-else>
            <a-button style="margin-left:8px;" @click="prevStep">上一步</a-button>
            <a-button v-if="!isSee" type="primary" :loading="spinning" @click="nextStep">保存</a-button>
            <a-button
              v-if="isSee&&queryonedata1.onlineFlag===1"
              type="primary"
              @click="nextStep"
            >下一步</a-button>
            <a-button v-if="isSee&&queryonedata1.onlineFlag===0" type="primary" @click="nextStep">退出</a-button>
          </template>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script>
import { focusAdd, dispersedExamine } from '@/api/training-management'
import vuedraggable from 'vuedraggable'
import moment from 'moment'
import Appform from './Appform'
import XdocView from './XdocView'
import Approval from './Approval'
export default {
  name: 'Step1',
  components: {
    Approval,
    vuedraggable,
    Appform,
    XdocView,
  },
  props: {
    queryonedata: {
      type: Object,
    },
    type: '',
  },
  data() {
    return {
      goodsList: [],
      type1: '',
      isSee: false,
      spinning: false,
      queryonedata1: {},
    }
  },
  computed: {
    isApproval() {
      //通过不通过
      return this.type1 === 'examine'
    },
  },
  watch: {
    queryonedata(val) {
      this.queryonedata1 = val
      this.quweyData()
      if (this.type1 === 'view' || this.type1 === 'examine') {
        this.isSee = true
      }
    },
    type(val) {
      this.type1 = val
    },
  },
  created() {
    this.queryonedata1 = this.queryonedata
    this.type1 = this.type
    if (this.type1 === 'view' || this.type1 === 'examine') {
      this.isSee = true
    }
  },
  mounted() {
    this.quweyData()
  },
  methods: {
    moment,
    quweyData() {
      let qt = this.queryonedata1 ? this.queryonedata1 : {}
      if (qt.fileList) {
        this.goodsList = qt.fileList
      }
    },
    applyFor() {
      //打开新增上传模板
      this.$refs.normalUpload.query()
    },
    specialList(data) {
      //接收子组件传的数据
      this.goodsList.push(data)
    },
    deletes(id) {
      this.goodsList.splice(id, 1)
    },
    delete_list(idurl) {
      this.$refs.xdocView.query(idurl)
    },
    //上一步
    prevStep() {
      let that = this
      that.$emit('prevStep')
    },
    // 点击下一步
    nextStep(status) {
      const that = this
      if (that.type1 === 'view') {
        that.$emit('nextStep', {})
      } else {
        if (that.goodsList.length > 0) {
          that.queryonedata1.oaTrainUserList = this.queryonedata1.oaTrainUserList.map((item) => {
            return {
              userId: item.id,
            }
          })
          that.queryonedata1.oaTrainGroupFileBoList = that.goodsList.map((item) => {
            return {
              fileName: item.fileName,
              trainUrl: item.trainUrl,
            }
          })
          that.spinning = true
          focusAdd(that.queryonedata1).then((res) => {
            if (res.code === 200) {
              that.spinning = false
              this.$message.info(res.msg)
              that.$emit('nextStep', {})
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          that.$message.error('请上传文件')
        }
      }
    },

    //审批
    submitAction(opt) {
      let that = this
      let values = {
        approveId: this.queryonedata1.id,
        isAdopt: opt.isAdopt,
        opinion: opt.opinion,
      }
      console.log(values)
      that.spinning = true
      dispersedExamine(values)
        .then((res) => {
          that.$message.info(res.msg)
          that.$emit('nextStep', {})
        })
        .catch((err) => (that.spinning = false))
    },
    passAction() {
      this.submitAction({
        isAdopt: 0,
        // opinion: '通过',
      })
    },
    noPassAction() {
      let that = this
      //that.opinion = ''
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
  },
}
</script>

<style  scoped>
.wdf-row {
  border: 1px solid #ddd;
}
.col-border {
  border: 1px solid #ddd;
  padding: 10px;
  border-bottom: none;
  min-height: 60px;
  box-sizing: border-box;
}
.wdf-form {
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
.label-fix {
  display: inline-block;
  width: 50%;
  text-align: left;
  position: relative;
  top: 8px;
}
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  border: none;
}

.custom-table > .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table > .custom-table td {
  text-align: left;
}
</style>
