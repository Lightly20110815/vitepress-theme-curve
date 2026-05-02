import { generateId } from "./commonTools.mjs";
import { globby } from "globby";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import fs from "fs-extra";

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

const getNoteMDFilePaths = async () => {
  try {
    let paths = await globby(["**.md"], {
      ignore: ["node_modules", "pages", ".vitepress", "README.md"],
    });
    return paths.filter((item) => item.includes("notes/"));
  } catch (error) {
    console.error("获取随笔路径时出错:", error);
    throw error;
  }
};

const compareDate = (obj1, obj2) => {
  return obj1.date < obj2.date ? 1 : -1;
};

const compareNotePriority = (a, b) => {
  if (a.top && !b.top) return -1;
  if (!a.top && b.top) return 1;
  return compareDate(a, b);
};

export const getAllNotes = async () => {
  try {
    let paths = await getNoteMDFilePaths();
    let notes = await Promise.all(
      paths.map(async (item) => {
        try {
          const raw = await fs.readFile(item, "utf-8");
          const stat = await fs.stat(item);
          const { birthtimeMs, mtimeMs } = stat;
          const { data, content } = matter(raw);
          const { title, date, tags, top, cover, mood } = data;
          const noteDate = date ? new Date(date) : new Date(birthtimeMs);
          const validDate = !Number.isNaN(noteDate.getTime()) ? noteDate : new Date();
          const html = md.render(content.trim());
          return {
            id: generateId(item),
            title: title || null,
            date: validDate.getTime(),
            lastModified: mtimeMs,
            tags: Array.isArray(tags) ? tags : (typeof tags === "string" ? tags.split(",").map(t => t.trim()).filter(Boolean) : []),
            html,
            top,
            cover,
            mood: mood || null,
          };
        } catch (error) {
          console.error(`处理随笔文件 '${item}' 时出错:`, error);
          throw error;
        }
      }),
    );
    notes.sort(compareNotePriority);
    return notes;
  } catch (error) {
    console.error("获取所有随笔时出错:", error);
    throw error;
  }
};

export const getNoteTags = (noteData) => {
  const tagData = {};
  noteData.forEach((item) => {
    if (!item.tags || item.tags.length === 0) return;
    item.tags.forEach((tag) => {
      if (!tagData[tag]) {
        tagData[tag] = { count: 1, articles: [item] };
      } else {
        tagData[tag].count++;
        tagData[tag].articles.push(item);
      }
    });
  });
  return tagData;
};
