import { defineStore } from "pinia";

export const useCoursesStore = defineStore("courses",{
    state: () => ({
        courses: [],
        course: {},
        loading: false,
    }),
    actions: {
        async fetchCourses() {
            const token = JSON.parse(localStorage.getItem('user')).token
            try {
                this.courses = await (await fetch("/api/courses", {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                })).json();
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        },
        async fetchCourse(courseID) {
            try {
                const token = JSON.parse(localStorage.getItem('user')).token
                this.course = await (await fetch(`/api/courses/?searchTerm=${courseID}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json", 
                        "Authorization": `Bearer ${token}`
                    },
                })).json();

        
                return this.course;
            } catch (error) {
                console.error("Error fetching course:", error);
            }
        },
        async createCourse(newCourse) {
            try {
                const token = JSON.parse(localStorage.getItem('user')).token
                const response = await fetch("/api/courses", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                    body: JSON.stringify(newCourse),
                });
        
                if (!response.ok) {
                    throw new Error("Failed to create course");
                }
        
                this.courses.push(newCourse);
            } catch (error) {
                console.error("Failed to create course:", error);
            }
        },
        async updateCourse(updateValues) {
            const token = JSON.parse(localStorage.getItem('user')).token
            const index = this.courses.findIndex(course => course.course_id === updateValues.course_id);
            if (index === -1) return;
        
            const oldCourse = { ...this.courses[index] };
        
            this.courses[index] = { ...this.courses[index], ...updateValues };
        
            try {
                const response = await fetch(`/api/courses/${updateValues.course_id}`, {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                    body: JSON.stringify(updateValues),
                });
        
                if (!response.ok) {
                    throw new Error("Failed to update course");
                }
            } catch (error) {
                console.error("Update failed, rolling back:", error);
                this.courses[index] = oldCourse; 
            }
        },
        async deleteCourse(courseID) {
            const index = this.courses.findIndex(course => course.id === courseID);
            if (index === -1) return;
        
            const oldCourse = { ...this.courses[index] };
        
            this.courses.splice(index, 1);
            console.log(courseID)
        
            try {
                const token = JSON.parse(localStorage.getItem('user')).token
                const response = await fetch(`/api/courses/${courseID}`, {
                    method: "DELETE",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                });
                console.log(response)
        
                if (!response.ok) {
                    throw new Error("Failed to delete course");
                }
            } catch (error) {
                console.error("Delete failed, rolling back:", error);
                this.courses.splice(index, 0, oldCourse);
            }
        },
    },
});