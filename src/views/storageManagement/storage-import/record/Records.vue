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
    title: '仓库名称',
    dataIndex: 'warehouseName'
  },
  {
    title: '库区',
    dataIndex: 'reservoirAreaName'
  },
  {
    title: '货架/库位',
    dataIndex: 'shelvesLocationName'
  },
  {
    title:'库位码',
    dataIndex:'positionCode'
  },
  {
    title: '托盘',
    dataIndex: 'containerName'
  },
  {
    title: '入库数量',
    dataIndex: 'receiptNum'
  },
  {
    title: '入库人员',
    dataIndex: 'storageUserName'
  },
  {
    title: '入库时间',
    dataIndex: 'storageTime'
  }
]

import { storageRecords } from '@/api/storage_wzz'

export default {
  name: 'stock_management_import_record_records',
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
      return '入库记录'
    }
  },
  methods: {
    query(type, records = []) {
      const that = this
      that.visible = true
      that.type = type
      that.materialTableList = []
      that.spinning = true
      storageRecords({ storageId: records[0].id }).then(res => {
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
