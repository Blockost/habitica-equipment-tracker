import { CachedItem } from "./cache.model";
import { VariableStorage } from "../util/variableStorage";

const variableStorage = new VariableStorage();

export function Cacheable(cacheName?: string, variable = false): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const key = cacheName ?? propertyKey.toString();
    const originalMethod = descriptor.value as (...args: any[]) => Promise<any>;

    descriptor.value = async function (...args: any[]) {
      console.debug("Looking into local storage for cached data");
      const cached = getStorageProvider(variable).getItem(key);

      if (cached != null) {
        console.debug("Cached data found");
        const cachedRes = JSON.parse(cached) as CachedItem<any>;

        console.debug("Checking for expiry (is data still valid ?)");
        const expiryDate = cachedRes.timestamp + cachedRes.expiry * 1000;

        // TODO: Handle different timezone ?
        if (expiryDate >= Date.now()) {
          console.debug("Cached data is valid. Returning");
          return cachedRes.data;
        } else {
          console.debug("Cached data has expired");
        }
      } else {
        console.debug("Cached data not found in local storage.");
      }

      console.debug("Fetching fresh data from Habitica");
      const res = await originalMethod.apply(this, args);

      console.debug("Caching fresh data in local storage");
      const toCache: CachedItem<any> = {
        timestamp: Date.now(),
        expiry: 3600,
        data: res,
      };
      getStorageProvider(variable).setItem(key, JSON.stringify(toCache));

      return res;
    };
  };
}

function getStorageProvider(session: boolean): Storage {
  return session ? variableStorage : localStorage;
}
