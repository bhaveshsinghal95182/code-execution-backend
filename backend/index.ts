import express from "express";
import path from "path";
import {
  execShellCommand,
  createUser,
  deleteUser,
  killProcessGroup,
} from "./utils";
const app = express();
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.post("/api/execute", async (req, res) => {
  const { code, language } = req.body;
  const execId = `exec_${uuidv4()}`;

  let pgid: number | undefined; 

  try {
    await createUser(execId);
    const userHomeDir = `/home/${execId}`;
    const tempDir = path.join(userHomeDir, "temp", execId);

    await execShellCommand(`sudo -u ${execId} mkdir -p ${tempDir}`);

    let scriptContent = `
      #!/bin/sh
      ulimit -t 10
      ulimit -u 40
    `;

    switch (language) {
      case "java": {
        const className = "Main";
        const javaFilePath = path.join(tempDir, `${className}.java`);

        await execShellCommand(
          `echo '${code}' | sudo -u ${execId} tee ${javaFilePath}`
        );

        scriptContent += `
          javac ${javaFilePath}
          java -cp ${tempDir} ${className}
        `;
        break;
      }

      case "cpp": {
        const cppFilePath = path.join(tempDir, "program.cpp");
        const executableFile = path.join(tempDir, "program");

        await execShellCommand(
          `echo '${code}' | sudo -u ${execId} tee ${cppFilePath}`
        );

        scriptContent += `
          g++ -o ${executableFile} ${cppFilePath}
          ${executableFile}
        `;
        break;
      }

      case "javascript": {
        const jsFilePath = path.join(tempDir, "script.js");

        await execShellCommand(
          `echo '${code}' | sudo -u ${execId} tee ${jsFilePath}`
        );
        scriptContent += `
          node ${jsFilePath}
        `;
        break;
      }

      case "python3": {
        const pyFilePath = path.join(tempDir, "script.py");

        await execShellCommand(
          `echo '${code}' | sudo -u ${execId} tee ${pyFilePath}`
        );
        scriptContent += `
          python3 ${pyFilePath}
        `;
        break;
      }

      default:
        throw new Error("Unsupported language");
    }

    const scriptPath = path.join(tempDir, "execute.sh");
    await execShellCommand(
      `echo '${scriptContent}' | sudo -u ${execId} tee ${scriptPath}`
    );
    await execShellCommand(`sudo -u ${execId} chmod +x ${scriptPath}`);

    const pgidCommand = `sudo setsid sh -c 'echo $$ > ${tempDir}/pgid && sudo -u ${execId} sh ${scriptPath}'`;

    const output = await execShellCommand(pgidCommand);

    const pgidString = await execShellCommand(`cat ${tempDir}/pgid`);
    pgid = parseInt(pgidString.trim(), 10);
    console.log("pgid ", pgid);

    res.json({ output });
  } catch (error) {
    console.error(error);

    if (pgid) {
      await killProcessGroup(pgid);
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: errorMessage });
  } finally {
    try {
      await deleteUser(execId);
    } catch (cleanupError) {
      const cleanupErrorMessage = cleanupError instanceof Error ? cleanupError.message : String(cleanupError);
      console.error(`Cleanup error: ${cleanupErrorMessage}`);
    }
  }
});

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));