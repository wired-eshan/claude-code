import type { toolCall } from "../../interfaces";
import { bash, getCommand } from "./bashTool";
import { read, getFilePath } from "./readTool";
import { write } from "./writeTool";

type ToolName = "Read" | "Write" | "Bash";

interface ToolHandler {
  (toolCall: toolCall): Promise<string | void>;
}

const toolHandlers: Record<ToolName, ToolHandler> = {
  Read: async (toolCall: toolCall) => {
    const filePath = getFilePath(toolCall.function);
    return await read(filePath);
  },
  Write: async (toolCall: toolCall) => {
    const { file_path, content } = JSON.parse(toolCall.function.arguments);
    await write(file_path, content);
    return `File written successfully to ${file_path}`;
  },
  Bash: async (toolCall : toolCall) => {
    const command = getCommand(toolCall.function);
    return bash(command);
  }
};

async function executeTool(toolCall: toolCall): Promise<string | void> {
  const toolName = toolCall.function.name as ToolName;
  
  if (!toolHandlers[toolName]) {
    throw new Error(`Unknown tool: ${toolName}`);
  }

  return await toolHandlers[toolName](toolCall);
}

export { executeTool };
