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
                <a-input disabled :rows="3" v-model="parentId" />
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
                  v-decorator="['folderName', { rules: [{ required: true, message: '输入文件名称' }] }]"
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
                  v-decorator="['remark', { rules: [{ required: false, message: '请输入备注' }] }]"
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
                  v-decorator="['authorityType',{ rules: [{ required: true, message: '请选择权限' }] }]"
                >
                  <a-radio :value="1">公开</a-radio>
                  <a-radio :value="2">私密</a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
          </tr>
          <template v-if="jurisdiction">
            <tr v-if="dis">
              <td colspan="6">
                <b>选择人员</b>
              </td>
            </tr>
            <tr v-if="dis">
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
                    v-decorator="['authTrainFolderBoList']"
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
            <tr>
              <td colspan="6">人员详情</td>
            </tr>
            <tr>
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
                        <div class="draggable-columns draggable-columns-1">{{ item.departmentName }}</div>
                        <div class="draggable-columns draggable-columns-1">{{ item.userName }}</div>
                        <div class="draggable-columns draggable-columns-3" title="删除">
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
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { getDevisionList } from '@/api/systemSetting'
import { folderUser } from '@/api/training-management'
import {
  materialsAdd,
  materialsDetail,
  getFolderlistrainList,
  meetinglistMycheckCanModifyl,
} from '@/api/training-management'
import { queryList } from '@/api/humanResources'
import vuedraggable from 'vuedraggable'

