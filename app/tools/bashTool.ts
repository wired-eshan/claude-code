import { execSync } from "child_process";
import type { toolFunction } from "../../interfaces";

const bash = (command : string) => {
    return execSync(command, {encoding: "utf-8"});
};

const getCommand = (toolFunction : toolFunction) => {
    const functionArgument = JSON.parse(toolFunction.arguments);
    return functionArgument?.command;
}

export { bash, getCommand };
