<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 20px">
      <a-select
        style="width: 200px; margin-right: 10px"
        v-model="queryParam.departmentId"
        :allowClear="true"
        @change="depChangeHandler"
        placeholder="请选择部门"
      >
        <a-select-option :value="undefined">请选择部门</a-select-option>
        <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">{{
          item.departmentName
        }}</a-select-option>
      </a-select>
      <a-select
        placeholder="选择岗位"
        v-model="queryParam.stationId"
        :allowClear="true"
        style="width: 200px; margin-right: 10px"
      >
        <a-select-option v-for="item in postSelectDataSource" :key="item.id" :value="item.id">{{
          item.stationName
        }}</a-select-option>
      </a-select>
      <a-input
        placeholder="员工姓名"
        v-model="queryParam.userName"
        allowClear
        style="width: 200px; margin-right: 10px"
      />

      <a-button style="margin-left: 10px" type="primary" @click="searchAction({ current: 1 })">查询</a-button>
      <template v-if="$auth('baseSalaryCommon:import')">
        <a-upload :beforeUpload="beforeUpload" style="margin-left: 10px" :showUploadList="false">
          <a-button class="a-button" type="primary" icon="upload" :loading="uploading">导入</a-button>
        </a-upload>
      </template>
      <template v-if="$auth('baseSalaryCommon:download')">
        <a
          target="_blank"
          style="margin-left: 10px"
          class="a-button ant-btn ant-btn-primary"
          href="http://192.168.13.251/images/cloud/20210323/基本工资模板733a880c-90a7-48f8-8fd6-feadfd284240.xlsx"
          >下载模板</a
        >
      </template>
    </div>
    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <a-table
        v-if="$auth('baseSalaryCommon:list')"
        :columns="columns"
        bordered
        :data-source="dataSource"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="salaryType" slot-scope="text, record">
          <span>{{ record.salaryType === 0 ? '月薪制' : `年薪制-${record.yearSalaryText}` }}</span>
        </div>
      </a-table>
      <a-modal title="错误数据" :visible="visible" @ok="handleOk" @cancel="handleCancel">
        <h3>{{ iserror.failNum || 0 }}条错误数据</h3>
        <div v-for="item in iserror.errorList" :key="item.failNum">
          <p>第{{ item.rowNum }}行 {{ item.msg }}</p>
        </div>
      </a-modal>
    </a-layout>
  </a-card>
</template>

<script>
import moment from 'moment'
import { getDevisionList, getStationList } from '@/api/systemSetting'
import { salary_base_record_List, salary_base_record_ImportExcel } from '@/api/bonus_management'

