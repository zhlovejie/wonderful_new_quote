<template>
  <div class="content-wrap">
    <a-row type="flex">
      <a-col :span="24" class="basic-tit" justify="center" align="middle">培训文件</a-col>
    </a-row>
    <div>
      <a-form class="form wdf-form">
        <table
          v-if="type1==='view'&&trainType1===1"
          class="custom-table custom-table-border"
          style="margin-top:20px"
        >
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
              <a class="ant-dropdown-link" :href="item.trainUrl">下载</a>
              <template v-if="!isSee">
                <a-divider type="vertical" />
                <a class="ant-dropdown-link" @click="deletes(index)">删除</a>
              </template>
            </td>
          </tr>
        </table>
        <table class="custom-table custom-table-border" v-if="type1==='view'&&trainType1===2">
          <template>
            <tr>
              <th>
                <b>文件类别</b>
              </th>
              <th>
                <b>操作</b>
              </th>
            </tr>
            <tr v-for="(item,index) in haveProcess " :key="index">
              <td>{{item.folderName}}</td>
              <td></td>
            </tr>
          </template>
        </table>
        <table class="custom-table custom-table-border" v-if="type1==='examine'">
          <template>
            <tr>
              <th>
                <b>文件名称</b>
              </th>
              <th>
                <b>操作</b>
              </th>
            </tr>
            <tr v-for="(item,index) in readHistoryList " :key="index">
              <td>{{item.fileName}}</td>
              <td>
                <template v-if="item.readFlag===0">
                  <a class="ant-dropdown-link" @click="delete_lists(item.id,item.fileUrl)">处理</a>
                </template>
                <template v-else>
                  <a class="ant-dropdown-link" @click="delete_list(item.fileUrl)">已阅</a>
                </template>
              </td>
            </tr>
          </template>
        </table>
        <XdocView ref="xdocView" />
        <filesView ref="xdocViews" @filesV="serve" />
        <div class="btns-grop">
          <template>
            <a-button style="margin-left:8px;" @click="prevStep">上一步</a-button>
            <a-button type="primary" @click="nextStep">退出</a-button>
          </template>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script>
import { focusAdd, dispersedExamine, meetinglistMyFileWithoutDetail } from '@/api/training-management'
import vuedraggable from 'vuedraggable'
import moment from 'moment'
import XdocView from './XdocView'
import filesView from './filesView'
export default {
  name: 'Step1',
  components: {
    vuedraggable,
    XdocView,
    filesView,
  },
  props: {
    queryonedata: {
      type: Object,
    },
    type: '',
    trainType: '',
    trainId: '',
  },
  data() {
    return {
      haveProcess: [],
      goodsList: [],
      type1: '',
      trainType1: '',
      trainId1: '',
      isSee: false,
      readHistoryList: [],
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
      if (this.type1 === 'view') {
        this.isSee = true
      }
    },
    type(val) {
      this.type1 = val
    },
    trainType(val) {
      this.trainType1 = val
    },
    trainId(val) {
      this.trainId1 = val
    },
  },
  created() {
    this.queryonedata1 = this.queryonedata
    this.type1 = this.type
    this.trainId1 = this.trainId
    this.trainType1 = this.trainType
    console.log(this.trainType1)
    if (this.type1 === 'view') {
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
      if (qt.folerList && this.trainType1 === 2) {
        this.haveProcess = qt.folerList
      }
      if (qt.fileList && this.trainType1 === 1) {
        this.goodsList = qt.fileList
      }
      if (this.type1 === 'examine') {
        // this.readHistoryList = qt.readHistoryList
        meetinglistMyFileWithoutDetail({ trainId: this.trainId1 }).then((res) => {
          console.log(res.data)
          this.readHistoryList = res.data
        })
      }
    },

    serve() {
      meetinglistMyFileWithoutDetail({ trainId: this.trainId1 }).then((res) => {
        console.log(res.data)
        this.readHistoryList = res.data
      })
    },
    delete_list(idurl) {
      this.$refs.xdocView.query(idurl)
    },
    delete_lists(id, idurl) {
      this.$refs.xdocViews.query(id, idurl)
    },
    //上一步
    prevStep() {
      let that = this
      that.$emit('prevStep')
    },
    // 点击下一步
    nextStep(status) {
      const that = this
      that.$emit('nextStep', {})
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
