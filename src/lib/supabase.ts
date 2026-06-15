import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let isOffline = false;
let realSupabase: any = null;

// Initialize Supabase client if credentials exist and appear valid
if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  try {
    realSupabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Failed to initialize real Supabase client, using local mock.', err);
    isOffline = true;
  }
} else {
  console.warn('Supabase credentials missing or invalid. Defaulting to local offline database.');
  isOffline = true;
}

// Helpers for reading/writing local JSON files as mock tables
function getFilePath(tableName: string) {
  return path.join(process.cwd(), 'src', 'data', `${tableName}.json`);
}

function readLocalTable(tableName: string): any[] {
  const filePath = getFilePath(tableName);
  if (!fs.existsSync(filePath)) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
    return [];
  }
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading mock file for table ${tableName}:`, err);
    return [];
  }
}

function writeLocalTable(tableName: string, data: any[]) {
  const filePath = getFilePath(tableName);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Local mock database query builder replicating Supabase API
class LocalQueryBuilder {
  private tableName: string;
  private filters: Array<(item: any) => boolean> = [];
  private sortFn: ((a: any, b: any) => number) | null = null;
  private isSingle = false;
  private mutationType: 'insert' | 'update' | 'delete' | null = null;
  private mutationData: any = null;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(columns: string = '*') {
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push((item) => {
      const val = item[column];
      // Compare as strings or exact types
      return val === value || String(val) === String(value);
    });
    return this;
  }

  gte(column: string, value: any) {
    this.filters.push((item) => {
      const val = item[column];
      return val !== undefined && val >= value;
    });
    return this;
  }

  lte(column: string, value: any) {
    this.filters.push((item) => {
      const val = item[column];
      return val !== undefined && val <= value;
    });
    return this;
  }

  ilike(column: string, pattern: string) {
    const cleanPattern = pattern.replace(/%/g, '').toLowerCase();
    this.filters.push((item) => {
      const val = item[column];
      if (typeof val === 'string') {
        return val.toLowerCase().includes(cleanPattern);
      }
      return false;
    });
    return this;
  }

  order(column: string, { ascending = true } = {}) {
    this.sortFn = (a, b) => {
      const valA = a[column];
      const valB = b[column];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return ascending ? valA - valB : valB - valA;
      }
      const dateA = new Date(valA).getTime();
      const dateB = new Date(valB).getTime();
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return ascending ? dateA - dateB : dateB - dateA;
      }
      return 0;
    };
    return this;
  }

  insert(data: any) {
    this.mutationType = 'insert';
    this.mutationData = data;
    return this;
  }

  update(data: any) {
    this.mutationType = 'update';
    this.mutationData = data;
    return this;
  }

  delete() {
    this.mutationType = 'delete';
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      const result = await this.execute();
      if (onfulfilled) {
        return onfulfilled(result);
      }
      return result;
    } catch (err) {
      if (onrejected) {
        return onrejected(err);
      }
      throw err;
    }
  }

  private async execute() {
    try {
      let dataList = readLocalTable(this.tableName);

      if (this.mutationType === 'insert') {
        const toInsert = Array.isArray(this.mutationData) ? this.mutationData : [this.mutationData];
        const insertedItems: any[] = [];
        
        for (const item of toInsert) {
          let newId: any;
          if (this.tableName === 'products') {
            const maxId = dataList.reduce((max, p) => (p.id && typeof p.id === 'number' ? Math.max(max, p.id) : max), 0);
            newId = maxId + 1;
          } else {
            newId = String(Date.now() + Math.floor(Math.random() * 1000));
          }
          
          const newItem = {
            id: newId,
            created_at: new Date().toISOString(),
            ...item,
          };
          dataList.push(newItem);
          insertedItems.push(newItem);
        }
        
        writeLocalTable(this.tableName, dataList);
        
        const returnData = this.isSingle ? insertedItems[0] : (Array.isArray(this.mutationData) ? insertedItems : insertedItems[0]);
        return { data: returnData, error: null };
      }

      if (this.mutationType === 'update') {
        let updatedCount = 0;
        let lastUpdatedItem: any = null;
        const updatedList = dataList.map((item) => {
          const matches = this.filters.every((fn) => fn(item));
          if (matches) {
            const updatedItem = { ...item, ...this.mutationData };
            updatedCount++;
            lastUpdatedItem = updatedItem;
            return updatedItem;
          }
          return item;
        });

        if (updatedCount > 0) {
          writeLocalTable(this.tableName, updatedList);
        }

        return { data: this.isSingle ? lastUpdatedItem : lastUpdatedItem, error: null };
      }

      if (this.mutationType === 'delete') {
        const deletedItems: any[] = [];
        const remainingList = dataList.filter((item) => {
          const matches = this.filters.every((fn) => fn(item));
          if (matches) {
            deletedItems.push(item);
            return false;
          }
          return true;
        });

        if (deletedItems.length > 0) {
          writeLocalTable(this.tableName, remainingList);
        }

        const returnData = this.isSingle ? deletedItems[0] : deletedItems;
        return { data: returnData, error: null };
      }

      // Query (GET)
      let filtered = dataList.filter((item) => this.filters.every((fn) => fn(item)));

      if (this.sortFn) {
        filtered.sort(this.sortFn);
      }

      if (this.isSingle) {
        return { data: filtered[0] || null, error: filtered[0] ? null : { message: 'Not found', code: 'PGRST116' } };
      }

      return { data: filtered, error: null };
    } catch (err: any) {
      console.error(`Mock database error on table ${this.tableName}:`, err);
      return { data: null, error: { message: err.message || 'Mock database error', details: err } };
    }
  }
}

// Export the supabase client wrapped in a hybrid query proxy
export const supabase = {
  from(tableName: string) {
    if (isOffline || !realSupabase) {
      return new LocalQueryBuilder(tableName);
    }
    
    const calls: Array<{ prop: string; args: any[] }> = [];
    
    const builderProxy: any = new Proxy({}, {
      get(target, prop: string) {
        if (prop === 'then') {
          return async function(onfulfilled?: any, onrejected?: any) {
            try {
              if (isOffline) {
                throw new Error('Supabase is offline (cached)');
              }
              
              let realQuery = realSupabase.from(tableName) as any;
              for (const call of calls) {
                if (typeof realQuery[call.prop] === 'function') {
                  realQuery = realQuery[call.prop](...call.args);
                }
              }
              
              const result = await realQuery;
              if (result.error && (result.error.message?.includes('fetch failed') || result.error.code === 'ENOTFOUND' || result.error.message?.includes('getaddrinfo'))) {
                throw result.error;
              }
              return onfulfilled ? onfulfilled(result) : result;
            } catch (err: any) {
              console.warn(`Supabase query failed, falling back to local files database. Error: ${err.message || err}`);
              isOffline = true;
              
              let localQuery = new LocalQueryBuilder(tableName) as any;
              for (const call of calls) {
                if (typeof localQuery[call.prop] === 'function') {
                  localQuery = localQuery[call.prop](...call.args);
                }
              }
              
              const result = await localQuery;
              return onfulfilled ? onfulfilled(result) : result;
            }
          };
        }
        
        return function(...args: any[]) {
          calls.push({ prop, args });
          return builderProxy;
        };
      }
    });
    
    return builderProxy;
  }
};
