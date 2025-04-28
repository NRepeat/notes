import { Component } from "~/types";
import { Leaf } from "./Leaf";

export class Composite extends Component {
  protected children: Component[] = [];
  public name: string;
  constructor(name?: string) {
    super();

    this.name = name || "index";
  }
  public add(component: Component): void {
    this.children.push(component);
    component.setParent(this);
  }

  public remove(component: Component): void {
    const componentIndex = this.children.indexOf(component);
    this.children.splice(componentIndex, 1);

    component.setParent(null);
  }
  public getChildren(): Component[] {
    return this.children;
  }
  public isComposite(): boolean {
    return true;
  }

  public operation(): string {
    const results = [];
    for (const child of this.children) {
      results.push(child.operation());
    }
    return `Branch(${this.name}_${results.join("+")})`;
  }

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
      if (child instanceof Leaf && (child as Leaf).getName() === name) {
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
