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
  str: number;
  int: number;
  con: number;
  per: number;
}

export interface HabiticaUserInfoResponse extends BaseHabiticaResponse<HabiticaUserInfo> {}

export interface HabiticaUserInfo {
  items: {
    gear: {
      owned: { [key: string]: boolean };
    };
  };
}
