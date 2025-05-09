import { Component } from "~/types";

export class Leaf extends Component {
  public name: string;
  public value: string| null =null
  constructor(name: string,value?:string) {
    super();
    this.name = name;
    this.value = value || ''
  }
  public updateName(name: string): void {
    this.name = name
  }
  public updateValue(value: string): void {
    this.value  = value
  }
  public getValue(): string | null {
    return this.value
  }
  public operation(): string {
    return this.name;
  }

  public toJSON(): any {
    return {
      type: "Leaf",
      name: this.name,
      value:this.value
    };
  }
}
