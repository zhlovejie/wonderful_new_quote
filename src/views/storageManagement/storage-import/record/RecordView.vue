<template>
  <a-modal
    :title="modalTitle"
    :width="1200"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
    :footer="null"
    :forceRender="true"
  >
    <a-spin :spinning="spinning">
      <a-form-model class="stock_management_import_record-wrapper">
        <div class="card-item">
          <div class="__hd">物料信息</div>
          <div class="__bd">
            <a-table :columns="columns" :dataSource="materialTableList" :pagination="false" size="small">
              <div slot="order" slot-scope="text, record, index">
                {{ index + 1 }}
              </div>
            </a-table>
          </div>
          <div class="__hd">收料信息</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">收料仓库</td>
                <td style="width:350px;">
                  {{detail.warehouseName}}
                </td>
                <td style="width:150px;">收料员</td>
                <td style="width:350px;">
                  {{detail.makerName}}
                </td>
              </tr>
              <tr>
                <td>收料时间</td>
                <td colspan="3">
                  {{detail.makerDate}}
                </td>
              </tr>
            </table>
          </div>
          <div class="__hd">检验员</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">检验员</td>
                <td style="width:350px;">
                  {{detail.inspectionUserName}}
                </td>
                <td style="width:150px;">质检时间</td>
                <td style="width:350px;">
                  {{detail.inspectionDate}}
                </td>
              </tr>
            </table>
          </div>

          <div class="__hd">入库信息</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">入库仓库</td>
                <td style="width:350px;">
                  {{detail.warehouseName}}
                </td>
                <td style="width:150px;">入库库位</td>
                <td style="width:350px;">
                  {{detail.shelvesLocationName}}-{{detail.positionCode}}
                </td>
              </tr>
              <tr>
                <td style="width:150px;">容器/托盘代码</td>
                <td colspan="3">
                  {{detail.containerName}}
                </td>
              </tr>
              <tr>
                <td style="width:150px;">制单员</td>
                <td >
                  {{detail.makerName}}
                </td>
                <td>制单时间</td>
                <td >
                  {{detail.makerDate}}
                </td>
              </tr>
              <tr>
                <td style="width:150px;">入库员</td>
                <td >
                  {{detail.storageUserName}}
                </td>
                <td>入库时间</td>
                <td >
                  {{detail.storageTime}}
                </td>
              </tr>
              
            </table>
          </div>
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
    dataIndex: 'storageNum',
  }
]

import { getList, ReservoiGetList } from '@/api/storage'
import { getShelvesByAreaId, containerPalletList } from '@/api/storage_wzz'

import { 
  storageDetail
} from '@/api/storage_wzz'

export default {
  name: 'stock_management_import_record_viewForm',
  data() {
    return {
      userInfo: this.$store.getters.userInfo, // 当前登录人
      visible: false,
      spinning: false,
      type: 'view',
      columns,
      materialTableList:[],
      detail:{}
    }
  },
  computed: {
    modalTitle() {
      return '入库单详情'
    }
  },
  methods: {
    query(type,records) {
      const that = this
      that.form = {
        materialTableList: [] //物料信息
      }
      that.visible = true
      that.materialTableList = that.$_.cloneDeep(records)

      storageDetail({id:records[0].id}).then(res => {
        console.log(res)
        that.detail = res.data
      })
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
