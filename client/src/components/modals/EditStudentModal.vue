<script setup>
    import { onMounted, ref } from 'vue';
    import EnrollmentList from './EnrollmentList.vue';
    import { useEnrollmentStore } from '../../stores/enrollment';
    import { useUsersStore } from '../../stores/users';
    const enrollmentStore = useEnrollmentStore();
    const usersStore = useUsersStore();
    
    const props = defineProps({
        user: Object,
        isNew: Boolean
    });
    
    const emit = defineEmits(['close']);
    
    function closeModal() {
        Object.entries(editorState.value).forEach(([key]) => {
            editorState.value[key] = false;
        });
        
        enrollmentStore.clearState();
        
        emit('close');
    }
    
    const enrolledListRef = ref(null);
    const notEnrolledListRef = ref(null);
    
    async function saveChanges() {
        if (confirm("Are you sure you want to save these changes?")) {
            // Create or update main user info:
            let userID, errorMessage;
            if (props.isNew) {
                const requestResult = await usersStore.createUser(editUser.value);

                errorMessage = requestResult.errorMessage;
                // Note: The user ID for new users is generated on the backend:
                userID = requestResult.user_id;
            } else {
                errorMessage = await usersStore.updateUser(editUser.value);
                userID = props.user.user_id;
            }

            // If there is an error updating the main user info, show alert and don't update enrollment info:
            if (errorMessage) return alert("Failed to update user.");

            // Update enrollment info:
            await enrolledListRef.value?.updateEnrollment(userID);
            await notEnrolledListRef.value?.updateEnrollment(userID);

            // Close modal:
            closeModal();
        }
    }

    async function deleteUser(){
        if (confirm(`Are you sure you want to delete ${props.user.first_name} ${props.user.last_name}'s account?`)) {
            const deleted = await usersStore.deleteUser(props.user.user_id);
            if (deleted) {
                alert("User deleted successfully.");
                closeModal();
            } else {
                alert("Failed to delete user.");
            }
        }
    }

    function fixString(string){
        let fixed = string.replaceAll("_", " ");
        fixed = fixed.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
        fixed = fixed.replaceAll(/Or\b/g, "or");
        return fixed;
    }

    const editUser = ref({});
    const editorState = ref({});

    onMounted(() => {
        editUser.value = { ...props.user };
        enrollmentStore.getCoursesForUser(props.user.user_id);
    });
</script>

<template>
    <div class="cover">
        <div class="editStudentModal">
            <div class="studentInfo">
                <div class="smallFields column">
                    <div 
                        v-for="key in Object.keys(user).filter((k) => k !== 'user_id')"
                        :key="key"
                        class="row"
                    >
                        <p>{{ fixString(key) }}</p>
                        <input v-model="editUser[key]" type="text">
                    </div>
                </div>
            </div>
            <div v-if="!user.is_admin">
                <EnrollmentList
                    ref="enrolledListRef"
                    heading="Enrolled Courses"
                    listType="coursesForUser"
                />
                <EnrollmentList
                    ref="notEnrolledListRef"
                    heading="Available Courses"
                    listType="coursesNotForUser"
                />
            </div>
            <div class="modalButtons">
                <button class="delete" @click="deleteUser()">
                    <span class="material-symbols-outlined deleteText">delete</span>
                    Delete User
                </button>
                <div class="rightButtons">
                    <button class="cancel" @click="closeModal()">
                        Cancel
                    </button>
                    <button class="save" @click="saveChanges()">
                        Save
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .cover {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: #00000080;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        overflow-y: auto;
        padding: 2rem 0;
    }

    .editStudentModal {
        position: relative;
        width: 70vw;
        min-height: 60vh;
        background-color: #F5F1ED;
        border-radius: 10px;
        padding: 50px;
        box-shadow: 0px 0px 500px #153131;
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin: auto;
        margin-bottom: 4rem;
    }

    .studentInfo {
        display: flex;
        gap: 40px;
        width: 100%;
        padding-bottom: 20px;
    }

    .column {
        flex-grow: 1;
    }

    .row {
        display: grid;
        grid-template-columns: 1fr 1.5fr 1fr;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #489FB5;
    }

    .row button {
        justify-self: end;
    }

    input {
        padding: 5px;
        border: 1px solid #489FB5;
        border-radius: 5px;
    }

    textarea {
        width: 100%; 
        height: 200px; 
        padding: 10px; 
        font-size: 16px; 
        font-family:'Courier New', Courier, monospace;
        border: 2px solid #489FB5; 
        border-radius: 10px; 
        outline: none; 
    }

    .modalButtons {
        display: flex;
        justify-content: space-between;
    }

    .rightButtons {
        display: flex;
        gap: 10px;
    }

    .save:hover {
        background-color: #489FB5;
    }

    .cancel {
        color: #489FB5;
        background-color: #F5F1ED;
        border: 2px #489FB5 solid;
    }
    .cancel:hover {
        color: #F5F1ED;
        background-color: #489FB5;
    }

    .delete {
        color: #E63946;
        background-color: #F5F1ED;
        border: 2px #E63946 solid;
        width: 9rem;
    }
    .delete:hover {
        color: #F5F1ED;
        background-color: #E63946;
    }

    .material-symbols-outlined.deleteText {
        font-size: 24px;
        color: inherit;
        margin-right: 0.5rem;
    }

    .descriptionBox {
        max-width: 30%;
    }

    .descriptionBox > * {
        margin: 20px 0px;
    }

    .description {
        text-wrap: wrap;
    }
</style>