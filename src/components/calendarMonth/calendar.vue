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
                    />
                    <span
                        :class="{
                            'calendar-picker-arrow-down': arrowDown,
                            'calendar-picker-arrow-up': !arrowDown}" @click="toggleArrowHandle"
                    ></span>
                </div>
                <div class="calendar-title-right">
                    <slot name="calendar-config-info"></slot>
                </div>
            </div>
        </div>
        <div class="calendar-button-group">
            <el-button-group>
                <el-button
                    v-for="(item,index) in validTypes"
                    :key="index"
                    :class="{
                        'calendar-button-active': curIndex === index,
                        'calendar-gray-font': curIndex > index && valueYear === `${(new Date()).getFullYear()}`}"
                    type="plain"
                    size="mini"
                    @click="selectDate(item, index)"
                >
                    <!-- <mark
                        :class="{
                            'calendar-color-gray': configMonthData[index] === '0',
                            'calendar-color-green': configMonthData[index] === '1'}"
                    ></mark> -->
                    {{ item }}月
                </el-button>
            </el-button-group>
        </div>
        <div class="calendar-main-wrap">
            <div class="calendar-content-wrap">
                <!-- <div class="calendar-operate-box">
                    <span
                        v-if="configBtnObj['editShow']" class="calendar-default-btn"
                        :class="{'calendar-cant-event': isAbledClick}"
                        @click="editClickHandle"
                    >编辑</span>
                    <span
                        v-if="configBtnObj['canceShow']" class="calendar-default-btn"
                        @click="canceClickHandle"
                    >取消</span>
                    <span
                        v-if="configBtnObj['saveShow']" class="calendar-hlight-btn"
                        @click="saveClickHandle"
                    >保存</span>
                </div> -->
                <div class="calendar-body-box">
                    <date-table
                        :date="date"
                        :selected-day="realSelectedDay"
                        :first-day-of-week="realFirstDayOfWeek"
                        @pick="pickDay"
                    />
                </div>
            </div>
            <div class="calendar-slot-box">
                <slot name="calendar-default-info"></slot>
            </div>
        </div>
    </div>
