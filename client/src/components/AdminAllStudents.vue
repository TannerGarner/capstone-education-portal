<script setup>
    import { ref, onMounted } from 'vue';
    import { useUsersStore } from '../stores/users.js';
    import EditCourseModal from './EditCourseModal.vue';
    const userStore = useUsersStore();
    const selectedCourse = ref(null);
    const isEditModalOpen = ref(false);

    onMounted(async () => {
        userStore.fetchUsers();
    });


    function openEditModal(course) {
        selectedCourse.value = { ...course };
        isEditModalOpen.value = true;
    }

    function closeEditModal() {
        isEditModalOpen.value = false;
        selectedCourse.value = null;
    }

    function saveCourse(updatedCourse) {
        console.log('Saving updated course:', updatedCourse);
        closeEditModal();
    }

    async function deleteUser(user_id){
        console.log('deleting user', user_id)
        await userStore.deleteUser(user_id)
    }
</script>

<template>
    <div v-if="userStore.user.is_admin" class="container">
        <div class="header">
            <h1>All Students</h1>
        </div>
        <div class="allStudents">
            <div class="studentInputs">
                <input class="searchBar" type="search" placeholder="Search All Courses"></input>
                <div class="newStudent">
                    <p>Create a New User</p>
                    <button @click="createUser" class="createUser">+</button>
                </div>
            </div>            <div class="studentList">
                <div class="studentHeader">
                    <p>First Name</p>
                    <p>Last Name</p>
                    <p>User ID</p>
                </div>
                <div class="student" v-for="user in userStore.users" :key="user.user_id">
                    <p>{{user.first_name}}</p>
                    <p>{{user.last_name}}</p>
                    <p>{{user.user_id}}</p>
                    <button class="details" @click="openEditModal(user)">
                        Edit
                    </button>
                    <button class="delete" @click="deleteUser(user.user_id)">
                        Delete
                    </button>
                </div>
                
            </div>
        </div>
        <EditCourseModal 
            :course="selectedCourse"
            :isOpen="isEditModalOpen"
            @close="closeEditModal"
            @save="saveCourse"
        />
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100vh;
    }

    .header {
        background-color: #FE5E41;
    }

    .allStudents {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 1px 0px 1px;
        flex-grow: 1;
        overflow: hidden;
    }

    .studentInputs{
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
    }

    .newStudent{
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .createUser{
        font-weight: bold;
        font-size: 36px;
        width: 60px;
        border-radius: 100px;
    }

    .createUser:hover{
        background-color: #FE5E41;
    }

    .studentList{
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 0px 2px 0px 2px;
        flex-grow: 1;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
    }

    .searchBar {
        padding: 20px 40px;
        border-radius: 50px;
        border: 2px solid #489FB5;
        background-color: rgba(72, 159, 181, 0.25);
        font-size: 24px;
        color: #489FB5;
        display: flex;
        width: 50%;
        margin-bottom: 20px;
    }

    .searchBar::placeholder {
        color: #489FB5;
    }

    .studentHeader{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        align-items: center;
        background-color: rgb(72, 159, 181);
        color: #F5F1ED;
        padding: 20px 5px;
        border-radius: 1px;
        position: sticky;
        top: 0;
    }

    .studentHeader > * {
        overflow: hidden;       
        text-overflow: ellipsis; 
        white-space: nowrap;
        margin-left: 20px;
    }

    .student{
        background-color: rgba(72, 159, 181, 0.25);
        border: solid 2px #489FB5;
        padding: 5px;
        margin-top: 1px;
        border-radius: 1px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        align-items: center;
    }

    .student > * {
        overflow: hidden;       
        text-overflow: ellipsis; 
        white-space: nowrap;
        margin-left: 20px;
    }

    .details:hover {
        background-color: #FE5E41;
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