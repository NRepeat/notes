import { Component } from "~/types";

export class Leaf extends Component {
  public name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }

  public operation(): string {
    return this.name;
  }

  public toJSON(): any {
    return {
      type: "Leaf",
      name: this.name,
    };
  }
}
