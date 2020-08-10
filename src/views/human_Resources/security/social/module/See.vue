<template>
  <a-modal
    :title="modalTitle"
    :width="1005"
    :visible="visible"
    :maskClosable="false"
    @cancel="handleCancel"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <!-- <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button> -->
      </template>
    </template>

    <a-spin :spinning="spinning">
      <div class="search-wrapper" style="margin-bottom:10px;">
        <a-input
          placeholder="姓名"
          v-model="queryParam.userName"
          allowClear
          style="width: 200px;margin-right:10px;"
        />
        <a-button
          class="a-button"
          type="primary"
          style="position: relative;top:-1px;"
          icon="search"
          @click="searchActionsee"
        >查询</a-button>
      </div>
      <a-table
        :columns="columns"
        :data-source="this.dataSource"
        :scroll="{ x: 2000, y: 300 }"
        :pagination="pagination"
        @change="handleTableChange"
      ></a-table>
    </a-spin>
  </a-modal>
</template>
<script>
import { securitySocial_See } from '@/api/humanResources'
const columns = [
  //   { title: '序号', width: 100, dataIndex: 'name', key: 'name' },
  { title: '台账年月', width: 100, dataIndex: 'accountDate', key: 'accountDate', align: 'center', fixed: 'left' },
  { title: '姓名', dataIndex: 'userName', key: 'userName', align: 'center', fixed: 'left' },
  { title: '费款所属期', dataIndex: 'periodPayment', key: 'periodPayment', align: 'center', fixed: 'left', width: 100 },
  { title: '个人编号', dataIndex: 'personalNumber', align: 'center', key: 'personalNumber' },
  { title: '公民身份证号码', dataIndex: 'cardId', align: 'center', key: 'cardId' },
  { title: '养老基数', dataIndex: 'pensionBase', align: 'center', key: 'pensionBase' },
  { title: '失业基数', dataIndex: 'unemploymentBase', align: 'center', key: 'unemploymentBase' },
  { title: '医疗保险基数', dataIndex: 'medicalInsuranceBase', align: 'center', key: 'medicalInsuranceBase' },
  { title: '工伤基数', dataIndex: 'industrialInjuryBase', align: 'center', key: 'industrialInjuryBase' },
  { title: '生育保险基数', dataIndex: 'maternityInsuranceBase', align: 'center', key: 'maternityInsuranceBase' },
  { title: '养老个人应缴', dataIndex: 'pensionIndividuals', align: 'center', key: 'pensionIndividuals' },
  { title: '养老单位应缴', dataIndex: 'pensionUnit', align: 'center', key: 'pensionUnit' },
  { title: '失业个人应缴', dataIndex: 'unemployedIndividuals', align: 'center', key: 'unemployedIndividuals' },
  { title: '失业单位应缴', dataIndex: 'unemploymentUnit', align: 'center', key: 'unemploymentUnit' },
  {
    title: '医疗保险个人应缴',
    dataIndex: 'medicalInsuranceIndividual',
    align: 'center',
    key: 'medicalInsuranceIndividual',
  },
  { title: '医疗保险单位应缴', dataIndex: 'medicalInsuranceUnit', align: 'center', key: 'medicalInsuranceUnit' },
  { title: '大病单位应缴', dataIndex: 'seriousDiseaseUnit', align: 'center', key: 'seriousDiseaseUnit' },
  { title: '工伤单位应缴', dataIndex: 'industrialInjuryUnit', align: 'center', key: 'industrialInjuryUnit' },
  { title: '生育单位应缴', dataIndex: 'fertilityUnit', align: 'center', key: 'fertilityUnit' },
]

const data = []
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  })
}
export default {
  name: 'BecomingForm',
  components: {},
  data() {
    return {
      data,
      columns,
      queryParam: {},
      visible: false,
      spinning: false,
      modalTitle: '查看社保',
      dataSource: [],
      recordId: '',
      pagination: {
        current: 1,
      },
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'human_Resources_Insurance') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    query(type, record) {
      console.log(type, record)
      this.visible = true
      this.type = type
      this.recordId = record.id
      if (type === 'e') {
        this.searchActionsee()
      }
    },

    searchActionsee() {
      let that = this
      console.log(123)
      that.loading = true
      let _searchParam = Object.assign(
        { socialSecurityId: that.recordId },
        { ...this.queryParam },
        { ...this.pagination }
      )
      securitySocial_See(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      // console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchActionsee()
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>
<style scoped>
/*自定义table样式*/
</style>