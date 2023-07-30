<template>
      <div class="scheduling-config-wrap" style="width: 500px;">
      <calendar-com
        ref="calendarCom"
        @toggle-show="schedulingToggleShow"
        @change-board="schedulingChangeBoard"
        @select-today="selectToday"
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
    selectToday(day) {
      this.selectedDay = day;
      console.log('今天是：', day);
    }
  }
}
</script>