const columns = [
  {
    dataIndex: 'name',
    title: '序号',
    key: 'name',
    align: 'center',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '部门',
    dataIndex: 'departmentName',
    key: 'departmentName',
    align: 'center',
  },
  {
    title: '岗位',
    dataIndex: 'stationName',
    key: 'stationName',
    align: 'center',
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName',
    align: 'center',
  },
  {
    dataIndex: 'salaryType',
    title: '薪资制度',
    key: '  salaryType',
    align: 'center',
    scopedSlots: { customRender: 'salaryType' },
  },
  {
    title: '核算周期（月）',
    dataIndex: 'cycle',
    key: 'cycle',
    align: 'center',
  },
  {
    title: '年/周期薪资',
    dataIndex: 'cycleSalary',
    key: 'cycleSalary',
    align: 'center',
  },

  {
    title: '试用期工资（元）',
    children: [
      {
        align: 'center',
        title: '基本工资',
        dataIndex: 'realityProbationBasicSalary',
        key: 'realityProbationBasicSalary',
      },
      {
        align: 'center',
        title: '岗位工资',
        dataIndex: 'realityProbationPostSalary',
        key: 'realityProbationPostSalary',
      },
    ],
  },
  {
    title: '转正工资(元)',
    children: [
      {
        align: 'center',
        title: '基本工资',
        dataIndex: 'realityBasicSalary',
        key: 'realityBasicSalary',
      },
      {
        align: 'center',
        title: '岗位工资',
        dataIndex: 'realityPostSalary',
        key: 'realityPostSalary',
      },
    ],
  },
]
export default {
  name: 'RoleManagement',
  data() {
    return {
      visible: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      dataSource: [],
      columns,
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      pagination1: {},
      queryParam: {
        current: 1,
      },
      hiddenBoolean: false,

      selectedRowKeys: [],
      selectedRows: [],
      postSelectDataSource: [], //岗位
      // 部门列表
      departmentList: [],
      // 角色列表
      roleList: {},
      iserror: {},
      uploading: false,
      fileList: [],
      aceptFileTypes: [
        '.xls',
        '.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ],
    }
  },
  // 初始化搜索条件钩子函数
  created() {},
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'salary-base-common-record') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment: moment,
    handleOk() {
      this.visible = false
    },
    handleCancel() {
      this.visible = false
    },
    beforeUpload(file) {
      let _aceptFileTypes = this.aceptFileTypes
      const isDocType = _aceptFileTypes.includes(file.type)
      if (!isDocType) {
        this.$message.error('只支持上传.xls,.xlsx的Excel!')
      }
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('Excel文档必须小于10M!')
      }
      if (isDocType && isLt10M) {
        this.fileList = [file]
        this.handleUpload()
      }
      return false
    },
    handleUpload() {
      const that = this
      const { fileList } = that
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('file', file)
      })
      that.uploading = true
      salary_base_record_ImportExcel(formData)
        .then((res) => {
          that.uploading = false
          console.log(res.type)
          if (res instanceof Blob) {
            let action = {
              isFile: res.type === 'application/x-download',
              isJson: res.type === 'application/json',
            }

            if (action.isFile) {
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = 'error.xlsx'
              a.click()
              document.body.removeChild(a)

              that.$message.error('您提交的信息存在重复数据，请查看下载的 error.xlsx 文件！')
              return
            } else if (action.isJson) {
              var reader = new FileReader()
              reader.onload = function (e) {
                let _res = null
                try {
                  _res = JSON.parse(e.target.result)
                } catch (err) {
                  _res = null
                  console.log('JSON.parse error...', e.target.result)
                }
                if (_res !== null) {
                  that.fileList = []
                  console.log(_res.msg)
                  try {
                    that.iserror = JSON.parse(_res.msg)
                  } catch (err) {
                    console.log(err)
                  }

                  that.visible = true
                }
              }
              reader.readAsText(res)
            }
          } else {
            console.log('未知错误：')
            console.log('类型：' + typeof res)
            console.log(res)
          }
          // let that = that
          // if (res.code === 200) {
          //   that.$message.info(res.msg || '操作成功')
          //   that.searchAction()
          // } else {
          //   console.log(res)
          //   that.iserror = JSON.stringify(res.msg)
          //   that.visible = true
          // }
        })
        .catch((err) => {
          that.uploading = false
          that.$message.error(res.msg)
          console.log(err)
        })
    },
    init() {
      let that = this

      getDevisionList().then((res) => {
        this.departmentList = res.data
      })
      this.searchAction()
    },
    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      return getStationList({ id: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
      })
    },
    searchAction(opt) {
      let that = this
      that.loading = true
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination1 }, opt || {})
      salary_base_record_List(_searchParam)
        .then((res) => {
          that.loading = false
          this.queryParam.accountDate = ''
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },

    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.searchAction()
    },
    delete_list(id) {
      let that = this
      //   DistributionDelete({ id: id }).then((res) => {
      //     if (res.code === 200) {
      //       this.searchAction()
      //       that.$message.info(res.msg)
      //     } else {
      //       that.$message.error(res.msg)
      //     }
      //   })
    },
    //新增 修改
    // handleAdd(type, record) {
    //   this.$refs.addForm.query(type, record)
    // },
  },
}
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block;
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}

.left-tree {
  display: flex;
}

.treewrap {
  margin-right: 24px;
}

.righttab {
  width: 100%;
}
</style>
