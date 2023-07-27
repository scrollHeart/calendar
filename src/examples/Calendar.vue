<template>
    <div class="demo-wrap">
        <h2>日历</h2>
        <h3>基础使用</h3>
        <h4>选择指定年月</h4>
        <d-calendar></d-calendar>
        <h4>邻近月份切换</h4>
        <prev-next-calendar></prev-next-calendar>
        <h4>12月份平铺</h4>
        <month-calendar></month-calendar>
    </div>
</template>
<script>
import DCalendar from '@/components/calendar/index.vue'
import PrevNextCalendar from '@/components/calendarPrevNext/index.vue'
import monthCalendar from '@/components/calendarMonth/index.vue'
export default ({
    name: 'DemoCalendar',
    components: {
        DCalendar,
        PrevNextCalendar,
        monthCalendar
    },
    data() {
        return {
            schedulingDateIsDisabled: false,
            selectedDay: ''
        }
    },
})
</script>
<style lang="less" scoped>
.demo-wrap {
    width: 500px;
    margin: 0 auto;
}
</style>
