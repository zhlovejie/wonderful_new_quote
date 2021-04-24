<template>
  <!--部门人员级联多选 -->
  <div class="dep-user-mul-select-wrapper">
    <div class="dep-user-mul-select__content" v-if="!disabled">
      <div style="display: flex">
        <a-form-item>
          <a-select
            v-model="userInfo.depId"
            style="width: 150px; margin-right: 10px"
            placeholder="选择部门"
            @change="depChange"
          >
            <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select
            v-model="userInfo.userId"
            style="width: 150px; margin-right: 10px"
            placeholder="选择人员"
            @change="userChange"
          >
            <a-select-option v-for="item in userList" :key="item.id" :value="item.id">{{
              item.trueName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" style="margin-right: 10px" @click="userAction('add')">添加</a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="userAction('reset')">重选</a-button>
        </a-form-item>
      </div>
    </div>
    <div class="dep-user-mul-select__views">
      <div style="text-align: " v-if="!disabled && joinList.length > 0">
        <a-tag
          v-for="item in joinList"
          :key="item.keys"
          style="margin-top: 7px"
          :closable="true"
          @close="removeTag(item)"
          >{{ item.trueName }}</a-tag
        >
      </div>
      <div style="text-align: left" v-else-if="disabled && joinList.length > 0">
        {{ joinList.map((u) => u.trueName).join(',') }}
      </div>
      <div v-else></div>
    </div>
  </div>
</template>
<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByDep, //获取人员
} from '@/api/systemSetting'

function makeUUID() {
  return Math.random().toString(32).slice(-10)
}
export default {
  name: 'DepUserMulSelect',
  props: {
    users: {
      type: Array,
      default: function () {
        return []
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      depList: [],
      userList: [],
      userInfo: {},
      current: null,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      joinList: [],
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    joinList() {
      this.$emit('change', [...this.joinList])
    },
  },
  methods: {
    async init() {
      let that = this
      await that.initDepList()
      await that.initUserList(that.depId)

      that.joinList = that.users.map((u) => {
        return { ...u, keys: makeUUID() }
      })
      // that.userInfo = {
      //   depId:that.depId || undefined,
      //   userId: that.userId || undefined
      // }
    },
    initDepList() {
      //部门  id,departmentName
      return departmentList().then((res) => (this.depList = res.data))
    },
    initUserList(depId) {
      //人员 id,trueName
      this.userInfo = { ...this.userInfo, userId: undefined }
      if (!depId) {
        this.userList = []
        return
      }
      return getUserByDep({ departmentId: depId }).then((res) => (this.userList = res.data))
    },
    depChange(depId) {
      this.userList = []
      this.initUserList(depId)
    },
    userChange(val) {
      let target = this.userList.find((item) => +item.id === +val)
      if (target) {
        this.current = Object.assign({}, target)
      }
    },
    userAction(type) {
      let that = this
      if (type === 'add') {
        if (!that.current) {
          that.$message.info('请选择人员')
          return
        }
        if (that.joinList.find((item) => item.id === that.current.id)) {
          that.$message.info(`人员已包括【${that.current.trueName}】,不能重复添加`)
          return
        }
        that.joinList.push(Object.assign({}, that.current, { keys: makeUUID() }))
      } else if (type === 'reset') {
        that.joinList = []
      }
    },
    removeTag(item) {
      this.joinList = this.joinList.filter((p) => p.keys !== item.keys)
    },
  },
}
</script>

<style scoped>
.dep-user-mul-select__views {
  border: 2px dashed #ddd;
  padding: 10px 15px 15px 15px;
  text-align: left;
}
</style>