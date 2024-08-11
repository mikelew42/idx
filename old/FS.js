// const fs = require('fs/promises');
// const path = require('path');

import fs from "fs/promises";
import path from "path";

class File {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async read() {
    return await fs.readFile(this.filePath, 'utf8');
  }

  async write(data) {
    await fs.writeFile(this.filePath, data);
  }

  async append(data) {
    await fs.appendFile(this.filePath, data);
  }

  async delete() {
    await fs.unlink(this.filePath);
  }

  async exists() {
    try {
      await fs.access(this.filePath);
      return true;
    } catch (err) {
      return false;
    }
  }

  async copy(destination) {
    await fs.copyFile(this.filePath, destination);
  }

  async move(destination) {
    await fs.rename(this.filePath, destination);
    this.filePath = destination;
  }
}

class Directory {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }

  async create() {
    // await fs.mkdir(this.dirPath, { recursive: true });
    await fs.mkdir(this.dirPath);
  }

  async delete() {
    // await fs.rm(this.dirPath, { recursive: true, force: true });
    await fs.rm(this.dirPath);
  }

  async list() {
    return await fs.readdir(this.dirPath);
  }

  async exists() {
    try {
      await fs.access(this.dirPath);
      return true;
    } catch (err) {
      return false;
    }
  }
}

export { File, Directory };