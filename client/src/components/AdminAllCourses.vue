<script setup>
    import { ref, onMounted } from 'vue';
    import { useCoursesStore } from '../stores/courses.js';
    import EditCourseModal from './modals/EditCourseModal.vue';
    import { useUsersStore } from '../stores/users.js';
    const courseStore = useCoursesStore();
    const userStore = useUsersStore();
    const selectedCourse = ref(null);
    const sortOrder = ref(true);
    const sortField = ref(null); 
    const isEditModalOpen = ref(false);
    const isNew = ref(false);


    onMounted(async () => {
        courseStore.fetchCourses();
    });

    function openEditModal(course) {
        selectedCourse.value = { ...course };
        isEditModalOpen.value = true;
    }

    function closeEditModal() {
        isNew.value = false;
        isEditModalOpen.value = false;
        selectedCourse.value = null;
    }

    function saveCourse(courseInfo) {
        if(isNew.value === true){
            courseStore.createCourse(courseInfo)
        } else {
            courseStore.updateCourse(courseInfo);
        }
        console.log('Saving course:', courseInfo);
        closeEditModal();
    }

    function createCourse(){
        isNew.value = true;
        const coursePattern = {
            course_id: "",
            title:"",
            schedule: "",
            classroom_number:"",
            maximum_capacity:"",
            credit_hours:"",
            description: "",            
            tuition_cost: ""
        }
        selectedCourse.value = { ...coursePattern }
        openEditModal(coursePattern)
    }

    async function deleteCourse(course_id) {
        if (confirm(`Are you sure you want to delete course with courseid: ${course_id}`)) {
            const deleted = await courseStore.deleteCourse(course_id)
            alert(`${deleted ? "Failed to Delete" :  "Deleted Successfully"}`)
            router.push("/auth")
        }
    }

    function sort(field) {
        if (sortField?.value === field) {
            sortOrder.value = !sortOrder.value; 
        } else {
            sortOrder.value = true; 
        }
        courseStore.sortCourses(field, sortOrder.value);
        sortField.value = field;
    }

    async function filter(searchTerm) {
        await courseStore.filterCourses(searchTerm);
    }

    const fields = {
        course_id: 'course_id',
        title: 'title',
        enrolled: 'enrolled',
        schedule: 'schedule',
        credits: 'credits',
        tuition: 'tuition'
    };
</script>

<template>
    <div v-if="userStore.user.is_admin" class="container">
        <div class="header">
            <h2>Manage Courses</h2>
            <div class="searchContainer">
                <span class="search-icon material-symbols-outlined">search</span>
                <input v-model="searchQuery" @input="filter(searchQuery)" class="searchBar" type="search" placeholder="Search All Courses"></input>
            </div>
            <p @click="createCourse" class="createCourse">+ Create a Course</p>
        </div>
        <div class="allCourses">
            <div class="courseList">
                <div class="courseHeader">
                    <h3 @click="sort(fields.title)">
                        Course Title
                        <span class="material-symbols-outlined sortIcon">
                            swap_vert
                        </span>
                    </h3>
                    <h3 @click="sort(fields.course_id)">
                        Course ID
                        <span class="material-symbols-outlined sortIcon">
                            swap_vert
                        </span>
                    </h3>
                    <h3 @click="sort(fields.enrolled)">
                        Enrolled
                        <span class="material-symbols-outlined sortIcon">
                            swap_vert
                        </span>
                    </h3>
                    <h3 @click="sort(fields.schedule)">
                        Schedule
                        <span class="material-symbols-outlined sortIcon">
                            swap_vert
                        </span>
                    </h3>
                    <h3 @click="sort(fields.credits)">
                        Credits
                        <span class="material-symbols-outlined sortIcon">
                            swap_vert
                        </span>
                    </h3>
                    <h3 @click="sort(fields.tuition)">
                        Tuition
                        <span class="material-symbols-outlined sortIcon">
                            swap_vert
                        </span>
                    </h3>
                </div>
                <div
                class="course" 
                v-for="(course, index) in courseStore.courses" 
                :key="course.course_id" 
                :class="{ firstCourse: index === 0, lastCourse: index === courseStore.courses.length - 1}"
                >
                    <h4>{{course.title}}</h4>
                    <p>{{ course.course_id }}</p>
                    <p>{{ course.spots_taken }}/{{course.maximum_capacity}}</p>
                    <p>{{course.schedule}}</p>
                    <p>{{course.credit_hours}}</p>
                    <p>{{course.tuition_cost}}</p>
                    <span class="material-symbols-outlined details" @click="openEditModal(course)">
                        edit_square
                    </span>
                    <!-- <button class="delete" @click="deleteCourse(course.course_id)">
                        Delete
                    </button> -->
                </div>
            </div>
        </div>
        <EditCourseModal 
            :course="selectedCourse"
            :isNew="isNew"
            :isOpen="isEditModalOpen"
            @close="closeEditModal"
            @save="saveCourse"
        />
    </div>
</template>

<style scoped>

    .allCourses {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-grow: 1;
        overflow: hidden;
    }

    .createCourse{
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        color: #FE5E41;
    }

    .createCourse:hover{
        color: #153131;
    }

    .courseList{
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 0px 2px 0px 2px;
        flex-grow: 1;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
    }

    .courseHeader{
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 0.5fr;
        align-items: center;
        background-color: #F5F1ED;
        color: #153131;
        padding: 20px 40px;
        gap: 10px;
        border-bottom: #489FB5 2px solid;
        position: sticky;
        top: 0;
    }

    .courseHeader > h3 {
        cursor: pointer;
        display: flex;
        align-items: center;
    }


    .course{
        border-top: solid 2px #489FB5;
        padding: 20px 40px;
        gap: 10px;
        border-radius: 1px;
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 0.5fr;
        align-items: center;
    }

    .course.firstCourse {
        border: none;
    }

    .course.lastCourse {
        border-bottom: solid 2px #489FB5;
    }

    .course > * {
        overflow: hidden;       
        text-overflow: ellipsis; 
        white-space: nowrap;
    }

    .details {
        color: #FE5E41;
        cursor: pointer;
    }

    .delete {
        background-color: #E63946;
    }

    .delete:hover {
        box-shadow: 0px 0px 5px #153131;
    }

    @media screen and (max-width: 1200px) {
        .searchBar {
            width: 80%;
        }

        .courseHeader > * {
            margin-left: 0;
        }

        .course > * {
            margin-left: 0;
        }
        
    }
</style>