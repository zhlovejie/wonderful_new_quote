<template>
  <a-modal
    title="填写代码和产品名"
    :width="1500"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
  >
    <a-form :form="form">
      <a-table
        ref="table"
        :columns="columns"
        :dataSource="products"
        :pagination="false" 
        :scroll="{ x: 2500 }" 
        rowKey="id"
      >
        <template slot="referencePic" slot-scope="text">
          <img style="height: 50px;lenght:40px" :src="text" />
        </template>
        <template slot="effectPic" slot-scope="text">
          <img style="height: 50px;lenght:40px" :src="text" />
        </template>
        <template slot="newBasisModel" slot-scope="text, record">
          <a-input 
          @change="inputChange(record.id, 'newBasisModel', $event)"/>
        </template>
        <!-- <template slot="productName" slot-scope="text, record">
          <a-input 
          @change="inputChange(record.id, 'productName', $event)"/>
        </template> -->
      </a-table>
    </a-form>
  </a-modal>
</template>

<script>
import { getlookApplyNuclear, addCodeAndName, isRepeatCode } from '@/api/pricingModule'
export default {
  name: 'AddCodeAndName',
  data () {
    return {
      columns: [
        {
          align: 'center',
          title: '所依据产品代码',
          dataIndex: 'productModel',
          key: 'productModel',
          width: '150px'
        },
        {
          align: 'center',
          title: '需求数量',
          dataIndex: 'demandNumber',
          key: 'demandNumber',
          width: '100px'
        },
        {
          align: 'center',
          title: '规格',
          dataIndex: 'specs',
          key: 'specs',
          width: '100px'
        },
        {
          align: 'center',
          title: '需求描述',
          dataIndex: 'demandRemarks',
          key: 'demandRemarks',
          width: '250px'
        },
        {
          align: 'center',
          title: '产品区域',
          dataIndex: 'oldAreaText',
          key: 'oldAreaText',
          width: '150px'
        },
        {
          align: 'center',
          title: '参考图片',
          dataIndex: 'referencePic',
          key: 'referencePic',
          scopedSlots: { customRender: 'referencePic' },
          width: '150px'
        },
        {
          align: 'center',
          title: '修改点',
          dataIndex: 'revisedPart',
          key: 'revisedPart',
          width: '150px'
        },
        {
          align: 'center',
          title: '新产品区域',
          dataIndex: 'areaText',
          key: 'areaText',
          width: '150px'
        },
        {
          align: 'center',
          title: '成本价',
          dataIndex: 'costPrice',
          key: 'costPrice',
          width: '150px'
        },
        {
          align: 'center',
          title: 'A价',
          dataIndex: 'aprice',
          key: 'aprice'
        },
        {
          align: 'center',
          title: 'B价',
          dataIndex: 'bprice',
          key: 'bprice'
        },
        {
          align: 'center',
          title: 'C价',
          dataIndex: 'cprice',
          key: 'cprice'
        },
        {
          align: 'center',
          title: '效果图',
          dataIndex: 'effectPic',
          key: 'effectPic',
          scopedSlots: { customRender: 'effectPic' },
          width: '150px'
        },
        {
          align: 'center',
          title: '规格型号',
          dataIndex: 'valencySpecs',
          key: 'valencySpecs',
          width: '250px'
        },
        {
          align: 'center',
          title: '产品名称',
          dataIndex: 'productName',
          key: 'productName',
          //scopedSlots: { customRender: 'productName' },
          width: '200px'
        },
        {
          align: 'center',
          title: '产品代码',
          dataIndex: 'newBasisModel',
          key: 'newBasisModel',
          scopedSlots: { customRender: 'newBasisModel' },
          width: '200px'
        }
        
      ],
      form: this.$form.createForm(this), // 只有这样注册后，才能通过表单拉取数据
      visible: false, // 表单对话框是否可见
      confirmLoading: false, // 确定按钮后是否显示加载图 loading
      layout: 'inline', // 表单布局方式
      products: [], // 核价单里的所有产品列表
      id:undefined
    }
  },
  methods: {
    showForm (vId) {
      this.id = vId
      getlookApplyNuclear({ id: vId }).then(res=> {
        if (res.code === 200 ) {
          this.products = res.data.valencyProducts
        } else {
          this.$message.error(res.msg)
        }
      })
      this.visible = true
    },
    inputChange (id, type, e) {
      let ivalue = e.target.value.trim()
      if (type === 'newBasisModel') {
        isRepeatCode({newBasisModel:ivalue}).then(res =>{
          if(res.code !== 200){
            ivalue = ''
            this.$message.error('此新产品代码已重复！')
            return false
          }
        })
      }
      setTimeout(() => {
        const index = this.products.findIndex(item => item.id === id)
        if (index >= 0) {
          this.products[index][type] = ivalue
        }
      }, 600)
      
    },
    handleCancel () {
      this.form.resetFields() // 清空表
      this.visible = false
    },
    handleSubmit () {
      this.confirmLoading = true
      function isEmpty(o){
        return o === undefined || o === '' || o === null ? true : false
      }
      for(let i=0,len = this.products.length;i<len;i++){
        let {newBasisModel,productName} = this.products[i]
        if(isEmpty(newBasisModel)){
          this.$message.error('请输入产品代码')
          this.confirmLoading = false
          return
        }
        // if(isEmpty(productName)){
        //   this.$message.error('请输入产品名称')
        //   this.confirmLoading = false
        //   return
        // }
      }
      
      addCodeAndName ({ id:this.id,valencyProducts: this.products }).then(res=> {
        if (res.code === 200) {
          this.visible = false
          this.$emit('ok')
        } else {
          this.$message.error(res.msg)
        }
      })
      this.confirmLoading = false
    }
  }
}
</script>

<style scoped>

</style>
