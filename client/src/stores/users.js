import { defineStore } from "pinia";

export const useUsersStore = defineStore('users',{
    state: () => ({
        users: [],
        user: {},
    }),
    actions: {
        async fetchUsers() {
            try {
                this.users = await (await fetch("/api/users", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
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
                const response = await fetch(`/api/user/${userID}`, {
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
                const response = await fetch("/api/user", {
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
                this.user = { 
                    ...userWithoutPassword, 
                    user_id: tokenAndUser.user_id,
                    password_length: password.length,
                    token: token,
                };

                localStorage.setItem("user", JSON.stringify(this.user));

                this.users.push(this.user);
            } catch (error) {
                console.error("Failed to create user:", error);
            }
        },
        async updateUser(updateValues) {
            // const index = this.users.findIndex(user => user.id === updateValues.user_id);
            // if (index === -1) return;
        
            const oldUser = { ...this.user };
        
            // this.users[index] = { ...this.users[index], ...updateValues };

            this.user = { ...updateValues };
        
            try {
                const response = await fetch(`/api/user/${this.user.user_id}`, {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.user.token}`,
                    },
                    body: JSON.stringify(this.user),
                });
        
                if (!response.ok) {
                    throw new Error("Failed to update user");
                }

                localStorage.setItem("user", JSON.stringify(this.user));
            } catch (error) {
                console.error("Update failed, rolling back:", error);
                // this.users[index] = oldUser; 
                this.user = oldUser;
            }
        },
        async deleteUser(userID) {
            const index = this.users.findIndex(user => user.id === userID);
            if (index === -1) return;
        
            const oldUser = { ...this.users[index] };
        
            this.users.splice(index, 1);
        
            try {
                const response = await fetch(`/api/users/${userID}`, {
                    method: "DELETE",
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
                const response = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(credentials),
                });
        
                if (!response.ok) throw new Error("Login failed");
                
                const { token } = await response.json();

                const password = credentials.password;
                this.user = {
                    user_id: credentials.user_id,
                    password_length: password.length,
                    token: token,
                };
                await this.fetchUser(this.user.user_id);
                
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