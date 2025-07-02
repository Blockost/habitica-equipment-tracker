export interface BaseHabiticaResponse<T> {
  success: boolean;
  data: T;
}

export interface HabiticaAllContentResponse extends BaseHabiticaResponse<HabiticaAllContentData> {}

export interface HabiticaAllContentData {
  gear: {
    flat: {
      [key: string]: HabiticaGear;
    };
  };
}

export interface HabiticaGear {
  /**
   * Unique key/id
   */
  key: string;
  /**
   * Item name.
   */
  text: string;
  /**
   * Item description.
   */
  notes: string;
  /**
   * Item class
   */
  klass: string;
  /**
   * Set that this item is part of. If an item is not part of any set, this property will still
   * have a value in the form of [klass]-[key].
   */
  set: string;
  /**
   * Type of equipment.
   */
  type: string;
  /**
   * Whether this item must be held in both hands. Only applies to weapon.
   */
  twoHanded?: boolean;
  str: number;
  int: number;
  con: number;
  per: number;
}

export interface HabiticaUserInfoResponse extends BaseHabiticaResponse<HabiticaUserInfo> {}

export interface HabiticaUserInfo {
  auth: {
    local: {
      username: string;
    };
  };
  items: HabiticaUserItemsInfo;
  preferences: HabiticaUserPreferences;
}

export interface EquipmentSetInfo {
  weapon: string;
  armor: string;
  head: string;
  shield: string;
  back: string;
  headAccessory: string;
  eyewear: string;
  body: string;
}

export interface HabiticaUserItemsInfo {
  gear: {
    equipped: EquipmentSetInfo;
    costume: EquipmentSetInfo;
    owned: { [key: string]: boolean };
  };
}

export interface HabiticaUserPreferences {
  size: string;
  skin: string;
  shirt: string;
  costume: boolean;
  background: string;
  hair: {
    color: string;
    base: number;
    bangs: number;
    beard: number;
    mustache: number;
    flower: number;
  };
}

export interface HabiticaEquipItemResponse extends BaseHabiticaResponse<HabiticaUserItemsInfo> {
  message?: string; // Only when unequipping an item
}
