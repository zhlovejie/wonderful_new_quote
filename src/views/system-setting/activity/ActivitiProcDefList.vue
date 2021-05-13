<template>
  <!-- 面试记录 -->
  <div class="activitiProcDef_record-list-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="流程定义key" v-model="key" :allowClear="true" style="width: 200px" />
      <a-input placeholder="流程定义名称" v-model="name" :allowClear="true" style="width: 200px" />
      <a-input placeholder="版本号" v-model="version" :allowClear="true" style="width: 200px" />
      <a-select placeholder="选择系统类型" v-model="research" style="width: 200px">
        <a-select-option :value="0">人事销售</a-select-option>
        <a-select-option :value="1">研发</a-select-option>
      </a-select>
      <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>

      <a-upload
        accept=".bpmn,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        name="file"
        :action="uploadPath"
        :multiple="true"
        :fileList="fileList"
        @change="handleChange"
      >
        <a-button class="a-button" type="primary" icon="plus"> 发布（.bpmn） </a-button>
      </a-upload>
    </div>
    <div class="main-wrapper">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="xmlUrl" slot-scope="text, record">
          <a :href="record.fullXmlUrl" target="_blank" :title="text">查看</a>
        </div>
        <div slot="imgUrl" slot-scope="text, record">
          <a :href="record.fullImgUrl" target="_blank" :title="text">查看</a>
        </div>
        <span slot="action" slot-scope="text, record">
          <template>
            <a-popconfirm
              title="确认删除这条数据？"
              @confirm="handleDelete(record.deploymentId)"
              okText="是"
              cancelText="否"
            >
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
import { getActivitiProcDef, uploadFile, deleteDeployment } from '@/api/activity/activity'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import system from '@/config/defaultSettings'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '流程定义key',
    dataIndex: 'defKey',
    key: 'defKey',
    scopedSlots: { customRender: 'defKey' },
  },
  {
    align: 'center',
    title: '流程定义名称',
    dataIndex: 'name',
    key: 'name',
    scopedSlots: { customRender: 'name' },
  },
  {
    align: 'center',
    title: '版本号',
    dataIndex: 'version',
    key: 'version',
    scopedSlots: { customRender: 'version' },
  },
  {
    align: 'center',
    title: '流程部署id',
    dataIndex: 'deploymentId',
    key: 'deploymentId',
    scopedSlots: { customRender: 'deploymentId' },
  },
  {
    align: 'center',
    title: '流程定义id',
    key: 'procDefId',
    dataIndex: 'procDefId',
    scopedSlots: { customRender: 'procDefId' },
  },
  {
    align: 'center',
    title: '部署时间',
    key: 'deployTime',
    dataIndex: 'deployTime',
    scopedSlots: { customRender: 'deployTime' },
  },
  {
    align: 'center',
    title: '流程xml',
    dataIndex: 'xmlUrl',
    key: 'xmlUrl',
    scopedSlots: { customRender: 'xmlUrl' },
  },
  {
    align: 'center',
    title: '流程图片',
    dataIndex: 'imgUrl',
    key: 'imgUrl',
    scopedSlots: { customRender: 'imgUrl' },
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'activitiProcDef',
  components: {
    AFormItem,
  },
  data() {
    return {
      activeKey: 0,
      research: 0,
      key: undefined,
      name: undefined,
      version: undefined,
      columns: columns,
      fileList: [],
      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
      // uploadPath: uploadFile(this.research || 0),
    }
  },
  computed: {
    uploadPath() {
      return this.research === 0
        ? system.baseURL + '/activity/uploadBpmn'
        : system.materialBaseUrl + '/activity/uploadBpmn'
    },
    searchParam() {
      return {
        key: this.key,
        name: this.name,
        version: this.version,
      }
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'activity') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      getActivitiProcDef(_searchParam, that.research)
        .then((res) => {
          that.loading = false
          console.log(system.materialBaseUrl)
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.fullXmlUrl = simpleFormatUrl(item, 'xml')
            item.fullImgUrl = simpleFormatUrl(item, 'image')
            return item
          })

          function simpleFormatUrl(item, resType) {
            let url = ''
            url += that.research === 0 ? system.baseURL : system.materialBaseUrl
            url += '/activity/resource/read?'
            let param = []
            param.push(`procDefId=${item.procDefId}`)
            param.push(`proInsId=${item.deploymentId}`)
            param.push(`resType=${resType}`)
            url += param.join('&')

            return url
          }
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({ current: pagination.current })
    },
    handleChange({ file, fileList }) {
      // 上传中、完成、失败都会调用这个函数。
      fileList = fileList.slice(-1)
      if (file.status !== 'uploading') {
        console.log(file, fileList)
      }
      if (file != null && file.status === 'done') {
        // 状态有：uploading done error removed
        if (file.response.code === 200) {
          // 成功
          this.init()
          this.searchAction()
          this.$message.success('部署成功')
        }
      }
      this.fileList = fileList
    },
    filterCustomerOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // checkXml(record) {
    //   window.location.href =
    //     this.research === 0
    //       ? system.baseURL
    //       : system.materialBaseUrl +
    //         '/activity/resource/read?' +
    //         'procDefId=' +
    //         record.procDefId +
    //         '&proInsId=' +
    //         record.deploymentId +
    //         '&resType=xml'
    // },
    // checkImage(record) {
    //   window.location.href =
    //     this.research === 0
    //       ? system.baseURL
    //       : system.materialBaseUrl +
    //         '/activity/resource/read?' +
    //         'procDefId=' +
    //         record.procDefId +
    //         '&proInsId=' +
    //         record.deploymentId +
    //         '&resType=image'
    // },
    handleDelete(deploymentId) {
      this.loading = true
      const params = { deploymentId: deploymentId }
      deleteDeployment(params, this.research).then((res) => {
        if (res.code === 200) {
          this.init()
          this.$message.success('删除成功')
        } else {
          this.$message.error(res.msg)
        }
        this.loading = false
      })
    },
  },
}
</script>
<style scoped>
.activitiProcDef_record-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.activitiProcDef_record-list-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}

.main-wrapper {
  margin-top: 20px;
}
</style>
