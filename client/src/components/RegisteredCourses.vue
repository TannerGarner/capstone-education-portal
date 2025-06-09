<script setup>
    import { onMounted, ref } from 'vue';
    import { useEnrollmentStore } from '../stores/enrollment';
    import { useCoursesStore } from '../stores/courses.js';
    import { useUsersStore } from '../stores/users.js';
    import CourseEnrollmentModal from './modals/CourseEnrollmentModal.vue';
    import AddCourseModal from './modals/AddCourseModal.vue';
    
    const enrollmentStore = useEnrollmentStore();
    const courseStore = useCoursesStore();
    const userStore = useUsersStore();

    const enrollModalOpen = ref(false);
    const selectedCourse = ref(null);
    const addCourseModalOpen = ref(false);

    let userid;
    onMounted(async ()=>{ 
        if(userStore.user.is_admin){
            userid = userStore.editableUser.user_id
        } else {
            userid = userStore.user.user_id
        }
        enrollmentStore.getCoursesForUser(userid)
    })

    function calculateCredits() {
        const courses = enrollmentStore.coursesForUser;
        return Array.isArray(courses) ? courses.reduce((total, course) => total + course.credit_hours, 0) : 0;
    }

    function calculateTuition() {
        const courses = enrollmentStore.coursesForUser;
        return Array.isArray(courses) ? courses.reduce((total, course) => total + Number(course.tuition_cost.replace(/[^0-9.-]+/g, "")), 0) : 0;
    }

    function addCourseModal() {
        if (addCourseModalOpen.value === false) {
            addCourseModalOpen.value = true;
        } else {
            addCourseModalOpen.value = false;
        }    
    }

    function detailsModal(course) {
        if (enrollModalOpen.value === false) {
            selectedCourse.value = { ...course };
            enrollModalOpen.value = true;
        } else {
            enrollModalOpen.value = false;
        }    
    }

</script>

<template>
    <div class="container">
        <div class="header">
            <h2>My Courses</h2>
            <div class="userInfo">
                <p> 
                    <span class="material-symbols-outlined icon">
                        tag
                    </span>  
                    {{ enrollmentStore.coursesForUser.length }}
                </p>
                <p>
                    <span class="material-symbols-outlined icon">
                        school
                    </span>
                    {{ calculateCredits() }}
                </p>
                <p> 
                    <span class="material-symbols-outlined icon">
                        attach_money
                    </span>
                    {{ calculateTuition() }}
                </p>
            </div>
            <span class="material-symbols-outlined icon addCourseModal" @click="addCourseModal()">add</span>
        </div>
        <div class="courseList">
            <div class="courseCard" v-for="course in enrollmentStore.coursesForUser" :key="course.course_id" @click="detailsModal(course)">
                <h3>{{course.title}}</h3>
                <p class="data">
                    <span class="material-symbols-outlined icon">
                        schedule
                    </span> 
                    {{course.schedule}}</p>
                <p class="data">
                    <span class="material-symbols-outlined icon">
                        location_on
                    </span> 
                    {{course.classroom_number}}
                </p>
                <button>
                    Details
                </button>
            </div>
        </div>
        <CourseEnrollmentModal
            v-if="enrollModalOpen"
            :course="selectedCourse"
            :isEnrolled="true" 
            @close="detailsModal(null)"
        />
        <AddCourseModal
            v-if="addCourseModalOpen"
            @close="addCourseModal"
        />
    </div>
</template>

<style scoped>
    .container{
        background-color: #F5F1ED;
        display: flex;
        flex-direction: column;
    }

    .userInfo{
        display: flex;
        gap: 100px;
        align-items: center;
    }

    .userInfo > p{
        font-size: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .addCourseModal{
        background-color: #F5F1ED;
        border: #FE5E41 2px solid;
        border-radius: 50%;
        font-size: 38px;
        color: #FE5E41;
        cursor: pointer;
    }

    .courseList{
        height: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 5%;
        padding: 50px 80px;
        overflow-y: auto;
    }

    .courseList > :last-child{
        align-self: flex-start;
    }

    .courseCard{
        background-color: #F5F1ED;
        border: 2px solid #489FB5;
        border-radius: 10px;
        padding: 30px;
        height: 200px;
        width: 200px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: start;
        box-shadow: 0px 4px 10px rgba(21, 49, 49, 20%);
        transition: transform 0.3s, box-shadow 0.3s;
    }

    .courseCard:hover{
        transform: scale(1.02);
        box-shadow: 0 4px 8px rgba(21, 49, 49, 20%);
        cursor: pointer;
    }

    .data{
        display: flex;
        align-items: center;
        font-size: 18px;
        gap: 10px;
    }

    .dropCourse{
        background-color: #E63946;
    }
    
    button {
        background-color: #F5F1ED;
        color: #FE5E41;
        border: #FE5E41 2px solid;
        transition: background-color 0.3s;
        font-weight: bold;
        width: 100%;
    }

    button:hover {
        background-color: #FE5E41;
        color: #F5F1ED;
    }

    

    @media screen and (max-width: 768px) {
        .header {
            align-items: center;
            padding: 10px 20px;
            gap: 10px;
        }

        .userInfo {
            gap: 10px;
        }

        .userInfo > p {
            font-size: 16px;
        }
        
        .courseList {
            padding: 20px;
            justify-content: center;
        }
        
    }
</style>