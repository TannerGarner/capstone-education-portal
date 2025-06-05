<script setup>
    import { onMounted, ref, watch } from 'vue';
    import { useEnrollmentStore } from '../../stores/enrollment';
    import { useUsersStore } from '../../stores/users.js';
    
    const enrollmentStore = useEnrollmentStore();
    const props = defineProps({
        course: Object,
        isEnrolled: Boolean,
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

    async function dropCourse() {
        if (confirm(`Are you sure you want to drop course with courseId: ${props.course.course_id}`)) {
            const dropped = await enrollmentStore.dropCourseFromUser(userid.value, props.course.course_id)
            alert(`${dropped ? "Dropped Successfully" : "Failed to Drop"}`)
            emit('close');
        } else {
            console.log("User clicked Cancel!");
        }
    }

    async function addCourse() {
        if (confirm(`Are you sure you want to enroll in course with courseId: ${props.course.course_id}`)) {
            const enrolled = await enrollmentStore.enrollUserInCourse(userid.value, props.course.course_id)
            alert(`${enrolled ? "Enrolled Successfully" : "Failed to Enroll"}`)
            emit('close');
        } else {
            console.log("User clicked Cancel!");
        }
    }
</script>

<template>
    <div class="cover">
        <div class="courseEnrollmentModal">
            <h1 class="title"> {{ course.title }} </h1>
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
                <div class="column description-column">
                    <h3 class="description-heading">Description</h3>
                    <p class="description">{{ course.description }}</p>
                </div>
            </div>
            <div class="buttons row">                
                <button class="cancel" @click="closeModal">Cancel</button>
                <button class="dropCourse" v-if="props.isEnrolled" @click="dropCourse">
                    <span class="material-symbols-outlined">
                        delete
                    </span>
                    Drop Course
                </button>
                <button class="addCourse" v-else @click="addCourse">
                    <span class="material-symbols-outlined">
                        add
                    </span>
                    Enroll in Course
                </button>
            </div>
        </div>
    </div>
    
</template>

<style scoped>

    .courseEnrollmentModal{
        position: relative;
        width: 65vw;
        height: 65vh;
        background-color: #F5F1ED;
        border-radius: 10px;
        padding: 75px;
        box-shadow: 0px 0px 500px #153131;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
    }

    .title{
        font-size: clamp(1.5rem, 2vw + 1rem, 2.25rem);
        font-weight: bold;
        color: #153131;
        text-align: center;
        padding-bottom: 20px;
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

    .description-column {
        gap: 10px;
    }

    .description-heading{
        padding-bottom: 0px;
        display: flex;
        align-items: center;
    }

    .description{
        font-size: clamp(0.5rem, 1.25rem, 1.5rem);
    }

    .buttons{
        justify-content: flex-end;
    }

    .dropCourse{
        background-color: #F5F1ED;
        width: auto;
        color: #E63946;
        border: #E63946 2px solid;
        transition: background-color 0.3s;
        font-weight: bold;
        padding: 10px 20px;
    }

    .dropCourse:hover{
        background-color: #E63946;
        color: #F5F1ED;
    }

    .dropCourse:hover > span{
        color: #F5F1ED;
    }

    .dropCourse > span{
        color: #E63946;
    }

    .addCourse {
        background-color: #F5F1ED;
        width: auto;
        color: #FE5E41;
        border: #FE5E41 2px solid;
        transition: background-color 0.3s;
        font-weight: bold;
        padding: 10px 20px;
    }

    .addCourse:hover{
        background-color: #FE5E41;
        color: #F5F1ED;
    }

    .addCourse > span{
        color: #FE5E41;
    }

    .addCourse:hover > span{
        color: #F5F1ED;
    }

    .cancel {
        background-color: #F5F1ED;
        width: auto;
        color: #489FB5;
        border: #489FB5 2px solid;
        transition: background-color 0.3s;
        font-weight: bold;
        padding: 10px 20px;
    }

    .cancel:hover{
        background-color: #489FB5;
        color: #F5F1ED;
    }

</style>