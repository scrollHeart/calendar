<template>
  <div class="calendar-wrap">
    <div class="calendar-header">
      <div class="calendar-title">
        <div class="calendar-title-block">
            <span class="calendar-picker-label">选择年份</span>
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
            </el-date-picker>
            <span :class="{'calendar-picker-arrow-down': arrowDown, 'calendar-picker-arrow-up': !arrowDown}" @click="toggleArrowHandle"></span>
        </div>
      </div>
    </div>
    <div class="calendar-button-group">
      <el-button-group>
          <el-button
              v-for="(item,index) in validTypes"
              :key="index"
              :class="{'calendar-button-active' : curIndex === index, 'calendar-gray-font': curIndex > index && valueYear === `${(new Date()).getFullYear()}`}"
              type="plain"
              size="mini"
              @click="selectDate(item, index)"
          >
              <mark
                  v-if="!isDisabledMonthBtnArr[index]"
                  :class="{'calendar-color-gray' : configMonthData[index] === '0', 'calendar-color-green' : configMonthData[index] === '1'}"
              ></mark>
              {{item}}月
          </el-button>
      </el-button-group>
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
    pickDay(day, isCurMonth) {
      // 点击编辑按钮后，可操作日历配置, 未切换到其他月份
        // if (!this.configBtnObj.editClicked && isCurMonth == undefined) {
        //   this.$message({message: '请先点击编辑按钮！', customClass: 'default-custom-msg'});
        //   return;
        // }
      this.realSelectedDay = day;
    },
    changeYear(val) {
      if (val !== `${(new Date()).getFullYear()}`) {
        this.$emit('change-board', `${val}-01`);
        this.selectDate('1', 0);
      }
      else {
        this.curMonth = this.$moment().format('MM');
        this.$emit('change-board', `${this.curMonth}-01`);
        this.selectDate(`${Number(this.curMonth)}`, Number(this.curMonth) - 1);
      }
      this.changeYearBool = true;
    },
    focusYear() {
      this.arrowDown = false;
      // 编辑状态，提示保存
    //   if (this.configBtnObj.editClicked) {
    //     this.disabledYear = true;
    //     this.$message({message: '请先保存当前配置内容！', customClass: 'default-custom-msg'});
    //     return;
    //   }
    },
    blurYear() {
      this.arrowDown = true;
    },
    selectDate(type, index) {
      // 编辑状态，提示保存
    //   if (this.configBtnObj.editClicked) {
    //     this.$message({message: '请先保存当前配置内容！', customClass: 'default-custom-msg'});
    //     return;
    //   }

      if (validTypes.indexOf(type) === -1) {
        throw new Error(`invalid type ${type}`);
      }
      this.curMonth = Number(type) < 10 ? `0${type}` : type;
      let day = `${this.valueYear}-${this.curMonth}-01`;
      this.pickDay(day, this.curIndex === index);
      if (this.curIndex !== index) {
        // 切换到其他月份
        this.$emit('change-board', day.slice(0, day.lastIndexOf('-')));
      }
      this.curIndex = index;
      this.curMonth = type;
    },
    editClickHandle() {
      this.configBtnObj.editClicked = true;
      // 编辑按钮点击后，保存按钮显示，取消按钮显示，编辑按钮隐藏
    //   this.configBtnObj.editShow = false;
    //   this.configBtnObj.saveShow = true;
    //   this.configBtnObj.canceShow = true;
      this.$emit('toggle-show', true);
    },
    canceClickHandle() {
      this.disabledYear = false;
      this.configBtnObj.canceClicked = true;
      this.configBtnObj.editClicked = false;
      // 取消按钮点击后，保存按钮隐藏，取消按钮隐藏，编辑按钮显示
    //   this.configBtnObj.editShow = true;
    //   this.configBtnObj.saveShow = false;
    //   this.configBtnObj.canceShow = false;
      this.$emit('toggle-show', false);
    },
    saveClickHandle() {
      this.disabledYear = false;
      this.configBtnObj.saveClicked = true;
      this.configBtnObj.editClicked = false;
      // 保存按钮点击后，保存按钮隐藏，取消按钮隐藏，编辑按钮显示
    //   this.configBtnObj.editShow = true;
    //   this.configBtnObj.saveShow = false;
    //   this.configBtnObj.canceShow = false;
      // 保存按钮点击后，保存当前配置
      // this.configMonthData[this.curIndex] = this.realSelectedDay.split('-')[2];
      this.$emit('toggle-show', false);
      // 保存按钮点击后，保存当前配置
      // this.$emit('save', this.configMonthData);
    },
    toDate(val) {
      if (!val) {
        throw new Error('invalid val');
      }
      return val instanceof Date ? val : new Date(val);
    },

    rangeValidator(date, isStart) {
      const firstDayOfWeek = this.realFirstDayOfWeek;
      const expected = isStart ? firstDayOfWeek : (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1);
      const message = `${isStart ? 'start' : 'end'} of range should be ${weekDays[expected]}.`;
      if (date.getDay() !== expected) {
        console.warn('[ElementCalendar]', message, 'Invalid range will be ignored.');
        return false;
      }
      return true;
    }
  },

  computed: {
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
    };
  },
};
</script>


