<template>
  <a-modal
    title="产品信息及价格"
    :width="800"
    :visible="visible"
    @cancel="visible = false"
    :maskClosable="false"
    :destroyOnClose="true"
    :footer="null"
    key="m1"
  >
    <h3>产品信息</h3>
    <table class="custom-table custom-table-border c-stand-color">
      <tr>
        <td>核价代码</td>
        <td>{{ record.productCode }}</td>
        <td>产品代码</td>
        <td>{{ record.newBasisModel }}</td>
      </tr>
      <tr>
        <td>产品名称</td>
        <td>{{ record.productName }}</td>
        <td>产品类型</td>
        <td>{{ record.typeConfigName }}</td>
      </tr>
      <tr>
        <td>规格型号</td>
        <td colspan="3">{{ record.valencySpecs }}</td>
      </tr>
    </table>
    <h3>产品价格</h3>
    <div class="price-wrapper">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        @expand="expandHandler"
        :expandedRowKeys="expandedRowKeys"
        class="components-table-demo-nested"
        :customRow="customRowFunction"
        :pagination="false"
      >
        <div slot="order" slot-scope="text, record, index">
          <span style="font-size: 20px">{{ index + 1 }}</span>
        </div>
        <div slot="commissionRate" slot-scope="text, record, index">
          <span style="font-size: 20px">{{ text }}</span>
        </div>
        <div slot="price" slot-scope="text, record, index">
          <span style="font-size: 20px">{{ text }}</span>
        </div>
        <div slot="intervalValueName" slot-scope="text, record, index">
          <span style="font-size: 20px">{{ text }}</span>
        </div>
        <a-table
          slot="expandedRowRender"
          slot-scope="record, text"
          size="small"
          :columns="innerColumns"
          :dataSource="record.innerData"
          :pagination="false"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
        </a-table>
      </a-table>
    </div>
    <div style="text-align: center; margin-top: 10px">
      <a-button type="primary" @click="downloadAction"> 下载 </a-button>
    </div>
  </a-modal>
</template>

<script>
import { valencyCodePricing, exportValencyCodePricing } from '@/api/productOfferManagement'
export default {
  data() {
    return {
      innerColumns: [
        {
          align: 'center',
          title: '序号',
          scopedSlots: { customRender: 'order' },
        },
        {
          align: 'center',
          title: '区间值名称',
          dataIndex: 'intervalValueName',
        },
        {
          align: 'center',
          title: '提成比率',
          dataIndex: 'commissionRate',
        },
        {
          align: 'center',
          title: '销售价格',
          dataIndex: 'price',
        },
      ],
      columns: [
        {
          align: 'center',
          title: '序号',
          scopedSlots: { customRender: 'order' },
        },
        {
          align: 'center',
          title: '区间值名称',
          dataIndex: 'intervalValueName',
          scopedSlots: { customRender: 'intervalValueName' },
        },
        {
          align: 'center',
          title: '提成比率',
          dataIndex: 'commissionRate',
          scopedSlots: { customRender: 'commissionRate' },
        },
        {
          align: 'center',
          title: '销售价格',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' },
        },
      ],
      visible: false,
      dataSource: [],
      expandedRowKeys: [],
      record: {},
    }
  },

  methods: {
    customRowFunction(record) {
      //rateType 1 总区间 蓝色  2 推荐区间 黄色 3竞争力区间 红色
      let { rateType } = record
      return {
        style: {
          'background-color': rateType === 1 ? '#E6F7FF ' : +rateType === 2 ? '#FFFBE6' : '#FFF1F0',
        },
      }
    },
    query(record) {
      this.visible = true
      this.record = record
      valencyCodePricing({ valencyId: record.id }).then((res) => {
        console.log(res.data)
        if (res.code === 200) {
          this.current++
          this.dataSource = res.data.map((item, index) => {
            item.key = index + 1
            item.innerData = []
            return item
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    expandHandler(expanded, record) {
      console.log(arguments)
      if (expanded) {
        this.expandedRowKeys = [...this.expandedRowKeys, record.key]
        valencyCodePricing({
          //   rangeId: this.record.rangeId,
          //   id: this.productTypeConfigId,
          valencyId: this.record.id,
        }).then((res) => {
          if (res.code === 200) {
            let react = this.dataSource.find((item) => item.key === record.key)
            react.innerData = res.data
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.expandedRowKeys = this.expandedRowKeys.filter((val) => val !== record.key)
      }
    },
    downloadAction() {
      let that = this
      that.spinning = true

      exportValencyCodePricing({ rangeId: -1, valencyId: this.record.id })
        .then((res) => {
          that.spinning = false
          console.log(res)
          if (res instanceof Blob) {
            const isFile = res.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            const isJson = res.type === 'application/json'
            if (isFile) {
              //返回文件 则下载
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = `核价信息.xls`
              a.click()
              document.body.removeChild(a)
              that.$message.info('下载成功')
              return
            } else if (isJson) {
              //返回json处理
              var reader = new FileReader()
              reader.onload = function (e) {
                let _res = null
                try {
                  _res = JSON.parse(e.target.result)
                } catch (err) {
                  _res = null
                }
                if (_res !== null) {
                  if (_res.code !== 0) {
                    that.$message.info(_res.message)
                  } else {
                    that.$message.info('下载成功')
                  }
                } else {
                  that.$message.info('json解析出错 e.target.result：' + e.target.result)
                  return
                }
              }
              reader.readAsText(res)
            } else {
              that.$message.info('不支持的类型:' + res)
            }
          }
        })
        .catch((err) => (that.spinning = true))
    },
  },
}
</script>

<style>
</style>