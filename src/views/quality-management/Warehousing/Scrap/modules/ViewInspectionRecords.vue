<template>
  <a-modal
    title="检验标准"
    :width="1000"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-table :columns="costColumns" :dataSource="CheckDetail.checkResultHisVoList" :pagination="false" bordered>
      <div slot="unqualifiedRate" slot-scope="text, record, index">
        <span> {{ (record.unqualifiedNum !== undefined && record.unqualifiedNum / record.checkNum) * 100 + '%' }}</span>
      </div>
      <div slot="detectionResult" slot-scope="text, record, index">
        <span> {{ record.unqualifiedNum > 0 ? '不合格' : '合格' }}</span>
      </div>

      <div slot="itemUrl" slot-scope="text, record, index">
        <a href="javascript:void(0);" @click="docView(text)">查看</a>
      </div>
    </a-table>
    <table class="custom-table custom-table-border" style="margin-top: 20px">
      <tbody>
        <tr>
          <td style="width: 150px">检验记录</td>
          <td>
            {{ CheckDetail.checkResult === 1 ? '返修' : CheckDetail.checkResult === 2 ? '报废' : '再利用' }}
          </td>
        </tr>
      </tbody>
    </table>
    <XdocView ref="xdocView" />
  </a-modal>
</template>

<script>
import XdocView from './XdocView'
export default {
  name: 'ApprovalModal',
  components: {
    XdocView,
  },
  data() {
    return {
      visible: false,
      CheckDetail: {},
    }
  },
  computed: {
    costColumns() {
      const baseColumns = [
        {
          title: '检验项目',
          dataIndex: 'projectName',
        },
        {
          title: '检验数量',
          dataIndex: 'checkNum',
        },
        {
          title: '合格数量',
          dataIndex: 'qualifiedNum',
        },
        {
          title: '不合格数量',
          dataIndex: 'unqualifiedNum',
        },
        {
          title: '不合格率',
          dataIndex: 'unqualifiedRate',
          scopedSlots: { customRender: 'unqualifiedRate' },
        },
        {
          title: '检验结果（系统）',
          dataIndex: 'detectionResult',
          scopedSlots: { customRender: 'detectionResult' },
        },
        {
          title: '不良原因描述',
          dataIndex: 'unqualifiedReason',
        },
        {
          title: '附件',
          dataIndex: 'itemUrl',
          scopedSlots: { customRender: 'itemUrl' },
        },
        {
          title: '备注',
          dataIndex: 'remark',
        },
      ]
      return baseColumns
    },
  },
  methods: {
    docView(url) {
      const that = this
      if (!url) {
        that.$message.info('尚未上传文件')
        return
      }
      that.$refs.xdocView.query(url)
    },
    query(record) {
      this.visible = true
      this.CheckDetail = record
    },
    handleOk() {
      let that = this
      that.visible = false
    },
    handleCancel() {
      let that = this
      that.visible = false
    },
  },
}
</script>