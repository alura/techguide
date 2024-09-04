declare const observableSymbol: symbol;
export default observableSymbol;

declare global {
  export interface SymbolConstructor {
    readonly observable: symbol;
  }
}
