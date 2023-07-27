<template>
        <div class="scheduling-config-wrap" style="width: 500px;">
      <calendar-com
        ref="calendarCom"
        @toggle-show="schedulingToggleShow"
        @change-board="schedulingChangeBoard"
      >
        <template
          slot="dateCell"
          slot-scope="{date, data}"
        >
        <div
          class="scheduling-bg-box"
          :class="{'selected-day-active': selectedDay === data.day}"
          @click="schedulingToggleClick(date, data)"
          >
          <div
              :class="data.isSelected ? 'is-selected' : ''"
              class="scheduling-cell-box"
          >
              {{ Number(data.day.split('-').slice(2).join('-')) }}
          </div>
        </div>
        </template>
      </calendar-com>
    </div>
</template>
<script>
import calendarCom from './calendar.vue'

export default {
  name: 'calendarIndex',
  components: {
    calendarCom
  },
  data() {
    return {
      schedulingDateIsDisabled: false,
      selectedDay: ''
    }
  },
  methods: {
    schedulingToggleClick(date, data) {
      // 高亮当前日期
        console.log(date, data)
        this.selectedDay = data.day;
    },
    schedulingToggleShow(val) {
      this.schedulingDateIsDisabled = val;
    },
    schedulingChangeBoard(val) {
      this.schedulingObj = {};
      this.schedulingCurTxt = '';
      console.log('schedulingChangeBoard', val)
    },
  }
}
</script>
<style lang="less" scoped>
.scheduling-config-wrap {
    border-radius: 4px;
    margin: 0 auto;
}
.scheduling-cell-box {
  padding-right: 28px;
  text-align: center;
  >div {
    width: 40px;
    height: 40px;
  }
}
.scheduling-default-info-box{
  width: 100%;
  height: 100%;
  background: rgb(237, 241, 246);
  padding: 16px 0 0 16px;
  box-sizing: border-box;
  text-align: left;
  .scheduling-default-title {
    color: rgb(52, 65, 86);
    margin-bottom: 12px;
    line-height: 22px;
  }
  .scheduling-default-title:nth-of-type(2){
    padding-top: 16px;
  }
  span {
    margin-bottom: 8px;
    line-height: 20px;
    font-size: 12px;
    display: block;
  }
}
.scheduling-info-box {
  font-size: 12px;
  color: rgb(230, 38, 35);
  text-align: left;
  display: block;
  padding: 0 24px;
  line-height: 22px;
}
.scheduling-hlight-btn {
  background: rgb(0, 92, 230);
  border-radius:4px;
  color: #fff;
}
.scheduling-done-btn{
  display: block;
  margin-top: 24px;
  position: relative;
  left: calc(100% - 94px);
  width: 70px;
  height: 32px;
  line-height: 32px;
  cursor: pointer;
}
.selected-day-active {
  background: #F2F8FE;
}
</style>
<style lang="less">
.cantclick {
  pointer-events: none;
  visibility: hidden;
}
.default-custom-msg {
  background: rgb(235, 242, 253);
  /* 主题色/默认色 */
  border: 1px solid rgb(0, 92, 230);
  border-radius: 4px;
  color: rgb(52, 65, 86);
  font-family: FZLanTingHeiS-R-GB;
  font-size: 14px;
  padding: 16px;
  height: 54px;
  min-width: 100px;
  .el-message__content {
    color: rgb(52, 65, 86);
    line-height: 22px;
  }
  .el-message__icon {
    margin-right: 8px;
  }
}
</style>
