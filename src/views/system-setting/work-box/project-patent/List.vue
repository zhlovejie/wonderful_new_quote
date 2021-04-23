<template>
  <a-card :bordered="false">
    <!--搜索模块-->
    <div class="product-list-search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-select
            style="width: 200px"
            :allowClear="true"
            v-model.trim="queryParam.dicId"
            placeholder="请选择专利类型"
            default-value=""
          >
            <a-select-option v-for="ptype in productTypes" :key="ptype.index" :value="ptype.id">{{
              ptype.text
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input
            :allowClear="true"
            style="width: 280px"
            v-model.trim="queryParam.patentParam"
            placeholder="专利名称/专利号模糊查询"
          />
        </a-form-item>
        <a-form-item>
          <a-range-picker
            v-model="queryParam.sDate"
            :placeholder="['开始日期', '结束日期']"
            style="width: 280px"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
        </a-form-item>

        <template v-if="$auth('work-box-project-patent:add')">
          <a-form-item style="float: right">
            <a-button type="primary" icon="plus" @click="doAction('add', null)">新增</a-button>
          </a-form-item>
        </template>
      </a-form>
    </div>

    <s-table rowKey="id" ref="table" size="default" :columns="columns" :data="loadData" :pagination="pagination">
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="thumbnailUrl" slot-scope="text">
        <template v-if="text">
          <img style="width: 96px; height: auto" :src="text" />
        </template>
        <template v-else>暂无图片</template>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="doAction('view', record)">预览</a>
        <template v-if="$auth('work-box-project-patent:edit')">
          <a-divider type="vertical" />
          <a @click="doAction('edit', record)">修改</a>
        </template>
        <template v-if="$auth('work-box-project-patent:del')">
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除这条数据？" @confirm="doAction('del', record)" okText="是" cancelText="否">
            <a href="#">删除</a>
          </a-popconfirm>
        </template>
        <template v-if="$auth('work-box-project-patent:download')">
          <a-divider type="vertical" />
          <a target="_blank" v-download="doAction('download', record)">下载</a>
        </template>
      </span>
    </s-table>
    <AddForm ref="addForm" @ok="handleOk" />
    <Preview ref="previewModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import AddForm from './AddForm'
import Preview from './Preview'
import {
  getProjectPatentPageList,
  delProjectPatent,
  addAndUpdateProjectPatent,
  getProjectPatentDetail,
} from '@/api/workBox'
import { getDictionary } from '@/api/common'
import moment from 'moment'

const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' },
  },
  {
    title: '专利类别',
    dataIndex: 'dicText',
  },
  {
    title: '专利名称',
    dataIndex: 'patentName',
  },
  {
    title: '专利号',
    dataIndex: 'patentNum',
  },
  {
    title: '专利申请日',
    dataIndex: 'applicationDate',
  },
  {
    title: '图片',
    dataIndex: 'thumbnailUrl',
    scopedSlots: { customRender: 'thumbnailUrl' },
  },
  {
    title: '提交人',
    dataIndex: 'createdName',
  },
  {
    title: '提交时间',
    dataIndex: 'createdTime',
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'work-box-project-patent',
  components: {
    // 组件
    STable,
    AddForm,
    Preview,
  },
  data() {
    return {
      // 查询参数
      queryParam: {
        sDate: [undefined, undefined],
      },
      //上传文件
      fileList: [],
      uploading: false,
      // 表头
      columns,
      productTypes: [],
      pagination: {
        showTotal: (total) => '共' + total + '条数据',
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        let queryParam = { ...this.queryParam }
        let sDate = queryParam.sDate
        let startDate = sDate[0],
          endDate = sDate[1]
        if (startDate instanceof moment && endDate instanceof moment) {
          queryParam.startDate = startDate.format('YYYY-MM-DD')
          queryParam.endDate = endDate.format('YYYY-MM-DD')
        } else {
          queryParam.startDate = undefined
          queryParam.endDate = undefined
        }
        queryParam.sDate = undefined
        return getProjectPatentPageList(Object.assign(parameter, queryParam))
          .then((res) => {
            return res
          })
          .catch(function (err) {
            console.log(err)
          })
      },
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'work-box-project-patent') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    init() {
      const that = this
      getDictionary({ text: '专利类别' }).then((res) => {
        that.productTypes = res.data
      })

      that.$nextTick(() => {
        that.$refs.table.refresh()
      })
    },
    handleOk() {
      this.$refs.table.refresh()
    },
    doAction(type, record) {
      const that = this
      if (type === 'view') {
        that.$refs.previewModal.show(record)
        return
      } else if (['add', 'edit'].includes(type)) {
        that.$refs.addForm.query(type, record)
        return
      } else if (type === 'del') {
        delProjectPatent({ id: record.id }).then((res) => {
          that.$message.info(res.msg)
          if (res.code === 200) {
            that.$refs.table.refresh()
          }
        })
        return
      } else if (type === 'download') {
        let originalUrl = record.originalUrl
        if (!originalUrl) {
          return
        }
        try {
          let urls = JSON.parse(record.originalUrl).map((item) => item.origin)
          return urls[0]
        } catch (err) {
          console.log(err)
        }
        return
      } else {
      }
    },
  },
}
</script>
