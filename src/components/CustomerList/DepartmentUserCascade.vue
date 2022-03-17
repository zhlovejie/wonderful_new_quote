<template>
  <a-row>
    <a-col :span="11">
      <a-select
        style="width: 100%"
        show-search
        :filter-option="filterOption"
        :value="selfInfo.depId"
        @change="depChange"
        v-bind="$attrs"
        placeholder="部门"
      >
        <a-select-option
          v-for="item in depList"
          :key="item.id"
          :value="item.id"
          >{{ item.departmentName }}</a-select-option
        >
      </a-select>
    </a-col>
    <a-col :span="11" :offset="2">
      <a-select
        style="width: 100%"
        show-search
        :filter-option="filterOption"
        :value="selfInfo.userId"
        @change="userChange"
        v-bind="$attrs"
        placeholder="人员"
      >
        <a-select-option
          v-for="item in userList"
          :key="item.id"
          :value="item.id"
          >{{ item.trueName }}</a-select-option
        >
      </a-select>
    </a-col>
  </a-row>
</template>

<script>
/**
 * @description 部门人员级联选择，支持双向绑定
 */
import {
  departmentList, //所有部门
  getUserByDep, //获取人员
} from '@/api/systemSetting'

export default {
  name: "DepUserCasecade",
  props: ["info"],
  data() {
    return {
      depList: [],
      userList: [],
      selfInfo: {
        depId: undefined,
        userId: undefined,
      },
    };
  },
  mounted() {
    this.fetchDep();
  },
  watch: {
    info: {
      handler(v) {
        const that = this;
        if(!(typeof v === 'object')){
          return
        }
        console.log("watch called...", JSON.stringify(v, null, 2));
        const { depId, userId } = v;
        this.selfInfo = { depId, userId };
        depId && that.fetchUser(depId);
      },
      immediate: true,
    },
  },
  methods: {
    fetchDep() {
      const that = this;
      console.log("加载部门...");
      departmentList().then((res) => {
        that.depList = res.data
      })
    },
    fetchUser(depId) {
      const that = this;
      console.log(`加载人员...${depId}部门`);
      getUserByDep({ departmentId: depId }).then((res) => (that.userList = res.data))
    },
    depChange(depId) {
      const that = this;
      that.selfInfo = {
        ...that.selfInfo,
        depId: depId,
        userId: undefined,
      };
      that.userList = [];
      depId && that.fetchUser(depId);
    },
    userChange(_userId) {
      const that = this;
      that.selfInfo = {
        ...that.selfInfo,
        userId: _userId,
      };

      const { depId, userId } = that.selfInfo;
      const dep = that.depList.find((u) => u.id === depId);
      const user = that.userList.find((u) => u.id === userId);
      const params = {
        depId,
        depName: dep ? dep.departmentName : undefined,
        userId,
        userName: user ? user.trueName : undefined,
        mobile: user ? user.mobile : undefined,
      };
      that.$emit("update:info", params);
      that.$emit("change", params);
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
  },
};
</script>
