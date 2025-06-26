/**
 * Implements storage using a simple Map as a way to save data until next page reload.
 */
export class VariableStorage implements Storage {
  private readonly map: Map<string, string> = new Map();

  [name: string]: any;

  get length(): number {
    return this.map.size;
  }

  clear(): void {
    this.map.clear();
  }

  getItem(key: string): string | null {
    const value = this.map.get(key);
    if (value) {
      return value;
    }

    return null;
  }

  key(index: number): string | null {
    return null;
  }

  removeItem(key: string): void {
    this.map.delete(key);
  }

  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
}
