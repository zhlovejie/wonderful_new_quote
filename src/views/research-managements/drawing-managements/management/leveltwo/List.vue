<template>
  <!-- 图纸权限管理 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="名称" v-model="searchParam.name" allowClear style="width:160px;margin-right:10px;" />
      <a-input placeholder="代码" v-model="searchParam.code" allowClear style="width:160px;margin-right:10px;" />
      <a-input placeholder="备注信息" v-model="searchParam.remark" allowClear style="width:160px;margin-right:10px;;" />
      <a-button class="a-button" type="primary" icon="search" @click="searchAction({current:1})">查询</a-button>
      <a-button style="float:right;" type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
    </div>
    <div class="main-wrapper">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange" 
        :customRow="customRowFunction"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>

        <div slot="url" slot-scope="text">
          <img v-if="text" @click="showImg(text)" :src="text" alt="产品图片" style="width:48px;height:auto;">
          <span v-else>无</span>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record" @click.stop="(e) =>{/*防止触发 rowclick 事件*/}">
          <a type="primary" @click="doAction('edit',record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="是否要删除此行？"  @confirm="doAction('del',record,$event)">
            <a>删除</a>
          </a-popconfirm>
        </div>
      </a-table>

    </div>
    <ImgView ref="imgView" />
    <AddForm ref="addForm" @finish="() => { searchAction(),$emit('finish') }" />
  </div>
</template>

<script>
import ImgView from '@/components/CustomerList/ImgView'
import {
  blueprintMenuPageList,
  blueprintMenuDetail,
  blueprintMenuDel,
  blueprintMenuAddOrUpdate
} from '@/api/researchManagement'
import AddForm from './AddForm'
import moment from 'moment'

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
    title: '名称',
    dataIndex: 'name'
  },
  {
    align: 'center',
    title: '代码',
    dataIndex: 'code'
  },
  {
    align: 'center',
    title: '图片',
    dataIndex: 'url',
    scopedSlots: { customRender: 'url' }
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remark'
  },
  {
    align: 'center',
    title: '操作',
    dataIndex: 'id',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]


export default {
  name: 'drawing-managements-management-level-2',
  components: {
    AddForm,
    ImgView
  },
  props:{
    params:{
      type:Object,
      default:() =>{
        return {
          id:0,
          type:0,
          superiorId:0,
          menuName:'图纸管理'
        }
      }
    }
  },
  data() {
    return {
      searchParam:{},
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1,
        size:"10",
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
      loading: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      inputParam:{}
    }
  },
  watch:{
    params(val){
      this.init()
    }
  },
  created(){
    this.init()
  },
  methods: {
    moment,
    init() {
      this.inputParam = Object.assign({},this.params)
      let {id,type} = this.inputParam
      this.searchParam = Object.assign({},this.searchParam,{
        superiorId:id || 0,
        //type:type
      })
      this.searchAction({current:1})
    },
    searchAction(opt = {}) {
      let that = this
      let paginationParam = {
        current:that.pagination.current || 1,
        size:that.pagination.size || 10
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      blueprintMenuPageList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination
        })
        .catch(err => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({ current: pagination.current })
    },
    onShowSizeChangeHandler(current,pageSize){
      let pagination = {...this.pagination}
      pagination.current = current
      pagination.size = String(pageSize)
      this.pagination = pagination
      this.searchAction()
    },
    doAction(actionType, record={},event) {
      let that = this
      if(['add','edit','view'].includes(actionType)){
        that.$refs.addForm.query(actionType, {
          params:{...that.inputParam},
          record:{...record}
        })
        return
      } else if (actionType === 'del') {
        // let node = that.findNode(that.inputParam,record.id)
        // if(node && Array.isArray(node.subList) && node.subList.length > 0){
        //   that.$message.info('该目录下有文件，无法执行删除操作')
        //   return
        // }
        blueprintMenuDel(`id=${record.id}`)
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
            that.$emit('finish')
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
        return
      } else {
        this.$message.info('功能尚未实现！')
        return
      }
    },
    customRowFunction(record,index){
      let that = this
      return {
        on:{
          click:(event)=>{
            //console.log(record)
            //that.$emit('rowhover',{menuId:record.id})
            that.$emit('rowhover',Object.assign({},record))
          }
        }
      }
    },
    findNode(node, id) { //查找指定ID的节点
      let res = null
      let fNode = (obj) => {
        if (obj.id === id) {
          return obj
        }
        if (obj && obj.subList) {
          for (let i = 0, len = obj.subList.length; i < len; i++) {
            res = fNode(obj.subList[i])
            if(res !== null){
              return res
            }
          }
        }
        return null
      }
      return fNode(node)
    },
    showImg(url){
      this.$refs.imgView && this.$refs.imgView.show(url)
    }
  }
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.wdf-custom-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}
.main-wrapper {
  margin-top: 20px;
}

</style>
