<template>
  <a-card :bordered="false">
    <!--搜索模块-->
    <div class="operational-scheme-search-wrapper">
      <a-form layout="inline">
        <a-form-item label="版本号">
          <a-input v-model.trim="queryParam.versionCode" placeholder="根据版本号查询" />
        </a-form-item>
        <a-form-item label="名称">
          <a-input v-model.trim="queryParam.versionName" placeholder="根据版本名称查询" />
        </a-form-item>
        <template v-if="$auth('androidVersion:list')">
          <a-form-item>
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
          </a-form-item>
        </template>

        <div class="action-wrapper" style="float: right">
          <a-form-item>
            <template v-if="$auth('androidVersion:add')">
              <a-button style="margin-left: 8px" type="primary" icon="plus" @click="$refs.modal.add(1)">新增</a-button>
            </template>
            <!-- <template v-if="$auth('scheme:list')">
            <a-button style="margin-left: 8px" type="primary" icon="download" @click="handleBatchDownload">批量下载</a-button>
          </template>-->
          </a-form-item>
        </div>
      </a-form>
    </div>
    <!-- :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
    <s-table
      style="margin-top: 20px"
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="false"
    >
      <div
        :style="{
          maxWidth: '300px',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          wordWrap: 'break-word',
          wordBreak: 'break-all',
        }"
        slot="downloadUrl"
        slot-scope="text, record"
      >
        {{ record.downloadUrl }}
      </div>
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <!-- <template v-if="$auth('scheme:one')">
            <a target="_blank" :href="url+record.fileUrl">查看</a>
          </template>-->
          <!--<template v-if="$auth('case:edit')">
            <a-divider type="vertical" />
            <a target="_blank" :href="record.fileUrl">下载</a>
          </template>-->
          <!--<template v-if="$auth('scheme:edit')">
            <a-divider type="vertical" />
            <a @click="handleEdit(record)">编辑</a>
          </template>-->
          <template v-if="$auth('androidVersion:delete')">
            <!-- <a-divider type="vertical" /> -->
            <a @click="del(record)">删除</a>
          </template>
        </template>
      </span>

      <div slot="remark" slot-scope="text">
        <a-tooltip v-if="String(text).length > 10">
          <template slot="title">{{ text }}</template>
          {{ String(text).slice(0, 10) }}...
        </a-tooltip>
        <span v-else>{{ text }}</span>
      </div>
    </s-table>
    <Modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import {
  deleteAndroidVersion,
  listAndroidVersion,
} from '@/api/workBox'

import Modal from './modules/AndroidModal'

export default {
  name: 'AndroidVersion',
  components: {
    // 组件
    STable,
    Modal,
  },
  data() {
    return {
      url: 'https://view.officeapps.live.com/op/view.aspx?src=',
      // selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' },
        },
        {
          title: '版本名称',
          dataIndex: 'versionName',
        },
        {
          title: '版本编号',
          dataIndex: 'versionCode',
        },
        {
          title: '版本连接',
          dataIndex: 'downloadUrl',
          scopedSlots: { customRender: 'downloadUrl' },
          // sorter: true
        },
        {
          align: 'center',
          title: '更新说明',
          dataIndex: 'remark',
          width: 400,
          scopedSlots: { customRender: 'remark' },
          // sorter: true
        },
        {
          title: '创建人',
          dataIndex: 'modifyUserName',
          // sorter: true
        },
        {
          title: '创建时间',
          dataIndex: 'modifyTime',
          // sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return listAndroidVersion(Object.assign(parameter, this.queryParam))
          .then((res) => {
            return res
          })
          .catch(function (err) {
            console.log(err)
          })
      },
    }
  },
  methods: {
    handleEdit(record) {
      // 修改
      this.$refs.modal.edit(record)
    },
    handleOk() {
      this.$refs.table.refresh()
    },
    handleSaveOk() {
      this.$refs.table.refresh(true)
    },
    handleSaveClose() {},
    // 删除
    del(record) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除这个版本吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // 在这里调用删除接口
          deleteAndroidVersion({ versionId: record.id })
            .then((data) => {
              if (data.code == 200) {
                _this.$message.success('删除成功')
                _this.$refs.table.refresh(true)
              } else {
                _this.$message.error(data.msg)
              }
            })
            .catch(() => {
              // Do something
            })
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