export default {
  name: 'BecomingForm',
  components: {
    vuedraggable,
  },
  data() {
    return {
      visible: false,
      // disll: true,
      spinning: false,
      isDisabled: true,
      dis: true,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      userInfo: this.$store.getters.userInfo, // 当前登录人
      departmentList: [],
      type: 'add',
      record: {},
      postSelectDataSource: [],
      haveProcess: [],
      haves: [],
      jurisdiction: false, //人员显示隐藏
      targetValue: '',
      parentId: '' || '无',
      stateType: '',
      depart: '',
      _d: {
        departmentId: '',
        departmentName: '',
      },
      addId: '',
    }
  },
  watch: {
    depart: function (val) {
      let _d = this.departmentList.find((_d) => _d.id === val)
      this._d.departmentId = val
      this._d.departmentName = _d.departmentName
    },
    targetValue: function (val) {
      if (val === 1) {
        this.dis = this.addId === -1 ? true : false
      }
    },
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '文件夹'
      }
      let txt = this.isView ? '新增' : '修改'
      return `${txt}文件夹`
    },
    isView() {
      //新增
      return this.type === 'add' || this.type === 'folder'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
  },

  methods: {
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record
      getDevisionList().then((res) => {
        this.departmentList = res.data
      })
      if (type === 'edit-salary') {
        this.addId = record.Id
        console.log(this.addId)
        this.parentId = record.Id === -1 ? '无' : record.name
        this.dis = record.Id === -1 ? true : false
        this.fillData()
      }
      if (type === 'add') {
        this.addId = record.Id
        this.stateType = record.type
        console.log(record.type)
        this.parentId = record.Id === -1 ? '无' : record.name
        this.dis = record.Id === -1 ? true : false
        if (record.Id != -1) {
          getFolderlistrainList({ folderId: record.Id }).then((res) => {
            this.haveProcess = res.data
            this.form.setFieldsValue({
              authorityType: record.type,
            })
          })
          this.jurisdiction = record.type === 1 ? true : false
        }
      }
      if (type === 'folder') {
        this.addId = record.id
        this.parentId = record.folderName
        this.stateType = record.authorityType
        this.dis = record.id === -1 ? true : false
        getFolderlistrainList({ folderId: record.id }).then((res) => {
          this.haveProcess = res.data
          this.form.setFieldsValue({
            authorityType: record.authorityType,
          })
        })
        this.jurisdiction = record.authorityType === 1 ? true : false
      }
    },

    fillData() {
      queryList({ departmentId: this.record.deptId }).then((res) => {
        this.postSelectDataSource = res.data
      })
      this.$nextTick(() => {
        materialsDetail({ folderId: this.record.id }).then((res) => {
          this.haves = res.data.parentOaTrainFolerPermissionsDetailVoList
          this.haveProcess = res.data.oaTrainFolerPermissionsDetailVoList
          const arr = []
          res.data.oaTrainFolerPermissionsDetailVoList.map((item) => {
            arr.push(item.userId)
          })
          if (res.data.authorityType === 1) {
            this.jurisdiction = true
            this.dis = this.record.Id === -1 ? true : false
          }
          this.form.setFieldsValue({
            folderName: res.data.folderName,
            remark: res.data.remark,
            authorityType: res.data.authorityType,
            authTrainFolderBoList: arr,
          })
        })
      })
    },

    handleOk() {
      console.log('你这是要提交')
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          if (this.haveProcess.length > 0) {
            values.authTrainFolderBoList = this.haveProcess.map((item) => {
              return {
                departmentId: item.departmentId,
                userId: item.userId,
              }
            })
          }
          if (this.type === 'add') {
            values.parentId = this.addId
          }
          if (this.type === 'edit-salary') {
            values.id = this.record.id
          }
          if (values.parentId === '无') {
            values.parentId = -1
          }
          if (this.type === 'folder') {
            values.parentId = this.record.id
          }
          console.log(values)
          materialsAdd(values).then((res) => {
            that.spinning = false
            console.log(res)
            that.form.resetFields() // 清空表
            that.haveProcess = []
            that.form.setFieldsValue({
              authTrainFolderBoList: [],
            })
            that.visible = false
            that.jurisdiction = false
            that.$message.info(res.msg)
            let arr = { id: that.addId }
            that.$emit('finish', arr)
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
      this.haveProcess = []
      this.form.resetFields() // 清空表
      this.visible = false
      this.jurisdiction = false
    },
    //清空
    processClearAction() {
      this.haveProcess = []
      this.form.setFieldsValue({
        authTrainFolderBoList: [],
      })
    },
    addProcess(selectedArray) {
      let that = this
      if (!Array.isArray(selectedArray)) return
      selectedArray.map((_ppid) => {
        if (!_ppid) return
        console.log(that.haveProcess)
        let target = that.haveProcess.find((p) => p.userId === _ppid)
        if (!target) {
          let _p = that.postSelectDataSource.find((_p) => _p.id === _ppid)
          _p.userId = _p.id
          _p.userName = _p.trueName
          that.haveProcess.push({ ..._p, ...that._d })
        }
      })
    },
    //人员显示隐藏
    authorityType(author) {
      let that = this
      that.$nextTick(() => {
        that.targetValue = author.target.value
        if (that.addId === -1 && that.type === 'add' && author.target.value === 1) {
          that.jurisdiction = true
          that.dis = that.addId === -1 ? true : false
        } else {
          that.jurisdiction = false
        }
        if (that.addId != -1 && (that.type === 'add' || that.type === 'folder') && author.target.value === 1) {
          if (author.target.value === that.stateType) {
            that.jurisdiction = true
            that.dis = that.addId === -1 ? true : false
          } else {
            that.jurisdiction = false
            that.$message.error('请和父级权限保持一致')
            that.form.setFieldsValue({
              authorityType: that.stateType,
            })
          }
        }
        if (that.addId != -1 && (that.type === 'add' || that.type === 'folder') && author.target.value === 2) {
          if (author.target.value === that.stateType) {
            that.jurisdiction = false
          } else {
            that.jurisdiction = true
            that.dis = that.addId === -1 ? true : false
            that.$message.error('请和父级权限保持一致')
            that.form.setFieldsValue({
              authorityType: that.stateType,
            })
          }
        }
        if (author.target.value === 2 && that.type === 'edit-salary') {
          meetinglistMycheckCanModifyl({ folderId: that.record.id }).then((res) => {
            if (res.code === 200) {
              that.jurisdiction = false
              that.form.setFieldsValue({
                authorityType: 2,
              })
            } else {
              that.$message.error(res.msg)
              that.jurisdiction = true
              that.form.setFieldsValue({
                authorityType: 1,
              })
            }
          })
        }

        if (that.addId === -1 && that.type === 'edit-salary') {
          that.jurisdiction = true
        } else {
          if (author.target.value === 1 && that.type === 'edit-salary') {
            let hascliss = that.haves.length > 0 ? true : false
            if (!hascliss) {
              that.jurisdiction = false
              that.$message.error('上级为私密 ，当前等级不能设为公开')
              that.form.setFieldsValue({
                authorityType: 2,
              })
            } else {
              that.jurisdiction = true
              debugger
              let haveProcess = that.haveProcess.length > 0 ? true : false
              if (!haveProcess) {
                that.haveProcess = that.haves
              }
              that.form.setFieldsValue({
                authorityType: 1,
              })
            }
          }
        }
      })
    },
    selectFilter(input, option) {
      // 下拉框搜索
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    confirm(cpId, index) {
      // 确认删除事件
      if (this.type === 'edit-salary') {
        folderUser({ folderId: this.record.id, userId: cpId }).then((res) => {
          if (res.code === 200) {
            this.haveProcess.splice(index, 1)
            let arr = []
            this.haveProcess.map((item) => {
              arr.push(item.userId)
            })
            this.form.setFieldsValue({
              authTrainFolderBoList: arr,
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.haveProcess.splice(index, 1)
        let arr = []
        this.haveProcess.map((item) => {
          arr.push(item.userId)
        })
        this.form.setFieldsValue({
          authTrainFolderBoList: arr,
        })
      }
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
