<template>
    <div>
        <calendar-com
            ref="calendarCom"
            :config-month-data="configMonthData"
        >
            <!-- <template
                slot="dateCell"
                slot-scope="{date, data}"
            >
                <div
                    :class="data.isSelected ? 'is-selected' : ''"
                    class="scheduling-cell-box"
                    @click="schedulingToggleClick(date, data)"
                >
                    <div
                        class="scheduling-bg-box"
                    >
                        <div
                            v-if="data.isSelected && !queryBool"
                            :class="{
                                'scheduling-work-style':
                                    schedulingCurTxt === 'is_extra_workday'
                                    && (this.$moment(data.day).format('d') === '0'
                                        || this.$moment(data.day).format('d') === '6'),
                                'scheduling-no-work':
                                    schedulingCurTxt === 'is_holiday'
                                    && this.$moment(data.day).format('d') !== '0'
                                    && this.$moment(data.day).format('d') !== '6'}"
                        >
                            {{ Number(data.day.split('-').slice(2).join('-')) }}
                        </div>
                        <div
                            v-else
                            :class="{
                                'scheduling-work-style':
                                    schedulingObj[data.day] === 'is_extra_workday'
                                    && (this.$moment(data.day).format('d') === '0'
                                        || this.$moment(data.day).format('d') === '6'),
                                'scheduling-no-work':
                                    schedulingObj[data.day] === 'is_holiday'
                                    && this.$moment(data.day).format('d') !== '0'
                                    && this.$moment(data.day).format('d') !== '6'}"
                        >
                            {{ Number(data.day.split('-').slice(2).join('-')) }}
                        </div>
                    </div>
                </div>
            </template> -->
        </calendar-com>
    </div>
</template>
<script>
import calendarCom from './calendar.vue';
export default {
    components: {
        calendarCom,
    },
    data() {
        return {
            configMonthData: [],
            schedulingObj: {},
            schedulingCurTxt: '',
        };
    },
    methods: {
        schedulingToggleClick(date, data) {
            if (this.$refs.calendarCom && this.$refs.calendarCom.configBtnObj.editClicked) {
                this.queryBool = false;
            }
            if (!this.schedulingDateIsDisabled) {
                return;
            }
            let week = this.$moment(data.day).format('d');
            if (week === '0' || week === '6') {
                if (this.schedulingObj[data.day] && this.schedulingObj[data.day] !== 'is_holiday') {
                    this.schedulingObj[data.day] = 'is_holiday';
                }
                else {
                    this.schedulingObj[data.day] = 'is_extra_workday';
                }
            }
            else {
                if (this.schedulingObj[data.day] && this.schedulingObj[data.day] !== 'is_extra_workday') {
                    this.schedulingObj[data.day] = 'is_extra_workday';
                }
                else {
                    this.schedulingObj[data.day] = 'is_holiday';
                }
            }
            this.schedulingCurTxt = this.schedulingObj[data.day];
            if (!this.updateSchedulingObj[data.day]) {
                this.updateSchedulingObj[data.day] = this.schedulingObj[data.day];
            }
            else {
                delete this.updateSchedulingObj[data.day];
            }
        },
    }
}
</script>