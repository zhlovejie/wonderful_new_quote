<template>
  <a-modal
    title="高级筛选"
    :width="600"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
    class="icotcard-advanced"
  >
    <template slot="footer">
      <template>
        <a-button @click="resetForm">重置</a-button>
        <a-button type="primary" @click="searchForm">查询</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline">
        <h3 style="font-weight:600">卡账号信息</h3>
        <a-form-item label="iccid" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-input placeholder="iccid查询" v-model="form.iccid" />
        </a-form-item>
        <a-form-item label="卡状态" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-select
            placeholder="卡状态"
            v-model="form.status"
            style="width: 160px"
          >
            <a-select-option value="正常">正常</a-select-option>
            <a-select-option value="未激活">未激活</a-select-option>
            <a-select-option value="停机">停机</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="运营商" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-input
            placeholder="运营商"
            v-model="form.operatortype"
            style="width:160px">
          </a-input>
        </a-form-item>
        <a-form-item label="活动状态" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-select
            placeholder="活动状态"
            v-model="form.activeState"
            style="width:160px">
          <a-select-option value="开机">开机</a-select-option>
          <a-select-option value="关机">关机</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="发卡日期">
          <a-range-picker @change="startDateChange" />  <!--beginSaledate endSaledate-->
        </a-form-item>
        <a-form-item label="激活日期">
          <a-range-picker @change="startDateChange" /> <!--beginActivationdate endActivationdate-->
        </a-form-item>
        <a-form-item label="服务期止">
          <a-range-picker @change="startDateChange" />  <!--beginValiddate endValiddate-->
        </a-form-item>
         <h3 style="font-weight:600">卡流量信息</h3>
        <a-form-item label="是否超量">
          <a-select
            placeholder="是否超量"
            v-model="form.isExcessive"
            style="width:160px">
          <a-select-option value=0>未超</a-select-option>
          <a-select-option value=1>已超</a-select-option>
          </a-select>
        </a-form-item>
        <h3 style="font-weight:600">卡所属信息</h3>
        <a-form-item label="所属机构">
          <a-input placeholder="机构名称模糊查询" v-model="form.orgName" />
        </a-form-item>
        <a-form-item label="所属设备">
          <a-input placeholder="主板号模糊查询" v-model="form.manId" />
        </a-form-item>
        <a-form-item label="出厂日期">
          <a-range-picker @change="startDateChange" />  <!--beginOutTime endOutTime-->
        </a-form-item>
        <a-form-item label="SIM卡有限期">
          <a-range-picker @change="startDateChange" />  <!--beginBeOverdueTime endBeOverdueTime-->
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  name: 'advancedForm',
  data() {
    return {
      visible: false,
      spinning: false,
      form: this.$form.createForm(this),
    }
  },
  methods: {
    showAdvancedForm() {
      this.visible = true
    },
    handleCancel() {
      this.visible = false
    },
    // 重置
    resetForm() {},
    // 查询
    searchForm() {},
    // 发卡日期
    startDateChange(date, dateString){
      // console.log(date)
      // console.log(dateString)
    },
  }
}
</script>

<style scoped>
.icotcard-advanced >>> .ant-form-item-label {
  width:120px;
}
</style>