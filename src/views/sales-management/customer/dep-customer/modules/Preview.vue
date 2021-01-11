<template>
  <a-modal
    title="客户详情"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleCancel"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <a-form :form="form">
      <!--span:在屏幕中的占比，offset：距离左边距离，lg大屏，md中屏，sm小屏-->
      <a-row class="form-row" :gutter="24">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input read-only="read-only" v-model="customer.name"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="别名" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input read-only="read-only" v-model="customer.alias"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="24">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="固定电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input read-only="read-only" v-model="customer.tel"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="传真" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input read-only="read-only" v-model="customer.fax"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="24">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="获知渠道" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input read-only="read-only" v-model="customer.learnName"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="客户意向" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input read-only="read-only" v-if="customer.intention == 1" value="有效客户"/>
            <a-input read-only="read-only" v-if="customer.intention == 2" value="无效客户"/>
            <a-input read-only="read-only" v-if="customer.intention == 3" value="竞争对手"/>
            <a-input read-only="read-only" v-if="customer.intention == 4" value="黑名单客户"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="24">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="客户类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input read-only="read-only" v-model="customer.typeName"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24" v-show="customer.superiorName != undefined && customer.superiorName.length > 0">
          <a-form-item label="所属代理商" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input read-only="read-only" v-model="customer.superiorName"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24" v-show="customer.controlArea && customer.controlArea !== 'null'">
          <a-form-item label="代理区域" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input read-only="read-only" v-model="customer.controlArea"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="24">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="录入渠道" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input read-only="read-only" v-model="customer.sourceName"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="所属客户池" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input read-only="read-only" v-if="customer.pool == 1" value="公共客户池"/>
            <a-input read-only="read-only" v-if="customer.pool == 2" value="部门客户池"/>
            <a-input read-only="read-only" v-if="customer.pool == 3" value="待分配客户池"/>
            <a-input read-only="read-only" v-if="customer.pool == 4" value="分配中"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="24">
        <a-col :lg="24" :md="24" :sm="24">
          <a-form-item label="所属地区" :labelCol="labelColOne" :wrapperCol="wrapperOne">
            <a-input read-only="read-only" v-model="areaName"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="24">
        <a-col :lg="24" :md="24" :sm="24">
          <a-form-item label="详细地址" :labelCol="labelColOne" :wrapperCol="wrapperOne">
            <a-input read-only="read-only" v-model="customer.address"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="24">
        <a-col :lg="24" :md="24" :sm="24">
          <a-form-item label="感兴趣产品" :labelCol="labelColOne" :wrapperCol="wrapperOne">
            <a-input read-only="read-only" v-model="customer.interestProduct"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="24">
        <a-col :lg="24" :md="24" :sm="24">
          <a-form-item label="业务描述" :labelCol="labelColOne" :wrapperCol="wrapperOne">
            <a-textarea read-only="read-only" v-model="customer.businessDescription"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="24">
        <a-col :lg="24" :md="24" :sm="24">
          <a-form-item label="营业执照" :labelCol="labelColOne" :wrapperCol="wrapperOne">
            <img style="width: 100%;height:auto;" :src="customer.licenseImg" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="24">
        <a-col :lg="24" :md="24" :sm="24">
          <a-form-item label="联系人" :labelCol="labelColOne" :wrapperCol="wrapperOne">
            <a-table
              ref="table"
              :columns="columns"
              :dataSource="linkmans"
              :pagination="false"
              rowKey="name"
            >
              <span slot="sex" slot-scope="text">
                <span v-if="text === 1">男</span>
                <span v-if="text === 0">女</span>
              </span>
              <span slot="main" slot-scope="text">
                <a-icon v-if="text === 1" type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>
                <a-icon v-if="text === 0" type="close-square" theme="twoTone" twoToneColor="#D4D4D4"/>
              </span>
            </a-table>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import ATextarea from 'ant-design-vue/es/input/TextArea'
import { getOneArea } from '@/api/common'

export default {
  name: 'Preview',
  components: { ATextarea },
  data () {
    return {
      visible: false, // 是否显示
      customer: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      },

      labelColOne: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperOne: {
        xs: { span: 24 },
        sm: { span: 22 }
      },
      form: this.$form.createForm(this),
      columns: [
        {
          title: '联系人名',
          dataIndex: 'name'
        },
        {
          title: '性别',
          dataIndex: 'sex',
          scopedSlots: { customRender: 'sex' }
        },
        {
          title: '职位',
          dataIndex: 'position'
        },
        {
          title: '手机号',
          dataIndex: 'phone'
        },
        {
          title: '微信',
          dataIndex: 'weixin'
        },
        {
          title: '邮箱',
          dataIndex: 'email'
        },
        {
          title: 'QQ',
          dataIndex: 'qq'
        },
        {
          title: '是否为主联系人',
          dataIndex: 'main',
          scopedSlots: { customRender: 'main' }
        }
      ],
      linkmans: [],
      areaName: ''
    }
  },
  methods: {
    show (record) {
      this.visible = true
      this.customer = record
      this.linkmans = record.linkmans
      if (record.province !== undefined && record.province != null) {
        getOneArea({ id: record.province }).then(res => {
          if (res.code === 200) {
            this.areaName += res.data.area + ','
          }
        })
      }
      if (record.city !== undefined && record.city != null) {
        getOneArea({ id: record.city }).then(res => {
          if (res.code === 200) {
            this.areaName += res.data.area + ','
          }
        })
      }
      if (record.area !== undefined && record.area != null) {
        getOneArea({ id: record.area }).then(res => {
          if (res.code === 200) {
            this.areaName += res.data.area
          }
        })
      }
    },
    handleCancel () {
      this.areaName = ''
      this.form.resetFields() // 清空表
      this.visible = false
    }
  }
}
</script>
<style >
.ant-form-item-label{text-align: left;}
</style>