import { readFile } from "fs/promises";
import type { toolFunction } from "../../interfaces";

const read = async (file_path: string) => {
    try {
        const content = await readFile(file_path, "utf-8");
        return content;
    } catch (error) {
        console.log("Exception occured during file reading", error);
    }
}

const getFilePath = (toolFunction : toolFunction) => {
    const argumentsString = toolFunction.arguments;
    const functionArgs = JSON.parse(argumentsString);
    return functionArgs?.file_path;
}

export {read, getFilePath};
