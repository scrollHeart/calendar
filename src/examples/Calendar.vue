<template>
    <div class="demo-wrap">
        <h2>日历</h2>
        <h3>一、基础使用</h3>
        <h4>选择指定年月</h4>
        <d-calendar></d-calendar>
        <h4>邻近月份切换</h4>
        <prev-next-calendar></prev-next-calendar>
        <h4>12月份平铺</h4>
        <month-calendar></month-calendar>
        <h3>二、插槽使用</h3>
        <slot-calendar></slot-calendar>
    </div>
</template>
<script>
import DCalendar from '@/components/calendar/index.vue'
import PrevNextCalendar from '@/components/calendarPrevNext/index.vue'
import monthCalendar from '@/components/calendarMonth/index.vue'
import slotCalendar from '@/components/calendarSlot/index.vue'
export default ({
    name: 'DemoCalendar',
    components: {
        DCalendar,
        PrevNextCalendar,
        monthCalendar,
        slotCalendar
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
<style lang="less">
@import '../styles/calendar.less';
</style>
