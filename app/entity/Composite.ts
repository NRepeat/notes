import { Component } from "~/types";
import { Leaf } from "./Leaf";

export class Composite extends Component {
  public new = false;
  protected children: Component[] = [];
  public name: string;
  public isFolder = true;
  constructor(name?: string, newCategory?: boolean) {
    super();
    this.new = newCategory || false;
    this.name = name || "";
  }
  public operation(): string {
    throw new Error("Method not implemented.");
  }
  public add(component: Component): void {
    this.children.push(component);
    component.setParent(this);
  }

  public remove(component: Component): boolean {
    const index = this.children.indexOf(component);
    if (index !== -1) {
      this.children.splice(index, 1);
      component.setParent(null);
      return true;
    }
    for (const child of this.children) {
      if (child instanceof Composite) {
        if (child.remove(component)) {
          return true;
        }
      }
    }
    return false;
  }

  public updateChildren(component: Component, newComponent: Component): void {
    const componentIndex = this.children.indexOf(component);
    if (componentIndex !== -1) {
      newComponent.setParent(this);
      this.children[componentIndex] = newComponent;
      component.setParent(null);
    } else {
      for (const child of this.children) {
        if (child instanceof Composite) {
          child.updateChildren(component, newComponent);
        }
      }
    }
  }

  public getChildren(): Component[] {
    return this.children;
  }

  public isComposite(): boolean {
    return true;
  }

  public updateName(name: string): void {
    this.name = name;
  }

  public setNew(newValue: boolean): void {
    this.new = newValue;
  }

  // public operation(): string {
  //   const results = [];
  //   for (const child of this.children) {
  //     results.push(child.operation());
  //   }
  //   return `Branch(${this.name}_${results.join("+")})`;
  // }

  // Add the toJSON method to handle serialization
  public toJSON(): any {
    return {
      type: "Composite",
      name: this.name,
      children: this.children,
    };
  }
  public find(name: string): Component | null {
    if (name === this.name) {
      return this;
    }
    for (const child of this.children) {
      if (child instanceof Leaf && child.getName() === name) {
        return child;
      }
      if (child instanceof Composite) {
        const found = child.find(name);
        if (found) return found;
      }
    }
    return null;
  }
}
