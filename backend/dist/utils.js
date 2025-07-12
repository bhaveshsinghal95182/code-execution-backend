import { exec } from "child_process";
class Semaphore {
    constructor(max) {
        this.max = max;
        this.count = 0;
        this.queue = [];
    }
    async acquire() {
        if (this.count < this.max) {
            this.count++;
            return Promise.resolve();
        }
        return new Promise((resolve) => this.queue.push(resolve));
    }
    release() {
        this.count--;
        if (this.queue.length > 0) {
            this.count++;
            const next = this.queue.shift();
            if (next) {
                next();
            }
        }
    }
}
const userCreationSemaphore = new Semaphore(1);
const execShellCommand = (cmd, options = {}) => {
    return new Promise((resolve, reject) => {
        exec(cmd, { ...options, timeout: 10000 }, (error, stdout, stderr) => {
            if (error || stderr) {
                console.log("error ", error);
                console.log("stderr: ", stderr);
                reject(stderr || error?.message || "Unknown error");
            }
            else {
                console.log("stdout");
                resolve(stdout?.toString() || "");
            }
        });
    });
};
const createUser = async (username, cpuLimit = "10000", memoryLimit = "500M") => {
    await userCreationSemaphore.acquire();
    try {
        const createUserCommand = `sudo useradd -m ${username} && echo '${username}:p' | sudo chpasswd`;
        await execShellCommand(createUserCommand);
        console.log(`User ${username} created successfully.`);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error creating user ${username}:`, errorMessage);
        throw error;
    }
    finally {
        userCreationSemaphore.release();
    }
};
const deleteUser = async (username) => {
    await userCreationSemaphore.acquire();
    try {
        const deleteUserCommand = `sudo userdel -r ${username}`;
        await execShellCommand(deleteUserCommand);
        console.log(`User ${username} deleted successfully.`);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error deleting user ${username}:`, errorMessage);
        throw error;
    }
    finally {
        userCreationSemaphore.release();
    }
};
const killProcessGroup = async (pgid) => {
    const killCommand = `sudo kill -TERM -${pgid}`; // Send SIGTERM to process group
    await execShellCommand(killCommand);
};
export { execShellCommand, createUser, deleteUser, killProcessGroup, };
//# sourceMappingURL=utils.js.map