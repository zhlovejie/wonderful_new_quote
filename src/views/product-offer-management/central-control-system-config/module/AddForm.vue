<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <a-form-item label="中控系统模块名称">
          <a-input
            :disabled="isDisabled"
            v-decorator="['name', { rules: [{ required: true, message: '请输入配置名称' }] }]"
          />
        </a-form-item>

        <a-form-item label="竞争力">
          <a-select 
            :disabled="isDisabled"
            :allowClear="true" 
            v-decorator="['priceCoefficientId',{rules: [{ required: true, message: '请选择竞争力'}]}]" 
            placeholder="请选择竞争力" 
            style="width: 100%"
          >
            <a-select-option v-for="item in productPriceCoefficientList" :value="item.id" :key="item.id" >{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>


        <a-form-item label="标准配置" class="add-shadow">
          <OptList
            ref="ref_optStand"
            :dataSource="optStand"
            inputKey="optStand"
            :showRequire="false"
            @change="tableOptChoiceSelected"
          />
          <a-button
            style="width:100%;"
            type="dashed"
            icon="plus"
            @click="ShowModule('optStand')"
          >添加标准配置</a-button>
        </a-form-item>
        <div class="opt-choice-wrapper add-shadow">
          <a-form-item label="选择配置">
            <OptList
              ref="ref_optSelect"
              :dataSource="optSelect"
              inputKey="optSelect"
              :showRequire="false"
              @change="tableOptChoiceSelected"
            />
            <a-button
              style="width:100%;"
              type="dashed"
              icon="plus"
              @click="ShowModule('optSelect')"
            >添加选择配置</a-button>
          </a-form-item>

          <div
            class="opt-choice-item"
            v-for="(item,index) in optChoice"
            :key="index"
          >
            <div class="opt-choice-header">
              <h4>选择项{{index+1}}:</h4>
              <a class="opt-choice-delete" @click="delOptChoice(index)" title="删除">删除</a>
            </div>
            <OptList
              :ref="`ref_optChoice_${index}`"
              :dataSource="item.dataSource"
              :inputKey="`optChoice.${index}`"
              :showRequire="true"
              @change="tableOptChoiceSelected"
            />
            <a-button
              style="width:100%;"
              type="dashed"
              icon="plus"
              @click="ShowModule('optChoice',index)"
            >添加</a-button>
          </div>
          <a-form-item>
            <a-button style="width:100%;" type="dashed" icon="plus" @click="addOptChoiceItem">添加选择项</a-button>
          </a-form-item>
        </div>

        <a-form-item label="备注">
          <a-textarea
            placeholder="备注"
            :rows="5"
            v-decorator="['remarks', { rules: [{ required: false, message: '备注' }] }]"
          />
        </a-form-item>
      </a-form>
      <TableOptChoice ref="tableOptChoice" @select="tableOptChoiceSelected" />
    </a-spin>
  </a-modal>
</template>

<script>
import vuedraggable from 'vuedraggable'
import {
  priceAdjustZktConfigDetail,
  priceAdjustZktConfigAddAndUpdate,
  priceAdjustItemConfigList
} from '@/api/productOfferManagement' 
import {productPriceCoefficientListWithoutPage} from '@/api/workBox' 
import TableOptChoice from './TableOptChoice'
import OptList from './OptList' 
export default {
  name: 'AddForm',
  components: {
    vuedraggable,
    TableOptChoice,
    OptList
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'addForm' }),
      visible: false,
      actionType: 'add',
      spinning: false,
      optStand: [], //标配项
      optSelect: [], //选配项
      optChoice: [], //选择项
      productPriceCoefficientList:[]
    }
  },
  computed: {
    modalTitle() {
      let m = {
        view: '查看',
        add: '新增',
        edit: '修改',
        approval: '审批'
      }
      return `${m[this.actionType]}中控系统模块`
    },
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      return this.isView || this.isApproval
    }
  },

  methods: {
    init() {
      let that = this
      let queue = []
      queue.push(productPriceCoefficientListWithoutPage().then(res =>{
        that.productPriceCoefficientList = res.data
      }))
      return Promise.all(queue)
    },
    async handleOk() {
      let that = this
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          if (that.isEdit) {
            values.id = that.record.id
          }

          let priceSysConfigBoList = []

          let optStandData = that.$refs['ref_optStand'].getData()
          let optSelectData = that.$refs['ref_optSelect'].getData()
          let optChoiceData = []

          that.optChoice.map((item, index) => {
            try {
              let target = that.$refs[`ref_optChoice_${index}`][0]
              if (target) {
                optChoiceData.push(target.getData())
              }
            } catch (err) {
              console.log(err)
            }
          })

          optStandData &&
            optStandData.map((item, index) => {
              priceSysConfigBoList.push({
                itemId: item.id,
                mainBody: 1,
                orderNo: item.serialNum,
                type: 1,
                zktId: values.id || ''
              })
            })

          optSelectData &&
            optSelectData.map((item, index) => {
              priceSysConfigBoList.push({
                itemId: item.id,
                mainBody: 1,
                orderNo: item.serialNum,
                type: 2,
                zktId: values.id || ''
              })
            })

          optChoiceData &&
            optChoiceData.map((items, index) => {
              items.map((item, _index) => {
                priceSysConfigBoList.push({
                  groupId: index + 1,
                  itemId: item.id,
                  mainBody: 1,
                  orderNo: item.serialNum,
                  type: item.isRequire ? 4 : 5,
                  zktId: values.id || ''
                })
              })
            })

          values.priceSysConfigBoList = priceSysConfigBoList
          console.log('Received values of form: ', values)
          that.spinning = true
          priceAdjustZktConfigAddAndUpdate(values)
            .then(res => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch(err => {
              console.log(err)
              that.$message.error('操作失败')
              that.spinning = false
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.actionType = type
      that.record = record || {}
      that.form.resetFields()
      that.optStand = []
      that.optSelect = []
      that.optChoice = []

      await that.init()
      that.visible = true

      if (this.isAdd) {
        return
      }

      priceAdjustZktConfigDetail({ id: record.id }).then(res => {
        //debugger
        that.form.setFieldsValue({
          name: res.data.name,
          remarks: res.data.remarks
        })
        let { optStandData, optSelectData, optChoiceData } = that.formatData(res.data.sysConfigList)
        that.optStand = optStandData
        that.optSelect = optSelectData
        that.optChoice = optChoiceData
      })
    },
    ShowModule(key, index) {
      let that = this
      let map = {
        optStand: {
          key: 'optStand',
          searchParam: { type: 1 },
          selected: that.optStand.map(item => Object.assign({}, item))
        },
        optSelect: {
          key: 'optSelect',
          searchParam: { type: 1 },
          selected: that.optSelect.map(item => Object.assign({}, item))
        },
        optChoice: {
          key: 'optChoice',
          searchParam: { },
          selected: that.optChoice.map(item => Object.assign({}, item))
        }
      }

      if (key === 'optChoice') {
        map[key] = {
          key: `optChoice.${index}`,
          searchParam: { type:1},
          selected: that.optChoice[index]['dataSource'].map(item => Object.assign({}, item))
        }
      }

      map[key] && this.$refs.tableOptChoice.query(map[key])
    },
    tableOptChoiceSelected(result) {
      let that = this
      let { inputKey, selectedRecord } = result
      if (inputKey.startsWith('optChoice')) {
        let idx = inputKey.split('.')[1]
        let dataSource = [...that.optChoice]
        dataSource[idx]['dataSource'] = selectedRecord.map((item, index) => {
          let _item = Object.assign({}, item)
          _item.serialNum = index + 1
          return _item
        })
        that.optChoice = [...dataSource]
      } else {
        let dataSource = [...that[inputKey]]
        dataSource = selectedRecord.map((item, index) => {
          let _item = Object.assign({}, item)
          _item.serialNum = index + 1
          return _item
        })
        that[inputKey] = [...dataSource]
      }
    },
    addOptChoiceItem() {
      this.optChoice.push({
        dataSource: []
      })
    },
    delOptChoice(index) {
      this.optChoice.splice(index, 1)
    },
    formatData(data) {
      let formatDataItem = data => {
        //返回的列表数据格式转换成需要的数据格式
        return data.map((item, index) => {
          let _item = {
            id: item.itemId,
            itemName: item.name,
            key: item.itemId,
            order: index + 1,
            serialNum: index + 1,
            zktId: item.zktId
          }
          if ([4, 5].includes(item.type)) {
            _item.isRequire = item.type === 4 ? true : false
          }
          return _item
        })
      }
      let optStandData = data
        .filter(item => item.mainBody === 1 && item.type === 1)
        .sort((a, b) => a.orderNo - b.orderNo)
      let optSelectData = data
        .filter(item => item.mainBody === 1 && item.type === 2)
        .sort((a, b) => a.orderNo - b.orderNo)
      let optChoiceData = data.filter(item => item.mainBody === 1 && [4, 5].includes(item.type))

      let groups = [...new Set(optChoiceData.map(item => item.groupId))].sort()
      let res = []
      groups.map(groupId => {
        let dataSource = optChoiceData.filter(item => item.groupId === groupId).sort((a, b) => a.orderNo - b.orderNo)
        if (dataSource.length > 0) {
          res.push({
            dataSource: formatDataItem(dataSource)
          })
        }
      })
      return {
        optStandData: formatDataItem(optStandData),
        optSelectData: formatDataItem(optSelectData),
        optChoiceData: res
      }
    }
  }
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.add-form-wrapper >>> .ant-form-item {
  margin-bottom: 10px;
}

.add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}

.add-shadow {
  /* box-shadow: 0 0 3px #ccc; */
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 10px 20px 20px;
}

.opt-choice-wrapper .opt-choice-item {
  position: relative;
  border-top: 1px solid #ddd;
  padding: 10px 0;
  margin-bottom: 15px;
}

.opt-choice-wrapper .opt-choice-item .opt-choice-delete {
  padding: 0 15px;
}

.opt-choice-wrapper .opt-choice-item .opt-choice-header{
  display: flex;
  line-height: 40px;
}
.opt-choice-wrapper .opt-choice-item .opt-choice-header h4{
  flex: 1;
  margin-bottom: 0;
}

.opt-choice-wrapper .opt-choice-item >>> .opt-list-is-require{
  position: absolute;
  top: 10px;
  right: 60px;
}
</style>