</template>
<script>
import moment from 'moment';
import DateTable from './dateTable.vue';
const validTypes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export default {
    name: 'calendarCom',
    props: {
        configMonthData: {
            type: Array,
            default: function () {
                return [];
            },
        },
    },
    components: {
        DateTable,
    },
    provide() {
        return {
            customCalendar: this,
        };
    },

    methods: {
        toggleArrowHandle() {
            if (!document.querySelector('.calendar-date-picker-panel')
                || document.querySelector('.calendar-date-picker-panel').style.display === 'none') {
                this.$refs.calendarDatePicker.focus();
            }
            else {
                this.$refs.calendarDatePicker.blur();
            }
        },
        pickDay(day, isCurMonth) {
            // 点击编辑按钮后，可操作日历配置, 未切换到其他月份
            // if (!this.configBtnObj.editClicked && isCurMonth === undefined) {
            //     this.$message({message: '请先点击编辑按钮！', customClass: 'scheduling-default-custom-msg'});
            //     return;
            // }
            this.realSelectedDay = day;
        },
        changeYear(val) {
            if (val !== `${(new Date()).getFullYear()}`) {
                this.$emit('change-board', val);
                this.selectDate('1', 0);
            }
            else {
                this.curMonth = moment().format('MM');
                this.$emit('change-board', val);
                this.selectDate(`${Number(this.curMonth)}`, Number(this.curMonth) - 1);
            }
            this.changeYearBool = true;
        },
        focusYear() {
            // 编辑状态，提示保存
            if (this.configBtnObj.editClicked) {
                this.disabledYear = true;
                // this.$message({message: '请先保存当前配置内容！', customClass: 'scheduling-default-custom-msg'});
                return;
            }
            this.arrowDown = false;
        },
        blurYear() {
            this.arrowDown = true;
        },
        selectDate(type, index) {
            // 编辑状态，提示保存
            // if (this.configBtnObj.editClicked) {
            //     this.$message({message: '请先保存当前配置内容！', customClass: 'scheduling-default-custom-msg'});
            //     return;
            // }

            if (validTypes.indexOf(type) === -1) {
                throw new Error(`invalid type ${type}`);
            }
            this.curMonth = Number(type) < 10 ? `0${type}` : type;
            let day = `${this.valueYear}-${this.curMonth}-01`;
            let endDay = moment(day).endOf('month').format('YYYY-MM-DD');
            this.pickDay(day, this.curIndex === index);
            this.curIndex = index;
            this.$emit('query-data', day, endDay);
        },
        // editClickHandle() {
        //     this.configBtnObj.editClicked = true;
        //     // 编辑按钮点击后，保存按钮显示，取消按钮显示，编辑按钮隐藏
        //     this.configBtnObj.editShow = false;
        //     this.configBtnObj.saveShow = true;
        //     this.configBtnObj.canceShow = true;
        //     this.$emit('toggle-show', true);
        // },
        // canceClickHandle() {
        //     this.disabledYear = false;
        //     this.configBtnObj.canceClicked = true;
        //     this.configBtnObj.editClicked = false;
        //     // 取消按钮点击后，保存按钮隐藏，取消按钮隐藏，编辑按钮显示
        //     this.configBtnObj.editShow = true;
        //     this.configBtnObj.saveShow = false;
        //     this.configBtnObj.canceShow = false;
        //     this.$emit('toggle-show', false);
        //     let start_date = this.valueYear + '-' + this.curMonth + '-01';
        //     let end_date = moment(start_date).endOf('month').format('YYYY-MM-DD');
        //     this.$emit('query-data', start_date, end_date);
        // },
        // saveClickHandle() {
        //     this.disabledYear = false;
        //     this.configBtnObj.saveClicked = true;
        //     this.configBtnObj.editClicked = false;
        //     // 保存按钮点击后，保存按钮隐藏，取消按钮隐藏，编辑按钮显示
        //     this.configBtnObj.editShow = true;
        //     this.configBtnObj.saveShow = false;
        //     this.configBtnObj.canceShow = false;
        //     this.$emit('toggle-show', false);
        //     // 保存按钮点击后，保存当前配置
        //     let start_date = this.valueYear + '-' + this.curMonth + '-01';
        //     let end_date = moment(start_date).endOf('month').format('YYYY-MM-DD');
        //     this.$emit('save', start_date, end_date);
        // },
        toDate(val) {
            if (!val) {
                throw new Error('invalid val');
            }
            return val instanceof Date ? val : new Date(val);
        },
    },

    computed: {
        realSelectedDay: {
            get() {
                if (!this.value) {
                    return this.selectedDay;
                }
                return moment().format('YYYY-MM-DD');
            },
            set(val) {
                this.selectedDay = val;
                const date = new Date(val);
                this.$emit('input', date);
            },
        },

        date() {
            if (!this.value) {
                if (this.realSelectedDay) {
                    const d = this.selectedDay.split('-');
                    return new Date(d[0], d[1] - 1, d[2]);
                }
                return this.now;
            }
            return this.toDate(this.value);

        },
        realFirstDayOfWeek() {
            if (this.firstDayOfWeek < 1 || this.firstDayOfWeek > 6) {
                return 0;
            }
            return Math.floor(this.firstDayOfWeek);
        },
        isAbledClick() {
            return (this.valueYear === `${(new Date()).getFullYear()}`
                && Number(moment().format('MM')) > Number(this.curMonth));
        },
    },
    data() {
        return {
            firstDayOfWeek: 1,
            selectedDay: '',
            now: new Date(),
            valueYear: `${(new Date()).getFullYear()}`,
            forbiddenTime: {
                disabledDate(time) {
                    let curTime = new Date();
                    let later10 = curTime.setFullYear(curTime.getFullYear() + 10);
                    return (time.getTime() < Date.now() - 8.64e7) || (time.getTime() > later10);
                },
            },
            curMonth: moment().format('MM'),
            validTypes,
            curIndex: Number(moment().format('MM')) - 1,
            configBtnObj: {
                'editShow': true,
                'editClicked': false,
                'saveShow': false,
                'saveClicked': false,
                'cancelShow': false,
                'cancelClicked': false,
            },
            changeYearBool: false,
            disabledYear: false,
            arrowDown: true,
        };
    },
};
</script>
<style lang="less" scoped>
@import '../../styles/calendarMonth.less';
</style>

