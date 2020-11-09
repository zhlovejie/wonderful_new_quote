<template>
  <a-card :bordered="false">
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item label="客户名称">
          <a-input v-model="customerName"/>
        </a-form-item>
        <a-form-item label="审批状态"  v-show="show">
          <a-select style="width: 150px" v-model="approvalStatusSelect" defaultValue="0">
            <a-select-option :value="0">请选择审批状态</a-select-option>
            <a-select-option :value="1">待审批</a-select-option>
            <a-select-option :value="2">通过</a-select-option>
            <a-select-option :value="3">不通过</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <template v-if="$auth('after:list')">
            <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
          </template>
        </a-form-item>
        <div class="table-operator fl-r">
          <template v-if="$auth('after:add')">
            <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
          </template>
        </div>
      </a-form>
    </div>
    <a-row>
      <a-col>
        <div>
          <a-tabs defaultActiveKey="0" @change="paramClick">
            <a-tab-pane tab="全部" key="0" forceRender>
            </a-tab-pane>
            <template v-if="$auth('after:approval')">
              <a-tab-pane tab="待审批" key="4">
              </a-tab-pane>
              <a-tab-pane tab="已审批" key="2">
              </a-tab-pane>
            </template>

          </a-tabs>
        </div>
        <s-table
          style="margin-bottom: 24px"
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          :alert="false"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <span slot="receiptCode" slot-scope="text, record">
            <a @click="handleVue(record)">{{ text }}</a>
          </span>
          <span slot="customerName" slot-scope="text, record">
            <a @click="tenderingClick(record)">{{ text }}</a>
          </span>
          <div slot="aftersaleType" slot-scope="text">
            <span v-if="text==1">首次调试</span>
            <span v-if="text==2">远程调试</span>
          </div>
          <div slot="state" slot-scope="text, record">
            <a @click="handleClick(record)" v-if="+text === 1">待审批</a>
            <a @click="handleClick(record)" v-if="+text === 2">通过</a>
            <a @click="handleClick(record)" v-if="+text === 3">不通过</a>
            <a @click="handleClick(record)" v-if="+text === 9">已撤回</a>
          </div>
          <div slot="aftersaleIsend" slot-scope="text, record">
            <a @click="updateIsEnd(record)" v-if="text==1">未完结</a>
            <a v-if="text==2">完结</a>
          </div>
          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('after:one')">
              <a @click="handleVue(record)">查看</a>
            </template>
            <template v-if="$auth('after:edit') && audit">
              <a-divider type="vertical"/>
              <a @click="handleAudit(record)">审核</a>
            </template>
            <template v-if="$auth('after:del') && !audit && (+record.state === 2 || +record.state === 9) && userInfo.id === record.createdId">
              <a-divider type="vertical"/>
              <a class="delete" @click="() => del(record)">删除</a>
            </template>
            <template v-if="$auth('after:edit') && +record.state ===2 && +record.aftersaleType === 1">
              <a-divider type="vertical"/>
              <a @click="unloadClick(record)">上传</a>
            </template>
            <template v-if="$auth('after:one') && +record.state === 2 && +record.aftersaleType === 1 && record.acceptanceUrl != undefined">
              <a-divider type="vertical"/>
              <a @click="handleDownload(record)">下载验收单</a>
            </template>
            <template v-if="$auth('after:one') && (+record.state === 3 || +record.state === 9) && userInfo.id === record.createdId">
              <a-divider type="vertical"/>
              <a @click="handleEdotVue(record)">重新提交</a>
            </template>

            <template v-if="+record.state === 1">
              <a-divider type="vertical"/>
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('reback',record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template>

          </span>
        </s-table>
      </a-col>
    </a-row>
    <InvestigateNode ref="node"/>
    <Tendering ref="tenderingModel"></Tendering>
    <a-modal
      title="上传"
      :confirmLoading="confirmLoadingTwo"
      :maskClosable="false"
      @ok="handleOk"
      v-model="visibleTwo">
      <span :spinning="confirmLoadingTwo">
        <a-form :form="form2" class="form">
          <a-col>
            <a-form-item
              label="验收单上传">
              <a-upload
                accept="multiple"
                name="files"
                :multiple="true"
                :action="this.uploadPath"
                @change="handleChange">
                <a-button>
                  <a-icon type="upload"/> 上传
                </a-button>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-form>
      </span>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { deleteAfterSale, getServiceList, updateAfterSale ,revocationAfterSale} from '@/api/after'
import InvestigateNode from '../record/InvestigateNode'
import Tendering from '../record/TenderingUnit'
import { getUploadPath } from '@/api/manage'

export default {
  name: 'AfterList',
  components: {
    Tendering,
    InvestigateNode,
    STable
  },
  data () {
    return {
      form: this.$form.createForm(this),
      form2: this.$form.createForm(this),
      userInfo: this.$store.getters.userInfo,
      // 查询参数
      queryParam: {},
      recordResult: {},
      queryRecord: {},
      contractState: 0,
      vueBoolean: this.$store.getters.vueBoolean,
      saleCustomer: 0,
      customerName: '',
      saleCustomers: [],
      audit: false,
      confirmLoadingTwo: false,
      visibleTwo: false,
      fileList: [],
      uploadPath: getUploadPath,
      acceptanceUrl: '',
      id: 0,
      show:true,
      approvalStatusSelect:0,
      contractStatus: [
        {
          'id': 0,
          'name': '请选择状态'
        },
        {
          'id': 1,
          'name': '待审批'
        },
        {
          'id': 2,
          'name': '通过'
        },
        {
          'id': 3,
          'name': '不通过'
        }
      ],
      // 表头
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' }
        },
        {
          title: '任务单编号',
          dataIndex: 'aftersaleCode',
          // key: 'title',
          scopedSlots: { customRender: 'aftersaleCode' }
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
          scopedSlots: { customRender: 'customerName' }
        },
        {
          title: '时间要求',
          dataIndex: 'sceneTime',
          scopedSlots: { customRender: 'sceneTime' }
        }, {
          title: '对应销售',
          dataIndex: 'saleUserName'
        }, {
          title: '售后类型',
          dataIndex: 'aftersaleType',
          scopedSlots: { customRender: 'aftersaleType' }
        }, {
          title: '单据状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' }
        }, {
          title: '是否完结',
          dataIndex: 'aftersaleIsend',
          scopedSlots: { customRender: 'aftersaleIsend' }
        }, {
          title: '申请人',
          dataIndex: 'createdName'
        }, {
          title: '申请时间',
          dataIndex: 'createdTime'
        },
        {
          title: '操作',
          dataIndex: 'id',
          width: '200px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        let that = this
        return getServiceList(Object.assign(parameter, this.queryParam))
          .then(res => {
            that.loadDataOver(res)
            return res
          })
      },

      selectedRowKeys: [],
      selectedRows: [],

    }
  },
  mounted () {
    this.search()
  },
  watch: {
    $route (to, from) {
      if(to.name === 'afterList'){
        this.search()
      }
    }
  },
  methods: {
    search () {
      this.queryParam = {
        'customerName': this.customerName,
        'statue': this.contractState,
      }
      if(this.show == true){
        this.queryParam['approvalStatue'] = this.approvalStatusSelect
      }
      this.$refs.table.refresh(true)
    },
    handleAdd () {
      // 点击返回，返回核价单列表页
      this.$router.push({ name: 'afterAdd' })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleClick (record) {
      this.$refs.node.query(record)
      // this.$refs.table.refresh(true)
    },
    handleSaveOk () {
      this.$refs.table.refresh(true)
    },
    handleSaveClose () {

    },
    del (row) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除编号为: ${row.aftersaleCode} 的任务单吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          // 在这里调用删除接口
          deleteAfterSale({ 'id': row.id }).then(res => {
            if (res.code === 200) {
              _this.$refs.table.refresh(false)
            } else {
              _this.$message.error(res.msg)
            }
          })
        }
      })
    },
    handleDownload (record) {
      var link = document.createElement('a')
      link.href = record.acceptanceUrl
      link.download = 'lslsls'
      link.target = '_blank'
      // 此写法兼容可火狐浏览器
      document.body.appendChild(link)
      var evt = document.createEvent('MouseEvents')
      evt.initEvent('click', false, false)
      link.dispatchEvent(evt)
      document.body.removeChild(link)
    },
    tenderingClick (record) {
      const data = { 'id': record.customerId }
      this.$refs.tenderingModel.look(data)
    },
    paramClick (key) {
      if (key == 4) {
        this.audit = true
        this.show=false
      } else if (key==2) {
        this.audit = false
        this.show=false
      }else if (key==0){
        this.show=true
        this.audit = false
      }
      this.contractState = key
      this.queryParam = { 'statue': key }
      this.$refs.table.refresh(true)
    },
    handleVue (e) {
      this.$router.push({ name: 'AfterVueOfAudit', params: { id: e.id, type: 1 ,afterType:e.afterType || 0} })
    },
    handleEdotVue (e) {
      this.$router.push({ name: 'AfterVueOfAudit', params: { id: e.id, type: 1 ,action:'edit',afterType:e.afterType || 0} })
    },
    handleAudit (e) {
      if (this.userInfo.id === 1) {
        this.$message.info('你没有审批权限，不可以审批')
        return
      }
      this.$router.push({ name: 'AfterVueOfAudit', params: { id: e.id, type: 2 ,afterType:e.afterType || 0} })
    },
    handleAuditOk () {
      this.$refs.table.refresh(false)
    },
    handleAuditClose () {
      this.$refs.table.refresh(false)
    },
    updateIsEnd (record) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `确定要将编号为: ${record.aftersaleCode} 的任务单修改为已完结吗?`,
        okText: '确定',
        cancelText: '取消',
        onOk () {
          // 在这里调用删除接口
          _this.$set(record, 'aftersaleIsend', 2)
          updateAfterSale(record).then((res) => {
            if (res.code === 200) {
              _this.$message.info('修改成功')
              _this.$refs.table.refresh(false)
            } else {
              _this.$message.error(res.msg)
            }
          })
        }
      })
    },
    updateIsEndSilent (record) {
      const _this = this
      // 在这里调用删除接口
      _this.$set(record, 'aftersaleIsend', 2)
      updateAfterSale(record).then((res) => {
        if (res.code === 200) {
          //_this.$message.info('修改成功')
          _this.$refs.table.refresh(false)
        } else {
          _this.$message.error(res.msg)
        }
      })
    },
    unloadClick (record) {
      this.id = record.id
      this.visibleTwo = true
    },
    handleChange ({ file, fileList }) { // 上传中、完成、失败都会调用这个函数。
      fileList = fileList.slice(-1)
      if (file != null && file.status === 'done') { // 状态有：uploading done error removed
        if (file.response.code === 200) { // 成功
          this.acceptanceUrl = file.response.data[0].url
        }
      } else if (file.status === 'removed') { // 删除清空
        this.acceptanceUrl = ''
      }
    },
    handleOk () {
      updateAfterSale({ 'id': this.id, 'acceptanceUrl': this.acceptanceUrl }).then((res) => {
        if (res.code === 200) {
          this.visibleTwo = false
          this.form2.resetFields()
          this.$message.info('上传成功')
          this.$refs.table.refresh(false)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    loadDataOver(dataSource){
      let records = dataSource.data.records
      let r = records.find(record => record.id === this.id)
      if(r && r.aftersaleIsend === 1 && r.acceptanceUrl !== null){
        this.updateIsEndSilent(r)
      }
    },
    doAction(type,record){
      let that = this
      if(type === 'reback'){
        revocationAfterSale({id:record.id}).then(res =>{
          that.$message.info(res.msg)
          that.search()
        })
        return
      }
    }
  }
}

</script>

<style scoped>
  .top-ation .a-input {
    width: 160px;
    margin: 0 8px 8px 0;
  }

  .a-select {
    margin-right: 8px;
  }

  .a-button {
    margin-right: 8px;
  }

  .fl-r {
    float: right;
  }

  .develop-wrap {
    background-color: #fff;
    padding: 12px;
  }
</style>
