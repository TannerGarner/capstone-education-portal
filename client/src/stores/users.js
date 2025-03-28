import { defineStore } from "pinia";

export const useUsersStore = defineStore('users',{
    state: () => ({
        users: [],
        user: JSON.parse(localStorage.getItem("user")) || {},
        editableUser: {}
    }),
    actions: {
        async verifyToken() {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) return false;

            const user = JSON.parse(storedUser);
            const token = user?.token;
            if (!token) return false;

            try {
                const response = await fetch("/api/verify-token", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                });
                if (!response.ok) throw new Error ("Invalid token");

                return true;
            } catch (error) {
                console.error("Error verifying token:", error);
                return false;
            }
        },
        async fetchUsers() {
            try {
                this.users = await (await fetch("/api/users", {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.user.token}`
                    },
                })).json();
                return this.users;
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        },
        async fetchUser(userID) {
            if (!userID) {
                console.error("fetchUser: No userID provided");
                return;
            }
        
            try {
                const response = await fetch(`/api/users/${userID}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.user.token}`,
                    },
                });
        
                if (!response.ok) throw new Error("Failed to fetch user");
        
                const userData = await response.json();
                this.user = { ...this.user, ...userData };                
                return true;
            } catch (error) {
                console.error("Error fetching user:", error);
                this.user = null;
                localStorage.removeItem("user"); 
                return false;
            }
        },
        async createUser(newUser) {
            try {
                const response = await fetch("/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newUser),
                });
        
                if (!response.ok) {
                    throw new Error("Failed to create user");
                }
                const tokenAndUser = await response.json();
                const token = tokenAndUser.token;

                const { password, ...userWithoutPassword } = newUser;
                if (!this.user.is_admin){
                    this.user = { 
                        ...userWithoutPassword, 
                        user_id: tokenAndUser.user_id,
                        password_length: password.length,
                        token: token,
                    };
    
                    localStorage.setItem("user", JSON.stringify(this.user));
    
                    this.users.push(this.user);
                } else {
                    this.users.push({
                        ...userWithoutPassword, 
                        user_id: tokenAndUser.user_id,
                        password_length: password.length,
                    })
                }
            } catch (error) {
                console.error("Failed to create user:", error);
            }
        },
        async updateUser(updateValues) {
            const updatingSelf = updateValues.user_id === this.user.user_id;

            // Get old user data (whether it be from the logged in user or another user):
            let oldUser = updatingSelf ? this.user : this.users.find(user => user.user_id === updateValues.user_id);

            // Merge old and new data:
                // Note: Currently updateValues is always equal to mergedUser. Either this code or other code should be simplified.
            const mergedUser = { ...oldUser, ...updateValues };

            try {
                const response = await fetch(`/api/users/${mergedUser.user_id}`, {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.user.token}`,
                    },
                    body: JSON.stringify(mergedUser),
                });
        
                // Check if response is okay:
                if (!response.ok) {
                    throw new Error("Failed to update user");
                }

                // Update local storage if necessary:
                if (updatingSelf) localStorage.setItem("user", JSON.stringify(this.user));

                // This will take the old user state and update it:
                    // oldUser is a pointer to user data that is being edited.
                    // This means that editing this variable will update the this.user or this.users.
                oldUser = mergedUser;
            } catch (error) {
                console.error("Update failed:", error);
            }
        },
        async deleteUser(userID) {
            const index = this.users.findIndex(user => user.user_id === userID);
            console.log(index)
            console.log(this.user)
            if (index === -1) return;
        
            const oldUser = { ...this.users[index] };
        
            this.users.splice(index, 1);
        
            try {
                const response = await fetch(`/api/users/${userID}`, {
                    method: "DELETE",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.user.token}`,
                    },

                });
        
                if (!response.ok) {
                    throw new Error("Failed to delete user");
                }
            } catch (error) {
                console.error("Delete failed, rolling back:", error);
                this.users.splice(index, 0, oldUser);
            }
        },
        async login(credentials) {
            try {
                const response = await fetch("/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(credentials),
                });
        
                if (!response.ok) throw new Error("Login failed");

                const { token, user } = await response.json();

                this.user = {
                    ... user,
                    password_length: credentials.password.length,
                    token: token,
                };
                
                localStorage.setItem("user", JSON.stringify(this.user));
                return true;
            } catch (error) {
                console.error("Login failed:", error);
                return false;
            }
        },
        async logout() {
            this.user = {};
            localStorage.removeItem("user");
        },
    },
});