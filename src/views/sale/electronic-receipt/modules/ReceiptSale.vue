<template>
  <a-modal
    title="新增交款单位"
    :width="900"
    rowKey="id"
    :confirmLoading="confirmLoading"
    :footer="null"
    v-model="visible"
    :maskClosable="false"
  >
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item label="客户名称">
          <a-input v-model="name"/>
        </a-form-item>
        <a-form-item label="销售人员">
          <a-select class="a-select" style="width: 150px" v-model="userId" defaultValue="0">
            <a-select-option :value="0">请选择销售</a-select-option>
            <a-select-option v-for="val in saleUsers" :key="val.id" :value="val.id">{{ val.trueName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-spin :spinning="confirmLoading">
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
        <span slot="name" slot-scope="text, record">
          <!-- <a @click="clickVue(record)">{{ text }}</a> -->
          <a-dropdown>
            <a href="javascript:void(0);" style="text-align:left;">{{ text }}<a-icon type="down" style="margin-left:5px;" /></a>
            <a-menu slot="overlay">
              <a-menu-item v-for="(item, index) in record.customAlias" :key="index" @click="clickVue(record,index)">
                <template v-if="item._primary">
                  <a-tag color="red">主</a-tag>
                </template>
                <template v-else>
                  <a-tag color="pink">辅</a-tag>
                </template>
                {{item.name}}
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </s-table>
    </a-spin>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { receiptSaleCustomer } from '@/api/electronicReceipt'
import { listUserBySale } from '@/api/systemSetting'

export default {
  name: 'ReceiptSaleContract',
  components: {
    STable
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      mdl: {},
      queryParam: {},
      name: '',
      loading: true,
      saleUsers: [],
      userId: 0,
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' }
        },
        {
          title: '客户名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '对应销售',
          dataIndex: 'userName'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return receiptSaleCustomer(Object.assign(parameter, this.queryParam))
          .then(res => {
            res.data.records = res.data.records.map(item =>{
              let _customAlias = []
              _customAlias.push({name:item.name,_primary:true})
              let _alias = item.alias || ''
              let _aliasArr = _alias.split(',')
              if(_alias !== '' && _aliasArr.length > 0){
                _aliasArr.map(aliasStr =>_customAlias.push({name:aliasStr,_primary:false}))
              }
              item.customAlias = _customAlias
              return item
            })



            return res
          })
      }
    }
  },
  methods: {
    query (record) {
      this.visible = true
      listUserBySale().then(res => {
        this.saleUsers = res.data
      })
    },
    search () {
      this.queryParam = {
        'name': this.name,
        'userId': this.userId
      }
      this.$refs.table.refresh(true)
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    clickVue (record,index) {
      let _record = Object.assign({},record)
      _record.name = _record.customAlias[index].name
      this.$emit('custom-change',_record)

      //this.$emit('custom-change', data)
      this.close()
    }

  }
}
</script>
