<template>
  <a-spin :spinning="spinning">
    <h3 style="margin-top: 20px">售后服务</h3>
    <a-form :form="form" class="becoming-form-wrapper">
      <table class="custom-table custom-table-border">
        <tr>
          <th>序号</th>
          <th>联系单位</th>
          <th>联系人</th>
          <th>联系电话</th>
          <th>操作</th>
        </tr>
        <tr v-for="(item, index) in programme" :key="item.key">
          <td>{{ index + 1 }}</td>
          <td>
            <a-form-item>
              <a-input
                placeholder="联系单位"
                :disabled="isDisabled"
                style="width: 80%"
                @change="inputChange($event, item.key, 'relationUnit')"
                v-decorator="[
                  `programme.${index}.relationUnit`,
                  { initialValue: item.relationUnit, rules: [{ required: true, message: '请输入联系方式' }] },
                ]"
              />
            </a-form-item>
          </td>
          <td>
            <a-form-item>
              <a-input
                placeholder="联系人"
                :disabled="isDisabled"
                style="width: 80%"
                @change="inputChange($event, item.key, 'relationUserName')"
                v-decorator="[
                  `programme.${index}.relationUserName`,
                  { initialValue: item.relationUserName, rules: [{ required: true, message: '请输入联系人' }] },
                ]"
              />
            </a-form-item>
          </td>
          <td>
            <a-form-item>
              <a-input
                placeholder="联系电话"
                :disabled="isDisabled"
                style="width: 80%"
                @change="inputChange($event, item.key, 'relationUserTel')"
                v-decorator="[
                  `programme.${index}.relationUserTel`,
                  { initialValue: item.relationUserTel, rules: [{ required: true, message: '请输入联系电话' }] },
                ]"
              />
            </a-form-item>
          </td>
          <td>
            <a-popconfirm title="确认删除该条数据吗?" @confirm="handleAction(index)">
              <a href="javascript:;">删除</a>
            </a-popconfirm>
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
      values: [],
      department: [],
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
        safeContent: undefined,
      })
    },
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record
      if (type === 'add') {
        this.addprogramme()
      } else {
        this.fillData()
      }
    },
    //删除
    handleAction(index) {
      this.programme.splice(index, 1)
    },
    // 详情
    fillData() {
      let that = this
      //   let id = {
      //     oaTrainYearPlanId: this.record.id,
      //   }
      //   annualDetail(id).then((res) => {
      //     this.year = res.data.year
      //     this.remark = res.data.remark
      //     this.programme = res.data.planItemList.map((item) => {
      //       let arr = item.itemList.map((i) => {
      //         return {
      //           beginData: [moment(i.beginTime), moment(i.endTime)],
      //           beginTime: moment(i.beginTime),
      //           endTime: moment(i.endTime),
      //           joinPerson: i.joinPerson,
      //           title: i.title,
      //         }
      //       })
      //       return {
      //         month: item.monthStr,
      //         monthId: item.month,
      //         oaTrainYearPlanItemDetailSaveBoList: arr,
      //       }
      //     })
      //   })
    },

    handleOk() {
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          this.values = values.programme
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