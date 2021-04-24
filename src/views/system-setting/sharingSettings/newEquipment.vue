<template>
  <a-modal
    v-if="visible"
    title="操作"
    :width="700"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <table class="custom-table custom-table-border">
          <tr>
            <td>被共享人员</td>
            <td>
              <div style="display: flex">
                <a-form-item>
                  <a-select
                    style="width: 150px; margin-right: 10px; margin-top: 8px"
                    placeholder="选择部门"
                    @change="depChangeHandler2"
                  >
                    <a-select-option v-for="item in depLists" :key="item.id" :value="item.id">{{
                      item.departmentName
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item>
                  <a-select
                    style="width: 150px; margin-right: 10px; margin-top: 8px"
                    placeholder="选择被共享人员"
                    v-decorator="[
                      'userId',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请选择被共享人员!',
                          },
                        ],
                      },
                    ]"
                  >
                    <a-select-option v-for="item in personJoinLists" :key="item.id" :value="item.id">{{
                      item.trueName
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </td>
          </tr>

          <tr>
            <td class="wdf-column">共享人员</td>
            <td>
              <div>
                <div style="display: flex">
                  <a-form-item>
                    <a-select
                      style="width: 150px; margin-right: 10px"
                      placeholder="选择部门"
                      @change="depChangeHandler1"
                    >
                      <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
                        item.departmentName
                      }}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item>
                    <a-select style="width: 150px; margin-right: 10px" placeholder="选择人员" @change="personChange">
                      <a-select-option v-for="item in personJoinList" :key="item.id" :value="item.id">{{
                        item.trueName
                      }}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item>
                    <a-button type="primary" style="margin-right: 10px" @click="joinPersonAction('add')">添加</a-button>
                  </a-form-item>
                  <a-form-item>
                    <a-button type="primary" @click="joinPersonAction('reset')">重选</a-button>
                  </a-form-item>
                </div>
                <div class="join-person-wrapper" style="border: 2px dashed #ddd; padding: 10px 15px 15px 15px">
                  <div style="text-align: left" v-if="oaMeetingJoinList.length > 0">
                    <a-tag
                      v-for="item in oaMeetingJoinList"
                      :key="item._key"
                      style="margin-top: 7px"
                      :closable="!item.__root"
                      :color="item.__root ? 'red' : ''"
                      @close="removeTag(item)"
                      >{{ item.trueName }}</a-tag
                    >
                  </div>
                  <div v-else>暂无共享人员</div>
                </div>
              </div>
              <!-- <a-form-item v-if="isView">{{ detail.oaMeetingJoinUserStr }}</a-form-item> -->
            </td>
          </tr>
          <tr>
            <td class="wdf-column">消息类型</td>
            <td style="padding-top: 31px">
              <a-form-item>
                <a-select
                  placeholder="请选择消息类型"
                  mode="multiple"
                  v-decorator="[
                    'type',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请选择消息类型!',
                        },
                      ],
                    },
                  ]"
                >
                  <a-select-option :value="1">共享系统消息</a-select-option>
                  <a-select-option :value="2">共享待办消息</a-select-option>
                  <a-select-option :value="5">共享已办消息</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByDep, //获取人员
} from '@/api/systemSetting'
import { pushMsgAdd, messagePushaddInfo } from '@/api/workBox'

function makeUUID() {
  return Math.random().toString(32).slice(-10)
}
export default {
  name: 'AndroidModal',
  data() {
    return {
      depList: [],
      personJoinList: [],
      depLists: [],
      personJoinLists: [],
      oaMeetingJoinList: [],
      currentPerson: null,
      visible: false,
      confirmLoading: false,
      type: null,
      record: {},
      id: 0,
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  computed: {
    modalTitle() {
      return this.isAdd ? '新增' : '修改'
    },
    isAdd() {
      return this.type === 'add'
    },
    isModify() {
      return this.type === 'modify'
    },
  },
  created() {
    departmentList().then((res) => (this.depList = res.data)) //部门
    departmentList().then((res) => (this.depLists = res.data)) //部门
  },
  methods: {
    query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      that.record = record
      if (that.isModify) {
        this.filest()
      }
    },
    filest() {
      // messagePushaddInfo({ id: this.record.id }).then((res) => {
      //   let items = res.data

      const that = this
      that.depChangeHandler2(that.record.departmentId)
      that.$nextTick(() => {
        that.form.setFieldsValue({
          userId: that.record.userId,
          type: that.record.type.split(',').map((v) => +v),
          // remark: items.remark,
          // serviceName: items.serviceName,
          // template: items.template,
        })
        that.oaMeetingJoinList = that.record.msgUsers.map((item) => {
          return {
            trueName: item.userName,
            id: item.userId,
          }
        })
      })
      // })
    },
    depChangeHandler1(depId) {
      return getUserByDep({ departmentId: depId }).then((res) => (this.personJoinList = res.data))
    },
    depChangeHandler2(depId) {
      return getUserByDep({ departmentId: depId }).then((res) => (this.personJoinLists = res.data))
    },
    personChange(val) {
      let target = this.personJoinList.find((item) => +item.id === +val)
      if (target) {
        this.currentPerson = Object.assign({}, target)
      }
    },
    joinPersonAction(type) {
      let that = this
      if (type === 'add') {
        if (!that.currentPerson) {
          that.$message.info('请选择会议参与人员')
          return
        }
        if (that.oaMeetingJoinList.find((item) => item.id === that.currentPerson.id)) {
          that.$message.info(`会议参与人员已包括【${that.currentPerson.trueName}】,不能重复添加`)
          return
        }
        that.oaMeetingJoinList.push(Object.assign({}, that.currentPerson, { _key: makeUUID() }))
      } else if (type === 'reset') {
        that.oaMeetingJoinList = that.oaMeetingJoinList.filter((item) => item.__root)
      }
    },
    removeTag(item) {
      this.oaMeetingJoinList = this.oaMeetingJoinList.filter((p) => p._key !== item._key)
    },
    handleOk() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          if (_this.isModify) {
            values.id = _this.record.id
          }
          _this.confirmLoading = true
          values.pushMsgUserShares = this.oaMeetingJoinList.map((item) => {
            return {
              userId: item.id,
            }
          })
          values.type = values.type.toString()
          pushMsgAdd(values).then((res) => {
            console.log(res)
            if (res.code === 200) {
              _this.$message.info(res.msg)
              _this.confirmLoading = false
              _this.visible = false
              _this.$emit('ok')
            } else {
              _this.$message.error(res.msg)
              _this.confirmLoading = false
            }
          })
        }
      })
    },

    handleCancel() {
      this.oaMeetingJoinList = []
      this.visible = false
    },
  },
}
</script>

<style>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.add-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
  width: calc(100% + 2px);
}

.wdf-column {
  width: 160px;
}
</style>
