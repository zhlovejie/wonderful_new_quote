<template>
  <a-card :bordered="false">
    <!--搜索模块-->
    <div class="product-list-search-wrapper">
      <a-form layout="inline">
        <a-form-item label="名称">
          <a-input v-model.trim="queryParam.productName" placeholder="根据名称模糊查询" />
        </a-form-item>
        <a-form-item label="产品代码">
          <a-input v-model.trim="queryParam.productModel" placeholder="根据代码查询" style="width: 100%" />
        </a-form-item>
        <a-form-item label="产品类型">
          <a-select
            style="width: 200px"
            v-model.trim="queryParam.productType"
            placeholder="请选择产品类型"
            default-value=""
          >
            <a-select-option v-for="ptype in productTypes" :key="ptype.index" :value="ptype.id">{{
              ptype.text
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="是否在售">
          <a-select placeholder="状态" v-model="queryParam.isSale" :allowClear="true" style="width: 150px">
            <a-select-option :value="0">在售</a-select-option>
            <a-select-option :value="1">停产</a-select-option>
          </a-select>
        </a-form-item>
        <template v-if="$auth('product:list')">
          <a-form-item>
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => (queryParam = {})">重置</a-button>
            <a-button
              type="primary"
              @click="handleUpload"
              :disabled="fileList.length === 0"
              :loading="uploading"
              style="margin-left: 8px"
            >
              {{ uploading ? '导入中' : '开始导入' }}
            </a-button>
            <a-upload :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload" style="margin-left: 8px">
              <a-button>选择文件</a-button>
            </a-upload>
          </a-form-item>
          <template v-if="$auth('product:add')">
            <a-button type="primary" style="float: right" icon="plus" @click="$refs.createModal.add()">新增</a-button>
          </template>
        </template>
      </a-form>
    </div>

    <s-table rowKey="id" ref="table" size="default" :columns="columns" :data="loadData" :pagination="pagination">
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="productPic" slot-scope="text">
        <img style="height: 70px; lenght: 70px" :src="text" />
      </span>
      <div slot="isSale" slot-scope="text, record, index">
        {{ +text === 0 ? '在售' : '停产' }}
      </div>
      <span slot="status" slot-scope="text, record">
        <template v-if="$auth('product:edit')">
          <a-switch
            checkedChildren="启用"
            :defaultChecked="text === 0 ? true : false"
            unCheckedChildren="禁用"
            @change="changestatus(text, record)"
          />
        </template>
        <template v-if="!$auth('product:edit')">
          <span v-if="text === 0">启用</span>
          <span v-if="text === 1">禁用</span>
        </template>
      </span>
      <span slot="seriesFlag" slot-scope="text, record">
        <template>
          <span v-if="text === 0">否</span>
          <span v-if="text === 1">是</span>
        </template>
      </span>
      <span slot="installExplain" slot-scope="text">
        <a v-if="text != null && text.length > 0" target="_blank" :href="text">点击下载</a>
        <span v-else>无</span>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <template v-if="$auth('product:one')">
            <a @click="$refs.previewModal.show(record)">预览</a>
          </template>
          <!--<a @click="handleShare(record)">分享</a>
          <a-divider type="vertical" />-->
          <template v-if="$auth('product:edit')">
            <a-divider type="vertical" />
            <a @click="$refs.createModal.edit(record)">修改</a>
          </template>
          <template v-if="$auth('product:del')">
            <a-divider type="vertical" />
            <a-popconfirm title="确认删除这条数据？" @confirm="confirm(record.id)" okText="是" cancelText="否">
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
        </template>
      </span>
    </s-table>
    <create-form ref="createModal" @ok="handleOk" />
    <preview ref="previewModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import CreateForm from './modules/CreateForm'
import Preview from './modules/Preview'
import { getProductList, delProduct, editProduct, importExcel } from '@/api/workBox'
import { getDictionary } from '@/api/common'

export default {
  name: 'ProductList',
  components: {
    // 组件
    STable,
    CreateForm,
    Preview,
  },
  data() {
    return {
      // 查询参数
      queryParam: {},
      //上传文件
      fileList: [],
      uploading: false,
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' },
        },
        {
          title: '名称',
          dataIndex: 'productName',
        },
        {
          title: '产品代码',
          dataIndex: 'productModel',
        },
        {
          title: '产品类别',
          dataIndex: 'productCategoryText',
        },
        {
          title: '类型',
          dataIndex: 'productTypeText',
        },
        {
          title: '常规系列',
          dataIndex: 'seriesFlag',
          scopedSlots: { customRender: 'seriesFlag' },
        },
        {
          title: '图片',
          dataIndex: 'productPic',
          scopedSlots: { customRender: 'productPic' },
        },
        {
          align: 'center',
          title: '是否在售',
          dataIndex: 'isSale',
          scopedSlots: { customRender: 'isSale' },
        },
        {
          title: '状态',
          width: '100px',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '产品说明书',
          width: '150px',
          dataIndex: 'installExplain',
          scopedSlots: { customRender: 'installExplain' },
        },
        {
          title: '操作人',
          dataIndex: 'modifier',
        },
        {
          title: '操作时间',
          width: '150px',
          dataIndex: 'modifyTime',
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' },
        },
      ],
      productTypes: [],
      pagination: {
        showTotal: (total) => '共' + total + '条数据',
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getProductList(Object.assign(parameter, this.queryParam))
          .then((res) => {
            return res
          })
          .catch(function (err) {
            console.log(err)
          })
      },
    }
  },
  created() {
    // 初始化钩子,获取所有产品类型
    getDictionary({ text: '产品类型' }).then((res) => {
      this.productTypes = res.data
    })
  },
  methods: {
    handleOk() {
      this.$refs.table.refresh()
    },
    confirm(pId) {
      // 确认删除事件
      delProduct({ id: pId })
        .then((res) => {
          this.$refs.table.refresh()
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    changestatus(text, record) {
      // 改变状态
      let status = 0
      if (text === 0) {
        status = 1
      }
      this.$set(record, 'status', status)
      editProduct(record)
        .then((res) => {
          if (res.code === 200) {
            this.$refs.table.refresh()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      this.fileList = this.fileList.slice(-1)
      return false
    },
    handleUpload() {
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('file', file)
      })
      this.uploading = true
      importExcel(formData)
        .then((res) => {
          let that = this
          console.log(res.type)
          //application/x-download
          //application/json
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

              that.$message.error('您提交的产品信息存在重复数据，请查看下载的 error.xlsx 文件！')
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
                  that.$message.success(_res.msg || '操作成功')
                  that.fileList = []
                }
              }
              reader.readAsText(res)
            }
          } else {
            console.log('未知错误：')
            console.log('类型：' + typeof res)
            console.log(res)
          }

          // if (res.code === 200) {
          //   this.$refs.table.refresh()
          //   this.fileList = []
          //   this.$message.success(res.msg)
          // } else {
          //   this.$message.error(res.msg)
          // }
        })
        .catch(function (err) {
          console.log(err)
        })
      this.uploading = false
    },
  },
}
</script>
