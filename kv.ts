// this is retarded but i couldnt find where local deno kv saves to
// yes ik it uses sqlite for local
// if only deno deploy supported discord.js :(
// todo: replace this with an actual kv db thats easily self deployable i guess?

class FileKv {
  #path: string;
  #store: Record<string, unknown> = {};

  constructor(filename = "mfyu.db.json") {
    this.#path = `${Deno.cwd()}/${filename}`;
  }

  async #load() {
    try {
      const text = await Deno.readTextFile(this.#path);
      this.#store = JSON.parse(text);
    } catch {
      this.#store = {};
    }
  }

  async #save() {
    await Deno.writeTextFile(this.#path, JSON.stringify(this.#store, null, 2));
  }

  async init() {
    await this.#load();
  }

  async get<T = unknown>(key: string[]): Promise<{ value: T | null }> {
    if (!Object.keys(this.#store).length) await this.#load();
    const k = key.join(":");
    return { value: (this.#store[k] as T) ?? null };
  }

  async set(key: string[], value: unknown): Promise<void> {
    if (!Object.keys(this.#store).length) await this.#load();
    const k = key.join(":");
    this.#store[k] = value;
    await this.#save();
  }

  async delete(key: string[]): Promise<void> {
    if (!Object.keys(this.#store).length) await this.#load();
    const k = key.join(":");
    delete this.#store[k];
    await this.#save();
  }

  async list(prefix: string[] = []): Promise<[string[], unknown][]> {
    if (!Object.keys(this.#store).length) await this.#load();
    const p = prefix.join(":");
    return Object.entries(this.#store)
      .filter(([k]) => k.startsWith(p))
      .map(([k, v]) => [k.split(":"), v]);
  }
}

const KV = new FileKv();
await KV.init();
export { KV };
