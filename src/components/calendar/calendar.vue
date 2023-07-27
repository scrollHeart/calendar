<template>
  <div class="calendar-wrap">
    <div class="calendar-header">
      <div class="calendar-title">
        <div class="calendar-title-year">
            <el-date-picker
              ref="calendarDatePicker"
              v-model="valueYear"
              type="year"
              :picker-options="forbiddenTime"
              :disabled="disabledYear"
              popper-class="calendar-date-picker-panel"
              value-format="yyyy"
              @change="changeYear"
              @focus="focusYear"
              @blur="blurYear"
            >
            </el-date-picker>年
            <span :class="{'calendar-picker-arrow-down': arrowDown, 'calendar-picker-arrow-up': !arrowDown}" @click="toggleArrowHandle"></span>
        </div>
        <div class="calendar-title-month">
            <el-select v-model="valueMonth" @change="changeMonth">
              <el-option
                v-for="item in optionsMonth"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
              </el-option>
            </el-select>
            <span>月</span>
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
const validTypes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
    changeYear(val) {
      let curMonth = this.valueMonth < 9 ? `0${this.valueMonth + 1}` : `${this.valueMonth + 1}`;
      this.$emit('change-board', `${curMonth}-01`);
      this.selectDate(`${this.valueMonth + 1}`, this.valueMonth);
      this.changeYearBool = true;
    },
    focusYear() {
      this.arrowDown = false;
    },
    blurYear() {
      this.arrowDown = true;
    },
    selectDate(type, index) {
      if (validTypes.indexOf(type) === -1) {
        throw new Error(`invalid type ${type}`);
      }
      let day = `${this[`monthDatePrefix${type}`]}-01`;
      this.pickDay(day, this.curIndex === index);
      if (this.curIndex !== index) {
        // 切换到其他月份
        this.$emit('change-board', day.slice(0, day.lastIndexOf('-')));
      }
      this.curIndex = index;
      this.curMonth = type;
    },
    toDate(val) {
      if (!val) {
        throw new Error('invalid val');
      }
      return val instanceof Date ? val : new Date(val);
    },
    changeMonth() {
      let curMonth = this.valueMonth < 9 ? `0${this.valueMonth + 1}` : `${this.valueMonth + 1}`;
      this.$emit('change-board', `${curMonth}-01`);
      this.selectDate(`${this.valueMonth + 1}`, this.valueMonth);
    }
  },

  computed: {
    monthDatePrefix1() {
      return `${this.valueYear}-01`;
    },
    monthDatePrefix2() {
      return `${this.valueYear}-02`;
    },
    monthDatePrefix3() {
      return `${this.valueYear}-03`;
    },
    monthDatePrefix4() {
      return `${this.valueYear}-04`;
    },
    monthDatePrefix5() {
      return `${this.valueYear}-05`;
    },
    monthDatePrefix6() {
      return `${this.valueYear}-06`;
    },
    monthDatePrefix7() {
      return `${this.valueYear}-07`;
    },
    monthDatePrefix8() {
      return `${this.valueYear}-08`;
    },
    monthDatePrefix9() {
      return `${this.valueYear}-09`;
    },
    monthDatePrefix10() {
      return `${this.valueYear}-10`;
    },
    monthDatePrefix11() {
      return `${this.valueYear}-11`;
    },
    monthDatePrefix12() {
      return `${this.valueYear}-12`;
    },
    isDisabledMonthBtnArr() {
        let arr = validTypes.map((item) => {
            if (this.valueYear === `${(new Date()).getFullYear()}`) {
                if (Number(item) < Number(this.curMonth)) {
                    return true;
                }
                return false;
            } else {
                return false;
            }
        });
        return arr;
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
    isAbledClick() {
      return (this.valueYear === `${(new Date()).getFullYear()}` && Number(this.$moment().format('MM')) > Number(this.curMonth))
    }
  },
  data() {
    return {
        selectedDay: '',
        now: new Date(),
        valueYear: `${(new Date()).getFullYear()}`,
        forbiddenTime: {
            disabledDate(time) {
                return time.getTime() < Date.now() - 8.64e7;
            },
        },
        curMonth: this.$moment().format('MM'),
        validTypes,
        configMonthData: ['1', '0', '0', '0', '0', '0', '1', '1', '0', '0', '0', '0'], // '0'-未配置，'1'-已配置
        curIndex: Number(this.$moment().format('MM')) - 1,
        configBtnObj: {
          'editShow': true,
          'editClicked': false,
          'saveShow': false,
          'saveClicked': false,
          'cancelShow': false,
          'cancelClicked': false,
        },
        lastSelectedIndex: null,
        changeYearBool: false,
        disabledYear: false,
        arrowDown: true,
        valueMonth: (new Date()).getMonth(),
        optionsMonth: [
          {
            value: 0,
            label: '1'
          },
          {
            value: 1,
            label: '2'
          },
          {
            value: 2,
            label: '3'
          },
          {
            value: 3,
            label: '4'
          },
          {
            value: 4,
            label: '5'
          },
          {
            value: 5,
            label: '6'
          },
          {
            value: 6,
            label: '7'
          },
          {
            value: 7,
            label: '8'
          },
          {
            value: 8,
            label: '9'
          },
          {
            value: 9,
            label: '10'
          },
          {
            value: 10,
            label: '11'
          },
          {
            value: 11,
            label: '12'
          },
        ],
    };
  },
};
</script>
<style lang="less">
@import '../../styles/calendar.less';
</style>

