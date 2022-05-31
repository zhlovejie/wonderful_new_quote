<template>
  <a-modal title="选择物料" :width="1000" :footer="null" v-model="visible" :maskClosable="false">
    <!-- <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item label="物料代码">
          <a-input style="width: 130px; margin-right: 10px" class="modal-input" v-model="queryParam.materialCode" />
        </a-form-item>
        <a-form-item label="物料名称">
          <a-input style="width: 130px; margin-right: 10px" class="modal-input" v-model="queryParam.materialName" />
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
        </a-form-item>
      </a-form>
    </div> -->
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :loading="loading"
      size="middle"
    >
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
      <span slot="materialCode" slot-scope="text, record">
        <a @click="clickVue(record)">{{ text }}</a>
      </span>
    </a-table>
  </a-modal>
</template>

<script>
import {
  getOrderMaterialExit, //原料出库申请单-新增-根据订单id获取原材料
} from '@/api/material'
export default {
  name: 'MaterialSelect',
  data() {
    return {
      visible: false,
      form: this.$form.createForm(this),
      queryParam: {},
      loading: false,
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' }
        },
        {
          title: '物料代码',
          dataIndex: 'materialCode',
          width: 180,
          scopedSlots: { customRender: 'materialCode' }
        },
        {
          title: '物料名称',
          width: 180,
          dataIndex: 'materialName'
        },
        {
          title: '规格型号',
          dataIndex: 'specification'
        }
      ],
      dataSource: []
    }
  },
  methods: {
    query(record,orderId) {
        console.log('原料出库申请单-新增-record:',record);
        console.log('原料出库申请单-新增-orderId:',orderId);
      this.recordParam = record
      this.visible = true
      let that = this
      getOrderMaterialExit({oderId:orderId})
        .then(res => {
          that.loading = false
          that.dataSource = res.data.materialList.map((item, index) => {
            item.key = index + 1
            return item
          })
        })
        .catch(() => (that.loading = false))
    },
    search() {
      let that = this
      that.loading = true
      
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    clickVue(data) {
      this.$emit('custom-change', {
        selectItem: data, //用户选择项目
        recordParam: this.recordParam //父页面传过来的项目
      })
      this.close()
    }
  }
}
</script>

<style lang="less" scoped>
.modal-input {
  width: 100px;
}
</style>
