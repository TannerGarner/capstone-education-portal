<script setup>
    import { ref, onMounted } from 'vue';
    import { useUsersStore } from '../stores/users.js';
    import EditStudentModal from './modals/EditStudentModal.vue';
    import router from '../router/index.js';
    const userStore = useUsersStore();
    const selectedUser = ref(null);
    const isEditStudentModalOpen = ref(false);
    const isNew = ref(false)

    onMounted(async () => {
        userStore.fetchUsers();
    });


    async function openEditModal(user) {
        console.log(user)
        selectedUser.value = { ...user };
        isEditStudentModalOpen.value = true;
    }

    function closeEditModal() {
        isEditStudentModalOpen.value = false;
        selectedUser.value = null;
        isNew.value = false;
    }

    async function saveStudent(userInfo) {
        if(isNew.value === true){
            await userStore.createUser(userInfo)
            alert(`Successfully created user`)
        } else {
            console.log(userInfo);
            await userStore.updateUser(userInfo);
        }
        closeEditModal();
    }

    function createUser(){
        isNew.value = true;
        const userPattern = {
            first_name:"",
            last_name: "",
            email:"",
            password: "",
            phone_number:"",
            address:{
                street: " ",
                city: "",
                state: "",
                country: "",
            },          
            is_admin: ""
        }
        selectedUser.value = { ...userPattern };
        openEditModal(userPattern);
    }

    async function deleteUser(user_id){
        if (confirm(`Are you sure you want to delete account with userid: ${user_id}`)) {
            await userStore.deleteUser(user_id);
            // const deleted = await userStore.deleteUser(user_id);
            // alert(`${deleted ? "Deleted Successfully" : "Failed to Delete"}`);
            // if (deleted) router.push("/auth");
        }
    }
</script>

<template>
    <div v-if="userStore.user.is_admin" class="container">
        <div class="header">
            <h2>Manage Users</h2>
            <input class="searchBar" type="search" placeholder="Search All Users"></input>
            <p @click="createUser" class="createUser">+ Create a New User</p>
        </div>
        <div class="allStudents">
            <div class="studentList">
                <div class="studentHeader">
                    <p>First Name</p>
                    <p>Last Name</p>
                    <p>User ID</p>
                    <p>Email</p>
                </div>
                <div 
                class="student" 
                v-for="(user, index) in userStore.users" 
                :key="user.user_id"
                :class="{ firstStudent: index === 0 }"
                >
                    <p>{{user.first_name}}</p>
                    <p>{{user.last_name}}</p>
                    <p>{{user.user_id}}</p>
                    <p>{{user.email}}</p>
                    <button class="details" @click="openEditModal(user)">
                        Edit
                    </button>
                    <button class="delete" @click="deleteUser(user.user_id)">
                        Delete
                    </button>
                </div>
            </div>
        </div>
        <EditStudentModal 
            :user="selectedUser"
            :isNew="isNew"
            :isOpen="isEditStudentModalOpen"
            @close="closeEditModal"
            @save="saveStudent"
        />
    </div>
</template>

<style scoped>

    .allStudents {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-grow: 1;
        overflow: hidden;
        height: 80vh;
    }

    .createUser{
        font-weight: bold;
        font-size: 24px;
        cursor: pointer;
        color: #FE5E41;
    }

    .createUser:hover{
        color: #489FB5;
    }

    .studentList{
        display: flex;
        flex-direction: column;
        width: 80vw;
        padding: 0px 2px 0px 2px;
        flex-grow: 1;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
    }

    .studentHeader{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        align-items: center;
        background-color: #F5F1ED;
        color: #153131;
        padding: 25px 15px;
        position: sticky;
        top: 0;
        border-bottom: #489FB5 2px solid;;
    }

    .studentHeader > * {
        overflow: hidden;       
        text-overflow: ellipsis; 
        white-space: nowrap;
        margin-left: 20px;
    }

    .student{
        border-top: solid 2px #489FB5;
        padding: 15px;
        border-radius: 1px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        align-items: center;
    }

    .student > * {
        overflow: hidden;       
        text-overflow: ellipsis; 
        white-space: nowrap;
        margin-left: 20px;
    }

    .firstStudent {
        border-top: none;
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