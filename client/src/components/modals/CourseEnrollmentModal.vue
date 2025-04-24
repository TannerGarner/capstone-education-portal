<script setup>
    import { onMounted, ref, watch } from 'vue';
    import { useEnrollmentStore } from '../../stores/enrollment';
    import { useUsersStore } from '../../stores/users.js';
    
    const enrollmentStore = useEnrollmentStore();
    const props = defineProps({
        course: Object,
        isEnrolled: Boolean,
        isOpen: Boolean  
    });
    const userStore = useUsersStore();

    const userid = ref(null);

    onMounted(async () => { 
        userid.value = userStore.user.is_admin 
            ? userStore.editableUser.user_id 
            : userStore.user.user_id;
        await enrollmentStore.getCoursesForUser(userid.value);
    });

    const emit = defineEmits(['close']);

    function closeModal() {
        emit('close');
    }

    function dropCourse() {
        if (confirm(`Are you sure you want to drop course with courseId: ${props.course.course_id}`)) {
            const dropped = enrollmentStore.dropCourseFromUser(userid.value, props.course.course_id)
            alert(`${dropped ? "Dropped Successfully" : "Failed to Drop"}`)
            emit('close');
        } else {
            console.log("User clicked Cancel!");
        }
    }
</script>

<template>
    <div v-if="isOpen" class="cover">
        <div class="courseEnrollmentModal">
            <h1> {{ course.title }} </h1>
            <div class="courseInfo row">
                <div class="column">
                    <p class="info">
                        <span class="material-symbols-outlined icon">
                            key
                        </span>
                        {{ course.course_id }}
                    </p>
                    <p class="info">
                        <span class="material-symbols-outlined icon">
                            attach_money
                        </span>
                        {{course.tuition_cost}}
                    </p>
                    <p class="info">
                        <span class="material-symbols-outlined icon">
                            group
                        </span> 
                        {{ course.spots_taken ? course.spots_taken : 0 }}/{{course.maximum_capacity}}
                    </p>
                </div>
                <div class="column">
                    <p class="info">
                        <span class="material-symbols-outlined icon">
                            school
                        </span>
                        {{ course.credit_hours }} Credits
                    </p>
                    <p class="info">
                        <span class="material-symbols-outlined icon">
                            schedule
                        </span> 
                        {{ course.schedule }}
                    </p>
                    <p class="info">
                        <span class="material-symbols-outlined icon">
                            location_on
                        </span>
                        {{ course.classroom_number }}
                    </p>
                </div>
                <div class="column">
                    <p><span class="heading">Description</span><br><br>{{ course.description }}</p>
                </div>
        
            </div>
            <div class="buttons row">                
                <button @click="closeModal">Cancel</button>
                <button v-if="props.isEnrolled" @click="dropCourse">Drop Course</button>
                <button v-else @click="enrollCourse">Enroll in Course</button>
            </div>
        </div>
    </div>

</template>

<style scoped>

    .courseEnrollmentModal{
        position: relative;
        width: 50vw;
        height: 50vh;
        background-color: #F5F1ED;
        border-radius: 10px;
        padding: 100px;
        box-shadow: 0px 0px 500px #153131;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
    }

    .row{
        display: flex;
        gap: 50px;
        width: 100%;
    }

    .courseInfo {
        justify-content: space-between;
        font-size: clamp(1rem, 2vw + 1rem, 1.5rem);
    }

    .column {
        display: flex;
        flex-direction: column;
        gap: 50px;
        width: 33%;
    }

    .info {
        display: flex;
        align-items: center;
        gap: 40px;
    }

    .icon{
        font-size: clamp(1rem, 2vw + 1rem, 4rem);
        color: #153131;
    }

    .heading{
        font-weight: bold;
    }

    .buttons{
        justify-content: flex-end;
    }

</style>