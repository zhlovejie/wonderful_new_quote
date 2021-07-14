<template>
  <a-form-model ref="ruleForm" :model="form" :rules="rules" class="routine-addform-wrapper-baseInnerData">
    <h4>工艺资料归档</h4>
    <a-table :columns="columns1" :dataSource="form.files" :pagination="false" size="small">
      <div slot="action" slot-scope="text, record, index">
        <a @click="delSee(record.fileUrl)">查看</a>
        <template v-if="!isproduction && normalAddForm.status === 4">
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除该条数据吗?" @confirm="handleAction('del', record)">
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </template>
        <a-divider type="vertical" />
        <a target="_blank" v-download="record.fileUrl">下载</a>
      </div>
    </a-table>
    <a-button v-if="!isproduction" style="width: 100%" type="dashed" icon="plus" @click="handleAction('add', null)"
      >上传新文件</a-button
    >
    <table class="custom-table custom-table-border">
      <h3>工艺任务</h3>
      <tr v-if="normalAddForm.ProcessData.craftTaskUrl !== null">
        <td>工艺研发任务单</td>
        <td>
          <a @click="delSee(normalAddForm.ProcessData.craftTaskUrl || '')">查看</a>
          <a-divider type="vertical" />
          <a target="_blank" v-download="normalAddForm.ProcessData.craftTaskUrl || ''">下载</a>
        </td>
      </tr>
      <tr v-if="normalAddForm.ProcessData.mouldTaskUrl !== null">
        <td>摸具任务单任务单</td>
        <td>
          <a @click="delSee(normalAddForm.ProcessData.mouldTaskUrl || '')">查看</a>
          <a-divider type="vertical" />
          <a target="_blank" v-download="normalAddForm.ProcessData.mouldTaskUrl || ''">下载</a>
        </td>
      </tr>
      <tr>
        <td>工艺路线</td>
        <td>
          <a-form-model-item prop="craftId">
            <a-select
              v-if="!isproduction"
              show-search
              :value="form.craftCode"
              placeholder="模糊搜索"
              style="width: 100%"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="bomFuzzySearch.fetching ? undefined : '未找到匹配项'"
              @search="bomFuzzyAction"
              @change="bomFuzzyHandleChange"
            >
              <a-spin v-if="bomFuzzySearch.fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="item in bomFuzzySearch.list" :key="item.__key" :value="item.__key">
                {{ item.__label }}
              </a-select-option>
            </a-select>
            <span v-else>{{ form.craftCode }}</span>
          </a-form-model-item>
        </td>
      </tr>
    </table>
    <div class="saveOk">
      <a-button type="primary" style="margin-right: 10px" icon="save" v-if="!isproduction" @click="validate"
        >保存</a-button
      >
      <a-button v-if="!isproduction && !Noshow" @click="handleGo">取消</a-button>
    </div>

    <XdocView ref="xdocView" />
    <ToolBoxCommonUploadForm ref="toolBoxCommonUploadForm" @ok="handleSaveOk" />
  </a-form-model>
</template>

