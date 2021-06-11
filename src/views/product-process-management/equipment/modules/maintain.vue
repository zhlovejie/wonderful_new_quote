<template>
  <a-spin :spinning="spinning">
    <h3 style="margin-top: 20px">保养资料</h3>
    <a-form :form="form" class="becoming-form-wrapper">
      <table class="custom-table custom-table-border">
        <tr>
          <th>序号</th>
          <th>保养内容</th>
          <th>保养周期</th>
          <th>保养人</th>
          <th>验收负责人</th>
        </tr>
        <tr v-for="(item, index) in programme" :key="item.key">
          <td>{{ index + 1 }}</td>
          <td>
            <a-form-item>
              <a-input
                placeholder="保养内容"
                :disabled="isDisabled"
                style="width: 180px"
                @change="inputChange($event, item.key, 'careContent')"
                v-decorator="[
                  `programme.${index}.careContent`,
                  { initialValue: item.careContent, rules: [{ required: true, message: '请输入保养内容' }] },
                ]"
              />
            </a-form-item>
          </td>
          <td>
            <a-form-item>
              <a-select
                placeholder="保养周期"
                :disabled="isDisabled"
                :allowClear="true"
                mode="multiple"
                style="width: 180px"
                @change="inputChange($event, item.key, 'careType')"
                v-decorator="[
                  `programme.${index}.careType`,
                  { initialValue: item.careType, rules: [{ required: true, message: '请输入保养周期' }] },
                ]"
              >
                <a-select-option :value="1">周</a-select-option>
                <a-select-option :value="2">月</a-select-option>
                <a-select-option :value="3">年</a-select-option>
              </a-select>
            </a-form-item>
          </td>
          <td>
            <a-form-item>
              <DepUserSelect
                :disabled="isDisabled"
                :depId="item.careDepartmentId"
                :userId="item.careUserId"
                @change="
                  (...args) => {
                    depUserChange('careDepartmentId', item.key, ...args)
                  }
                "
                style="width: 100%"
              />
            </a-form-item>
          </td>
          <td>
            <a-form-item>
              <DepUserSelect
                :disabled="isDisabled"
                :depId="item.checkDepartmentId"
                :userId="item.checkUserId"
                @change="
                  (...args) => {
                    depUserChange1('checkDepartmentId', item.key, ...args)
                  }
                "
                style="width: 100%"
              />
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td colspan="5">
            <a-button style="width: 100%" type="dashed" icon="plus" @click="addprogramme()"></a-button>
          </td>
        </tr>
      </table>
    </a-form>
  </a-spin>
</template>
<script>
let uuid = () => Math.random().toString(32).slice(-10)
import DepUserSelect from './DepUserSelect'
export default {
  name: 'BecomingForm',
  components: { DepUserSelect },
  data() {
    return {
      userInfo: this.$store.getters.userInfo, // 当前登录人
      programme: [],
      userList: [],
      department: [],
      values: [],
      spinning: false,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      type: 'view',
      record: {},
    }
  },
  computed: {
    isView() {
      //查看
      return this.type === 'view'
    },
    isEdit() {
      //修改
      return this.type === 'edit'
    },
    isDisabled() {
      return this.isView
    },
  },
  methods: {
    //保养人
    depUserChange(type, key, depId, userId) {
      let programme = [...this.programme]
      let target = programme.find((item) => item.key === key)
      if (target) {
        target['careDepartmentId'] = depId
        target['careUserId'] = userId
        this.programme = [...programme]
      }
    },
    //验收负责人
    depUserChange1(type, key, depId, userId) {
      let programme = [...this.programme]
      let target = programme.find((item) => item.key === key)
      if (target) {
        target['checkDepartmentId'] = depId
        target['checkUserId'] = userId
        this.programme = [...programme]
      }
    },
    inputChange(event, key, field) {
      let programme = [...this.programme]
      let target = programme.find((item) => item.key === key)
      if (target) {
        target[field] = event instanceof Event ? event.target.value : event
        this.programme = programme
      }
    },
    addprogramme() {
      let that = this
      that.programme.push({
        key: uuid(),
        careContent: undefined,
        careType: undefined,
        careDepartmentId: undefined,
        checkDepartmentId: undefined,
        careUserId: undefined,
        checkUserId: undefined,
        // beginData: undefined,
      })
    },
    initDepList() {
      //部门  id,departmentName
      return getDevisionManagementList({ parentId: 4, current: 1, size: 200 }).then(
        (res) => (this.department = res.data.records)
      )
    },
    initUserList(depId) {
      //人员 id,trueName
      if (!depId) {
        this.userList = []
        return
      }
      return getUserByDep({ departmentId: depId }).then((res) => (this.userList = res.data))
    },
    depChangeHandler(depId) {
      this.userList = []
      this.initUserList(depId)
    },
    departmentChange(name, id) {
      this.months = id
      this.month = name
    },
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record
      if (type === 'add') {
        this.addprogramme()
      } else {
        this.programme = this.record.developmentCraftDevCares
      }
    },

    handleOk() {
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          let react = that.programme.map((item) => {
            return {
              careContent: item.careContent,
              careDepartmentId: item.careDepartmentId,
              careType: item.careType.toString(),
              careUserId: item.careUserId,
              checkDepartmentId: item.checkDepartmentId,
              checkUserId: item.checkUserId,
            }
          })
          that.$emit('file', react)
        }
      })
    },
    hendle() {
      return this.values
    },
    handleCancel() {
      this.programme = []
      this.remark = '' // 清空表
      this.visible = false
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