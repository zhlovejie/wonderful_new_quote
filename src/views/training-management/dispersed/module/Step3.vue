<template>
  <div class="content-wrap">
    <a-row type="flex">
      <a-col
        :span="24"
        class="basic-tit"
        justify="center"
        align="middle"
        style="margin-bottom：50px"
      >受训人员</a-col>
    </a-row>
    <div>
      <a-form :form="form" class="form wdf-form">
        <table class="custom-table custom-table-border">
          <template>
            <tr>
              <td style="text-align: right;">部门</td>
              <td colspan="2">
                <a-select
                  :disabled="isSee"
                  style="width:200px;"
                  @change="depChangeHandler"
                  placeholder="请选择部门"
                >
                  <a-select-option
                    v-for="item in departmentList"
                    :key="item.id"
                    :value="item.id"
                  >{{ item.departmentName }}</a-select-option>
                </a-select>
              </td>
              <td style="text-align: right;">人员</td>
              <td colspan="2">
                <a-select
                  :disabled="isSee"
                  style="width:200px;"
                  mode="multiple"
                  :allowClear="true"
                  :maxTagCount="1"
                  @change="addProcess"
                  showSearch
                  placeholder="请选择人员"
                  optionFilterProp="children"
                  :filterOption="selectFilter"
                  v-decorator="['authTrainFolderBoList']"
                >
                  <a-select-option
                    v-for="(process, index) in postSelectDataSource"
                    :key="index"
                    :value="process.id"
                  >{{ process.trueName }}</a-select-option>
                </a-select>
              </td>
            </tr>
            <tr>
              <td colspan="6">
                <a-form-item>
                  <div class="process_header_wrapper">
                    <div class="draggable-columns draggable-columns-1">部门</div>
                    <div class="draggable-columns draggable-columns-1">人员</div>
                    <div v-if="!isSee" class="draggable-columns draggable-columns-3">
                      <a href="javascript:void(0);" @click="processClearAction">清空</a>
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
                        :key="item.userId"
                        class="draggable-columns-item"
                      >
                        <div class="draggable-columns draggable-columns-1">{{ item.departmentName }}</div>
                        <div class="draggable-columns draggable-columns-1">{{ item.userName }}</div>
                        <div v-if="!isSee" class="draggable-columns draggable-columns-3" title="删除">
                          <a-popconfirm
                            title="确认删除这条数据？"
                            @confirm="confirm(item.userId, index)"
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
              </td>
            </tr>
          </template>
        </table>
        <div class="btns-grop">
          <a-button style="margin-left:8px;" @click="prevStep">上一步</a-button>
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script>
import { getDevisionList } from '@/api/systemSetting'
import { queryList } from '@/api/humanResources'
import vuedraggable from 'vuedraggable'
import moment from 'moment'
export default {
  name: 'Step1',
  components: {
    vuedraggable,
  },
  props: {
    queryonedata: {
      type: Object,
    },
    type: '',
  },
  data() {
    return {
      departmentList: [], //部门
      postSelectDataSource: [], //人员
      form: this.$form.createForm(this),
      haveProcess: [],
      depart: '',
      type1: '',
      isSee: false,
      queryonedata1: {},
      _d: {
        departmentId: '',
        departmentName: '',
      },
    }
  },
  computed: {},
  watch: {
    depart: function (val) {
      let _d = this.departmentList.find((_d) => _d.id === val)
      this._d.departmentId = val
      this._d.departmentName = _d.departmentName
    },
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
    getDevisionList().then((res) => {
      this.departmentList = res.data
    })
    if (this.type1 === 'view' || this.type1 === 'examine') {
      this.isSee = true
    }
  },
  mounted() {
    this.quweyData()
    // this.init()
  },
  methods: {
    moment,
    quweyData() {
      let qt = this.queryonedata1 ? this.queryonedata1 : {}
      if (qt.oaTrainUserList) {
        this.haveProcess = qt.oaTrainUserList
      }
      if (qt.userList) {
        this.haveProcess = qt.userList
      }
    },
    //选择人员
    depChangeHandler(dep_id) {
      let that = this
      this.depart = dep_id
      that.postSelectDataSource = []
      return queryList({ departmentId: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
      })
    },
    addProcess(selectedArray) {
      console.log(selectedArray)
      let that = this
      if (!Array.isArray(selectedArray)) return
      selectedArray.map((_ppid) => {
        if (!_ppid) return
        let target = that.haveProcess.find((p) => p.id === _ppid)
        if (!target) {
          let _p = that.postSelectDataSource.find((_p) => _p.id === _ppid)
          _p.userId = _p.id
          _p.userName = _p.trueName
          that.haveProcess.push({ ..._p, ...that._d })
          console.log(that.haveProcess)
        }
      })
    },

    //清空
    processClearAction() {
      this.haveProcess = []
      this.form.setFieldsValue({
        authTrainFolderBoList: [],
      })
    },

    confirm(cpId, index) {
      // 确认删除事件
      this.haveProcess.splice(index, 1)
      console.log(this.haveProcess)
      let arr = []
      this.haveProcess.map((item) => {
        arr.push(item.id)
      })
      this.form.setFieldsValue({
        authTrainFolderBoList: arr,
      })
    },
    selectFilter(input, option) {
      // 下拉框搜索
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    //上一步
    prevStep() {
      let that = this
      that.$emit('prevStep')
    },
    // 点击下一步
    nextStep(status) {
      const that = this
      const {
        form: { validateFields },
      } = this

      console.log(that.type1)
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (that.haveProcess.length > 0) {
          console.log(that.haveProcess)
          let params = {}
          let List = that.haveProcess.map((item) => {
            return {
              id: item.userId,
              userId: item.userId,
              departmentName: item.departmentName,
              userName: item.userName,
            }
          })
          params.oaTrainUserList = List
          that.$emit('nextStep', { ...params })
        } else {
          that.$message.error('请选择受训人员')
        }

        if (!err) {
        }
      })
    },
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
  border: none;
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
