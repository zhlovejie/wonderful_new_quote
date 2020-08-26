<template>
  <!-- 人员储备 -->
  <div class="reserve-list-wrapper">
    <div class="search-wrapper">
      <a-select
        placeholder="选择部门"
        @change="depChangeHandler"
        v-model="depId"
        :allowClear="true"
        style="width: 150px"
      >
        <a-select-option
          v-for="item in depSelectDataSource"
          :key="item.id"
          :value="item.id"
        >{{item.departmentName}}</a-select-option>
      </a-select>

      <a-select placeholder="选择岗位" v-model="stationId" :allowClear="true" style="width: 180px">
        <a-select-option
          v-for="item in postSelectDataSource"
          :key="item.id"
          :value="item.id"
        >{{item.stationName}}</a-select-option>
      </a-select>

      <a-input placeholder="姓名查询" v-model="userName" allowClear style="width:100px;" />
      <a-input placeholder="手机号查询" v-model="phoneNumber" allowClear style="width:130px;" />

      <label>员工状态</label>
      <a-select placeholder="员工状态" v-model="userStatus" :allowClear="true" style="width: 140px">
        <a-select-option :value="0">浏览</a-select-option>
        <a-select-option :value="1">试用期</a-select-option>
        <a-select-option :value="2">试用期不通过</a-select-option>
        <a-select-option :value="3">在职</a-select-option>
        <a-select-option :value="4">离职</a-select-option>
      </a-select>

      <label>是否邀请面试</label>
      <a-select placeholder="是否邀请面试" v-model="isInterviewed" :allowClear="true" style="width: 50px">
        <a-select-option :value="0">否</a-select-option>
        <a-select-option :value="1">是</a-select-option>
      </a-select>
      <a-button class="a-button" type="primary" icon="search" @click="searchAction({current:1})">查询</a-button>
      <a-button class="a-button" type="primary" icon="download" @click="downloadAction">下载</a-button>
      <a
        target="_blank"
        class="a-button ant-btn ant-btn-primary"
        href="https://www.delanshi.cn/images/cloud/20200409/人才储备模板cde1f372-2758-4724-b8a5-6004b411df2f.xlsx"
      >下载模板</a>
      <div class="upload-wrapper">
        <a-upload :beforeUpload="beforeUpload">
          <a-button class="a-button" type="primary" icon="upload" :loading="uploading">上传</a-button>
        </a-upload>
      </div>
      <a-button style="float:right;" type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
    </div>
    <div class="main-wrapper">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="isInterviewed" slot-scope="text, record">
          <a
            type="primary"
            @click="doAction('interviewed',record)"
          >{{ getInterviewedTxt(record.isInterviewed)}}</a>
        </div>

        <div slot="faceStatus" slot-scope="text, record">
          <span>{{ getInterviewedTxt(record.faceStatus)}}</span>
        </div>
        <div slot="status" slot-scope="text, record">
          <span>{{ getUserStatusTxt(record.status)}}</span>
        </div>
        <div slot="sex" slot-scope="text, record">
          <span>{{ record.sex === 1 ? '男' : '女' }}</span>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view',record)">查看</a>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('edit',record)">修改</a>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('upload',record)">上传简历</a>
          <template v-if="(record.status === 1 || record.status === 3)">
            <a-divider type="vertical" />
            <a type="primary" @click="uploadFaceAction(record)">上传人脸</a>
          </template>
          <template v-if="!(record.status == 1 || record.status == 3)">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('ruzhi',record)">入职</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="doAction('del',record)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </div>
      </a-table>
    </div>

    <AddForm ref="addForm" @finish="searchAction()" />
    <InterviewInvitation ref="interviewInvitation" @finish="searchAction()" />
    <DoEntry ref="doEntry" @finish="searchAction()" />
    <UploadResume ref="uploadResume" @finish="searchAction()" />
    <!-- <CameraForm ref="camera" @finish="searchAction()" /> -->
    <UploadFace ref="uploadFace" @finish="searchAction()" />
  </div>
</template>

