<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="spinning" @click="handleSubmit">确定</a-button>
    </template>
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id', { initialValue: detail.id }]" />
        </a-form-item>

        <table class="custom-table custom-table-border" v-for="(item, idx) in routesList" :key="item._key">
          <caption>
            <div style="display: flex">
              <div style="flex: 1; text-align: left">行程{{ idx + 1 }}</div>
              <a-popconfirm title="确认删除该行程吗?" @confirm="() => routeAction('remove', item._key)">
                <a type="primary" href="javascript:;">删除</a>
              </a-popconfirm>
            </div>
          </caption>
          <tr>
            <td style="width: 120px">目的城市</td>
            <td>
              <a-form-item>
                <AreaCascade
                  :fill="item.endAreaId ? item.endAreaId.split(',') : []"
                  @change="
                    (...args) => {
                      areaCascadeChange('endAreaId', item._key, ...args)
                    }
                  "
                  style="width: 100%"
                />
              </a-form-item>
            </td>
            <td style="width: 120px">交通工具</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="选择交通工具"
                  :value="item.vehicleId"
                  :allowClear="true"
                  style="width: 100%"
                  @change="
                    (val) => {
                      vehicleChange('vehicleId', item._key, val)
                    }
                  "
                >
                  <a-select-option v-for="item in vehicleList" :key="item.id" :value="item.id">{{
                    item.text
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 120px">开始日期</td>
            <td>
              <a-form-item>
                <DateTimePicker
                  :fill="item.startTime"
                  @change="
                    (...args) => {
                      dateTimePickerChange('startTime', item._key, ...args)
                    }
                  "
                  style="width: 100%"
                />
              </a-form-item>
            </td>
            <td style="width: 120px">结束日期</td>
            <td>
              <a-form-item>
                <DateTimePicker
                  :fill="item.endTime"
                  @change="
                    (...args) => {
                      dateTimePickerChange('endTime', item._key, ...args)
                    }
                  "
                  style="width: 100%"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 120px">出差事由</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  style="width: 100%"
                  placeholder="出差事由"
                  :rows="2"
                  :value="item.reason"
                  @change="reasonChange('reason', item._key, $event)"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 120px">出差负责人</td>
            <td colspan="3">
              <a-form-item>
                <DepUserSelect
                  :depId="item.chargeUserDepId || userInfo.departmentId"
                  :userId="item.chargeUserId || userInfo.id"
                  @change="
                    (...args) => {
                      depUserChange('chargeUserId', item._key, ...args)
                    }
                  "
                  style="width: 100%"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 120px">出差同行人</td>
            <td colspan="3">
              <a-form-item>
                <DepUserMulSelect
                  :users="item.users"
                  @change="
                    (...args) => {
                      depUserMulChange('users', item._key, ...args)
                    }
                  "
                  style="width: 100%"
                />
              </a-form-item>
            </td>
          </tr>
          <tr v-for="(i, index) in item.users" :key="i.keys">
            <td style="width: 120px">
              {{ i.trueName }} <br />
              出发车票
            </td>
            <td colspan="3">
              <a-form-item>
                <a-upload
                  :action="uploadUrl"
                  list-type="picture-card"
                  :file-list="i.ticketUrl"
                  @preview="handlePreview"
                  @change="(...args) => handleChange(item._key, i.keys, ...args)"
                >
                  <div v-if="!i.ticketUrl || (i.ticketUrl && i.ticketUrl.length < 1)">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">上传车票</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancels">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </a-form-item>
            </td>
          </tr>
        </table>

        <a-button style="width: 100%" type="dashed" icon="plus" @click="routeAction('add')">新增行</a-button>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { getDictionaryList } from '@/api/workBox'
import { attenceTravelRouteAdd, attenceTravelApplyDetail } from '@/api/attendanceManagement'
import { getUploadPath2 } from '@/api/common'
import AreaCascade from './AreaCascade'
import DateTimePicker from './DateTimePicker'
import DepUserSelect from './DepUserSelect'
import DepUserMulSelect from './DepUserMulSelect'
import moment from 'moment'

let uuid = () => Math.random().toString(32).slice(-10)
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
export default {
  name: 'business-trip-route-add',
  components: {
    AreaCascade,
    DateTimePicker,
    DepUserSelect,
    DepUserMulSelect,
  },
  data() {
    return {
      previewVisible: false,
      previewImage: '',
      uploadUrl: getUploadPath2(),
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      actionType: 'view',
      detail: {},
      record: {},
      spinning: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人

      routesList: [], //出差行程
      vehicleList: [],
    }
  },
  computed: {
    modalTitle() {
      return '添加行程'
    },
  },
  watch: {},
  methods: {
    moment,
    //图片弹窗
    handleCancels() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange(type, key, obj) {
      let { file, fileList } = obj
      //debugger
      let _routesList = [...this.routesList]
      let target = _routesList.find((item) => item._key === type)
      let react = target.users.find((item) => item.keys === key)
      if (react) {
        react.ticketUrl = fileList
        target = [...target.users]
        this.routesList = [..._routesList]
      }
    },
    init() {
      let that = this
      let queue = []
      const detailId = []
      attenceTravelApplyDetail({ id: this.record.id }).then((res) => {
        that.spinning = false
        let data = res.data
        if (!data) {
          setTimeout(function () {
            that.visibles = false
            that.$message.info('获取信息失败。')
          }, 500)
          return
        }
        detailId = res.data.routes
      })

      let task1 = getDictionaryList({ parentId: 509 }).then((res) => {
        let react = detailId.every((item) => item.vehicle !== '公车')
        if (react) {
          this.vehicleList = res.data.filter((i) => i.text !== '公车')
        } else {
          that.vehicleList = res.data
        }
      })

      // if(){

      // }
      queue.push(task1)
      return Promise.all(queue)
    },

    async query(type, record) {
      let that = this
      ;(that.actionType = type), (that.record = Object.assign({}, record))
      that.detail = {}
      that.routesList = []
      that.form.resetFields()
      await that.init()
      that.visible = true
      that.routeAction('add')
    },
    areaCascadeChange(type, key, arrArea, arrAreaItems) {
      let that = this
      let _beginAreaName = arrAreaItems.map((item) => item.label).join('')
      if (type === 'beginAreaId') {
        this.beginAreaId = arrArea.join(',')
        that.detail = Object.assign({}, that.detail, {
          beginAreaId: arrArea.join(','),
          beginAreaName: _beginAreaName,
        })
        that.beginAreaName = _beginAreaName
        return
      }
      if (type === 'endAreaId') {
        let _routesList = [...that.routesList]
        let target = _routesList.find((item) => item._key === key)
        if (target) {
          target.endAreaId = arrArea.join(',')
          target.endAreaName = _beginAreaName
          that.routesList = [..._routesList]
        }
        return
      }
    },
    dateTimePickerChange(type, key, timeStr) {
      let _routesList = [...this.routesList]
      let target = _routesList.find((item) => item._key === key)
      if (target) {
        target[type] = timeStr
        this.routesList = [..._routesList]
      }
    },
    reasonChange(type, key, event) {
      let _routesList = [...this.routesList]
      let target = _routesList.find((item) => item._key === key)
      if (target) {
        target[type] = event.target.value
        this.routesList = [..._routesList]
      }
    },
    depUserChange(type, key, depId, userId) {
      //chargeUserId
      let _routesList = [...this.routesList]
      let target = _routesList.find((item) => item._key === key)
      if (target) {
        target[type] = userId
        this.routesList = [..._routesList]
      }
    },
    depUserMulChange(type, key, users) {
      let _routesList = [...this.routesList]
      let target = _routesList.find((item) => item._key === key)
      if (target) {
        target[type] = users.map((id) => {
          return id
        })
        this.routesList = [..._routesList]
      }
    },
    vehicleChange(type, key, val) {
      let _routesList = [...this.routesList]
      let target = _routesList.find((item) => item._key === key)
      if (target) {
        target[type] = val
        this.routesList = [..._routesList]
      }
    },
    routeAction(type, key) {
      let that = this
      if (type === 'add') {
        that.routesList.push({
          _key: uuid(),
          endAreaId: undefined,
          vehicleId: undefined,
          startTime: undefined,
          endTime: undefined,
          reason: '',
          users: [{ id: this.userInfo.id, ticketUrl: [], trueName: this.userInfo.trueName }],
        })
      } else if (type === 'remove') {
        that.routesList = that.routesList.filter((item) => item._key !== key)
      }
    },
    handleSubmit() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)

          if (that.routesList.length === 0) {
            that.$message.info('请添加行程后再提交')
            return
          }

          //values.travelId = that.record.id
          let routes = that.$_.cloneDeep(that.routesList).map((item) => {
            delete item._key
            item.travelId = that.record.id
            return item
          })
          const react = routes.every((i) => {
            return i.users.every((item) => item.ticketUrl && item.ticketUrl.length > 0)
          })
          if (react) {
            routes = routes.map((item) => {
              return {
                travelId: that.record.id,
                // ticketUrl: item.ticketUrl[0].response.data,
                chargeUserId: item.chargeUserId,
                vehicleId: item.vehicleId,
                endAreaId: item.endAreaId,
                endAreaName: item.endAreaName,
                endTime: item.endTime,
                reason: item.reason,
                startTime: item.startTime,
                users: item.users
                  ? item.users.map((u) => {
                      return {
                        ticketUrl: u.ticketUrl[0].response.data || '',
                        userId: u.id,
                      }
                    })
                  : [],
              }
            })
          } else {
            return this.$message.error('请上传车票')
          }

          that.spinning = true
          attenceTravelRouteAdd(routes)
            .then((res) => {
              if (res.code === 200) {
                that.$message.info(res.msg)
                that.spinning = false
                that.handleCancel()
                that.$emit('finish')
              } else {
                that.$message.error(res.msg)
                that.spinning = false
              }
            })
            .catch((err) => {
              // that.spinning = false
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
  },
}
</script>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}
</style>