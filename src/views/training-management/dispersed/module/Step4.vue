<template>
  <div class="content-wrap">
    <a-row type="flex">
      <a-col :span="24" class="basic-tit" justify="center" align="middle">培训文件</a-col>
    </a-row>
    <div>
      <a-form class="form wdf-form">
        <table class="custom-table custom-table-border">
          <template>
            <tr>
              <a-button
                style="float: right; margin-bottom:30px "
                type="primary"
                @click="selectCustomer()"
              >选择类型</a-button>
            </tr>
            <tr>
              <a-form-item>
                <div class="process_header_wrapper">
                  <div class="draggable-columns draggable-columns-1">文件类别</div>
                  <div class="draggable-columns draggable-columns-3">
                    <a href="javascript:void(0);">操作</a>
                  </div>
                </div>
                <vuedraggable
                  class="process_main_wrapper"
                  v-if="haveProcess.length > 0"
                  ghost-class="ghost"
                  v-model="haveProcess"
                >
                  <transition-group name="list">
                    <div
                      v-for="(item, index) in haveProcess"
                      :key="item.id"
                      class="draggable-columns-item"
                    >
                      <div class="draggable-columns draggable-columns-1">{{ item.folderName }}</div>
                      <!-- <div class="draggable-columns draggable-columns-1">{{ item.userName }}</div> -->
                      <div class="draggable-columns draggable-columns-3" title="删除">
                        <a-popconfirm
                          title="确认删除这条数据？"
                          @confirm="confirm(item.id, index)"
                          okText="是"
                          cancelText="否"
                        >
                          <a-icon type="close-circle" />
                        </a-popconfirm>
                      </div>
                    </div>
                  </transition-group>
                </vuedraggable>
              </a-form-item>
            </tr>
          </template>
        </table>
        <ReceiptSaleContract ref="receiptContract" @onSelect="contractChange" />
        <div class="btns-grop">
          <a-button style="margin-left:8px;" @click="prevStep">上一步</a-button>
          <a-button type="primary" @click="nextStep">保存</a-button>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script>
import { dispersedAdd } from '@/api/training-management'
import vuedraggable from 'vuedraggable'
import moment from 'moment'
import ReceiptSaleContract from './CutomerList'
export default {
  name: 'Step1',
  components: {
    vuedraggable,
    ReceiptSaleContract,
  },
  props: {
    queryonedata: {
      type: Object,
    },
    type: '',
  },
  data() {
    return {
      haveProcess: [],
      type1: '',
      queryonedata1: {},
    }
  },
  computed: {},
  watch: {
    queryonedata(val) {
      this.queryonedata1 = val
      // this.quweyData()
      // if (this.$parent.routeParams.typeName === 'see') {
      //   this.isSee = true
      // }
    },
    type(val) {
      this.type1 = val
    },
  },
  created() {
    this.queryonedata1 = this.queryonedata
    this.type1 = this.type

    // if (this.$parent.routeParams.typeName === 'see') {
    //   this.isSee = true
    // }
  },
  mounted() {
    // this.quweyData()
  },
  methods: {
    moment,
    //点击显示列表组件
    selectCustomer() {
      this.$refs.receiptContract.query()
    },
    //选择类型
    contractChange(data) {
      let that = this
      if (that.haveProcess.length == 0) {
        that.haveProcess.push(data)
      } else {
        let arr = that.haveProcess.some((item) => data.id === item.id)
        if (!arr) {
          that.haveProcess.push(data)
        } else {
          that.$message.error('不能重复选择类型')
        }
      }
    },
    confirm(cpId, index) {
      // 确认删除事件
      this.haveProcess.splice(index, 1)
    },
    //上一步
    prevStep() {
      let that = this
      that.$emit('prevStep')
    },
    // 点击下一步
    nextStep(status) {
      const that = this
      console.log(that.type1)

      if (that.haveProcess.length > 0) {
        console.log(that.haveProcess)
        let params = {}
        that.queryonedata1.oaTrainUserList = this.queryonedata1.oaTrainUserList.map((item) => {
          return {
            userId: item.id,
          }
        })
        that.queryonedata1.oaTrainDisperseFolderBoList = that.haveProcess.map((item) => {
          return {
            oaTrainFolerId: item.id,
          }
        })
        dispersedAdd(that.queryonedata1).then((res) => {
          if (res.code === 200) {
            this.$message.info(res.msg)
            this.$emit('toList')
          } else {
            this.$message.error(res.msg)
          }
        })
        //   that.$emit('nextStep', { ...params })
      } else {
        that.$message.error('请选择受训人员')
      }
    },
    // quweyData() {
    //   let qt = this.queryonedata1 ? this.queryonedata1 : {}
    //   if (qt.oaTrainUserList) {
    //     this.haveProcess = qt.oaTrainUserList
    //   }
  },
}
</script>

<style  scoped>
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
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.custom-table >>> .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table >>> .custom-table td {
  text-align: left;
}
.becoming-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.bank-card-list-wrapper {
  display: flex;
}
.bank-card-list-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0 7px;
}
.process_tips {
  background-color: antiquewhite;
}
.process_header_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: antiquewhite;
  font-weight: 700;
  border: 1px solid #ddd;
}
.process_header_wrapper .draggable-columns-2 {
  flex: 1;
}
.process_main_wrapper {
  border: 1px solid #ddd;
}
.process_main_wrapper .draggable-columns-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #ddd;
}
.process_main_wrapper .draggable-columns-item:last-child {
  border-bottom: none;
}
.process_main_wrapper .draggable-columns-2 {
  flex: 1;
}
.draggable-columns {
  text-align: center;
  line-height: 35px;
  cursor: move;
}
.draggable-columns-1,
.draggable-columns-3 {
  width: 50%;
}
.draggable-columns-3 {
  cursor: pointer;
}
.ghost {
  background-color: rgba(250, 235, 215, 0.5);
}

/*过渡动画*/
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateX(-5%);
}
.list-move {
  transition: transform 0.3s;
}
</style>
