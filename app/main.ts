import OpenAI from "openai";
import type { toolCall } from "../interfaces";
import { executeTool } from "./tools/toolFactory";
import type { ChatCompletionMessageParam } from "openai/resources";

async function main() {
  const [, , flag, prompt] = process.argv;
  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseURL =
    process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1";

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }
  if (flag !== "-p" || !prompt) {
    throw new Error("error: -p flag is required");
  }

  const client = new OpenAI({
    apiKey: apiKey,
    baseURL: baseURL,
  });

  const conversation : ChatCompletionMessageParam[]  = [{ role: "user", content: prompt }]
  let response;
  do {
    response = await client.chat.completions.create({
    model: "anthropic/claude-haiku-4.5",
    messages: conversation,
    tools: [{
      "type": "function",
      "function": {
        "name": "Read",
        "description": "Read and return the contents of a file",
        "parameters": {
          "type": "object",
          "properties": {
            "file_path": {
              "type": "string",
              "description": "The path to the file to read"
            }
          },
          "required": ["file_path"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "Write",
        "description": "Write content to a file",
        "parameters": {
          "type": "object",
          "required": ["file_path", "content"],
          "properties": {
            "file_path": {
              "type": "string",
              "description": "The path of the file to write to"
            },
            "content": {
              "type": "string",
              "description": "The content to write to the file"
            }
          }
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "Bash",
        "description": "Execute a shell command",
        "parameters": {
          "type": "object",
          "required": ["command"],
          "properties": {
            "command": {
              "type": "string",
              "description": "The command to execute"
            }
          }
        }
      }
    }],
    });

    conversation.push(response.choices[0].message);

  if(response.choices && response.choices[0].message.tool_calls) {
    for (const toolCall of response.choices[0].message.tool_calls as unknown as toolCall[]) {
      const result = await executeTool(toolCall);
      conversation.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: result || ""
      } as any);
    }
  } else {
    break;
  }
  } while(true);

  console.log(response.choices[0].message.content);
}

main();