<script>
import { craftDevelopment } from '@/api/projectManagement'
//工艺路线模糊搜索
import { craftRouteApprovePageList } from '@/api/craftRoute'
import XdocView from './XdocView'
import ToolBoxCommonUploadForm from './ToolBoxCommonUploadForm'
const uuid = () => Math.random().toString(16).slice(2)
export default {
  inject: ['normalAddForm'],
  components: {
    XdocView,
    ToolBoxCommonUploadForm,
  },
  computed: {
    isproduction() {
      //产品试制
      return (
        this.normalAddForm.isView ||
        this.normalAddForm.isApproval ||
        (this.normalAddForm.isHandle && this.normalAddForm.status !== 13)
      )
    },
  },
  data() {
    this.bomFuzzyAction = this.$_.debounce(this.bomFuzzyAction, 800)
    return {
      columns1: [
        {
          align: 'center',
          title: '文件名称',
          dataIndex: 'fileName',
        },
        {
          align: 'center',
          title: '提交人',
          dataIndex: 'createdName',
        },
        {
          align: 'center',
          title: '提交时间',
          dataIndex: 'createdTime',
        },

        {
          align: 'center',
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      bomFuzzySearch: {
        list: [],
        item: {},
        fetching: false,
      },
      rules: {
        craftId: [{ required: true, message: '请选择工艺路线' }],
      },
      spinning: false,
      Noshow: false,
      form: {
        files: [],
        craftId: undefined,
        craftCode: undefined,
      },
      queryOneData: {},
      details: {},
    }
  },
  watch: {
    'normalAddForm.ProcessData': function (newVal, oldVal) {
      console.log(newVal, oldVal)
      if (newVal) {
        this.queryOneData = newVal
        this.init()
      }
    },
  },
  created() {},
  methods: {
    async bomFuzzyAction(wd) {
      const that = this
      const _searchParam = {
        current: 1,
        size: 10,
        materialCode: wd,
      }
      that.bomFuzzySearch = { ...that.bomFuzzySearch, fetching: true }
      const result = await craftRouteApprovePageList({ status: 3 }).then((res) => {
        const records = res.data.records.map((item) => {
          item.__key = uuid()
          item.__label = `${item.routeCode}(${item.routeName})`
          item.__value = item.routeCode
          item.routeCodeFormat = that.formatMaterialCode(item.routeCode, '.')
          return item
        })
        return records
      })
      that.bomFuzzySearch = { ...that.bomFuzzySearch, fetching: false, list: result }
    },
    bomFuzzyHandleChange(key) {
      const that = this
      const target = that.bomFuzzySearch.list.find((item) => item.__key === key)
      console.log(target)
      that.form = { ...that.form, craftId: target.id, craftCode: target.routeCode }
      // , routeCode: target.routeCode, routeName: target.routeName
      that.bomFuzzySearch = { ...that.bomFuzzySearch, item: target }
    },
    init() {
      let that = this
      if (that.queryOneData) {
        console.log(that.normalAddForm.ProcessData.developmentProjectProductTrialImproveVos)
        that.$nextTick(() => {
          that.details = {
            files: that.normalAddForm.ProcessData.files || [],
            craftCode: that.normalAddForm.ProcessData.craftCode,
          }
          that.form = {
            ...that.details,
          }
        })
      }
    },
    handleGo() {
      this.$router.go(-1)
    },
    validate() {
      let that = this
      if (this.form.files.length === 0) {
        return this.$message.error('请上传工艺资料归档')
      }
      let value = {
        files: that.form.files.map((i) => {
          return { fileName: i.fileName, fileUrl: i.fileUrl }
        }),
        craftCode: that.form.craftCode,
        craftId: that.form.craftId,
        projectId: that.normalAddForm.allInfo.id,
      }
      craftDevelopment(value)
        .then((res) => {
          if (res.code === 200) {
            that.$message.info(res.msg)
            that.$router.go(-1)
          } else {
            that.$message.error(res.msg)
          }
        })
        .catch((err) => (that.spinning = false))
    },
    formatMaterialCode(codeStr, joinSymbol = '') {
      if (typeof codeStr !== 'string') {
        console.warn(`${codeStr} is not string type..`)
        return ''
      }
      let trimLeft = /^[0]*/g,
        trimRight = /[0]*$/g
      return codeStr
        .split('.')
        .map((s) => s.replace(trimLeft, ''))
        .join(joinSymbol)
    },
    //查看
    delSee(idurl) {
      this.$refs.xdocView.query(idurl)
    },
    handleSaveOk(data) {
      this.form.files.push(data)
    },
    handleAction(type, record) {
      const that = this
      if (['add'].includes(type)) {
        that.$refs.toolBoxCommonUploadForm.query(type, record)
      } else if (type === 'del') {
        that.form.files = that.form.files.filter((item) => item.fileName !== record.fileName)
      }
    },
  },
}
</script>

<style scoped>
.saveOk {
  margin-top: 20px;
  text-align: center;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item {
  display: flex;
  margin: 0;
  margin-top: 13px;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item .ant-form-item-label {
  width: auto;
  text-align: left;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px;
}
.custom-table-border caption {
  text-align: left;
}
.icon-required::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
</style>