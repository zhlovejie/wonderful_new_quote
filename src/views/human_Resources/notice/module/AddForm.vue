<template>
  <a-modal
    :title="modalTitle"
    :width="1005"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button
          class="a-button"
          type="primary"
          icon="close"
          @click="noPassAction(recordDetails)"
        >不通过</a-button>
        <a-button class="a-button" type="primary" icon="check" @click="passAction">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td>标题</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  :disabled="isDisabled"
                  placeholder="标题"
                  :rows="3"
                  v-decorator="['title', { rules: [{ required: true, message: '标题' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>消息</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  :disabled="isDisabled"
                  placeholder="消息"
                  :rows="3"
                  v-decorator="['content', { rules: [{ required: true, message: '消息' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>发布范围</td>
            <td colspan="3">
              <a-form-item>
                <a-checkbox-group v-decorator="['releaseRange']" :disabled="isDisabled">
                  <a-checkbox value="1">公告栏</a-checkbox>
                  <a-checkbox value="2">app消息</a-checkbox>
                  <a-checkbox value="3">短信通知</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>选择人员</td>
            <td colspan="3">
              <a-form-item>
                <a-tree-select
                  v-decorator="['deptId']"
                  style="width: 100%"
                  :tree-data="treeData"
                  :dropdownStyle="{ maxHeight: '300px'}"
                  tree-checkable
                  :show-checked-strategy="SHOW_PARENT"
                  search-placeholder="Please select"
                  :disabled="isDisabled"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import { departmentList } from '@/api/systemSetting' //所有部门
import { NoticeDetails, NoticeAdd, NoticeApproval } from '@/api/humanResources'
// import moment from 'moment'

import Approval from './Approval'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT

export default {
  name: 'BecomingForm',
  components: {
    Approval: Approval,
  },
  data() {
    return {
      value: [],
      treeData: [],
      depSelectDataSource: [],
      SHOW_PARENT,
      visible: false,
      spinning: false,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      type: 'view',
      recordDetails: {},
      record: {},
      isModified: false, //财务人员为 true
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改公告信息'
      }
      let txt = this.isView ? '查看' : this.isEdit ? '审核' : '新增'
      return `${txt}公告信息`
    },
    isView() {
      //查看
      return this.type === 'view'
    },
    isEdit() {
      //审核
      return this.type === 'edit'
    },
    isApproval() {
      //通过不通过
      return this.type === 'edit'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
    // disabled() {
    //   return this.isView || this.isApproval || this.isEditSalary
    // },
    isDisabled() {
      return this.isView || this.isEdit
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'human_Resources_notice') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      let that = this
      let queue = []
      let task1 = departmentList().then((res) => {
        that.treeData = res.data.map((item) => {
          return {
            id: item.id,
            key: item.id,
            value: item.id,
            title: item.departmentName,
            isLeaf: false,
          }
        })
      })

      queue.push(task1)
    },
    elementChange(key, val) {
      console.log(val)
      this[key] = val
    },
    scoreChange(type, event) {
      this[type] = parseInt(event, 10)
    },
    // moment:moment,
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record
      if (record !== null) {
        this.fillData()
      }
    },
    // 详情
    fillData() {
      let that = this
      let id = {
        id: this.record.id,
      }
      NoticeDetails(id).then((res) => {
        that.recordDetails = res.data
        that.form.setFieldsValue({
          title: res.data.title,
          releaseRange: res.data.releaseRangeList,
          content: res.data.content,
          deptId: res.data.deptList,

          // 'applyUserName':res.data.trueName
        })
      })
    },

    handleOk() {
      console.log('你是要提交')
      let that = this
      if (that.isView) {
        that.form.resetFields() // 清空表
        that.visible = false
        return
      } else if (that.type === 'add' || that.type === 'edit-salary') {
        that.spinning = true
        that.form.validateFields((err, values) => {
          if (!err) {
            values.deptId = values.deptId.toString()
            values.releaseRange = values.releaseRange.toString()
            if (that.type === 'edit-salary') {
              values.id = that.recordDetails.id
            }
            NoticeAdd(values)
              .then((res) => {
                that.spinning = false
                console.log(res)
                that.form.resetFields() // 清空表
                that.visible = false
                that.$message.info(res.msg)
                that.$emit('finish')
              })
              .catch((err) => (that.spinning = false))
          }
        })
      } else if (that.isEditSalary) {
        // that.updateUserBackCardSalary()
      } else {
        that.form.resetFields() // 清空表
        that.visible = false
      }
    },
    handleCancel() {
      this.form.resetFields() // 清空表
      this.visible = false
    },
    submitAction(opt) {
      let that = this
      let values = {
        approveId: this.recordDetails.id,
        isAdopt: opt.isAdopt,
        opinion: opt.opinion,
      }
      console.log(values)
      that.spinning = true
      NoticeApproval(values)
        .then((res) => {
          that.spinning = false
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
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
      console.log(that.$refs.approval.query())
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
</style>