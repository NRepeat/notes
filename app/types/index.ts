import type { LucideProps } from "lucide-react";
import type React from "react";

export abstract class Component {
  protected parent!: Component | null;
  public value!: string | null;
  public name!: string;
  public new!: boolean;
  public tags: { name: string; color: string }[] = [];
  public setParent(parent: Component | null): void {
    this.parent = parent;
  }
  public setNew(newValue: boolean): void {
    this.new = newValue;
  }
  public getName(): string {
    return this.name;
  }
  public getParent(): Component | null {
    return this.parent;
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
  public add(component: Component): void {}
  public updateChildren(component: Component, newComponent: Component): void {}
  public updateName(name: string): void {
    this.name = name;
  }
  public updateValue(value: string): void {
    this.value = value;
  }
  public remove(component: Component): void {}
  public getChildren(): Component[] {
    return [];
  }
  public find(name: string): Component | null {
    return null;
  }
  public isComposite(): boolean {
    return false;
  }

  // Abstract operation method
  public abstract operation(): string;

  public abstract toJSON(): any;
}

export type SideBarItem = {
  title: string;
  isActive: boolean;
  icon:
    | React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
      >
    | string
    | null;
  url?: string;
  items?: SideBarItem[];
  isFolder?: boolean;
  onClick?: () => void;
  isDisabled?: boolean;
  isNew?: boolean;
  isExternal?: boolean;
  isHidden?: boolean;
};

export type SideBarData = SideBarItem[];
