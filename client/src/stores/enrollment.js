import { defineStore } from "pinia";
import userStore from "./users";
import coursesStore from "./courses";

export const useEnrollmentStore = defineStore("enrollment",{
    state: () => ({
        enrollmentUserData: {
            User_id, 
            listOfCourses: []
        },
        enrollmentCourseData: {
            Course_id,
            listOfUsers: []
        }
    }),
    actions: {
        async enrollUserInCourse(user_id, course_id) {
            try {
                const response = await fetch(`/api/enroll`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userStore.user.token}`
                    },
                    body: JSON.stringify({ user_id, course_id })
                })

                if (!response.ok) throw new Error("Failed to enroll user in course");

                const enrollData = await response.json();

                return enrollData;
            } catch (error) {
                console.error("Error enrolling user in course:", error);
            }
        },
        async dropCourseFromUser(user_id, course_id) {
            try {
                const response = await fetch(`/api/drop`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userStore.user.token}`
                    },
                    body: JSON.stringify({ user_id, course_id })            
                })

                if(!response.ok) throw new Error("Failed to drop course from user");

                const enrollData = await response.json();

                return enrollData;
            } catch (error) {
                console.error("Error dropping course from user:", error);
            } 
        },
        async getUsersInCourse(course_id) {
            try {
                const response = await fetch(`/api/users/${course_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userStore.user.token}`
                    },      
                })

                if(!response.ok) throw new Error("Failed to drop course from user");

                const enrollData = await response.json();

                return enrollData;
            } catch (error) {
                console.error("Error dropping course from user:", error);
            } 
        },
        async getCoursesForUser(user_id) {
            try {
                const response = await fetch(`/api/courses/${user_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userStore.user.token}`
                    },        
                })

                if(!response.ok) throw new Error("Failed to drop course from user");

                const enrollData = await response.json();

                return enrollData;
            } catch (error) {
                console.error("Error dropping course from user:", error);
            } 
        },

    },
});