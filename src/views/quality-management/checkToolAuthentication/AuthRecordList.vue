<template>
  <a-modal
    :title="modalTitle"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
    :width="1000"
  >
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      size="small"
    >
      <div
        slot="order"
        slot-scope="text, record, index"
      >
        {{index + 1}}
      </div>
      <div slot="authenticationOffice" slot-scope="text, record, index" >{{ {0:'质监局',1:'万德福'}[text] }} </div>
      <div slot="authenticationResult" slot-scope="text, record, index" >{{ {0:'合格',1:'不合格'}[text] }} </div>
      <div slot="annexUrl" slot-scope="text, record, index" >
        <a href="javascript:void(0);" v-if="record.annexUrl" @click="() => handlerImageView(record.annexUrl,'file')">查看附件</a>
        <span v-else>未上传附件</span>
      </div>
      <div slot="authenticationCertificate" slot-scope="text, record, index" >
        <a href="javascript:void(0);" v-if="record.annexUrl" @click="() => handlerImageView(record.authenticationCertificate,'image')">查看证书</a>
        <span v-else>未上传证书</span>
      </div>
    </a-table>
    <ImgViewList ref="imgViewList" title="查看证书"/>
    <FileViewList ref="fileViewList" title="查看附件"/>
  </a-modal>
</template>
<script>
import {
  checkToolAuthenticationRecord
} from '@/api/qualityManagement'
import ImgViewList from '@/components/CustomerList/ImgViewList'
import FileViewList from '@/components/CustomerList/FileViewList'
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    width:80
  },
  {
    title: '认证结果',
    dataIndex: 'authenticationResult',
    scopedSlots: { customRender: 'authenticationResult' },
  },
  {
    title: '认证处',
    dataIndex: 'authenticationOffice',
    scopedSlots: { customRender: 'authenticationOffice' },
  },
  {
    title: '认证人',
    dataIndex: 'createdName'
  },
  {
    title: '认证日期',
    dataIndex: 'createdTime'
  },
  {
    title: '认证证书',
    dataIndex: 'authenticationCertificate',
    scopedSlots: { customRender: 'authenticationCertificate' },
  },
  {
    title: '附件',
    dataIndex: 'annexUrl',
    scopedSlots: { customRender: 'annexUrl' },
  },
  {
    title: '备注',
    dataIndex: 'remarks'
  }
]

export default {
  components:{
    ImgViewList,
    FileViewList
  },
  data() {
    return {
      visible:false,
      dataSource: [],
      loading: false,
      columns,
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler
      },
      searchParam:{}
    }
  },
  computed:{
    modalTitle(){
      return '认证记录'
    }
  },
  methods: {
    query(record){
      const that = this
      that.searchParam = {
        ...that.searchParam,
        toolAuthenticationId:record.id
      }
      that.visible = true
      that.$nextTick(() => {
        that.search()
      })
    },
    handleCancel(){
      this.visible = false
    },
    search(params = {}) {
      const that = this
      const paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }

      const _searchParam = Object.assign({}, {...that.searchParam}, paginationParam, params)
      that.loading = true
      checkToolAuthenticationRecord(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.exceptionDate = String(item.exceptionDate).slice(0,10)
            return item
          })

          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          const { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.search()
          }
        })
        .catch(err => {
          that.loading = false
          console.log(err)
        })
    },

    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.search()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    handlerImageView(annexUrl,type){
      let pictureUrl = annexUrl
      let imgList = pictureUrl.split(',').map(url => decodeURIComponent(url))
      if(type ==='image'){
        this.$refs.imgViewList.show(imgList)
      }else{
        this.$refs.fileViewList.show(imgList)
      }
    },
  },
};
</script>
