<template>
  <a-card :bordered="false">
    <!--消息推送共享设置-->
    <div class="operational-scheme-search-wrapper">
      <a-form layout="inline">
        <a-form-item label="姓名">
          <a-input :allowClear="true" v-model.trim="queryParam.beanName" placeholder="根据姓名查询" />
        </a-form-item>
        <!-- <a-form-item label="方法名称">
          <a-input :allowClear="true" v-model.trim="queryParam.serviceName" placeholder="根据方法名称查询" />
        </a-form-item> -->
        <template>
          <a-form-item>
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
          </a-form-item>
        </template>

        <div class="action-wrapper" style="float: right">
          <a-form-item>
            <template v-if="$auth('messagePush:add')">
              <a-button style="margin-left: 8px" type="primary" icon="plus" @click="handle('add', null)">新增</a-button>
            </template>
          </a-form-item>
        </div>
      </a-form>
    </div>
    <s-table
      v-if="$auth('messagePush:list')"
      style="margin-top: 20px"
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="false"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="type" slot-scope="text, record, index">
        {{ record.type.indexOf('1') !== -1 ? '系统消息' : '' }}
        {{ record.type.indexOf('2') !== -1 ? '待办消息' : '' }}
        {{ record.type.indexOf('3') !== -1 ? '备案消息' : '' }}
        {{ record.type.indexOf('4') !== -1 ? '合同/单据消息' : '' }}
        {{ record.type.indexOf('5') !== -1 ? '已办消息' : '' }}
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <template v-if="$auth('messagePush:modify')">
            <a @click="handle('modify', record)">修改</a>
          </template>
          <template v-if="$auth('messagePush:delete')">
            <a-divider type="vertical" />
            <a @click="del(record)">删除</a>
          </template>
        </template>
      </span>
    </s-table>
    <Modal ref="modal" @ok="handleSaveOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
// import { getFileManagementList, downloadFile, delFileManagement } from '@/api/OperationalScheme'
import { pushMsgList, pushMsgDel } from '@/api/workBox'

import Modal from './newEquipment'

export default {
  name: 'AndroidVersion',
  components: {
    // 组件
    STable,
    Modal,
  },

  data() {
    return {
      // 查询参数
      queryParam: {},
      //设备类型
      equipmentType: [],
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' },
          align: 'center',
        },
        {
          align: 'center',
          title: '被共享人',
          dataIndex: 'userName',
        },

        {
          align: 'center',
          title: '共享人员',
          dataIndex: 'userNames',
        },
        {
          align: 'center',
          title: '参数',
          scopedSlots: { customRender: 'type' },
          // dataIndex: 'type',
        },
        {
          align: 'center',
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return pushMsgList(Object.assign(parameter, this.queryParam))
          .then((res) => {
            // console.log(res)
            res.data.records = res.data.records.map((item) => {
              return {
                type: item.type,
                userId: item.userId,
                userName: item.userName,
                departmentId: item.departmentId,
                id: item.id,
                msgUsers: item.msgUsers,
                userNames: item.userNames.toString(),
              }
            })
            return res
          })
          .catch(function (err) {
            console.log(err)
          })
      },
    }
  },

  methods: {
    handle(type, record) {
      this.$refs.modal.query(type, record)
    },
    handleOk() {
      this.$refs.table.refresh()
    },
    handleSaveOk() {
      this.$refs.table.refresh(true)
    },
    handleSaveClose() {},
    // 删除
    del(record) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `是否删除此数据?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // 在这里调用删除接口
          pushMsgDel({ id: record.id })
            .then((data) => {
              if (data.code == 200) {
                _this.$message.success('删除成功')
                _this.$refs.table.refresh(true)
              } else {
                _this.$message.error(data.msg)
              }
            })
            .catch(() => {
              // Do something
            })
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    },
  },
}
</script>

<style scoped>
</style>
