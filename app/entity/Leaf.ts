import { Component } from "~/types";

export class Leaf extends Component {
  public name: string;
  public value: string | null = null;
  public tags: { name: string; color: string }[] = [];
  constructor(name: string, value?: string, tags?: any[]) {
    super();
    this.name = name;
    this.value = value || "";
    if (Array.isArray(tags)) {
      this.tags = tags.map((tag) =>
        typeof tag === "string" ? { name: tag, color: "default" } : tag
      );
    } else {
      this.tags = [];
    }
  }
  public updateName(name: string): void {
    this.name = name;
  }
  public updateValue(value: string): void {
    this.value = value;
  }
  public getValue(): string | null {
    return this.value;
  }
  public setTags(tags: { name: string; color: string }[]): void {
    this.tags = Array.isArray(tags) ? tags : [];
  }
  public addTag(tag: { name: string; color: string }): void {
    if (!this.tags.some((t) => t.name === tag.name)) {
      this.tags.push(tag);
    }
  }
  public removeTag(tag: { name: string; color: string }): void {
    this.tags = this.tags.filter((t) => t.name !== tag.name);
  }
  public getTags(): { name: string; color: string }[] {
    return Array.isArray(this.tags) ? this.tags : [];
  }
  public operation(): string {
    return this.name;
  }
  public isComposite(): boolean {
    return false;
  }
  public getParent(): Component | null {
    return this.parent;
  }
  public toJSON(): any {
    return {
      type: "Leaf",
      name: this.name,
      value: this.value,
      tags: this.tags,
    };
  }
}
