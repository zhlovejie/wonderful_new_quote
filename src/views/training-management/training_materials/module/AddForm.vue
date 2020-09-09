<template>
  <a-modal
    :title="modalTitle"
    :width="800"
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
            <td>上级</td>
            <td colspan="4">
              <a-form-item>
                <a-input
                  disabled
                  :rows="3"
                  v-decorator="['parentId', { rules: [{ required: true, message: '请输入团建地址' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>文件名称</td>
            <td colspan="4">
              <a-form-item>
                <a-input
                  placeholder="输入文件名称"
                  :rows="3"
                  v-decorator="['folderName', { rules: [{ required: true, message: '请输入团建地址' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td colspan="4">
              <a-form-item>
                <a-textarea
                  placeholder="请输入备注"
                  :rows="3"
                  v-decorator="['remark', { rules: [{ required: true, message: '请输入费用' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>权限</td>
            <td colspan="4">
              <a-form-item>
                <a-radio-group
                  @change="authorityType"
                  v-decorator="['authorityType',{ initialValue:2}]"
                >
                  <a-radio :value="1">公开</a-radio>
                  <a-radio :value="2">私密</a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
          </tr>

          <tr v-if="jurisdiction">
            <td colspan="6">
              <b>选择人员</b>
            </td>
          </tr>
          <tr v-if="jurisdiction">
            <td>部门</td>
            <td colspan="2">
              <a-form-item>
                <a-select style="width:200px;" @change="depChangeHandler" placeholder="请选择部门">
                  <a-select-option
                    v-for="item in departmentList"
                    :key="item.id"
                    :value="item.id"
                  >{{ item.departmentName }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td>人员</td>
            <td colspan="2">
              <a-form-item>
                <a-select
                  style="width:200px;"
                  mode="multiple"
                  :allowClear="true"
                  :maxTagCount="1"
                  @change="addProcess"
                  showSearch
                  placeholder="请选择人员"
                  optionFilterProp="children"
                  :filterOption="selectFilter"
                >
                  <a-select-option
                    v-for="(process, index) in postSelectDataSource"
                    :key="index"
                    :value="process.id"
                  >{{ process.trueName }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr v-if="jurisdiction">
            <td colspan="6">人员详情</td>
          </tr>
          <tr v-if="jurisdiction">
            <td colspan="6">
              <a-form-item>
                <div class="process_header_wrapper">
                  <div class="draggable-columns draggable-columns-1">部门</div>
                  <div class="draggable-columns draggable-columns-1">人员</div>
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
                      <div class="draggable-columns draggable-columns-2">{{ item.departmentName }}</div>
                      <div class="draggable-columns draggable-columns-2">{{ item.trueName }}</div>
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
      haveProcess: [],
      jurisdiction: false, //人员显示隐藏
      depart: '',
      _d: {
        departmentId: '',
        departmentName: '',
      },
    }
  },
  watch: {
    depart: function (val) {
      let _d = this.departmentList.find((_d) => _d.id === val)
      this._d.departmentId = val
      this._d.departmentName = _d.departmentName
    },
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
      this.depart = dep_id
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
      console.log(selectedArray)
      let that = this
      if (!Array.isArray(selectedArray)) return
      selectedArray.map((_ppid) => {
        if (!_ppid) return
        let target = that.haveProcess.find((p) => p.id === _ppid)
        if (!target) {
          let _p = that.postSelectDataSource.find((_p) => _p.id === _ppid)
          console.log(_p)
          that.haveProcess.push({ ..._p, ...that._d })
        }
      })
    },
    //人员显示隐藏
    authorityType(author) {
      console.log(author.target.value)
      if (author.target.value === 1) {
        this.jurisdiction = true
      } else {
        this.jurisdiction = false
      }
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
