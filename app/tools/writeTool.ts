import { writeFile } from "node:fs/promises";

const write = async (file_path : string, content : string) => {
    try {
        await writeFile(file_path, content);
    } catch (error) {
        console.log("Exception occured during file writing", error);
    }
}

export { write };