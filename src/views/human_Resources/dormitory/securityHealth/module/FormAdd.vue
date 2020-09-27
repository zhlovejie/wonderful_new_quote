<template>
  <a-modal
    :title="modalTitle"
    :width="700"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td>部门</td>
            <td colspan="3">
              <a-form-item>
                <a-select
                  style="width:300px;"
                  v-decorator="['deptId', { rules: [{ required: true, message: '请选择部门' }] }]"
                  @change="depChangeHandler"
                  placeholder="请选择部门"
                >
                  <a-select-option
                    v-for="item in departmentList"
                    :key="item.id"
                    :value="item.id"
                  >{{ item.departmentName }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>人员</td>
            <td colspan="3">
              <a-form-item>
                <a-select
                  placeholder="请选择人员"
                  mode="multiple"
                  v-decorator="['userIds', { rules: [{ required: true, message: '请选择人员' }] }]"
                  :allowClear="true"
                  style="width: 300px"
                >
                  <a-select-option
                    v-for="item in postSelectDataSource"
                    :key="item.id"
                    :value="item.id"
                  >{{ item.trueName }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>检查时间</td>
            <td colspan="3">
              <a-form-item>
                <a-date-picker
                  show-time
                  style="width:300px;"
                  v-decorator="['inspectTime', { rules: [{ required: true, message: '请选择日期！' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>检查房间</td>
            <td colspan="3">
              <a-form-item>
                <a-select
                  style="width:300px;"
                  mode="multiple"
                  :allowClear="true"
                  :maxTagCount="1"
                  @change="addProcess"
                  showSearch
                  placeholder="请选择房间"
                  optionFilterProp="children"
                  :filterOption="selectFilter"
                  v-decorator="['roomIds']"
                >
                  <a-select-option
                    v-for="(process, index) in RoomNumber"
                    :key="index"
                    :value="process.id"
                  >{{ process.roomCode }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>检查房间列表</td>
            <td>
              <a-form-item>
                <div class="process_header_wrapper">
                  <div class="draggable-columns draggable-columns-1">房间号</div>
                  <div class="draggable-columns draggable-columns-3">
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
                      :key="item.id"
                      class="draggable-columns-item"
                    >
                      <div class="draggable-columns draggable-columns-2">{{ item.roomCode }}</div>
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
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { getDevisionList } from '@/api/systemSetting'
import { listRoom, securityHealth_List_Add, queryList } from '@/api/humanResources'
import moment from 'moment'
import vuedraggable from 'vuedraggable'

export default {
  name: 'BecomingForm',
  components: {
    vuedraggable,
  },
  data() {
    return {
      visible: false,
      spinning: false,
      isDisabled: true,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      departmentList: [],
      type: 'add',
      record: {},
      postSelectDataSource: [],
      RoomNumber: [],
      allProcess: [],
      haveProcess: [],
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '安全卫生考核'
      }
      let txt = this.isView ? '新增' : '修改'
      return `${txt}安全卫生考核`
    },
    isView() {
      //新增
      return this.type === 'add'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
  },

  methods: {
    moment: moment,
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record

      getDevisionList().then((res) => {
        this.departmentList = res.data
      })
      listRoom({ status: 1 }).then((res) => {
        this.RoomNumber = res.data
        this.allProcess = res.data
      })
      if (type === 'edit-salary') {
        this.fillData()
      }
    },

    fillData() {
      queryList({ departmentId: this.record.deptId }).then((res) => {
        this.postSelectDataSource = res.data
      })
      this.$nextTick(() => {
        this.form.setFieldsValue({
          deptId: this.record.deptId,
          userId: this.record.userId,
          roomId: this.record.roomId,
          checkInTime: moment(this.record.checkInTime),
          remark: this.record.remark,
        })
      })
    },

    handleOk() {
      console.log('你这是要提交')
      let that = this
      that.form.validateFields((err, values) => {
        that.spinning = true
        if (!err) {
          delete values.deptId
          values.inspectTime = moment(values.inspectTime).format('YYYY-MM-DD')
          console.log(values)
          securityHealth_List_Add(values).then((res) => {
            that.spinning = false
            console.log(res)
            that.form.resetFields() // 清空表
            this.haveProcess = []
            that.visible = false
            that.$message.info(res.msg)
            that.$emit('finish')
          })
        }
      })
    },

    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      return queryList({ departmentId: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
      })
    },
    handleCancel() {
      this.fileList = []
      this.form.resetFields() // 清空表
      this.visible = false
    },
    //清空
    processClearAction() {
      this.haveProcess = []
      this.form.setFieldsValue({
        roomIds: [],
      })
    },
    addProcess(selectedArray) {
      let that = this
      if (!Array.isArray(selectedArray)) return
      selectedArray.map((_ppid) => {
        if (!_ppid) return
        let target = that.haveProcess.find((p) => p.id === _ppid)
        if (!target) {
          let _p = that.allProcess.find((_p) => _p.id === _ppid)
          that.haveProcess.push(_p)
        }
      })
    },
    selectFilter(input, option) {
      // 下拉框搜索
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
        roomIds: arr,
      })
    },
  },
}
</script>
<style scoped>
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
