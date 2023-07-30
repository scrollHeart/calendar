<template>
    <div>
        <calendar-com
            ref="calendarCom"
            @toggle-show="calendarToggleShow"
            @change-board="calendarChangeBoard"
        >
            <template
                slot="dateCell"
                slot-scope="{date, data}"
            >
                <div
                    :class="data.isSelected ? 'is-selected' : ''"
                    class="calendar-cell-box"
                    @click="calendarToggleClick(date, data)"
                >
                <div
                    class="calendar-bg-box"
                >
                    <div
                    v-if="!data.isSelected"
                    :class="{'calendar-work-style': calendarObj[data.day] === '工', 'calendar-no-work': calendarObj[data.day] === '非'}"
                    >
                    {{ Number(data.day.split('-').slice(2).join('-')) }}
                    </div>
                    <div
                    v-else-if="data.isSelected"
                    :class="{'calendar-work-style': calendarCurTxt === '工', 'calendar-no-work': calendarCurTxt === '非'}"
                    >
                    {{ Number(data.day.split('-').slice(2).join('-')) }}
                    </div>
                </div>
                </div>
            </template>
        </calendar-com>
    </div>
</template>
<script>
import CalendarCom from './calendar.vue'
export default {
    components: {
        CalendarCom
    },
      data() {
    return {
      calendarDialogVisible: false,
      calendarObj: {
        '2023-05-29': '非',
        '2023-05-28': '工'
      },
      calendarCurTxt: '',
      calendarDateIsDisabled: false
    }
  },
  methods: {
    showClick() {
      this.calendarDialogVisible = true;
    },
    calendarToggleClick(date, data) {
        // 有值的时候，点击的时候，清空
        if (this.calendarObj[data.day] || (this.calendarObj[data.day] && this.calendarObj[data.day] !== '')) {
          this.calendarObj[data.day] = '';
        }
        else {
          let week = this.$moment(data.day).format('d');
          if (week === '0' || week === '6') {
              this.calendarObj[data.day] = '工';
          }
          else {
              this.calendarObj[data.day] = '非';
          }
        }
        this.calendarCurTxt = this.calendarObj[data.day];
    },
    calendarToggleShow(val) {
      this.calendarDateIsDisabled = val;
    },
    calendarChangeBoard(val) {
      this.calendarObj = {};
      this.calendarCurTxt = '';
      console.log('calendarChangeBoard', val)
    },
    calendarDialogClose() {
      if (this.$refs.calendarCom.configBtnObj.editClicked) {
        this.calendarDialogVisible = true;
        // this.$message({message: '请先保存当前配置内容！', customClass: 'default-custom-msg'});
      }
      else {
        this.calendarDialogVisible = false;
        this.calendarObj = {};
        this.calendarCurTxt = '';
      }
    }
  }
}
</script>


