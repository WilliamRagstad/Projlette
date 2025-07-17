import { Optional } from "@knight/knight"; // "https://deno.land/x/knight@2.3.0/mod.ts";

export class Solution {
  githubUrl: string;
  language: string;
  author: string;
  @Optional()
  createdDate?: Date;

  constructor(
    githubUrl: string,
    language: string,
    author: string,
    createdDate?: Date,
  ) {
    this.githubUrl = githubUrl;
    this.language = language;
    this.author = author;
    this.createdDate = createdDate;
  }
}

export type Solutions = {
  [problemId: string]: Solution[];
};
