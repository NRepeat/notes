import type { LucideProps } from "lucide-react";
import type React from "react";

export abstract class Component {
  protected parent!: Component | null;
  public name!: string;
  public setParent(parent: Component | null): void {
    this.parent = parent;
  }
  public getName(): string {
    return this.name;
  }
  public getParent(): Component | null {
    return this.parent;
  }

  public add(component: Component): void {}

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
  onClick?: () => void;
  isDisabled?: boolean;
  isExternal?: boolean;
  isHidden?: boolean;
};

export type SideBarData = SideBarItem[];
