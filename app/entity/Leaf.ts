import { Component } from "~/types";

export class Leaf extends Component {
  public name: string;
  public value: string | null = null;
  public tags: string[] = [];

  constructor(name: string, value?: string, tags?: string[]) {
    super();
    this.name = name;
    this.value = value || "";
    this.tags = tags ?? [];
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
  public setTags(tags: string[]): void {
    this.tags = Array.isArray(tags) ? tags : [];
  }
  public addTag(tag: string): void {
    if (!this.tags.includes(tag)) this.tags.push(tag);
  }
  public removeTag(tag: string): void {
    this.tags = this.tags.filter((t) => t !== tag);
  }
  public getTags(): string[] {
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
