export interface HabiticaAllContentResponse {
  success: boolean;
  data: HabiticaAllContentData;
}

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
  str: number;
  int: number;
  con: number;
  per: number;
}
