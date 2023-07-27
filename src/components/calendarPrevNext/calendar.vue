<template>
  <div class="calendar-wrap">
    <div class="calendar-header">
      <div class="calendar-title">
        <div class="calendar-title-month-picker">
          <el-date-picker
            ref="calendarDatePicker"
            v-model="valueYearMonth"
            type="month"
            placeholder="选择年月"
            :picker-options="forbiddenTime"
            @change="changeYearMonth"
            @focus="focusYearMonth"
            @blur="blurYearMonth"
            >
          </el-date-picker>
          <span :class="{'calendar-picker-arrow-down': arrowDown, 'calendar-picker-arrow-up': !arrowDown}" @click="toggleArrowHandle"></span>
        </div>
        <div class="calendar-title-month-btn">
            <el-button
              class="prev" size="small"
              :disabled="disabledMonth"
              @click="selectDate('prev-month')">上个月</el-button>
            <el-button class="today" size="small" @click="selectDate('today')">今天</el-button>
            <el-button class="next" size="small" @click="selectDate('next-month')">下个月</el-button>
        </div>
      </div>
    </div>
    <div class="calendar-main-wrap">
      <div class="calendar-content-wrap">
        <div class="calendar-body-box">
          <date-table
            :date="date"
            :selected-day="realSelectedDay"
            :first-day-of-week="realFirstDayOfWeek"
            @pick="pickDay" />
        </div>
      </div>
      <div class="calendar-slot-box">
        <slot name="calendar-default-info"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import DateTable from './dateTable.vue';
import {format} from '../../utils/date';
const validTypes = ['prev-month', 'today', 'next-month'];

export default {
  name: 'calendarCom',
  props: {
    value: [Date, String, Number],
    range: {
      type: Array,
      validator(range) {
        if (Array.isArray(range)) {
          return range.length === 2 && range.every(
            item => typeof item === 'string' ||
            typeof item === 'number' ||
            item instanceof Date);
        } else {
          return true;
        }
      }
    },
    firstDayOfWeek: {
      type: Number,
      default: 1
    },
  },
  components: {
    DateTable,
  },
  provide() {
    return {
      customCalendar: this
    };
  },

  methods: {
    toggleArrowHandle() {
      if (!document.querySelector('.calendar-date-picker-panel') || document.querySelector('.calendar-date-picker-panel').style.display === 'none') {
        this.$refs.calendarDatePicker.focus();
      }
      else {
        this.$refs.calendarDatePicker.blur();
      }
    },
    pickDay(day) {
      this.realSelectedDay = day;
    },
    selectDate(type, date) {
      let day = '';
      if (validTypes.indexOf(type) === -1) {
        day = date;
        console.log(day, 'valueYearMonth')
      } else {
        if (type === 'prev-month') {
          day = `${this.prevMonthDatePrefix}-01`;
        } else if (type === 'next-month') {
          day = `${this.nextMonthDatePrefix}-01`;
        } else if (type === 'today') {
          day = this.$moment().format('YYYY-MM-DD');
          this.$emit('select-today',day)
        }
        let lastNum = day.lastIndexOf('-');
        let monthStr = day.slice(0, lastNum);
        this.valueYearMonth = monthStr;
      }
      if (day.slice(0,day.lastIndexOf('-')) === `${this.$moment().format('YYYY')}-01`) {
        this.disabledMonth = true;
      }
      else {
        this.disabledMonth = false;
      }
      if (day === this.formatedDate) return;
      this.pickDay(day);
    },
    toDate(val) {
      if (!val) {
        throw new Error('invalid val');
      }
      return val instanceof Date ? val : new Date(val);
    },
    changeYearMonth(val) {
      let date = this.$moment(val).format('YYYY-MM-DD');
      this.selectDate(undefined,date)
    },
    focusYearMonth() {
      this.arrowDown = false;
    },
    blurYearMonth() {
      this.arrowDown = true;
    },
  },

  computed: {
    prevMonthDatePrefix() {
      const temp = new Date(this.date.getTime());
      temp.setDate(0);
      return format(temp, 'yyyy-MM');
    },

    curMonthDatePrefix() {
      return format(this.date, 'yyyy-MM');
    },

    nextMonthDatePrefix() {
      const temp = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
      return format(temp, 'yyyy-MM');
    },

    formatedDate() {
      return format(this.date, 'yyyy-MM-dd');
    },
    realSelectedDay: {
      get() {
        if (!this.value) return this.selectedDay;
        return this.$moment().format('YYYY-MM-DD');
      },
      set(val) {
        this.selectedDay = val;
        const date = new Date(val);
        this.$emit('input', date);
      }
    },

    date() {
      if (!this.value) {
        if (this.realSelectedDay) {
          const d = this.selectedDay.split('-');
          return new Date(d[0], d[1] - 1, d[2]);
        }
        return this.now;
      } else {
        return this.toDate(this.value);
      }
    },
    realFirstDayOfWeek() {
      if (this.firstDayOfWeek < 1 || this.firstDayOfWeek > 6) {
        return 0;
      }
      return Math.floor(this.firstDayOfWeek);
    },
  },
  data() {
    return {
        selectedDay: '',
        now: new Date(),
        valueYearMonth: this.$moment().format('yyyy-MM'),
        forbiddenTime: {
            disabledDate(time) {
                return time.getTime() < Date.now() - 8.64e7;
            },
        },
        curMonth: this.$moment().format('MM'),
        validTypes,
        arrowDown: true,
        valueMonth: (new Date()).getMonth(),
        disabledMonth: false,
    };
  },
};
</script>
<style lang="less">
@import '../../styles/calendar.less';
</style>

