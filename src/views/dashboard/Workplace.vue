
<template>
  <page-view :avatar="avatar" :title="false">
    <div slot="headerContent">
      <div class="title">
        {{ timeFix }}，{{ nickname }}
        <!-- <span class="welcome-text">，{{ welcome }}</span> -->
      </div>
      <div>{{jobInfo}}</div>
    </div>
    <div slot="extra">
      <!-- <span class="welcome-text">{{ welcome }}</span> -->
      <!-- <a-row class="more-info">
        <a-col :span="8">
          <head-info title="项目数" content="56" :center="false" :bordered="false"/>
        </a-col>
        <a-col :span="8">
          <head-info title="团队排名" content="8/24" :center="false" :bordered="false"/>
        </a-col>
        <a-col :span="8">
          <head-info title="项目访问" content="2,223" :center="false" />
        </a-col>
      </a-row> -->
    </div>

    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <div style="margin-bottom: 24px;">
            <img src="@/assets/main_page_banner.png" style="width:100%;height:auto;overflow:hidden;" alt="" />
          </div>
          <a-card
            class="project-list"
            :loading="loading"
            style="margin-bottom: 24px;"
            :bordered="false"
            title="个人出勤"
            :body-style="{ padding: 0 }">
            <a slot="extra">
              <a-month-picker placeholder="选择月份" style="width:200px;" :defaultValue="moment()"  @change="(m,str) => statiticsMonthDate = str" />
            </a>
            <AttendanceList :statiticsMonthDate="statiticsMonthDate"/>
          </a-card>

          <a-card
              style="width:100%;margin-bottom: 24px;" 
              :bordered="false"
              :tab-list="tabListSysInfo"
              :active-tab-key="sysInfoBarKey"
              @tabChange="key => onTabChange(key, 'sysInfoBarKey')"
            >
              <PushMsgList :msgType="sysInfoBarKey"/>
            </a-card>
        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24">
          <a-card title="快速开始 / 便捷导航" style="margin-bottom: 24px" :bordered="false" >
            <FastPathView />
          </a-card>
          <a-card title="公告通知" style="margin-bottom: 24px" :loading="radarLoading" :bordered="false" >
            <a slot="extra" @click="() => $router.push({ name: 'human_Resources_notice' }) ">更多</a>
            <div class="notice-wrapper">
              <div class="notice-render-item" v-for="item in NoticeList" :key="item.id">
                <div class="notice-render-item_bd">
                  <a href="javascript:void(0);" @click="doAction('noticeView',item)">{{item.title}}</a>
                </div>
                <div class="notice-render-item_fd">{{item.createdTime}}</div>
              </div>
            </div>
            <NoticeView ref="noticeView"/>
          </a-card>
           <a-card
              style="width:100%;margin-bottom: 24px;" 
              :bordered="false"
              :tab-list="tabListCommonBar"
              :active-tab-key="commonBarKey"
              @tabChange="key => onTabChange(key, 'commonBarKey')"
            >
              <div v-if="commonBarKey === 'contacts'">
                <AddressBook :userName="userName"/>
              </div>
              <div v-else-if="commonBarKey === 'form'">
                <CommonFiles />
              </div>
              <div slot="tabBarExtraContent" >
                <a-input-search v-if="commonBarKey === 'contacts'" placeholder="请输入姓名" style="width: 200px" @search="onSearch" />
              </div>
            </a-card>
            <a-card title="日历信息" style="margin-bottom: 24px" :loading="radarLoading" :bordered="false" :body-style="{ padding: 0 }">
              <WanNianLi style="margin-top:1px;" />
            </a-card>
        </a-col>
      </a-row>
    </div>
  </page-view>
</template>

<script>
import { mapGetters } from 'vuex'
import { welcome ,timeFix} from '@/utils/util'
import { PageView } from '@/layouts'
import HeadInfo from '@/components/tools/HeadInfo'
import { Radar } from '@/components'

import { getRoleList, getServiceList } from '@/api/manage'

import WanNianLi from '@/components/CustomerList/WanNianLi/Index'

import { NoticeList} from '@/api/humanResources' //公告通知
import AttendanceList from './module/AttendanceList' //个人考勤
import AddressBook from './module/AddressBook' //通讯录
import PushMsgList from './module/PushMsgList' //消息
import FastPathView from './module/FastPathView' //快速通道
import NoticeView from './module/NoticeView' //公告详情
import CommonFiles from './module/CommonFiles' //常用文件下载


import moment from 'moment'
export default {
  name: 'Workplace',
  components: {
    PageView,
    HeadInfo,
    Radar,
    WanNianLi,
    AttendanceList,
    AddressBook,
    PushMsgList,
    FastPathView,
    NoticeView,
    CommonFiles
  },
  data () {
    return {
      loading: false,
      radarLoading: false,
      welcome:welcome(),
      timeFix:timeFix(),
      commonBarKey:'contacts',
      tabListCommonBar:[
        {
          key:'contacts',
          tab:'通讯录'
        },
        {
          key:'form',
          tab:'常用表格'
        }
      ],
      sysInfoBarKey:'1',
      tabListSysInfo:[
        {
          key:'1',
          tab:'系统消息'
        },
        {
          key:'2',
          tab:'待办事项'
        },
        {
          key:'5',
          tab:'已办事项'
        }
      ],

      NoticeList:[],
      statiticsMonthDate:undefined,
      userName:undefined
    }
  },
  computed: {
    ...mapGetters(['userInfo','avatar','nickname','roles']),
    jobInfo(){
      let username = this.userInfo.trueName || this.userInfo.userName
      let departmentName = this.userInfo.departmentName || '无'
      let stationName = this.userInfo.stationName || '无'
      return `${username} | ${departmentName} - ${stationName}` 
    }
  },
  created () {
    if(this.roles.length <= 0){
      this.$warning({
        title: '警告',
        content: '您的账号现在没有权限使用该系统，请联系管理员设置权限。',
      });
      return
    }
  },
  mounted () {
    this.fetchNoticeTop4()
  },
  methods: {
    moment,
    fetchNoticeTop4(){
      let that = this
      NoticeList({current:1,size:4})
        .then((res) => {
          that.NoticeList = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
        })
    },
    onTabChange(key, type) {
      console.log(key, type);
      this[type] = key;
    },
    onSearch(value) {
      this.userName = value || undefined
      console.log(value);
    },
    monthPickerChange(m,str){
      console.log(arguments)
    },
    doAction(type,record){
      if(type === 'noticeView'){
        this.$refs.noticeView.query(record)
        return
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .notice-wrapper {
    
    .notice-render-item{
      display: flex;
      line-height: 40px;
      .notice-render-item_bd{
        flex: 1;
        margin-right: 20px;
        word-break: break-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }


</style>