<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
} from '@/api/systemSetting'
import { getReserveList, deleteReserve, reserveImportExcel } from '@/api/reserveApi'
import AddForm from './module/AddForm'
import InterviewInvitation from './module/InterviewInvitation'
import DoEntry from './module/DoEntry'
import systemConfig from '@/config/defaultSettings'
import UploadResume from './module/UploadResume'
//import CameraForm from './module/Camera'
import UploadFace from './module/UploadFace'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    align: 'center',
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
    scopedSlots: { customRender: 'sex' },
  },
  {
    align: 'center',
    title: '应试岗位',
    key: 'stationName',
    dataIndex: 'stationName',
    scopedSlots: { customRender: 'stationName' },
  },
  {
    align: 'center',
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    align: 'center',
    title: '邮箱',
    key: 'email',
    dataIndex: 'email',
  },
  {
    align: 'center',
    title: '文化程度',
    key: 'education',
    dataIndex: 'education',
    scopedSlots: { customRender: 'education' },
  },
  {
    align: 'center',
    title: '专业',
    key: 'major',
    dataIndex: 'major',
  },
  {
    align: 'center',
    title: '是否邀请面试',
    key: 'isInterviewed',
    dataIndex: 'isInterviewed',
    scopedSlots: { customRender: 'isInterviewed' },
  },
  {
    align: 'center',
    title: '是否采集人脸',
    key: 'faceStatus',
    dataIndex: 'faceStatus',
    scopedSlots: { customRender: 'faceStatus' },
  },
  {
    align: 'center',
    title: '员工状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '创建时间',
    key: 'createdTime',
    dataIndex: 'createdTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'ReserveList',
  components: {
    AddForm: AddForm, //新增人员储备
    InterviewInvitation: InterviewInvitation, //邀请面试
    DoEntry: DoEntry, //入职以及查看
    UploadResume,
    UploadFace,
    //CameraForm
  },
  data() {
    return {
      userName: undefined,
      depId: undefined,
      stationId: undefined,
      phoneNumber: undefined,
      userStatus: undefined,
      isInterviewed: undefined,
      columns: columns,
      dataSource: [],
      depSelectDataSource: [],
      postSelectDataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
      //上传文件
      uploading: false,
      aceptFileTypes: [
        '.xls',
        '.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ],
    }
  },
  computed: {
    searchParam() {
      return {
        departmentId: this.depId,
        stationId: this.stationId,
        name: this.userName,
        phone: this.phoneNumber,
        status: this.userStatus,
        isInterviewed: this.isInterviewed,
      }
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'personnel-reserve') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      //let that = this

      let that = this
      //depSelectDataSource
      departmentList().then((res) => {
        that.depSelectDataSource = res.data
      })
      this.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      getReserveList(_searchParam)
        .then((res) => {
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
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({ current: pagination.current })
    },
    doAction(actionType, record) {
      let that = this
      if (actionType === 'add') {
        this.$refs.addForm.query(actionType, null)
      } else if (actionType === 'interviewed') {
        //面试邀请
        //邀请过了，忽略
        // if(record.isInterviewed === 1) {
        //   this.$message.info('已经邀请过该人员面试了')
        //   return
        // }
        this.$refs.interviewInvitation.query(record)
      } else if (actionType === 'view' || actionType === 'edit') {
        let isDoEntryBefore = record.status === 0 ? true : false
        if (isDoEntryBefore) {
          console.log('addForm query called...', actionType, record)
          this.$refs.addForm.query(actionType, record)
        } else {
          this.$refs.doEntry.query(actionType, record)
        }
      } else if (actionType === 'ruzhi') {
        this.$refs.doEntry.query(actionType, record)
      } else if (actionType === 'upload') {
        //上传简历
        //参考D:\wdf-bean-workspace\wonderfulcloud_new\src\views\production\retrospect\ProcessList.vue
        this.$refs.uploadResume.showForm(record)
      } else if (actionType === 'del') {
        console.log(record)
        deleteReserve({ reserveId: record.id }).then((res) => {
          that.$message.info(res.msg)
          that.searchAction()
        })
      } else {
        this.$message.info('功能尚未实现！')
      }
    },
    downloadAction() {
      //this.$message.info('功能尚未实现！')
      window.location.href = systemConfig.baseURL + '/reserve/exportExcel'
    },
    getUserStatusTxt(type) {
      //请选择员工状态
      let map = {
        0: '浏览',
        1: '试用期',
        2: '试用期不通过',
        3: '在职',
        4: '离职',
      }
      try {
        return map[type]
      } catch (err) {
        return map['0']
      }
    },
    getInterviewedTxt(type) {
      //请选择是否邀请面试
      let map = {
        0: '否',
        1: '是',
      }
      try {
        return map[type]
      } catch (err) {
        return map['0']
      }
    },
    openCamera() {
      let isSupportCamera =
        (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ||
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
      if (isSupportCamera) {
        this.$refs.camera.query()
      } else {
        this.$message.info('您的浏览器暂不支持摄像功能')
      }
    },
    uploadFaceAction(record) {
      this.$refs.uploadFace.query(record)
    },
    beforeUpload(file) {
      let _aceptFileTypes = this.aceptFileTypes
      const isDocType = _aceptFileTypes.includes(file.type)
      if (!isDocType) {
        this.$message.error('只支持上传.xls,.xlsx的Excel!')
      }
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('Excel文档必须小于10M!')
      }
      if (isDocType && isLt10M) {
        this.fileList = [file]
        this.handleUpload()
      }
      return false
    },
    handleUpload() {
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('file', file)
      })
      this.uploading = true
      reserveImportExcel(formData)
        .then((res) => {
          this.uploading = false
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

              that.$message.error('您提交的信息存在重复数据，请查看下载的 error.xlsx 文件！')
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
                  that.$message.info(_res.msg || '操作成功')
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
        })
        .catch((err) => {
          this.uploading = false
          console.log(err)
        })
    },
    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      return getStationList({ id: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
      })
    },
  },
}
</script>

<style scoped>
.reserve-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.reserve-list-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}
.main-wrapper {
  margin-top: 20px;
}

.upload-wrapper {
  display: inline-block;
}
.upload-wrapper >>> .ant-upload-list {
  display: none;
}
</style>
