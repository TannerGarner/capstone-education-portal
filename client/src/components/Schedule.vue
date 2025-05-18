<script setup>
    import { onMounted, ref } from 'vue';
    import { useEnrollmentStore } from '../stores/enrollment';
    import { useCoursesStore } from '../stores/courses.js';
    import { useUsersStore } from '../stores/users.js';
    import CourseEnrollmentModal from './modals/CourseEnrollmentModal.vue';

    const enrollmentStore = useEnrollmentStore();
    const userStore = useUsersStore();
    const coursesStore = useCoursesStore();

    const enrolledByDay = ref({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: []
    });


    const enrollModalOpen = ref(false);
    const selectedCourse = ref(null);
    const userid = ref(null);

    onMounted(async () => {
        if (userStore.user.is_admin) {
            userid.value = userStore.editableUser.user_id
        } else {
            userid.value = userStore.user.user_id
        }
        await enrollmentStore.getCoursesForUser(userid.value)
        const processed = await processCourses(enrollmentStore.coursesForUser);
        enrolledByDay.value = processed;
    })

    async function processCourses(courses) {
        if (!Array.isArray(courses)) {
            console.error('Expected courses to be an array');
            return {
                Monday: [],
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Friday: []
            };
        }

        const dayMap = {
            M: 'Monday',
            T: 'Tuesday',
            W: 'Wednesday',
            Th: 'Thursday',
            F: 'Friday'
        };

        const enrolledByDay = {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: []
        };

        const pixelsPerHour = 80.8;
        const startHour = 7;

        for (const course of courses) {
            const match = course.schedule.match(/^([MTWTHF]+)\s+(\d+)-(\d+)$/i);

            if (!match) continue;

            let [_, rawDays, startStr, endStr] = match;
            // Convert times to 24-hour format if they're afternoon hours (1-6)
            let start = parseInt(startStr);
            let end = parseInt(endStr);
            
            // Convert afternoon hours (1-6) to 24-hour format (13-18)
            if (start >= 1 && start <= 6) start += 12;
            if (end >= 1 && end <= 6) end += 12;

            const top = ((start - startHour) * pixelsPerHour) + 1.5;
            const height = ((end - start) * pixelsPerHour)- 10 - 4; //-10 for padding -4 for border

            const days = [];
            for (let i = 0; i < rawDays.length; i++) {
                if (rawDays[i].toUpperCase() === 'T' && rawDays[i + 1]?.toUpperCase() === 'H') {
                    days.push('Th');
                    i++; // skip 'H'
                } else {
                    days.push(rawDays[i].toUpperCase());
                }
            }

            for (const code of days) {
                const day = dayMap[code];
                if (day) {
                    enrolledByDay[day].push({
                        ...course,
                        top,
                        height
                    });
                }
            }
        }

        return enrolledByDay;
    }
        
    async function openCloseModal(course) {
        if (enrollModalOpen.value === false) {
            selectedCourse.value = course;
            enrollModalOpen.value = true;
        } else {
            enrollModalOpen.value = false;
        }    
    }
</script>

<template>
    <div class="container">
        <div class="header">
            <h2>My Schedule</h2>
        </div>
        <div class="schedule-container">
            <div class="schedule-header">
                <div class="time-header"></div>
                <div class="day-header">Monday</div>
                <div class="day-header">Tuesday</div>
                <div class="day-header">Wednesday</div>
                <div class="day-header">Thursday</div>
                <div class="day-header">Friday</div>
            </div>
            <div class="calendar-container">
                <div class="time-labels">
                    <div v-for="hour in 12" :key="hour" class="time-label">
                        {{ (hour + 6) % 12 || 12 }} {{ hour + 6 < 12 ? 'AM' : 'PM' }} 
                    </div>
                </div>
                <div class="calendar-grid">
                    <div v-for="(courses, day) in enrolledByDay" :key="day" class="day-column">
                        <div v-for="course in courses" :key="course.title" class="course-block"
                            :style="{ top: course.top + 'px', height: course.height + 'px' }"
                            @click="openCloseModal(course)"
                            >
                            {{ course.title }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <CourseEnrollmentModal
        v-if="enrollModalOpen"
        :course="selectedCourse"
        :isEnrolled="true" 
        @close="openCloseModal(null)"
    />
</template>

<style scoped>
    .container {
        background-color: #F5F1ED;
        display: flex;
        height: 80vh;
        flex-direction: column;
    }

    .schedule-container {
        background-color: #F5F1ED;
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0; /* This is crucial for nested flex containers */
    }

    .schedule-header {
        display: grid;
        grid-template-columns: 80px repeat(5, 1fr);
        border-bottom: #489FB5 2px solid;
        color: #153131;
        position: sticky;
        top: 0;
        z-index: 10;
    }

    .time-header, .day-header {
        padding: 10px;
        text-align: center;
        font-weight: bold;
    }

    .schedule-header:last-child{
        padding-right: 5px;
    }

    .calendar-container {
        display: flex;
        border-radius: 0 0 4px 4px;
        flex: 1;
        overflow: auto;
        min-height: 0; /* This helps with flex overflow */
    }

    .time-labels {
        width: 80px;        
    }

    .time-label {
        height: 60px; 
        border-bottom: 1px solid #ddd;
        display: flex;
        align-items: start;
        justify-content: right;
        padding: 10px;
        color: #153131;
        font-size: 0.9em;
        font-weight: bold;
    }

    .calendar-grid {
        display: flex;
        flex-grow: 1;
        position: relative;
        overflow-y: auto;
        min-height: 969.6px; /* This is 12 hours * 80.8px to ensure background extends fully */
    }

    .day-column {
        flex: 1;
        position: relative;
        border-left: 1px solid #ddd;
        min-width: 150px;
        height: 100%;
        background: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 79px,
            #ddd 81px,
            #ddd 81px
        );
        background-size: 100% 81px;
    }

    .course-block {
        position: absolute;
        left: 2%;
        width: 89%;
        background-color: #F5F1ED;
        color: #153131;
        border: #489FB5 2px solid;
        border-radius: 4px;
        padding: 8px 8px 0px 8px;
        font-weight: bold;
        font-size: 1em;
        box-shadow: 0 2px 4px rgba(21, 49, 49, 20%);
        overflow: hidden;
        transition: all 0.2s ease;
    }

    .course-block:hover {
        transform: scale(1.02);
        box-shadow: 0 4px 8px rgba(21, 49, 49, 20%);
        z-index: 100;
    }
</style>