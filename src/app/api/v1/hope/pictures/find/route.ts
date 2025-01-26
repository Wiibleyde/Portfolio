import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path"; // Import path module

const rootFolder = "./public/hope_pictures";
let cache: { [key: string]: { folders: string[], files: string[] } } = {};
let cacheTimestamp: { [key: string]: number } = {};
const cacheDuration = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest): Promise<NextResponse> {
    const rawPath = request.nextUrl.searchParams.get("path") as string;
    const sanitizedPath = path.normalize(rawPath).replace(/^(\.\.(\/|\\|$))+/, '');
    const folderPath = path.join(rootFolder, sanitizedPath);

    const now = Date.now();
    if (!cache[folderPath] || now - cacheTimestamp[folderPath] > cacheDuration) {
        const files = await fs.promises.readdir(folderPath, { withFileTypes: true });
        const folders = files
            .filter((file) => file.isDirectory() && !file.name.startsWith('.'))
            .map((file) => file.name);
        const fileNames = files
            .filter((file) => file.isFile() && !file.name.startsWith('.'))
            .map((file) => file.name);

        cache[folderPath] = { folders, files: fileNames };
        cacheTimestamp[folderPath] = now;
    }

    console.log(`Serving ${folderPath}`);
    return NextResponse.json(cache[folderPath]);
}
