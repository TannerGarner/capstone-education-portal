<script setup>
    import { onMounted, ref } from 'vue';
    import { useEnrollmentStore } from '../stores/enrollment';
    import { useCoursesStore } from '../stores/courses.js';
    import { useUsersStore } from '../stores/users.js';
    
    const enrollmentStore = useEnrollmentStore();
    const userStore = useUsersStore();

    let userid;
    onMounted(async ()=>{ 
        if(userStore.user.is_admin){
            userid = userStore.editableUser.user_id
        } else {
            userid = userStore.user.user_id
        }
        enrollmentStore.getCoursesForUser(userid)
        console.log(enrollmentStore.coursesForUser)

    })
</script>

<template>
    <div class="container">
        <div class="header">
            <h2>My Schedule</h2>
        </div>
        <div class="schedule-container">
            <div class="schedule-header">
                <div class="time-header">Time</div>
                <div class="day-header">Monday</div>
                <div class="day-header">Tuesday</div>
                <div class="day-header">Wednesday</div>
                <div class="day-header">Thursday</div>
                <div class="day-header">Friday</div>
            </div>
            <div class="schedule-body">
                <div class="time-column">
                    <div v-for="hour in 12" :key="hour" class="time-slot">
                        <span>{{ (hour + 6) % 12 || 12 }}:00 {{ hour + 6 >= 12 ? 'PM' : 'AM' }}</span>
                    </div>
                </div>
                <div v-for="day in 5" :key="day" class="day-column">
                    <div v-for="hour in 12" :key="hour" class="schedule-cell">
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .schedule-container {
        height: 600px;
        display: flex;
        flex-direction: column;
    }

    .schedule-header {
        display: grid;
        grid-template-columns: 100px repeat(5, 1fr);
        background-color: #489FB5;
        color: white;
        position: sticky;
        top: 0;
    }

    .time-header, .day-header {
        padding: 10px;
        text-align: center;
        font-weight: bold;
        border-right: 1px solid white;
    }

    .schedule-body {
        display: grid;
        grid-template-columns: 100px repeat(5, 1fr);
        overflow: overlay;
        flex-grow: 1;
    }

    .time-column {
        position: sticky;
        left: 0;
        background-color: #f5f5f5;
        border-right: 2px solid #489FB5;
    }

    .time-slot {
        height: 100px;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        border-bottom: 1px solid #ddd;
        font-size: 0.9em;
    }

    .time-slot > span{
        padding-top: 5px;
    }

    .day-column {
        display: flex;
        flex-direction: column;
    }

    .schedule-cell {
        height: 100px;
        border-bottom: 1px solid #ddd;
        border-right: 1px solid #ddd;
        transition: background-color 0.2s;
    }

    .schedule-cell:hover {
        background-color: rgba(72, 159, 181, 0.1);
        cursor: pointer;
    }
</style>