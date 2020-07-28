<template>
  <a-modal
    title="高级筛选"
    :width="700"
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
      <a-form :form="form" >
        <h3 style="font-weight:600">卡账号信息</h3>
        <a-form-item label="iccid" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" style="margin-bottom:6px">
          <a-input placeholder="iccid查询" v-model="form.iccid" />
        </a-form-item>
        <a-form-item label="卡状态" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" style="margin-bottom:6px">
          <a-select
            placeholder="卡状态"
            v-model="form.status"
            style="margin-bottom:6px"
          >
            <a-select-option value="正常">正常</a-select-option>
            <a-select-option value="未激活">未激活</a-select-option>
            <a-select-option value="停机">停机</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="运营商" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" style="margin-bottom:6px">
          <a-input
            placeholder="运营商"
            v-model="form.operatortype">
          </a-input>
        </a-form-item>
        <a-form-item label="活动状态" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" style="margin-bottom:6px">
          <a-select
            placeholder="活动状态"
            v-model="form.activeState"
            style="width:160px">
          <a-select-option value="开机">开机</a-select-option>
          <a-select-option value="关机">关机</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="发卡日期" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" style="margin-bottom:6px">
          <a-range-picker @change="saleDateChange" v-model="saleDate" />  <!--beginSaledate endSaledate-->
        </a-form-item>
        <a-form-item label="激活日期" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" style="margin-bottom:6px">
          <a-range-picker @change="activeDateChange" v-model="activeDate" /> <!--beginActivationdate endActivationdate-->
        </a-form-item>
        <a-form-item label="服务期止" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" style="margin-bottom:6px">
          <a-range-picker @change="validDateChange" v-model="validDate" />  <!--beginValiddate endValiddate-->
        </a-form-item>
         <h3 style="font-weight:600">卡流量信息</h3>
        <a-form-item label="是否超量" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" style="margin-bottom:6px">
          <a-select
            placeholder="是否超量"
            v-model="form.isExcessive"
            style="width:160px">
          <a-select-option value=0>未超</a-select-option>
          <a-select-option value=1>已超</a-select-option>
          </a-select>
        </a-form-item>
        <h3 style="font-weight:600">卡所属信息</h3>
        <a-form-item label="所属机构" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" style="margin-bottom:6px">
          <a-input placeholder="机构名称模糊查询" v-model="form.orgName" />
        </a-form-item>
        <a-form-item label="所属设备" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" style="margin-bottom:6px">
          <a-input placeholder="主板号模糊查询" v-model="form.manId" />
        </a-form-item>
        <a-form-item label="出厂日期" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" style="margin-bottom:6px">
          <a-range-picker @change="outDateChange" v-model="outDate" />  <!--beginOutTime endOutTime-->
        </a-form-item>
        <a-form-item label="SIM卡有限期" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" style="margin-bottom:6px">
          <a-range-picker @change="beOverDateChange" v-model="beOverDate" />  <!--beginBeOverdueTime endBeOverdueTime-->
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
      form: {},
      saleDate:[undefined,undefined],
      activeDate:[undefined,undefined],
      validDate:[undefined,undefined],
      outDate:[undefined,undefined],
      beOverDate:[undefined,undefined],
    }
  },
  methods: {
    showAdvancedForm() {
      this.visible = true
      this.resetForm()
    },
    handleCancel() {
      this.visible = false
    },
    // 重置
    resetForm() {
      this.form={}
      this.saleDate=[undefined,undefined]
      this.activeDate=[undefined,undefined]
      this.validDate=[undefined,undefined]
      this.outDate=[undefined,undefined]
      this.beOverDate=[undefined,undefined]
    },
    // 查询
    searchForm() {
      this.form.current=1
      this.$emit('advancedForm',this.form)
      this.visible = false
    },
    // 发卡日期
    saleDateChange(date, dateString){
      if (Array.isArray(date)) {
        if (date.length === 2) {
          this.saleDate=date
          this.form.beginSaledate = date[0].format('YYYY-MM-DD')
          this.form.endSaledate = date[1].format('YYYY-MM-DD')
        } else {
          this.form.beginSaledate = undefined
          this.form.endSaledate = undefined
        }
      }
    },
    // 激活日期
    activeDateChange(date, dateString){
      if (Array.isArray(date)) {
        if (date.length === 2) {
          this.activeDate=date
          this.form.beginActivationdate = date[0].format('YYYY-MM-DD')
          this.form.endActivationdate = date[1].format('YYYY-MM-DD')
        } else {
          this.form.beginActivationdate = undefined
          this.form.endActivationdate = undefined
        }
      }
    },
    // 服务日期
    validDateChange(date, dateString){
      if (Array.isArray(date)) {
        if (date.length === 2) {
          this.validDate=date
          this.form.beginValiddate = date[0].format('YYYY-MM-DD')
          this.form.endValiddate = date[1].format('YYYY-MM-DD')
        } else {
          this.form.beginValiddate = undefined
          this.form.endValiddate = undefined
        }
      }
    },
    // 出厂日期
    outDateChange(date, dateString){
      if (Array.isArray(date)) {
        if (date.length === 2) {
          this.outDate=date
          this.form.beginOutTime = date[0].format('YYYY-MM-DD')
          this.form.endOutTime = date[1].format('YYYY-MM-DD')
        } else {
          this.form.beginOutTime = undefined
          this.form.endOutTime = undefined
        }
      }
    },
    // sim卡有效期日期
    beOverDateChange(date, dateString){
      if (Array.isArray(date)) {
        if (date.length === 2) {
          this.beOverDate=date
          this.form.beginBeOverdueTime = date[0].format('YYYY-MM-DD')
          this.form.endBeOverdueTime = date[1].format('YYYY-MM-DD')
        } else {
          this.form.beginBeOverdueTime = undefined
          this.form.endBeOverdueTime = undefined
        }
      }
    },
  }
}
</script>

<style scoped>
.icotcard-advanced >>> .ant-form-item-label {
  width:120px;
}
</style>