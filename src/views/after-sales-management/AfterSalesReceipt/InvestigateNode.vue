<template>
  <a-modal
    title="查看节点"
    :width="600"
    :confirmLoading="confirmLoading"
    :footer="null"
    v-model="visible"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-table
        :columns="columns"
        :dataSource="data"
        :loading="loading"
      >
        <span slot="action" slot-scope="text, record">
          <template v-if="$auth('investigate:edit')">
            <a @click="handleEdit(record)">编辑</a>
          </template>
        </span>
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
      </a-table>
    </a-spin>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { getNodeList } from '@/api/investigate'

export default {
  name: 'InvestigateNode',
  components: {
    STable
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      mdl: {},
      addOredit: 'save',
      queryBoolean: false,
      queryParam: {},
      data: [],
      loading: true,
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' }
        },
        {
          title: '审核人',
          dataIndex: 'userName',
          key: 'time'
        },
        {
          title: '审核时间',
          dataIndex: 'createTime',
          key: 'rate'
        },
        {
          title: '备注',
          dataIndex: 'code'
        }
      ]
    }
  },
  methods: {
    query (record) {
      this.queryBoolean = true
      console.log('query :' + JSON.stringify(record))
      this.mdl = Object.assign({}, record)
      this.visible = true
      const params = { 'instanceId': record.instanceId }
      getNodeList(params).then((res) => {
        // const pagination = { ...this.pagination }
        // pagination.total = res.data.total || 0
        console.log('getNodeList ... ' + JSON.stringify(res))
        this.loading = false
        this.data = res.data
        // this.pagination = pagination
      }).catch(error => {
        this.loading = false
        console.error(error)
      })
      this.$nextTick(() => {
        this.queryParam = { 'instanceId': record.instanceId }
        // this.form.setFieldsValue({ ...record })
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
    }

  }
}
</script>
