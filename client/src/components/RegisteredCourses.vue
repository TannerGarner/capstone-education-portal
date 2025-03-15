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
</script>

<template>
    <div class="container">
        <div class="header">
            <h1>Registered Courses</h1>
        </div>
        <div class="courseList">
            <div class="courseDisplay" v-for="course in enrollmentStore.coursesForUser" :key="course.course_id">
                <div class="courseHeader">
                    <h2>{{course.title}}</h2>
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

    .dropCourse{
        background-color: #E63946;
    }
    
    button{
        transition: box-shadow 0.25s;
    }

    button:hover{
        box-shadow: 0px 1px 5px #153131;
    }

    h2{
        font-size: 18px;
    }
</style>