<template>
  <a-modal
    :title="modalTitle"
    :width="1200"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
    :footer="null"
    :forceRender="true"
  >
    <a-spin :spinning="spinning">
      <a-form-model ref="ruleForm" :model="form" class="stock_management_import_record-wrapper">
        <div class="card-item">
          <div class="__hd">物料信息</div>
          <div class="__bd">
            <a-table :columns="columns" :dataSource="form.materialTableList" :pagination="false" size="small">
              <div slot="order" slot-scope="text, record, index">
                {{ index + 1 }}
              </div>
            </a-table>
          </div>
          <div class="__hd">基本信息</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">入库仓库/库区</td>
                <td colspan="3">
                  <a-row :gutter="20">
                    <a-col :span="6"> 仓库:{{ form.warehouseName }} </a-col>

                    <a-col :span="6"> 库区:{{ form.reservoirName }} </a-col>

                    <a-col :span="6"> 货架:{{ form.shelvesLocationName }} </a-col>

                    <a-col :span="6"> 仓位{{ form.positionCode }} </a-col>
                  </a-row>
                </td>
              </tr>
              <tr>
                <td>容器/托盘代码</td>
                <td colspan="3">
                  <span>{{ form.palletName }}</span>
                </td>
              </tr>
              <tr>
                <td>制单员</td>
                <td>{{ form.makerName || '-' }}</td>
                <td>制单时间</td>
                <td>{{ form.makerDate || '-' }}</td>
              </tr>
              <tr>
                <td>入库员</td>
                <td>{{ form.storageUserName || '-' }}</td>
                <td>入库时间</td>
                <td>{{ form.storageTime || '-' }}</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="__footer">
          <a-button type="primary" @click="handleSubmit('cancel')">关闭</a-button>
        </div>
      </a-form-model>
    </a-spin>
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
    title: '入库类型',
    dataIndex: 'storageTypeText'
  },
  {
    title: '入库单号',
    dataIndex: 'storageCode'
  },
  {
    title: '紧急程度',
    dataIndex: 'urgentTypeText'
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
    title: '应入库数量',
    dataIndex: 'actualNum'
  },
  {
    title: '产品重量',
    dataIndex: 'weight'
  },
  {
    title: '本次入库数量',
    dataIndex: 'notNum',
    scopedSlots: { customRender: 'notNum' }
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
      form: {
        materialTableList: [] //物料信息
      }
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
      that.form.materialTableList = that.$_.cloneDeep(records)
      that.type = type

      storageRecords({ storageId: records[0].id }).then(res => {
        console.log(res)
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
