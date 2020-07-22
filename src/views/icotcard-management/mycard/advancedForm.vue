<template>
  <a-modal
    title="高级筛选"
    :width="600"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
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
        <a-form-item label="卡号">
          <a-input placeholder="卡号模糊查询" v-model="form.cardNum" />
        </a-form-item>
        <a-form-item label="卡状态">
          <a-select
            placeholder="卡状态"
            v-model="form.cardState"
            style="width: 160px"
          >
            <a-select-option
              v-for="item in ddd"
              :key="item.id"
              :value="item.id"
            >{{item.cardState}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="运营商">
          <a-select
            placeholder="运营商"
            v-model="form.cardState"
            style="width:160px">
            <a-select-option
              v-for="item in kkk"
              :key="item.id"
              :value="item.id"
            >{{item.stationName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="活动状态">
          <a-select
            placeholder="活动状态"
            v-model="form.activeState"
            style="width:160px">
          <a-select-option
            v-for="item in jjj"
            :key="item.id"
            :value="item.id"
          >{{item.state}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="发卡日期">
          <a-range-picker @change="startDateChange" />
        </a-form-item>
        <a-form-item label="激活日期">
          <a-range-picker @change="startDateChange" />
        </a-form-item>
        <a-form-item label="服务期止">
          <a-range-picker @change="startDateChange" />
        </a-form-item>
         <h3 style="font-weight:600">卡流量信息</h3>
        <a-form-item label="是否超量">
          <a-select
            placeholder="是否超量"
            v-model="form.activeState"
            style="width:160px">
          <a-select-option>是</a-select-option>
          </a-select>
        </a-form-item>
        <h3 style="font-weight:600">卡所属信息</h3>
        <a-form-item label="所属机构">
          <a-input placeholder="机构名称模糊查询" v-model="form.cardNum" />
        </a-form-item>
        <a-form-item label="所属设备">
          <a-input placeholder="主板号模糊查询" v-model="form.cardNum" />
        </a-form-item>
        <a-form-item label="出厂日期">
          <a-range-picker @change="startDateChange" />
        </a-form-item>
        <a-form-item label="SIM卡有限期">
          <a-range-picker @change="startDateChange" />
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
      form: this.$form.createForm(this, { name: 'advancedForm' })
        ,ddd:[
            {id:1,cardState:'激活'},
            {id:2,cardState:'未激活'},
        ],
        kkk:[
            {id:1,service:'中国电信'},
            {id:2,service:'中国联通'},
            {id:3,service:'中国移动'},
        ],
        jjj:[
          {id:1,state:'已激活'},
          {id:2,state:'未激活'},
        ]
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
      console.log(date)
      console.log(dateString)
    },
  }
}
</script>

<style>
</style>