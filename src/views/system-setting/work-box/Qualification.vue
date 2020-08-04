<template>
  <a-card :bordered="false">
    <!--搜索模块-->
    <div class="qualification-search-wrapper">
      <a-form layout="inline">
        <a-form-item label="资质类型">
          <a-select style="width:200px;" v-model.trim="queryParam.qualificationType" placeholder="请选择资质类型" default-value="">
            <a-select-option v-for="qtype in qualificationTypes" :key="qtype.index" :value="qtype.id">{{ qtype.text }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="资质名称">
          <a-input v-model.trim="queryParam.qualificationName" placeholder="根据名称模糊查询"/>
        </a-form-item>
        <template v-if="$auth('qualification:list')">
          <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          <!-- <a-button style="margin-left: 8px" @click="exportToExcel">全部导出</a-button> -->
          <a :href="exportProductCode" target="_blank" style="margin-left: 8px" class="ant-btn">全部导出</a>
          </a-form-item>
        </template>
        <template v-if="$auth('qualification:add')">
          <a-button type="primary" style="float:right;" icon="plus" @click="handleAdd">新增</a-button>
        </template>

      </a-form>
    </div>
    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <a-layout-content>
        <s-table
          ref="table"
          size="default"
          rowKey="id"
          :columns="columns"
          :data="loadData"
          :alert="false"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <span slot="qualificationPicture" slot-scope="text">
            <img style="height: 70px;" :src="text" alt=""/>
          </span>
          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('qualification:one')">
              <a @click="$refs.preview.show(record)">预览</a>
              <a-divider type="vertical"/>
            </template>
            <template v-if="$auth('qualification:edit')">
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical"/>
            </template>
            <template v-if="$auth('qualification:del')">
              <a class="delete" @click="() => del(record)">删除</a>
            </template>
          </span>
        </s-table>
      </a-layout-content>
    </a-layout>
    <modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose"/>
    <modal ref="editModal" @ok="handleSaveOk" @close="handleSaveClose"/>
    <preview ref="preview" @ok="handleSaveOk"/>

    <a-spin :spinning="spinning" :style="[spinning ? spinningStyle : '']" size="large" tip="处理中..."></a-spin>
  </a-card>
</template>

<script>
import { getQualificationList, delQualification, getQualificationType} from '@/api/qualification'
import { STable } from '@/components'
import Modal from './modules/QualificationModal'
import Preview from './modules/QualificationPreview'
import systemConfig from '@/config/defaultSettings'

const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '类别',
    key: 'qualificationTypeText',
    dataIndex: 'qualificationTypeText'
  },
  {
    align: 'center',
    title: '名称',
    key: 'qualificationName',
    dataIndex: 'qualificationName'
  },
  {
    align: 'center',
    title: '图片',
    dataIndex: 'qualificationPicture',
    scopedSlots: { customRender: 'qualificationPicture' }
  },
  {
    align: 'center',
    title: '操作人',
    key: 'modifierName',
    dataIndex: 'modifierName'
  },
  {
    align: 'center',
    title: '操作时间',
    key: 'modifyTime',
    dataIndex: 'modifyTime'
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }]

export default {
  name: 'Qualification',
  props:{
    toolType:{
      type:String,
      default:'0'
    }
  },
  components: {
    STable,
    Modal,
    Preview
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      qualificationTypes: [],
      pagination: {},
      // 表头
      columns: columns,
      // 初始化加载 必须为 Promise 对象
      loadData: parameter => {
        return getQualificationList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          }).catch(error => {
            this.loading = false
            console.error(error)
          })
      },
      spinning:false,
      spinningStyle:{
        'position': 'absolute',
        'top': 0,
        'display': 'flex',
        'justifyContent': 'center',
        'alignItems': 'center',
        'left': 0,
        'right': 0,
        'bottom': 0,
        'backgroundColor': 'rgba(255,255,255,.5)',
        'zIndex': 999
      },
      exportProductCode:`${systemConfig.baseURL}/qualification/exportExcel`
    }
  },
  created () { // 初始化钩子,获取所有产品类型
    this.queryParam = Object.assign({},this.queryParam,{toolType:this.toolType})
    getQualificationType({ text: '资质类型' }).then(res => {
      this.qualificationTypes = res.data
    })
  },
  methods: {
    // 新增
    handleAdd () {
      this.$refs.modal.add({toolType:this.toolType})
    },
    // 修改详情
    handleEdit (e) {
      this.$refs.editModal.edit(e)
    },
    // 删除
    del (row) {
      const _this = this
      this.$confirm({ title: '警告',
        content: `真的要删除 ${row.qualificationName} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          // 在这里调用删除接口
          delQualification({ 'id': row.id }).then(data => {
            if (data.code == 200) {
              _this.$message.success('删除成功')
              _this.$refs.table.refresh(true)
            } else {
              _this.$message.error(data.msg)
            }
          }).catch(() => {
            // Do something
          })
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    handleSaveOk () {
      this.$refs.table.refresh(true)
    },
    handleSaveClose () {

    },
    handleEditOk () {
      this.$refs.table.refresh(true)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('onSelectChange 点击了')
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>
