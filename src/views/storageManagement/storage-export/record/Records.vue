<template>
  <a-modal
    :title="modalTitle"
    :width="1200"
    :visible="visible"
    @cancel="handleCancel"
    :destroyOnClose="true"
    :maskClosable="false"
    :footer="null"
    :forceRender="true"
  >
    <a-table :columns="columns" :dataSource="materialTableList" :pagination="false" size="middle">
      <div slot="order" slot-scope="text, record, index">
        {{ index + 1 }}
      </div>
    </a-table>
  </a-modal>
</template>

<script>

const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode'
  },
  {
    title: '物料名称',
    dataIndex: 'materialName'
  },
  {
    title: '规格型号',
    dataIndex: 'specification'
  },
  {
    title: '辅计量单位',
    dataIndex: 'subUnit'
  },
  {
    title: '出库数量',
    dataIndex: 'exWarehouseNum'
  },
  {
    title: '已出库数量',
    dataIndex: 'alreadyExWarehouseNum'
  },
  {
    title: '未出库数量',
    dataIndex: 'notExWarehouseNum'
  },
  // {
  //   title: '入库时间',
  //   dataIndex: 'storageTime'
  // }
]

import { exWarehouseRecords } from '@/api/storage_wzz'

export default {
  name: 'stock_management_export_record_records',
  data() {
    return {
      visible: false,
      spinning: false,
      type: 'view',
      columns,
      materialTableList:[]
    }
  },
  computed: {
    modalTitle() {
      return '出库记录'
    }
  },
  methods: {
    query(type, records = []) {
      const that = this
      that.visible = true
      that.type = type
      that.materialTableList = []
      that.spinning = true
      exWarehouseRecords({ id: records.id }).then(res => {
        that.spinning = false
        that.materialTableList = (res.data || []).map(item => {
          item.key = that._uuid()
          return item
        })
      }).catch(err => {
        that.spinning = false
        that.$message.error(err.message)
      })
    },

    handleSubmit(type) {
      const that = this
      if (type === 'cancel') {
        that.handleCancel()
        return
      }
    },
    handleCancel() {
      const that = this
      that.$nextTick(() => {
        that.visible = false
      })
    }
  }
}
</script>

<style scoped>
.stock_management_import_record-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px;
}
.custom-table-border {
  margin-bottom: 0;
}
.custom-table-border caption {
  text-align: left;
}

.__hd {
  font-size: 16px;
}
.__bd {
  margin-bottom: 10px;
}
.__footer {
  text-align: center;
  margin-top: 20px;
}
.__footer * {
  margin: 0 5px;
}
</style>
