declare const execShellCommand: (cmd: string, options?: any) => Promise<string>;
declare const createUser: (username: string, cpuLimit?: string, memoryLimit?: string) => Promise<void>;
declare const deleteUser: (username: string) => Promise<void>;
declare const killProcessGroup: (pgid: number) => Promise<void>;
export { execShellCommand, createUser, deleteUser, killProcessGroup, };
//# sourceMappingURL=utils.d.ts.map