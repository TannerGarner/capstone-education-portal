<script setup>
    import { onMounted, ref } from 'vue';
    import { useEnrollmentStore } from '../stores/enrollment';
    import { useCoursesStore } from '../stores/courses.js';
    import { useUsersStore } from '../stores/users.js';
    
    const enrollmentStore = useEnrollmentStore();
    const courseStore = useCoursesStore();
    const userStore = useUsersStore();

    let userid;
    onMounted(async ()=>{ 
        if(userStore.user.is_admin){
            userid = userStore.editableUser.user_id
        } else {
            userid = userStore.user.user_id
        }
        enrollmentStore.getCoursesForUser(userid)
    })

    function dropCourse (course_id){
        if (confirm(`Are you sure you want to drop this course? ${course_id}`)) {
            const dropped = enrollmentStore.dropCourseFromUser(userid, course_id);
            alert(`${dropped ? "Dropped Successfully" : "Failed to Drop"}`)
        } else {
            console.log("User clicked Cancel!");
        }
    }
    
    const dropdownState = ref(new Map());

    const toggleDropdown = (course_id) => {
        dropdownState.value.set(course_id, !dropdownState.value.get(course_id));
    };

    const isDropdownOpen = (course_id) => dropdownState.value.get(course_id) || false;

    function calculateCredits() {
        const courses = enrollmentStore.coursesForUser;
        return Array.isArray(courses) ? courses.reduce((total, course) => total + course.credit_hours, 0) : 0;
    }

    function calculateTuition() {
        const courses = enrollmentStore.coursesForUser;
        return Array.isArray(courses) ? courses.reduce((total, course) => total + Number(course.tuition_cost.replace(/[^0-9.-]+/g, "")), 0) : 0;
    }

    function newCourse() {
        console.log("New Course Clicked")
    }
</script>

<template>
    <div class="container">
        <div class="header">
            <h2>Registered Courses</h2>
            <p>Courses: {{ enrollmentStore.coursesForUser.length }}</p>
            <p>Credits: {{ calculateCredits() }}</p>
            <p>Tuition: ${{ calculateTuition() }}</p>
            <h2 class="addCourse" @click="newCourse()">+ Add a Course</h2>
        </div>
        <div class="courseList">
            <div class="courseDisplay" v-for="course in enrollmentStore.coursesForUser" :key="course.course_id">
                <div class="courseHeader">
                    <h3>{{course.title}}</h3>
                    <p>Schedule: {{course.schedule}}</p>
                    <p>Classroom: {{course.classroom_number}}</p>
                    <p>Credit Hours: {{course.credit_hours}}</p>
                    <button @click="toggleDropdown(course.course_id)">
                        {{ isDropdownOpen(course.course_id) ? "▲" : "▼" }}
                    </button>
                </div>
                <div v-if="isDropdownOpen(course.course_id)" class="dropdown">
                    <p>Description: </p>
                    <p>{{course.description}}</p>
                    <p>Maximum Capacity: {{course.maximum_capacity}}</p>
                    <p>Tuition Cost: {{course.tuition_cost}}</p>
                    <button class="dropCourse" @click="dropCourse(course.course_id)">
                        Drop Course
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .container{
        background-color: #F5F1ED;
        display: flex;
        flex-direction: column;
    }

    .courseList{
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
        overflow-y: auto;
    }

    .courseDisplay{
        background-color: #F5F1ED;
        border: 2px solid #489FB5;
        border-left: 10px solid #489FB5;
        border-radius: 1px;
        padding: 10px 30px;
    }

    .courseHeader{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        align-items: center;
    }

    .addCourse{
        color: #FE5E41;
        cursor: pointer;
    }

    .dropCourse{
        background-color: #E63946;
    }
    
    button{
        transition: box-shadow 0.25s;
    }

    button:hover{
        box-shadow: 0px 1px 5px #153131;
    }
</style>